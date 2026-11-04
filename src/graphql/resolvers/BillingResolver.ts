import { Mutation, Query, Resolver } from 'type-graphql'

import type { BillingService } from '@/services'

import { BillingSession, BillingStatus } from '@/graphql/schema'
import { logger } from '@/libs/Logger'

@Resolver()
export class BillingResolver {
  constructor(private billingService: BillingService) {}

  @Query(() => BillingStatus)
  async billingStatus() {
    return this.billingService.getBillingStatus()
  }

  @Mutation(() => BillingSession)
  async createCheckoutSession() {
    try {
      return await this.billingService.createCheckoutSession()
    } catch (error) {
      logger.error('Error in createCheckoutSession mutation', {
        error: String(error),
      })
      throw error
    }
  }

  @Mutation(() => BillingSession)
  async createBillingPortalSession() {
    try {
      return await this.billingService.createPortalSession()
    } catch (error) {
      logger.error('Error in createBillingPortalSession mutation', {
        error: String(error),
      })
      throw error
    }
  }
}
