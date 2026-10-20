import type { NextConfig } from 'next'

import withBundleAnalyzer from '@next/bundle-analyzer'

// R2 configuration constants
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME
const R2_PUBLIC_HOST =
  R2_ACCOUNT_ID && R2_BUCKET_NAME
    ? `${R2_BUCKET_NAME}.${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
    : null

// Supabase configuration constants
const SUPABASE_HOST = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : null

// Define the base Next.js configuration
const baseConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // type-graphql + reflect-metadata break when bundled/minified (invalid GraphQL names like "$").
  serverExternalPackages: [
    '@apollo/server',
    '@as-integrations/next',
    'graphql',
    'graphql-scalars',
    'graphql-query-complexity',
    'reflect-metadata',
    'type-graphql',
  ],
  images: {
    remotePatterns: [
      // Supabase Storage public objects
      ...(SUPABASE_HOST
        ? [
            {
              protocol: 'https' as const,
              hostname: SUPABASE_HOST,
              port: '',
              pathname: '/storage/v1/object/public/**',
            },
          ]
        : []),
      // Add R2 public host if R2 is configured
      ...(R2_PUBLIC_HOST
        ? [
            {
              protocol: 'https' as const,
              hostname: R2_PUBLIC_HOST,
              port: '',
              pathname: '/**',
            },
          ]
        : []),
    ],
  },
}

// Conditionally enable bundle analysis
let configWithPlugins = baseConfig
if (process.env.ANALYZE === 'true') {
  configWithPlugins = withBundleAnalyzer()(baseConfig)
}

const nextConfig = configWithPlugins
export default nextConfig
