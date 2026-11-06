import type Stripe from 'stripe'

import { eq } from 'drizzle-orm'
import { GraphQLError } from 'graphql'

import type { BillingStatus } from '@/graphql/schema'
import type { SubscriptionRecord } from '@/models'
import type { UserService } from '@/services'

import { SubscriptionStatus } from '@/graphql/schema'
import { db } from '@/libs/DB'
import { Env } from '@/libs/Env'
import { logger } from '@/libs/Logger'
import { getStripe } from '@/libs/Stripe'
import { schemas } from '@/models'
import { getBaseUrl } from '@/utils/Env'

// How long a failed renewal keeps access while Stripe retries the card
const PAST_DUE_GRACE_MS = 3 * 24 * 60 * 60 * 1000

type AccessInput = Pick<SubscriptionRecord, 'status' | 'currentPeriodEnd'>

// The single access rule. Every paid feature goes through this, never through Stripe directly.
export const hasPaidAccess = (
  subscription: AccessInput | null | undefined,
  now: Date = new Date()
): boolean => {
  if (!subscription) return false
  if (
    subscription.status === SubscriptionStatus.Active ||
    subscription.status === SubscriptionStatus.Trialing
  ) {
    return true
  }
  if (subscription.status !== SubscriptionStatus.PastDue) return false
  if (!subscription.currentPeriodEnd) return false
  return (
    now.getTime() < subscription.currentPeriodEnd.getTime() + PAST_DUE_GRACE_MS
  )
}

// Stripe's status type is open ended, so narrow it to the statuses we store instead of casting
const toSubscriptionStatus = (status: string): SubscriptionStatus | undefined =>
  Object.values(SubscriptionStatus).find((value) => value === status)

const badRequest = (message: string, code: string): GraphQLError =>
  new GraphQLError(message, { extensions: { code } })

export class BillingService {
  constructor(private userService: UserService) {}

  private async findSubscription(
    userId: string
  ): Promise<SubscriptionRecord | undefined> {
    return db.query.subscriptions.findFirst({
      where: eq(schemas.subscriptions.userId, userId),
    })
  }

  async getBillingStatus(): Promise<BillingStatus> {
    const user = await this.userService.getCurrentUserWithAuth()
    const subscription = await this.findSubscription(user.id)

    return {
      hasPaidAccess: hasPaidAccess(subscription),
      status: subscription?.status,
      currentPeriodEnd: subscription?.currentPeriodEnd?.toISOString(),
      cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd ?? false,
    }
  }

  // Resolvers for paid features call this first. The UI turns the typed error into an upgrade prompt.
  async requirePaidAccess(): Promise<void> {
    const user = await this.userService.getCurrentUserWithAuth()
    const subscription = await this.findSubscription(user.id)
    if (hasPaidAccess(subscription)) return

    throw badRequest('A subscription is required', 'SUBSCRIPTION_REQUIRED')
  }

  async createCheckoutSession(): Promise<{ url: string }> {
    if (!Env.STRIPE_PRICE_ID) {
      throw new Error('STRIPE_PRICE_ID is not configured')
    }

    const user = await this.userService.getCurrentUserWithAuth()
    const existing = await this.findSubscription(user.id)
    if (hasPaidAccess(existing)) {
      throw badRequest('Already subscribed', 'ALREADY_SUBSCRIBED')
    }

    const baseUrl = getBaseUrl()
    const session = await getStripe().checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: Env.STRIPE_PRICE_ID, quantity: 1 }],
      // Reuse the Stripe customer on a resubscribe instead of creating a duplicate
      ...(existing
        ? { customer: existing.stripeCustomerId }
        : { customer_email: user.email }),
      client_reference_id: user.id,
      // The webhook reads userId from the subscription to know whose row to write
      subscription_data: { metadata: { userId: user.id } },
      success_url: `${baseUrl}/billing?checkout=success`,
      cancel_url: `${baseUrl}/billing?checkout=cancelled`,
    })

    if (!session.url) {
      logger.error('Stripe checkout session has no url', {
        sessionId: session.id,
      })
      throw new Error('Failed to create checkout session')
    }
    return { url: session.url }
  }

  async createPortalSession(): Promise<{ url: string }> {
    const user = await this.userService.getCurrentUserWithAuth()
    const subscription = await this.findSubscription(user.id)
    if (!subscription) {
      throw badRequest('No subscription to manage', 'NO_SUBSCRIPTION')
    }

    const session = await getStripe().billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${getBaseUrl()}/billing`,
    })
    return { url: session.url }
  }

  // Webhook entry point. Each handler reads the subscription's current state from Stripe and
  // upserts it, so a redelivered or out-of-order event converges on the same row.
  async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        if (session.mode !== 'subscription' || !session.subscription) return
        const id =
          typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription.id
        await this.syncSubscription(id, session.client_reference_id)
        return
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await this.syncSubscription(event.data.object.id)
        return
      default:
        // Add cases here as you need them, for example invoice.payment_failed to send an email
        logger.info('Ignoring Stripe event', { type: event.type })
    }
  }

  private async syncSubscription(
    stripeSubscriptionId: string,
    fallbackUserId?: string | null
  ): Promise<void> {
    const subscription =
      await getStripe().subscriptions.retrieve(stripeSubscriptionId)
    const customerId =
      typeof subscription.customer === 'string'
        ? subscription.customer
        : subscription.customer.id

    const userId =
      subscription.metadata.userId ??
      fallbackUserId ??
      (
        await db.query.subscriptions.findFirst({
          where: eq(schemas.subscriptions.stripeCustomerId, customerId),
        })
      )?.userId
    if (!userId) {
      logger.warn('Stripe subscription has no matching user', {
        subscriptionId: subscription.id,
      })
      return
    }

    const status = toSubscriptionStatus(subscription.status)
    if (!status) {
      logger.warn('Stripe subscription has an unknown status', {
        subscriptionId: subscription.id,
        status: subscription.status,
      })
      return
    }

    // Stripe keeps the period on the items since API 2025-03-31
    const periodEnd = subscription.items.data[0]?.current_period_end
    const values = {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      status,
      currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    }

    await db
      .insert(schemas.subscriptions)
      .values({ userId, ...values })
      .onConflictDoUpdate({
        target: schemas.subscriptions.userId,
        set: { ...values, updatedAt: new Date() },
      })
    logger.info('Subscription synced', { userId, status })
  }
}
