import { useMemo, useState } from 'react'
import type { Pattern } from '@/types/study'
import type { Grade } from '@/lib/srs'
import { isExactMatch, similarity } from '@/lib/normalize'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { GradeBar } from './GradeBar'

/**
 * Blank-file recall: the learner types the whole solution from memory, then
 * reveals the canonical template and self-grades. A similarity meter gives
 * objective feedback on how close the attempt was.
 */
export function CodeDrill({
  pattern,
  onGrade,
}: {
  pattern: Pattern
  onGrade: (grade: Grade) => void
}) {
  const [attempt, setAttempt] = useState('')
  const [revealed, setRevealed] = useState(false)

  const score = useMemo(
    () => (revealed ? similarity(attempt, pattern.template) : 0),
    [revealed, attempt, pattern.template],
  )
  const exact = revealed && isExactMatch(attempt, pattern.template)
  const pct = Math.round(score * 100)

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold tracking-wide text-ink-faint uppercase">
          Type from memory
        </p>
        <p className="mt-1 font-mono text-sm text-ink">{pattern.prompt}</p>
      </div>

      <textarea
        value={attempt}
        onChange={(e) => setAttempt(e.target.value)}
        spellCheck={false}
        placeholder="# Write the full Python solution here..."
        className="h-56 w-full resize-y rounded-2xl border border-line bg-[#fbf7ec] p-4 font-mono text-sm text-ink outline-none focus:border-line-strong"
      />

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="w-full rounded-2xl bg-py py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Reveal solution
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${pct}%`,
                  backgroundColor: exact ? '#10794b' : pct >= 60 ? '#1a6fb0' : '#b45309',
                }}
              />
            </div>
            <span className="w-28 text-right text-sm font-semibold text-ink">
              {exact ? 'Exact match' : `${pct}% match`}
            </span>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold tracking-wide text-ink-faint uppercase">
              Canonical solution
            </p>
            <CodeBlock code={pattern.template} language="python" />
          </div>

          <p className="text-sm text-ink-soft">How well did you recall it?</p>
          <GradeBar onGrade={onGrade} />
        </div>
      )}
    </div>
  )
}
