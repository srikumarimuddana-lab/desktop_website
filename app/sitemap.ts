import type { MetadataRoute } from 'next'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

interface SeoPage {
  path: string
  sitemap_priority: number | null
  sitemap_frequency: string | null
  updated_at: string | null
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://spinr.ca'
  
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
    return defaultPages
  }

  try {
    // Fetch all SEO pages from database (excluding no_index pages)
    const { data: seoPages, error } = (supabase as any)
      .from('seo_pages')
      .select('path, sitemap_priority, sitemap_frequency, updated_at')
      .eq('no_index', false)
      .order('sitemap_priority', { ascending: false })

    if (error) {
      console.error('Sitemap generation error:', error)
      return defaultPages
    }

    // If no data, return defaults
    if (!seoPages || seoPages.length === 0) {
      return defaultPages
    }

    // Map database entries to sitemap format
    return (seoPages as SeoPage[]).map((page) => ({
      url: `${baseUrl}${page.path}`,
      lastModified: page.updated_at ? new Date(page.updated_at) : new Date(),
      changeFrequency: (page.sitemap_frequency as ChangeFrequency) || 'weekly',
      priority: page.sitemap_priority || 0.5,
    }))

  } catch (error) {
    console.error('Sitemap generation error:', error)
    return defaultPages
  }
}
