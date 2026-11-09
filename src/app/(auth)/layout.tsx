import type { ReactNode } from 'react'

import { redirect } from 'next/navigation' // @module:clerk

type AuthLayoutProps = {
  children: ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps): ReactNode => {
  // #region @module:clerk
  // Clerk components throw outside <ClerkProvider />, which is skipped without a key
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    redirect('/')
  }
  // #endregion @module:clerk

  return <>{children}</>
}

export default AuthLayout
