import { TEMPLATES } from '@/data/templates'
import { TemplateCard } from '@/components/ui/TemplateCard'

export function DsaTemplates() {
  return (
    <section id="dsa-templates" className="mx-auto max-w-7xl px-6 pb-20">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            3. All Code Templates
          </h2>
          <p className="mt-1 max-w-3xl text-ink-soft">
            Every template from the course. Use{' '}
            <strong>Section 2 (Common Input Patterns)</strong> + the syntax
            table above for all repetitive boilerplate (reading arrays,
            matrices, from file, EOF, etc.).
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-surface px-4 py-2 text-xs text-ink-faint">
          <i className="fa-solid fa-circle-info mr-1" /> Click any template to
          expand
        </div>
      </div>

      {TEMPLATES.map((template) => (
        <TemplateCard key={template.title} template={template} />
      ))}

      <div className="mt-8 rounded-3xl border border-line bg-surface p-5 text-center">
        <p className="text-sm text-ink-soft">
          These templates cover the vast majority of LeetCode / interview DSA
          problems. Master the syntax comparison table first, then practice
          implementing each template from a completely blank file using only the
          techniques listed above.
        </p>
      </div>
    </section>
  )
}
