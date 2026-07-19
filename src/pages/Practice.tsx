import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import type { Card, DrillKind } from '@/types/study'
import type { Grade } from '@/lib/srs'
import { useProgress } from '@/context/useProgress'
import { buildSession, type SessionOptions } from '@/lib/selectors'
import { CARD_BY_ID } from '@/data/cards'
import { PATTERN_BY_ID } from '@/data/patterns'
import { DRILL_KIND_META } from '@/types/study'
import { DrillFor } from '@/components/study/DrillFor'
import { TypingSession } from '@/components/study/TypingSession'

/** For a pattern-scoped drill, include all its cards in a fixed order. */
function orderByKind(cards: Card[]): Card[] {
  const rank: Record<DrillKind, number> = { recognition: 0, fill: 1, code: 2, syntax: 3 }
  return [...cards].sort((a, b) => rank[a.kind] - rank[b.kind])
}

export function Practice() {
  const { state, grade } = useProgress()
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const patternId = params.get('pattern') ?? undefined
  const kind = (params.get('kind') as DrillKind | null) ?? undefined
  const mode = params.get('mode') ?? undefined

  // Build the session ONCE at mount so grading (which mutates state) does not
  // reshuffle the queue mid-session.
  const [session] = useState<Card[]>(() => {
    if (patternId) {
      return orderByKind(Object.values(CARD_BY_ID).filter((c) => c.sourceId === patternId))
    }
    const opts: SessionOptions = { kind, maxReviews: 40 }
    return buildSession(state, opts)
  })

  const [index, setIndex] = useState(0)
  const [log, setLog] = useState<{ card: Card; grade: Grade }[]>([])

  const current = session[index]
  const done = index >= session.length

  const handleGrade = (g: Grade) => {
    if (!current) return
    grade(current.id, g)
    setLog((l) => [...l, { card: current, grade: g }])
    setIndex((i) => i + 1)
  }

  const scopeLabel = useMemo(() => {
    if (patternId) return PATTERN_BY_ID[patternId]?.title ?? 'Pattern'
    if (kind) return DRILL_KIND_META[kind].label
    return 'Daily review'
  }, [patternId, kind])

  if (mode === 'typing') {
    return <TypingSession />
  }

  if (session.length === 0) {
    return (
      <EmptyState />
    )
  }

  if (done) {
    return <SessionSummary log={log} scopeLabel={scopeLabel} onRestart={() => navigate(0)} />
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pt-10 pb-20">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wide text-ink-faint uppercase">
            {scopeLabel}
          </p>
          <h1 className="font-display text-2xl font-semibold text-ink">
            <i className={`${DRILL_KIND_META[current.kind].icon} mr-2 text-py`} />
            {DRILL_KIND_META[current.kind].label}
          </h1>
        </div>
        <Link to="/" className="text-sm text-ink-faint hover:text-ink">
          End session
        </Link>
      </div>

      <div className="mb-6 flex justify-end">
        <Link
          to="/practice?mode=typing"
          className="inline-flex items-center gap-x-2 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink-soft hover:bg-surface-2"
        >
          <i className="fa-solid fa-stopwatch text-py" />
          Typing marathon
        </Link>
      </div>

      <div className="mb-6 h-2 overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-py transition-all"
          style={{ width: `${(index / session.length) * 100}%` }}
        />
      </div>
      <p className="mb-6 text-sm text-ink-faint">
        Card {index + 1} of {session.length}
      </p>

      <div className="rounded-3xl border border-line bg-surface p-6">
        <DrillFor key={`${current.id}-${index}`} card={current} onGrade={handleGrade} />
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <span className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-[#e1f2f1] text-3xl text-good">
        <i className="fa-solid fa-check" />
      </span>
      <h1 className="font-display text-3xl font-semibold text-ink">All caught up</h1>
      <p className="mt-3 text-ink-soft">
        Nothing is due right now. Start new material from the Library, or come
        back when reviews are due.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          to="/library"
          className="rounded-2xl bg-py px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          Browse the Library
        </Link>
        <Link
          to="/practice?mode=typing"
          className="rounded-2xl border border-line-strong bg-surface px-5 py-2.5 text-sm font-semibold text-ink hover:bg-surface-2"
        >
          Typing marathon
        </Link>
        <Link
          to="/"
          className="rounded-2xl border border-line-strong bg-surface px-5 py-2.5 text-sm font-semibold text-ink hover:bg-surface-2"
        >
          Dashboard
        </Link>
      </div>
    </div>
  )
}

function SessionSummary({
  log,
  scopeLabel,
  onRestart,
}: {
  log: { card: Card; grade: Grade }[]
  scopeLabel: string
  onRestart: () => void
}) {
  const counts = log.reduce<Record<Grade, number>>(
    (acc, l) => {
      acc[l.grade] += 1
      return acc
    },
    { again: 0, hard: 0, good: 0, easy: 0 },
  )
  const good = counts.good + counts.easy
  const rate = log.length ? Math.round((good / log.length) * 100) : 0

  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <p className="text-sm font-semibold tracking-wide text-py uppercase">
        {scopeLabel} complete
      </p>
      <h1 className="font-display mt-1 text-4xl font-semibold text-ink">
        {log.length} cards reviewed
      </h1>
      <p className="mt-2 text-ink-soft">{rate}% recalled well (good or easy)</p>

      <div className="mx-auto mt-8 grid max-w-md grid-cols-4 gap-3">
        {(['again', 'hard', 'good', 'easy'] as Grade[]).map((g) => (
          <div key={g} className="rounded-2xl border border-line bg-surface p-3">
            <p className="text-2xl font-semibold text-ink">{counts[g]}</p>
            <p className="text-xs text-ink-faint capitalize">{g}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <button
          onClick={onRestart}
          className="rounded-2xl bg-py px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          Another session
        </button>
        <Link
          to="/"
          className="rounded-2xl border border-line-strong bg-surface px-5 py-2.5 text-sm font-semibold text-ink hover:bg-surface-2"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
