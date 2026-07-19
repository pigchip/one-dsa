import { useMemo, useState } from 'react'
import type { Pattern } from '@/types/study'
import type { Grade } from '@/lib/srs'
import { PATTERNS } from '@/data/patterns'
import { seeded, shuffle } from '@/lib/quiz'
import { GradeBar } from './GradeBar'

/**
 * Pattern recognition: given a problem cue, choose which pattern to reach for.
 * This trains the most interview-critical skill - mapping a prompt to a
 * technique - rather than rote code.
 */
export function RecognitionDrill({
  pattern,
  onGrade,
}: {
  pattern: Pattern
  onGrade: (grade: Grade) => void
}) {
  const [picked, setPicked] = useState<string | null>(null)

  const { cue, options } = useMemo(() => {
    const rand = seeded(pattern.id)
    const cueList = pattern.recognitionCues.length ? pattern.recognitionCues : [pattern.summary]
    const chosenCue = cueList[Math.floor(rand() * cueList.length)]
    const distractors = shuffle(
      PATTERNS.filter((p) => p.id !== pattern.id),
      rand,
    ).slice(0, 3)
    const opts = shuffle([pattern, ...distractors], rand)
    return { cue: chosenCue, options: opts }
  }, [pattern])

  const answered = picked !== null

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold tracking-wide text-ink-faint uppercase">
          Which pattern fits this problem?
        </p>
        <p className="mt-2 rounded-2xl border border-line bg-surface p-4 text-base text-ink">
          {cue}
        </p>
      </div>

      <div className="grid gap-2">
        {options.map((opt) => {
          const isCorrect = opt.id === pattern.id
          const isPicked = opt.id === picked
          let cls = 'border-line bg-surface hover:bg-surface-2'
          if (answered) {
            if (isCorrect) cls = 'border-good bg-[#e1f2f1]'
            else if (isPicked) cls = 'border-bad bg-[#fbe7e3]'
            else cls = 'border-line bg-surface opacity-60'
          }
          return (
            <button
              key={opt.id}
              disabled={answered}
              onClick={() => setPicked(opt.id)}
              className={`flex items-center gap-x-3 rounded-2xl border px-4 py-3 text-left text-sm font-medium text-ink transition-colors ${cls}`}
            >
              <i className={opt.icon} style={{ color: opt.accent }} />
              {opt.title}
              {answered && isCorrect && (
                <i className="fa-solid fa-check ml-auto text-good" />
              )}
              {answered && isPicked && !isCorrect && (
                <i className="fa-solid fa-xmark ml-auto text-bad" />
              )}
            </button>
          )
        })}
      </div>

      {answered && (
        <div className="space-y-4">
          <p className="text-sm text-ink-soft">
            {picked === pattern.id ? 'Correct.' : `The answer is ${pattern.title}.`}{' '}
            {pattern.summary}
          </p>
          <GradeBar onGrade={onGrade} />
        </div>
      )}
    </div>
  )
}
