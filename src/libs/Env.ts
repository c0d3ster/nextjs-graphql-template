import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const Env = createEnv({
  server: {
    CLERK_SECRET_KEY: z.string().optional(),
    CLERK_WEBHOOK_SECRET: z.string().optional(),
    DATABASE_URL: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
    PROJECT_LOGO_KEY: z.string().optional(),
    R2_ACCOUNT_ID: z.string().optional(),
    R2_ACCESS_KEY_ID: z.string().optional(),
    R2_SECRET_ACCESS_KEY: z.string().optional(),
    R2_BUCKET_NAME: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().optional(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
  },
  shared: {
    NODE_ENV: z.enum(['test', 'development', 'production']).optional(),
  },
  // You need to destructure all the keys manually
  runtimeEnv: {
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    PROJECT_LOGO_KEY: process.env.PROJECT_LOGO_KEY,
    R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NODE_ENV: process.env.NODE_ENV,
  },
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
