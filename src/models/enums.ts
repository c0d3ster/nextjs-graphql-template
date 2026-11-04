import { pgEnum } from 'drizzle-orm/pg-core'

import { SubscriptionStatus } from '@/graphql/schema/billing' // @module:payments
import { UserRole } from '@/graphql/schema/user'

// User role enum for database
export const userRoleEnum = pgEnum('user_role', [
  UserRole.Client,
  UserRole.Developer,
  UserRole.Admin,
  UserRole.SuperAdmin,
])

// #region @module:payments
export const subscriptionStatusEnum = pgEnum('subscription_status', [
  SubscriptionStatus.Active,
  SubscriptionStatus.Trialing,
  SubscriptionStatus.PastDue,
  SubscriptionStatus.Canceled,
  SubscriptionStatus.Incomplete,
  SubscriptionStatus.IncompleteExpired,
  SubscriptionStatus.Unpaid,
  SubscriptionStatus.Paused,
])
// #endregion @module:payments
