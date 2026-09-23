/*
 * Allowlist HTML sanitizer for CMS content, built on parse5.
 *
 * Why not DOMPurify here: SafeHtml used isomorphic-dompurify, which on the
 * server requires jsdom, and jsdom -> html-encoding-sniffer -> @exodus/bytes
 * ends in an ESM-only file. Vercel launches these functions with
 * --no-experimental-require-module (see process.execArgv in the
 * /api/agent/search health check), so that native require() threw
 * ERR_REQUIRE_ESM at module load and every page that server-renders SafeHtml
 * — the home page among them — answered 500. Bundling jsdom instead fails
 * too (it reads default-stylesheet.css from disk at load). parse5 has no
 * such dependency, runs identically in Node and the browser, and is already
 * installed as jsdom's own parser.
 *
 * What it keeps: the elements Tiptap (the CMS editor) and the backend's
 * plain-text-to-paragraph conversion produce. Anything unknown is unwrapped
 * (its text survives, the tag does not); anything that can run script, load
 * a document or take input is removed with its contents. Attributes are
 * allowlisted per element, and href/src must be http(s), mailto:, tel: or a
 * relative path — never javascript: or data:.
 *
 * Content only ever comes from the spinrvm backend or the authenticated
 * website CMS; this is defence in depth, not the only line.
 */
import { parseFragment, serialize } from 'parse5'

const ALLOWED = new Set([
  'p', 'br', 'hr', 'div', 'span',
  'strong', 'b', 'em', 'i', 'u', 's', 'del', 'ins', 'mark', 'small', 'sub', 'sup',
  'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'blockquote', 'code', 'pre', 'img', 'figure', 'figcaption',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
  'dl', 'dt', 'dd',
])

/* removed with everything inside them */
const DROP = new Set([
  'script', 'style', 'iframe', 'frame', 'frameset', 'object', 'embed', 'applet',
  'link', 'meta', 'base', 'noscript', 'template', 'svg', 'math',
  'form', 'input', 'button', 'textarea', 'select', 'option', 'title', 'head',
])

const GLOBAL_ATTRS = new Set(['class', 'title', 'lang', 'dir'])
const TAG_ATTRS = {
  a: new Set(['href', 'target', 'rel']),
  img: new Set(['src', 'alt', 'width', 'height']),
  th: new Set(['colspan', 'rowspan', 'scope']),
  td: new Set(['colspan', 'rowspan']),
  ol: new Set(['start', 'type']),
}
const URL_ATTRS = new Set(['href', 'src'])

function safeUrl(value) {
  const v = String(value || '').trim()
  if (!v) return null
  // scheme-relative and relative paths are fine; a scheme must be one of ours
  if (v.startsWith('/') || v.startsWith('#') || v.startsWith('?') || v.startsWith('.')) return v
  const m = /^([a-z][a-z0-9+.-]*):/i.exec(v)
  if (!m) return v
  return /^(https?|mailto|tel)$/i.test(m[1]) ? v : null
}

function cleanAttrs(tag, attrs) {
  const allowed = TAG_ATTRS[tag]
  const out = []
  for (const { name, value } of attrs || []) {
    const n = name.toLowerCase()
    if (n.startsWith('on') || n.startsWith('xmlns') || n === 'style') continue
    if (!GLOBAL_ATTRS.has(n) && !(allowed && allowed.has(n))) continue
    if (URL_ATTRS.has(n)) {
      const u = safeUrl(value)
      if (!u) continue
      out.push({ name: n, value: u })
      continue
    }
    if (n === 'target' && value !== '_blank') continue
    out.push({ name: n, value: String(value) })
  }
  // a new-tab link never gets a handle on this window
  if (tag === 'a' && out.some((a) => a.name === 'target')) {
    const rel = out.find((a) => a.name === 'rel')
    if (rel) rel.value = 'noopener noreferrer'
    else out.push({ name: 'rel', value: 'noopener noreferrer' })
  }
  return out
}

function cleanChildren(parent) {
  const kept = []
  for (const node of parent.childNodes || []) {
    if (node.nodeName === '#text') { kept.push(node); continue }
    if (node.nodeName === '#comment' || node.nodeName === '#documentType') continue
    const tag = (node.tagName || '').toLowerCase()
    if (!tag || DROP.has(tag)) continue
    if (!ALLOWED.has(tag)) {
      // unwrap: keep the text and any allowed descendants, lose the tag
      cleanChildren(node)
      for (const child of node.childNodes) { child.parentNode = parent; kept.push(child) }
      continue
    }
    node.attrs = cleanAttrs(tag, node.attrs)
    cleanChildren(node)
    kept.push(node)
  }
  parent.childNodes = kept
}

/** Sanitize an HTML fragment. Returns '' for empty input. */
export function sanitizeHtml(html) {
  const src = String(html || '')
  if (!src.trim()) return ''
  const fragment = parseFragment(src)
  cleanChildren(fragment)
  return serialize(fragment)
}

/*
 * Allowlist parser for admin-authored <head> HTML (seo_pages.custom_head),
 * used to server-render it so crawlers that don't execute JS still see it —
 * see components/seo/CustomHeadHtml.js. <script> tags are excluded on
 * purpose: they're already rendered client-side via next/script in
 * components/seo/CustomScripts.js, which is unrelated and untouched here.
 *
 * Only real elements can be legal children of a raw <head>, so this returns
 * structured {tag, attrs, inner} descriptors — never a wrapper element for
 * dangerouslySetInnerHTML — so the caller can render each one as an actual
 * sibling element directly under <head>.
 */
const HEAD_ALLOWED = new Set(['meta', 'link', 'style', 'base', 'noscript'])
const HEAD_TAG_ATTRS = {
  meta: new Set(['name', 'content', 'property', 'charset', 'http-equiv']),
  link: new Set(['rel', 'href', 'type', 'sizes', 'as', 'crossorigin', 'media']),
  base: new Set(['href', 'target']),
  style: new Set(['media']),
  noscript: new Set(),
}
const HEAD_HAS_CHILDREN = new Set(['style', 'noscript'])

function innerHtml(node) {
  return serialize({ nodeName: '#document-fragment', childNodes: node.childNodes || [] })
}

/** Parse admin `custom_head` HTML into sanitized {tag, attrs, inner} descriptors. */
export function parseHeadFragment(html) {
  const src = String(html || '')
  if (!src.trim()) return []
  const fragment = parseFragment(src)
  const out = []
  for (const node of fragment.childNodes || []) {
    const tag = (node.tagName || '').toLowerCase()
    if (!tag || !HEAD_ALLOWED.has(tag)) continue
    const allowed = HEAD_TAG_ATTRS[tag]
    const attrs = {}
    for (const { name, value } of node.attrs || []) {
      const n = name.toLowerCase()
      if (n.startsWith('on') || !allowed.has(n)) continue
      if (n === 'href') {
        const u = safeUrl(value)
        if (!u) continue
        attrs[n] = u
        continue
      }
      attrs[n] = value
    }
    out.push({
      tag,
      attrs,
      inner: HEAD_HAS_CHILDREN.has(tag) ? innerHtml(node) : null,
    })
  }
  return out
}
