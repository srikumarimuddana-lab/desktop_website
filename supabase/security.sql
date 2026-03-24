-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.help_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_pages ENABLE ROW LEVEL SECURITY;

-- 1. Policies for Help Articles
-- Allow public read access (anyone can view help articles)
CREATE POLICY "Enable read access for all users" ON public.help_articles
FOR SELECT USING (true);

-- Allow write access ONLY for the super admin
CREATE POLICY "Enable write access for super admin" ON public.help_articles
FOR ALL USING ((auth.jwt() ->> 'email') = 'admin@spinr.ca');

-- 2. Policies for FAQs
CREATE POLICY "Enable read access for all users" ON public.faqs
FOR SELECT USING (true);

CREATE POLICY "Enable write access for super admin" ON public.faqs
FOR ALL USING ((auth.jwt() ->> 'email') = 'admin@spinr.ca');

-- 3. Policies for Legal Docs
CREATE POLICY "Enable read access for all users" ON public.legal_docs
FOR SELECT USING (true);

CREATE POLICY "Enable write access for super admin" ON public.legal_docs
FOR ALL USING ((auth.jwt() ->> 'email') = 'admin@spinr.ca');

-- 4. Policies for SEO Pages
CREATE POLICY "Enable read access for all users" ON public.seo_pages
FOR SELECT USING (true);

CREATE POLICY "Enable write access for super admin" ON public.seo_pages
FOR ALL USING ((auth.jwt() ->> 'email') = 'admin@spinr.ca');

-- Check if policies exist before creating (to avoid errors on re-run)
-- Note: The above commands will fail if policy already exists. 
-- For a robust script you would drop first:
-- DROP POLICY IF EXISTS "Enable read access for all users" ON public.help_articles;
-- DROP POLICY IF EXISTS "Enable write access for super admin" ON public.help_articles;
