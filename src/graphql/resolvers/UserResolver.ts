import { Query, Resolver } from 'type-graphql'

import type { UserService } from '@/services'

import { User } from '@/graphql/schema'
import { logger } from '@/libs/Logger'

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => User, { nullable: true })
  async me() {
    try {
      const user = await this.userService.getCurrentUserWithAuth()
      return user
    } catch (error) {
      logger.error('Error in me query', { error: String(error) })
      return null
    }
  }
}
