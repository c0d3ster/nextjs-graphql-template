import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Toast } from '@/libs/Toast'

import { BillingPanel } from './BillingPanel'

const mockStatus = vi.fn()
const mockCheckout = vi.fn()
const mockPortal = vi.fn()

vi.mock('@/apiClients', () => ({
  useBillingStatus: () => mockStatus(),
  useCreateCheckoutSession: () => mockCheckout(),
  useCreateBillingPortalSession: () => mockPortal(),
}))

const assign = vi.fn()

describe('BillingPanel', () => {
  beforeEach(() => {
    vi.stubGlobal('location', { assign })
    mockCheckout.mockReturnValue([
      vi.fn().mockResolvedValue({
        data: { createCheckoutSession: { url: 'https://checkout.test' } },
      }),
      { loading: false },
    ])
    mockPortal.mockReturnValue([
      vi.fn().mockResolvedValue({
        data: { createBillingPortalSession: { url: 'https://portal.test' } },
      }),
      { loading: false },
    ])
  })

  it('shows a loading state', () => {
    mockStatus.mockReturnValue({ loading: true })

    render(<BillingPanel />)

    expect(screen.getByText('Loading billing...')).toBeInTheDocument()
  })

  it('offers a subscribe button to free users and redirects to Checkout', async () => {
    mockStatus.mockReturnValue({
      loading: false,
      data: {
        billingStatus: { hasPaidAccess: false, cancelAtPeriodEnd: false },
      },
    })

    render(<BillingPanel />)
    fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }))

    await waitFor(() => {
      expect(assign).toHaveBeenCalledWith('https://checkout.test')
    })
  })

  it('offers billing management to subscribers and redirects to the portal', async () => {
    mockStatus.mockReturnValue({
      loading: false,
      data: {
        billingStatus: {
          hasPaidAccess: true,
          currentPeriodEnd: '2026-02-01T00:00:00.000Z',
          cancelAtPeriodEnd: false,
        },
      },
    })

    render(<BillingPanel />)

    expect(screen.getByText(/renews on/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Manage billing' }))

    await waitFor(() => {
      expect(assign).toHaveBeenCalledWith('https://portal.test')
    })
  })

  it('says when a cancelled plan ends', () => {
    mockStatus.mockReturnValue({
      loading: false,
      data: {
        billingStatus: {
          hasPaidAccess: true,
          currentPeriodEnd: '2026-02-01T00:00:00.000Z',
          cancelAtPeriodEnd: true,
        },
      },
    })

    render(<BillingPanel />)

    expect(screen.getByText(/ends on/)).toBeInTheDocument()
  })

  it('shows an error toast when checkout fails', async () => {
    mockStatus.mockReturnValue({
      loading: false,
      data: {
        billingStatus: { hasPaidAccess: false, cancelAtPeriodEnd: false },
      },
    })
    mockCheckout.mockReturnValue([
      vi.fn().mockRejectedValue(new Error('boom')),
      { loading: false },
    ])

    render(<BillingPanel />)
    fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }))

    await waitFor(() => {
      expect(Toast.error).toHaveBeenCalled()
    })

    expect(assign).not.toHaveBeenCalled()
  })
})
