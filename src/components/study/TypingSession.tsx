import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { PATTERNS } from '@/data/patterns'
import { TypingDrill } from './TypingDrill'

interface Split {
  patternId: string
  title: string
  ms: number
  mistakes: number
  chars: number
}

function formatMs(ms: number): string {
  const totalSec = ms / 1000
  const m = Math.floor(totalSec / 60)
  const s = totalSec - m * 60
  if (m > 0) return `${m}:${s.toFixed(1).padStart(4, '0')}`
  return `${s.toFixed(1)}s`
}

function shuffle<T>(items: readonly T[]): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/**
 * Timed typing marathon across every algorithm template. A single global timer
 * starts on the first keystroke and runs until the last template is typed,
 * auto-advancing between algorithms and recording a per-algorithm split.
 */
export function TypingSession() {
  const patterns = PATTERNS
  const [order, setOrder] = useState(() => shuffle(patterns))
  const [index, setIndex] = useState(0)
  const [splits, setSplits] = useState<Split[]>([])
  const [startTime, setStartTime] = useState<number | null>(null)
  const [now, setNow] = useState(0)
  const [done, setDone] = useState(false)
  const splitBaseRef = useRef<number>(0)

  const current = order[index]

  // Live timer tick while a run is in progress.
  useEffect(() => {
    if (startTime === null || done) return
    const id = window.setInterval(() => setNow(Date.now()), 100)
    return () => window.clearInterval(id)
  }, [startTime, done])

  const handleStart = () => {
    if (startTime !== null) return
    const t = Date.now()
    setStartTime(t)
    setNow(t)
    splitBaseRef.current = t
  }

  const handleComplete = (stats: { chars: number; mistakes: number }) => {
    const t = Date.now()
    setNow(t)
    setSplits((prev) => [
      ...prev,
      {
        patternId: current.id,
        title: current.title,
        ms: t - splitBaseRef.current,
        mistakes: stats.mistakes,
        chars: stats.chars,
      },
    ])
    splitBaseRef.current = t
    if (index + 1 >= patterns.length) {
      setDone(true)
    } else {
      setIndex((i) => i + 1)
    }
  }

  const reset = () => {
    setOrder(shuffle(patterns))
    setIndex(0)
    setSplits([])
    setStartTime(null)
    setNow(0)
    setDone(false)
    splitBaseRef.current = 0
  }

  const elapsed = startTime === null ? 0 : now - startTime

  // Typing has begun and the run is not finished: hide all chrome for focus.
  const focus = startTime !== null && !done

  // Hide the global navbar/footer while in focus mode.
  useEffect(() => {
    if (!focus) return
    document.body.classList.add('focus-typing')
    return () => document.body.classList.remove('focus-typing')
  }, [focus])

  if (done) {
    return <MarathonSummary splits={splits} totalMs={elapsed} onRestart={reset} />
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pt-10 pb-20">
      {!focus && (
        <>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wide text-ink-faint uppercase">
                Typing marathon
              </p>
              <h1 className="font-display text-2xl font-semibold text-ink">
                <i className="fa-solid fa-stopwatch mr-2 text-py" />
                {current.title}
              </h1>
            </div>
            <div className="text-right">
              <p className="font-mono text-2xl font-semibold text-ink tabular-nums">
                {formatMs(elapsed)}
              </p>
              <Link to="/" className="text-sm text-ink-faint hover:text-ink">
                End session
              </Link>
            </div>
          </div>

          <div className="mb-6 h-2 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-py transition-all"
              style={{ width: `${(index / patterns.length) * 100}%` }}
            />
          </div>
          <p className="mb-6 text-sm text-ink-faint">
            Algorithm {index + 1} of {patterns.length}
            {startTime === null && ' — the timer starts on your first keystroke'}
          </p>
        </>
      )}

      <div className={focus ? '' : 'rounded-3xl border border-line bg-surface p-6'}>
        <TypingDrill
          key={current.id}
          pattern={current}
          focus={focus}
          onStart={handleStart}
          onComplete={handleComplete}
        />
      </div>
    </div>
  )
}

function MarathonSummary({
  splits,
  totalMs,
  onRestart,
}: {
  splits: Split[]
  totalMs: number
  onRestart: () => void
}) {
  const totalChars = splits.reduce((a, s) => a + s.chars, 0)
  const totalMistakes = splits.reduce((a, s) => a + s.mistakes, 0)
  const minutes = totalMs / 60000
  const wpm = minutes > 0 ? Math.round(totalChars / 5 / minutes) : 0
  const slowest = useMemo(
    () => splits.reduce((max, s) => (s.ms > max ? s.ms : max), 0),
    [splits],
  )

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-center">
      <p className="text-sm font-semibold tracking-wide text-py uppercase">
        Typing marathon complete
      </p>
      <h1 className="font-display mt-1 text-4xl font-semibold text-ink tabular-nums">
        {formatMs(totalMs)}
      </h1>
      <p className="mt-2 text-ink-soft">
        {splits.length} algorithms · {totalChars} chars · {wpm} WPM · {totalMistakes} blocked keystrokes
      </p>

      <div className="mx-auto mt-8 max-w-md space-y-2 text-left">
        {splits.map((s) => (
          <div
            key={s.patternId}
            className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-2.5"
          >
            <span className="min-w-0 flex-1 truncate text-sm text-ink">{s.title}</span>
            {s.mistakes > 0 && (
              <span className="shrink-0 text-xs text-ink-faint">{s.mistakes} blocked</span>
            )}
            <span className="shrink-0 font-mono text-sm font-semibold tabular-nums text-ink">
              {formatMs(s.ms)}
            </span>
            <span
              className="shrink-0 rounded-full"
              style={{
                width: 6,
                height: 6,
                backgroundColor: s.ms === slowest ? '#c23b2b' : '#0e7c7b',
              }}
            />
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <button
          onClick={onRestart}
          className="rounded-2xl bg-py px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          Run again
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
