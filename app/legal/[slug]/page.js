import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import JsonLdInjector from '@/components/seo/JsonLdInjector'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import SafeHtml from '@/components/ui/SafeHtml'

// Generate metadata for SEO (Database-driven)
export async function generateMetadata({ params }) {
  const { slug } = await params
  const legalPath = `/legal/${slug}`

  // Try to fetch from SEO pages table
  if (isSupabaseConfigured()) {
    try {
      const { data: seoData } = await supabase
        .from('seo_pages')
        .select('title, description, keywords, og_image, canonical')
        .eq('path', legalPath)
        .single()

      if (seoData) {
        return {
          title: seoData.title,
          description: seoData.description,
          keywords: seoData.keywords,
          openGraph: {
            title: seoData.title,
            description: seoData.description,
            images: seoData.og_image ? [seoData.og_image] : [],
          },
          alternates: {
            canonical: seoData.canonical || `https://spinr.ca${legalPath}`
          }
        }
      }
    } catch (error) {
      console.log('Failed to fetch SEO metadata, using defaults')
    }
  }

  // Fallback metadata
  const titles = {
    'terms': 'Terms of Service',
    'privacy': 'Privacy Policy',
    'driver-agreement': 'Driver Agreement',
    'rider-terms': 'Rider Terms of Service',
    'driver-terms': 'Driver Terms of Service',
    'rider-policy': 'Rider Privacy Policy',
    'driver-policy': 'Driver Privacy Policy'
  }

  const title = titles[slug] || 'Legal'

  return {
    title: `${title} | Spinr`,
    description: `Read Spinr's ${title}. Fair, transparent policies for Saskatchewan's rideshare platform.`,
  }
}

// Default legal content (used when Supabase is not configured)
const defaultContent = {
  'terms': {
    title: 'Terms of Service',
    content: `
      <h2>1. Introduction</h2>
      <p>Welcome to Spinr. These Terms of Service ("Terms") govern your use of the Spinr platform and services. By using Spinr, you agree to these Terms.</p>
      
      <h2>2. Service Description</h2>
      <p>Spinr is a rideshare platform connecting riders with independent drivers in Saskatchewan. We facilitate connections but do not provide transportation services directly.</p>
      
      <h2>3. User Responsibilities</h2>
      <p>Users must:</p>
      <ul>
        <li>Provide accurate information during registration</li>
        <li>Maintain account security</li>
        <li>Comply with all applicable laws</li>
        <li>Treat drivers and riders with respect</li>
      </ul>
      
      <h2>4. Pricing</h2>
      <p>Riders pay the driver's fare plus a flat $1 platform fee per trip. There is no surge pricing. Drivers keep 100% of fares.</p>
      
      <h2>5. Limitation of Liability</h2>
      <p>Spinr provides the platform "as is" and makes no warranties regarding availability or reliability of transportation services.</p>
      
      <h2>6. Changes to Terms</h2>
      <p>We may update these Terms from time to time. Continued use of Spinr constitutes acceptance of any changes.</p>
      
      <h2>7. Contact</h2>
      <p>For questions about these Terms, contact us at <a href="mailto:support@spinr.ca" className="text-primary hover:underline">support@spinr.ca</a></p>
    `
  },
  'privacy': {
    title: 'Privacy Policy',
    content: `
      <h2>1. Information We Collect</h2>
      <p>We collect information you provide directly, including:</p>
      <ul>
        <li>Account information (name, email, phone number)</li>
        <li>Payment information</li>
        <li>Location data during trips</li>
        <li>Trip history</li>
      </ul>
      
      <h2>2. How We Use Information</h2>
      <p>We use your information to:</p>
      <ul>
        <li>Facilitate rideshare connections</li>
        <li>Process payments</li>
        <li>Improve our services</li>
        <li>Communicate with you</li>
        <li>Ensure safety and security</li>
      </ul>
      
      <h2>3. Information Sharing</h2>
      <p>We share limited information with drivers/riders to facilitate trips. We do not sell your personal information to third parties.</p>
      
      <h2>4. Data Security</h2>
      <p>We implement industry-standard security measures to protect your information. However, no method of transmission over the internet is 100% secure.</p>
      
      <h2>5. Your Rights</h2>
      <p>You can:</p>
      <ul>
        <li>Access your personal information</li>
        <li>Request corrections</li>
        <li>Delete your account</li>
        <li>Opt out of marketing communications</li>
      </ul>
      
      <h2>6. Contact</h2>
      <p>For privacy questions, contact <a href="mailto:support@spinr.ca" className="text-primary hover:underline">support@spinr.ca</a></p>
    `
  },
  'driver-agreement': {
    title: 'Driver Agreement',
    content: `
      <h2>1. Independent Contractor Status</h2>
      <p>Drivers are independent contractors, not employees of Spinr. You are responsible for your own taxes, insurance, and business expenses.</p>
      
      <h2>2. Driver Requirements</h2>
      <p>To drive with Spinr, you must:</p>
      <ul>
        <li>Be at least 21 years old</li>
        <li>Hold a valid Saskatchewan driver's license for at least 1 year</li>
        <li>Pass a background check</li>
        <li>Have a vehicle from 2015 or newer with 4 doors</li>
        <li>Maintain valid auto insurance</li>
      </ul>
      
      <h2>3. Commission Structure</h2>
      <p>Spinr charges 0% commission on all fares. You keep 100% of what riders pay for trips. After 6 months, there is a $99/month subscription fee to remain active on the platform.</p>
      
      <h2>4. Payment</h2>
      <p>Earnings are deposited to your bank account within 24 hours of trip completion.</p>
      
      <h2>5. Insurance</h2>
      <p>Spinr provides supplementary commercial insurance coverage while you are actively engaged in trips. You must maintain your own personal auto insurance.</p>
      
      <h2>6. Conduct Standards</h2>
      <p>Drivers must:</p>
      <ul>
        <li>Provide safe, professional service</li>
        <li>Maintain a clean vehicle</li>
        <li>Follow all traffic laws</li>
        <li>Treat riders with respect</li>
        <li>Not discriminate against any rider</li>
      </ul>
      
      <h2>7. Termination</h2>
      <p>Either party may terminate this agreement at any time. Spinr reserves the right to deactivate drivers who violate these terms or receive consistently poor ratings.</p>
      
      <h2>8. Contact</h2>
      <p>For driver-related questions, contact <a href="mailto:support@spinr.ca" className="text-primary hover:underline">support@spinr.ca</a></p>
    `
  },
  'rider-terms': {
    title: 'Rider Terms of Service',
    content: `
      <h2>1. Introduction</h2>
      <p>These terms govern your use of Spinr as a rider. By using our platform, you agree to pay for rides and treat drivers with respect.</p>
      
      <h2>2. Booking and Payments</h2>
      <p>Riders agree to pay the fare shown in the app plus a flat $1 platform fee per trip. Payment is processed automatically.</p>
      
      <h2>3. Cancellations</h2>
      <p>Cancellation fees may apply if you cancel a ride more than 2 minutes after a driver has accepted it.</p>
    `
  },
  'driver-terms': {
    title: 'Driver Terms of Service',
    content: `
      <h2>1. Driver Obligations</h2>
      <p>You must maintain a valid license, insurance, and vehicle registration. You must provide safe and professional service.</p>
      
      <h2>2. Earnings & Fees</h2>
      <p>You keep 100% of the fare. The rider pays a separate platform fee. Spinr may charge a subscription fee after an initial trial period.</p>
    `
  },
  'rider-policy': {
    title: 'Rider Privacy Policy',
    content: `
      <h2>1. Rider Data Collection</h2>
      <p>We collect your name, phone number, payment method, and location data to facilitate your rides.</p>
      
      <h2>2. Data Usage</h2>
      <p>Your location is shared with drivers only during an active trip request and ride.</p>
    `
  },
  'driver-policy': {
    title: 'Driver Privacy Policy',
    content: `
      <h2>1. Driver Data Collection</h2>
      <p>We collect your license, vehicle details, insurance documents, and background check information.</p>
      
      <h2>2. Data Usage</h2>
      <p>We use this data to verify your eligibility to drive and to process your earnings.</p>
    `
  }
}

async function getLegalContent(slug) {
  const legalPath = `/legal/${slug}`
  let structuredData = null

  // Try to fetch structured data from seo_pages table
  if (isSupabaseConfigured()) {
    try {
      const { data: seoData } = await supabase
        .from('seo_pages')
        .select('structured_data')
        .eq('path', legalPath)
        .single()

      if (seoData && seoData.structured_data) {
        structuredData = seoData.structured_data
      }
    } catch (error) {
      console.log('No structured data found for:', slug)
    }
  }

  // Try to fetch from Supabase legal_docs
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/legal/${slug}`, {
      cache: 'no-store'
    })

    if (response.ok) {
      const data = await response.json()
      if (data && data.content_html) {
        return { ...data, structuredData }
      }
    }
  } catch (error) {
    console.log('Using default content for:', slug)
  }

  // Fall back to default content
  const content = defaultContent[slug]
  if (!content) {
    return null
  }

  return {
    title: content.title,
    content_html: content.content,
    last_updated: new Date().toISOString(),
    structuredData
  }
}

export default async function LegalPage({ params }) {
  const { slug } = await params
  const legalDoc = await getLegalContent(slug)

  if (!legalDoc) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Inject JSON-LD Structured Data */}
      {legalDoc.structuredData && (
        <JsonLdInjector data={legalDoc.structuredData} />
      )}

      <article className="pt-24 pb-16 md:pt-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">{legalDoc.title}</h1>
            <p className="text-slate-600 mb-8">
              Last updated: {new Date(legalDoc.last_updated).toLocaleDateString('en-CA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>

            <SafeHtml
              content={legalDoc.content_html}
              className="prose prose-lg max-w-none
                prose-headings:text-slate-900 prose-headings:font-semibold
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                prose-p:text-slate-700 prose-p:leading-relaxed
                prose-ul:text-slate-700 prose-li:text-slate-700
                prose-a:text-emerald-600 prose-a:hover:text-emerald-500"
            />
          </div>
        </div>
      </article>

      <Footer />
    </main>
  )
}
