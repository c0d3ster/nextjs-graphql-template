import type { Metadata } from 'next'

import { SignOutButton } from '@/components/molecules'
import { BillingPanel } from '@/components/organisms'
import { CleanPageTemplate } from '@/components/templates'
import { Env } from '@/libs/Env'

export const metadata: Metadata = {
  title: `Billing - ${Env.NEXT_PUBLIC_BRAND_NAME}`,
  description: 'Manage your subscription',
}

export default function BillingPage() {
  return (
    <CleanPageTemplate
      title='Billing'
      subtitle='Manage your subscription'
      header={<SignOutButton />}
    >
      <BillingPanel />
    </CleanPageTemplate>
  )
}
