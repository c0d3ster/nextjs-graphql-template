import type { NextRequest } from 'next/server'

import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'

import { db } from '@/libs/DB'
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
    } catch {
      // Preserve userId even if DB query fails
      return { userId, db, schemas, req }
    }
  } catch {
    // Auth failed, return empty context
    return { db, schemas, req }
  }
}
