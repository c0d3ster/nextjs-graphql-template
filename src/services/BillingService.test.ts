import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SubscriptionStatus } from '@/graphql/schema'
import { db } from '@/libs/DB'
import { getStripe } from '@/libs/Stripe'

import { BillingService, hasPaidAccess } from './BillingService'

vi.mock('@/libs/Stripe', () => ({ getStripe: vi.fn() }))
vi.mock('@/libs/Env', () => ({
  Env: { STRIPE_PRICE_ID: 'price_123', DATABASE_URL: 'test' },
}))
vi.mock('@/utils/Env', () => ({ getBaseUrl: () => 'https://app.test' }))
vi.mock('@/models', () => ({
  schemas: {
    subscriptions: {
      userId: 'userId',
      stripeCustomerId: 'stripeCustomerId',
    },
  },
}))
vi.mock('@/libs/DB', () => ({
  db: {
    query: { subscriptions: { findFirst: vi.fn() } },
    insert: vi.fn(),
  },
}))

const NOW = new Date('2026-01-10T00:00:00Z')
const DAY = 24 * 60 * 60 * 1000

describe('hasPaidAccess', () => {
  it('is false without a subscription', () => {
    expect(hasPaidAccess(null, NOW)).toBe(false)
    expect(hasPaidAccess(undefined, NOW)).toBe(false)
  })

  it.each([SubscriptionStatus.Active, SubscriptionStatus.Trialing])(
    'is true for %s',
    (status) => {
      expect(hasPaidAccess({ status, currentPeriodEnd: null }, NOW)).toBe(true)
    }
  )

  it.each([
    SubscriptionStatus.Canceled,
    SubscriptionStatus.Incomplete,
    SubscriptionStatus.IncompleteExpired,
    SubscriptionStatus.Unpaid,
    SubscriptionStatus.Paused,
  ])('is false for %s', (status) => {
    expect(hasPaidAccess({ status, currentPeriodEnd: null }, NOW)).toBe(false)
  })

  it('keeps past_due access inside the grace window', () => {
    const currentPeriodEnd = new Date(NOW.getTime() - 2 * DAY)

    expect(
      hasPaidAccess(
        { status: SubscriptionStatus.PastDue, currentPeriodEnd },
        NOW
      )
    ).toBe(true)
  })

  it('drops past_due access after the grace window', () => {
    const currentPeriodEnd = new Date(NOW.getTime() - 4 * DAY)

    expect(
      hasPaidAccess(
        { status: SubscriptionStatus.PastDue, currentPeriodEnd },
        NOW
      )
    ).toBe(false)
  })

  it('drops past_due access when the period end is unknown', () => {
    expect(
      hasPaidAccess(
        { status: SubscriptionStatus.PastDue, currentPeriodEnd: null },
        NOW
      )
    ).toBe(false)
  })
})

describe('BillingService', () => {
  const user = { id: 'user-1', email: 'me@example.com' }
  const userService = { getCurrentUserWithAuth: vi.fn() }
  const stripe = {
    checkout: { sessions: { create: vi.fn() } },
    billingPortal: { sessions: { create: vi.fn() } },
    subscriptions: { retrieve: vi.fn() },
  }
  const service = new BillingService(userService as never)
  const findFirst = vi.mocked(db.query.subscriptions.findFirst)
  const onConflictDoUpdate = vi.fn()
  const values = vi.fn(() => ({ onConflictDoUpdate }))

  beforeEach(() => {
    userService.getCurrentUserWithAuth.mockResolvedValue(user)
    vi.mocked(getStripe).mockReturnValue(stripe as never)
    vi.mocked(db.insert).mockReturnValue({ values } as never)
    findFirst.mockResolvedValue(undefined)
  })

  describe('requirePaidAccess', () => {
    it('throws SUBSCRIPTION_REQUIRED without a subscription', async () => {
      await expect(service.requirePaidAccess()).rejects.toMatchObject({
        extensions: { code: 'SUBSCRIPTION_REQUIRED' },
      })
    })

    it('passes for an active subscription', async () => {
      findFirst.mockResolvedValue({
        status: SubscriptionStatus.Active,
        currentPeriodEnd: null,
      } as never)

      await expect(service.requirePaidAccess()).resolves.toBeUndefined()
    })
  })

  describe('getBillingStatus', () => {
    it('reports no access for a free user', async () => {
      await expect(service.getBillingStatus()).resolves.toEqual({
        hasPaidAccess: false,
        status: undefined,
        currentPeriodEnd: undefined,
        cancelAtPeriodEnd: false,
      })
    })
  })

  describe('createCheckoutSession', () => {
    it('starts a subscription checkout for a new customer', async () => {
      stripe.checkout.sessions.create.mockResolvedValue({
        id: 'cs_1',
        url: 'https://checkout.stripe.test/cs_1',
      })

      await expect(service.createCheckoutSession()).resolves.toEqual({
        url: 'https://checkout.stripe.test/cs_1',
      })
      expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: 'subscription',
          line_items: [{ price: 'price_123', quantity: 1 }],
          customer_email: 'me@example.com',
          client_reference_id: 'user-1',
          subscription_data: { metadata: { userId: 'user-1' } },
        })
      )
    })

    it('reuses the Stripe customer on a resubscribe', async () => {
      findFirst.mockResolvedValue({
        status: SubscriptionStatus.Canceled,
        stripeCustomerId: 'cus_1',
        currentPeriodEnd: null,
      } as never)
      stripe.checkout.sessions.create.mockResolvedValue({
        id: 'cs_2',
        url: 'u',
      })

      await service.createCheckoutSession()

      const args = stripe.checkout.sessions.create.mock.calls[0]?.[0]

      expect(args.customer).toBe('cus_1')
      expect(args.customer_email).toBeUndefined()
    })

    it('refuses when already subscribed', async () => {
      findFirst.mockResolvedValue({
        status: SubscriptionStatus.Active,
        currentPeriodEnd: null,
      } as never)

      await expect(service.createCheckoutSession()).rejects.toMatchObject({
        extensions: { code: 'ALREADY_SUBSCRIBED' },
      })
      expect(stripe.checkout.sessions.create).not.toHaveBeenCalled()
    })
  })

  describe('createPortalSession', () => {
    it('refuses without a subscription', async () => {
      await expect(service.createPortalSession()).rejects.toMatchObject({
        extensions: { code: 'NO_SUBSCRIPTION' },
      })
    })

    it('opens the portal for the stored customer', async () => {
      findFirst.mockResolvedValue({ stripeCustomerId: 'cus_1' } as never)
      stripe.billingPortal.sessions.create.mockResolvedValue({
        url: 'https://portal.stripe.test/p',
      })

      await expect(service.createPortalSession()).resolves.toEqual({
        url: 'https://portal.stripe.test/p',
      })
      expect(stripe.billingPortal.sessions.create).toHaveBeenCalledWith({
        customer: 'cus_1',
        return_url: 'https://app.test/billing',
      })
    })
  })

  describe('handleWebhookEvent', () => {
    const stripeSubscription = {
      id: 'sub_1',
      customer: 'cus_1',
      status: 'active',
      cancel_at_period_end: false,
      metadata: { userId: 'user-1' },
      items: { data: [{ current_period_end: 1_800_000_000 }] },
    }

    beforeEach(() => {
      stripe.subscriptions.retrieve.mockResolvedValue(stripeSubscription)
    })

    it('syncs the subscription after checkout completes', async () => {
      await service.handleWebhookEvent({
        type: 'checkout.session.completed',
        data: {
          object: {
            mode: 'subscription',
            subscription: 'sub_1',
            client_reference_id: 'user-1',
          },
        },
      } as never)

      expect(stripe.subscriptions.retrieve).toHaveBeenCalledWith('sub_1')
      expect(values).toHaveBeenCalledWith({
        userId: 'user-1',
        stripeCustomerId: 'cus_1',
        stripeSubscriptionId: 'sub_1',
        status: 'active',
        currentPeriodEnd: new Date(1_800_000_000 * 1000),
        cancelAtPeriodEnd: false,
      })
      expect(onConflictDoUpdate).toHaveBeenCalled()
    })

    it('ignores one-time payment checkouts', async () => {
      await service.handleWebhookEvent({
        type: 'checkout.session.completed',
        data: { object: { mode: 'payment', subscription: null } },
      } as never)

      expect(stripe.subscriptions.retrieve).not.toHaveBeenCalled()
    })

    it.each(['customer.subscription.updated', 'customer.subscription.deleted'])(
      'syncs on %s',
      async (type) => {
        await service.handleWebhookEvent({
          type,
          data: { object: { id: 'sub_1' } },
        } as never)

        expect(values).toHaveBeenCalledTimes(1)
      }
    )

    it('falls back to the stored customer when metadata is missing', async () => {
      stripe.subscriptions.retrieve.mockResolvedValue({
        ...stripeSubscription,
        metadata: {},
      })
      findFirst.mockResolvedValue({ userId: 'user-9' } as never)

      await service.handleWebhookEvent({
        type: 'customer.subscription.updated',
        data: { object: { id: 'sub_1' } },
      } as never)

      expect(values).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'user-9' })
      )
    })

    it('writes nothing when no user can be matched', async () => {
      stripe.subscriptions.retrieve.mockResolvedValue({
        ...stripeSubscription,
        metadata: {},
      })

      await service.handleWebhookEvent({
        type: 'customer.subscription.updated',
        data: { object: { id: 'sub_1' } },
      } as never)

      expect(values).not.toHaveBeenCalled()
    })

    it('ignores event types it does not handle', async () => {
      await service.handleWebhookEvent({ type: 'charge.refunded' } as never)

      expect(stripe.subscriptions.retrieve).not.toHaveBeenCalled()
    })
  })
})
