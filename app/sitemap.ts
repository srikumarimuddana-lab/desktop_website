import type { MetadataRoute } from 'next'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { getHelpSlugs } from '@/lib/help-answers'
export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

interface SeoPage {
  path: string
  sitemap_priority: number | null
  sitemap_frequency: string | null
  updated_at: string | null
}

/**
 * Every help answer served by /help/[slug]. These are real destinations with
 * their own titles and copy, so they belong in the sitemap — leaving them out
 * meant the entire help centre was one URL as far as search was concerned.
 *
 * Topics with no article behind them are excluded by getHelpSlugs(), because
 * those pages are noindex: listing a page in the sitemap and then telling the
 * crawler not to index it is a contradiction Search Console reports.
 */
async function helpAnswerEntries(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  try {
    const slugs = await getHelpSlugs()
    return slugs.map((s: { slug: string; updatedAt?: string }) => ({
      url: `${baseUrl}/help/${s.slug}`,
      lastModified: s.updatedAt ? new Date(s.updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch (error) {
    console.error('Sitemap help-answer generation error:', error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://spinr.ca'
  const helpAnswers = await helpAnswerEntries(baseUrl)

  // Default pages if Supabase not configured or no data exists
  const defaultPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/drive`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ride`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // If Supabase not configured, return default pages
  if (!isSupabaseConfigured()) {
    return [...defaultPages, ...helpAnswers]
  }

  try {
    // Fetch all SEO pages from database (excluding no_index pages)
    const { data: seoPages, error } = await (supabase as any)
      .from('seo_pages')
      .select('path, sitemap_priority, sitemap_frequency, updated_at')
      .eq('no_index', false)
      .order('sitemap_priority', { ascending: false })

    if (error) {
      console.error('Sitemap generation error:', error)
      return [...defaultPages, ...helpAnswers]
    }

    // If no data, return defaults
    if (!seoPages || seoPages.length === 0) {
      return [...defaultPages, ...helpAnswers]
    }

    // Map database entries to sitemap format
    return [
      ...(seoPages as SeoPage[]).map((page) => ({
        url: `${baseUrl}${page.path}`,
        lastModified: page.updated_at ? new Date(page.updated_at) : new Date(),
        changeFrequency: (page.sitemap_frequency as ChangeFrequency) || 'weekly',
        priority: page.sitemap_priority || 0.5,
      })),
      ...helpAnswers,
    ]

  } catch (error) {
    console.error('Sitemap generation error:', error)
    return [...defaultPages, ...helpAnswers]
  }
}
