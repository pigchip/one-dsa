import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { LanguageId } from '@/types'
import { LANGUAGE_ORDER } from '@/data/languages'
import {
  LanguageFilterContext,
  type LanguageFilterValue,
} from './languageFilterContext'

export function LanguageFilterProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<LanguageId[]>(LANGUAGE_ORDER)

  const toggle = useCallback((id: LanguageId) => {
    setSelected((prev) => {
      const has = prev.includes(id)
      if (has) {
        // Keep at least one language visible.
        if (prev.length === 1) return prev
        return prev.filter((l) => l !== id)
      }
      // Re-insert in canonical order.
      return LANGUAGE_ORDER.filter((l) => l === id || prev.includes(l))
    })
  }, [])

  const value = useMemo<LanguageFilterValue>(
    () => ({
      selected,
      isSelected: (id) => selected.includes(id),
      toggle,
    }),
    [selected, toggle],
  )

  return (
    <LanguageFilterContext.Provider value={value}>
      {children}
    </LanguageFilterContext.Provider>
  )
}
