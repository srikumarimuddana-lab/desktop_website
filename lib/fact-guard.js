/**
 * Pure fact-comparison used to police the polish stage (lib/polish.js).
 *
 * Kept free of framework imports so it can be exercised directly by tests —
 * a guard tested against a copy of its own regex is not tested at all.
 */

/* Money, percentages, decimals, multi-digit numbers, emails, URLs. Bare
 * single digits are deliberately excluded: they are list numbering ("1.",
 * "2.") far more often than they are facts, and guarding them made the
 * check reject every honest rewrite. */
const FACT_RE = /(\$\s?\d[\d.,]*|\b\d[\d.,]*\s?%|\b\d+\.\d+\b|\b\d{2,}\b|[\w.+-]+@[\w.-]+\.\w+|https?:\/\/\S+)/gi

/** Trailing punctuation is not part of the fact: "$1.00," and "$1.00" are
 *  the same number, and treating them as different made the guard fire on
 *  any rewrite that merely moved a comma. */
function normalise(token) {
  return String(token).toLowerCase().replace(/\s+/g, '').replace(/[.,;:]+$/, '')
}

export function factTokens(text) {
  return new Set((String(text).match(FACT_RE) || []).map(normalise))
}

/**
 * Is `candidate` faithful to `draft`?
 * @returns {{ok: boolean, invented: string[], dropped: string[]}}
 */
export function checkFaithful(draft, candidate) {
  const before = factTokens(draft)
  const after = factTokens(candidate)
  const invented = [...after].filter((t) => !before.has(t))
  const dropped = [...before].filter((t) => !after.has(t))
  return { ok: invented.length === 0 && dropped.length === 0, invented, dropped }
}
