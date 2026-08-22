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

/**
 * SEO for a preview page: whatever the admin dashboard has for this path,
 * with noindex forced back on. The design sample must never be indexed, so
 * that is not left to a CMS row someone could edit.
 */
export async function previewMetadata(path, defaults) {
  const seo = await getSeoMetadata(path, defaults)
  return { ...seo, robots: { index: false, follow: false } }
}
