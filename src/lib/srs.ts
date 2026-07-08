/**
 * Lightweight spaced-repetition scheduler (SM-2 variant with a 4-button grade).
 *
 * Pure functions only, so scheduling is easy to reason about and test. Grades:
 *   again -> lapse, relearn soon
 *   hard  -> shorter-than-usual interval
 *   good  -> standard interval growth
 *   easy  -> accelerated interval
 */
import type { CardState } from './storage'

export type Grade = 'again' | 'hard' | 'good' | 'easy'

export const DAY_MS = 24 * 60 * 60 * 1000
const MIN_EASE = 1.3

/** A fresh, never-reviewed card, due immediately. */
export function newCard(id: string, now: number = Date.now()): CardState {
  return {
    id,
    ease: 2.5,
    interval: 0,
    reps: 0,
    due: now,
    lastReviewed: null,
    totalReviews: 0,
    lapses: 0,
  }
}

function clampEase(ease: number): number {
  return Math.max(MIN_EASE, ease)
}

/** Apply a grade to a card and return the updated scheduling state. */
export function schedule(
  card: CardState,
  grade: Grade,
  now: number = Date.now(),
): CardState {
  let { ease, interval, reps, lapses } = card

  if (grade === 'again') {
    ease = clampEase(ease - 0.2)
    reps = 0
    lapses += 1
    // Relearn in ~10 minutes.
    interval = 10 / (24 * 60)
  } else {
    if (grade === 'hard') ease = clampEase(ease - 0.15)
    else if (grade === 'easy') ease = clampEase(ease + 0.15)

    if (reps === 0) {
      interval = grade === 'hard' ? 0.5 : grade === 'easy' ? 3 : 1
    } else if (reps === 1) {
      interval = grade === 'hard' ? 3 : grade === 'easy' ? 6 : 4
    } else {
      const mult = grade === 'hard' ? 1.2 : grade === 'easy' ? ease * 1.3 : ease
      interval = interval * mult
    }
    reps += 1
  }

  return {
    ...card,
    ease,
    interval,
    reps,
    lapses,
    due: now + interval * DAY_MS,
    lastReviewed: now,
    totalReviews: card.totalReviews + 1,
  }
}

/** True if the card is due for review at `now`. */
export function isDue(card: CardState, now: number = Date.now()): boolean {
  return card.due <= now
}

/** True if the card has never been reviewed. */
export function isNew(card: CardState): boolean {
  return card.totalReviews === 0
}

export type MasteryLevel = 'new' | 'learning' | 'young' | 'mature' | 'mastered'

/** Derive a coarse mastery bucket from a card's scheduling state. */
export function masteryOf(card: CardState | undefined): MasteryLevel {
  if (!card || card.totalReviews === 0) return 'new'
  if (card.reps < 2 || card.interval < 1) return 'learning'
  if (card.interval < 7) return 'young'
  if (card.interval < 21) return 'mature'
  return 'mastered'
}

/** Numeric mastery score in [0, 1] for aggregate progress bars. */
export function masteryScore(card: CardState | undefined): number {
  const level = masteryOf(card)
  switch (level) {
    case 'mastered':
      return 1
    case 'mature':
      return 0.75
    case 'young':
      return 0.5
    case 'learning':
      return 0.25
    default:
      return 0
  }
}

/** Human-friendly "due in" label for a card. */
export function dueLabel(card: CardState, now: number = Date.now()): string {
  const diff = card.due - now
  if (diff <= 0) return 'due now'
  const days = diff / DAY_MS
  if (days < 1 / 24) return 'due in <1h'
  if (days < 1) return `due in ${Math.round(days * 24)}h`
  if (days < 30) return `due in ${Math.round(days)}d`
  return `due in ${Math.round(days / 30)}mo`
}
