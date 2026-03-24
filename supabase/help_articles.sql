-- ============================================================================
-- HELP ARTICLES TABLE
-- Run this SQL in your Supabase SQL Editor to create the help_articles table
-- ============================================================================

-- Drop table if exists (for fresh setup)
-- DROP TABLE IF EXISTS help_articles;

-- Create help_articles table
CREATE TABLE IF NOT EXISTS help_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category_id TEXT NOT NULL,
  category_title TEXT NOT NULL,
  content TEXT,
  is_popular BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster slug lookups
CREATE INDEX IF NOT EXISTS idx_help_articles_slug ON help_articles(slug);
CREATE INDEX IF NOT EXISTS idx_help_articles_category ON help_articles(category_id);

-- Enable Row Level Security
ALTER TABLE help_articles ENABLE ROW LEVEL SECURITY;

-- Policy: Public read access (anyone can view help articles)
CREATE POLICY "Public read access for help_articles" 
  ON help_articles 
  FOR SELECT 
  USING (true);

-- Policy: Admin write access (only admin@spinr.ca can modify)
CREATE POLICY "Admin write access for help_articles" 
  ON help_articles 
  FOR ALL 
  USING (auth.email() = 'admin@spinr.ca')
  WITH CHECK (auth.email() = 'admin@spinr.ca');

-- Seed with initial demo articles (optional)
-- INSERT INTO help_articles (slug, title, category_id, category_title, content, is_popular, order_index) VALUES
-- ('how-to-request-ride', 'How to request a ride', 'riding', 'Riding with Spinr', '<h2>Requesting a ride with Spinr</h2><p>Getting a ride with Spinr is quick and easy...</p>', true, 1);

-- ============================================================================
-- VERIFY
-- ============================================================================
-- SELECT * FROM help_articles;
