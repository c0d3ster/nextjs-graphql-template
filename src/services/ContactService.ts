import { GraphQLError } from 'graphql'

import type { ContactFormInput } from '@/graphql/schema'

import { logger } from '@/libs/Logger'

export class ContactService {
  async submitContactForm(input: ContactFormInput) {
    try {
      // Log the contact form submission
      logger.info('Contact form submission received', {
        name: input.name,
        email: input.email,
        subject: input.subject,
        messageLength: input.message.length,
      })

      // TODO: In a real implementation, you might:
      // 1. Save to database
      // 2. Send email notification
      // 3. Add to CRM system
      // 4. Send Slack notification

      // Return mock submission (in real app, you might save to DB)
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
