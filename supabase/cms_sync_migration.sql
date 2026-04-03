-- =====================================================
-- CMS SYNC MIGRATION
-- Adds source_id column to knowledge_base for linking
-- CMS records (FAQs, help articles) to KB entries
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Add source_id column for matching CMS records to KB entries
ALTER TABLE public.knowledge_base
ADD COLUMN IF NOT EXISTS source_id TEXT;

-- 2. Create composite index for fast lookups by source + source_id
CREATE INDEX IF NOT EXISTS idx_kb_source_id
ON public.knowledge_base(source, source_id);

-- 3. Verify
SELECT 'cms_sync migration complete' AS status;
