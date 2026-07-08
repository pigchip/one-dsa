/**
 * Pure selectors over ProgressState + the static card catalog.
 * Kept out of the provider so they are easy to test and reuse.
 */
import type { Card } from '@/types/study'
import type { CardState, ProgressState } from './storage'
import { isDue, masteryOf, masteryScore, newCard, type MasteryLevel } from './srs'
import { ALL_CARDS } from '@/data/cards'
import { isoDay } from '@/lib/date'

export interface DeckStats {
  total: number
  reviewed: number
  due: number
  fresh: number
  mastered: number
  /** Average mastery score in [0, 1]. */
  progress: number
  reviewedToday: number
  streak: number
}

function cardStateFor(state: ProgressState, id: string): CardState {
  return state.cards[id] ?? newCard(id, 0)
}

/** Cards that are due for review right now (excludes brand-new cards). */
export function dueCards(state: ProgressState, now: number = Date.now()): Card[] {
  return ALL_CARDS.filter((c) => {
    const cs = state.cards[c.id]
    return cs && isDue(cs, now)
  })
}

/** Cards never reviewed yet, in catalog order. */
export function freshCards(state: ProgressState): Card[] {
  return ALL_CARDS.filter((c) => !state.cards[c.id])
}

export interface SessionOptions {
  /** Limit due reviews (0 = no limit). */
  maxReviews?: number
  /** Number of new cards to introduce. */
  newCount?: number
  /** Restrict to a single drill kind. */
  kind?: Card['kind']
  /** Restrict to a single pattern/source id. */
  sourceId?: string
}

/**
 * Build an ordered study session: due reviews first (most overdue first),
 * then a capped number of new cards, then optional filters applied.
 */
export function buildSession(
  state: ProgressState,
  opts: SessionOptions = {},
  now: number = Date.now(),
): Card[] {
  const filterFn = (c: Card) =>
    (!opts.kind || c.kind === opts.kind) &&
    (!opts.sourceId || c.sourceId === opts.sourceId)

  let due = dueCards(state, now)
    .filter(filterFn)
    .sort((a, b) => cardStateFor(state, a.id).due - cardStateFor(state, b.id).due)
  if (opts.maxReviews && opts.maxReviews > 0) due = due.slice(0, opts.maxReviews)

  const newLimit = opts.newCount ?? state.settings.newPerSession
  const fresh = freshCards(state).filter(filterFn).slice(0, newLimit)

  return [...due, ...fresh]
}

/** Aggregate deck statistics for the dashboard. */
export function deckStats(state: ProgressState, now: number = Date.now()): DeckStats {
  const total = ALL_CARDS.length
  let reviewed = 0
  let due = 0
  let mastered = 0
  let scoreSum = 0

  for (const c of ALL_CARDS) {
    const cs = state.cards[c.id]
    if (cs) {
      reviewed += 1
      if (isDue(cs, now)) due += 1
      if (masteryOf(cs) === 'mastered') mastered += 1
    }
    scoreSum += masteryScore(cs)
  }

  return {
    total,
    reviewed,
    due,
    fresh: total - reviewed,
    mastered,
    progress: total ? scoreSum / total : 0,
    reviewedToday: state.history[isoDay(now)]?.reviews ?? 0,
    streak: currentStreak(state, now),
  }
}

/** Consecutive days (ending today) with at least one review. */
export function currentStreak(state: ProgressState, now: number = Date.now()): number {
  let streak = 0
  const cursor = new Date(now)
  // If nothing today, the streak may still count through yesterday.
  if (!state.history[isoDay(now)]?.reviews) {
    cursor.setDate(cursor.getDate() - 1)
  }
  for (;;) {
    const key = isoDay(cursor.getTime())
    if (state.history[key]?.reviews) {
      streak += 1
      cursor.setDate(cursor.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}

export interface PatternMastery {
  level: MasteryLevel
  score: number
  reviewed: number
  due: number
  total: number
}

/** Aggregate mastery across the (up to 3) drill cards of one pattern. */
export function patternMastery(
  state: ProgressState,
  patternId: string,
  now: number = Date.now(),
): PatternMastery {
  const cards = ALL_CARDS.filter((c) => c.sourceId === patternId)
  let scoreSum = 0
  let reviewed = 0
  let due = 0
  for (const c of cards) {
    const cs = state.cards[c.id]
    scoreSum += masteryScore(cs)
    if (cs) {
      reviewed += 1
      if (isDue(cs, now)) due += 1
    }
  }
  const score = cards.length ? scoreSum / cards.length : 0
  const level: MasteryLevel =
    score >= 1 ? 'mastered' : score >= 0.75 ? 'mature' : score >= 0.5 ? 'young' : score > 0 ? 'learning' : 'new'
  return { level, score, reviewed, due, total: cards.length }
}
