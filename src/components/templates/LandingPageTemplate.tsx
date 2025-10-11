import type { ReactNode } from 'react'

import type { NavItem } from '@/components/organisms'

import { SiteHeader } from '@/components/organisms'

type LandingPageTemplateProps = {
  children: ReactNode
}

export const LandingPageTemplate = ({ children }: LandingPageTemplateProps) => {
  // Public site menu items
  const menuItems: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Contact', href: '/#contact' },
  ]

  return (
    <div className='min-h-screen scroll-smooth bg-gray-900'>
      <SiteHeader menuItems={menuItems} />
      <div className='pt-16'>{children}</div>
    </div>
  )
}
