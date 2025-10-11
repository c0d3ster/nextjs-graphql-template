import { GraphQLError } from 'graphql'

import type { ContactFormInput } from '@/graphql/schema'
import type { EmailService } from '@/services/EmailService'

import { logger } from '@/libs/Logger'

export class ContactService {
  constructor(private emailService: EmailService) {}

  async submitContactForm(input: ContactFormInput) {
    try {
      // Log the contact form submission
      logger.info('Contact form submission received', {
        name: input.name,
        email: input.email,
        subject: input.subject,
        messageLength: input.message.length,
      })

      // Send email notification
      await this.emailService.sendContactFormEmail({
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
      })

      // TODO: In a real implementation, you might also:
      // 1. Save to database
      // 2. Add to CRM system
      // 3. Send Slack notification

      // Return submission confirmation
      return {
        id: `contact_${Date.now()}`,
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
        submittedAt: new Date().toISOString(),
      }
    } catch (error) {
      logger.error('Error processing contact form submission', {
        error: String(error),
        input: {
          name: input.name,
          email: input.email,
          subject: input.subject,
        },
      })

      throw new GraphQLError('Failed to submit contact form', {
        extensions: { code: 'CONTACT_SUBMISSION_FAILED' },
      })
    }
  }
}
