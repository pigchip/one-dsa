import { useCallback, useMemo, useState, type ReactNode } from 'react'
import {
  clearState,
  emptyState,
  exportState,
  importState,
  loadState,
  saveState,
  type CardState,
  type ProgressState,
  type Settings,
} from '@/lib/storage'
import { newCard, schedule, type Grade } from '@/lib/srs'
import { isoDay } from '@/lib/date'
import { ProgressContext, type ProgressValue } from './progressContext'

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(() => loadState())

  const persist = useCallback((next: ProgressState) => {
    saveState(next)
    setState(next)
  }, [])

  const cardState = useCallback(
    (id: string): CardState => state.cards[id] ?? newCard(id),
    [state.cards],
  )

  const grade = useCallback(
    (id: string, g: Grade) => {
      const now = Date.now()
      const current = state.cards[id] ?? newCard(id, now)
      const updated = schedule(current, g, now)
      const day = isoDay(now)
      const prior = state.history[day]?.reviews ?? 0
      persist({
        ...state,
        cards: { ...state.cards, [id]: updated },
        history: {
          ...state.history,
          [day]: { date: day, reviews: prior + 1 },
        },
      })
    },
    [state, persist],
  )

  const reset = useCallback(() => {
    clearState()
    setState(emptyState())
  }, [])

  const importJson = useCallback(
    (json: string) => {
      persist(importState(json))
    },
    [persist],
  )

  const exportJson = useCallback(() => exportState(state), [state])

  const updateSettings = useCallback(
    (partial: Partial<Settings>) => {
      persist({ ...state, settings: { ...state.settings, ...partial } })
    },
    [state, persist],
  )

  const value = useMemo<ProgressValue>(
    () => ({ state, cardState, grade, reset, importJson, exportJson, updateSettings }),
    [state, cardState, grade, reset, importJson, exportJson, updateSettings],
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}
