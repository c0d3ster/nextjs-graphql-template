import type { NavItem } from '@/components/organisms'

import { SiteHeader } from '@/components/organisms'

export default function Layout({ children }: { children: React.ReactNode }) {
  // Public site menu items
  const menuItems: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Contact', href: '/#contact' },
  ]

  return (
    <div className='min-h-screen scroll-smooth'>
      <SiteHeader menuItems={menuItems} />
      <div className='pt-16'>{children}</div>
    </div>
  )
}
