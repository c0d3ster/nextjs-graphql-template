import gql from 'graphql-tag'

import {
  useBillingStatusQuery,
  useCreateBillingPortalSessionMutation,
  useCreateCheckoutSessionMutation,
} from '@/graphql/generated/graphql'

// GraphQL Operations
export const BILLING_STATUS = gql`
  query BillingStatus {
    billingStatus {
      hasPaidAccess
      status
      currentPeriodEnd
      cancelAtPeriodEnd
    }
  }
`

export const CREATE_CHECKOUT_SESSION = gql`
  mutation CreateCheckoutSession {
    createCheckoutSession {
      url
    }
  }
`

export const CREATE_BILLING_PORTAL_SESSION = gql`
  mutation CreateBillingPortalSession {
    createBillingPortalSession {
      url
    }
  }
`

// Hooks for components
export const useBillingStatus = () => useBillingStatusQuery()
export const useCreateCheckoutSession = () => useCreateCheckoutSessionMutation()
export const useCreateBillingPortalSession = () =>
  useCreateBillingPortalSessionMutation()
