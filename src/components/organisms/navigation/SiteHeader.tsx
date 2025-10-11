'use client'

import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export type NavItem = { label: string; href: string }

type SiteHeaderProps = {
  menuItems: NavItem[]
}

export const SiteHeader = ({ menuItems }: SiteHeaderProps) => {
  const { user, isLoaded } = useUser()
  const [activeItem, setActiveItem] = useState<string>('home')

  // Handle scroll-based highlighting
  useEffect(() => {
    const handleScroll = () => {
      const contactSection = document.getElementById('contact')
      if (contactSection) {
        const rect = contactSection.getBoundingClientRect()
        // Check if contact section is visible in viewport (top of section is above viewport center)
        const isInView = rect.top <= window.innerHeight / 2

        if (isInView) {
          setActiveItem('contact')
        } else {
          setActiveItem('home')
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial position

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className='fixed top-0 right-0 left-0 z-50 border-b border-gray-700 bg-gray-800 shadow-sm'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <div className='flex items-center'>
            <Link href='/' className='text-lg font-semibold text-white'>
              LOGO
            </Link>
          </div>

          {/* Navigation - Centered */}
          <nav className='flex space-x-8'>
            {menuItems.map((item) => {
              const isActive = activeItem === item.label.toLowerCase()
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-blue-400'
                      : 'text-gray-300 hover:text-blue-400'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Auth - Simple */}
          <div className='flex items-center'>
            {isLoaded && user ? (
              <SignOutButton>
                <button className='text-sm text-gray-300 hover:text-blue-400'>
                  Sign Out
                </button>
              </SignOutButton>
            ) : (
              <SignInButton mode='modal'>
                <button className='text-sm text-gray-300 hover:text-blue-400'>
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
