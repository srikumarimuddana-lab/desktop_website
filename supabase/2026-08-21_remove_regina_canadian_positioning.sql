-- =====================================================================
-- Spinr website — remove Regina, reposition as Canadian owned
-- Live-data patch for the WEBSITE Supabase project
-- Project ref: cfrazforbupizntxvvtp  (NOT the mobile-app project)
--
-- Companion to branch: claude/remove-regina-update-faq-k94mmm
-- The branch changed the repo's seed/fallback files only. This script
-- brings the already-deployed rows in line with it.
--
-- HOW TO RUN
--   Supabase Dashboard -> SQL Editor -> paste -> Run.
--   Every statement is idempotent: re-running it changes nothing further.
--   Run SECTION 0 first and read the output before running anything else.
--
-- ⚠ READ SECTION 5 BEFORE YOU RUN THIS. Updating knowledge_base.content
--   does NOT regenerate that row's embedding. Details and the fix are there.
-- =====================================================================


-- =====================================================================
-- SECTION 0 — PRE-FLIGHT AUDIT (read-only, changes nothing)
-- Run this alone first. It shows every row this script will touch,
-- plus any row it will NOT touch that still mentions Regina.
-- =====================================================================

-- 0a. Website rows still carrying Regina / Saskatchewan-owned copy
SELECT 'knowledge_base' AS tbl, id::text, title, left(content, 160) AS preview, source, is_active
FROM public.knowledge_base
WHERE content ILIKE '%regina%' OR title ILIKE '%regina%'
   OR content ILIKE '%mosaic%' OR content ILIKE '%roughrider%'
   OR content ILIKE '%saskatchewan owned%'
UNION ALL
SELECT 'faqs', id::text, question, left(answer, 160), NULL, NULL
FROM public.faqs
WHERE question ILIKE '%regina%' OR answer ILIKE '%regina%'
   OR answer ILIKE '%saskatchewan%own%'
UNION ALL
SELECT 'help_articles', id::text, title, left(content, 160), NULL, NULL
FROM public.help_articles
WHERE title ILIKE '%regina%' OR content ILIKE '%regina%'
UNION ALL
SELECT 'seo_pages', path, title, coalesce(description,'') || ' | ' || coalesce(keywords,''), NULL, NULL
FROM public.seo_pages
WHERE description ILIKE '%regina%' OR keywords ILIKE '%regina%' OR title ILIKE '%regina%'
   OR structured_data::text ILIKE '%regina%'
ORDER BY 1, 3;

-- 0b. CMS-synced KB rows mentioning Regina.
--     DO NOT fix these with SQL — see SECTION 5, note (b).
SELECT id, source, source_id, title, left(content, 160) AS preview
FROM public.knowledge_base
WHERE source IN ('cms_faq', 'cms_article')
  AND (content ILIKE '%regina%' OR title ILIKE '%regina%');


-- =====================================================================
-- SECTION 1 — faqs  (public FAQ list)
-- =====================================================================

BEGIN;

-- 1a. "Where is Spinr available?" — drop Regina
UPDATE public.faqs
SET answer = 'Spinr is currently available in Saskatoon, Saskatchewan. We plan to expand to more communities soon.'
WHERE answer ILIKE '%Regina and Saskatoon%';

-- 1b. "What is Spinr?" — Saskatchewan's own -> Canada's own
UPDATE public.faqs
SET answer = 'Spinr is Canada''s own rideshare platform, 100% Canadian owned and operated. We offer 0% commission for drivers and a flat $1 fee for riders - making ridesharing fair for everyone.'
WHERE answer ILIKE '%Saskatchewan''s own rideshare platform%';

-- 1c. Catch-all safety net: any remaining FAQ answer promising a Regina launch.
--     Review the SECTION 0 output before trusting this to be a no-op.
UPDATE public.faqs
SET answer = replace(replace(replace(answer,
      ' Regina is launching soon but is NOT yet available.', ''),
      ' Regina (launching soon),', ' Regina,'),
      'Regina and Saskatoon', 'Saskatoon')
WHERE answer ILIKE '%regina%launching%'
   OR answer ILIKE '%Regina and Saskatoon%';

COMMIT;


-- =====================================================================
-- SECTION 2 — knowledge_base  (AI support agent)
-- Seed rows only (source = 'website_analysis').
-- Content below is byte-identical to supabase/knowledge_base_seed.sql
-- on branch claude/remove-regina-update-faq-k94mmm.
-- =====================================================================

BEGIN;

-- 1. Core identity: Saskatchewan owned -> Canadian owned; drop Regina launch.
UPDATE public.knowledge_base
SET content = 'Spinr is Canada''s own rideshare platform, currently available ONLY in Saskatoon, Saskatchewan. We are 100% Canadian owned and operated. Our core differentiator is that drivers keep 100% of net fare (0% commission forever), and riders pay just a flat $1 platform fee per trip. There is no surge pricing and no hidden charges. We have no announced launch dates for any other city.',
    tags    = ARRAY['about', 'company', 'introduction', 'what is spinr']
WHERE source = 'website_analysis'
  AND title  = 'What is Spinr';

-- 2. Service availability: drop '(launching soon)' after Regina.
UPDATE public.knowledge_base
SET content = 'IMPORTANT: Spinr is currently ONLY available in Saskatoon, Saskatchewan. This is the ONLY city where Spinr rideshare services are operational. Spinr is NOT available in Regina, Yorkton, Moose Jaw, Prince Albert, Swift Current, North Battleford, Estevan, Weyburn, Lloydminster, Melfort, Humboldt, or ANY other Saskatchewan city. If you are not in Saskatoon, you cannot use Spinr at this time.',
    tags    = ARRAY['location', 'cities', 'availability', 'where', 'service area', 'operate']
WHERE source = 'website_analysis'
  AND title  = 'Where Spinr Operates - Service Availability';

-- 3. Contact: remove the 'headquartered in Regina' claim.
UPDATE public.knowledge_base
SET content = 'You can reach Spinr support at support@spinr.ca. Spinr is a Canadian owned and operated company, and rideshare service is currently available only in Saskatoon, Saskatchewan. For immediate assistance, use the in-app chat or email us.',
    tags    = ARRAY['contact', 'support', 'email', 'help', 'phone', 'reach']
WHERE source = 'website_analysis'
  AND title  = 'Spinr Contact Information';

-- 4. Regina Q&A: plain hard negative, no launch promise, no HQ claim.
UPDATE public.knowledge_base
SET content = 'NO, Spinr is absolutely NOT available in Regina, Saskatchewan. Spinr is currently ONLY operational in Saskatoon. We do NOT offer any rideshare services in Regina and there is no planned Regina launch. You cannot book a ride in Regina.',
    tags    = ARRAY['regina', 'availability', 'city', 'available']
WHERE source = 'website_analysis'
  AND title  = 'Is Spinr Available in Regina';

-- 5. Not-served list: drop '(launching soon)'.
UPDATE public.knowledge_base
SET content = 'Spinr is only available in Saskatoon. It is NOT available in any other city in Saskatchewan or Canada. This includes but is not limited to: Regina, Yorkton, Moose Jaw, Prince Albert, Swift Current, North Battleford, Estevan, Weyburn, Lloydminster, Melfort, Humboldt, Martensville, Warman, and all other cities and towns. Only Saskatoon residents can currently use Spinr.',
    tags    = ARRAY['cities', 'availability', 'locations', 'where', 'not available', 'other cities']
WHERE source = 'website_analysis'
  AND title  = 'Spinr is NOT Available Outside Saskatoon';

-- 6. City list: remove 'Regina is expected to launch soon'.
UPDATE public.knowledge_base
SET content = 'Spinr is currently ONLY available in one city: Saskatoon, Saskatchewan. No other cities are currently supported and no other launches are planned. All other Saskatchewan cities (Regina, Yorkton, Moose Jaw, Prince Albert, Swift Current, etc.) are NOT available.',
    tags    = ARRAY['cities', 'availability', 'locations', 'where', 'which cities', 'list']
WHERE source = 'website_analysis'
  AND title  = 'Which Cities is Spinr Available In';

-- 7. Uber/Lyft comparison: Canadian owned.
UPDATE public.knowledge_base
SET content = 'Spinr differs from other rideshare services like Uber and Lyft in several key ways: 1) 0% commission for drivers — they keep 100% of the fare (Uber/Lyft take 20-30%). 2) Flat $1 platform fee for riders — no surge pricing ever. 3) 100% Canadian owned and operated — supporting a homegrown business. 4) Local Canadian support team. 5) Community-focused approach. 6) Full SGI compliance for Saskatchewan safety standards. 7) Designed specifically for Saskatchewan conditions including winter.',
    tags    = ARRAY['comparison', 'uber', 'lyft', 'difference', 'better', 'alternative', 'vs']
WHERE source = 'website_analysis'
  AND title  = 'Spinr vs Other Rideshare Services';

-- 8. Why Spinr: Canadian owned; Mosaic/Regina bullet removed.
UPDATE public.knowledge_base
SET content = 'Choose Spinr because: 1) You support a Canadian business — 100% Canadian owned and operated. 2) Drivers earn more with 0% commission. 3) Riders pay less with just a $1 flat fee and no surge pricing. 4) Local customer support that understands Saskatoon. 5) Community-focused approach. 6) Commitment to safety with SGI compliance. 7) All money stays in Canada — supporting the local economy.',
    tags    = ARRAY['why', 'choose', 'benefits', 'advantages', 'local', 'uber', 'lyft']
WHERE source = 'website_analysis'
  AND title  = 'Why Choose Spinr Over Uber or Lyft';

COMMIT;


-- =====================================================================
-- SECTION 3 — knowledge_base DELETE
-- Mosaic Stadium Express was a Regina-only service tied to a launch
-- that is not happening. It has no Saskatoon equivalent, so it is
-- removed rather than rewritten.
--
-- Prefer the soft delete (3a). It is reversible and the AI agent
-- filters on is_active = true, so a deactivated row is invisible to
-- the agent immediately. Use the hard delete (3b) only if you are
-- certain you will never want the row back.
-- =====================================================================

BEGIN;

-- 3a. SOFT DELETE (recommended)
UPDATE public.knowledge_base
SET is_active = false
WHERE source = 'website_analysis'
  AND title  = 'Mosaic Stadium Express Service';

-- 3b. HARD DELETE — leave commented unless you want the row gone for good.
-- DELETE FROM public.knowledge_base
-- WHERE source = 'website_analysis'
--   AND title  = 'Mosaic Stadium Express Service';

COMMIT;


-- =====================================================================
-- SECTION 4 — seo_pages  (meta tags + JSON-LD)
-- =====================================================================

BEGIN;

-- 4a. Home
UPDATE public.seo_pages SET
  title       = 'Spinr - 0% Commission Rideshare in Saskatoon',
  description = 'Canada''s own rideshare platform. Drivers keep 100% of net fare, riders pay just $1. No surge pricing. Now serving Saskatoon.',
  keywords    = 'rideshare Saskatoon, 0% commission, Canadian owned rideshare, Saskatoon rideshare, Spinr, taxi alternative',
  updated_at  = NOW()
WHERE path = '/';

-- 4b. Ride
UPDATE public.seo_pages SET
  description = 'Get rides in Saskatoon for just $1 platform fee. No surge pricing, verified local drivers, fair transparent pricing.',
  keywords    = 'ride Spinr, cheap rides Saskatoon, Saskatoon taxi, Saskatoon rides, no surge pricing',
  updated_at  = NOW()
WHERE path = '/ride';

-- 4c. Drive
UPDATE public.seo_pages SET
  keywords   = 'drive Spinr, rideshare driver Saskatoon, 0% commission driver, Saskatoon driver jobs, Canadian rideshare driver',
  updated_at = NOW()
WHERE path = '/drive';

-- 4d. About
UPDATE public.seo_pages SET
  title       = 'About Spinr - Canada''s Fair Rideshare',
  description = 'Learn about Spinr''s mission to bring fair, transparent ridesharing to Canada. Canadian owned and operated, community-driven.',
  keywords    = 'about Spinr, Canadian rideshare company, local rideshare, fair rideshare',
  updated_at  = NOW()
WHERE path = '/about';

-- 4e. Support
UPDATE public.seo_pages SET
  description = 'Get help with Spinr. Find answers to common questions about riding and driving. Canadian support team, based in Saskatchewan.',
  updated_at  = NOW()
WHERE path = '/support';

-- 4f. JSON-LD: strip Regina from areaServed on every page that has it.
UPDATE public.seo_pages
SET structured_data = jsonb_set(
      structured_data,
      '{areaServed}',
      (SELECT coalesce(jsonb_agg(v), '[]'::jsonb)
       FROM jsonb_array_elements(structured_data->'areaServed') v
       WHERE v::text NOT ILIKE '%regina%')
    ),
    updated_at = NOW()
WHERE jsonb_typeof(structured_data->'areaServed') = 'array'
  AND structured_data->>'areaServed' ILIKE '%regina%';

-- 4g. JSON-LD: ownership description + founding location.
UPDATE public.seo_pages
SET structured_data = replace(
      structured_data::text,
      'Saskatchewan''s own rideshare platform',
      'Canada''s own rideshare platform'
    )::jsonb,
    updated_at = NOW()
WHERE structured_data::text ILIKE '%Saskatchewan''s own rideshare platform%';

UPDATE public.seo_pages
SET structured_data = replace(
      structured_data::text,
      'Saskatchewan''s fair rideshare platform',
      'Canada''s fair rideshare platform'
    )::jsonb,
    updated_at = NOW()
WHERE structured_data::text ILIKE '%Saskatchewan''s fair rideshare platform%';

UPDATE public.seo_pages
SET structured_data = jsonb_set(
      structured_data, '{mainEntity,foundingLocation}', '"Canada"'::jsonb
    ),
    updated_at = NOW()
WHERE structured_data->'mainEntity'->>'foundingLocation' IS NOT NULL;

COMMIT;


-- =====================================================================
-- SECTION 5 — ⚠ EMBEDDINGS: what this script CANNOT do
-- =====================================================================
--
-- (a) SEED ROWS (source = 'website_analysis')
--     knowledge_base.fts is GENERATED ALWAYS, so the keyword/BM25 half of
--     hybrid_search self-heals the moment SECTION 2 commits.
--     knowledge_base.embedding is a plain vector(1024) column and does NOT.
--     After SECTION 2 those 8 rows carry vectors describing their OLD text.
--
--     Failure mode, stated plainly: the corrected TEXT is what gets returned
--     to the user, so the agent will not repeat the Regina claim. What
--     degrades is RETRIEVAL RANKING — a question like "who owns Spinr" may
--     rank the updated row lower than it should, and a question about Regina
--     may still pull the old vector's row (which now returns correct text).
--     This is a quality regression, not a correctness one.
--
--     To fix properly, re-embed those 8 rows with DashScope text-embedding-v4
--     (1024-dim) and write them back. There is no SQL-only way to do it —
--     it needs an API call per row. Ask me for a re-embed script.
--
--     Rows needing re-embedding after this script:
SELECT id, title
FROM public.knowledge_base
WHERE source = 'website_analysis'
  AND title IN (
    'What is Spinr',
    'Where Spinr Operates - Service Availability',
    'Spinr Contact Information',
    'Is Spinr Available in Regina',
    'Spinr is NOT Available Outside Saskatoon',
    'Which Cities is Spinr Available In',
    'Spinr vs Other Rideshare Services',
    'Why Choose Spinr Over Uber or Lyft'
  );

-- (b) CMS-SYNCED ROWS (source = 'cms_faq' / 'cms_article')
--     Do NOT patch these with SQL. Edit the FAQ or help article in
--     /spinr-internal instead: lib/kb-sync.js fires on save and rewrites the
--     KB row AND its embedding together, which keeps the two consistent.
--     Patching the KB row directly here would desync it from its parent
--     FAQ/article, and the next CMS save would overwrite your change anyway.
--     SECTION 0b lists any such rows.


-- =====================================================================
-- SECTION 6 — POST-FLIGHT VERIFICATION
-- Run after everything above. Expect 0 rows from 6a.
-- =====================================================================

-- 6a. Anything still promising a Regina launch or claiming Regina HQ.
--     Plain "NOT available in Regina" hard negatives are intentional and
--     are excluded here — they are what stops the agent inventing a launch.
SELECT 'knowledge_base' AS tbl, id::text AS ref, title, left(content,200) AS preview
FROM public.knowledge_base
WHERE is_active = true
  AND (content ILIKE '%regina%launch%'  OR content ILIKE '%launch%regina%'
    OR content ILIKE '%headquarter%regina%' OR content ILIKE '%regina%headquarter%'
    OR content ILIKE '%mosaic%'          OR content ILIKE '%roughrider%'
    OR content ILIKE '%saskatchewan owned%')
UNION ALL
SELECT 'faqs', id::text, question, left(answer,200)
FROM public.faqs
WHERE answer ILIKE '%regina%launch%' OR answer ILIKE '%Regina and Saskatoon%'
   OR answer ILIKE '%Saskatchewan''s own%'
UNION ALL
SELECT 'seo_pages', path, title, coalesce(description,'') || ' | ' || coalesce(keywords,'')
FROM public.seo_pages
WHERE description ILIKE '%regina%' OR keywords ILIKE '%regina%'
   OR title ILIKE '%regina%' OR structured_data::text ILIKE '%regina%';

-- 6b. Confirm the Mosaic row is gone or deactivated. Expect 0 rows.
SELECT id, title, is_active
FROM public.knowledge_base
WHERE title ILIKE '%mosaic%' AND is_active = true;

-- 6c. Remaining Regina mentions that SHOULD survive (hard negatives).
--     Expect ~4 rows, every one of them saying Spinr is NOT in Regina.
SELECT id, title, left(content,140) AS preview
FROM public.knowledge_base
WHERE content ILIKE '%regina%' AND is_active = true;
