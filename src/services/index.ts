// Service instances with dependency injection
import { Resend } from 'resend'

import { Env } from '@/libs/Env'

import { ContactService } from './ContactService'
import { EmailService } from './EmailService'
import { UserService } from './UserService'

// Create services with their dependencies
const resend = Env.RESEND_API_KEY ? new Resend(Env.RESEND_API_KEY) : null
export const emailService = new EmailService(resend)
export const contactService = new ContactService(emailService)
export const userService = new UserService()

// Export types for dependency injection
export type { ContactService, EmailService, UserService }
