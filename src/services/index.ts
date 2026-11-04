// Service instances with dependency injection
import { Resend } from 'resend' // @module:email

import { Env } from '@/libs/Env' // @module:email

import { BillingService } from './BillingService' // @module:payments
import { ContactService } from './ContactService' // @module:email
import { EmailService } from './EmailService' // @module:email
import { UserService } from './UserService' // @module:auth

// Create services with their dependencies
// #region @module:email
const resend = Env.RESEND_API_KEY ? new Resend(Env.RESEND_API_KEY) : null
const emailService = new EmailService(resend)
const contactService = new ContactService(emailService)
// #endregion @module:email
const userService = new UserService() // @module:auth
const billingService = new BillingService(userService) // @module:payments

export const services = {
  billingService, // @module:payments
  contactService, // @module:email
  userService, // @module:auth
}

// Export types for dependency injection
export type { BillingService } // @module:payments
export type { ContactService } // @module:email
export type { UserService } // @module:auth
