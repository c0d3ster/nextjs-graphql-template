import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getStripe } from '@/libs/Stripe'
import { services } from '@/services'

import { POST } from './route'

const mockEnv = vi.hoisted(() => ({
  Env: { STRIPE_WEBHOOK_SECRET: 'whsec_test' as string | undefined },
}))

vi.mock('@/libs/Env', () => mockEnv)
vi.mock('@/libs/Stripe', () => ({ getStripe: vi.fn() }))
vi.mock('@/services', () => ({
  services: { billingService: { handleWebhookEvent: vi.fn() } },
}))

const constructEvent = vi.fn()

const request = (headers: Record<string, string> = {}): NextRequest =>
  new NextRequest('http://localhost/api/webhook/stripe', {
    method: 'POST',
    body: '{"id":"evt_1"}',
    headers,
  })

describe('POST /api/webhook/stripe', () => {
  beforeEach(() => {
    mockEnv.Env.STRIPE_WEBHOOK_SECRET = 'whsec_test'
    vi.mocked(getStripe).mockReturnValue({
      webhooks: { constructEvent },
    } as never)
  })

  it('returns 500 when the webhook secret is missing', async () => {
    mockEnv.Env.STRIPE_WEBHOOK_SECRET = undefined

    const response = await POST(request({ 'stripe-signature': 'sig' }))

    expect(response.status).toBe(500)
  })

  it('returns 400 without a signature header', async () => {
    const response = await POST(request())

    expect(response.status).toBe(400)
  })

  it('returns 400 when the signature does not verify', async () => {
    constructEvent.mockImplementation(() => {
      throw new Error('bad signature')
    })

    const response = await POST(request({ 'stripe-signature': 'sig' }))

    expect(response.status).toBe(400)
    expect(services.billingService.handleWebhookEvent).not.toHaveBeenCalled()
  })

  it('verifies the raw body and hands the event to the billing service', async () => {
    const event = { id: 'evt_1', type: 'customer.subscription.updated' }
    constructEvent.mockReturnValue(event)

    const response = await POST(request({ 'stripe-signature': 'sig' }))

    expect(constructEvent).toHaveBeenCalledWith(
      '{"id":"evt_1"}',
      'sig',
      'whsec_test'
    )
    expect(services.billingService.handleWebhookEvent).toHaveBeenCalledWith(
      event
    )
    expect(response.status).toBe(200)
  })

  it('returns 500 so Stripe retries when handling fails', async () => {
    constructEvent.mockReturnValue({ id: 'evt_1', type: 'x' })
    vi.mocked(services.billingService.handleWebhookEvent).mockRejectedValue(
      new Error('db down')
    )

    const response = await POST(request({ 'stripe-signature': 'sig' }))

    expect(response.status).toBe(500)
  })
})
