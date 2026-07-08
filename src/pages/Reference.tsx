import { LanguageFilterProvider } from '@/context/LanguageFilterProvider'
import { ColorLegend } from '@/components/sections/ColorLegend'
import { LanguageToggles } from '@/components/sections/LanguageToggles'
import { SyntaxTable } from '@/components/sections/SyntaxTable'
import { InputPatterns } from '@/components/sections/InputPatterns'
import { HowToStart } from '@/components/sections/HowToStart'
import { DsaTemplates } from '@/components/sections/DsaTemplates'

/**
 * The original multi-language reference: syntax comparison table, input
 * patterns, "from blank file" tips and all DSA template cards. Kept intact as
 * a browsable reference alongside the Python-first study experience.
 */
export function Reference() {
  return (
    <LanguageFilterProvider>
      <header className="mx-auto max-w-7xl px-6 pt-12 pb-6">
        <p className="text-sm font-semibold tracking-wide text-py uppercase">
          Reference
        </p>
        <h1 className="font-display mt-1 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Syntax &amp; templates, four languages
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-ink-soft">
          Look up exact syntax across Python, C#, TypeScript and Rust, plus the
          full template library. Use the{' '}
          <strong>Practice</strong> and <strong>Library</strong> tabs to turn
          this reference into memory.
        </p>
      </header>
      <ColorLegend />
      <LanguageToggles />
      <SyntaxTable />
      <InputPatterns />
      <HowToStart />
      <DsaTemplates />
    </LanguageFilterProvider>
  )
}
