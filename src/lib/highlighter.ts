import { createHighlighterCore, type HighlighterCore } from 'shiki/core'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'
import githubLight from 'shiki/themes/github-light.mjs'
import python from 'shiki/langs/python.mjs'
import csharp from 'shiki/langs/csharp.mjs'
import typescript from 'shiki/langs/typescript.mjs'
import rust from 'shiki/langs/rust.mjs'

const THEME = 'github-light'

let highlighterPromise: Promise<HighlighterCore> | null = null

/** Lazily create a single shared Shiki highlighter for the four languages. */
export function getHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [githubLight],
      langs: [python, csharp, typescript, rust],
      engine: createOnigurumaEngine(import('shiki/wasm')),
    })
  }
  return highlighterPromise
}

const cache = new Map<string, string>()

/** Highlight `code` in `lang`, returning Shiki-generated HTML. Cached per (lang, code). */
export async function highlight(code: string, lang: string): Promise<string> {
  const key = `${lang}\u0000${code}`
  const cached = cache.get(key)
  if (cached) return cached

  const highlighter = await getHighlighter()
  const html = highlighter.codeToHtml(code, {
    lang,
    theme: THEME,
  })
  cache.set(key, html)
  return html
}
