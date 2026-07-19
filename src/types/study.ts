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

/**
 * One ordered stage of the Python learning roadmap. A phase weaves together all
 * five content sections (syntax, input patterns, templates, patterns, drills)
 * and is designed to build on the knowledge of every phase before it.
 *
 * Content is referenced by id/title rather than duplicated, keeping the source
 * data (`syntaxTable.ts`, `inputPatterns.ts`, `templates.ts`, `patterns.ts`) the
 * single source of truth.
 */
export interface RoadmapPhase {
  id: string
  /** 1-based position in the path. */
  order: number
  title: string
  subtitle: string
  /** Font Awesome icon class. */
  icon: string
  /** Accent color hex. */
  accent: string
  /** What you can do once this phase is mastered. */
  goal: string
  /** `SYNTAX_CATEGORIES` titles to review in this phase. */
  syntaxTopics: string[]
  /** Python `INPUT_PATTERNS` snippet labels to internalize. */
  inputSnippets: string[]
  /** `TEMPLATES` card titles that frame this phase. */
  templates: string[]
  /** `PATTERNS` ids drilled in this phase, in learning order. */
  patternIds: string[]
  /** Memorization-critical items to reproduce by hand ("write on paper"). */
  writeOnPaper: string[]
  /** Curated problems solvable with this phase's (or earlier) knowledge. */
  problems: RoadmapProblem[]
}

/** A well-known interview problem list a problem can belong to. */
export type ProblemList = 'top150' | 'blind75' | 'neetcode150'

export type ProblemDifficulty = 'Easy' | 'Medium' | 'Hard'

/** One curated practice problem, linked to LeetCode. */
export interface RoadmapProblem {
  /** LeetCode problem number. */
  id: number
  title: string
  /** LeetCode url slug: https://leetcode.com/problems/<slug>/ */
  slug: string
  difficulty: ProblemDifficulty
  /** Which curated lists this problem appears in. */
  lists: ProblemList[]
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
