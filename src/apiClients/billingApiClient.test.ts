import { describe, expect, it, vi } from 'vitest'

import {
  BILLING_STATUS,
  CREATE_BILLING_PORTAL_SESSION,
  CREATE_CHECKOUT_SESSION,
  useBillingStatus,
  useCreateBillingPortalSession,
  useCreateCheckoutSession,
} from './billingApiClient'

vi.mock('@/graphql/generated/graphql', () => ({
  useBillingStatusQuery: vi.fn(),
  useCreateCheckoutSessionMutation: vi.fn(),
  useCreateBillingPortalSessionMutation: vi.fn(),
}))

describe('Billing API Client', () => {
  it('defines all GraphQL operations', () => {
    expect(BILLING_STATUS.definitions).toHaveLength(1)
    expect(CREATE_CHECKOUT_SESSION.definitions).toHaveLength(1)
    expect(CREATE_BILLING_PORTAL_SESSION.definitions).toHaveLength(1)
  })

  it('exports the hooks', () => {
    expect(typeof useBillingStatus).toBe('function')
    expect(typeof useCreateCheckoutSession).toBe('function')
    expect(typeof useCreateBillingPortalSession).toBe('function')
  })
})
