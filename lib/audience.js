/**
 * Audience routing for retrieval.
 *
 * A rider asking "how do payments work" and a driver asking the same words
 * want different documents. The knowledge_base already carries a `category`
 * on every row — the seed and the CMS sync both write one — so audience can
 * be honoured at retrieval time without a schema change:
 *
 *   rider (20 rows) | driver (11) | general (15) | safety (5) | pricing
 *
 * Own-audience rows are boosted, shared rows pass through, and the other
 * audience's rows are demoted rather than dropped — a rider genuinely does
 * sometimes ask how driver pay works, and that answer should still be
 * reachable, just outranked by rider-facing material.
 */

const SHARED = ['general', 'safety', 'pricing', 'about', 'company']

export const AUDIENCE_WEIGHTS = {
  own: 1.4,
  shared: 1.0,
  other: 0.4,
}

/** Which bucket a KB row falls into for this audience. */
export function affinity(entry, audience) {
  const cat = String(entry?.category || 'general').toLowerCase()
  const tags = (entry?.tags || []).map((t) => String(t).toLowerCase())
  const isRider = cat === 'rider' || tags.includes('rider')
  const isDriver = cat === 'driver' || tags.includes('driver')

  if (audience === 'rider') {
    if (isRider) return 'own'
    if (isDriver) return 'other'
  } else if (audience === 'driver') {
    if (isDriver) return 'own'
    if (isRider) return 'other'
  }
  if (SHARED.includes(cat)) return 'shared'
  // anonymous, or an unrecognised category: no opinion
  return 'shared'
}

/**
 * Re-rank hybrid-search results for an audience.
 * Returns the same shape plus `_affinity` and `_score` for logging.
 */
export function rerankForAudience(entries, audience, topK) {
  if (!Array.isArray(entries) || entries.length === 0) return []
  if (audience !== 'rider' && audience !== 'driver') return entries.slice(0, topK)

  return entries
    .map((e) => {
      const aff = affinity(e, audience)
      // combined_score comes from the RRF in the hybrid_search RPC
      const base = typeof e.combined_score === 'number' ? e.combined_score : 0
      return { ...e, _affinity: aff, _score: base * AUDIENCE_WEIGHTS[aff] }
    })
    .sort((a, b) => b._score - a._score)
    .slice(0, topK)
}

/**
 * A short line telling the model who it is answering, folded into the
 * context so audience survives even when retrieval returns shared rows.
 */
export function audienceNote(audience) {
  if (audience === 'driver') {
    return 'The person asking is a DRIVER. Answer from the driver\'s side: earnings, payouts, requirements, the driver app. Do not explain rider billing unless they ask.'
  }
  if (audience === 'rider') {
    return 'The person asking is a RIDER. Answer from the rider\'s side: booking, fares, receipts, safety. Do not explain driver payouts unless they ask.'
  }
  return ''
}
