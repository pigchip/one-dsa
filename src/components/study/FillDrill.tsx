import { useMemo, useState } from 'react'
import type { Pattern } from '@/types/study'
import type { Grade } from '@/lib/srs'
import { buildFill, type FillLine } from '@/lib/fill'
import { normalizeCode } from '@/lib/normalize'
import { GradeBar } from './GradeBar'

/**
 * Fill in the blanks: structural scaffolding stays visible; the learner types
 * the masked logic lines. Checking reveals which lines were correct.
 */
export function FillDrill({
  pattern,
  onGrade,
}: {
  pattern: Pattern
  onGrade: (grade: Grade) => void
}) {
  const lines = useMemo<FillLine[]>(() => buildFill(pattern.template), [pattern.template])
  const blankIdx = useMemo(
    () => lines.map((l, i) => (l.blank ? i : -1)).filter((i) => i >= 0),
    [lines],
  )
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [checked, setChecked] = useState(false)

  const correct = (i: number) =>
    normalizeCode(answers[i] ?? '') === normalizeCode(lines[i].content)
  const numCorrect = blankIdx.filter(correct).length

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold tracking-wide text-ink-faint uppercase">
          Complete the {pattern.title} template
        </p>
        <p className="mt-1 font-mono text-sm text-ink">{pattern.prompt}</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-[#fbf7ec] p-4 font-mono text-sm">
        {lines.map((line, i) =>
          line.blank ? (
            <div key={i} className="flex items-center" style={{ minHeight: '1.9rem' }}>
              <span style={{ whiteSpace: 'pre' }}>{line.indent}</span>
              <input
                value={answers[i] ?? ''}
                onChange={(e) => setAnswers((a) => ({ ...a, [i]: e.target.value }))}
                disabled={checked}
                spellCheck={false}
                placeholder="type this line..."
                className={`flex-1 rounded border bg-surface px-2 py-0.5 outline-none ${
                  checked
                    ? correct(i)
                      ? 'border-good text-good'
                      : 'border-bad text-bad'
                    : 'border-line focus:border-line-strong text-ink'
                }`}
              />
            </div>
          ) : (
            <div key={i} style={{ whiteSpace: 'pre', minHeight: line.content ? '1.9rem' : '0.6rem' }} className="text-ink">
              {line.text || ' '}
            </div>
          ),
        )}
      </div>

      {!checked ? (
        <button
          onClick={() => setChecked(true)}
          className="w-full rounded-2xl bg-py py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Check answers
        </button>
      ) : (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-ink">
            {numCorrect} / {blankIdx.length} blanks correct
          </p>
          {blankIdx.some((i) => !correct(i)) && (
            <div className="rounded-2xl border border-line bg-surface p-4 text-sm">
              <p className="mb-2 text-xs font-semibold tracking-wide text-ink-faint uppercase">
                Correct lines
              </p>
              <ul className="space-y-1 font-mono">
                {blankIdx
                  .filter((i) => !correct(i))
                  .map((i) => (
                    <li key={i} className="text-good">
                      {lines[i].content}
                    </li>
                  ))}
              </ul>
            </div>
          )}
          <GradeBar onGrade={onGrade} />
        </div>
      )}
    </div>
  )
}
