'use client'

import type { FieldErrors } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import type { ContactFormData } from '@/validations'

import { useSubmitContactForm } from '@/apiClients'
import { logger } from '@/libs/Logger'
import { Toast } from '@/libs/Toast'
import { contactFormSchema } from '@/validations'

// Contact form component for handling user submissions
export const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitContactForm] = useSubmitContactForm()

  const { register, handleSubmit, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onSubmit',
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)

    try {
      const result = await submitContactForm({
        variables: { input: data },
      })

      if (result.data?.submitContactForm) {
        Toast.success(
          "Message sent successfully! I'll get back to you within 24 hours."
        )
        reset()
      } else {
        Toast.error('Failed to send message. Please try again.')
      }
    } catch (error) {
      // Log detailed error information for debugging
      if (
        error &&
        typeof error === 'object' &&
        'graphQLErrors' in error &&
        Array.isArray(error.graphQLErrors) &&
        error.graphQLErrors.length > 0
      ) {
        const graphQLError = error.graphQLErrors[0]
        logger.error('Contact form error details', {
          originalError: graphQLError.extensions?.originalError,
          details: graphQLError.extensions?.details,
          code: graphQLError.extensions?.code,
          message: graphQLError.message,
        })
      } else {
        logger.error('Contact form error', { error })
      }

      // Show generic user-friendly message regardless of error type
      Toast.error(
        'Failed to send message. Please try again or contact support if the issue persists.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const onError = (errors: FieldErrors<ContactFormData>) => {
    const errorMessages = Object.values(errors)
      .map((err) => err?.message)
      .filter((msg): msg is string => Boolean(msg))
      .join(', ')
    Toast.error(`Please fix the following errors: ${errorMessages}`)
  }

  return (
    <div className='mx-auto max-w-2xl'>
      <h3 className='text-text mb-6 text-center text-2xl font-bold'>
        Contact Us
      </h3>

      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className='space-y-6'
        noValidate
      >
        <div className='grid gap-6 md:grid-cols-2'>
          <div>
            <label
              htmlFor='name'
              className='text-text-muted mb-2 block text-sm font-medium'
            >
              Name
            </label>
            <input
              {...register('name')}
              id='name'
              type='text'
              className='bg-surface text-text w-full rounded border border-gray-600 p-3 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:outline-none'
              placeholder='Your name'
            />
          </div>
          <div>
            <label
              htmlFor='email'
              className='text-text-muted mb-2 block text-sm font-medium'
            >
              Email
            </label>
            <input
              {...register('email')}
              id='email'
              type='email'
              className='bg-surface text-text w-full rounded border border-gray-600 p-3 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:outline-none'
              placeholder='your@email.com'
            />
          </div>
        </div>

        <div>
          <label
            htmlFor='subject'
            className='text-text-muted mb-2 block text-sm font-medium'
          >
            Subject
          </label>
          <input
            {...register('subject')}
            id='subject'
            type='text'
            className='bg-surface text-text w-full rounded border border-gray-600 p-3 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:outline-none'
            placeholder="What's this about?"
          />
        </div>

        <div>
          <label
            htmlFor='message'
            className='text-text-muted mb-2 block text-sm font-medium'
          >
            Message
          </label>
          <textarea
            {...register('message')}
            id='message'
            rows={4}
            className='bg-surface text-text w-full resize-none rounded border border-gray-600 p-3 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:outline-none'
            placeholder='Tell us about your project...'
          />
        </div>

        <div className='text-center'>
          <button
            type='submit'
            disabled={isSubmitting}
            className='text-text rounded bg-blue-600 px-6 py-3 font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
    </div>
  )
}
