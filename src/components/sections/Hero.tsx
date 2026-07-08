export function Hero() {
  return (
    <header id="top" className="mx-auto max-w-7xl px-6 pt-12 pb-8">
      <div className="max-w-3xl">
        <div className="mb-6 inline-flex items-center gap-x-2 rounded-3xl border border-line bg-surface px-4 py-1.5">
          <span className="text-py">
            <i className="fa-solid fa-globe fa-fw" />
          </span>
          <span className="text-sm font-medium text-ink-soft">
            Python • C# • TypeScript • Rust
          </span>
        </div>

        <h1 className="font-display mb-4 text-5xl leading-[1.05] font-semibold tracking-tight text-ink sm:text-6xl">
          Syntax Comparison.
          <br />
          <span className="text-py">DSA Templates.</span>
          <br />
          From blank file to solution.
        </h1>
        <p className="max-w-xl text-lg text-ink-soft">
          A practical guide comparing core syntax across four languages and the
          exact techniques needed to implement every common DSA code template
          from scratch.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#syntax-comparison"
            className="inline-flex items-center justify-center rounded-3xl bg-py px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <i className="fa-solid fa-table mr-2" />
            Explore Syntax Table
          </a>
          <a
            href="#dsa-templates"
            className="inline-flex items-center justify-center rounded-3xl border border-line-strong bg-surface px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-surface-2"
          >
            <i className="fa-solid fa-list mr-2" />
            View All Templates
          </a>
        </div>
      </div>
    </header>
  )
}
