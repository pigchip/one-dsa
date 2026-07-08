import { createContext } from 'react'
import type { LanguageId } from '@/types'

export interface LanguageFilterValue {
  /** Currently selected (visible) languages, in canonical order. */
  selected: LanguageId[]
  /** Whether a language is currently selected. */
  isSelected: (id: LanguageId) => boolean
  /** Toggle a language on/off. At least one language always stays selected. */
  toggle: (id: LanguageId) => void
}

export const LanguageFilterContext = createContext<LanguageFilterValue | null>(
  null,
)
