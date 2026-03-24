import { supabase, isSupabaseConfigured } from '@/lib/supabase'

/**
 * Fetch SEO metadata from the seo_pages table for a given path
 * Falls back to provided defaults if no data is found
 * 
 * @param {string} path - The page path (e.g., '/', '/drive', '/about')
 * @param {object} defaults - Default metadata to use if database fetch fails
 * @returns {Promise<object>} - Metadata object for Next.js generateMetadata
 */
export async function getSeoMetadata(path, defaults = {}) {
  const baseUrl = 'https://spinr.ca'
  
  // If Supabase not configured, return defaults
  if (!isSupabaseConfigured()) {
    return {
      title: defaults.title || 'Spinr',
      description: defaults.description || "Saskatchewan's own rideshare platform",
      keywords: defaults.keywords || 'rideshare, Saskatchewan, taxi, ride',
      openGraph: {
        title: defaults.title || 'Spinr',
        description: defaults.description || "Saskatchewan's own rideshare platform",
        images: defaults.ogImage ? [defaults.ogImage] : [],
        url: `${baseUrl}${path}`,
        siteName: 'Spinr',
        type: 'website',
      },
      alternates: {
        canonical: defaults.canonical || `${baseUrl}${path}`
      }
    }
  }

  try {
    const { data: seoData, error } = await supabase
      .from('seo_pages')
      .select('title, description, keywords, og_image, canonical')
      .eq('path', path)
      .single()
    
    if (error || !seoData) {
      // Return defaults if no data found
      return {
        title: defaults.title || 'Spinr',
        description: defaults.description || "Saskatchewan's own rideshare platform",
        keywords: defaults.keywords || 'rideshare, Saskatchewan, taxi, ride',
        openGraph: {
          title: defaults.title || 'Spinr',
          description: defaults.description || "Saskatchewan's own rideshare platform",
          images: defaults.ogImage ? [defaults.ogImage] : [],
          url: `${baseUrl}${path}`,
          siteName: 'Spinr',
          type: 'website',
        },
        alternates: {
          canonical: defaults.canonical || `${baseUrl}${path}`
        }
      }
    }

    // Return database-driven metadata
    return {
      title: seoData.title,
      description: seoData.description,
      keywords: seoData.keywords,
      openGraph: {
        title: seoData.title,
        description: seoData.description,
        images: seoData.og_image ? [seoData.og_image] : [],
        url: `${baseUrl}${path}`,
        siteName: 'Spinr',
        type: 'website',
      },
      alternates: {
        canonical: seoData.canonical || `${baseUrl}${path}`
      }
    }

  } catch (error) {
    console.error('Failed to fetch SEO metadata for path:', path, error)
    
    // Return defaults on error
    return {
      title: defaults.title || 'Spinr',
      description: defaults.description || "Saskatchewan's own rideshare platform",
      keywords: defaults.keywords || 'rideshare, Saskatchewan, taxi, ride',
      openGraph: {
        title: defaults.title || 'Spinr',
        description: defaults.description || "Saskatchewan's own rideshare platform",
        images: defaults.ogImage ? [defaults.ogImage] : [],
        url: `${baseUrl}${path}`,
        siteName: 'Spinr',
        type: 'website',
      },
      alternates: {
        canonical: defaults.canonical || `${baseUrl}${path}`
      }
    }
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
