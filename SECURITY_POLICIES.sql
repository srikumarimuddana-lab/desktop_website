-- SECURITY POLICIES FOR SUPABASE
-- Run this in the Supabase SQL Editor to secure your tables

-- 1. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_pages ENABLE ROW LEVEL SECURITY;

-- 2. FAQs Policies
-- Allow anyone to read FAQs (public)
CREATE POLICY "Enable read access for all users" ON public.faqs
FOR SELECT USING (true);

-- Allow only authenticated users (admins) to insert, update, or delete
CREATE POLICY "Enable insert for authenticated users only" ON public.faqs
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON public.faqs
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON public.faqs
FOR DELETE USING (auth.role() = 'authenticated');

-- 3. Legal Docs Policies
-- Allow anyone to read legal docs (public)
CREATE POLICY "Enable read access for all users" ON public.legal_docs
FOR SELECT USING (true);

-- Allow only authenticated users to modify
CREATE POLICY "Enable modification for authenticated users only" ON public.legal_docs
FOR ALL USING (auth.role() = 'authenticated');

-- 4. SEO Pages Policies
-- Allow anyone to read SEO pages (public/server)
CREATE POLICY "Enable read access for all users" ON public.seo_pages
FOR SELECT USING (true);

-- Allow only authenticated users to modify
CREATE POLICY "Enable modification for authenticated users only" ON public.seo_pages
FOR ALL USING (auth.role() = 'authenticated');
