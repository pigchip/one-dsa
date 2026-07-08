/**
 * Master-level DSA study content model (Python-first).
 *
 * A `Pattern` is a self-contained mental model for one interview technique:
 * when to reach for it, how to implement it, its complexity, and the traps.
 * Other languages remain in the Reference view only; drilling is Python-first.
 */

export type Difficulty = 'foundational' | 'core' | 'advanced'

export interface Complexity {
  time: string
  space: string
  note?: string
}

export interface WorkedExample {
  /** e.g. "LeetCode 125 - Valid Palindrome". */
  problem: string
  /** One-paragraph approach in plain language. */
  approach: string
  /** Python solution for this concrete problem. */
  code: string
}

export interface Pattern {
  id: string
  title: string
  category: string
  /** Font Awesome icon class. */
  icon: string
  /** Accent color hex. */
  accent: string
  difficulty: Difficulty
  /** One-sentence essence of the pattern. */
  summary: string
  /** "When to reach for this" recognition triggers. */
  triggers: string[]
  complexity: Complexity
  /** Ordered implementation steps / key techniques. */
  keyIdeas: string[]
  /** Common mistakes to avoid. */
  pitfalls: string[]
  /** Edge cases to always check. */
  edgeCases: string[]
  /** Prerequisite pattern ids. */
  prerequisites: string[]
  /** Related pattern ids. */
  related: string[]
  /** Short goal / function signature shown as the coding-drill prompt. */
  prompt: string
  /** Canonical Python reference implementation (the thing to memorize). */
  template: string
  /** Optional fully worked concrete example. */
  workedExample?: WorkedExample
  /** Problem cues used to build recognition flashcards. */
  recognitionCues: string[]
}

export type DrillKind = 'code' | 'fill' | 'recognition' | 'syntax'

/** A single reviewable unit tracked by the SRS engine. */
export interface Card {
  id: string
  kind: DrillKind
  /** Owning pattern id (or syntax category id). */
  sourceId: string
  /** Short human label for dashboards. */
  label: string
}

export const DRILL_KIND_META: Record<
  DrillKind,
  { label: string; icon: string; blurb: string }
> = {
  code: {
    label: 'Blank-file recall',
    icon: 'fa-solid fa-keyboard',
    blurb: 'Type the full solution from memory.',
  },
  fill: {
    label: 'Fill in the blanks',
    icon: 'fa-solid fa-pen',
    blurb: 'Complete the masked lines of a reference solution.',
  },
  recognition: {
    label: 'Pattern recognition',
    icon: 'fa-solid fa-lightbulb',
    blurb: 'Given a problem cue, name the pattern to reach for.',
  },
  syntax: {
    label: 'Syntax recall',
    icon: 'fa-solid fa-code',
    blurb: 'Recall the exact Python syntax for a primitive.',
  },
}
