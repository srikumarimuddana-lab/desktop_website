-- =====================================================
-- SPINR CMS DATABASE SCHEMA
-- =====================================================
-- Run this script in your Supabase SQL Editor
-- (Supabase Dashboard → SQL Editor → New Query → Paste → Run)
-- =====================================================

-- =====================================================
-- 1. FAQs TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access
CREATE POLICY "Allow public read access on faqs"
  ON public.faqs FOR SELECT
  USING (true);

-- Policy: Allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to manage faqs"
  ON public.faqs FOR ALL
  USING (auth.role() = 'authenticated');

-- =====================================================
-- 2. LEGAL DOCUMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.legal_docs (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content_html TEXT NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.legal_docs ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access
CREATE POLICY "Allow public read access on legal_docs"
  ON public.legal_docs FOR SELECT
  USING (true);

-- Policy: Allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to manage legal_docs"
  ON public.legal_docs FOR ALL
  USING (auth.role() = 'authenticated');

-- =====================================================
-- 3. SEO PAGES TABLE (Database-First SEO Engine)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.seo_pages (
  path TEXT PRIMARY KEY,                          -- e.g., '/', '/drive', '/legal/terms'
  title TEXT NOT NULL,                            -- Browser Tab Title
  description TEXT,                               -- Meta Description
  keywords TEXT,                                  -- Comma separated tags
  og_image TEXT,                                  -- Open Graph image URL
  canonical TEXT,                                 -- Canonical URL override
  sitemap_priority REAL DEFAULT 0.5,              -- 0.0 to 1.0
  sitemap_frequency TEXT DEFAULT 'weekly',        -- 'daily', 'weekly', 'monthly'
  structured_data JSONB,                          -- JSON-LD structured data
  no_index BOOLEAN DEFAULT false,                 -- Exclude from sitemap/search
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.seo_pages ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access
CREATE POLICY "Allow public read access on seo_pages"
  ON public.seo_pages FOR SELECT
  USING (true);

-- Policy: Allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to manage seo_pages"
  ON public.seo_pages FOR ALL
  USING (auth.role() = 'authenticated');

-- Index for faster sitemap generation
CREATE INDEX IF NOT EXISTS idx_seo_pages_no_index ON public.seo_pages(no_index);
CREATE INDEX IF NOT EXISTS idx_seo_pages_priority ON public.seo_pages(sitemap_priority DESC);

-- =====================================================
-- 4. INSERT DEFAULT SEO DATA
-- =====================================================
-- Insert default SEO configurations for main pages
INSERT INTO public.seo_pages (path, title, description, keywords, sitemap_priority, sitemap_frequency, og_image, structured_data) VALUES
  (
    '/',
    'Spinr - Saskatchewan''s Fair Rideshare Platform',
    'Fair ridesharing in Saskatchewan. 0% commission for drivers, flat $1 fee for riders. Join Spinr today.',
    'rideshare, saskatchewan, regina, saskatoon, taxi, uber alternative',
    1.0,
    'daily',
    'https://cfrazforbupizntxvvtp.supabase.co/storage/v1/object/public/assets/og-home.jpg',
    '{"@context": "https://schema.org", "@type": "LocalBusiness", "name": "Spinr", "description": "Saskatchewan''s fair rideshare platform", "address": {"@type": "PostalAddress", "addressRegion": "Saskatchewan", "addressCountry": "CA"}}'::jsonb
  ),
  (
    '/drive',
    'Drive with Spinr - 0% Commission',
    'Keep 100% of your earnings. No commission, just a driver-friendly subscription model. Start driving with Spinr.',
    'drive with spinr, driver earnings, 0% commission, driver jobs saskatchewan',
    0.9,
    'weekly',
    'https://cfrazforbupizntxvvtp.supabase.co/storage/v1/object/public/assets/og-drive.jpg',
    '{"@context": "https://schema.org", "@type": "JobPosting", "title": "Rideshare Driver", "description": "Drive with 0% commission", "hiringOrganization": {"@type": "Organization", "name": "Spinr"}}'::jsonb
  ),
  (
    '/ride',
    'Ride with Spinr - Flat $1 Fee',
    'Transparent pricing. Pay the driver plus a flat $1 platform fee. No surge pricing, no hidden costs.',
    'ride spinr, rideshare saskatchewan, cheap rides, no surge pricing',
    0.9,
    'weekly',
    NULL,
    NULL
  ),
  (
    '/about',
    'About Spinr - Fair Ridesharing for Saskatchewan',
    'Learn about Spinr''s mission to create a fair rideshare platform for drivers and riders in Saskatchewan.',
    'about spinr, company mission, rideshare saskatchewan',
    0.7,
    'monthly',
    NULL,
    '{"@context": "https://schema.org", "@type": "AboutPage", "name": "About Spinr"}'::jsonb
  ),
  (
    '/support',
    'Spinr Support - FAQs & Help',
    'Get help with Spinr. Find answers to frequently asked questions about rides, driver earnings, and more.',
    'spinr support, help, faq, customer service',
    0.8,
    'weekly',
    NULL,
    '{"@context": "https://schema.org", "@type": "FAQPage"}'::jsonb
  )
ON CONFLICT (path) DO NOTHING;

-- =====================================================
-- 5. INSERT STARTER DATA (Optional - for testing)
-- =====================================================
-- Insert some starter FAQs
INSERT INTO public.faqs (id, question, answer, category, tags) VALUES
  (
    gen_random_uuid()::text,
    'What is Spinr?',
    'Spinr is Saskatchewan''s own rideshare platform. We offer 0% commission for drivers and a flat $1 fee for riders - making ridesharing fair for everyone.',
    'general',
    ARRAY['about', 'getting-started']
  ),
  (
    gen_random_uuid()::text,
    'Where is Spinr available?',
    'Spinr is currently available in Regina and Saskatoon, Saskatchewan. We plan to expand to more communities soon.',
    'general',
    ARRAY['locations', 'availability']
  ),
  (
    gen_random_uuid()::text,
    'How much does a ride cost?',
    'You pay the driver''s rate plus a flat $1 platform fee. There''s no surge pricing - the price you see is the price you pay.',
    'rider',
    ARRAY['pricing', 'costs']
  ),
  (
    gen_random_uuid()::text,
    'How does 0% commission work?',
    'When a rider pays for a trip, you keep 100% of the fare. We make money through the flat $1 fee charged to riders, not by taking from your earnings.',
    'driver',
    ARRAY['earnings', 'commission']
  )
ON CONFLICT (id) DO NOTHING;

-- Insert starter legal docs
INSERT INTO public.legal_docs (slug, title, content_html) VALUES
  (
    'terms',
    'Terms of Service',
    '<h2>1. Introduction</h2><p>Welcome to Spinr. These Terms of Service govern your use of the Spinr platform.</p><h2>2. Service Description</h2><p>Spinr is a rideshare platform connecting riders with independent drivers in Saskatchewan.</p><h2>3. Pricing</h2><p>Riders pay the driver''s fare plus a flat $1 platform fee. Drivers keep 100% of fares.</p>'
  ),
  (
    'privacy',
    'Privacy Policy',
    '<h2>1. Information We Collect</h2><p>We collect information you provide including account information, payment details, and location data.</p><h2>2. How We Use Information</h2><p>We use your information to facilitate rides, process payments, and improve our services.</p>'
  ),
  (
    'driver-agreement',
    'Driver Agreement',
    '<h2>1. Independent Contractor Status</h2><p>Drivers are independent contractors, not employees of Spinr.</p><h2>2. Commission Structure</h2><p>Spinr charges 0% commission. You keep 100% of fares.</p>'
  )
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
-- If you see this message, all tables were created successfully!
SELECT 'Database schema created successfully! ✅' as status;

-- =====================================================
-- NEXT STEPS:
-- =====================================================
-- 1. Create an admin user in Supabase Auth:
--    - Go to Authentication → Users → Add User
--    - Email: admin@spinr.ca (or your preferred email)
--    - Password: (choose a secure password)
--    - Click "Create User"
--
-- 2. Update the admin email in the code if needed:
--    - File: app/spinr-internal/layout.js
--    - Line 12: const SUPER_ADMIN_EMAIL = 'admin@spinr.ca'
--    - Change to your actual admin email
--
-- 3. Test the CMS:
--    - Login to /spinr-internal/login with your admin credentials
--    - Create/edit FAQs and Legal Docs
--    - Verify they appear on the public pages
-- =====================================================
