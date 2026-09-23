import { supabase, isSupabaseConfigured } from '@/lib/supabase'

/**
 * Fetch SEO metadata from the seo_pages table for a given path
 * Falls back to provided defaults if no data is found
 * 
 * @param {string} path - The page path (e.g., '/', '/drive', '/about')
 * @param {object} defaults - Default metadata to use if database fetch fails
 * @returns {Promise<object>} - Metadata object for Next.js generateMetadata
 */
// Site-wide fallback share image — the same logo already used as the
// Organization JSON-LD `logo` (app/(site)/page.js). Used whenever neither a
// seo_pages row nor a page's own defaults supply an og_image, so every page
// gets a working link-preview card.
const DEFAULT_OG_IMAGE = 'https://spinr.ca/logo.png'

export async function getSeoMetadata(path, defaults = {}) {
  const baseUrl = 'https://spinr.ca'

  const build = (title, description, keywords, ogImage, canonical) => ({
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: [ogImage || DEFAULT_OG_IMAGE],
      url: `${baseUrl}${path}`,
      siteName: 'Spinr',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
    },
    alternates: {
      canonical: canonical || `${baseUrl}${path}`
    }
  })

  const defaultResult = () => build(
    defaults.title || 'Spinr',
    defaults.description || "Proudly Canadian rideshare platform",
    defaults.keywords || 'rideshare, Saskatchewan, taxi, ride',
    defaults.ogImage,
    defaults.canonical
  )

  // If Supabase not configured, return defaults
  if (!isSupabaseConfigured()) {
    return defaultResult()
  }

  try {
    const { data: seoData, error } = await supabase
      .from('seo_pages')
      .select('title, description, keywords, og_image, canonical')
      .eq('path', path)
      .single()

    if (error || !seoData) {
      // Return defaults if no data found
      return defaultResult()
    }

    // Return database-driven metadata
    return build(
      seoData.title,
      seoData.description,
      seoData.keywords,
      seoData.og_image || defaults.ogImage,
      seoData.canonical || defaults.canonical
    )

  } catch (error) {
    console.error('Failed to fetch SEO metadata for path:', path, error)

    // Return defaults on error
    return defaultResult()
  }
}

/**
 * Fetch structured data (JSON-LD) from the seo_pages table for a given path
 * 
 * @param {string} path - The page path
 * @returns {Promise<object|null>} - Structured data object or null
 */
export async function getStructuredData(path) {
  if (!isSupabaseConfigured()) {
    return null
  }

  try {
    const { data, error } = await supabase
      .from('seo_pages')
      .select('structured_data')
      .eq('path', path)
      .single()
    
    if (error || !data || !data.structured_data) {
      return null
    }

    return data.structured_data
  } catch (error) {
    console.error('Failed to fetch structured data for path:', path, error)
    return null
  }
}

/**
 * Fetch the admin-authored raw <head> HTML (seo_pages.custom_head) for a
 * path, for server-side rendering via components/seo/CustomHeadHtml.
 *
 * @param {string} path - The page path
 * @returns {Promise<string|null>}
 */
export async function getCustomHead(path) {
  if (!isSupabaseConfigured()) {
    return null
  }

  try {
    const { data, error } = await supabase
      .from('seo_pages')
      .select('custom_head')
      .eq('path', path)
      .single()

    if (error || !data || !data.custom_head) {
      return null
    }

    return data.custom_head
  } catch (error) {
    console.error('Failed to fetch custom head HTML for path:', path, error)
    return null
  }
}
