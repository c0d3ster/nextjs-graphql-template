import Stripe from 'stripe'

import { Env } from '@/libs/Env'

let stripe: Stripe | undefined

// Lazy so a missing key only fails when billing is actually used, not at build time
export const getStripe = (): Stripe => {
  if (stripe) return stripe
  if (!Env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  stripe = new Stripe(Env.STRIPE_SECRET_KEY)
  return stripe
}
