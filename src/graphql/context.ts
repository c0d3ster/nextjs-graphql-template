import type { NextRequest } from 'next/server'

import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'

import { db } from '@/libs/DB'
import { logger } from '@/libs/Logger'
import { schemas } from '@/models'

export type GraphQLContext = {
  userId?: string
  user?: typeof schemas.users.$inferSelect | null
  db: typeof db
  schemas: typeof schemas
  req: NextRequest
}

export async function createContext(req: NextRequest): Promise<GraphQLContext> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return { db, schemas, req }
    }

    // Get user from database
    try {
      const user = await db.query.users.findFirst({
        where: eq(schemas.users.clerkId, userId),
      })

      if (!user) {
        return { userId, db, schemas, req }
      }

      return { userId, user, db, schemas, req }
    } catch (error) {
      // Preserve userId even if DB query fails
      logger.error('Database query failed in GraphQL context', {
        error: String(error),
        userId,
      })
      return { userId, db, schemas, req }
    }
  } catch (error) {
    // Auth failed, return empty context
    logger.error('Authentication failed in GraphQL context', {
      error: String(error),
    })
    return { db, schemas, req }
  }
}
