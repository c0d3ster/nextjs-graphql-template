import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'

import { Env } from '@/libs/Env'
import { themeService } from '@/services'
import { isValidRgb } from '@/utils'

import type { GraphQLContext } from '../context'
import type { ThemeColors } from '../schema/theme'

import { Theme, ThemeColorsInput } from '../schema/theme'

/**
 * GraphQL resolver for theme management
 */
@Resolver()
export class ThemeResolver {
  /**
   * Get current theme configuration from global.css
   */
  @Query(() => Theme, {
    description: 'Get current theme colors and CSS from global.css',
  })
  async getTheme(): Promise<Theme> {
    // Fetch actual theme colors from global.css
    const colors = await themeService.getThemeColors()

    const css = this.generateCSS(colors)

    return { colors, css }
  }

  /**
   * Update theme colors (requires authentication)
   */
  @Mutation(() => Theme, {
    description:
      'Update theme colors (RGB format: "R G B" e.g., "59 130 246"). Requires portfolio site authentication.',
  })
  async updateTheme(
    @Arg('colors', () => ThemeColorsInput)
    colorsInput: ThemeColorsInput,
    @Ctx() context: GraphQLContext
  ): Promise<Theme> {
    // Verify authentication from portfolio site
    this.verifyPortfolioAuth(context)

    // Validate RGB format for all provided colors
    const invalidColors: string[] = []

    for (const [key, value] of Object.entries(colorsInput)) {
      if (value && !isValidRgb(value)) {
        invalidColors.push(key)
      }
    }

    if (invalidColors.length > 0) {
      throw new Error(
        `Invalid RGB format for: ${invalidColors.join(', ')}. Expected format: "R G B" (e.g., "59 130 246")`
      )
    }

    // Get current theme colors
    const currentColors = await themeService.getThemeColors()

    // Merge with new colors
    const updatedColors: ThemeColors = {
      ...currentColors,
      ...colorsInput,
    }

    // Update global.css file with new colors
    await themeService.updateThemeColors(colorsInput)

    const css = this.generateCSS(updatedColors)

    return { colors: updatedColors, css }
  }

  /**
   * Verify authentication from portfolio site
   */
  private verifyPortfolioAuth(context: GraphQLContext): void {
    const portfolioToken = context.req.headers.get('x-portfolio-token')
    const expectedToken = Env.PORTFOLIO_SECRET_TOKEN

    // If no token is configured, allow updates (development mode)
    if (!expectedToken) {
      return
    }

    // Verify token matches
    if (!portfolioToken || portfolioToken !== expectedToken) {
      throw new Error(
        'Unauthorized: Invalid or missing portfolio authentication token'
      )
    }
  }

  /**
   * Generate CSS string from theme colors
   */
  private generateCSS(colors: ThemeColors): string {
    const cssVars = Object.entries(colors)
      .map(([key, value]) => `  --color-${key}: ${value};`)
      .join('\n')

    return `:root {\n${cssVars}\n}`
  }
}
