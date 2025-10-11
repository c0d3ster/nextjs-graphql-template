import type { Metadata } from 'next'

import Link from 'next/link'

import { ContactForm, ThemeEditor } from '@/components/molecules'
import { LandingPageTemplate } from '@/components/templates'
import { BRAND_NAME } from '@/constants'

export const metadata: Metadata = {
  title: `${BRAND_NAME} - Modern Web Application`,
  description:
    'A modern web application built with Next.js, GraphQL, and TypeScript',
}

export default function Index() {
  return (
    <LandingPageTemplate>
      {/* Main Content */}
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <h2 className='mb-4 text-4xl font-bold text-white'>
            Welcome to {BRAND_NAME}
          </h2>
          <p className='mb-8 text-lg text-gray-300'>
            A modern web application template with authentication
          </p>

          {/* Auth Demo Section */}
          <div className='bg-surface mb-8 rounded-lg p-6'>
            <h3 className='mb-4 text-xl font-semibold text-white'>
              Authentication Demo
            </h3>
            <div className='space-y-2 text-gray-300'>
              <p>This template includes:</p>
              <ul className='ml-4 list-disc space-y-1 text-left'>
                <li>Public pages (this page)</li>
                <li>
                  Protected pages (try accessing{' '}
                  <Link
                    href='/profile'
                    className='text-primary hover:text-primary/80'
                  >
                    /profile
                  </Link>{' '}
                  after signing in)
                </li>
                <li>Sign in/up modals</li>
                <li>User session management</li>
              </ul>
            </div>
          </div>

          {/* Theme Editor */}
          <ThemeEditor />
        </div>
      </div>

      {/* Contact Form Section */}
      <div id='contact' className='bg-surface py-16'>
        <ContactForm />
      </div>
    </LandingPageTemplate>
  )
}
