import { useEffect } from 'react'
import type { Grade } from '@/lib/srs'

const GRADES: { grade: Grade; label: string; key: string; color: string }[] = [
  { grade: 'again', label: 'Again', key: '1', color: '#c23b2b' },
  { grade: 'hard', label: 'Hard', key: '2', color: '#b45309' },
  { grade: 'good', label: 'Good', key: '3', color: '#1a6fb0' },
  { grade: 'easy', label: 'Easy', key: '4', color: '#10794b' },
]

/**
 * The four SRS grade buttons. Enabled only after the learner reveals the
 * answer. Keys 1-4 grade; the parent decides what "reveal" means per drill.
 */
export function GradeBar({
  onGrade,
  disabled,
}: {
  onGrade: (grade: Grade) => void
  disabled?: boolean
}) {
  useEffect(() => {
    if (disabled) return
    const handler = (e: KeyboardEvent) => {
      const match = GRADES.find((g) => g.key === e.key)
      if (match && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault()
        onGrade(match.grade)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onGrade, disabled])

  return (
    <div className="grid grid-cols-4 gap-2">
      {GRADES.map((g) => (
        <button
          key={g.grade}
          onClick={() => onGrade(g.grade)}
          disabled={disabled}
          className="flex flex-col items-center rounded-2xl border border-line bg-surface px-3 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-40"
          style={{ borderColor: disabled ? undefined : g.color }}
        >
          <span style={{ color: disabled ? undefined : g.color }}>{g.label}</span>
          <span className="text-xs font-normal text-ink-faint">{g.key}</span>
        </button>
      ))}
    </div>
  )
}
