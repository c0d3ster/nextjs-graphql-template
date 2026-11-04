import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { subscriptionStatusEnum } from './enums'
import { users } from './users'

// One row per user, written only by the Stripe webhook. Success redirects never grant access.
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  stripeCustomerId: text('stripe_customer_id').notNull().unique(),
  stripeSubscriptionId: text('stripe_subscription_id').notNull().unique(),
  status: subscriptionStatusEnum('status').notNull(),
  currentPeriodEnd: timestamp('current_period_end', { mode: 'date' }),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').notNull().default(false),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

export type SubscriptionRecord = typeof subscriptions.$inferSelect
