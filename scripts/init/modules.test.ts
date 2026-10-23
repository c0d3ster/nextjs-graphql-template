import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import type { ModuleId } from './modules'

import { getModules, variantIds, variants } from './variants'

// Guards the manifest against drift: each variant's modules may only name things that exist
// in the template once that variant's overlay is applied.
const root = process.cwd()
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
  scripts: Record<string, string>
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
}
const installed = new Set([...Object.keys(pkg.dependencies), ...Object.keys(pkg.devDependencies)])

const covers = (parent: string, path: string): boolean => path === parent || path.startsWith(`${parent}/`)

const existsInVariant = (variantId: (typeof variantIds)[number], path: string): boolean => {
  const variant = variants[variantId]
  const removed = variant.removePaths.some((gone) => covers(gone, path))
  if (!removed && existsSync(join(root, path))) return true
  return variant.overlay ? existsSync(join(root, variant.overlay, path)) : false
}

variantIds.forEach((variantId) => {
  const variant = variants[variantId]
  const defs = getModules(variantId)
  const ids = Object.keys(defs) as ModuleId[]

  describe(`module manifest (${variantId})`, () => {
    it('removes only paths that exist in the project', () => {
      const missing = variant.removePaths.filter((path) => !existsSync(join(root, path)))

      expect(missing).toEqual([])
    })

    it('removes only packages that are installed', () => {
      expect(variant.removePackages.filter((name) => !installed.has(name))).toEqual([])
    })

    it('has an overlay folder when it declares one', () => {
      expect(variant.overlay === undefined || existsSync(join(root, variant.overlay))).toBe(true)
    })

    ids.forEach((id) => {
      describe(id, () => {
        it('has an id that matches its key', () => {
          expect(defs[id].id).toBe(id)
        })

        it('lists paths that exist', () => {
          const missing = defs[id].paths.filter((path) => !existsInVariant(variantId, path))

          expect(missing).toEqual([])
        })

        it('lists packages that are installed', () => {
          expect(defs[id].packages.filter((name) => !installed.has(name))).toEqual([])
        })

        it('lists scripts that exist', () => {
          const known = (name: string): boolean => name in pkg.scripts || name in variant.scripts.set
          const missing = [...defs[id].scripts, ...Object.keys(defs[id].scriptReplacements)].filter(
            (name) => !known(name)
          )

          expect(missing).toEqual([])
        })

        it('only requires modules that exist', () => {
          const unknown = [...defs[id].requires, ...(defs[id].derivedFrom ?? [])].filter(
            (other) => !ids.includes(other)
          )

          expect(unknown).toEqual([])
        })
      })
    })
  })
})

describe('markers', () => {
  it('only reference known modules or variant flags', () => {
    const known = new Set<string>([...Object.keys(getModules('clerk-neon')), 'clerk', 'supabase'])
    const files = execSync('git ls-files --cached --others --exclude-standard', {
      cwd: root,
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024,
    })
      .split('\n')
      .filter((file) => file !== '' && !file.startsWith('scripts/init/') && existsSync(join(root, file)))
      .filter((file) => !/\.(?:png|jpe?g|gif|ico|svg|woff2?|lock)$/.test(file) && file !== 'package-lock.json')

    const unknown: string[] = []
    files.forEach((file) => {
      const text = readFileSync(join(root, file), 'utf8')
      Array.from(text.matchAll(/@module:([!a-z_+]+)/g)).forEach((match) => {
        ;(match[1] ?? '').split('+').forEach((term) => {
          const id = term.replace(/^!/, '')
          if (!known.has(id)) unknown.push(`${file}: ${match[0]}`)
        })
      })
    })

    expect(unknown).toEqual([])
  })
})
