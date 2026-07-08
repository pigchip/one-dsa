import { UNIVERSAL_STEPS, KEY_TECHNIQUES } from '@/data/howToStart'
import { RichText } from '@/components/ui/RichText'

export function HowToStart() {
  return (
    <section id="how-to-start" className="mx-auto max-w-7xl px-6 pb-16">
      <div className="rounded-3xl border border-line bg-surface p-8">
        <h2 className="font-display mb-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          How to Write Any Template from a Blank File
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h4 className="mb-3 flex items-center gap-x-2 font-semibold text-py">
              <i className="fa-solid fa-file-code" />
              <span>Universal Steps (All Languages)</span>
            </h4>
            <ol className="list-inside list-decimal space-y-2 text-sm text-ink-soft">
              {UNIVERSAL_STEPS.map((step, i) => (
                <RichText key={i} as="li" html={step} />
              ))}
            </ol>
          </div>

          <div>
            <h4 className="mb-3 flex items-center gap-x-2 font-semibold text-py">
              <i className="fa-solid fa-key" />
              <span>Key Techniques You Must Know</span>
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {KEY_TECHNIQUES.map((tech) => (
                <span
                  key={tech}
                  className="rounded-2xl border border-line bg-surface-2 px-3 py-1 text-ink-soft"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
