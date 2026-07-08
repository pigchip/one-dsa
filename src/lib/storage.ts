/**
 * Versioned localStorage persistence for study progress.
 *
 * State survives across sessions in both local dev and deployment (per origin).
 * A JSON export/import bridge lets progress move between origins (e.g. from the
 * dev server to the deployed site) since localStorage is origin-scoped.
 */

const STORAGE_KEY = 'one-dsa.progress.v1'
export const SCHEMA_VERSION = 1

/** SRS scheduling state for a single reviewable card. */
export interface CardState {
  /** Stable card id (e.g. "two-pointers-opposite:code"). */
  id: string
  /** SM-2 ease factor (>= 1.3). */
  ease: number
  /** Current inter-review interval in days. */
  interval: number
  /** Number of consecutive successful reviews. */
  reps: number
  /** Epoch ms when this card is next due. */
  due: number
  /** Epoch ms of the last review, or null if never reviewed. */
  lastReviewed: number | null
  /** Total number of times reviewed. */
  totalReviews: number
  /** Total number of lapses (graded "again"). */
  lapses: number
}

export interface DailyStat {
  /** ISO date (YYYY-MM-DD, local). */
  date: string
  reviews: number
}

export interface Settings {
  dailyGoal: number
  /** New cards to introduce per session. */
  newPerSession: number
}

export interface ProgressState {
  version: number
  cards: Record<string, CardState>
  /** Per-day review counts, keyed by ISO date. */
  history: Record<string, DailyStat>
  settings: Settings
  /** Epoch ms the state was last saved. */
  updatedAt: number
}

export const DEFAULT_SETTINGS: Settings = {
  dailyGoal: 30,
  newPerSession: 8,
}

export function emptyState(): ProgressState {
  return {
    version: SCHEMA_VERSION,
    cards: {},
    history: {},
    settings: { ...DEFAULT_SETTINGS },
    updatedAt: Date.now(),
  }
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

/** Coerce arbitrary parsed JSON into a valid ProgressState (best effort). */
function migrate(raw: unknown): ProgressState {
  const base = emptyState()
  if (!raw || typeof raw !== 'object') return base
  const obj = raw as Partial<ProgressState>
  return {
    version: SCHEMA_VERSION,
    cards: obj.cards && typeof obj.cards === 'object' ? obj.cards : {},
    history: obj.history && typeof obj.history === 'object' ? obj.history : {},
    settings: { ...DEFAULT_SETTINGS, ...(obj.settings ?? {}) },
    updatedAt: typeof obj.updatedAt === 'number' ? obj.updatedAt : Date.now(),
  }
}

export function loadState(): ProgressState {
  if (!isBrowser()) return emptyState()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyState()
    return migrate(JSON.parse(raw))
  } catch {
    return emptyState()
  }
}

export function saveState(state: ProgressState): void {
  if (!isBrowser()) return
  try {
    const next = { ...state, updatedAt: Date.now() }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    /* quota or serialization errors are non-fatal for a study tool */
  }
}

export function clearState(): void {
  if (!isBrowser()) return
  window.localStorage.removeItem(STORAGE_KEY)
}

/** Serialize progress to a pretty JSON string for download. */
export function exportState(state: ProgressState): string {
  return JSON.stringify(state, null, 2)
}

/** Parse an imported JSON string back into a valid ProgressState. */
export function importState(json: string): ProgressState {
  return migrate(JSON.parse(json))
}
