-- =====================================================
-- UPDATE LEGAL PAGES - RIDER & DRIVER SPECIFIC
-- =====================================================
-- Run this script in your Supabase SQL Editor

-- 1. Insert Metadata for New Pages
INSERT INTO public.seo_pages (path, title, description, keywords, sitemap_priority, sitemap_frequency, structured_data) VALUES
  (
    '/legal/rider-terms',
    'Rider Terms of Service | Spinr',
    'Terms and conditions for riders using the Spinr platform.',
    'rider terms, spinr terms, legal',
    0.5,
    'monthly',
    '{"@context": "https://schema.org", "@type": "WebPage", "name": "Rider Terms of Service"}'::jsonb
  ),
  (
    '/legal/driver-terms',
    'Driver Terms of Service | Spinr',
    'Terms and conditions for drivers using the Spinr platform.',
    'driver terms, spinr driver agreement, legal',
    0.5,
    'monthly',
    '{"@context": "https://schema.org", "@type": "WebPage", "name": "Driver Terms of Service"}'::jsonb
  ),
  (
    '/legal/rider-policy',
    'Rider Privacy Policy | Spinr',
    'Privacy policy for riders using the Spinr platform.',
    'rider privacy, data protection, spinr',
    0.5,
    'monthly',
    '{"@context": "https://schema.org", "@type": "WebPage", "name": "Rider Privacy Policy"}'::jsonb
  ),
  (
    '/legal/driver-policy',
    'Driver Privacy Policy | Spinr',
    'Privacy policy for drivers using the Spinr platform.',
    'driver privacy, data protection, spinr',
    0.5,
    'monthly',
    '{"@context": "https://schema.org", "@type": "WebPage", "name": "Driver Privacy Policy"}'::jsonb
  )
ON CONFLICT (path) DO NOTHING;

-- 2. Insert Default Content for New Legal Docs
INSERT INTO public.legal_docs (slug, title, content_html) VALUES
  (
    'rider-terms',
    'Rider Terms of Service',
    '<h2>1. Introduction</h2><p>These terms govern your use of Spinr as a rider.</p><h2>2. Booking and Payments</h2><p>Riders agree to pay the fare shown plus the platform fee.</p>'
  ),
  (
    'driver-terms',
    'Driver Terms of Service',
    '<h2>1. Driver Obligations</h2><p>Drivers must maintain a valid license and insurance.</p><h2>2. Earnings</h2><p>Drivers keep 100% of the fare.</p>'
  ),
  (
    'rider-policy',
    'Rider Privacy Policy',
    '<h2>1. Rider Data Collection</h2><p>We collect location and payment data to facilitate rides.</p>'
  ),
  (
    'driver-policy',
    'Driver Privacy Policy',
    '<h2>1. Driver Data Collection</h2><p>We collect license, vehicle, and payout information.</p>'
  )
ON CONFLICT (slug) DO NOTHING;

SELECT 'Legal pages updated successfully! ✅' as status;
