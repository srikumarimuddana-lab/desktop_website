-- 1. First, we need to drop the existing function so we can modify its signature
DROP FUNCTION IF EXISTS search_knowledge_base(vector, integer, double precision);
DROP FUNCTION IF EXISTS search_knowledge_base(vector(1536), integer, double precision);

-- 2. Alter the existing knowledge_base table to use 1024 dimensions instead of 1536
ALTER TABLE public.knowledge_base 
ALTER COLUMN embedding TYPE vector(1024);

-- 3. Re-create the vector search function with the correct 1024 dimension for text-embedding-v4
CREATE OR REPLACE FUNCTION search_knowledge_base(
  query_embedding vector(1024),
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

-- Grant permissions again
GRANT EXECUTE ON FUNCTION search_knowledge_base TO anon;
GRANT EXECUTE ON FUNCTION search_knowledge_base TO authenticated;
