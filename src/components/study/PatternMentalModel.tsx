import type { Pattern } from '@/types/study'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { WriteOnPaper } from '@/components/study/WriteOnPaper'

function InfoList({
  title,
  icon,
  items,
  accent,
  badge,
}: {
  title: string
  icon: string
  items: string[]
  accent?: string
  badge?: React.ReactNode
}) {
  return (
    <div className="rounded-3xl border border-line bg-surface p-5">
      <h3 className="mb-3 flex flex-wrap items-center gap-2 text-sm font-semibold tracking-wide text-ink-soft uppercase">
        <i className={icon} style={{ color: accent }} aria-hidden="true" />
        {title}
        {badge}
      </h3>
      <ul className="space-y-2 text-sm text-ink">
        {items.map((it, i) => (
          <li key={i} className="flex gap-x-2">
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: accent ?? 'var(--color-line-strong)' }}
            />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Shared render of a pattern's full mental model: recognition triggers, key
 * ideas, pitfalls, edge cases, the canonical template (flagged for hand-writing),
 * and an optional worked example. Reused by both the Library pattern page and the
 * inline roadmap so the two never drift.
 */
export function PatternMentalModel({ pattern: p }: { pattern: Pattern }) {
  return (
    <>
      <div className="grid gap-5 lg:grid-cols-2">
        <InfoList
          title="When to reach for it"
          icon="fa-solid fa-lightbulb"
          items={p.triggers}
          accent={p.accent}
        />
        <InfoList
          title="Key ideas"
          icon="fa-solid fa-list-ol"
          items={p.keyIdeas}
          accent={p.accent}
          badge={<WriteOnPaper label="Write on paper" />}
        />
        <InfoList
          title="Common pitfalls"
          icon="fa-solid fa-triangle-exclamation"
          items={p.pitfalls}
          accent="#c23b2b"
        />
        <InfoList
          title="Edge cases to check"
          icon="fa-solid fa-shield-halved"
          items={p.edgeCases}
          accent="#b45309"
        />
      </div>

      <section className="mt-8">
        <h2 className="font-display mb-3 flex flex-wrap items-center gap-3 text-xl font-semibold text-ink">
          Canonical template <span className="text-ink-faint">(memorize this)</span>
          <WriteOnPaper />
        </h2>
        <CodeBlock code={p.template} language="python" />
      </section>

      {p.workedExample && (
        <section className="mt-8">
          <h2 className="font-display mb-1 text-xl font-semibold text-ink">Worked example</h2>
          <p className="text-sm font-medium text-py">{p.workedExample.problem}</p>
          <p className="mt-2 mb-3 max-w-3xl text-sm text-ink-soft">{p.workedExample.approach}</p>
          <CodeBlock code={p.workedExample.code} language="python" />
        </section>
      )}
    </>
  )
}
