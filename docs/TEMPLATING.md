# How the Templating Works

This is for people changing the template itself. To just pick features, see
[Choosing Features](../README.md#-choosing-features) in the README.

Nothing is generated from scratch. The repo is a complete app, and `npm run init` subtracts from it
(`scripts/init/apply.ts`). A run goes in this order:

1. **Resolve the selection.** Requested ids are filtered to the selectable features, required ones are
   pulled in (`auth` adds `database`), then derived ones are added (`graphql` is kept whenever `auth` or
   `email` is). A feature the chosen variant does not have is an error.
2. **Apply the variant.** Delete the other variant's files, then copy `variants/<name>/files` over the
   project root. Overlay files replace the originals, so `README.md`, `drizzle.config.ts` and others are
   swapped for their variant versions.
3. **Delete files.** Every switched-off feature lists the paths it owns in `scripts/init/modules.ts`.
4. **Rewrite files** that must differ when a feature is off (for example an empty migration journal).
5. **Strip markers** from the files that remain (see below).
6. **Update `package.json`.** Remove the scripts and npm packages of switched-off features, unless a kept
   feature also lists the package. The script then flags any kept file that still imports a pruned package.
7. **Sync and tidy.** Refresh `package-lock.json`, then run Prettier on the files that changed.

The manifest checks itself: if a feature lists a path that no longer exists, the run fails with
"Manifest drift" instead of silently skipping it.

## Markers

Code that belongs to a feature but sits in a shared file (a provider, a CI step, an env var, a line of
the README) is tagged with `@module:<id>`. A marker works inside any comment syntax: `//`, `#`, `/* */`,
`<!-- -->` and `{/* */}`.

| Form                                                          | Keeps the code when          |
| ------------------------------------------------------------- | ---------------------------- |
| `code // @module:<feature>`                                   | the feature is on (one line) |
| `#region @module:<feature>` to `#endregion @module:<feature>` | the feature is on (a block)  |

Put a `!` in front of the id to invert it (kept when the feature is off), and join terms with `+` to
require all of them (`<a>` on and `!<b>`, so `b` off).

Browse any file under `src/` or `.github/` for real examples, or the README's own source.

- Marker lines are always removed. A line that was only a marker comment disappears with it.
- Regions can nest. An `#endregion` must repeat the exact spec of its `#region`, and an unclosed or
  mismatched region fails the run with the file and line.
- The ids are the features (`database`, `auth`, `email`, `realtime`), the derived `graphql`, and the
  chosen variant's flag (`clerk` or `supabase`), so a line can be specific to one provider.
- Files without a marker are never rewritten. `scripts/init` and `variants` are skipped while stripping.
- Never write a real tag in prose (this file included). The stripper reads any `@module:` followed by
  letters, `!`, `+` or `_`, so use `<feature>` placeholders in docs.

The README is templated the same way, so the docs a project ships with only describe what it kept.

## Variants

A variant is an overlay defined in `scripts/init/variants.ts`:

- `overlay`: the folder copied over the project (`variants/supabase/files`)
- `removePaths` and `removePackages`: what only the other variant uses
- `scripts`: package scripts to add and remove (`db:push` instead of `db:migrate`)
- `modules`: per-feature overrides of the paths and packages a feature owns under that variant
- `impliedBy`: features that choose the variant when `--variant` is not given

Both variants' packages stay in `package.json` while this is a template, so Dependabot keeps them current.
Each run prunes the other's.

## Adding a feature

1. Add an entry to `modules` in `scripts/init/modules.ts` with its `paths`, `packages`, `scripts`, and
   `requires`. Add the id to `selectableIds` if users can pick it.
2. Tag shared-file code with `@module:<id>` markers.
3. Add the feature to a preset in `.github/workflows/feature-matrix.yml`.
4. Run `npm test`. The init suites cover the manifest, selection, stripping, import checks and variants.

The feature matrix workflow runs init for every preset, reinstalls from the pruned lockfile, then type
checks, lints, tests, checks for unused files and dependencies, and builds.
