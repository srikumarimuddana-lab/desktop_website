import { NextResponse } from 'next/server'
import { faqSlug } from '@/lib/help-slug'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { getLLM } from '@/lib/langchain'
import { hybridRetrieve } from '@/lib/hybrid-retriever'
import { buildStructuredContext, formatUserMessage } from '@/lib/context-builder'
import { audienceNote } from '@/lib/audience'
import { polishAnswer } from '@/lib/polish'
import { askSpinrAssistant, isSpinrApiConfigured } from '@/lib/spinr-api'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'

// ============================================
// CORS (preserved from original)
// ============================================
function handleCORS(response, request) {
  const allowed = process.env.CORS_ORIGINS?.split(',').map(s => s.trim()) || ['*']
  const ri = request?.headers.get('origin')
  let origin = '*'
  if (allowed.includes('*')) origin = '*'
  else if (ri && allowed.includes(ri)) origin = ri
  else if (allowed.length > 0) origin = allowed[0]
  response.headers.set('Access-Control-Allow-Origin', origin)
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}

// ============================================
// RATE LIMITING (preserved from original)
// ============================================
const rlMap = new Map()
const RL_W = 60000
const RL_MAX = parseInt(process.env.AGENT_RATE_LIMIT || '10')

function checkRL(uid) {
  const n = Date.now()
  let u = rlMap.get(uid) || { c: 0, w: n }
  if (n - u.w > RL_W) { u.c = 0; u.w = n }
  if (u.c >= RL_MAX) return { ok: false, retry: Math.ceil((RL_W - (n - u.w)) / 1000) }
  u.c++; rlMap.set(uid, u); return { ok: true }
}

setInterval(() => {
  const n = Date.now()
  for (const [k, v] of rlMap.entries())
    if (n - v.w > RL_W * 2) rlMap.delete(k)
}, RL_W)

// ============================================
// RESPONSE CACHE (preserved from original)
// ============================================
const responseCache = new Map()
const CACHE_TTL = parseInt(process.env.AGENT_CACHE_TTL || '3600000')

function getCacheKey(q, ut) {
  const n = q.toLowerCase().trim().replace(/\s+/g, ' ')
  return ut + ':' + n
}

function getCachedResponse(q, ut) {
  const k = getCacheKey(q, ut)
  const c = responseCache.get(k)
  if (c && Date.now() - c.timestamp < CACHE_TTL) return c.response
  return null
}

function setCachedResponse(q, ut, r) {
  const k = getCacheKey(q, ut)
  responseCache.set(k, { response: r, timestamp: Date.now() })
  if (responseCache.size > 1000) {
    const oldest = responseCache.keys().next().value
    responseCache.delete(oldest)
  }
}

// ============================================
// INPUT SANITIZATION (preserved from original)
// ============================================
function sanitizeInput(i) {
  if (!i || typeof i !== 'string') return ''
  return i.trim().slice(0, 1000).replace(/[<>]/g, '').replace(/javascript:/gi, '').replace(/on\w+=/gi, '').replace(/\n{3,}/g, '\n\n')
}

// ============================================
// RESPONSE VALIDATION (preserved from original)
// ============================================
function validateResponse(r) {
  if (!r || typeof r !== 'string') {
    return 'I apologize, but I could not generate a response. Please try again or contact support@spinr.ca for assistance.'
  }
  const emails = r.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || []
  const allowed = ['support@spinr.ca', 'help@spinr.ca']
  emails.forEach(e => { if (!allowed.includes(e.toLowerCase())) r = r.replace(e, 'support@spinr.ca') })
  return r
}

// ============================================
// LOCATION GUARD
// ============================================
/*
 * Which cities Spinr serves — an ALLOW-list, not a deny-list.
 *
 * This was a list of 33 Saskatchewan towns, checked with substring matching.
 * Two problems that only got worse as the company looked past one province:
 *
 *  1. Any city NOT enumerated fell straight through. Calgary, Edmonton,
 *     Winnipeg, Vancouver, Toronto — none were listed, so "do you operate in
 *     Calgary?" never triggered the guard and the model answered from
 *     retrieval alone. A deny-list has to be exhaustive to work, and it never
 *     is. An allow-list is right by construction: anything not served is not
 *     served, whether or not somebody remembered to add it.
 *
 *  2. Substring matching false-positived. 'outlook' matched "what's the
 *     outlook for winter", 'battleford' matched inside 'north battleford'.
 *     Matching is on word boundaries now.
 *
 * Adding a market is a one-line change to SERVED_CITIES, and it must not
 * happen before that market is actually approved and operating.
 */
const SERVED_CITIES = ['saskatoon']

/* Cities we recognise well enough to say "not there" with confidence. Does
 * not need to be exhaustive — an unrecognised place name simply gets no
 * injected fact, and the system prompt still holds the model to Saskatoon. */
const KNOWN_CITIES = [
  // Saskatchewan
  'saskatoon', 'regina', 'yorkton', 'moose jaw', 'prince albert', 'swift current',
  'north battleford', 'battleford', 'estevan', 'weyburn', 'lloydminster', 'melfort',
  'humboldt', 'martensville', 'warman', 'meadow lake', 'tisdale', 'nipawin',
  'kindersley', 'melville', 'la ronge', 'canora', 'esterhazy', 'moosomin',
  'shaunavon', 'assiniboia', 'watrous', 'indian head', "fort qu'appelle",
  'lumsden', 'white city', 'pilot butte', 'balgonie', 'emerald park',
  // the rest of Canada
  'calgary', 'edmonton', 'red deer', 'lethbridge', 'medicine hat', 'fort mcmurray',
  'banff', 'canmore', 'airdrie', 'grande prairie',
  'winnipeg', 'brandon', 'thunder bay', 'toronto', 'ottawa', 'mississauga',
  'hamilton', 'london', 'windsor', 'kitchener', 'waterloo', 'guelph', 'kingston',
  'montreal', 'quebec city', 'laval', 'gatineau', 'sherbrooke',
  'vancouver', 'victoria', 'surrey', 'burnaby', 'richmond', 'kelowna', 'kamloops',
  'abbotsford', 'nanaimo', 'whistler',
  'halifax', 'moncton', 'fredericton', 'saint john', "st john's", 'charlottetown',
  'whitehorse', 'yellowknife', 'iqaluit',
  // common cross-border asks
  'seattle', 'minneapolis', 'chicago', 'new york', 'los angeles', 'london uk',
]

/** Word-boundary match, so 'outlook' does not match "the outlook for winter". */
function mentionsCity(q, city) {
  const escaped = city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(^|[^a-z])${escaped}([^a-z]|$)`, 'i').test(q)
}

const titleCase = (c) => c.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

function locationGuard(question) {
  const q = String(question || '').toLowerCase()
  const unserved = KNOWN_CITIES.filter(
    (c) => !SERVED_CITIES.includes(c) && mentionsCity(q, c)
  )
  if (!unserved.length) return null

  // longest match wins, so "north battleford" beats "battleford"
  const city = unserved.sort((a, b) => b.length - a.length)[0]
  return `CRITICAL FACT: Spinr does NOT operate in ${titleCase(city)}. Spinr operates only in Saskatoon, Saskatchewan. Do not say or imply that Spinr is available, launching, expanding or coming soon anywhere else — say plainly that we are not there, and do not speculate about future cities.`
}

// ============================================
// SYSTEM PROMPT (preserved from original)
// ============================================
function getSystemPrompt(userType) {
  return `You are an exclusive customer support assistant for Spinr, a proudly Canadian rideshare platform serving Saskatoon, Saskatchewan. You help ${userType === 'driver' ? 'drivers' : 'riders'} with their questions about the Spinr platform ONLY.

CRITICAL RULES YOU MUST FOLLOW:
1. ONLY answer based on the Knowledge Base Context provided below. Do NOT use your own training data or make up information.
2. If the answer is NOT found in the provided context, say: "I don't have specific information about that. Please contact support@spinr.ca for assistance."
3. NEVER fabricate, guess, or assume facts about Spinr's service availability, pricing, policies, or features.
4. SERVICE AVAILABILITY: Spinr is currently ONLY available in Saskatoon, Saskatchewan. It is NOT available in Yorkton, Moose Jaw, Prince Albert, Swift Current, or ANY other city. There are no announced launch dates for any other city - never say Spinr is 'launching soon' or 'coming soon' anywhere. If a user asks about availability in any city other than Saskatoon, clearly state it is NOT available there.
5. Strictly refuse to answer any questions not directly related to Spinr, ridesharing, or the user's account. Reply: "I am a Spinr support assistant and can only answer questions related to the Spinr app and our services."
6. Be concise, helpful, and friendly in your responses.
7. For support issues you cannot resolve, direct users to support@spinr.ca.`
}

// ============================================
// NEW: LangChain-powered RAG search
// ============================================
async function searchWithLangChainRAG(question, userType) {
  // 1. Hybrid retrieval (BM25 + vector via Supabase RPC), re-ranked for the
  //    audience — a rider and a driver asking the same words want different
  //    sources, so audience belongs in retrieval, not just in the prompt.
  console.log('[RAG] Starting hybrid retrieval for:', question, '| audience:', userType)
  const entries = await hybridRetrieve(question, 4, { audience: userType })
  console.log('[RAG] Retrieved entries:', entries.length, entries.map(e => e.title))

  // 2. Build structured context
  let context = buildStructuredContext(entries, userType)

  // 3. Tell the model who is asking, so audience survives shared-category rows
  const note = audienceNote(userType)
  if (note) context = note + '\n\n' + context

  // 4. Inject location guard if needed
  const locGuard = locationGuard(question)
  if (locGuard) {
    context = locGuard + '\n\n' + context
  }

  // 5. Format messages for LLM
  const systemPrompt = getSystemPrompt(userType)
  const userMessage = formatUserMessage(context, question)

  // 6. Call LLM via LangChain — this answer is the grounded one
  const llm = getLLM()
  const response = await llm.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(userMessage)
  ])
  const draft = typeof response.content === 'string' ? response.content : String(response.content || '')

  // 7. Optional light-model rewrite for tone. Rejected automatically if it
  //    changes any fact — see lib/polish.js.
  const polished = await polishAnswer(draft, { question, audience: userType })

  return {
    success: true,
    answer: polished.text,
    model_used: llm.model,
    polished: polished.polished,
    polish_reason: polished.reason,
    /* a title the reader cannot open is not much of a source; link the ones
       that came from CMS content, which is everything with a source_id */
    sources: entries.map(e => ({
      title: e.title,
      category: e.category,
      affinity: e._affinity,
      url: e.source === 'cms_article' && e.slug ? '/help/' + e.slug
        : e.source === 'cms_faq' && e.title ? '/help/' + faqSlug(e.title)
        : undefined,
    })),
    tokens_used: response.usage_metadata?.total_tokens || 0
  }
}

// ============================================
// FALLBACK: Keyword search (preserved from original)
// ============================================
async function searchExistingContent(question) {
  const q = question.toLowerCase().trim()
  let faqs = [], articles = []

  /* Title hits before body hits. Matching the body treats every passing
     mention as a match — asking "delete" returned "Adding and managing payment
     methods" because its text happens to say "delete a card" — so the body is
     only consulted when nothing matches on the question or title. */
  if (isSupabaseConfigured()) {
    const { data: faqByQ } = await supabase.from('faqs').select('*').ilike('question', `%${q}%`).limit(3)
    faqs = faqByQ || []
    if (faqs.length === 0) {
      const { data: faqByA } = await supabase.from('faqs').select('*').ilike('answer', `%${q}%`).limit(2)
      faqs = faqByA || []
    }
    const { data: artByT } = await supabase.from('help_articles').select('*').ilike('title', `%${q}%`).limit(3)
    articles = artByT || []
    if (articles.length === 0) {
      const { data: artByC } = await supabase.from('help_articles').select('*').ilike('content', `%${q}%`).limit(2)
      articles = artByC || []
    }
  }

  /* The reader wants an answer, not a bibliography. If an FAQ matched we have
     a real one — show it. Otherwise say plainly that we do not, and let the
     linked list below do the work. Paths are never written into the prose;
     they are links in `sources`. */
  let answer
  if (faqs.length > 0) {
    answer = String(faqs[0].answer || '').trim()
  } else if (articles.length > 0) {
    answer = 'I don\u2019t have a direct answer written for that yet. These help pages look closest:'
  } else {
    answer = 'I couldn\u2019t find anything on that. Email support@spinr.ca and a person will pick it up.'
  }

  const sources = [
    ...faqs.map(f => ({ title: f.question, url: '/help/' + faqSlug(f.question) })),
    ...articles.filter(a => a.slug).map(a => ({ title: a.title, url: '/help/' + a.slug })),
  ]
  /* the first FAQ's text is already the answer above; keep it out of the list
     unless there is more than one thing to offer */
  const trimmed = faqs.length === 1 && articles.length === 0 ? [] : sources

  return { answer, related_articles: articles, sources: trimmed }
}

// ============================================
// HYBRID SEARCH ORCHESTRATOR
// ============================================
/*
 * Answer order: Spinr backend -> local LangChain RAG -> keyword search.
 *
 * The backend assistant goes first because it is the same provider, model and
 * FAQ corpus the rider and driver apps use, chosen in the spinrvm admin
 * dashboard. Answering the same question two different ways depending on
 * whether someone opened the app or the website was the thing worth fixing.
 *
 * Everything below it stays exactly as it was, and stays reachable. The
 * backend ships that surface dark behind `ai_public_chat_enabled`, so until an
 * admin turns it on EVERY call comes back 503 and this function behaves
 * identically to before — that is the intended rollout, not a failure mode.
 * The same fallback covers an unreachable backend, a timeout, or an unset
 * SPINR_API_URL.
 *
 * One deliberate difference to know about: the local path injects a hard
 * negative fact for any non-served city it recognises (locationGuard above).
 * The backend has no equivalent injection — it holds the same line in its
 * system prompt instead ("Saskatoon is the only city... never say, imply or
 * hint that Spinr is launching, expanding or coming soon anywhere"). Same
 * rule, enforced one layer up.
 */
async function searchWithHybridApproach(q, ut, uid, history) {
  const st = Date.now()
  const sa = sanitizeInput(q)
  const aiEnabled = process.env.AI_AGENT_ENABLED !== 'false'
  const c = getCachedResponse(sa, ut)
  if (c) return { ...c, source: 'cache', response_time_ms: Date.now() - st, tokens_used: 0 }

  if (aiEnabled && isSpinrApiConfigured()) {
    // 'anonymous' is this site's third user_type; the backend only tags FAQ
    // rows rider/driver, and a visitor who has not said which they are is
    // reading rider-facing pages far more often than not.
    const spinr = await askSpinrAssistant({
      message: sa,
      history,
      visitorType: ut === 'driver' ? 'driver' : 'rider',
    })
    if (spinr) {
      // Same output hygiene the local path gets — validateResponse rewrites any
      // support address the model invented back to the real one.
      const r = {
        answer: validateResponse(spinr.reply),
        source: 'spinr_backend',
        model_used: spinr.model,
        response_time_ms: Date.now() - st,
        tokens_used: 0,
      }
      setCachedResponse(sa, ut, r)
      return r
    }
  }

  if (aiEnabled) {
    try {
      const aiResult = await searchWithLangChainRAG(sa, ut)
      if (aiResult.success) {
        const v = validateResponse(aiResult.answer)
        const r = { answer: v, source: 'ai_agent', model_used: aiResult.model_used, polished: aiResult.polished, sources: aiResult.sources, response_time_ms: Date.now() - st, tokens_used: aiResult.tokens_used }
        setCachedResponse(sa, ut, r)
        return r
      }
    } catch (e) { console.error('[RAG] LangChain RAG failed:', e.message, e.stack) }
  }

  const fe = process.env.FALLBACK_TO_KEYWORD_SEARCH !== 'false'
  if (fe) {
    const f = await searchExistingContent(sa)
    return { answer: f.answer, source: 'fallback_search', model_used: null, response_time_ms: Date.now() - st, tokens_used: 0, related_articles: f.related_articles, sources: f.sources }
  }
  return { answer: 'Service unavailable. Please contact support@spinr.ca for assistance.', source: 'fallback_search', model_used: null, response_time_ms: Date.now() - st, tokens_used: 0 }
}

// ============================================
// CONVERSATION STORAGE (preserved from original)
// ============================================
async function storeConversation(q, a, src, mt, tuk, rtm, ut, uid) {
  if (!isSupabaseConfigured()) { return null }
  try {
    const { data, error } = await supabase.from('agent_conversations').insert([{
      user_id: uid || null,
      user_type: ut || 'anonymous',
      question: sanitizeInput(q),
      answer: a,
      source: src,
      model_used: mt,
      tokens_used: tuk,
      response_time_ms: rtm,
      created_at: new Date().toISOString()
    }]).select().single()
    if (error) { return null }
    return data
  } catch (e) { return null }
}

// ============================================
// HTTP HANDLERS
// ============================================
export async function OPTIONS(request) {
  return handleCORS(new NextResponse(null, { status: 200 }), request)
}

export async function POST(request) {
  try {
    let body
    try { body = await request.json() } catch (e) {
      return handleCORS(NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }), request)
    }
    const { question, user_type, user_id, history } = body
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return handleCORS(NextResponse.json({ error: 'Question is required' }, { status: 400 }), request)
    }
    const vut = ['rider', 'driver', 'anonymous']
    const ut = vut.includes(user_type) ? user_type : 'anonymous'
    const rid = user_id || request.headers.get('x-forwarded-for') || 'anonymous'
    const rl = checkRL(rid)
    if (!rl.ok) {
      return handleCORS(NextResponse.json({ error: 'Rate limit', retryAfter: rl.retry }, { status: 429 }), request)
    }
    // history is optional and passed straight through: lib/spinr-api.js trims
    // and normalizes it, and the backend re-validates and drops anything that
    // is not plain user/assistant text. The widget does not send it today.
    const sr = await searchWithHybridApproach(question, ut, user_id, Array.isArray(history) ? history : undefined)
    const cnv = await storeConversation(question, sr.answer, sr.source, sr.model_used, sr.tokens_used, sr.response_time_ms, ut, user_id)
    const res = { answer: sr.answer, source: sr.source, model_used: sr.model_used, conversation_id: cnv?.id || null, response_time_ms: sr.response_time_ms }
    if (sr.sources) res.sources = sr.sources
    if (typeof sr.polished === 'boolean') res.polished = sr.polished
    if (sr.related_articles && sr.related_articles.length > 0) {
      res.related_articles = sr.related_articles.map(a => ({ id: a.id, title: a.title, slug: a.slug }))
    }
    return handleCORS(NextResponse.json(res), request)
  } catch (err) {
    console.error('POST error:', err)
    return handleCORS(NextResponse.json({ answer: 'Error occurred. Please contact support@spinr.ca', source: 'fallback_search', model_used: null, conversation_id: null }, { status: 500 }), request)
  }
}

export async function GET(request) {
  return handleCORS(NextResponse.json({
    service: 'AI Agent Search',
    status: 'healthy',
    version: 'spinr-backend-first-v3',
    timestamp: new Date().toISOString(),
    config: {
      ai_enabled: process.env.AI_AGENT_ENABLED !== 'false',
      fallback_enabled: process.env.FALLBACK_TO_KEYWORD_SEARCH !== 'false',
      llm_provider: 'langchain-openai-compatible',
      llm_model: process.env.LLM_MODEL_NAME || 'qwen-vl-max-2025-04-08',
      // When configured, the Spinr backend assistant answers first and this
      // local pipeline becomes the fallback. Reports reachability config only
      // — whether the backend has the surface switched on is its own flag.
      spinr_backend_configured: isSpinrApiConfigured(),
      audience_aware_retrieval: true,
      polish_model: process.env.POLISH_MODEL_NAME || null,
      rate_limit: RL_MAX + ' requests/minute'
    }
  }), request)
}
