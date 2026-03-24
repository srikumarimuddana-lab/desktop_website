import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://spinr.ca'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/private/', '/spinr-internal/', '/api/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
