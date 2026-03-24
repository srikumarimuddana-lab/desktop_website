-- Insert SEO entry for the Help Center
INSERT INTO public.seo_pages (path, title, description, keywords, sitemap_priority, sitemap_frequency, no_index)
VALUES (
  '/help',
  'Spinr Help Center',
  'Get help with Spinr. Find answers to common questions about riding and driving. Local Saskatchewan support team.',
  'Spinr help, Spinr support, rideshare FAQ, contact Spinr, Saskatchewan rideshare help',
  0.8,
  'weekly',
  false
)
ON CONFLICT (path) DO UPDATE SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords;
