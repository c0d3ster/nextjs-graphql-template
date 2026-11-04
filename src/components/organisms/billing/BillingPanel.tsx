'use client'

import {
  useBillingStatus,
  useCreateBillingPortalSession,
  useCreateCheckoutSession,
} from '@/apiClients'
import { Button } from '@/components/atoms'
import { Toast } from '@/libs/Toast'

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' })

export const BillingPanel = () => {
  const { data, loading } = useBillingStatus()
  const [createCheckout, { loading: checkoutLoading }] =
    useCreateCheckoutSession()
  const [createPortal, { loading: portalLoading }] =
    useCreateBillingPortalSession()

  const status = data?.billingStatus

  const goTo = async (
    start: () => Promise<string | undefined>,
    errorMessage: string
  ): Promise<void> => {
    try {
      const url = await start()
      if (!url) {
        Toast.error(errorMessage)
        return
      }
      window.location.assign(url)
    } catch {
      Toast.error(errorMessage)
    }
  }

  const subscribe = (): Promise<void> =>
    goTo(async () => {
      const result = await createCheckout()
      return result.data?.createCheckoutSession.url
    }, 'Could not start checkout. Please try again.')

  const manage = (): Promise<void> =>
    goTo(async () => {
      const result = await createPortal()
      return result.data?.createBillingPortalSession.url
    }, 'Could not open billing. Please try again.')

  if (loading) {
    return <p className='text-text-muted'>Loading billing...</p>
  }

  return (
    <div className='rounded-lg bg-surface p-6'>
      <h2 className='mb-4 text-xl font-semibold text-text'>Subscription</h2>
      {status?.hasPaidAccess ? (
        <div className='space-y-4'>
          <p className='text-text-muted'>
            Your plan is active
            {status.currentPeriodEnd &&
              (status.cancelAtPeriodEnd
                ? `, and ends on ${formatDate(status.currentPeriodEnd)}.`
                : `, and renews on ${formatDate(status.currentPeriodEnd)}.`)}
          </p>
          <Button onClick={manage} disabled={portalLoading}>
            Manage billing
          </Button>
        </div>
      ) : (
        <div className='space-y-4'>
          <p className='text-text-muted'>
            You are on the free plan. Subscribe to unlock paid features.
          </p>
          <Button onClick={subscribe} disabled={checkoutLoading}>
            Subscribe
          </Button>
        </div>
      )}
    </div>
  )
}
