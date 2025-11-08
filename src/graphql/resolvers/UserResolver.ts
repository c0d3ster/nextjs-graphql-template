import { Arg, ID, Mutation, Query, Resolver } from 'type-graphql'

import type { UpdateUserInput } from '@/graphql/schema'
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

  @Query(() => User, { nullable: true })
  async user(@Arg('id', () => ID) id: string) {
    try {
      const user = await this.userService.getUserById(id)
      return user
    } catch (error) {
      logger.error('Error in user query', { error: String(error), id })
      return null
    }
  }

  @Mutation(() => User)
  async updateUser(
    @Arg('id', () => ID) id: string,
    @Arg('input') input: UpdateUserInput
  ) {
    try {
      const user = await this.userService.updateUser(id, input)
      return user
    } catch (error) {
      logger.error('Error in updateUser mutation', {
        error: String(error),
        id,
      })
      throw error
    }
  }
}
