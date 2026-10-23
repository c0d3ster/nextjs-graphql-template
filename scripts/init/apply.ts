import { execSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'

import type { ModuleId } from './modules'
import type { Selection } from './select'

import { modules } from './modules'
import { hasMarkers, stripText } from './strip'

type ApplyOptions = {
  root: string
  selection: Selection
  dryRun?: boolean
  // Leave package-lock.json alone (local verification runs)
  skipInstall?: boolean
  skipFormat?: boolean
  // Keep the init tooling after running (for developing the template itself)
  keepTooling?: boolean
  log?: (message: string) => void
}

type PackageJson = {
  scripts?: Record<string, string>
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

const TEXT_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.mjs',
  '.cjs',
  '.mts',
  '.css',
  '.md',
  '.yml',
  '.yaml',
  '.json',
  '.toml',
])
const PRETTIER_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.mjs', '.cjs', '.mts', '.css', '.md', '.yml', '.yaml', '.json'])
const TEXT_FILENAMES = new Set(['.env', '.env.production', '.gitignore'])
const SKIP_DIRS = new Set(['node_modules', '.git', '.next', 'coverage', 'out'])
const SKIP_FILES = new Set(['package-lock.json'])

const extensionOf = (name: string): string => {
  const dot = name.lastIndexOf('.')
  return dot === -1 ? '' : name.slice(dot)
}

const isTextFile = (name: string): boolean =>
  TEXT_FILENAMES.has(name) || TEXT_EXTENSIONS.has(extensionOf(name))

const walk = (dir: string, root: string, skip: ReadonlySet<string>): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name)
    const rel = relative(root, full).split('\\').join('/')
    if (skip.has(rel)) return []
    if (entry.isDirectory()) return SKIP_DIRS.has(entry.name) ? [] : walk(full, root, skip)
    if (SKIP_FILES.has(entry.name) || !isTextFile(entry.name)) return []
    return [full]
  })

// Modules that are off: every module not in the selection
const disabledModules = (enabled: ReadonlySet<ModuleId>): ModuleId[] =>
  (Object.keys(modules) as ModuleId[]).filter((id) => !enabled.has(id))

export const applySelection = ({
  root,
  selection,
  dryRun = false,
  skipInstall = false,
  skipFormat = false,
  keepTooling = false,
  log = (): void => {},
}: ApplyOptions): void => {
  // The init module is tooling: it is "off" after a run unless asked to stay
  const enabled = new Set<ModuleId>(selection.enabled)
  if (keepTooling) enabled.add('init')
  const disabled = disabledModules(enabled)
  const touched: string[] = []

  // 1. Delete files and folders that belong to switched-off modules
  const deleted = new Set<string>()
  const isCovered = (path: string): boolean =>
    Array.from(deleted).some((gone) => path === gone || path.startsWith(`${gone}/`))
  disabled.forEach((id) => {
    modules[id].paths.forEach((path) => {
      // Already removed, directly or because a parent folder went first
      if (isCovered(path)) return
      const full = join(root, path)
      if (!existsSync(full)) {
        throw new Error(`Manifest drift: ${id} lists "${path}" but it does not exist`)
      }
      log(`remove ${path}`)
      if (!dryRun) rmSync(full, { recursive: true, force: true })
      deleted.add(path)
    })
  })

  // 1b. Rewrite files whose content depends on the module being off
  disabled.forEach((id) => {
    Object.entries(modules[id].writes).forEach(([path, content]) => {
      const full = join(root, path)
      if (!existsSync(dirname(full))) return
      log(`rewrite ${path}`)
      if (!dryRun) writeFileSync(full, content)
    })
  })

  // 2. Strip marked lines and regions from the files that remain
  // Marker syntax appears inside the engine's own sources and tests, so never scan them
  const skip = new Set(['scripts/init'])
  if (!dryRun) {
    walk(root, root, skip).forEach((file) => {
      const original = readFileSync(file, 'utf8')
      if (!hasMarkers(original)) return
      const label = relative(root, file).split('\\').join('/')
      const next = stripText(original, enabled, label)
      if (next === original) return
      writeFileSync(file, next)
      touched.push(file)
      log(`update ${label}`)
    })
  }

  // 3. package.json: scripts, replacements and unused packages
  const packagePath = join(root, 'package.json')
  const pkg = JSON.parse(readFileSync(packagePath, 'utf8')) as PackageJson
  const keepPackages = new Set(
    (Object.keys(modules) as ModuleId[])
      .filter((id) => enabled.has(id))
      .flatMap((id) => modules[id].packages)
  )

  disabled.forEach((id) => {
    modules[id].scripts.forEach((name) => {
      if (pkg.scripts && name in pkg.scripts) {
        log(`script  - ${name}`)
        delete pkg.scripts[name]
      }
    })
    Object.entries(modules[id].scriptReplacements).forEach(([name, command]) => {
      if (!pkg.scripts) return
      log(`script  ~ ${name}`)
      pkg.scripts[name] = command
    })
    modules[id].packages.forEach((name) => {
      if (keepPackages.has(name)) return
      if (pkg.dependencies && name in pkg.dependencies) {
        log(`package - ${name}`)
        delete pkg.dependencies[name]
      }
      if (pkg.devDependencies && name in pkg.devDependencies) {
        log(`package - ${name}`)
        delete pkg.devDependencies[name]
      }
    })
  })

  if (!dryRun) {
    writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`)
    touched.push(packagePath)
  }

  // 4. Keep the lockfile in step with package.json
  if (!dryRun && !skipInstall) {
    log('sync package-lock.json')
    execSync('npm install --package-lock-only --ignore-scripts', {
      cwd: root,
      stdio: 'ignore',
    })
  }

  // 5. Tidy blank lines and indentation left behind by removed blocks
  const formattable = touched.filter((file) => PRETTIER_EXTENSIONS.has(extensionOf(file)))
  if (!dryRun && !skipFormat && formattable.length > 0) {
    log('format changed files')
    try {
      execSync(`npx prettier --write ${formattable.map((file) => `"${file}"`).join(' ')}`, {
        cwd: root,
        stdio: 'ignore',
      })
    } catch {
      log('prettier failed, run `npm run format` manually')
    }
  }
}
