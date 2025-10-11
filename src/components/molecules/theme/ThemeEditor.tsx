'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { themeApiClient } from '@/apiClients'
import { hexToRgb, rgbToHex } from '@/utils'

export const ThemeEditor = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['theme'],
    queryFn: () => themeApiClient.getTheme(),
  })

  const { mutate: updateTheme, isPending } = useMutation({
    mutationFn: (colors: {
      primary?: string
      secondary?: string
      accent?: string
      background?: string
      surface?: string
    }) => themeApiClient.updateTheme(colors),
  })

  const [colors, setColors] = useState({
    primary: '',
    secondary: '',
    accent: '',
    background: '',
    surface: '',
  })

  // Read CSS variables directly from the document
  useEffect(() => {
    const style = getComputedStyle(document.documentElement)
    const primaryRgb = style.getPropertyValue('--color-primary').trim()
    const secondaryRgb = style.getPropertyValue('--color-secondary').trim()
    const accentRgb = style.getPropertyValue('--color-accent').trim()
    const backgroundRgb = style.getPropertyValue('--color-background').trim()
    const surfaceRgb = style.getPropertyValue('--color-surface').trim()

    setColors({
      primary: rgbToHex(primaryRgb) || '',
      secondary: rgbToHex(secondaryRgb) || '',
      accent: rgbToHex(accentRgb) || '',
      background: rgbToHex(backgroundRgb) || '',
      surface: rgbToHex(surfaceRgb) || '',
    })
  }, [])

  // Update local state when data loads from API
  useEffect(() => {
    if (data?.colors) {
      setColors({
        primary: rgbToHex(data.colors.primary) || '',
        secondary: rgbToHex(data.colors.secondary) || '',
        accent: rgbToHex(data.colors.accent) || '',
        background: rgbToHex(data.colors.background) || '',
        surface: rgbToHex(data.colors.surface) || '',
      })
    }
  }, [data])

  const handleColorChange = (colorName: string, hexValue: string) => {
    setColors((prev) => ({ ...prev, [colorName]: hexValue }))
  }

  const handleApplyTheme = () => {
    const rgbColors = {
      primary: hexToRgb(colors.primary),
      secondary: hexToRgb(colors.secondary),
      accent: hexToRgb(colors.accent),
      background: hexToRgb(colors.background),
      surface: hexToRgb(colors.surface),
    }

    updateTheme(rgbColors, {
      onSuccess: () => {
        // Update CSS variables for instant preview
        if (rgbColors.primary) {
          document.documentElement.style.setProperty(
            '--color-primary',
            rgbColors.primary
          )
        }
        if (rgbColors.secondary) {
          document.documentElement.style.setProperty(
            '--color-secondary',
            rgbColors.secondary
          )
        }
        if (rgbColors.accent) {
          document.documentElement.style.setProperty(
            '--color-accent',
            rgbColors.accent
          )
        }
        if (rgbColors.background) {
          document.documentElement.style.setProperty(
            '--color-background',
            rgbColors.background
          )
        }
        if (rgbColors.surface) {
          document.documentElement.style.setProperty(
            '--color-surface',
            rgbColors.surface
          )
        }
      },
    })
  }

  return (
    <div className='bg-surface rounded-lg p-6'>
      <h3 className='mb-4 text-xl font-semibold text-white'>
        Theme Customization
      </h3>
      <p className='mb-4 text-sm text-gray-300'>
        Customize the theme colors below and click Apply to see changes
        instantly.
      </p>

      <div className='space-y-4'>
        {/* Primary Color */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div
              className='h-10 w-10 rounded border-2 border-gray-600'
              style={{ backgroundColor: colors.primary }}
            />
            <div>
              <label
                htmlFor='primary-color'
                className='text-sm font-medium text-white'
              >
                Primary
              </label>
              <p className='text-xs text-gray-400'>
                Links, buttons, highlights
              </p>
            </div>
          </div>
          <input
            id='primary-color'
            type='color'
            value={colors.primary}
            onChange={(e) => handleColorChange('primary', e.target.value)}
            className='h-10 w-20 cursor-pointer rounded border border-gray-600 bg-gray-700'
          />
        </div>

        {/* Secondary Color */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div
              className='h-10 w-10 rounded border-2 border-gray-600'
              style={{ backgroundColor: colors.secondary }}
            />
            <div>
              <label
                htmlFor='secondary-color'
                className='text-sm font-medium text-white'
              >
                Secondary
              </label>
              <p className='text-xs text-gray-400'>Secondary accents</p>
            </div>
          </div>
          <input
            id='secondary-color'
            type='color'
            value={colors.secondary}
            onChange={(e) => handleColorChange('secondary', e.target.value)}
            className='h-10 w-20 cursor-pointer rounded border border-gray-600 bg-gray-700'
          />
        </div>

        {/* Accent Color */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div
              className='h-10 w-10 rounded border-2 border-gray-600'
              style={{ backgroundColor: colors.accent }}
            />
            <div>
              <label
                htmlFor='accent-color'
                className='text-sm font-medium text-white'
              >
                Accent
              </label>
              <p className='text-xs text-gray-400'>
                Success states, indicators
              </p>
            </div>
          </div>
          <input
            id='accent-color'
            type='color'
            value={colors.accent}
            onChange={(e) => handleColorChange('accent', e.target.value)}
            className='h-10 w-20 cursor-pointer rounded border border-gray-600 bg-gray-700'
          />
        </div>

        {/* Background Color */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div
              className='h-10 w-10 rounded border-2 border-gray-600'
              style={{ backgroundColor: colors.background }}
            />
            <div>
              <label
                htmlFor='background-color'
                className='text-sm font-medium text-white'
              >
                Background
              </label>
              <p className='text-xs text-gray-400'>Main background color</p>
            </div>
          </div>
          <input
            id='background-color'
            type='color'
            value={colors.background}
            onChange={(e) => handleColorChange('background', e.target.value)}
            className='h-10 w-20 cursor-pointer rounded border border-gray-600 bg-gray-700'
          />
        </div>

        {/* Surface Color */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div
              className='h-10 w-10 rounded border-2 border-gray-600'
              style={{ backgroundColor: colors.surface }}
            />
            <div>
              <label
                htmlFor='surface-color'
                className='text-sm font-medium text-white'
              >
                Surface
              </label>
              <p className='text-xs text-gray-400'>Cards, panels, containers</p>
            </div>
          </div>
          <input
            id='surface-color'
            type='color'
            value={colors.surface}
            onChange={(e) => handleColorChange('surface', e.target.value)}
            className='h-10 w-20 cursor-pointer rounded border border-gray-600 bg-gray-700'
          />
        </div>

        {/* Apply Button */}
        <button
          onClick={handleApplyTheme}
          disabled={isPending || isLoading}
          className='bg-primary hover:bg-primary/80 w-full rounded px-4 py-2 text-white transition-colors disabled:opacity-50'
        >
          {isPending ? 'Applying...' : 'Apply Theme'}
        </button>
      </div>
    </div>
  )
}
