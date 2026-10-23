import { describe, expect, it } from 'vitest'

import { resolveSelection } from './select'

const sorted = (set: ReadonlySet<string>): string[] => Array.from(set).sort()

describe('resolveSelection', () => {
  it('keeps only the requested module and what it derives', () => {
    const { enabled, added } = resolveSelection(['email'])

    expect(sorted(enabled)).toEqual(['email', 'graphql'])
    expect(added).toEqual([])
  })

  it('pulls in required modules and reports them', () => {
    const { enabled, added } = resolveSelection(['auth'])

    expect(sorted(enabled)).toEqual(['auth', 'database', 'graphql'])
    expect(added).toEqual(['database'])
  })

  it('does not report a requirement that was already selected', () => {
    const { added } = resolveSelection(['auth', 'database'])

    expect(added).toEqual([])
  })

  it('keeps the database without GraphQL when nothing needs GraphQL', () => {
    const { enabled } = resolveSelection(['database'])

    expect(sorted(enabled)).toEqual(['database'])
  })

  it('keeps nothing for an empty request', () => {
    expect(sorted(resolveSelection([]).enabled)).toEqual([])
  })

  it('ignores features that have no template code', () => {
    const { enabled, ignored } = resolveSelection(['seo', 'custom_design', 'email'])

    expect(sorted(enabled)).toEqual(['email', 'graphql'])
    expect(ignored).toEqual(['seo', 'custom_design'])
  })

  it('does not let callers pick derived or tooling modules directly', () => {
    const { enabled, ignored } = resolveSelection(['graphql', 'init'])

    expect(sorted(enabled)).toEqual([])
    expect(ignored).toEqual(['graphql', 'init'])
  })
})
