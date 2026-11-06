import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockEnv = vi.hoisted(() => ({
  STRIPE_SECRET_KEY: undefined as string | undefined,
}))

vi.mock('@/libs/Env', () => ({ Env: mockEnv }))

const loadGetStripe = async () => (await import('./Stripe')).getStripe

describe('getStripe', () => {
  beforeEach(() => {
    vi.resetModules()
    mockEnv.STRIPE_SECRET_KEY = undefined
  })

  it('throws when the secret key is not configured', async () => {
    const getStripe = await loadGetStripe()

    expect(() => getStripe()).toThrow('STRIPE_SECRET_KEY is not configured')
  })

  it('creates the client once and reuses it', async () => {
    mockEnv.STRIPE_SECRET_KEY = 'sk_test_123'
    const getStripe = await loadGetStripe()

    const first = getStripe()

    expect(first.checkout.sessions).toBeDefined()
    expect(getStripe()).toBe(first)
  })
})
