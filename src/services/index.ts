// Service instances with dependency injection
import { ContactService } from './ContactService'
import { ThemeService } from './ThemeService'
import { UserService } from './UserService'

// Create services with their dependencies
export const contactService = new ContactService()
export const themeService = new ThemeService()
export const userService = new UserService()

// Export types for dependency injection
export type { ContactService, ThemeService, UserService }
