'use client'

import type { ReactNode } from 'react'

import { useEffect, useState } from 'react'

import type { NavItem } from '@/components/organisms'

import { SiteHeader } from '@/components/organisms'

type LandingPageTemplateProps = {
  children: ReactNode
}

const menuItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Contact', href: '/#contact' },
]

export const LandingPageTemplate = ({ children }: LandingPageTemplateProps) => {
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
    <div className='bg-background min-h-screen scroll-smooth'>
      <SiteHeader menuItems={menuItems} activeItem={activeItem} />
      <div className='pt-16'>{children}</div>
    </div>
  )
}
