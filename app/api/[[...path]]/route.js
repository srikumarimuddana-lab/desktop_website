import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

// Helper function to handle CORS
function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

// In-memory storage for demo mode
let demoFaqs = [
  {
    id: '1',
    question: 'What is Spinr?',
    answer: "Spinr is Saskatchewan's own rideshare platform. We offer 0% commission for drivers and a flat $1 fee for riders - making ridesharing fair for everyone.",
    category: 'general',
    tags: ['about', 'getting-started'],
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    question: 'Where is Spinr available?',
    answer: 'Spinr is currently available in Regina and Saskatoon, Saskatchewan. We plan to expand to more communities soon.',
    category: 'general',
    tags: ['locations', 'availability'],
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    question: 'How much does a ride cost?',
    answer: "You pay the driver's rate plus a flat $1 platform fee. There's no surge pricing - the price you see is the price you pay.",
    category: 'rider',
    tags: ['pricing', 'costs'],
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    question: 'How does 0% commission work?',
    answer: 'When a rider pays for a trip, you keep 100% of net fare. We make money through the flat $1 fee charged to riders, not by taking from your earnings.',
    category: 'driver',
    tags: ['earnings', 'commission'],
    created_at: new Date().toISOString()
  },
]

let demoLegalDocs = {
  'terms': {
    slug: 'terms',
    title: 'Terms of Service',
    content_html: `<h2>1. Introduction</h2>
<p>Welcome to Spinr. These Terms of Service govern your use of the Spinr platform.</p>
<h2>2. Service Description</h2>
<p>Spinr is a rideshare platform connecting riders with independent drivers in Saskatchewan.</p>
<h2>3. Pricing</h2>
<p>Riders pay the driver's fare plus a flat $1 platform fee. Drivers keep 100% of net fare.</p>`,
    last_updated: new Date().toISOString()
  },
  'privacy': {
    slug: 'privacy',
    title: 'Privacy Policy',
    content_html: `<h2>1. Information We Collect</h2>
<p>We collect information you provide including account information, payment details, and location data.</p>
<h2>2. How We Use Information</h2>
<p>We use your information to facilitate rides, process payments, and improve our services.</p>`,
    last_updated: new Date().toISOString()
  },
  'driver-agreement': {
    slug: 'driver-agreement',
    title: 'Driver Agreement',
    content_html: `<h2>1. Independent Contractor Status</h2>
<p>Drivers are independent contractors, not employees of Spinr.</p>
<h2>2. Commission Structure</h2>
<p>Spinr charges 0% commission. You keep 100% of net fare.</p>`,
    last_updated: new Date().toISOString()
  }
}

// Route handler function
async function handleRoute(request, { params }) {
  const { path = [] } = params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    // Root endpoint
    if ((route === '/' || route === '/root') && method === 'GET') {
      return handleCORS(NextResponse.json({ message: 'Spinr API v1.0', status: 'healthy' }))
    }

    // Admin Seed SEO Pages - POST /api/admin/seed-seo
    if (route === '/admin/seed-seo' && method === 'POST') {
      if (!isSupabaseConfigured()) {
        return handleCORS(NextResponse.json({ error: 'Supabase not configured' }, { status: 503 }))
      }

      // Core SEO data for all main pages
      const corePages = [
        {
          path: '/',
          title: "Spinr - 0% Commission Rideshare in Saskatchewan",
          description: "Saskatchewan's own rideshare platform. Drivers keep 100% of net fare, riders pay just $1. No surge pricing. Now serving Regina & Saskatoon.",
          keywords: "rideshare Saskatchewan, 0% commission, Regina rideshare, Saskatoon rideshare, Spinr, taxi alternative",
          og_image: null,
          canonical: "https://spinr.ca/",
          sitemap_priority: 1.0,
          sitemap_frequency: 'daily',
          structured_data: {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Spinr",
            "url": "https://spinr.ca",
            "logo": "https://spinr.ca/logo.webp",
            "description": "Saskatchewan's own rideshare platform with 0% commission for drivers",
            "areaServed": ["Regina", "Saskatoon", "Saskatchewan"],
            "sameAs": []
          },
          no_index: false
        },
        {
          path: '/ride',
          title: "Ride with Spinr - Affordable Local Rides",
          description: "Get rides in Regina and Saskatoon for just $1 platform fee. No surge pricing, verified local drivers, fair transparent pricing.",
          keywords: "ride Spinr, cheap rides Saskatchewan, Regina taxi, Saskatoon rides, no surge pricing",
          og_image: null,
          canonical: "https://spinr.ca/ride",
          sitemap_priority: 0.9,
          sitemap_frequency: 'weekly',
          structured_data: {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Spinr Rider Service",
            "provider": {
              "@type": "Organization",
              "name": "Spinr"
            },
            "description": "Affordable rideshare service with flat $1 platform fee",
            "areaServed": ["Regina", "Saskatoon"]
          },
          no_index: false
        },
        {
          path: '/drive',
          title: "Drive for Spinr - Keep 100% of Net Fare",
          description: "Become a Spinr driver in Saskatchewan. 0% commission forever, daily payouts, first 6 months free. Keep every dollar you earn.",
          keywords: "drive Spinr, rideshare driver Saskatchewan, 0% commission driver, Regina driver jobs, Saskatoon driver",
          og_image: null,
          canonical: "https://spinr.ca/drive",
          sitemap_priority: 0.9,
          sitemap_frequency: 'weekly',
          structured_data: {
            "@context": "https://schema.org",
            "@type": "JobPosting",
            "title": "Rideshare Driver - Spinr",
            "description": "Drive with Spinr and keep 100% of net fare. 0% commission, daily payouts.",
            "hiringOrganization": {
              "@type": "Organization",
              "name": "Spinr"
            },
            "jobLocation": {
              "@type": "Place",
              "address": {
                "@type": "PostalAddress",
                "addressRegion": "Saskatchewan",
                "addressCountry": "CA"
              }
            },
            "employmentType": "CONTRACTOR"
          },
          no_index: false
        },
        {
          path: '/about',
          title: "About Spinr - Saskatchewan's Rideshare",
          description: "Learn about Spinr's mission to bring fair, transparent ridesharing to Saskatchewan. Local team, local values, community-driven.",
          keywords: "about Spinr, Saskatchewan rideshare company, local rideshare, fair rideshare",
          og_image: null,
          canonical: "https://spinr.ca/about",
          sitemap_priority: 0.7,
          sitemap_frequency: 'monthly',
          structured_data: {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "mainEntity": {
              "@type": "Organization",
              "name": "Spinr",
              "foundingLocation": "Saskatchewan, Canada",
              "description": "Saskatchewan's own rideshare platform"
            }
          },
          no_index: false
        },
        {
          path: '/support',
          title: "Spinr Support & FAQs",
          description: "Get help with Spinr. Find answers to common questions about riding and driving. Local Saskatchewan support team.",
          keywords: "Spinr help, Spinr support, rideshare FAQ, contact Spinr",
          og_image: null,
          canonical: "https://spinr.ca/support",
          sitemap_priority: 0.8,
          sitemap_frequency: 'weekly',
          structured_data: {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": []
          },
          no_index: false
        }
      ]

      try {
        // Use upsert to insert or update based on path (primary key)
        const { data, error } = await supabase
          .from('seo_pages')
          .upsert(corePages, {
            onConflict: 'path',
            ignoreDuplicates: false
          })
          .select()

        if (error) {
          console.error('Seed SEO error:', error)
          return handleCORS(NextResponse.json({
            error: error.message,
            details: 'Failed to seed SEO pages'
          }, { status: 500 }))
        }

        return handleCORS(NextResponse.json({
          success: true,
          message: `Successfully seeded ${corePages.length} SEO pages`,
          pages: corePages.map(p => ({ path: p.path, title: p.title }))
        }))
      } catch (err) {
        console.error('Seed SEO exception:', err)
        return handleCORS(NextResponse.json({
          error: 'Internal server error during seeding'
        }, { status: 500 }))
      }
    }

    // Admin Stats - GET /api/admin/stats
    if (route === '/admin/stats' && method === 'GET') {
      if (isSupabaseConfigured()) {
        const { count: faqCount } = await supabase
          .from('faqs')
          .select('*', { count: 'exact', head: true })

        const { count: legalCount } = await supabase
          .from('legal_docs')
          .select('*', { count: 'exact', head: true })

        const { count: seoCount } = await supabase
          .from('seo_pages')
          .select('*', { count: 'exact', head: true })

        return handleCORS(NextResponse.json({
          totalFaqs: faqCount || 0,
          totalPolicies: legalCount || 0,
          totalSeoPages: seoCount || 0
        }))
      }
      return handleCORS(NextResponse.json({
        totalFaqs: demoFaqs.length,
        totalPolicies: 3,
        totalSeoPages: 0
      }))
    }

    // FAQs - GET /api/faqs
    if (route === '/faqs' && method === 'GET') {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('faqs')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Supabase error:', error)
          return handleCORS(NextResponse.json(demoFaqs))
        }
        return handleCORS(NextResponse.json(data || []))
      }
      return handleCORS(NextResponse.json(demoFaqs))
    }

    // FAQs - POST /api/faqs
    if (route === '/faqs' && method === 'POST') {
      const body = await request.json()
      const newFaq = {
        id: uuidv4(),
        question: body.question,
        answer: body.answer,
        category: body.category || 'general',
        tags: body.tags || [],
        created_at: new Date().toISOString()
      }

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('faqs')
          .insert([newFaq])
          .select()
          .single()

        if (error) {
          console.error('Supabase error:', error)
          return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
        }
        return handleCORS(NextResponse.json(data))
      }

      demoFaqs.unshift(newFaq)
      return handleCORS(NextResponse.json(newFaq))
    }

    // FAQs - PUT /api/faqs/:id
    if (route.startsWith('/faqs/') && method === 'PUT') {
      const id = path[1]
      const body = await request.json()

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('faqs')
          .update({
            question: body.question,
            answer: body.answer,
            category: body.category,
            tags: body.tags
          })
          .eq('id', id)
          .select()
          .single()

        if (error) {
          console.error('Supabase error:', error)
          return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
        }
        return handleCORS(NextResponse.json(data))
      }

      const index = demoFaqs.findIndex(f => f.id === id)
      if (index !== -1) {
        demoFaqs[index] = { ...demoFaqs[index], ...body }
        return handleCORS(NextResponse.json(demoFaqs[index]))
      }
      return handleCORS(NextResponse.json({ error: 'FAQ not found' }, { status: 404 }))
    }

    // FAQs - DELETE /api/faqs/:id
    if (route.startsWith('/faqs/') && method === 'DELETE') {
      const id = path[1]

      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from('faqs')
          .delete()
          .eq('id', id)

        if (error) {
          console.error('Supabase error:', error)
          return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
        }
        return handleCORS(NextResponse.json({ success: true }))
      }

      demoFaqs = demoFaqs.filter(f => f.id !== id)
      return handleCORS(NextResponse.json({ success: true }))
    }

    // Legal Docs - GET /api/legal/:slug
    if (route.startsWith('/legal/') && method === 'GET') {
      const slug = path[1]

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('legal_docs')
          .select('*')
          .eq('slug', slug)
          .single()

        if (error || !data) {
          // Return demo content if not found in DB
          if (demoLegalDocs[slug]) {
            return handleCORS(NextResponse.json(demoLegalDocs[slug]))
          }
          return handleCORS(NextResponse.json({ error: 'Document not found' }, { status: 404 }))
        }
        return handleCORS(NextResponse.json(data))
      }

      if (demoLegalDocs[slug]) {
        return handleCORS(NextResponse.json(demoLegalDocs[slug]))
      }
      return handleCORS(NextResponse.json({ error: 'Document not found' }, { status: 404 }))
    }

    // Legal Docs - PUT /api/legal/:slug
    if (route.startsWith('/legal/') && method === 'PUT') {
      const slug = path[1]
      const body = await request.json()

      if (isSupabaseConfigured()) {
        // Try to update existing, or insert new
        const { data: existing } = await supabase
          .from('legal_docs')
          .select('slug')
          .eq('slug', slug)
          .single()

        const docData = {
          slug,
          title: body.title,
          content_html: body.content_html,
          last_updated: new Date().toISOString()
        }

        let result
        if (existing) {
          result = await supabase
            .from('legal_docs')
            .update(docData)
            .eq('slug', slug)
            .select()
            .single()
        } else {
          result = await supabase
            .from('legal_docs')
            .insert([docData])
            .select()
            .single()
        }

        if (result.error) {
          console.error('Supabase error:', result.error)
          return handleCORS(NextResponse.json({ error: result.error.message }, { status: 500 }))
        }
        return handleCORS(NextResponse.json(result.data))
      }

      demoLegalDocs[slug] = {
        slug,
        title: body.title,
        content_html: body.content_html,
        last_updated: new Date().toISOString()
      }
      return handleCORS(NextResponse.json(demoLegalDocs[slug]))
    }

    // SEO Pages - GET ALL /api/seo-pages
    if (route === '/seo-pages' && method === 'GET') {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('seo_pages')
          .select('*')
          .order('sitemap_priority', { ascending: false })

        if (error) {
          console.error('Supabase error:', error)
          return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
        }
        return handleCORS(NextResponse.json(data || []))
      }
      return handleCORS(NextResponse.json([]))
    }

    // SEO Pages - GET SINGLE /api/seo-pages/:path
    if (route.startsWith('/seo-pages/') && method === 'GET') {
      const pathParam = path.slice(1).join('/')
      const decodedPath = decodeURIComponent(pathParam)

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('seo_pages')
          .select('*')
          .eq('path', decodedPath)
          .single()

        if (error || !data) {
          return handleCORS(NextResponse.json({ error: 'SEO page not found' }, { status: 404 }))
        }
        return handleCORS(NextResponse.json(data))
      }
      return handleCORS(NextResponse.json({ error: 'Supabase not configured' }, { status: 503 }))
    }

    // SEO Pages - CREATE /api/seo-pages
    if (route === '/seo-pages' && method === 'POST') {
      const body = await request.json()
      const newSeoPage = {
        path: body.path,
        title: body.title,
        description: body.description || null,
        keywords: body.keywords || null,
        og_image: body.og_image || null,
        canonical: body.canonical || null,
        sitemap_priority: body.sitemap_priority || 0.5,
        sitemap_frequency: body.sitemap_frequency || 'weekly',
        structured_data: body.structured_data || null,
        no_index: body.no_index || false
      }

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('seo_pages')
          .insert([newSeoPage])
          .select()
          .single()

        if (error) {
          console.error('Supabase error:', error)
          return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
        }
        return handleCORS(NextResponse.json(data))
      }
      return handleCORS(NextResponse.json({ error: 'Supabase not configured' }, { status: 503 }))
    }

    // SEO Pages - UPDATE /api/seo-pages/:path
    if (route.startsWith('/seo-pages/') && method === 'PUT') {
      const pathParam = path.slice(1).join('/')
      const decodedPath = decodeURIComponent(pathParam)
      const body = await request.json()

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('seo_pages')
          .update({
            title: body.title,
            description: body.description,
            keywords: body.keywords,
            og_image: body.og_image,
            canonical: body.canonical,
            sitemap_priority: body.sitemap_priority,
            sitemap_frequency: body.sitemap_frequency,
            structured_data: body.structured_data,
            no_index: body.no_index,
            updated_at: new Date().toISOString()
          })
          .eq('path', decodedPath)
          .select()
          .single()

        if (error) {
          console.error('Supabase error:', error)
          return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
        }
        return handleCORS(NextResponse.json(data))
      }
      return handleCORS(NextResponse.json({ error: 'Supabase not configured' }, { status: 503 }))
    }

    // SEO Pages - DELETE /api/seo-pages/:path
    if (route.startsWith('/seo-pages/') && method === 'DELETE') {
      const pathParam = path.slice(1).join('/')
      const decodedPath = decodeURIComponent(pathParam)

      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from('seo_pages')
          .delete()
          .eq('path', decodedPath)

        if (error) {
          console.error('Supabase error:', error)
          return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
        }
        return handleCORS(NextResponse.json({ success: true }))
      }
      return handleCORS(NextResponse.json({ error: 'Supabase not configured' }, { status: 503 }))
    }

    // Route not found
    return handleCORS(NextResponse.json(
      { error: `Route ${route} not found` },
      { status: 404 }
    ))

  } catch (error) {
    console.error('API Error:', error)
    return handleCORS(NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    ))
  }
}

// Export all HTTP methods
export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute
