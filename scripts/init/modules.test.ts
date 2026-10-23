import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import type { ModuleId } from './modules'

import { modules } from './modules'

// Guards the manifest against drift: it must only name things that exist in the template.
const root = process.cwd()
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
  scripts: Record<string, string>
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
}
const installed = new Set([...Object.keys(pkg.dependencies), ...Object.keys(pkg.devDependencies)])
const ids = Object.keys(modules) as ModuleId[]

describe('module manifest', () => {
  ids.forEach((id) => {
    describe(id, () => {
      it('has an id that matches its key', () => {
        expect(modules[id].id).toBe(id)
      })

      it('lists paths that exist', () => {
        const missing = modules[id].paths.filter((path) => !existsSync(join(root, path)))

        expect(missing).toEqual([])
      })

      it('lists packages that are installed', () => {
        const missing = modules[id].packages.filter((name) => !installed.has(name))

        expect(missing).toEqual([])
      })

      it('lists scripts that exist in package.json', () => {
        const missing = [
          ...modules[id].scripts,
          ...Object.keys(modules[id].scriptReplacements),
        ].filter((name) => !(name in pkg.scripts))

        expect(missing).toEqual([])
      })

      it('only requires modules that exist', () => {
        const unknown = [...modules[id].requires, ...(modules[id].derivedFrom ?? [])].filter(
          (other) => !ids.includes(other)
        )

        expect(unknown).toEqual([])
      })
    })
  })
})
