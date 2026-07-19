import { ROADMAP_PHASES, PROBLEM_LIST_META } from '@/data/roadmap'
import { PATTERN_BY_ID } from '@/data/patterns'
import { SYNTAX_CATEGORIES } from '@/data/syntaxTable'
import { INPUT_PATTERNS } from '@/data/inputPatterns'
import { TEMPLATES } from '@/data/templates'
import { useProgress } from '@/context/useProgress'
import { patternMastery } from '@/lib/selectors'
import type { ProgressState } from '@/lib/storage'
import type { RoadmapPhase, RoadmapProblem, ProblemDifficulty } from '@/types/study'
import type { SyntaxCategory, InputSnippet, TemplateCard } from '@/types'
import { Collapsible } from '@/components/ui/Collapsible'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { RichText } from '@/components/ui/RichText'
import { MasteryBadge } from '@/components/study/MasteryBadge'
import { WriteOnPaper } from '@/components/study/WriteOnPaper'
import { PatternMentalModel } from '@/components/study/PatternMentalModel'
import { InlinePatternDrills } from '@/components/study/InlinePatternDrills'

// --- Content lookups (by the ids/titles referenced in roadmap.ts) ------------
const SYNTAX_BY_TITLE: Record<string, SyntaxCategory> = SYNTAX_CATEGORIES.reduce(
  (acc, c) => {
    acc[c.title] = c
    return acc
  },
  {} as Record<string, SyntaxCategory>,
)

const PY_INPUT_BY_LABEL: Record<string, InputSnippet> = (
  INPUT_PATTERNS.find((c) => c.language === 'python')?.snippets ?? []
).reduce(
  (acc, s) => {
    acc[s.label] = s
    return acc
  },
  {} as Record<string, InputSnippet>,
)

const TEMPLATE_BY_TITLE: Record<string, TemplateCard> = TEMPLATES.reduce(
  (acc, t) => {
    acc[t.title] = t
    return acc
  },
  {} as Record<string, TemplateCard>,
)

/** Average score + total due across all patterns drilled in a phase. */
function phaseProgress(state: ProgressState, phase: RoadmapPhase) {
  const ids = phase.patternIds
  if (ids.length === 0) return { pct: 0, due: 0 }
  let scoreSum = 0
  let due = 0
  for (const id of ids) {
    const m = patternMastery(state, id)
    scoreSum += m.score
    due += m.due
  }
  return { pct: Math.round((scoreSum / ids.length) * 100), due }
}

function SyntaxEmbed({ title }: { title: string }) {
  const cat = SYNTAX_BY_TITLE[title]
  if (!cat) return null
  return (
    <div className="space-y-4">
      {cat.rows.map((row) => (
        <div key={row.topic}>
          <p className="mb-1 text-sm font-semibold text-ink">{row.topic}</p>
          {row.note && <p className="mb-1.5 text-xs text-ink-faint">{row.note}</p>}
          <CodeBlock code={row.code.python} language="python" />
        </div>
      ))}
    </div>
  )
}

function InputEmbed({ labels }: { labels: string[] }) {
  return (
    <div className="space-y-4">
      {labels.map((label) => {
        const snippet = PY_INPUT_BY_LABEL[label]
        if (!snippet) return null
        return (
          <div key={label}>
            <p className="mb-1 text-sm font-semibold text-ink">{snippet.label}</p>
            <CodeBlock code={snippet.code} language="python" />
          </div>
        )
      })}
    </div>
  )
}

function TemplateEmbed({ template }: { template: TemplateCard }) {
  return (
    <div className="space-y-4 text-sm">
      {template.description && <p className="text-ink-soft">{template.description}</p>}
      <div className="grid gap-5 md:grid-cols-2">
        {template.columns.map((col) => (
          <div key={col.heading}>
            <div
              className="mb-2 text-xs font-semibold tracking-wider uppercase"
              style={{ color: template.accent }}
            >
              {col.heading}
            </div>
            <ul className="space-y-1 text-ink-soft">
              {col.items.map((item, i) => (
                <li key={i} className="flex gap-x-2">
                  <span aria-hidden style={{ color: template.accent }}>
                    •
                  </span>
                  <RichText html={item} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {template.note && <RichText as="p" html={template.note} className="text-xs text-ink-faint" />}
      {template.code?.python && (
        <div>
          <div className="mb-1.5 flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wider text-ink-soft uppercase">
            Reference implementation <WriteOnPaper />
          </div>
          <CodeBlock code={template.code.python} language="python" />
        </div>
      )}
    </div>
  )
}

const DIFFICULTY_STYLE: Record<ProblemDifficulty, { color: string; bg: string }> = {
  Easy: { color: '#0a7d55', bg: '#d9f2e6' },
  Medium: { color: '#a15c00', bg: '#fbeeda' },
  Hard: { color: '#b3261e', bg: '#fbe0dd' },
}

function ProblemsEmbed({ problems }: { problems: RoadmapProblem[] }) {
  return (
    <div className="space-y-2">
      <p className="mb-1 text-xs text-ink-faint">
        Solvable with this phase's patterns (and everything before it).
      </p>
      {problems.map((p) => {
        const diff = DIFFICULTY_STYLE[p.difficulty]
        return (
          <a
            key={p.id}
            href={`https://leetcode.com/problems/${p.slug}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-line bg-surface-2 px-4 py-2.5 transition-colors hover:border-line-strong hover:bg-surface"
          >
            <span className="flex min-w-0 items-center gap-x-2 text-sm">
              <span className="font-mono text-xs text-ink-faint">{p.id}</span>
              <span className="truncate font-semibold text-ink">{p.title}</span>
              <i
                className="fa-solid fa-arrow-up-right-from-square text-[10px] text-ink-faint"
                aria-hidden="true"
              />
            </span>
            <span className="flex shrink-0 items-center gap-1.5">
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={{ color: diff.color, backgroundColor: diff.bg }}
              >
                {p.difficulty}
              </span>
              {p.lists.map((list) => {
                const meta = PROBLEM_LIST_META[list]
                return (
                  <span
                    key={list}
                    title={meta.label}
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={{
                      color: meta.color,
                      backgroundColor: `color-mix(in srgb, ${meta.color} 14%, transparent)`,
                    }}
                  >
                    {meta.short}
                  </span>
                )
              })}
            </span>
          </a>
        )
      })}
    </div>
  )
}

function PhaseCard({
  phase,
  state,
  isLast,
}: {
  phase: RoadmapPhase
  state: ProgressState
  isLast: boolean
}) {
  const { pct, due } = phaseProgress(state, phase)

  return (
    <div className="relative pl-16">
      {/* Timeline rail */}
      <span
        className="absolute top-0 left-6 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-2xl text-lg font-semibold text-white"
        style={{ backgroundColor: phase.accent }}
      >
        {phase.order}
      </span>
      {!isLast && (
        <span className="absolute top-12 bottom-[-2rem] left-6 w-px -translate-x-1/2 bg-line" />
      )}

      <article className="mb-8 rounded-3xl border border-line bg-surface p-6">
        <header className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-x-2">
              <i className={phase.icon} style={{ color: phase.accent }} aria-hidden="true" />
              <h2 className="font-display text-2xl font-semibold text-ink">{phase.title}</h2>
            </div>
            <p className="text-sm text-ink-faint">{phase.subtitle}</p>
          </div>
          {due > 0 && (
            <span className="rounded-full bg-[#fbe7e3] px-3 py-1 text-xs font-semibold text-bad">
              {due} due
            </span>
          )}
        </header>

        <p className="mb-4 max-w-3xl text-sm text-ink-soft">
          <span className="font-semibold text-ink">Goal: </span>
          {phase.goal}
        </p>

        {/* Phase mastery bar */}
        <div className="mb-6">
          <div className="mb-1 flex items-center justify-between text-xs text-ink-faint">
            <span>Phase mastery</span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${pct}%`, backgroundColor: phase.accent }}
            />
          </div>
        </div>

        {/* Syntax */}
        {phase.syntaxTopics.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 flex items-center gap-x-2 text-xs font-semibold tracking-wide text-ink-faint uppercase">
              <i className="fa-solid fa-code" aria-hidden="true" /> Syntax to review
            </p>
            {phase.syntaxTopics.map((t) => (
              <Collapsible key={t} title={t} icon="fa-solid fa-table" accent={phase.accent}>
                <SyntaxEmbed title={t} />
              </Collapsible>
            ))}
          </div>
        )}

        {/* Input */}
        {phase.inputSnippets.length > 0 && (
          <div className="mb-4">
            <Collapsible
              title="Reading input"
              subtitle={`${phase.inputSnippets.length} Python snippet${phase.inputSnippets.length === 1 ? '' : 's'}`}
              icon="fa-solid fa-keyboard"
              accent={phase.accent}
            >
              <InputEmbed labels={phase.inputSnippets} />
            </Collapsible>
          </div>
        )}

        {/* Templates */}
        {phase.templates.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 flex items-center gap-x-2 text-xs font-semibold tracking-wide text-ink-faint uppercase">
              <i className="fa-solid fa-shapes" aria-hidden="true" /> Templates
            </p>
            {phase.templates.map((title) => {
              const template = TEMPLATE_BY_TITLE[title]
              if (!template) return null
              return (
                <Collapsible
                  key={title}
                  title={template.title}
                  icon={template.icon}
                  accent={template.accent}
                  practice
                >
                  <TemplateEmbed template={template} />
                </Collapsible>
              )
            })}
          </div>
        )}

        {/* Patterns: full mental model + inline drills */}
        <div className="mb-4">
          <p className="mb-2 flex items-center gap-x-2 text-xs font-semibold tracking-wide text-ink-faint uppercase">
            <i className="fa-solid fa-brain" aria-hidden="true" /> Patterns
          </p>
          {phase.patternIds.map((id) => {
            const p = PATTERN_BY_ID[id]
            if (!p) return null
            const m = patternMastery(state, id)
            return (
              <Collapsible
                key={id}
                title={p.title}
                subtitle={`${p.complexity.time} time · ${p.complexity.space} space`}
                icon={p.icon}
                accent={p.accent}
                practice
                badge={<MasteryBadge level={m.level} />}
              >
                <p className="mb-5 max-w-3xl text-sm text-ink-soft">{p.summary}</p>
                <PatternMentalModel pattern={p} />
                <section className="mt-8">
                  <h3 className="font-display mb-3 flex items-center gap-x-2 text-lg font-semibold text-ink">
                    <i className="fa-solid fa-dumbbell text-py" aria-hidden="true" /> Drill it
                  </h3>
                  <InlinePatternDrills patternId={id} />
                </section>
              </Collapsible>
            )
          })}
        </div>

        {/* Practice problems */}
        {phase.problems.length > 0 && (
          <div className="mb-4">
            <Collapsible
              title="Practice problems"
              subtitle={`${phase.problems.length} curated from Top 150 · Blind 75 · NeetCode 150`}
              icon="fa-solid fa-list-check"
              accent={phase.accent}
              practice
            >
              <ProblemsEmbed problems={phase.problems} />
            </Collapsible>
          </div>
        )}

        {/* Write-on-paper memorization targets */}
        {phase.writeOnPaper.length > 0 && (
          <div className="mt-2 rounded-2xl border border-dashed border-[#d8b26a] bg-[#fbf6ea] p-4">
            <div className="mb-2 flex items-center gap-x-2">
              <WriteOnPaper />
              <span className="text-xs text-ink-faint">
                Reproduce these from memory, by hand, before moving on.
              </span>
            </div>
            <ul className="ml-1 space-y-1 text-sm text-ink-soft">
              {phase.writeOnPaper.map((item) => (
                <li key={item} className="flex items-start gap-x-2">
                  <i
                    className="fa-solid fa-pen-nib mt-1 text-xs text-[#b8862f]"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-5 border-t border-line pt-4 text-xs text-ink-faint">
          <i className="fa-solid fa-arrow-trend-up mr-1.5" aria-hidden="true" />
          Drill sequence: <span className="font-semibold text-ink-soft">recognition</span> →{' '}
          <span className="font-semibold text-ink-soft">fill-in</span> →{' '}
          <span className="font-semibold text-ink-soft">code recall</span>. Master this phase
          before starting phase {phase.order + 1}.
        </div>
      </article>
    </div>
  )
}

export function Roadmap() {
  const { state } = useProgress()

  const overall = ROADMAP_PHASES.reduce(
    (acc, phase) => {
      const { pct, due } = phaseProgress(state, phase)
      acc.pctSum += pct
      acc.due += due
      return acc
    },
    { pctSum: 0, due: 0 },
  )
  const overallPct = Math.round(overall.pctSum / ROADMAP_PHASES.length)

  return (
    <div className="mx-auto max-w-5xl px-6 pt-12 pb-20">
      <header className="mb-10">
        <p className="text-sm font-semibold tracking-wide text-py uppercase">Roadmap</p>
        <h1 className="font-display mt-1 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          The Python DSA path
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-ink-soft">
          {ROADMAP_PHASES.length} ordered phases with everything embedded in place —
          syntax, input handling, templates, full pattern mental models, and the
          drills themselves. Each phase builds on the one before it; work top to
          bottom and never leave this page.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4 rounded-3xl border border-line bg-surface p-5">
          <div className="min-w-[12rem] flex-1">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-semibold text-ink">Overall roadmap mastery</span>
              <span className="text-ink-faint">{overallPct}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-py transition-all"
                style={{ width: `${overallPct}%` }}
              />
            </div>
          </div>
          {overall.due > 0 && (
            <span className="rounded-full bg-[#fbe7e3] px-3 py-1 text-sm font-semibold text-bad">
              {overall.due} cards due
            </span>
          )}
        </div>

        <div
          className="mt-4 flex items-center gap-3 rounded-2xl border border-dashed p-4 text-sm text-ink-soft"
          style={{ borderColor: '#d8b26a', backgroundColor: '#fbf6ea' }}
        >
          <i className="fa-solid fa-pen-to-square text-lg text-[#b8862f]" aria-hidden="true" />
          <span>
            Watch for the{' '}
            <span className="font-semibold text-[#8a5a00]">"Practice this writing on paper"</span>{' '}
            badge — those items are worth reproducing by hand until you can do it
            without looking.
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-ink-soft">
          <span className="text-xs font-semibold tracking-wide text-ink-faint uppercase">
            Problem sets
          </span>
          {(Object.keys(PROBLEM_LIST_META) as (keyof typeof PROBLEM_LIST_META)[]).map((key) => {
            const meta = PROBLEM_LIST_META[key]
            return (
              <a
                key={key}
                href={meta.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-x-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-opacity hover:opacity-80"
                style={{
                  color: meta.color,
                  backgroundColor: `color-mix(in srgb, ${meta.color} 14%, transparent)`,
                }}
              >
                {meta.label}
                <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" aria-hidden="true" />
              </a>
            )
          })}
        </div>
      </header>

      <div>
        {ROADMAP_PHASES.map((phase, i) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            state={state}
            isLast={i === ROADMAP_PHASES.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
