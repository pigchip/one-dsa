import { createContext } from 'react'
import type { ProgressState, Settings } from '@/lib/storage'
import type { CardState } from '@/lib/storage'
import type { Grade } from '@/lib/srs'

export interface ProgressValue {
  state: ProgressState
  /** Current SRS state for a card id, or a fresh (unsaved) new card. */
  cardState: (id: string) => CardState
  /** Apply a grade to a card, persisting the update and today's history. */
  grade: (id: string, grade: Grade) => void
  reset: () => void
  importJson: (json: string) => void
  exportJson: () => string
  updateSettings: (partial: Partial<Settings>) => void
}

export const ProgressContext = createContext<ProgressValue | null>(null)
