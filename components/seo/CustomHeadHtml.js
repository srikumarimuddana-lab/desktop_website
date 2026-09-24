import { parseHeadFragment } from '@/lib/sanitize-html'

/*
 * Server-renders admin-authored <head> HTML (seo_pages.custom_head) as real
 * sibling elements of <head> — never wrapped in a <div>, since anything not
 * legal inside <head> gets relocated into <body> by the HTML parser, which
 * would defeat the point for crawlers that read raw HTML instead of running
 * the client-side version in components/seo/CustomScripts.js.
 */
export default function CustomHeadHtml({ html }) {
  const nodes = parseHeadFragment(html)
  if (!nodes.length) return null

  return nodes.map(({ tag: Tag, attrs, inner }, i) =>
    inner !== null ? (
      <Tag key={`custom-head-${i}`} {...attrs} dangerouslySetInnerHTML={{ __html: inner }} />
    ) : (
      <Tag key={`custom-head-${i}`} {...attrs} />
    )
  )
}
