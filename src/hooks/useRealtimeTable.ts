'use client'

import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

import { useEffect, useRef } from 'react'

import { createClient, isSupabaseConfigured } from '@/libs/supabase/client'

type RealtimeRow = Record<string, unknown>

type UseRealtimeTableOptions<T extends RealtimeRow> = {
  table: string
  schema?: string
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
  // PostgREST-style filter, e.g. `auth_id=eq.${authId}`
  filter?: string
  onChange: (payload: RealtimePostgresChangesPayload<T>) => void
}

// Subscribes to Postgres changes on a table for the lifetime of the component.
// The table must be in the supabase_realtime publication and have an RLS select policy
// for the signed-in user, otherwise no events are delivered. A typical onChange refetches
// the matching Apollo query: `onChange: () => refetch()`.
export const useRealtimeTable = <T extends RealtimeRow>({
  table,
  schema = 'public',
  event = '*',
  filter,
  onChange,
}: UseRealtimeTableOptions<T>): void => {
  // Keep the latest callback without resubscribing on every render
  const onChangeRef = useRef(onChange)

  useEffect((): void => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect((): (() => void) | void => {
    if (!isSupabaseConfigured()) return

    const supabase = createClient()
    const channel = supabase
      .channel(`realtime:${schema}:${table}:${filter ?? 'all'}`)
      .on<T>(
        'postgres_changes',
        { event, schema, table, ...(filter ? { filter } : {}) },
        (payload): void => onChangeRef.current(payload)
      )
      .subscribe()

    return (): void => {
      void supabase.removeChannel(channel)
    }
  }, [table, schema, event, filter])
}
