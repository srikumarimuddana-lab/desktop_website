import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { getEmbeddings } from '@/lib/langchain'

/**
 * Perform hybrid search (BM25 keyword + vector semantic) via Supabase RPC.
 * Returns top results ranked by Reciprocal Rank Fusion.
 *
 * @param {string} question - The user's search query
 * @param {number} topK - Number of results to return (default: 3)
 * @returns {Array<{id, title, content, category, tags, similarity, combined_score}>}
 */
export async function hybridRetrieve(question, topK = 3) {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured — hybrid search unavailable')
    return []
  }

  let queryEmbedding
  try {
    console.log('[Hybrid] Generating embedding for:', question)
    queryEmbedding = await getEmbeddings().embedQuery(question)
    console.log('[Hybrid] Embedding generated, dimension:', queryEmbedding?.length)
  } catch (err) {
    console.error('[Hybrid] Embedding generation failed:', err.message, err.stack)
    return []
  }

  const { data, error } = await supabase.rpc('hybrid_search', {
    query_text: question,
    query_embedding: queryEmbedding,
    match_count: topK,
    full_text_weight: 1.0,
    semantic_weight: 1.0,
    rrf_k: 60
  })

  if (error) {
    console.error('[Hybrid] RPC error:', JSON.stringify(error))
    return []
  }

  console.log('[Hybrid] Results:', data?.length, 'entries')
  return data || []
}
