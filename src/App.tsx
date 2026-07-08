import { Routes, Route } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Dashboard } from '@/pages/Dashboard'
import { Library } from '@/pages/Library'
import { PatternPage } from '@/pages/PatternPage'
import { Practice } from '@/pages/Practice'
import { Reference } from '@/pages/Reference'
import { Settings } from '@/pages/Settings'
import { NotFound } from '@/pages/NotFound'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/library" element={<Library />} />
          <Route path="/library/:patternId" element={<PatternPage />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/reference" element={<Reference />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
