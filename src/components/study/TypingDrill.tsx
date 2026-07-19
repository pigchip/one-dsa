import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Pattern } from '@/types/study'

/**
 * A single-algorithm typing drill for the timed marathon.
 *
 * The full template is shown at all times as a grey "ghost" placeholder; the
 * learner types over it. Input is STRICT: only a character matching the next
 * expected one is accepted, so the finished text is always error-free. Enter
 * emits a bare newline and Tab inserts the current line's full indentation, so
 * the learner types the whitespace themselves. Completing a line briefly flashes
 * it bright green. `onStart` fires on the very first accepted keystroke;
 * `onComplete` fires once the whole template has been typed.
 */
export function TypingDrill({
  pattern,
  focus = false,
  onStart,
  onComplete,
}: {
  pattern: Pattern
  focus?: boolean
  onStart: () => void
  onComplete: (stats: { chars: number; mistakes: number }) => void
}) {
  const target = useMemo(() => pattern.template.replace(/\r\n/g, '\n'), [pattern.template])

  // Lines with their global start offset (each line consumes text.length + 1
  // for the newline that follows it, except conceptually the last).
  const lines = useMemo(() => {
    let offset = 0
    return target.split('\n').map((text) => {
      const line = { text, start: offset }
      offset += text.length + 1
      return line
    })
  }, [target])

  const [typed, setTyped] = useState('')
  const [mistakes, setMistakes] = useState(0)
  const [errorFlash, setErrorFlash] = useState(false)
  const [flashLine, setFlashLine] = useState<number | null>(null)
  const startedRef = useRef(false)
  const completedRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const flashTimer = useRef<number | undefined>(undefined)
  const lineFlashTimer = useRef<number | undefined>(undefined)
  const contentDoneRef = useRef(0)

  // Reset when moving to a new algorithm.
  useEffect(() => {
    setTyped('')
    setMistakes(0)
    setErrorFlash(false)
    setFlashLine(null)
    startedRef.current = false
    completedRef.current = false
    contentDoneRef.current = 0
    containerRef.current?.focus()
  }, [pattern.id])

  useEffect(
    () => () => {
      window.clearTimeout(flashTimer.current)
      window.clearTimeout(lineFlashTimer.current)
    },
    [],
  )

  const flashError = useCallback(() => {
    setMistakes((m) => m + 1)
    setErrorFlash(true)
    window.clearTimeout(flashTimer.current)
    flashTimer.current = window.setTimeout(() => setErrorFlash(false), 180)
  }, [])

  const triggerLineFlash = useCallback((idx: number) => {
    setFlashLine(idx)
    window.clearTimeout(lineFlashTimer.current)
    lineFlashTimer.current = window.setTimeout(() => setFlashLine(null), 450)
  }, [])

  // How many lines have their entire content typed given a caret position.
  const countContentDone = useCallback(
    (caret: number) => {
      let n = 0
      for (const ln of lines) {
        if (caret >= ln.start + ln.text.length) n += 1
        else break
      }
      return n
    },
    [lines],
  )

  const commit = useCallback(
    (next: string) => {
      if (!startedRef.current) {
        startedRef.current = true
        onStart()
      }
      setTyped(next)
      const done = countContentDone(next.length)
      if (done > contentDoneRef.current) {
        triggerLineFlash(done - 1)
      }
      contentDoneRef.current = done
      if (next.length >= target.length && !completedRef.current) {
        completedRef.current = true
        onComplete({ chars: target.length, mistakes })
      }
    },
    [onStart, onComplete, target.length, mistakes, countContentDone, triggerLineFlash],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (completedRef.current) return
      // Let browser handle copy/refresh/devtools shortcuts.
      if (e.ctrlKey || e.metaKey || e.altKey) return

      const pos = typed.length

      if (e.key === 'Backspace') {
        e.preventDefault()
        if (pos > 0) {
          const next = typed.slice(0, -1)
          setTyped(next)
          contentDoneRef.current = countContentDone(next.length)
        }
        return
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        if (target[pos] !== '\n') {
          flashError()
          return
        }
        // Emit only the newline; the learner types the indentation themselves.
        commit(target.slice(0, pos + 1))
        return
      }

      if (e.key === 'Tab') {
        e.preventDefault()
        if (target[pos] !== ' ') {
          flashError()
          return
        }
        // Insert this line's full indentation run in one press.
        let end = pos
        while (end < target.length && target[end] === ' ') end += 1
        commit(target.slice(0, end))
        return
      }

      // Printable single characters only.
      if (e.key.length === 1) {
        e.preventDefault()
        if (e.key === target[pos]) {
          commit(target.slice(0, pos + 1))
        } else {
          flashError()
        }
      }
    },
    [typed, target, commit, flashError, countContentDone],
  )

  const progress = target.length ? Math.round((typed.length / target.length) * 100) : 0

  // The line the caret is currently on: the last line whose start is reached.
  let currentLine = 0
  for (let k = 0; k < lines.length; k++) {
    if (lines[k].start <= typed.length) currentLine = k
    else break
  }

  return (
    <div className="space-y-4">
      {focus && (
        <p className="font-display text-sm text-ink-soft">
          <span className="font-semibold text-ink">{pattern.title}</span>
          {' — '}
          {pattern.summary}
        </p>
      )}
      {!focus && (
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-ink-faint uppercase">
              Type it exactly — errors are blocked
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              <span className="font-semibold text-ink">{pattern.title}</span>
              {' — '}
              {pattern.summary}
            </p>
          </div>
          <span className="shrink-0 text-sm font-semibold text-ink-faint">
            {typed.length} / {target.length}
          </span>
        </div>
      )}

      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={() => containerRef.current?.focus()}
        className={`relative cursor-text overflow-x-auto rounded-2xl border bg-[#fbf7ec] p-4 font-mono text-sm leading-6 outline-none transition-colors focus:border-line-strong ${
          errorFlash ? 'border-bad ring-1 ring-bad' : 'border-line'
        }`}
      >
        <pre className="m-0 whitespace-pre break-words" style={{ fontFamily: 'inherit' }}>
          {lines.map((ln, li) => {
            const contentEnd = ln.start + ln.text.length
            const flashing = flashLine === li
            const chars = [...ln.text]
            // Only the current line's remainder is ghosted; lines below it are
            // not rendered until the caret reaches them.
            if (li > currentLine) return null
            return (
              <div
                key={li}
                className="rounded-sm transition-colors duration-150"
                style={{
                  minHeight: '1.5rem',
                  backgroundColor: flashing ? '#22c55e' : 'transparent',
                }}
              >
                {chars.map((ch, ci) => {
                  const i = ln.start + ci
                  const isCaret = i === typed.length
                  if (flashing) {
                    return (
                      <span key={ci} className="font-semibold text-white">
                        {ch}
                      </span>
                    )
                  }
                  if (i < typed.length) {
                    return (
                      <span key={ci} className="text-ink">
                        {ch}
                      </span>
                    )
                  }
                  return (
                    <span
                      key={ci}
                      className={isCaret ? 'border-l-2 border-py' : ''}
                      style={{ color: '#b9ac91' }}
                    >
                      {ch}
                    </span>
                  )
                })}
                {/* Caret sitting on the newline at the end of a completed line. */}
                {!flashing && typed.length === contentEnd && contentEnd < target.length && (
                  <span className="border-l-2 border-py"> </span>
                )}
                {/* Caret at the very end when the whole template is typed. */}
                {!flashing &&
                  li === lines.length - 1 &&
                  typed.length >= target.length && (
                    <span className="border-l-2 border-py" />
                  )}
              </div>
            )
          })}
        </pre>
      </div>

      {!focus && (
        <div className="flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-py transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="w-24 text-right text-xs text-ink-faint">
            {mistakes} blocked
          </span>
        </div>
      )}
    </div>
  )
}
