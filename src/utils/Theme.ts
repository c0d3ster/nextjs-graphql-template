/**
 * Utility functions for theme color management
 */

/**
 * Converts a hex color to RGB format for Tailwind CSS variables
 *
 * @param hex - Hex color string (e.g., "#3B82F6" or "3B82F6")
 * @returns RGB string in format "R G B" (e.g., "59 130 246") or null if invalid
 *
 * @example
 * hexToRgb('#3B82F6') // Returns: "59 130 246"
 * hexToRgb('3B82F6')  // Returns: "59 130 246"
 * hexToRgb('#abc')    // Returns: "170 187 204" (shorthand supported)
 */
export const hexToRgb = (hex: string): string | null => {
  // Remove # if present
  const cleanHex = hex.replace(/^#/, '')

  // Handle shorthand hex (e.g., #abc -> #aabbcc)
  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split('')
          .map((char) => char + char)
          .join('')
      : cleanHex

  // Match full hex format
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex)

  if (!result) {
    return null
  }

  const r = Number.parseInt(result[1] ?? '0', 16)
  const g = Number.parseInt(result[2] ?? '0', 16)
  const b = Number.parseInt(result[3] ?? '0', 16)

  return `${r} ${g} ${b}`
}

/**
 * Converts RGB string back to hex format
 *
 * @param rgb - RGB string in format "R G B" (e.g., "59 130 246")
 * @returns Hex color string (e.g., "#3B82F6") or null if invalid
 *
 * @example
 * rgbToHex('59 130 246') // Returns: "#3B82F6"
 */
export const rgbToHex = (rgb: string): string | null => {
  const parts = rgb.trim().split(/\s+/)

  if (parts.length !== 3) {
    return null
  }

  const [r, g, b] = parts.map((part) => Number.parseInt(part, 10))

  if (
    r === undefined ||
    g === undefined ||
    b === undefined ||
    [r, g, b].some((val) => Number.isNaN(val) || val < 0 || val > 255)
  ) {
    return null
  }

  const toHex = (n: number) => n.toString(16).padStart(2, '0')

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}

/**
 * Validates if a string is a valid RGB format for Tailwind
 *
 * @param rgb - RGB string to validate
 * @returns true if valid RGB format
 *
 * @example
 * isValidRgb('59 130 246') // Returns: true
 * isValidRgb('59 130')     // Returns: false
 * isValidRgb('256 0 0')    // Returns: false (values must be 0-255)
 */
export const isValidRgb = (rgb: string): boolean => {
  const parts = rgb.trim().split(/\s+/)

  if (parts.length !== 3) {
    return false
  }

  return parts.every((part) => {
    const num = Number.parseInt(part, 10)
    return !Number.isNaN(num) && num >= 0 && num <= 255
  })
}

/**
 * Validates if a string is a valid hex color
 *
 * @param hex - Hex color string to validate
 * @returns true if valid hex format
 *
 * @example
 * isValidHex('#3B82F6') // Returns: true
 * isValidHex('3B82F6')  // Returns: true
 * isValidHex('#abc')    // Returns: true (shorthand)
 * isValidHex('#gggggg') // Returns: false
 */
export const isValidHex = (hex: string): boolean => {
  const cleanHex = hex.replace(/^#/, '')
  return /^([a-f\d]{3}|[a-f\d]{6})$/i.test(cleanHex)
}
