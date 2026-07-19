import { useMemo, useState } from 'react'
import type { Card, DrillKind } from '@/types/study'
import type { Grade } from '@/lib/srs'
import { DRILL_KIND_META } from '@/types/study'
import { useProgress } from '@/context/useProgress'
import { ALL_CARDS } from '@/data/cards'
import { DrillFor } from './DrillFor'

const RANK: Record<DrillKind, number> = { recognition: 0, fill: 1, code: 2, syntax: 3 }

/**
 * A fully self-contained drill session for a single pattern, embedded inline in
 * the roadmap (no navigation). Runs the pattern's cards in a fixed order
 * (recognition -> fill -> code) and grades each into the shared SRS via
 * useProgress().grade, so phase mastery updates live.
 */
export function InlinePatternDrills({ patternId }: { patternId: string }) {
  const { grade } = useProgress()

  // Freeze the card queue at mount so grading (which mutates state) never
  // reshuffles mid-session.
  const cards = useMemo<Card[]>(
    () =>
      ALL_CARDS.filter((c) => c.sourceId === patternId).sort(
        (a, b) => RANK[a.kind] - RANK[b.kind],
      ),
    [patternId],
  )

  const [index, setIndex] = useState(0)
  const [runId, setRunId] = useState(0)

  if (cards.length === 0) {
    return <p className="text-sm text-ink-faint">No drills available for this pattern yet.</p>
  }

  const current = cards[index]
  const done = index >= cards.length

  const handleGrade = (g: Grade) => {
    if (!current) return
    grade(current.id, g)
    setIndex((i) => i + 1)
  }

  const restart = () => {
    setIndex(0)
    setRunId((r) => r + 1)
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-line bg-surface-2 p-5 text-center">
        <span className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e1f2f1] text-good">
          <i className="fa-solid fa-check" aria-hidden="true" />
        </span>
        <p className="text-sm font-semibold text-ink">Drill set complete</p>
        <p className="mt-1 text-xs text-ink-faint">
          {cards.length} card{cards.length === 1 ? '' : 's'} graded into your review schedule.
        </p>
        <button
          onClick={restart}
          className="mt-4 rounded-xl bg-py px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
        >
          Drill again
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-xs text-ink-faint">
        <span className="font-semibold text-ink-soft">
          <i className={`${DRILL_KIND_META[current.kind].icon} mr-1.5 text-py`} aria-hidden="true" />
          {DRILL_KIND_META[current.kind].label}
        </span>
        <span>
          {index + 1} / {cards.length}
        </span>
      </div>
      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-py transition-all"
          style={{ width: `${(index / cards.length) * 100}%` }}
        />
      </div>
      <div className="rounded-2xl border border-line bg-surface-2 p-4">
        <DrillFor key={`${runId}-${current.id}-${index}`} card={current} onGrade={handleGrade} />
      </div>
    </div>
  )
}
