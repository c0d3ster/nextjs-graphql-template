'use client'

import type { ReactNode } from 'react'

import { useEffect, useState } from 'react'

import type { NavItem } from '@/components/organisms'

import { SiteHeader } from '@/components/organisms'

type LandingPageTemplateProps = {
  children: ReactNode
  logoUrl?: string
}

const menuItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Contact', href: '/#contact' },
]

export const LandingPageTemplate = ({ children, logoUrl }: LandingPageTemplateProps) => {
  const [activeItem, setActiveItem] = useState('home')

  useEffect(() => {
    const contactSection = document.getElementById('contact')
    if (!contactSection) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActiveItem('contact')
        } else {
          setActiveItem('home')
        }
      },
      {
        root: null,
        threshold: 0.25, // trigger as soon as 25% of #contact is visible
      }
    )

    observer.observe(contactSection)

    return () => observer.disconnect()
  }, [])

  return (
    <div className='min-h-screen scroll-smooth bg-background'>
      <SiteHeader menuItems={menuItems} activeItem={activeItem} logoUrl={logoUrl} />
      <div className='pt-16'>{children}</div>
    </div>
  )
}
