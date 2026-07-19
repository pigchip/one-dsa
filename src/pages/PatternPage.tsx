import { Link, useNavigate, useParams } from 'react-router-dom'
import { PATTERN_BY_ID } from '@/data/patterns'
import { useProgress } from '@/context/useProgress'
import { patternMastery } from '@/lib/selectors'
import { dueLabel } from '@/lib/srs'
import { MasteryBadge } from '@/components/study/MasteryBadge'
import { PatternMentalModel } from '@/components/study/PatternMentalModel'

export function PatternPage() {
  const { patternId } = useParams()
  const navigate = useNavigate()
  const { state } = useProgress()
  const p = patternId ? PATTERN_BY_ID[patternId] : undefined

  if (!p) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold text-ink">Pattern not found</h1>
        <Link to="/library" className="mt-4 inline-block text-py underline">
          Back to the library
        </Link>
      </div>
    )
  }

  const mastery = patternMastery(state, p.id)
  const codeCard = state.cards[`${p.id}:code`]

  return (
    <article className="mx-auto max-w-5xl px-6 pt-10 pb-20">
      <Link to="/library" className="text-sm text-ink-faint hover:text-ink">
        <i className="fa-solid fa-arrow-left mr-1" /> Library
      </Link>

      <header className="mt-4 mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
            style={{ backgroundColor: p.accent }}
          >
            <i className={`${p.icon} text-lg`} />
          </span>
          <div>
            <p className="text-xs font-semibold tracking-wide text-ink-faint uppercase">
              {p.category}
            </p>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {p.title}
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <MasteryBadge level={mastery.level} />
            <button
              onClick={() => navigate(`/practice?pattern=${p.id}`)}
              className="inline-flex items-center gap-x-2 rounded-2xl bg-py px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <i className="fa-solid fa-dumbbell" /> Drill this
            </button>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-lg text-ink-soft">{p.summary}</p>

        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <span className="rounded-xl border border-line bg-surface px-3 py-1.5 font-mono">
            time {p.complexity.time}
          </span>
          <span className="rounded-xl border border-line bg-surface px-3 py-1.5 font-mono">
            space {p.complexity.space}
          </span>
          {p.complexity.note && (
            <span className="rounded-xl border border-line bg-surface px-3 py-1.5 text-ink-faint">
              {p.complexity.note}
            </span>
          )}
          {codeCard && (
            <span className="rounded-xl border border-line bg-surface px-3 py-1.5 text-ink-faint">
              recall {dueLabel(codeCard)}
            </span>
          )}
        </div>
      </header>

      <PatternMentalModel pattern={p} />

      {(p.prerequisites.length > 0 || p.related.length > 0) && (
        <section className="mt-8 flex flex-wrap gap-8">
          {p.prerequisites.length > 0 && (
            <RelatedGroup title="Prerequisites" ids={p.prerequisites} />
          )}
          {p.related.length > 0 && <RelatedGroup title="Related patterns" ids={p.related} />}
        </section>
      )}
    </article>
  )
}

function RelatedGroup({ title, ids }: { title: string; ids: string[] }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold tracking-wide text-ink-faint uppercase">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {ids.map((id) => {
          const rel = PATTERN_BY_ID[id]
          if (!rel) return null
          return (
            <Link
              key={id}
              to={`/library/${id}`}
              className="inline-flex items-center gap-x-2 rounded-xl border border-line bg-surface px-3 py-1.5 text-sm text-ink transition-colors hover:bg-surface-2"
            >
              <i className={rel.icon} style={{ color: rel.accent }} />
              {rel.title}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
