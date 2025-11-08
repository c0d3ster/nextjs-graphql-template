'use client'

import { ApolloProvider } from '@apollo/client/react'

import { ToastContainer } from '@/components/atoms'
import { apolloClient } from '@/libs/ApolloClient'
import { ClerkProvider, QueryProvider } from '@/providers'
import '@/styles/global.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='theme-color' content='#111827' />
        <link rel='icon' href='/favicon.ico' />
      </head>
      <body>
        <ClerkProvider>
          <ApolloProvider client={apolloClient}>
            <QueryProvider>
              {children}
              <ToastContainer />
            </QueryProvider>
          </ApolloProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
