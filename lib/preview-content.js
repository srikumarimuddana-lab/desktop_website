import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { getSeoMetadata } from '@/lib/seo'

/**
 * CMS readers for the /preview pages.
 *
 * The rule these exist to enforce: anything editable in /spinr-internal must
 * be READ from the database at request time, never hardcoded into a page.
 * A FAQ added in the admin dashboard has to appear on the site without a
 * deploy — that is the whole point of the CMS, and it is also what keeps the
 * AI assistant honest, since lib/kb-sync.js pushes the same row into
 * knowledge_base for retrieval. Hardcoded copy silently breaks both.
 *
 * Every reader takes a `fallback` used when Supabase is unconfigured (local
 * dev, preview builds) or the table is empty, so the pages still render.
 */

/**
 * FAQs as [question, answer] pairs, optionally narrowed to categories.
 * @param {{categories?: string[], limit?: number, fallback?: Array<[string,string]>}} opts
 */
export async function getFaqs({ categories = [], limit = 8, fallback = [] } = {}) {
  if (!isSupabaseConfigured()) return fallback
  try {
    let q = supabase
      .from('faqs')
      .select('id, question, answer, category')
      .order('created_at', { ascending: true })
      .limit(limit)
    if (categories.length) q = q.in('category', categories)

    const { data, error } = await q
    if (error) {
      console.error('[preview] FAQ fetch failed:', error.message)
      return fallback
    }
    if (!data || data.length === 0) return fallback
    return data.map((r) => [r.question, r.answer])
  } catch (e) {
    console.error('[preview] FAQ fetch threw:', e.message)
    return fallback
  }
}

/** Help articles managed in the admin dashboard. */
export async function getHelpArticles() {
  if (!isSupabaseConfigured()) return []
  try {
    const { data, error } = await supabase
      .from('help_articles')
      .select('id, title, slug, category, content')
      .order('order_index', { ascending: true })
    if (error) {
      console.error('[preview] help article fetch failed:', error.message)
      return []
    }
    return data || []
  } catch (e) {
    console.error('[preview] help article fetch threw:', e.message)
    return []
  }
}

export const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://spinr.ca'

/**
 * Whether the new design is the live site yet.
 *
 * While it is false every /preview page is noindex, because the old pages at
 * /, /ride, /drive, /about and /help still serve the same content — two URLs
 * for one page is worse for search than one unindexed draft. Flipping this to
 * true is one half of the cutover; the other half is retiring or redirecting
 * those old routes, and the two have to happen together.
 *
 * Set PREVIEW_IS_LIVE=true to flip it without a code change.
 */
export const PREVIEW_IS_LIVE = process.env.PREVIEW_IS_LIVE === 'true'

/**
 * SEO for a page in the new design: whatever the admin dashboard has for this
 * path, plus a canonical URL, plus the indexing decision above. Anything the
 * caller passes wins over the CMS row, so a page can set its own OG type or
 * canonical (the help answers do).
 */
export async function previewMetadata(path, defaults = {}) {
  const seo = await getSeoMetadata(path, defaults)
  return {
    ...seo,
    ...defaults,
    openGraph: { ...(seo.openGraph || {}), ...(defaults.openGraph || {}) },
    alternates: {
      ...(seo.alternates || {}),
      ...(defaults.alternates || {}),
      canonical: defaults.alternates?.canonical || seo.alternates?.canonical || `${SITE_URL}${path}`,
    },
    robots: PREVIEW_IS_LIVE
      ? { index: true, follow: true }
      : { index: false, follow: false },
  }
}
