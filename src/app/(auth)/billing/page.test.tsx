import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import BillingPage, { metadata } from './page'

vi.mock('@/libs/Env', () => ({ Env: { NEXT_PUBLIC_BRAND_NAME: 'TestApp' } }))

// Both the Clerk and Supabase variants of this page get these, only the one it uses is read
vi.mock('@clerk/nextjs', () => ({
  UserButton: () => <div data-testid='account-menu' />,
}))
vi.mock('@/components/molecules', () => ({
  SignOutButton: () => <div data-testid='account-menu' />,
}))

vi.mock('@/components/organisms', () => ({
  BillingPanel: () => <div data-testid='billing-panel' />,
}))

vi.mock('@/components/templates', () => ({
  CleanPageTemplate: ({
    title,
    subtitle,
    header,
    children,
  }: {
    title: string
    subtitle: string
    header: React.ReactNode
    children: React.ReactNode
  }) => (
    <div>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {header}
      {children}
    </div>
  ),
}))

describe('BillingPage', () => {
  it('sets the page metadata from the brand name', () => {
    expect(metadata.title).toBe('Billing - TestApp')
    expect(metadata.description).toBe('Manage your subscription')
  })

  it('renders the billing panel with an account menu', () => {
    render(<BillingPage />)

    expect(screen.getByRole('heading', { name: 'Billing' })).toBeInTheDocument()
    expect(screen.getByText('Manage your subscription')).toBeInTheDocument()
    expect(screen.getByTestId('account-menu')).toBeInTheDocument()
    expect(screen.getByTestId('billing-panel')).toBeInTheDocument()
  })
})
