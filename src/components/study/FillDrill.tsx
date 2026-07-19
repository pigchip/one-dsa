import { useMemo, useState } from 'react'
import type { Pattern } from '@/types/study'
import type { Grade } from '@/lib/srs'
import { buildFill, type FillLine } from '@/lib/fill'
import { PATTERNS } from '@/data/patterns'
import { seeded, shuffle, pickDistractors } from '@/lib/quiz'
import { GradeBar } from './GradeBar'

/** Collect distinct non-trivial logic lines across every template. */
function linePool(): string[] {
  const set = new Set<string>()
  for (const p of PATTERNS) {
    for (const ln of buildFill(p.template)) {
      if (ln.blank && ln.content.length > 5) set.add(ln.content)
    }
  }
  return [...set]
}

/**
 * Complete the template: one logic line is blanked as a drop slot; the learner
 * drags the correct line from four candidates into it, then self-grades.
 */
export function FillDrill({
  pattern,
  onGrade,
}: {
  pattern: Pattern
  onGrade: (grade: Grade) => void
}) {
  const [dropped, setDropped] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const lines = useMemo<FillLine[]>(() => buildFill(pattern.template), [pattern.template])

  const { blankIndex, answer, options } = useMemo(() => {
    const rand = seeded(`fill:${pattern.id}`)
    const blanks = lines
      .map((l, i) => ({ l, i }))
      .filter((x) => x.l.blank && x.l.content.length > 5)
    const chosen = blanks.length ? blanks[Math.floor(rand() * blanks.length)] : null
    const correct = chosen?.l.content ?? ''
    const distractors = pickDistractors(linePool(), correct, (s) => s, 3, rand)
    return {
      blankIndex: chosen?.i ?? -1,
      answer: correct,
      options: shuffle([correct, ...distractors], rand),
    }
  }, [lines, pattern.id])

  const answered = dropped !== null
  const isRight = dropped === answer

  const handleDrop = (value: string) => {
    if (answered) return
    setDragOver(false)
    setDropped(value)
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold tracking-wide text-ink-faint uppercase">
          Drag the missing line into the {pattern.title} template
        </p>
        <p className="mt-1 font-mono text-sm text-ink">{pattern.prompt}</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-[#fbf7ec] p-4 font-mono text-sm">
        {lines.map((line, i) => {
          if (i !== blankIndex) {
            return (
              <div
                key={i}
                style={{ whiteSpace: 'pre', minHeight: line.content ? '1.9rem' : '0.6rem' }}
                className="text-ink"
              >
                {line.text || ' '}
              </div>
            )
          }
          return (
            <div key={i} className="flex items-center" style={{ minHeight: '1.9rem' }}>
              <span style={{ whiteSpace: 'pre' }}>{line.indent}</span>
              <span
                onDragOver={(e) => {
                  if (answered) return
                  e.preventDefault()
                  setDragOver(true)
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  handleDrop(e.dataTransfer.getData('text/plain'))
                }}
                className={`inline-flex min-h-[1.6rem] min-w-[12rem] items-center rounded border-2 border-dashed px-2 py-0.5 transition-colors ${
                  answered
                    ? isRight
                      ? 'border-good bg-[#e1f2f1] text-good'
                      : 'border-bad bg-[#fbe7e3] text-bad'
                    : dragOver
                      ? 'border-line-strong bg-surface-2'
                      : 'border-line bg-surface'
                }`}
              >
                {dropped ?? <span className="text-ink-faint">drop the line here</span>}
              </span>
            </div>
          )
        })}
      </div>

      {!answered && (
        <div className="grid gap-2">
          {options.map((opt) => (
            <div
              key={opt}
              draggable
              onDragStart={(e) => e.dataTransfer.setData('text/plain', opt)}
              className="cursor-grab rounded-xl border border-line bg-surface px-3 py-2 font-mono text-sm text-ink transition-colors hover:border-line-strong active:cursor-grabbing"
            >
              {opt}
            </div>
          ))}
        </div>
      )}

      {answered && (
        <div className="space-y-4">
          <p className="text-sm text-ink-soft">
            {isRight ? (
              'Correct.'
            ) : (
              <>
                The correct line is <code className="text-good">{answer}</code>.
              </>
            )}
          </p>
          <GradeBar onGrade={onGrade} />
        </div>
      )}
    </div>
  )
}
