import { useEffect, useState } from 'react'
import { highlight } from '@/lib/highlighter'
import type { LanguageId } from '@/types'
import { LANGUAGE_BY_ID } from '@/data/languages'

interface CodeBlockProps {
  code: string
  language: LanguageId
  className?: string
}

/**
 * Renders a code snippet with accurate, per-language syntax highlighting via
 * Shiki. While the (async) highlighter loads, a plain monospace fallback is
 * shown so the layout never shifts.
 */
export function CodeBlock({ code, language, className }: CodeBlockProps) {
  const grammar = LANGUAGE_BY_ID[language].grammar
  const [html, setHtml] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    highlight(code, grammar)
      .then((result) => {
        if (active) setHtml(result)
      })
      .catch(() => {
        if (active) setHtml(null)
      })
    return () => {
      active = false
    }
  }, [code, grammar])

  return (
    <div className={`code-card ${className ?? ''}`}>
      {html ? (
        <div dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <pre className="code-plain">{code}</pre>
      )}
    </div>
  )
}
