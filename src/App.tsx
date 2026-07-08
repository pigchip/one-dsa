import { LanguageFilterProvider } from '@/context/LanguageFilterProvider'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { ColorLegend } from '@/components/sections/ColorLegend'
import { LanguageToggles } from '@/components/sections/LanguageToggles'
import { SyntaxTable } from '@/components/sections/SyntaxTable'
import { InputPatterns } from '@/components/sections/InputPatterns'
import { HowToStart } from '@/components/sections/HowToStart'
import { DsaTemplates } from '@/components/sections/DsaTemplates'

function App() {
  return (
    <LanguageFilterProvider>
      <Navbar />
      <main>
        <Hero />
        <ColorLegend />
        <LanguageToggles />
        <SyntaxTable />
        <InputPatterns />
        <HowToStart />
        <DsaTemplates />
      </main>
      <Footer />
    </LanguageFilterProvider>
  )
}

export default App
