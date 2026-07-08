import { useMemo, useState } from 'react'
import type { Grade } from '@/lib/srs'
import { isExactMatch, similarity } from '@/lib/normalize'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { GradeBar } from './GradeBar'

/**
 * Syntax recall: given a primitive (e.g. "Queue (FIFO)"), reproduce the exact
 * Python syntax from memory, then reveal and self-grade.
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
  const [attempt, setAttempt] = useState('')
  const [revealed, setRevealed] = useState(false)

  const score = useMemo(
    () => (revealed ? similarity(attempt, python) : 0),
    [revealed, attempt, python],
  )
  const exact = revealed && isExactMatch(attempt, python)
  const pct = Math.round(score * 100)

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold tracking-wide text-ink-faint uppercase">
          Recall the Python syntax
        </p>
        <p className="mt-1 text-lg font-semibold text-ink">{topic}</p>
      </div>

      <textarea
        value={attempt}
        onChange={(e) => setAttempt(e.target.value)}
        spellCheck={false}
        placeholder="# Write the Python here..."
        className="h-32 w-full resize-y rounded-2xl border border-line bg-[#fbf7ec] p-4 font-mono text-sm text-ink outline-none focus:border-line-strong"
      />

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="w-full rounded-2xl bg-py py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Reveal
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${pct}%`,
                  backgroundColor: exact ? '#0e7c7b' : pct >= 60 ? '#1a6fb0' : '#b45309',
                }}
              />
            </div>
            <span className="w-28 text-right text-sm font-semibold text-ink">
              {exact ? 'Exact match' : `${pct}% match`}
            </span>
          </div>
          <CodeBlock code={python} language="python" />
          <GradeBar onGrade={onGrade} />
        </div>
      )}
    </div>
  )
}
