import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { drizzle } from 'drizzle-orm/node-postgres'

import { schemas } from '@/models'

import { Env, requireEnv } from './Env'

// Stores the db connection in the global scope to prevent multiple instances due to hot reloading with Next.js
const globalForDb = globalThis as unknown as {
  drizzle: NodePgDatabase<typeof schemas>
}

// Need a database for production? Check out https://www.prisma.io/?via=nextjsboilerplate
// Tested and compatible with Next.js Boilerplate
const createDbConnection = () => {
  const databaseUrl = requireEnv.DATABASE_URL()
  return drizzle({
    connection: {
      connectionString: databaseUrl,
      ssl:
        !databaseUrl.includes('localhost') &&
        !databaseUrl.includes('127.0.0.1'),
    },
    schema: schemas,
  })
}

const db = globalForDb.drizzle || createDbConnection()

// Only store in global during development to prevent hot reload issues
if (Env.NODE_ENV !== 'production') {
  globalForDb.drizzle = db
}

export { db }
