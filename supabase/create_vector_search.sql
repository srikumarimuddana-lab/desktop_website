-- =====================================================
-- 5. CREATE RPC FUNCTION FOR VECTOR SEARCH
-- =====================================================
-- This function performs vector similarity search using pgvector
-- It's called from the JavaScript code via supabase.rpc()
CREATE OR REPLACE FUNCTION search_knowledge_base(
  query_embedding vector(1536),
  match_count INT DEFAULT 5,
  similarity_threshold FLOAT DEFAULT 0.7
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  category TEXT,
  tags TEXT[],
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kb.id,
    kb.title,
    kb.content,
    kb.category,
    kb.tags,
    1 - (kb.embedding <=> query_embedding) AS similarity
  FROM public.knowledge_base kb
  WHERE kb.is_active = true
    AND kb.embedding IS NOT NULL
    AND 1 - (kb.embedding <=> query_embedding) > similarity_threshold
  ORDER BY kb.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Grant execute permission to anon and authenticated users
GRANT EXECUTE ON FUNCTION search_knowledge_base TO anon;
GRANT EXECUTE ON FUNCTION search_knowledge_base TO authenticated;
