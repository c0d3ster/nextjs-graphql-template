import fs from 'node:fs/promises'
import path from 'node:path'

/**
 * Service for managing theme configuration
 */
export class ThemeService {
  private readonly cssFilePath = path.join(
    process.cwd(),
    'src/styles/global.css'
  )

  /**
   * Get current theme colors from global.css
   */
  async getThemeColors(): Promise<{
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
  }> {
    const cssContent = await fs.readFile(this.cssFilePath, 'utf-8')

    const primary = this.extractColorValue(cssContent, 'primary')
    const secondary = this.extractColorValue(cssContent, 'secondary')
    const accent = this.extractColorValue(cssContent, 'accent')
    const background = this.extractColorValue(cssContent, 'background')
    const surface = this.extractColorValue(cssContent, 'surface')

    if (!primary || !secondary || !accent || !background || !surface) {
      throw new Error('Theme colors not found in global.css')
    }

    return { primary, secondary, accent, background, surface }
  }

  /**
   * Update theme colors in global.css
   */
  async updateThemeColors(colors: {
    primary?: string
    secondary?: string
    accent?: string
    background?: string
    surface?: string
  }): Promise<void> {
    const cssContent = await fs.readFile(this.cssFilePath, 'utf-8')
    let updatedContent = cssContent

    // Update each provided color
    for (const [colorName, colorValue] of Object.entries(colors)) {
      if (colorValue) {
        const regex = new RegExp(`--color-${colorName}:\\s*[^;]+;`, 'g')
        updatedContent = updatedContent.replace(
          regex,
          `--color-${colorName}: ${colorValue};`
        )
      }
    }

    // Write updated content back to file
    await fs.writeFile(this.cssFilePath, updatedContent, 'utf-8')
  }

  /**
   * Extract a specific color value from CSS content
   */
  private extractColorValue(
    cssContent: string,
    colorName: string
  ): string | null {
    // Match --color-{name}: {value};
    const regex = new RegExp(`--color-${colorName}:\\s*([^;]+);`)
    const match = cssContent.match(regex)

    if (!match || !match[1]) {
      return null
    }

    // Clean up the value (remove comments, template placeholders, etc.)
    const value = match[1].trim()

    // Skip template placeholders like {{PRIMARY_COLOR}}
    if (value.startsWith('{{') && value.endsWith('}}')) {
      return null
    }

    return value
  }
}
