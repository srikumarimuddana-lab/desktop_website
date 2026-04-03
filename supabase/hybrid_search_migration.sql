-- =====================================================
-- HYBRID SEARCH MIGRATION
-- Adds full-text search column + hybrid_search RPC
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Add full-text search column (auto-generated from title + content)
ALTER TABLE public.knowledge_base
ADD COLUMN IF NOT EXISTS fts tsvector
GENERATED ALWAYS AS (
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, ''))
) STORED;

-- 2. Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS idx_knowledge_base_fts
ON public.knowledge_base USING gin(fts);

-- 3. Create hybrid_search RPC function
-- Combines BM25 full-text search + pgvector cosine similarity
-- using Reciprocal Rank Fusion (RRF) for score merging
CREATE OR REPLACE FUNCTION hybrid_search(
  query_text TEXT,
  query_embedding vector(1024),
  match_count INT DEFAULT 5,
  full_text_weight FLOAT DEFAULT 1.0,
  semantic_weight FLOAT DEFAULT 1.0,
  rrf_k INT DEFAULT 60
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  category TEXT,
  tags TEXT[],
  similarity FLOAT,
  combined_score FLOAT
)
LANGUAGE sql
AS $$
  WITH full_text AS (
    SELECT
      kb.id,
      ROW_NUMBER() OVER (
        ORDER BY ts_rank(kb.fts, websearch_to_tsquery('english', query_text)) DESC
      ) AS rank
    FROM public.knowledge_base kb
    WHERE kb.is_active = true
      AND kb.fts @@ websearch_to_tsquery('english', query_text)
    ORDER BY rank
    LIMIT match_count * 2
  ),
  semantic AS (
    SELECT
      kb.id,
      ROW_NUMBER() OVER (
        ORDER BY kb.embedding <=> query_embedding
      ) AS rank
    FROM public.knowledge_base kb
    WHERE kb.is_active = true
      AND kb.embedding IS NOT NULL
    ORDER BY kb.embedding <=> query_embedding
    LIMIT match_count * 2
  ),
  combined AS (
    SELECT
      COALESCE(ft.id, sm.id) AS id,
      COALESCE(1.0 / (rrf_k + ft.rank), 0.0) * full_text_weight +
      COALESCE(1.0 / (rrf_k + sm.rank), 0.0) * semantic_weight AS score
    FROM full_text ft
    FULL OUTER JOIN semantic sm ON ft.id = sm.id
  )
  SELECT
    kb.id,
    kb.title,
    kb.content,
    kb.category,
    kb.tags,
    1 - (kb.embedding <=> query_embedding) AS similarity,
    c.score AS combined_score
  FROM combined c
  JOIN public.knowledge_base kb ON kb.id = c.id
  ORDER BY c.score DESC
  LIMIT match_count;
$$;

-- 4. Grant permissions
GRANT EXECUTE ON FUNCTION hybrid_search TO anon;
GRANT EXECUTE ON FUNCTION hybrid_search TO authenticated;

-- 5. Verify
SELECT 'hybrid_search migration complete' AS status;
