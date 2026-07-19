import type { Card } from '@/types/study'
import { PATTERNS } from './patterns'
import { SYNTAX_CATEGORIES } from './syntaxTable'

/** Build the flat list of every reviewable card in the catalog. */
function buildCards(): Card[] {
  const cards: Card[] = []

  for (const p of PATTERNS) {
    cards.push({
      id: `${p.id}:code`,
      kind: 'code',
      sourceId: p.id,
      label: `${p.title} - blank-file recall`,
    })
    cards.push({
      id: `${p.id}:fill`,
      kind: 'fill',
      sourceId: p.id,
      label: `${p.title} - fill in the blanks`,
    })
    cards.push({
      id: `${p.id}:recognition`,
      kind: 'recognition',
      sourceId: p.id,
      label: `${p.title} - pattern recognition`,
    })
  }

  SYNTAX_CATEGORIES.forEach((cat, ci) => {
    cat.rows.forEach((row, ri) => {
      if (!row.code.python) return
      cards.push({
        id: `syntax:${ci}:${ri}`,
        kind: 'syntax',
        sourceId: `${ci}:${ri}`,
        label: `Syntax - ${row.topic}`,
      })
    })
  })

  return cards
}

export const ALL_CARDS: Card[] = buildCards()

export const CARD_BY_ID: Record<string, Card> = ALL_CARDS.reduce(
  (acc, c) => {
    acc[c.id] = c
    return acc
  },
  {} as Record<string, Card>,
)

/** Look up the Python prompt/answer for a syntax card by its sourceId "ci:ri". */
export function syntaxCardContent(sourceId: string): {
  topic: string
  python: string
  note?: string
} | null {
  const [ci, ri] = sourceId.split(':').map(Number)
  const cat = SYNTAX_CATEGORIES[ci]
  const row = cat?.rows[ri]
  if (!row) return null
  return { topic: row.topic, python: row.code.python }
}

/** Every syntax snippet with a Python answer, for building quiz distractors. */
export function allSyntaxSnippets(): { topic: string; python: string }[] {
  const out: { topic: string; python: string }[] = []
  SYNTAX_CATEGORIES.forEach((cat) => {
    cat.rows.forEach((row) => {
      if (row.code.python) out.push({ topic: row.topic, python: row.code.python })
    })
  })
  return out
}
