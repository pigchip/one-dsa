import { useMemo, useState } from 'react'
import type { Pattern } from '@/types/study'
import type { Grade } from '@/lib/srs'
import { PATTERNS } from '@/data/patterns'
import { seeded, shuffle, pickDistractors } from '@/lib/quiz'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { GradeBar } from './GradeBar'

interface Option {
  id: string
  title: string
  template: string
}

/**
 * Implementation match: four candidate solutions are shown; the learner drags
 * the one that correctly solves the prompt into the answer slot, then self-grades.
 */
export function CodeDrill({
  pattern,
  onGrade,
}: {
  pattern: Pattern
  onGrade: (grade: Grade) => void
}) {
  const [dropped, setDropped] = useState<Option | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const options = useMemo<Option[]>(() => {
    const rand = seeded(`code:${pattern.id}`)
    const correct: Option = {
      id: pattern.id,
      title: pattern.title,
      template: pattern.template,
    }
    const pool: Option[] = PATTERNS.map((p) => ({
      id: p.id,
      title: p.title,
      template: p.template,
    }))
    const distractors = pickDistractors(pool, correct, (o) => o.id, 3, rand)
    return shuffle([correct, ...distractors], rand)
  }, [pattern])

  const answered = dropped !== null
  const isRight = dropped?.id === pattern.id

  const handleDrop = (id: string) => {
    if (answered) return
    setDragOver(false)
    const opt = options.find((o) => o.id === id)
    if (opt) setDropped(opt)
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold tracking-wide text-ink-faint uppercase">
          Drag the correct implementation into the slot
        </p>
        <p className="mt-1 font-mono text-sm text-ink">{pattern.prompt}</p>
      </div>

      <div
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
        className={`rounded-2xl border-2 border-dashed p-2 transition-colors ${
          answered
            ? isRight
              ? 'border-good bg-[#e1f2f1]'
              : 'border-bad bg-[#fbe7e3]'
            : dragOver
              ? 'border-line-strong bg-surface-2'
              : 'border-line bg-surface'
        }`}
      >
        {dropped ? (
          <CodeBlock code={dropped.template} language="python" />
        ) : (
          <p className="px-3 py-8 text-center text-sm text-ink-faint">
            Drop your chosen solution here
          </p>
        )}
      </div>

      {!answered && (
        <div className="grid gap-2">
          {options.map((opt) => (
            <div
              key={opt.id}
              draggable
              onDragStart={(e) => e.dataTransfer.setData('text/plain', opt.id)}
              className="cursor-grab rounded-2xl border border-line bg-surface p-1 transition-colors hover:border-line-strong active:cursor-grabbing"
            >
              <CodeBlock code={opt.template} language="python" />
            </div>
          ))}
        </div>
      )}

      {answered && (
        <div className="space-y-4">
          <p className="text-sm text-ink-soft">
            {isRight
              ? 'Correct.'
              : `Not quite - that was ${dropped?.title}. The correct solution:`}
          </p>
          {!isRight && <CodeBlock code={pattern.template} language="python" />}
          <GradeBar onGrade={onGrade} />
        </div>
      )}
    </div>
  )
}
