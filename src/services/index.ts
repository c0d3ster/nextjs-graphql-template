// Service instances with dependency injection
import { ContactService } from './ContactService'
import { UserService } from './UserService'

// Create services with their dependencies
export const contactService = new ContactService()
export const userService = new UserService()

// Export types for dependency injection
export type { ContactService, UserService }
