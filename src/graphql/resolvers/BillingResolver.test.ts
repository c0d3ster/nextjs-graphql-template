import 'reflect-metadata'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { logger } from '@/libs/Logger'

import { BillingResolver } from './BillingResolver'

vi.mock('@/libs/Logger', () => ({
  logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn() },
}))

describe('BillingResolver', () => {
  const billingService = {
    getBillingStatus: vi.fn(),
    createCheckoutSession: vi.fn(),
    createPortalSession: vi.fn(),
  }
  const resolver = new BillingResolver(billingService as never)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the billing status from the service', async () => {
    const status = { hasPaidAccess: true, cancelAtPeriodEnd: false }
    billingService.getBillingStatus.mockResolvedValue(status)

    await expect(resolver.billingStatus()).resolves.toBe(status)
  })

  it('returns the checkout session from the service', async () => {
    billingService.createCheckoutSession.mockResolvedValue({
      url: 'https://checkout.test',
    })

    await expect(resolver.createCheckoutSession()).resolves.toEqual({
      url: 'https://checkout.test',
    })
  })

  it('logs and rethrows checkout errors', async () => {
    const error = new Error('stripe down')
    billingService.createCheckoutSession.mockRejectedValue(error)

    await expect(resolver.createCheckoutSession()).rejects.toBe(error)
    expect(logger.error).toHaveBeenCalledWith(
      'Error in createCheckoutSession mutation',
      { error: String(error) }
    )
  })

  it('returns the portal session from the service', async () => {
    billingService.createPortalSession.mockResolvedValue({
      url: 'https://portal.test',
    })

    await expect(resolver.createBillingPortalSession()).resolves.toEqual({
      url: 'https://portal.test',
    })
  })

  it('logs and rethrows portal errors', async () => {
    const error = new Error('no subscription')
    billingService.createPortalSession.mockRejectedValue(error)

    await expect(resolver.createBillingPortalSession()).rejects.toBe(error)
    expect(logger.error).toHaveBeenCalledWith(
      'Error in createBillingPortalSession mutation',
      { error: String(error) }
    )
  })
})
