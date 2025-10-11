import 'reflect-metadata'
import type { GraphQLSchema } from 'graphql'

import { buildSchema } from 'type-graphql'

import { contactService, userService } from '@/services'

import { createContext } from './context'
import { ContactResolver, UserResolver } from './resolvers'

// --- Singleton schema caching (important for Next.js) ---
let schemaPromise: Promise<GraphQLSchema> | null = null

async function createSchema(): Promise<GraphQLSchema> {
  if (!schemaPromise) {
    schemaPromise = buildSchema({
      resolvers: [ContactResolver, UserResolver],
      validate: false,
      container: {
        get(someClass) {
          if (someClass === ContactResolver)
            return new ContactResolver(contactService)
          if (someClass === UserResolver) return new UserResolver(userService)
          return new (someClass as any)()
        },
      },
    })
  }
  return schemaPromise
}

export { createContext, createSchema }
