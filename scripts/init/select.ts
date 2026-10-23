import type { ModuleId } from './modules'

import { modules, selectableIds } from './modules'

export type Selection = {
  enabled: ReadonlySet<ModuleId>
  // Modules switched on only because another selected module requires them
  added: ModuleId[]
  // Requested ids that are not template modules (design, SEO, and so on)
  ignored: string[]
}

const isSelectable = (id: string): id is ModuleId =>
  (selectableIds as readonly string[]).includes(id)

// Turns a requested feature list into the full set of modules to keep:
// drops unknown ids, pulls in required modules, then applies derived modules.
export const resolveSelection = (requested: readonly string[]): Selection => {
  const enabled = new Set<ModuleId>()
  const added: ModuleId[] = []
  const ignored: string[] = []

  requested.forEach((id) => {
    if (isSelectable(id)) enabled.add(id)
    else ignored.push(id)
  })

  // Pull in requirements until nothing changes (handles chains)
  let changed = true
  while (changed) {
    changed = false
    Array.from(enabled).forEach((id) => {
      modules[id].requires.forEach((required) => {
        if (enabled.has(required)) return
        enabled.add(required)
        added.push(required)
        changed = true
      })
    })
  }

  Object.values(modules).forEach((definition) => {
    if (definition.derivedFrom?.some((source) => enabled.has(source))) {
      enabled.add(definition.id)
    }
  })

  return { enabled, added, ignored }
}
