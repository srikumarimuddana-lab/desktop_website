import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { getEmbeddings } from '@/lib/langchain'
import { rerankForAudience } from '@/lib/audience'

/**
 * Perform hybrid search (BM25 keyword + vector semantic) via Supabase RPC.
 * Returns top results ranked by Reciprocal Rank Fusion.
 *
 * @param {string} question - The user's search query
 * @param {number} topK - Number of results to return (default: 3)
 * @returns {Array<{id, title, content, category, tags, similarity, combined_score}>}
 */
const MIN_SIMILARITY = 0.3

export async function hybridRetrieve(question, topK = 3, opts = {}) {
  const audience = opts.audience
  // Ask for a wider pool than we need when an audience is in play, so the
  // re-rank has rider/driver material to choose between rather than just
  // reordering whatever the first three happened to be.
  const poolSize = audience === 'rider' || audience === 'driver'
    ? Math.max(topK * 4, 12)
    : topK
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
    match_count: poolSize,
    full_text_weight: 1.0,
    semantic_weight: 1.0,
    rrf_k: 60
  })

  if (error) {
    console.error('[Hybrid] RPC error:', JSON.stringify(error))
    return []
  }

  const relevant = (data || []).filter((r) => (r.similarity || 0) >= MIN_SIMILARITY)
  const ranked = rerankForAudience(relevant, audience, topK)
  console.log(
    '[Hybrid] pool:', data?.length, '-> above threshold:', relevant.length,
    '-> top', ranked.length,
    audience ? `for ${audience}` : '(no audience)',
    ranked.map((r) => `${r.title}[sim=${(r.similarity || 0).toFixed(2)},${r._affinity || '-'}]`).join(' | ')
  )
  return ranked
}
