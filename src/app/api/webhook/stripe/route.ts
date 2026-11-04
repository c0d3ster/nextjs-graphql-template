import 'reflect-metadata'

import type { NextRequest } from 'next/server'
import type Stripe from 'stripe'

import { NextResponse } from 'next/server'

import { Env } from '@/libs/Env'
import { logger } from '@/libs/Logger'
import { getStripe } from '@/libs/Stripe'
import { services } from '@/services'

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  const webhookSecret = Env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    logger.error('STRIPE_WEBHOOK_SECRET not configured')
    return NextResponse.json(
      { error: 'Server misconfiguration' },
      { status: 500 }
    )
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  // The raw body is required: signature verification fails on re-serialized JSON
  const payload = await request.text()

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    )
  } catch (error) {
    logger.warn('Stripe webhook signature verification failed', {
      error: String(error),
    })
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    await services.billingService.handleWebhookEvent(event)
  } catch (error) {
    // A non-2xx makes Stripe retry, and the handlers are safe to run again
    logger.error('Stripe webhook handler failed', {
      error: String(error),
      type: event.type,
    })
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }

  return NextResponse.json({ received: true })
}
