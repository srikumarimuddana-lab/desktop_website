import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'
import { supabase as anonymousSupabase, isSupabaseConfigured } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'
import { syncToKB, deleteFromKB } from '@/lib/kb-sync'
import { getPromotionBySlug, toDbRow, normalizePromotion, renderSmsTemplate } from '@/lib/promotions'
import { sendSms, isTwilioConfigured } from '@/lib/twilio'

// Coupon code helpers — confusion-free alphabet (no 0/O/1/I/L)
const COUPON_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
function generateCouponCode() {
  const bytes = crypto.randomBytes(9)
  let out = ''
  for (let i = 0; i < 9; i++) {
    out += COUPON_ALPHABET[bytes[i] % COUPON_ALPHABET.length]
    if (i === 2 || i === 5) out += '-'
  }
  return out // e.g. A2B-C3D-E4F
}
const COUPON_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

// Helper function to handle CORS with multiple origin support
function handleCORS(response, request) {
  const allowedOrigins = process.env.CORS_ORIGINS?.split(',').map(o => o.trim()) || ['*']
  const requestOrigin = request?.headers?.get('origin')

  // Check if request origin is in allowed list, or allow all if '*' is set
  let origin = '*'
  if (allowedOrigins.includes('*')) {
    origin = '*'
  } else if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    origin = requestOrigin
  } else if (allowedOrigins.length > 0) {
    origin = allowedOrigins[0] // Default to first allowed origin
  }

  response.headers.set('Access-Control-Allow-Origin', origin)
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}


// Helper to check authentication
// SUPER ADMIN EMAIL - must match the one in admin layout
const SUPER_ADMIN_EMAIL = 'admin@spinr.ca'

async function checkAuth(request) {
  // In production, Supabase MUST be configured
  if (!isSupabaseConfigured()) {
    // Only allow in development for testing with demo data
    const isDev = process.env.NODE_ENV === 'development'
    if (isDev) {
      console.warn('⚠️ Auth bypassed in dev mode - Supabase not configured')
      return true
    }
    // Block all writes in production without Supabase
    console.error('🚫 Supabase not configured - blocking write operation')
    return false
  }

  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      console.warn('Missing Authorization header')
      return false
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error } = await anonymousSupabase.auth.getUser(token)

    if (error || !user) {
      console.warn('Invalid token or user not found')
      return false
    }

    // Verify the user is the super admin
    if (user.email !== SUPER_ADMIN_EMAIL) {
      console.warn(`Unauthorized access attempt by: ${user.email}`)
      return false
    }

    return true
  } catch (err) {
    console.error('Auth check error:', err)
    return false
  }
}

// Helper to create authenticated Supabase client
const createAuthenticatedClient = (request) => {
  const authHeader = request.headers.get('authorization')
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (authHeader && supabaseUrl && supabaseAnonKey) {
    return createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })
  }
  return anonymousSupabase
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
    answer: "Spinr is proudly Canadian. We offer 0% commission for drivers and a flat $1 fee for riders - making ridesharing fair for everyone.",
    category: 'general',
    tags: ['about', 'getting-started'],
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    question: 'Where is Spinr available?',
    answer: 'Spinr is currently available in Saskatoon, Saskatchewan. We plan to expand to more communities soon.',
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



// In-memory promotion signups (demo fallback when Supabase is not configured)
let demoPromotionSignups = []

// In-memory coupon store (demo fallback)
let demoPromotionCoupons = []

// Help Categories
const HELP_CATEGORIES = [
  { id: 'riding', title: 'Riding with Spinr', slug: 'riding-with-spinr' },
  { id: 'driving', title: 'Driving with Spinr', slug: 'driving-with-spinr' },
  { id: 'applying', title: 'Applying to Drive', slug: 'applying-to-drive' },
  { id: 'account', title: 'Profile & Account', slug: 'profile-and-account' },
  { id: 'app', title: 'Using the App', slug: 'using-the-app' },
  { id: 'safety', title: 'Safety & Policies', slug: 'safety-policies-accessibility' }
]

// Route handler function
async function handleRoute(request, { params }) {
  const { path = [] } = await params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    // Root endpoint
    if ((route === '/' || route === '/root') && method === 'GET') {
      return handleCORS(NextResponse.json({ message: 'Spinr API v1.0', status: 'healthy' }))
    }

    // Admin Seed SEO Pages - POST /api/admin/seed-seo
    if (route === '/admin/seed-seo' && method === 'POST') {
      if (!await checkAuth(request)) {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      if (!isSupabaseConfigured()) {
        return handleCORS(NextResponse.json({ error: 'Supabase not configured' }, { status: 503 }))
      }

      // Core SEO data for all main pages
      const corePages = [
        {
          path: '/',
          title: "Spinr - 0% Commission Rideshare in Saskatoon",
          description: "Proudly Canadian. Drivers keep 100% of net fare, riders pay just $1. No surge pricing. Now serving Saskatoon.",
          keywords: "rideshare Saskatoon, 0% commission, proudly Canadian rideshare, Saskatoon rideshare, Spinr, taxi alternative",
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
            "description": "Proudly Canadian rideshare platform with 0% commission for drivers",
            "areaServed": ["Saskatoon", "Saskatchewan"],
            "sameAs": []
          },
          no_index: false
        },
        {
          path: '/ride',
          title: "Ride with Spinr - Affordable Local Rides",
          description: "Get rides in Saskatoon for just $1 platform fee. No surge pricing, verified local drivers, fair transparent pricing.",
          keywords: "ride Spinr, cheap rides Saskatoon, Saskatoon taxi, Saskatoon rides, no surge pricing",
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
            "areaServed": ["Saskatoon"]
          },
          no_index: false
        },
        {
          path: '/drive',
          title: "Drive for Spinr - Keep 100% of Net Fare",
          description: "Become a Spinr driver in Saskatchewan. 0% commission forever, daily payouts, first 6 months free. Keep every dollar you earn.",
          keywords: "drive Spinr, rideshare driver Saskatoon, 0% commission driver, Saskatoon driver jobs, Canadian rideshare driver",
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
          title: "About Spinr - Canada's Fair Rideshare",
          description: "Learn about Spinr's mission to bring fair, transparent ridesharing to Canada. Proudly Canadian, community-driven.",
          keywords: "about Spinr, Canadian rideshare company, local rideshare, fair rideshare",
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
              "foundingLocation": "Canada",
              "description": "Proudly Canadian rideshare platform"
            }
          },
          no_index: false
        },
        {
          path: '/support',
          title: "Spinr Support & FAQs",
          description: "Get help with Spinr. Find answers to common questions about riding and driving. Canadian support team, based in Saskatchewan.",
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
        const supabase = createAuthenticatedClient(request)
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
      if (!await checkAuth(request)) {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      if (isSupabaseConfigured()) {
        const supabase = createAuthenticatedClient(request)
        const { count: faqCount } = await anonymousSupabase
          .from('faqs')
          .select('*', { count: 'exact', head: true })

        const { count: legalCount } = await anonymousSupabase
          .from('legal_docs')
          .select('*', { count: 'exact', head: true })

        const { count: seoCount } = await anonymousSupabase
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
        const { data, error } = await anonymousSupabase
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
      if (!await checkAuth(request)) {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

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
        // Sync to AI knowledge base (fire-and-forget)
        syncToKB('cms_faq', data.id, data.question, data.answer, data.category)
        return handleCORS(NextResponse.json(data))
      }

      demoFaqs.unshift(newFaq)
      return handleCORS(NextResponse.json(newFaq))
    }

    // FAQs - PUT /api/faqs/:id
    if (route.startsWith('/faqs/') && method === 'PUT') {
      if (!await checkAuth(request)) {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      const id = path[1]
      const body = await request.json()

      if (isSupabaseConfigured()) {
        const supabase = createAuthenticatedClient(request)
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
          .maybeSingle()

        if (error) {
          console.error('Supabase error:', error)
          return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
        }

        if (!data) {
          return handleCORS(NextResponse.json({ error: 'FAQ not found' }, { status: 404 }))
        }
        // Sync to AI knowledge base (fire-and-forget)
        syncToKB('cms_faq', id, body.question, body.answer, body.category)
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
      if (!await checkAuth(request)) {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      const id = path[1]

      if (isSupabaseConfigured()) {
        const supabase = createAuthenticatedClient(request)
        const { error } = await supabase
          .from('faqs')
          .delete()
          .eq('id', id)

        if (error) {
          console.error('Supabase error:', error)
          return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
        }
        // Delete from AI knowledge base (fire-and-forget)
        deleteFromKB('cms_faq', id)
        return handleCORS(NextResponse.json({ success: true }))
      }

      demoFaqs = demoFaqs.filter(f => f.id !== id)
      return handleCORS(NextResponse.json({ success: true }))
    }

    // Help Articles - GET ALL /api/help-articles
    if (route === '/help-articles' && method === 'GET') {
      if (isSupabaseConfigured()) {
        const { data, error } = await anonymousSupabase
          .from('help_articles')
          .select('*')
          .order('order_index', { ascending: true })

        if (error) {
          console.error('Supabase error:', error)
          return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
        }
        return handleCORS(NextResponse.json(data || []))
      }
      return handleCORS(NextResponse.json({ error: 'Database not configured' }, { status: 503 }))
    }

    // Help Categories - GET /api/help-categories
    if (route === '/help-categories' && method === 'GET') {
      return handleCORS(NextResponse.json(HELP_CATEGORIES))
    }

    // Help Articles - GET BY SLUG /api/help-articles/:slug
    if (route.startsWith('/help-articles/') && method === 'GET') {
      const slug = path[1]

      if (isSupabaseConfigured()) {
        const { data, error } = await anonymousSupabase
          .from('help_articles')
          .select('*')
          .eq('slug', slug)
          .maybeSingle()

        if (error) {
          return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
        }

        if (!data) {
          return handleCORS(NextResponse.json({ error: 'Article not found' }, { status: 404 }))
        }
        return handleCORS(NextResponse.json(data))
      }
      return handleCORS(NextResponse.json({ error: 'Database not configured' }, { status: 503 }))
    }

    // Help Articles - POST /api/help-articles
    if (route === '/help-articles' && method === 'POST') {
      if (!await checkAuth(request)) {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      const body = await request.json()
      const category = HELP_CATEGORIES.find(c => c.id === body.category_id)
      const newArticle = {
        id: uuidv4(),
        slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        title: body.title,
        category_id: body.category_id,
        category_title: category?.title || body.category_id,
        content: body.content || '',
        is_popular: body.is_popular || false,
        order_index: body.order_index || 1, // Defaulting to 1 if not provided, removed fallback length check
        created_at: new Date().toISOString()
      }

      if (isSupabaseConfigured()) {
        const supabase = createAuthenticatedClient(request)
        const { data, error } = await supabase
          .from('help_articles')
          .insert([newArticle])
          .select()
          .single()

        if (error) {
          console.error('Supabase error:', error)
          return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
        }
        // Sync to AI knowledge base (fire-and-forget)
        syncToKB('cms_article', data.id, data.title, data.content, data.category_id)
        return handleCORS(NextResponse.json(data))
      }
      return handleCORS(NextResponse.json({ error: 'Database not configured' }, { status: 503 }))
    }

    // Help Articles - PUT /api/help-articles/:id
    if (route.startsWith('/help-articles/') && method === 'PUT') {
      if (!await checkAuth(request)) {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      const id = path[1]
      const body = await request.json()
      const category = HELP_CATEGORIES.find(c => c.id === body.category_id)

      if (isSupabaseConfigured()) {
        const supabase = createAuthenticatedClient(request)
        const { data, error } = await supabase
          .from('help_articles')
          .update({
            slug: body.slug,
            title: body.title,
            category_id: body.category_id,
            category_title: category?.title || body.category_id,
            content: body.content,
            is_popular: body.is_popular,
            order_index: body.order_index,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .maybeSingle()

        if (error) {
          console.error('Supabase error:', error)
          return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
        }

        if (!data) {
          return handleCORS(NextResponse.json({ error: 'Article not found' }, { status: 404 }))
        }
        // Sync to AI knowledge base (fire-and-forget)
        syncToKB('cms_article', id, body.title, body.content, body.category_id)
        return handleCORS(NextResponse.json(data))
      }
      return handleCORS(NextResponse.json({ error: 'Database not configured' }, { status: 503 }))
    }

    // Help Articles - DELETE /api/help-articles/:id
    if (route.startsWith('/help-articles/') && method === 'DELETE') {
      if (!await checkAuth(request)) {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      const id = path[1]

      if (isSupabaseConfigured()) {
        const supabase = createAuthenticatedClient(request)
        const { error } = await supabase
          .from('help_articles')
          .delete()
          .eq('id', id)

        if (error) {
          console.error('Supabase error:', error)
          return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
        }
        // Delete from AI knowledge base (fire-and-forget)
        deleteFromKB('cms_article', id)
        return handleCORS(NextResponse.json({ success: true }))
      }
      return handleCORS(NextResponse.json({ error: 'Database not configured' }, { status: 503 }))
    }

    // Legal Docs - GET /api/legal/:slug
    if (route.startsWith('/legal/') && method === 'GET') {
      const slug = path[1]

      if (isSupabaseConfigured()) {
        const { data, error } = await anonymousSupabase
          .from('legal_docs')
          .select('*')
          .eq('slug', slug)
          .maybeSingle()

        if (error) {
          return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
        }

        if (!data) {
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
      if (!await checkAuth(request)) {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      const slug = path[1]
      const body = await request.json()

      if (isSupabaseConfigured()) {
        const supabase = createAuthenticatedClient(request)
        // Try to update existing, or insert new
        const { data: existing } = await supabase
          .from('legal_docs')
          .select('slug')
          .eq('slug', slug)
          .maybeSingle()

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
            .maybeSingle()
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
        const { data, error } = await anonymousSupabase
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
        const { data, error } = await anonymousSupabase
          .from('seo_pages')
          .select('*')
          .eq('path', decodedPath)
          .maybeSingle()

        if (error) {
          return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
        }

        if (!data) {
          return handleCORS(NextResponse.json({ error: 'SEO page not found' }, { status: 404 }))
        }
        return handleCORS(NextResponse.json(data))
      }
      return handleCORS(NextResponse.json({ error: 'Supabase not configured' }, { status: 503 }))
    }

    // SEO Pages - CREATE /api/seo-pages
    if (route === '/seo-pages' && method === 'POST') {
      if (!await checkAuth(request)) {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

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
        custom_head: body.custom_head || null,
        custom_body_start: body.custom_body_start || null,
        custom_body_end: body.custom_body_end || null,
        no_index: body.no_index || false
      }

      if (isSupabaseConfigured()) {
        const supabase = createAuthenticatedClient(request)
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
      if (!await checkAuth(request)) {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      const pathParam = path.slice(1).join('/')
      const decodedPath = decodeURIComponent(pathParam)
      const body = await request.json()

      if (isSupabaseConfigured()) {
        const supabase = createAuthenticatedClient(request)
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
            custom_head: body.custom_head || null,
            custom_body_start: body.custom_body_start || null,
            custom_body_end: body.custom_body_end || null,
            no_index: body.no_index,
            updated_at: new Date().toISOString()
          })
          .eq('path', decodedPath)
          .select()
          .maybeSingle()

        if (error) {
          console.error('Supabase error:', error)
          return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
        }

        if (!data) {
          return handleCORS(NextResponse.json({ error: 'SEO page not found' }, { status: 404 }))
        }
        return handleCORS(NextResponse.json(data))
      }
      return handleCORS(NextResponse.json({ error: 'Supabase not configured' }, { status: 503 }))
    }

    // SEO Pages - DELETE /api/seo-pages/:path
    if (route.startsWith('/seo-pages/') && method === 'DELETE') {
      if (!await checkAuth(request)) {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      const pathParam = path.slice(1).join('/')
      const decodedPath = decodeURIComponent(pathParam)

      if (isSupabaseConfigured()) {
        const supabase = createAuthenticatedClient(request)
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

    // =====================================================
    // Promotions CMS — CRUD (admin only except public GET by slug)
    // =====================================================

    // GET /api/promotions — admin lists all
    if (route === '/promotions' && method === 'GET') {
      if (!await checkAuth(request)) {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }
      if (!isSupabaseConfigured()) {
        return handleCORS(NextResponse.json({ error: 'Supabase not configured' }, { status: 503 }))
      }
      const supabase = createAuthenticatedClient(request)
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) {
        console.error('Promotions list error:', error)
        return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
      }
      return handleCORS(NextResponse.json((data || []).map(normalizePromotion)))
    }

    // POST /api/promotions — admin create
    if (route === '/promotions' && method === 'POST') {
      if (!await checkAuth(request)) {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }
      if (!isSupabaseConfigured()) {
        return handleCORS(NextResponse.json({ error: 'Supabase not configured' }, { status: 503 }))
      }
      let body
      try { body = await request.json() } catch {
        return handleCORS(NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }))
      }
      if (!body?.slug || !body?.title) {
        return handleCORS(NextResponse.json({ error: 'slug and title are required' }, { status: 400 }))
      }
      const supabase = createAuthenticatedClient(request)
      const { data, error } = await supabase
        .from('promotions')
        .insert([toDbRow(body)])
        .select()
        .single()
      if (error) {
        console.error('Promotion create error:', error)
        const msg = error.code === '23505' ? 'A promotion with that slug already exists' : error.message
        return handleCORS(NextResponse.json({ error: msg }, { status: 400 }))
      }
      return handleCORS(NextResponse.json(normalizePromotion(data)))
    }

    // PUT /api/promotions/:id — admin update
    if (route.startsWith('/promotions/') && method === 'PUT') {
      if (!await checkAuth(request)) {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }
      if (!isSupabaseConfigured()) {
        return handleCORS(NextResponse.json({ error: 'Supabase not configured' }, { status: 503 }))
      }
      const id = path[1]
      let body
      try { body = await request.json() } catch {
        return handleCORS(NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }))
      }
      const supabase = createAuthenticatedClient(request)
      const { data, error } = await supabase
        .from('promotions')
        .update(toDbRow(body))
        .eq('id', id)
        .select()
        .maybeSingle()
      if (error) {
        console.error('Promotion update error:', error)
        return handleCORS(NextResponse.json({ error: error.message }, { status: 400 }))
      }
      if (!data) {
        return handleCORS(NextResponse.json({ error: 'Promotion not found' }, { status: 404 }))
      }
      return handleCORS(NextResponse.json(normalizePromotion(data)))
    }

    // DELETE /api/promotions/:id — admin delete
    if (route.startsWith('/promotions/') && method === 'DELETE') {
      if (!await checkAuth(request)) {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }
      if (!isSupabaseConfigured()) {
        return handleCORS(NextResponse.json({ error: 'Supabase not configured' }, { status: 503 }))
      }
      const id = path[1]
      const supabase = createAuthenticatedClient(request)
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', id)
      if (error) {
        console.error('Promotion delete error:', error)
        return handleCORS(NextResponse.json({ error: error.message }, { status: 400 }))
      }
      return handleCORS(NextResponse.json({ success: true }))
    }

    // Promotion Signups - GET /api/promotion-signups (admin only)
    if (route === '/promotion-signups' && method === 'GET') {
      if (!await checkAuth(request)) {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      if (isSupabaseConfigured()) {
        const supabase = createAuthenticatedClient(request)
        const { data, error } = await supabase
          .from('promotion_signups')
          .select('*')
          .order('accepted_at', { ascending: false })

        if (error) {
          console.error('Promotion signups fetch error:', error)
          return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
        }
        return handleCORS(NextResponse.json(data || []))
      }

      return handleCORS(NextResponse.json(demoPromotionSignups))
    }

    // Promotion Coupons - GET /api/promotion-coupons/:code (public, validate)
    if (route.startsWith('/promotion-coupons/') && method === 'GET' && path[1] && path.length === 2) {
      const code = decodeURIComponent(path[1]).trim().toUpperCase()
      const nowIso = new Date().toISOString()

      let coupon
      if (isSupabaseConfigured()) {
        const { data } = await anonymousSupabase
          .from('promotion_coupons')
          .select('code, promotion_slug, status, expires_at')
          .eq('code', code)
          .maybeSingle()
        coupon = data
      } else {
        coupon = demoPromotionCoupons.find((c) => c.code === code)
      }

      if (!coupon) {
        return handleCORS(NextResponse.json(
          { valid: false, error: 'This code is not valid.' },
          { status: 404 }
        ))
      }
      if (coupon.status === 'used') {
        return handleCORS(NextResponse.json(
          { valid: false, error: 'This code has already been used.' },
          { status: 410 }
        ))
      }
      if (coupon.expires_at && coupon.expires_at < nowIso) {
        return handleCORS(NextResponse.json(
          { valid: false, error: 'This code has expired.' },
          { status: 410 }
        ))
      }
      const promo = await getPromotionBySlug(coupon.promotion_slug)
      return handleCORS(NextResponse.json({
        valid: true,
        code: coupon.code,
        promotion_slug: coupon.promotion_slug,
        promotion_title: promo?.title || null,
        expires_at: coupon.expires_at,
      }))
    }

    // Promotion Coupons - GET /api/promotion-coupons (admin, list all)
    if (route === '/promotion-coupons' && method === 'GET') {
      if (!await checkAuth(request)) {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      if (isSupabaseConfigured()) {
        const supabase = createAuthenticatedClient(request)
        const { data, error } = await supabase
          .from('promotion_coupons')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Promotion coupons fetch error:', error)
          return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
        }
        return handleCORS(NextResponse.json(data || []))
      }
      return handleCORS(NextResponse.json(demoPromotionCoupons))
    }

    // Promotion Coupons - POST /api/promotion-coupons (admin, generate batch)
    if (route === '/promotion-coupons' && method === 'POST') {
      if (!await checkAuth(request)) {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      let body
      try {
        body = await request.json()
      } catch {
        return handleCORS(NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }))
      }

      const { promotion_slug, recipients, send_sms } = body || {}
      const promo = promotion_slug ? await getPromotionBySlug(promotion_slug) : null
      if (!promo || promo.status !== 'active') {
        return handleCORS(NextResponse.json(
          { error: 'Promotion not found or no longer active' },
          { status: 404 }
        ))
      }
      if (!Array.isArray(recipients) || recipients.length === 0 || recipients.length > 100) {
        return handleCORS(NextResponse.json(
          { error: 'Provide 1–100 recipients' },
          { status: 400 }
        ))
      }

      const publicBaseUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        request.headers.get('origin') ||
        `https://${request.headers.get('host') || 'spinr.ca'}`

      const now = new Date()
      const expiresIso = new Date(now.getTime() + COUPON_TTL_MS).toISOString()
      const coupons = recipients.map((r) => ({
        id: uuidv4(),
        code: generateCouponCode(),
        promotion_slug: promo.slug,
        recipient_name: (r?.name || '').toString().trim() || null,
        recipient_phone: (r?.phone || '').toString().trim() || null,
        status: 'pending',
        expires_at: expiresIso,
        used_at: null,
        used_by_email: null,
        used_by_signup_id: null,
        sms_status: 'not_sent',
        sms_error: null,
        sms_sent_at: null,
        created_at: now.toISOString(),
      }))

      let inserted = coupons
      if (isSupabaseConfigured()) {
        const supabase = createAuthenticatedClient(request)
        const { data, error } = await supabase
          .from('promotion_coupons')
          .insert(coupons)
          .select()
        if (error) {
          console.error('Coupon generation error:', error)
          return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
        }
        inserted = data
      } else {
        demoPromotionCoupons.unshift(...coupons)
      }

      // Optional SMS auto-send
      const shouldSend = send_sms !== false && isTwilioConfigured()
      if (shouldSend) {
        await Promise.all(inserted.map(async (c) => {
          if (!c.recipient_phone) {
            c.sms_status = 'skipped'
            c.sms_error = 'No phone number'
            return
          }
          const link = `${publicBaseUrl.replace(/\/$/, '')}/promotions/${promo.slug}?code=${encodeURIComponent(c.code)}`
          const body = renderSmsTemplate(promo.smsTemplate, {
            name: c.recipient_name || 'there',
            code: c.code,
            link,
            reward: promo.reward,
            goal_rides: promo.goalRides,
            window_days: promo.windowDays,
            city: promo.city,
            title: promo.title,
          })
          const result = await sendSms({ to: c.recipient_phone, body })
          c.sms_status = result.ok ? 'sent' : result.status
          c.sms_error = result.error
          c.sms_sent_at = result.ok ? new Date().toISOString() : null

          if (isSupabaseConfigured()) {
            await anonymousSupabase
              .from('promotion_coupons')
              .update({
                sms_status: c.sms_status,
                sms_error: c.sms_error,
                sms_sent_at: c.sms_sent_at,
              })
              .eq('id', c.id)
          }
        }))
      } else if (!send_sms && isTwilioConfigured()) {
        // User explicitly chose not to auto-send (send_sms === false)
      } else if (send_sms !== false && !isTwilioConfigured()) {
        // Admin wanted to send, but Twilio isn't configured — flag as skipped
        inserted.forEach((c) => {
          c.sms_status = 'skipped'
          c.sms_error = 'Twilio not configured'
        })
      }

      return handleCORS(NextResponse.json({
        coupons: inserted,
        twilio_configured: isTwilioConfigured(),
      }))
    }

    // POST /api/promotion-coupons/:id/resend-sms — admin manual resend
    if (route.startsWith('/promotion-coupons/') && path[2] === 'resend-sms' && method === 'POST') {
      if (!await checkAuth(request)) {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }
      if (!isTwilioConfigured()) {
        return handleCORS(NextResponse.json({ error: 'Twilio is not configured' }, { status: 503 }))
      }
      const id = path[1]
      if (!isSupabaseConfigured()) {
        return handleCORS(NextResponse.json({ error: 'Supabase not configured' }, { status: 503 }))
      }
      const supabase = createAuthenticatedClient(request)
      const { data: coupon, error } = await supabase
        .from('promotion_coupons')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      if (error || !coupon) {
        return handleCORS(NextResponse.json({ error: 'Coupon not found' }, { status: 404 }))
      }
      if (!coupon.recipient_phone) {
        return handleCORS(NextResponse.json({ error: 'No phone on file for this coupon' }, { status: 400 }))
      }
      const promo = await getPromotionBySlug(coupon.promotion_slug)
      if (!promo) {
        return handleCORS(NextResponse.json({ error: 'Promotion not found' }, { status: 404 }))
      }
      const publicBaseUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        request.headers.get('origin') ||
        `https://${request.headers.get('host') || 'spinr.ca'}`
      const link = `${publicBaseUrl.replace(/\/$/, '')}/promotions/${promo.slug}?code=${encodeURIComponent(coupon.code)}`
      const body = renderSmsTemplate(promo.smsTemplate, {
        name: coupon.recipient_name || 'there',
        code: coupon.code,
        link,
        reward: promo.reward,
        goal_rides: promo.goalRides,
        window_days: promo.windowDays,
        city: promo.city,
        title: promo.title,
      })
      const result = await sendSms({ to: coupon.recipient_phone, body })
      await anonymousSupabase
        .from('promotion_coupons')
        .update({
          sms_status: result.ok ? 'sent' : result.status,
          sms_error: result.error,
          sms_sent_at: result.ok ? new Date().toISOString() : null,
        })
        .eq('id', id)
      return handleCORS(NextResponse.json({
        ok: result.ok,
        status: result.ok ? 'sent' : result.status,
        error: result.error,
      }))
    }

    // POST /api/promotion-coupons/:id/send-reminder — admin manual reminder
    if (route.startsWith('/promotion-coupons/') && path[2] === 'send-reminder' && method === 'POST') {
      if (!await checkAuth(request)) {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }
      if (!isTwilioConfigured()) {
        return handleCORS(NextResponse.json({ error: 'Twilio is not configured' }, { status: 503 }))
      }
      if (!isSupabaseConfigured()) {
        return handleCORS(NextResponse.json({ error: 'Supabase not configured' }, { status: 503 }))
      }
      const id = path[1]
      const supabase = createAuthenticatedClient(request)
      const { data: coupon, error } = await supabase
        .from('promotion_coupons')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      if (error || !coupon) {
        return handleCORS(NextResponse.json({ error: 'Coupon not found' }, { status: 404 }))
      }
      if (coupon.status !== 'pending') {
        return handleCORS(NextResponse.json({ error: 'Coupon is not pending' }, { status: 400 }))
      }
      if (!coupon.recipient_phone) {
        return handleCORS(NextResponse.json({ error: 'No phone on file' }, { status: 400 }))
      }
      const promo = await getPromotionBySlug(coupon.promotion_slug)
      if (!promo) {
        return handleCORS(NextResponse.json({ error: 'Promotion not found' }, { status: 404 }))
      }
      const publicBaseUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        request.headers.get('origin') ||
        `https://${request.headers.get('host') || 'spinr.ca'}`
      const link = `${publicBaseUrl.replace(/\/$/, '')}/promotions/${promo.slug}?code=${encodeURIComponent(coupon.code)}`
      const body = renderSmsTemplate(promo.reminderSmsTemplate, {
        name: coupon.recipient_name || 'there',
        code: coupon.code,
        link,
        reward: promo.reward,
        goal_rides: promo.goalRides,
        window_days: promo.windowDays,
        city: promo.city,
        title: promo.title,
      })
      const result = await sendSms({ to: coupon.recipient_phone, body })
      await anonymousSupabase
        .from('promotion_coupons')
        .update({
          reminder_sms_status: result.ok ? 'sent' : result.status,
          reminder_sms_error: result.error,
          reminder_sent_at: result.ok ? new Date().toISOString() : null,
        })
        .eq('id', id)
      return handleCORS(NextResponse.json({
        ok: result.ok,
        status: result.ok ? 'sent' : result.status,
        error: result.error,
      }))
    }

    // Promotion Signups - POST /api/promotion-signups
    // Public endpoint — drivers register using a valid, unused coupon code
    if (route === '/promotion-signups' && method === 'POST') {
      let body
      try {
        body = await request.json()
      } catch {
        return handleCORS(NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }))
      }

      const {
        promotion_slug,
        coupon_code,
        full_name,
        email,
        phone,
        city
      } = body || {}

      // Validate promotion exists and is active
      const promo = promotion_slug ? await getPromotionBySlug(promotion_slug) : null
      if (!promo || promo.status !== 'active') {
        return handleCORS(NextResponse.json(
          { error: 'Promotion not found or no longer active' },
          { status: 404 }
        ))
      }

      // Validate input
      const emailOk = typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      const normalizedCode = typeof coupon_code === 'string' ? coupon_code.trim().toUpperCase() : ''
      if (!normalizedCode) {
        return handleCORS(NextResponse.json(
          { error: 'A coupon code is required' },
          { status: 400 }
        ))
      }
      if (
        !emailOk ||
        typeof full_name !== 'string' || full_name.trim().length < 2 ||
        typeof phone !== 'string' || phone.trim().length < 7
      ) {
        return handleCORS(NextResponse.json(
          { error: 'Missing or invalid fields' },
          { status: 400 }
        ))
      }

      const nowDate = new Date()
      const nowIso = nowDate.toISOString()
      const reference = `SPINR-${promo.slug.toUpperCase().slice(0, 6)}-${uuidv4().slice(0, 6).toUpperCase()}`
      const signupId = uuidv4()
      const signup = {
        id: signupId,
        reference,
        coupon_code: normalizedCode,
        promotion_slug: promo.slug,
        audience: promo.audience,
        full_name: full_name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        driver_id: null,
        city: (city || promo.city).trim(),
        goal_rides: promo.goalRides,
        window_days: promo.windowDays,
        reward_amount: promo.reward,
        status: 'accepted',
        accepted_at: nowIso,
        expires_at: new Date(nowDate.getTime() + promo.windowDays * 24 * 60 * 60 * 1000).toISOString()
      }

      if (isSupabaseConfigured()) {
        // 1) Atomically burn the coupon (only if pending, matching promo, not expired)
        const { data: burned, error: burnErr } = await anonymousSupabase
          .from('promotion_coupons')
          .update({
            status: 'used',
            used_at: nowIso,
            used_by_email: signup.email,
            used_by_signup_id: signupId,
          })
          .eq('code', normalizedCode)
          .eq('promotion_slug', promo.slug)
          .eq('status', 'pending')
          .gt('expires_at', nowIso)
          .select('code, recipient_phone, recipient_name')

        if (burnErr) {
          console.error('Coupon burn error:', burnErr)
          return handleCORS(NextResponse.json(
            { error: 'Could not validate code. Please try again.' },
            { status: 500 }
          ))
        }
        if (!burned || burned.length === 0) {
          return handleCORS(NextResponse.json(
            { error: 'Invalid, expired, or already-used code' },
            { status: 410 }
          ))
        }

        // 2) Insert the signup
        const { data, error } = await anonymousSupabase
          .from('promotion_signups')
          .insert([signup])
          .select()
          .single()

        if (error) {
          // Rollback: re-open the coupon so the driver can retry
          await anonymousSupabase
            .from('promotion_coupons')
            .update({
              status: 'pending',
              used_at: null,
              used_by_email: null,
              used_by_signup_id: null,
            })
            .eq('code', normalizedCode)
          console.error('Promotion signup error:', error)
          return handleCORS(NextResponse.json(
            { error: 'Could not save signup. Please try again.' },
            { status: 500 }
          ))
        }
        return handleCORS(NextResponse.json(data))
      }

      // Demo fallback — burn in-memory
      const coupon = demoPromotionCoupons.find(
        (c) => c.code === normalizedCode && c.promotion_slug === promo.slug
      )
      if (!coupon) {
        return handleCORS(NextResponse.json({ error: 'Invalid code' }, { status: 410 }))
      }
      if (coupon.status !== 'pending') {
        return handleCORS(NextResponse.json(
          { error: 'This code has already been used' },
          { status: 410 }
        ))
      }
      if (coupon.expires_at && coupon.expires_at < nowIso) {
        return handleCORS(NextResponse.json(
          { error: 'This code has expired' },
          { status: 410 }
        ))
      }
      coupon.status = 'used'
      coupon.used_at = nowIso
      coupon.used_by_email = signup.email
      coupon.used_by_signup_id = signupId
      demoPromotionSignups.unshift(signup)
      return handleCORS(NextResponse.json(signup))
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
