import type { Metadata } from 'next'

import { UserButton } from '@clerk/nextjs'

import { Button } from '@/components/atoms'
import { CleanPageTemplate } from '@/components/templates'
import { BRAND_NAME } from '@/constants'

export const metadata: Metadata = {
  title: `Profile - ${BRAND_NAME}`,
  description: 'User profile page',
}

export default function ProfilePage() {
  const header = <UserButton />

  const content = (
    <>
      {/* Content Cards */}
      <div className='grid gap-6 md:grid-cols-2'>
        {/* Authentication Status Card */}
        <div className='bg-surface rounded-lg p-6'>
          <h2 className='text-text mb-4 text-xl font-semibold'>
            Authentication Status
          </h2>
          <div className='space-y-3'>
            <div className='flex items-center space-x-2'>
              <div className='bg-accent h-2 w-2 rounded-full'></div>
              <span className='text-text-muted'>Signed in successfully</span>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='bg-accent h-2 w-2 rounded-full'></div>
              <span className='text-text-muted'>Protected route accessed</span>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='bg-accent h-2 w-2 rounded-full'></div>
              <span className='text-text-muted'>User session active</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className='bg-surface rounded-lg p-6'>
          <h2 className='text-text mb-4 text-xl font-semibold'>
            Quick Actions
          </h2>
          <div className='space-y-3'>
            <Button href='/' className='w-full text-center'>
              Return to Home
            </Button>
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className='bg-surface mt-8 rounded-lg p-6'>
        <h2 className='text-text mb-4 text-xl font-semibold'>
          About This Demo
        </h2>
        <div className='text-text-muted space-y-2'>
          <p>
            This page demonstrates successful authentication with Clerk. You can
            see:
          </p>
          <ul className='ml-4 list-disc space-y-1'>
            <li>Protected route access (this page requires authentication)</li>
            <li>User session management</li>
            <li>Sign out functionality via the UserButton</li>
            <li>Navigation between authenticated and public pages</li>
          </ul>
          <p className='mt-4'>
            Try signing out and accessing this page directly - you'll be
            redirected to the sign-in page.
          </p>
        </div>
      </div>
    </>
  )

  return (
    <CleanPageTemplate
      title={`Welcome to ${BRAND_NAME}`}
      subtitle='You are successfully authenticated!'
      header={header}
    >
      {content}
    </CleanPageTemplate>
  )
}
