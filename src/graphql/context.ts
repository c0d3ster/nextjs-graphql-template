import type { NextRequest } from 'next/server'

import { eq } from 'drizzle-orm'

import { db } from '@/libs/DB'
import { logger } from '@/libs/Logger'
import { isSupabaseConfigured } from '@/libs/supabase/client'
import { getAuthId } from '@/libs/supabase/server'
import { schemas } from '@/models'

export type GraphQLContext = {
  authId?: string
  user?: typeof schemas.users.$inferSelect | null
  db: typeof db
  schemas: typeof schemas
  req: NextRequest
}

export const createContext = async (
  req: NextRequest
): Promise<GraphQLContext> => {
  if (!isSupabaseConfigured()) {
    return { db, schemas, req }
  }

  try {
    const authId = await getAuthId()

    if (!authId) {
      return { db, schemas, req }
    }

    // Get user from database
    try {
      const user = await db.query.users.findFirst({
        where: eq(schemas.users.authId, authId),
      })

      if (!user) {
        return { authId, db, schemas, req }
      }

      return { authId, user, db, schemas, req }
    } catch (error) {
      // Preserve authId even if DB query fails
      logger.error('Database query failed in GraphQL context', {
        error: String(error),
        authId,
      })
      return { authId, db, schemas, req }
    }
  } catch (error) {
    // Auth failed, return empty context
    logger.error('Authentication failed in GraphQL context', {
      error: String(error),
    })
    return { db, schemas, req }
  }
}
