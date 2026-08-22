/**
 * Optional second pass: a light model rewrites the grounded draft so it
 * reads like a person wrote it.
 *
 * The whole value of the RAG stage is that the answer is bounded by
 * retrieved context. A second model that is allowed to "improve" prose can
 * quietly reintroduce invention, so this stage is treated as untrusted:
 * the polished text is ACCEPTED ONLY IF it introduces no new fact-shaped
 * token (number, money amount, percentage, email, URL) and does not balloon
 * in length. Anything else falls back to the draft, silently and safely.
 */

import { getPolishLLM } from '@/lib/langchain'
import { checkFaithful } from '@/lib/fact-guard'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'

const SYSTEM = `You rewrite customer-support answers for a rideshare app so they read naturally.

ABSOLUTE RULES:
- Do NOT add any fact, number, price, percentage, email address, URL, policy or capability that is not already in the draft.
- Do NOT remove any number, price, email address or condition from the draft.
- Do NOT answer the question yourself. You are only rewriting the draft you are given.
- Keep it the same length or shorter. Two short paragraphs maximum.
- Warm, plain, direct. No marketing language, no exclamation marks, no emoji.
- Reply with the rewritten answer only — no preamble, no quotes around it.`

/**
 * @returns {{text: string, polished: boolean, reason: string}}
 */
export async function polishAnswer(draft, { question, audience } = {}) {
  const llm = getPolishLLM()
  if (!llm) return { text: draft, polished: false, reason: 'disabled' }
  if (!draft || draft.length < 40) return { text: draft, polished: false, reason: 'too_short_to_bother' }

  let out
  try {
    const res = await llm.invoke([
      new SystemMessage(SYSTEM),
      new HumanMessage(
        `Audience: ${audience || 'anonymous'}\nQuestion: ${question || ''}\n\nDraft answer to rewrite:\n${draft}`
      ),
    ])
    out = typeof res?.content === 'string' ? res.content.trim() : ''
  } catch (e) {
    console.error('[Polish] model call failed:', e.message)
    return { text: draft, polished: false, reason: 'error' }
  }

  if (!out) return { text: draft, polished: false, reason: 'empty' }
  if (out.length > draft.length * 1.5) return { text: draft, polished: false, reason: 'too_long' }

  const faithful = checkFaithful(draft, out)
  if (faithful.invented.length) {
    console.warn('[Polish] rejected — introduced facts:', faithful.invented.join(', '))
    return { text: draft, polished: false, reason: 'introduced_facts' }
  }
  if (faithful.dropped.length) {
    console.warn('[Polish] rejected — dropped facts:', faithful.dropped.join(', '))
    return { text: draft, polished: false, reason: 'dropped_facts' }
  }

  return { text: out, polished: true, reason: 'ok' }
}
