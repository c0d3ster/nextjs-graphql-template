import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { stripText } from './strip'

// The supabase overlay replaces README.md, so the two files must be kept in step.
// Everything that is not specific to a provider has to read the same in both.
const root = process.cwd()
const read = (path: string): string => readFileSync(join(root, path), 'utf8').replace(/\r\n/g, '\n')

const base = read('README.md')
const overlay = read('variants/supabase/files/README.md')

const CHOOSING_START = '## 🧩 Choosing Features'
const CHOOSING_END = '<!-- #endregion @module:init -->'

const choosingFeatures = (text: string): string => {
  const start = text.indexOf(CHOOSING_START)
  const end = text.indexOf(CHOOSING_END, start)
  return start === -1 || end === -1 ? '' : text.slice(start, end)
}

const linesTagged = (text: string, id: string): string[] =>
  text.split('\n').filter((line) => line.includes(`@module:${id}`) && line.startsWith('   '))

describe('variant README', () => {
  it('has the same Choosing Features section as the root README', () => {
    expect(choosingFeatures(base)).not.toBe('')
    expect(choosingFeatures(overlay)).toBe(choosingFeatures(base))
  })

  it('has the same init lines in Quick Start', () => {
    expect(linesTagged(overlay, 'init').length).toBeGreaterThan(0)
    expect(linesTagged(overlay, 'init')).toEqual(linesTagged(base, 'init'))
  })

  it('has the same file_uploads env vars', () => {
    expect(linesTagged(base, 'file_uploads').length).toBeGreaterThan(0)
    expect(linesTagged(overlay, 'file_uploads')).toEqual(linesTagged(base, 'file_uploads'))
  })

  it('mentions the optional Codecov token', () => {
    expect(overlay).toContain('CODECOV_TOKEN')
  })

  it('strips cleanly for every feature combination', () => {
    const flagSets = [[], ['init'], ['database', 'auth', 'email', 'file_uploads', 'graphql', 'realtime', 'supabase']]
    flagSets.forEach((flags) => {
      expect(() => stripText(overlay, new Set(flags), 'variants/supabase/files/README.md')).not.toThrow()
      expect(() => stripText(base, new Set(flags), 'README.md')).not.toThrow()
    })
  })
})
