import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

// Check if we're in CI or build-time (where env vars might not be available)
const isCI = Boolean(
  process.env.CI ||
    process.env.GITHUB_ACTIONS ||
    process.env.VERCEL ||
    process.env.CONTINUOUS_INTEGRATION
)

// For CI/build, allow empty strings; for runtime, require values
const requiredString = isCI
  ? z.string().optional()
  : z.string().min(1, 'Required environment variable is missing')

export const Env = createEnv({
  server: {
    CLERK_SECRET_KEY: requiredString,
    CLERK_WEBHOOK_SECRET: z.string().optional(),
    DATABASE_URL: requiredString,
    PORTFOLIO_SECRET_TOKEN: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().optional(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: requiredString,
  },
  shared: {
    NODE_ENV: z.enum(['test', 'development', 'production']).optional(),
  },
  // You need to destructure all the keys manually
  runtimeEnv: {
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    PORTFOLIO_SECRET_TOKEN: process.env.PORTFOLIO_SECRET_TOKEN,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NODE_ENV: process.env.NODE_ENV,
  },
  // Skip validation in CI/build environments
  skipValidation: isCI,
})

// Runtime validation helpers - use these when you actually need the variables
export const requireEnv = {
  CLERK_SECRET_KEY: () => {
    if (!Env.CLERK_SECRET_KEY) {
      throw new Error('CLERK_SECRET_KEY is required but not set')
    }
    return Env.CLERK_SECRET_KEY
  },
  DATABASE_URL: () => {
    if (!Env.DATABASE_URL) {
      throw new Error('DATABASE_URL is required but not set')
    }
    return Env.DATABASE_URL
  },
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: () => {
    if (!Env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
      throw new Error(
        'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required but not set'
      )
    }
    return Env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  },
}
