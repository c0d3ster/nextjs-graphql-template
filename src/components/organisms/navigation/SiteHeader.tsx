'use client'

import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'

export type NavItem = {
  label: string
  href: string
  id: string
  hideOnMobile?: boolean
}

type SiteHeaderProps = {
  menuItems: NavItem[]
  activeItem?: string
  logoUrl?: string
}

const NavAuthSection = () => {
  const { user, isLoaded } = useUser()

  if (!isLoaded) return null

  return user ? (
    <SignOutButton>
      <button
        type='button'
        className='text-sm text-text-muted hover:text-primary'
      >
        Sign Out
      </button>
    </SignOutButton>
  ) : (
    <SignInButton mode='modal'>
      <button
        type='button'
        className='text-sm text-text-muted hover:text-primary'
      >
        Sign In
      </button>
    </SignInButton>
  )
}

export const SiteHeader = ({
  menuItems,
  activeItem = 'home',
  logoUrl,
}: SiteHeaderProps) => {
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)

  return (
    <header className='fixed top-0 right-0 left-0 z-50 border-b border-gray-200 bg-surface shadow-lg'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-20 items-center justify-between'>
          {/* Logo */}
          <div className='flex flex-1 items-center'>
            <Link href='/'>
              {logoUrl ? (
                <img src={logoUrl} alt='Logo' className='h-15 w-auto' />
              ) : (
                <span className='text-lg font-semibold text-text'>LOGO</span>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className='flex space-x-8'>
            {menuItems.map((item) => {
              const isActive = activeItem === item.id
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-text-muted hover:text-primary'} ${item.hideOnMobile ? 'hidden sm:block' : ''}`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Auth */}
          <div className='flex flex-1 items-center justify-end'>
            {clerkEnabled && <NavAuthSection />}
          </div>
        </div>
      </div>
    </header>
  )
}
