'use client'

/**
 * JsonLdInjector Component
 * 
 * Injects JSON-LD structured data into the page for SEO.
 * Supports Google Rich Results (FAQPage, LocalBusiness, etc.)
 * 
 * Usage:
 * <JsonLdInjector data={structuredData} />
 */
export default function JsonLdInjector({ data }) {
  // Don't render if no data provided
  if (!data) return null

  // Validate that data is valid JSON
  let jsonLdData
  try {
    // If data is a string, try to parse it
    if (typeof data === 'string') {
      jsonLdData = JSON.parse(data)
    } else if (typeof data === 'object') {
      jsonLdData = data
    } else {
      console.error('JsonLdInjector: Invalid data type')
      return null
    }
  } catch (error) {
    console.error('JsonLdInjector: Failed to parse JSON-LD data', error)
    return null
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLdData)
      }}
    />
  )
}
