import { Link } from 'react-router-dom'
import { useProgress } from '@/context/useProgress'
import { deckStats, patternMastery } from '@/lib/selectors'
import { PATTERNS } from '@/data/patterns'
import { MASTERY_META } from '@/components/study/mastery'

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string
  value: string | number
  icon: string
  accent: string
}) {
  return (
    <div className="rounded-3xl border border-line bg-surface p-5">
      <div className="flex items-center justify-between">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
          style={{ backgroundColor: accent }}
        >
          <i className={icon} />
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold text-ink">{value}</p>
      <p className="text-sm text-ink-faint">{label}</p>
    </div>
  )
}

export function Dashboard() {
  const { state } = useProgress()
  const stats = deckStats(state)
  const goal = state.settings.dailyGoal
  const goalPct = Math.min(100, Math.round((stats.reviewedToday / goal) * 100))

  return (
    <div className="mx-auto max-w-7xl px-6 pt-12 pb-20">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Master DSA, one recall at a time
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-ink-soft">
            Active-recall coding drills on a spaced-repetition schedule. Type
            solutions from memory, recognize patterns on sight, and let the
            system resurface what you are about to forget.
          </p>
        </div>
        <Link
          to="/practice"
          className="inline-flex items-center gap-x-2 rounded-3xl bg-py px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <i className="fa-solid fa-play" />
          {stats.due > 0 ? `Review ${stats.due} due` : 'Start a session'}
        </Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Due now" value={stats.due} icon="fa-solid fa-bell" accent="#c23b2b" />
        <StatCard
          label="Day streak"
          value={stats.streak}
          icon="fa-solid fa-fire"
          accent="#b45309"
        />
        <StatCard
          label="Mastered cards"
          value={`${stats.mastered}/${stats.total}`}
          icon="fa-solid fa-trophy"
          accent="#0e7c7b"
        />
        <StatCard
          label="Overall mastery"
          value={`${Math.round(stats.progress * 100)}%`}
          icon="fa-solid fa-chart-line"
          accent="#1a6fb0"
        />
      </div>

      <section className="mt-6 rounded-3xl border border-line bg-surface p-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">Today's goal</h2>
          <span className="text-sm text-ink-faint">
            {stats.reviewedToday} / {goal} reviews
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-py transition-all"
            style={{ width: `${goalPct}%` }}
          />
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-ink">Mastery map</h2>
          <Link to="/library" className="text-sm font-semibold text-py hover:underline">
            Open library <i className="fa-solid fa-arrow-right ml-1" />
          </Link>
        </div>
        <p className="mb-4 max-w-2xl text-sm text-ink-soft">
          Your mental model at a glance. Each tile is a pattern, colored by how
          well it lives in memory. Aim to turn the whole board green.
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {PATTERNS.map((p) => {
            const m = patternMastery(state, p.id)
            const meta = MASTERY_META[m.level]
            return (
              <Link
                key={p.id}
                to={`/library/${p.id}`}
                className="group relative overflow-hidden rounded-2xl border border-line bg-surface p-4 transition-transform hover:-translate-y-0.5"
              >
                <span
                  className="absolute inset-x-0 bottom-0 h-1"
                  style={{ backgroundColor: meta.color, opacity: 0.9 }}
                />
                <div className="flex items-start justify-between">
                  <i className={p.icon} style={{ color: p.accent }} />
                  {m.due > 0 && (
                    <span className="rounded-full bg-[#fbe7e3] px-2 py-0.5 text-[10px] font-semibold text-bad">
                      {m.due} due
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm font-semibold text-ink">{p.title}</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${Math.round(m.score * 100)}%`, backgroundColor: meta.color }}
                  />
                </div>
                <p className="mt-1.5 text-xs" style={{ color: meta.color }}>
                  {meta.label}
                </p>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        <QuickDrill
          to="/practice?kind=recognition"
          icon="fa-solid fa-lightbulb"
          title="Pattern recognition"
          blurb="Map problems to techniques."
        />
        <QuickDrill
          to="/practice?kind=code"
          icon="fa-solid fa-keyboard"
          title="Blank-file recall"
          blurb="Type templates from memory."
        />
        <QuickDrill
          to="/practice?kind=syntax"
          icon="fa-solid fa-code"
          title="Syntax recall"
          blurb="Drill Python primitives."
        />
      </section>
    </div>
  )
}

function QuickDrill({
  to,
  icon,
  title,
  blurb,
}: {
  to: string
  icon: string
  title: string
  blurb: string
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-x-4 rounded-3xl border border-line bg-surface p-5 transition-colors hover:bg-surface-2"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface-2 text-py">
        <i className={icon} />
      </span>
      <div>
        <p className="font-semibold text-ink">{title}</p>
        <p className="text-sm text-ink-faint">{blurb}</p>
      </div>
    </Link>
  )
}
