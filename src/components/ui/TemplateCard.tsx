import type { TemplateCard as TemplateCardData } from '@/types'
import { RichText } from '@/components/ui/RichText'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { LANGUAGES } from '@/data/languages'
import { useLanguageFilter } from '@/context/useLanguageFilter'

const GRID_COLS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-3',
}

export function TemplateCard({ template }: { template: TemplateCardData }) {
  const { isSelected } = useLanguageFilter()
  const cols = GRID_COLS[template.columns.length] ?? 'grid-cols-1'
  const codeLangs = LANGUAGES.filter(
    (l) => isSelected(l.id) && template.code?.[l.id],
  )

  return (
    <details className="template-card group mb-3 rounded-3xl border border-line bg-surface">
      <summary className="flex cursor-pointer items-center justify-between gap-3 rounded-3xl px-6 py-4 hover:bg-surface-2">
        <div className="flex items-center gap-x-4">
          <span style={{ color: template.accent }}>
            <i className={`${template.icon} fa-fw`} />
          </span>
          <span className="text-base font-semibold text-ink sm:text-lg">
            {template.title}
          </span>
        </div>
        <span
          className="shrink-0 rounded-2xl px-3 py-1 text-xs transition-transform group-open:rotate-180"
          style={{
            color: template.accent,
            backgroundColor: `color-mix(in srgb, ${template.accent} 14%, transparent)`,
          }}
        >
          <i className="fa-solid fa-chevron-down" />
        </span>
      </summary>

      <div className="border-t border-line px-6 pt-3 pb-6 text-sm">
        {template.description && (
          <p className="mb-4 text-ink-soft">{template.description}</p>
        )}

        <div className={`grid gap-6 ${cols}`}>
          {template.columns.map((col) => (
            <div key={col.heading}>
              <div
                className="mb-2 text-xs font-semibold tracking-wider uppercase"
                style={{ color: template.accent }}
              >
                {col.heading}
              </div>
              <ul className="space-y-1 text-sm text-ink-soft">
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

        {template.note && (
          <RichText as="p" html={template.note} className="mt-4 text-xs" />
        )}

        {codeLangs.length > 0 && (
          <div className="mt-6">
            <div
              className="mb-2 text-xs font-semibold tracking-wider uppercase"
              style={{ color: template.accent }}
            >
              Reference implementation
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {codeLangs.map((lang) => (
                <div key={lang.id}>
                  <div
                    className="mb-1 flex items-center gap-x-2 text-xs font-semibold"
                    style={{ color: lang.color }}
                  >
                    <i className={lang.icon} />
                    {lang.label}
                  </div>
                  <CodeBlock code={template.code![lang.id]!} language={lang.id} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </details>
  )
}
