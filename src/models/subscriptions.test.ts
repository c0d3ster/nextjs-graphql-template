import { getTableConfig } from 'drizzle-orm/pg-core'
import { describe, expect, it } from 'vitest'

import { SubscriptionStatus } from '@/graphql/schema/billing'

import { subscriptionStatusEnum } from './enums'
import { subscriptions } from './subscriptions'

describe('subscriptions table', () => {
  const config = getTableConfig(subscriptions)
  const column = (name: string) => config.columns.find((c) => c.name === name)

  it('is named subscriptions', () => {
    expect(config.name).toBe('subscriptions')
  })

  it('keeps one row per user, customer and Stripe subscription', () => {
    expect(column('user_id')?.isUnique).toBe(true)
    expect(column('stripe_customer_id')?.isUnique).toBe(true)
    expect(column('stripe_subscription_id')?.isUnique).toBe(true)
  })

  it('deletes the row with its user', () => {
    expect(config.foreignKeys).toHaveLength(1)
    expect(config.foreignKeys[0]?.onDelete).toBe('cascade')
  })

  it('defaults cancelAtPeriodEnd to false and leaves the period end optional', () => {
    expect(column('cancel_at_period_end')?.default).toBe(false)
    expect(column('current_period_end')?.notNull).toBe(false)
  })

  it('stores every subscription status', () => {
    expect(subscriptionStatusEnum.enumValues).toEqual(
      Object.values(SubscriptionStatus)
    )
  })
})
