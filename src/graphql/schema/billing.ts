import { Field, ObjectType, registerEnumType } from 'type-graphql'

// Mirrors Stripe's subscription statuses
export enum SubscriptionStatus {
  Active = 'active',
  Trialing = 'trialing',
  PastDue = 'past_due',
  Canceled = 'canceled',
  Incomplete = 'incomplete',
  IncompleteExpired = 'incomplete_expired',
  Unpaid = 'unpaid',
  Paused = 'paused',
}

registerEnumType(SubscriptionStatus, {
  name: 'SubscriptionStatus',
  description: 'Subscription status, as reported by Stripe',
})

@ObjectType('BillingStatus')
export class BillingStatus {
  // The one flag paid features should check
  @Field(() => Boolean)
  hasPaidAccess!: boolean

  @Field(() => SubscriptionStatus, { nullable: true })
  status?: SubscriptionStatus

  @Field(() => String, { nullable: true })
  currentPeriodEnd?: string

  @Field(() => Boolean)
  cancelAtPeriodEnd!: boolean
}

// A hosted Stripe page (Checkout or the Customer Portal) to send the browser to
@ObjectType('BillingSession')
export class BillingSession {
  @Field(() => String)
  url!: string
}
