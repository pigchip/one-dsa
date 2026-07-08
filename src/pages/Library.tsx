import { Link } from 'react-router-dom'
import { PATTERNS, PATTERN_CATEGORIES } from '@/data/patterns'
import { useProgress } from '@/context/useProgress'
import { patternMastery } from '@/lib/selectors'
import { MasteryBadge } from '@/components/study/MasteryBadge'

const DIFFICULTY_LABEL: Record<string, string> = {
  foundational: 'Foundational',
  core: 'Core',
  advanced: 'Advanced',
}

export function Library() {
  const { state } = useProgress()

  return (
    <div className="mx-auto max-w-7xl px-6 pt-12 pb-20">
      <header className="mb-8">
        <p className="text-sm font-semibold tracking-wide text-py uppercase">
          Library
        </p>
        <h1 className="font-display mt-1 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          The pattern catalog
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-ink-soft">
          {PATTERNS.length} master-level mental models. Each page has the
          recognition triggers, complexity, the canonical Python template, and
          the traps. Open one, then drill it in Practice.
        </p>
      </header>

      {PATTERN_CATEGORIES.map((category) => (
        <section key={category} className="mb-10">
          <h2 className="font-display mb-4 text-lg font-semibold text-ink-soft">
            {category}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PATTERNS.filter((p) => p.category === category).map((p) => {
              const m = patternMastery(state, p.id)
              return (
                <Link
                  key={p.id}
                  to={`/library/${p.id}`}
                  className="group flex flex-col rounded-3xl border border-line bg-surface p-5 transition-colors hover:border-line-strong hover:bg-surface-2"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white"
                      style={{ backgroundColor: p.accent }}
                    >
                      <i className={p.icon} />
                    </span>
                    <MasteryBadge level={m.level} />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {p.title}
                  </h3>
                  <p className="mt-1 flex-1 text-sm text-ink-soft">{p.summary}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-ink-faint">
                    <span>{DIFFICULTY_LABEL[p.difficulty]}</span>
                    <span className="font-mono">
                      {p.complexity.time} · {p.complexity.space}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
