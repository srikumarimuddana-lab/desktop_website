-- =====================================================
-- SPINR KNOWLEDGE BASE - MASTER SEED FILE
-- =====================================================
-- Run this file to populate the entire knowledge base
-- Or run individual files (01-10) for specific categories
--
-- PREREQUISITES:
--   1. The knowledge_base table must exist (see plans/ai-search-agent-plan.md)
--   2. pgvector extension must be enabled
--
-- AFTER RUNNING:
--   Run: node scripts/generate-embeddings.js
--   This generates vector embeddings for RAG search
--
-- TOTAL ENTRIES: ~155 knowledge base entries across 10 categories
-- =====================================================

-- Clear ALL existing website_analysis entries to avoid duplicates
DELETE FROM public.knowledge_base WHERE source = 'website_analysis';

-- =====================================================
-- FILE INDEX:
-- =====================================================
-- 01_general_info.sql          - Company info, service areas, contact, competitors (~20 entries)
-- 02_rider_getting_started.sql - Rider onboarding, booking, pricing (~20 entries)
-- 03_rider_payments_cancel.sql - Payments, tipping, promos, cancellation, refunds (~20 entries)
-- 04_rider_safety_access.sql   - Safety, accessibility, pets, behavior policies (~20 entries)
-- 05_driver_getting_started.sql- Driver onboarding, requirements, documents (~18 entries)
-- 06_driver_earnings_subs.sql  - Earnings, subscriptions, payouts, tips, bonuses (~18 entries)
-- 07_driver_tax_operations.sql - Tax, ratings, deactivation, operations (~16 entries)
-- 08_account_management.sql    - Account, profile, deletion, privacy (~12 entries)
-- 09_app_troubleshooting.sql   - App features, GPS, crashes, common issues (~11 entries)
-- 10_policies_legal_seasonal.sql - Terms, guidelines, winter, events (~16 entries)
-- =====================================================

-- NOTE: Since Supabase SQL Editor does not support \i (include),
-- you must run each file individually in order (01 through 10),
-- OR copy-paste all contents into one query.
-- The individual files can be run independently without this master file.

SELECT 'Master seed: Cleared existing entries. Now run files 01-10 in order.' as status;
