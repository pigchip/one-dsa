import { LANGUAGES } from '@/data/languages'
import { SYNTAX_CATEGORIES } from '@/data/syntaxTable'
import { useLanguageFilter } from '@/context/useLanguageFilter'
import { CodeBlock } from '@/components/ui/CodeBlock'
import type { Language, RowTone, SyntaxRow } from '@/types'

const TONE_CLASS: Record<RowTone, string> = {
  good: 'tone-good',
  bad: 'tone-bad',
  neutral: 'tone-neutral',
}

export function SyntaxTable() {
  const { selected, isSelected } = useLanguageFilter()
  const langs = LANGUAGES.filter((l) => isSelected(l.id))
  const span = langs.length + 1

  return (
    <section id="syntax-comparison" className="mx-auto max-w-7xl px-6 pb-16">
      <div className="mb-6">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          1. Syntax Comparison Table
        </h2>
        <p className="mt-1 text-ink-soft">
          Core constructs plus the collections, conversions, string and bit
          tricks you actually reach for in interviews.{' '}
          <span className="text-py">Columns filter</span> with the toggles above.
        </p>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-line shadow-sm">
        <table className="syntax-table w-full bg-surface text-sm">
          <thead>
            <tr className="bg-surface-2">
              <th className="topic-cell px-6 py-4 text-left text-sm font-semibold text-ink">
                Syntax Topic
              </th>
              {langs.map((lang) => (
                <th key={lang.id} className="min-w-[240px] py-4 text-center">
                  <div className="flex flex-col items-center" style={{ color: lang.color }}>
                    <i className={`${lang.icon} text-lg`} />
                    <span className="mt-1 font-semibold">{lang.label}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SYNTAX_CATEGORIES.map((category) => (
              <CategoryGroup
                key={category.title}
                title={category.title}
                rows={category.rows}
                langs={langs}
                span={span}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center gap-x-2 text-xs text-ink-faint">
        <i className="fa-solid fa-circle-info" />
        <span>
          Green = similar to Python / concise &amp; flexible. Red = more
          explicit, verbose or different paradigm. Purple = modern gradual
          typing (TS).
        </span>
      </div>

      <p className="sr-only">{selected.length} languages selected</p>
    </section>
  )
}

interface GroupProps {
  title: string
  rows: SyntaxRow[]
  langs: Language[]
  span: number
}

function CategoryGroup({ title, rows, langs, span }: GroupProps) {
  return (
    <>
      <tr>
        <th
          colSpan={span}
          className="section-header px-6 py-2 text-left text-xs font-semibold tracking-[1.5px] uppercase"
        >
          {title}
        </th>
      </tr>
      {rows.map((row) => (
        <tr key={row.topic}>
          <td className="topic-cell px-6 align-middle font-semibold">
            {row.topic}
          </td>
          {langs.map((lang) => (
            <td
              key={lang.id}
              className={row.tone?.[lang.id] ? TONE_CLASS[row.tone[lang.id]!] : ''}
            >
              <CodeBlock code={row.code[lang.id]} language={lang.id} />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}
