import { notFound } from 'next/navigation'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { getSeoMetadata } from '@/lib/seo'
import { SITE_URL } from '@/lib/preview-content'
import { fetchLegalDocument } from '@/lib/spinr-api'
import LegalShell from '../LegalShell'
import { TERMS, PRIVACY } from '../content'

/*
 * Legal documents, in the site design, from the backend and the CMS.
 *
 * The previous /legal/[slug] route read legal_docs from Supabase so the admin
 * dashboard could edit terms and privacy without a deploy. The redesign had
 * them hardcoded, which would have quietly taken that away — and legal copy is
 * exactly the text that must be correctable in minutes, not at the next
 * release. So the route stays dynamic.
 *
 * Source order is now: the Spinr backend, then this site's CMS, then the
 * drafts in ../content.js. The backend went first because its legal_documents
 * table is the version riders and drivers actually agree to in the app, and it
 * is audience-scoped and versioned; two sets of terms for one company is a
 * real problem, not a tidiness one.
 *
 * Both lower layers stay wired up deliberately. A legal page must render —
 * "the backend was slow" is not an acceptable reason to show a visitor nothing
 * where terms should be — so an unreachable backend, an unset SPINR_API_URL or
 * an unpublished document each fall through to what was being served before.
 *
 * Documents from either source arrive as one HTML blob rather than the
 * sectioned shape LegalShell renders, so they are split on their own headings
 * — that is what gives the reading rail something to track.
 */

export const revalidate = 0

const DRAFTS = {
  terms: { doc: TERMS, kicker: 'The agreement', other: { href: '/legal/privacy', label: 'Privacy policy' } },
  privacy: { doc: PRIVACY, kicker: 'Your information', other: { href: '/legal/terms', label: 'Terms of service' } },
}

const TITLES = { terms: 'Terms of Service', privacy: 'Privacy Policy' }

function slugify(text) {
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60)
}

/** One HTML blob -> the { docTitle, updated, intro, sections } LegalShell wants. */
function toDoc(row, slug) {
  const html = String(row.content || '')
  // split on h1..h3; whatever precedes the first heading is the intro
  const parts = html.split(/(?=<h[1-3][\s>])/i)
  const intro = []
  const sections = []
  for (const part of parts) {
    const m = part.match(/^<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>([\s\S]*)$/i)
    if (!m) {
      const t = part.trim()
      if (t) intro.push(t)
      continue
    }
    const title = m[1].replace(/<[^>]+>/g, '').trim()
    sections.push({ id: slugify(title) || `section-${sections.length + 1}`, title, html: m[2] })
  }
  return {
    docTitle: row.title || TITLES[slug] || slug,
    updated: row.updated_at
      ? `Last updated: ${new Date(row.updated_at).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}`
      : '',
    intro,
    sections,
    fromCms: true,
    published: true,
  }
}

/*
 * The backend serves legal text as PLAIN TEXT, not HTML — ALL-CAPS lines for
 * headings, blank-line-separated paragraphs that are hard-wrapped mid-sentence,
 * and "- " bullets (see backend/migrations/361_seed_new_legal_documents.sql,
 * and rider-app/app/legal.tsx, which renders it as plain text). Running it
 * through toDoc() above would find no <h1-3> to split on and hand the whole
 * document to SafeHtml as one blob: no section rail, and every hard wrap
 * collapsed into one run-on paragraph. So it gets its own converter.
 */

/** Lines -> paragraph blocks. Hard wraps inside a paragraph are rejoined; a
 *  blank line ends a block, and a bullet always starts its own. */
function textBlocks(text) {
  const out = []
  let buf = []
  const flush = () => {
    if (buf.length) out.push(buf.join(' '))
    buf = []
  }
  for (const raw of String(text).replace(/\r\n/g, '\n').split('\n')) {
    const line = raw.trim()
    if (!line) {
      flush()
      continue
    }
    const bullet = line.match(/^[-•*]\s+(.*)$/)
    if (bullet) {
      flush()
      buf.push(`• ${bullet[1]}`)
      continue
    }
    buf.push(line)
  }
  flush()
  return out
}

/** A section heading is a short line with capitals and no lowercase at all.
 *  Body paragraphs always contain lowercase, so this does not catch them. */
function isTextHeading(block) {
  return block.length <= 90 && /[A-Z]/.test(block) && !/[a-z]/.test(block)
}

const UPDATED_RE = /^last updated\s*:/i

/** Backend plain text -> the { docTitle, updated, intro, sections } LegalShell wants. */
function toPlainTextDoc({ content, updatedAt }, slug) {
  const blocks = textBlocks(content)
  const intro = []
  const sections = []
  let updated = ''

  blocks.forEach((block, i) => {
    // The document repeats its own title as the first line; the page already
    // has one from TITLES, so drop it rather than print it twice.
    if (i === 0 && isTextHeading(block)) return
    if (UPDATED_RE.test(block)) {
      // Prefer the date the document states over the row's updated_at: an
      // admin fixing a typo bumps the row without changing the legal date.
      updated = block
      return
    }
    if (isTextHeading(block)) {
      sections.push({ id: slugify(block) || `section-${sections.length + 1}`, title: block, paras: [] })
      return
    }
    if (sections.length) sections[sections.length - 1].paras.push(block)
    else intro.push(block)
  })

  if (!updated && updatedAt) {
    updated = `Last updated: ${new Date(updatedAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}`
  }

  // fromCms false: these paragraphs are plain text, so LegalShell must render
  // them as text, not pass them to SafeHtml. published true: an admin
  // published this in the Spinr dashboard, so it is not a pending-review draft.
  return { docTitle: TITLES[slug] || slug, updated, intro, sections, fromCms: false, published: true }
}

/** Website slug -> the backend's (audience, doc_type) pair. */
const BACKEND_DOC_TYPES = { terms: 'tos', privacy: 'privacy' }

async function getLegalDoc(slug) {
  const backendType = BACKEND_DOC_TYPES[slug]
  if (backendType) {
    // Rider audience: this is the public website, and the rider terms are the
    // ones a visitor here is agreeing to. Driver-specific documents live
    // behind the driver app, which fetches them with audience=driver.
    const doc = await fetchLegalDocument({ audience: 'rider', type: backendType })
    if (doc) return toPlainTextDoc(doc, slug)
  }

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('legal_docs')
        .select('title, content, updated_at')
        .eq('slug', slug)
        .limit(1)
      if (error) console.error('[legal] fetch failed:', error.message)
      const row = data?.[0]
      if (row?.content) return toDoc(row, slug)
    } catch (e) {
      console.error('[legal] fetch threw:', e.message)
    }
  }
  return DRAFTS[slug]?.doc || null
}

export async function generateStaticParams() {
  return Object.keys(DRAFTS).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const title = TITLES[slug]
  if (!title && !DRAFTS[slug]) return {}
  const seo = await getSeoMetadata(`/legal/${slug}`, {
    title: `${title || slug} | Spinr`,
    description: `Spinr's ${(title || slug).toLowerCase()} for riders and drivers in Saskatchewan.`,
  })
  return {
    ...seo,
    alternates: { ...(seo.alternates || {}), canonical: seo.alternates?.canonical || `${SITE_URL}/legal/${slug}` },
  }
}

export default async function LegalPage({ params }) {
  const { slug } = await params
  const doc = await getLegalDoc(slug)
  if (!doc) notFound()

  const frame = DRAFTS[slug] || {
    kicker: 'Legal',
    other: { href: '/legal/terms', label: 'Terms of service' },
  }

  return <LegalShell kicker={frame.kicker} doc={doc} other={frame.other} />
}
