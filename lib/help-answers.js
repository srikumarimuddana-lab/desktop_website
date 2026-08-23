import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { HELP_CATEGORIES, ARTICLE_CONTENT } from '@/constants/helpTopics'
import { faqSlug } from '@/lib/help-slug'
import { ALL_FAQS } from '@/lib/faq-fallback'

/**
 * One lookup behind every help answer on the site.
 *
 * Help content arrives from three places and used to be rendered three
 * different ways: articles written in the admin dashboard, articles hardcoded
 * in constants/helpTopics.js, and FAQ rows. A reader does not care which is
 * which — they want a URL that shows the answer — so a single slug namespace
 * covers all three and /help/[slug] renders whatever comes back.
 *
 * Precedence is CMS first: if someone writes an article in the dashboard with
 * the same slug as a hardcoded one, the CMS wins, because that is the copy an
 * editor can actually correct. FAQs are last so an article always beats a
 * one-paragraph FAQ on the same subject.
 */


function staticArticle(slug) {
  for (const cat of HELP_CATEGORIES) {
    const a = cat.articles.find((x) => x.slug === slug)
    if (!a) continue
    const body = ARTICLE_CONTENT[a.id] || ARTICLE_CONTENT[slug]
    /* Most listed topics have no body yet. The old /help/article route served
       them a "coming soon" placeholder; keep the link working rather than
       404ing it, but flag it so the page says so plainly and does not ask to
       be indexed — 39 near-identical thin pages would be worse than none. */
    if (!body) {
      return { kind: 'article', placeholder: true, slug, title: a.title, html: '',
               categoryId: cat.id, categoryTitle: cat.title }
    }
    return {
      kind: 'article',
      slug,
      title: body.title || a.title,
      html: body.content,
      categoryId: cat.id,
      categoryTitle: cat.title,
    }
  }
  return null
}

async function cmsArticle(slug) {
  if (!isSupabaseConfigured()) return null
  try {
    const { data, error } = await supabase
      .from('help_articles')
      .select('id, title, slug, category, content')
      .eq('slug', slug)
      .limit(1)
    if (error) {
      console.error('[help] article fetch failed:', error.message)
      return null
    }
    const row = data?.[0]
    if (!row) return null
    const cat = HELP_CATEGORIES.find((c) => c.id === row.category || c.slug === row.category)
    return {
      kind: 'article',
      slug: row.slug,
      title: row.title,
      html: row.content,
      categoryId: cat?.id || row.category || null,
      categoryTitle: cat?.title || null,
    }
  } catch (e) {
    console.error('[help] article fetch threw:', e.message)
    return null
  }
}

async function cmsFaq(slug) {
  if (!isSupabaseConfigured()) return null
  try {
    const { data, error } = await supabase.from('faqs').select('id, question, answer, category')
    if (error) {
      console.error('[help] FAQ fetch failed:', error.message)
      return null
    }
    const row = (data || []).find((r) => faqSlug(r.question) === slug)
    if (!row) return null
    const cat = HELP_CATEGORIES.find((c) => c.id === row.category || c.slug === row.category)
    return {
      kind: 'faq',
      slug,
      title: row.question,
      html: row.answer,
      categoryId: cat?.id || null,
      categoryTitle: cat?.title || null,
    }
  } catch (e) {
    console.error('[help] FAQ fetch threw:', e.message)
    return null
  }
}

/** The fallback FAQs the pages render when Supabase is unreachable. Without
 *  this the accordion would show an answer whose own page 404s. */
function fallbackFaq(slug) {
  const hit = ALL_FAQS.find(([q]) => faqSlug(q) === slug)
  if (!hit) return null
  return { kind: 'faq', slug, title: hit[0], html: `<p>${hit[1]}</p>`, categoryId: null, categoryTitle: null }
}

/** The answer at this slug, or null. Callers render a 404 on null. */
export async function getHelpAnswer(slug) {
  if (!slug) return null
  return (
    (await cmsArticle(slug)) ||
    staticArticle(slug) ||
    (await cmsFaq(slug)) ||
    fallbackFaq(slug)
  )
}

/**
 * Every slug the help section can serve, for the sitemap and for
 * generateStaticParams. CMS rows are included when Supabase is reachable;
 * the hardcoded articles always are.
 */
export async function getHelpSlugs() {
  const out = new Map()

  for (const cat of HELP_CATEGORIES) {
    for (const a of cat.articles) {
      if (!(ARTICLE_CONTENT[a.id] || ARTICLE_CONTENT[a.slug])) continue
      out.set(a.slug, { slug: a.slug, title: a.title, kind: 'article', categoryId: cat.id })

    }
  }

  if (!isSupabaseConfigured()) {
    for (const [q] of ALL_FAQS) {
      const s = faqSlug(q)
      if (s && !out.has(s)) out.set(s, { slug: s, title: q, kind: 'faq', categoryId: null })
    }
    return [...out.values()]
  }

  try {
    const [{ data: arts }, { data: faqs }] = await Promise.all([
      supabase.from('help_articles').select('title, slug, category, updated_at'),
      supabase.from('faqs').select('question, category'),
    ])
    for (const a of arts || []) {
      if (!a.slug) continue
      out.set(a.slug, { slug: a.slug, title: a.title, kind: 'article', categoryId: a.category, updatedAt: a.updated_at })
    }
    for (const f of faqs || []) {
      const s = faqSlug(f.question)
      if (!s || out.has(s)) continue
      out.set(s, { slug: s, title: f.question, kind: 'faq', categoryId: f.category })
    }
  } catch (e) {
    console.error('[help] slug listing threw:', e.message)
  }
  return [...out.values()]
}

/** Other answers in the same category, for the "keep reading" rail. */
export async function getRelatedAnswers(slug, categoryId, limit = 4) {
  const all = await getHelpSlugs()
  const sameCat = all.filter((a) => a.slug !== slug && categoryId && a.categoryId === categoryId)
  const rest = all.filter((a) => a.slug !== slug && !sameCat.includes(a))
  return [...sameCat, ...rest].slice(0, limit)
}

export { faqSlug }
