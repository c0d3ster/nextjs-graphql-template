'use client'

import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'

export type NavItem = { label: string; href: string }

type SiteHeaderProps = {
  menuItems: NavItem[]
  activeItem?: string
}

export const SiteHeader = ({
  menuItems,
  activeItem = 'home',
}: SiteHeaderProps) => {
  const { user, isLoaded } = useUser()

  return (
    <header className='bg-surface fixed top-0 right-0 left-0 z-50 border-b border-gray-700 shadow-sm'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <div className='flex items-center'>
            <Link href='/' className='text-text text-lg font-semibold'>
              LOGO
            </Link>
          </div>

          {/* Navigation */}
          <nav className='flex space-x-8'>
            {menuItems.map((item) => {
              const isActive = activeItem === item.label.toLowerCase()
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary'
                      : 'hover:text-primary text-text-muted'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Auth */}
          <div className='flex items-center'>
            {isLoaded && user ? (
              <SignOutButton>
                <button className='hover:text-primary text-text-muted text-sm'>
                  Sign Out
                </button>
              </SignOutButton>
            ) : (
              <SignInButton mode='modal'>
                <button className='hover:text-primary text-text-muted text-sm'>
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
