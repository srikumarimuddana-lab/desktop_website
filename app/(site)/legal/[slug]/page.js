import { notFound } from 'next/navigation'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { getSeoMetadata } from '@/lib/seo'
import { SITE_URL } from '@/lib/preview-content'
import LegalShell from '../LegalShell'
import { TERMS, PRIVACY } from '../content'

/*
 * Legal documents, in the site design, from the CMS.
 *
 * The previous /legal/[slug] route read legal_docs from Supabase so the admin
 * dashboard could edit terms and privacy without a deploy. The redesign had
 * them hardcoded, which would have quietly taken that away — and legal copy is
 * exactly the text that must be correctable in minutes, not at the next
 * release. So the route stays dynamic: CMS first, the drafts in ../content.js
 * only when there is no row to serve.
 *
 * A CMS document arrives as one HTML blob rather than the sectioned shape
 * LegalShell renders, so it is split on its own headings — that is what gives
 * the reading rail something to track.
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
  }
}

async function getLegalDoc(slug) {
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
