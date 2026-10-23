import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { applySelection } from './apply'
import { modules, selectableIds } from './modules'
import { resolveSelection } from './select'

type Args = {
  features?: string[]
  dryRun: boolean
  skipInstall: boolean
  skipFormat: boolean
  keepTooling: boolean
  root: string
}

const USAGE = `Usage: npm run init -- --features=<list> [options]

  --features=a,b,c   Features to keep (${selectableIds.join(', ')}).
                     Unknown ids (design, seo, ...) are ignored.
                     Use --features= to keep none.
  --config=<file>    JSON file: { "features": ["database", "auth"] }
  --dry-run          Print what would change without touching anything
  --skip-install     Do not refresh package-lock.json
  --skip-format      Do not run prettier on changed files
  --keep-tooling     Keep the init scripts (for working on the template itself)
  --root=<dir>       Project root (defaults to the current directory)
`

const parseFeatures = (value: string): string[] =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

const readConfig = (path: string): string[] => {
  const parsed: unknown = JSON.parse(readFileSync(path, 'utf8'))
  const features =
    typeof parsed === 'object' && parsed !== null && 'features' in parsed
      ? parsed.features
      : undefined
  if (!Array.isArray(features) || !features.every((item) => typeof item === 'string')) {
    throw new Error(`${path}: expected { "features": string[] }`)
  }
  return features
}

const parseArgs = (argv: string[]): Args => {
  const args: Args = {
    dryRun: false,
    skipInstall: false,
    skipFormat: false,
    keepTooling: false,
    root: process.cwd(),
  }

  argv.forEach((arg) => {
    const [flag, ...rest] = arg.split('=')
    const value = rest.join('=')
    if (flag === '--features') args.features = parseFeatures(value)
    else if (flag === '--config') args.features = readConfig(resolve(value))
    else if (flag === '--root') args.root = resolve(value)
    else if (flag === '--dry-run') args.dryRun = true
    else if (flag === '--skip-install') args.skipInstall = true
    else if (flag === '--skip-format') args.skipFormat = true
    else if (flag === '--keep-tooling') args.keepTooling = true
    else throw new Error(`Unknown option: ${arg}\n\n${USAGE}`)
  })

  return args
}

const main = (): void => {
  const args = parseArgs(process.argv.slice(2))

  if (args.features === undefined) {
    process.stdout.write(USAGE)
    process.exit(1)
  }

  const selection = resolveSelection(args.features)

  if (selection.ignored.length > 0) {
    process.stdout.write(`Ignoring features with no template code: ${selection.ignored.join(', ')}\n`)
  }
  if (selection.added.length > 0) {
    process.stdout.write(`Also keeping (required by your selection): ${selection.added.join(', ')}\n`)
  }

  const kept = (Object.keys(modules) as Array<keyof typeof modules>)
    .filter((id) => selection.enabled.has(id))
    .join(', ')
  process.stdout.write(`Keeping: ${kept || 'nothing (base template only)'}\n\n`)

  applySelection({
    root: args.root,
    selection,
    dryRun: args.dryRun,
    skipInstall: args.skipInstall,
    skipFormat: args.skipFormat,
    keepTooling: args.keepTooling,
    log: (message) => process.stdout.write(`  ${message}\n`),
  })

  process.stdout.write(args.dryRun ? '\nDry run, nothing changed.\n' : '\nDone. Run `npm install` to refresh node_modules.\n')
}

try {
  main()
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`)
  process.exit(1)
}
