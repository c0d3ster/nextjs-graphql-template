import type { Resend } from 'resend'

import { SUPPORT_EMAIL } from '@/constants'
import { logger } from '@/libs/Logger'

export class EmailService {
  constructor(private resend: Resend | null) {}

  /**
   * Escape HTML to prevent XSS attacks
   */
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  /**
   * Send contact form notification email
   */
  async sendContactFormEmail(data: {
    name: string
    email: string
    subject: string
    message: string
  }): Promise<void> {
    if (!this.resend) {
      logger.warn('Resend not configured - skipping email send', {
        subject: data.subject,
      })
      return
    }

    try {
      await this.resend.emails.send({
        from: 'Contact Form <onboarding@resend.dev>', // Replace with your verified domain
        to: SUPPORT_EMAIL,
        replyTo: data.email,
        subject: `Contact Form: ${this.escapeHtml(data.subject)}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${this.escapeHtml(data.name)} (${this.escapeHtml(data.email)})</p>
          <p><strong>Subject:</strong> ${this.escapeHtml(data.subject)}</p>
          <p><strong>Message:</strong></p>
          <p>${this.escapeHtml(data.message).replace(/\n/g, '<br>')}</p>
        `,
      })

      logger.info('Contact form email sent successfully', {
        to: data.email,
        subject: data.subject,
      })
    } catch (error) {
      logger.error('Failed to send contact form email', {
        error: String(error),
        subject: data.subject,
      })
      throw error
    }
  }
}
