import type { Metadata } from 'next'

import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

import { BRAND_NAME } from '@/constants'

export const metadata: Metadata = {
  title: `Profile - ${BRAND_NAME}`,
  description: 'User profile page',
}

export default function ProfilePage() {
  return (
    <div className='min-h-screen bg-gray-900'>
      <div className='mx-auto max-w-4xl px-4 py-8'>
        {/* Header */}
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-white'>
              Welcome to {BRAND_NAME}
            </h1>
            <p className='text-gray-300'>You are successfully authenticated!</p>
          </div>
          <UserButton afterSignOutUrl='/' />
        </div>

        {/* Content Cards */}
        <div className='grid gap-6 md:grid-cols-2'>
          {/* Authentication Status Card */}
          <div className='rounded-lg bg-gray-800 p-6'>
            <h2 className='mb-4 text-xl font-semibold text-white'>
              Authentication Status
            </h2>
            <div className='space-y-3'>
              <div className='flex items-center space-x-2'>
                <div className='h-2 w-2 rounded-full bg-green-500'></div>
                <span className='text-gray-300'>Signed in successfully</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='h-2 w-2 rounded-full bg-green-500'></div>
                <span className='text-gray-300'>Protected route accessed</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='h-2 w-2 rounded-full bg-green-500'></div>
                <span className='text-gray-300'>User session active</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className='rounded-lg bg-gray-800 p-6'>
            <h2 className='mb-4 text-xl font-semibold text-white'>
              Quick Actions
            </h2>
            <div className='space-y-3'>
              <Link
                href='/'
                className='block rounded bg-blue-600 px-4 py-2 text-center text-white transition-colors hover:bg-blue-700'
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className='mt-8 rounded-lg bg-gray-800 p-6'>
          <h2 className='mb-4 text-xl font-semibold text-white'>
            About This Demo
          </h2>
          <div className='space-y-2 text-gray-300'>
            <p>
              This page demonstrates successful authentication with Clerk. You
              can see:
            </p>
            <ul className='ml-4 list-disc space-y-1'>
              <li>
                Protected route access (this page requires authentication)
              </li>
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
      </div>
    </div>
  )
}
