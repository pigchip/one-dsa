import { useMemo, useState } from 'react'
import type { Grade } from '@/lib/srs'
import { allSyntaxSnippets } from '@/data/cards'
import { seeded, shuffle, pickDistractors } from '@/lib/quiz'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { GradeBar } from './GradeBar'

/**
 * Syntax recognition: given a primitive (e.g. "Queue (FIFO)"), pick the correct
 * Python snippet out of four candidates, then self-grade.
 */
export function SyntaxDrill({
  topic,
  python,
  onGrade,
}: {
  topic: string
  python: string
  onGrade: (grade: Grade) => void
}) {
  const [picked, setPicked] = useState<string | null>(null)

  const options = useMemo(() => {
    const rand = seeded(`syntax:${topic}`)
    const correct = { topic, python }
    const distractors = pickDistractors(
      allSyntaxSnippets(),
      correct,
      (s) => s.python,
      3,
      rand,
    )
    return shuffle([correct, ...distractors], rand)
  }, [topic, python])

  const answered = picked !== null

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold tracking-wide text-ink-faint uppercase">
          Which Python is correct for this?
        </p>
        <p className="mt-2 text-lg font-semibold text-ink">{topic}</p>
      </div>

      <div className="grid gap-2">
        {options.map((opt) => {
          const isCorrect = opt.python === python
          const isPicked = opt.python === picked
          let cls = 'border-line bg-surface hover:border-line-strong'
          if (answered) {
            if (isCorrect) cls = 'border-good ring-1 ring-good'
            else if (isPicked) cls = 'border-bad ring-1 ring-bad'
            else cls = 'border-line opacity-60'
          }
          return (
            <button
              key={opt.python}
              disabled={answered}
              onClick={() => setPicked(opt.python)}
              className={`relative rounded-2xl border p-1 text-left transition-colors ${cls}`}
            >
              <CodeBlock code={opt.python} language="python" />
              {answered && isCorrect && (
                <i className="fa-solid fa-check absolute top-3 right-3 text-good" />
              )}
              {answered && isPicked && !isCorrect && (
                <i className="fa-solid fa-xmark absolute top-3 right-3 text-bad" />
              )}
            </button>
          )
        })}
      </div>

      {answered && (
        <div className="space-y-4">
          <p className="text-sm text-ink-soft">
            {picked === python ? 'Correct.' : `The correct syntax for ${topic} is highlighted.`}
          </p>
          <GradeBar onGrade={onGrade} />
        </div>
      )}
    </div>
  )
}
