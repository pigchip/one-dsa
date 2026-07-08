interface RichTextProps {
  html: string
  as?: 'span' | 'li' | 'p' | 'div'
  className?: string
}

/**
 * Renders trusted, static markup that may contain inline <code>/<strong> tags
 * from the data layer.
 */
export function RichText({ html, as = 'span', className }: RichTextProps) {
  const Tag = as
  return (
    <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />
  )
}
