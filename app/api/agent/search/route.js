import { NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { getLLM } from '@/lib/langchain'
import { hybridRetrieve } from '@/lib/hybrid-retriever'
import { buildStructuredContext, formatUserMessage } from '@/lib/context-builder'
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
// LOCATION GUARD (preserved from original)
// ============================================
const NON_SASKATOON_CITIES = [
  'regina', 'yorkton', 'moose jaw', 'prince albert', 'swift current', 'north battleford',
  'estevan', 'weyburn', 'lloydminster', 'melfort', 'humboldt', 'martensville',
  'warman', 'meadow lake', 'tisdale', 'nipawin', 'kindersley', 'melville',
  'la ronge', 'battleford', 'canora', 'esterhazy', 'moosomin', 'shaunavon',
  'assiniboia', 'outlook', 'watrous', 'indian head', 'fort qu\'appelle',
  'lumsden', 'white city', 'pilot butte', 'balgonie', 'emerald park'
]

function locationGuard(question) {
  const q = question.toLowerCase()
  for (const city of NON_SASKATOON_CITIES) {
    if (q.includes(city)) {
      return `CRITICAL FACT: Spinr is NOT available in ${city.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}. Spinr is currently ONLY available in Saskatoon, Saskatchewan. We are NOT available in any other city at this time.`
    }
  }
  return null
}

// ============================================
// SYSTEM PROMPT (preserved from original)
// ============================================
function getSystemPrompt(userType) {
  return `You are an exclusive customer support assistant for Spinr, a Canadian owned and operated rideshare platform serving Saskatoon, Saskatchewan. You help ${userType === 'driver' ? 'drivers' : 'riders'} with their questions about the Spinr platform ONLY.

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
  // 1. Hybrid retrieval (BM25 + vector via Supabase RPC)
  console.log('[RAG] Starting hybrid retrieval for:', question)
  const entries = await hybridRetrieve(question, 3)
  console.log('[RAG] Retrieved entries:', entries.length, entries.map(e => e.title))

  // 2. Build structured context
  let context = buildStructuredContext(entries, userType)

  // 3. Inject location guard if needed
  const locGuard = locationGuard(question)
  if (locGuard) {
    context = locGuard + '\n\n' + context
  }

  // 4. Format messages for LLM
  const systemPrompt = getSystemPrompt(userType)
  const userMessage = formatUserMessage(context, question)

  // 5. Call LLM via LangChain
  const llm = getLLM()
  const response = await llm.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(userMessage)
  ])

  return {
    success: true,
    answer: response.content,
    model_used: llm.model,
    tokens_used: response.usage_metadata?.total_tokens || 0
  }
}

// ============================================
// FALLBACK: Keyword search (preserved from original)
// ============================================
async function searchExistingContent(question) {
  const q = question.toLowerCase()
  let faqs = [], articles = []
  if (isSupabaseConfigured()) {
    const { data: faqD } = await supabase.from('faqs').select('*').or('question.ilike.%' + q + '%,answer.ilike.%' + q + '%').limit(3)
    const { data: artD } = await supabase.from('help_articles').select('*').or('title.ilike.%' + q + '%,content.ilike.%' + q + '%').limit(3)
    faqs = faqD || []; articles = artD || []
  }
  let answer = ''
  if (faqs.length > 0) answer += 'From our FAQ\n\n' + faqs.map(f => 'Q: ' + f.question + '\nA: ' + f.answer + '\n\n').join('')
  if (articles.length > 0) answer += 'From our Help Center:\n\n' + articles.map(a => '- ' + a.title + '\n').join('')
  return { answer: answer || 'I could not find relevant information. Please contact support@spinr.ca for help.', related_articles: articles }
}

// ============================================
// HYBRID SEARCH ORCHESTRATOR
// ============================================
async function searchWithHybridApproach(q, ut, uid) {
  const st = Date.now()
  const sa = sanitizeInput(q)
  const aiEnabled = process.env.AI_AGENT_ENABLED !== 'false'
  const c = getCachedResponse(sa, ut)
  if (c) return { ...c, source: 'cache', response_time_ms: Date.now() - st, tokens_used: 0 }

  if (aiEnabled) {
    try {
      const aiResult = await searchWithLangChainRAG(sa, ut)
      if (aiResult.success) {
        const v = validateResponse(aiResult.answer)
        const r = { answer: v, source: 'ai_agent', model_used: aiResult.model_used, response_time_ms: Date.now() - st, tokens_used: aiResult.tokens_used }
        setCachedResponse(sa, ut, r)
        return r
      }
    } catch (e) { console.error('[RAG] LangChain RAG failed:', e.message, e.stack) }
  }

  const fe = process.env.FALLBACK_TO_KEYWORD_SEARCH !== 'false'
  if (fe) {
    const f = await searchExistingContent(sa)
    return { answer: f.answer, source: 'fallback_search', model_used: null, response_time_ms: Date.now() - st, tokens_used: 0, related_articles: f.related_articles }
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
    const { question, user_type, user_id } = body
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
    const sr = await searchWithHybridApproach(question, ut, user_id)
    const cnv = await storeConversation(question, sr.answer, sr.source, sr.model_used, sr.tokens_used, sr.response_time_ms, ut, user_id)
    const res = { answer: sr.answer, source: sr.source, model_used: sr.model_used, conversation_id: cnv?.id || null, response_time_ms: sr.response_time_ms }
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
    version: 'langchain-hybrid-v1',
    timestamp: new Date().toISOString(),
    config: {
      ai_enabled: process.env.AI_AGENT_ENABLED !== 'false',
      fallback_enabled: process.env.FALLBACK_TO_KEYWORD_SEARCH !== 'false',
      llm_provider: 'langchain-openai-compatible',
      llm_model: process.env.LLM_MODEL_NAME || 'qwen-vl-max-2025-04-08',
      rate_limit: RL_MAX + ' requests/minute'
    }
  }), request)
}
