import type { Card } from '@/types/study'
import type { Grade } from '@/lib/srs'
import { PATTERN_BY_ID } from '@/data/patterns'
import { syntaxCardContent } from '@/data/cards'
import { CodeDrill } from './CodeDrill'
import { FillDrill } from './FillDrill'
import { RecognitionDrill } from './RecognitionDrill'
import { SyntaxDrill } from './SyntaxDrill'

/**
 * Maps a single reviewable {@link Card} to its matching drill component. Shared
 * by the Practice page and the inline roadmap drills so the mapping lives in one
 * place.
 */
export function DrillFor({
  card,
  onGrade,
}: {
  card: Card
  onGrade: (g: Grade) => void
}) {
  if (card.kind === 'syntax') {
    const content = syntaxCardContent(card.sourceId)
    if (!content) return null
    return <SyntaxDrill topic={content.topic} python={content.python} onGrade={onGrade} />
  }
  const pattern = PATTERN_BY_ID[card.sourceId]
  if (!pattern) return null
  if (card.kind === 'code') return <CodeDrill pattern={pattern} onGrade={onGrade} />
  if (card.kind === 'fill') return <FillDrill pattern={pattern} onGrade={onGrade} />
  return <RecognitionDrill pattern={pattern} onGrade={onGrade} />
}
