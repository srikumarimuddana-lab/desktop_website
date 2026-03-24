import { NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

function handleCORS(response, request) {
  const allowed = process.env.CORS_ORIGINS?.split(',').map(s => s.trim()) || ['*'];
  const ri = request?.headers.get('origin');
  let origin = '*';
  if (allowed.includes('*')) origin = '*';
  else if (ri && allowed.includes(ri)) origin = ri;
  else if (allowed.length > 0) origin = allowed[0];
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

const rlMap = new Map();
const RL_W = 60000;
const RL_MAX = parseInt(process.env.AGENT_RATE_LIMIT || '10');

function checkRL(uid) {
  const n = Date.now();
  let u = rlMap.get(uid) || { c: 0, w: n };
  if (n - u.w > RL_W) { u.c = 0; u.w = n; }
  if (u.c >= RL_MAX) return { ok: false, retry: Math.ceil((RL_W - (n - u.w)) / 1000) };
  u.c++; rlMap.set(uid, u); return { ok: true };
}

setInterval(() => {
  const n = Date.now();
  for (const [k, v] of rlMap.entries())
    if (n - v.w > RL_W * 2) rlMap.delete(k);
}, RL_W);

// RESPONSE STORAGE OR REDIS
const responseCache = new Map();
const CACHE_TTL = parseInt(process.env.AGENT_CACHE_TTL || '3600000');

function getCacheKey(q, ut) {
  const n = q.toLowerCase().trim().replace(/\s+/g, ' ');
  return ut + ':' + n;
}

function getCachedResponse(q, ut) {
  const k = getCacheKey(q, ut);
  const c = responseCache.get(k);
  if (c && Date.now() - c.timestamp < CACHE_TTL) return c.response;
  return null;
}

function setCachedResponse(q, ut, r) {
  const k = getCacheKey(q, ut);
  responseCache.set(k, { response: r, timestamp: Date.now() });
  if (responseCache.size > 1000) {
    const oldest = responseCache.keys().next().value;
    responseCache.delete(oldest);
  }
}

// INPUT SANITIZATION
function sanitizeInput(i) {
  if (!i || typeof i !== 'string') return '';
  return i.trim().slice(0, 1000).replace(/[<>]/g, '').replace(/javascript:/gi, '').replace(/on\w+=/gi, '').replace(/\n{3,}/g, '\n\n');
}

// RESPONSE VALIDATION
function validateResponse(r) {
  if (!r || typeof r !== 'string') {
    return 'I apologize, but I could not generate a response. Please try again or contact support@spinr.ca for assistance.';
  }
  const emails = r.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
  const allowed = ['support@spinr.ca', 'help@spinr.ca'];
  emails.forEach(e => { if (!allowed.includes(e.toLowerCase())) r = r.replace(e, 'support@spinr.ca'); });
  return r;
}

// LLM CONFIGURATION
const LLM_CONFIGS = {
  deepseek: { url: process.env.LLM_API_URL || 'https://api.deepseek.com/v1/chat/completions', key: process.env.LLM_API_KEY, model: process.env.LLM_MODEL_NAME || 'deepseek-chat' },
  openrouter: { url: process.env.LLM_API_URL || 'https://openrouter.ai/api/v1/chat/completions', key: process.env.LLM_API_KEY, model: process.env.LLM_MODEL_NAME || 'qwen/qwen-2.5-72b-instruct' },
  qwen: { url: process.env.LLM_API_URL, key: process.env.LLM_API_KEY, model: process.env.LLM_MODEL_NAME || 'qwen-3.5' },
  kimi: { url: process.env.LLM_KIMI_API_URL, key: process.env.LLM_KIMI_API_KEY, model: process.env.LLM_KIMI_MODEL_NAME || 'kimi' },
  'gpt-4': { url: 'https://api.openai.com/v1/chat/completions', key: process.env.OPENAI_API_KEY, model: 'gpt-4' },
  'gpt-3.5-turbo': { url: 'https://api.openai.com/v1/chat/completions', key: process.env.OPENAI_API_KEY, model: 'gpt-3.5-turbo' }
};

function getLLMConfig(p) { return LLM_CONFIGS[p] || LLM_CONFIGS.deepseek; }

// EMBEDDING GENERATION
async function generateEmbedding(text) {
  const url = process.env.EMBEDDING_API_URL || 'https://api.openai.com/v1/embeddings';
  const key = process.env.EMBEDDING_API_KEY || process.env.OPENAI_API_KEY;
  const model = process.env.EMBEDDING_MODEL_NAME || 'text-embedding-ada-002';

  if (!key) {
    console.error('Embedding API key not configured. EMBEDDING_API_KEY:', process.env.EMBEDDING_API_KEY ? 'set' : 'not set', 'OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'set' : 'not set');
    throw new Error('Embedding API key not configured');
  }

  console.log('Embedding request:', { url, model, textLength: text.length });

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        input: text.slice(0, 8000)
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Embedding API error:', res.status, errorText);

      // Check if it's a model not found error (common with LM Studio)
      if (errorText.includes('model') || errorText.includes('not found') || res.status === 404) {
        console.warn('⚠️ Embedding model not available. LM Studio may not have an embedding model loaded.');
        console.warn('💡 Solution: Load an embedding model in LM Studio (e.g., text-embedding-ada-002) or use OpenAI embeddings.');
        throw new Error('EMBEDDING_MODEL_NOT_AVAILABLE');
      }

      throw new Error('Embedding API error: ' + res.status + ' - ' + errorText);
    }

    const data = await res.json();

    // Handle both OpenAI and LM Studio response formats
    let embedding = null;
    if (data.data && data.data[0] && data.data[0].embedding) {
      embedding = data.data[0].embedding;
    } else if (data.embedding) {
      // Some LM Studio versions return { embedding: [...] }
      embedding = data.embedding;
    } else if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
      // Some return [[...]] directly
      embedding = data[0];
    }

    if (!embedding || !Array.isArray(embedding)) {
      console.error('Invalid embedding response:', JSON.stringify(data).slice(0, 500));
      throw new Error('Invalid embedding response format');
    }

    console.log('✅ Embedding generated successfully, dimension:', embedding.length);
    return embedding;
  } catch (fetchError) {
    if (fetchError.message === 'EMBEDDING_MODEL_NOT_AVAILABLE') {
      throw fetchError;
    }
    console.error('Embedding fetch error:', fetchError.message);
    throw new Error('Failed to connect to embedding API: ' + fetchError.message);
  }
}

// VECTOR SEARCH (via Supabase RPC)
async function vectorSearch(emb, limit = 5) {
  const { data, error } = await supabase.rpc('search_knowledge_base', { query_embedding: emb, match_count: limit, similarity_threshold: 0.7 });
  if (error) { console.error('Vector search error:', error); return []; }
  return data || [];
}

// BUILD CONTEXT FROM RETRIEVED ENTRIES
function buildContext(entries, userType) {
  if (!entries || entries.length === 0) return '';
  let ctx = 'Based on our knowledge base:\n\n';
  entries.forEach((e, i) => {
    ctx += (i + 1) + '. ' + e.title + '\n';
    ctx += '   ' + e.content + '\n';
    if (e.category) ctx += '   Category: ' + e.category + '\n';
    if (e.similarity) ctx += '   Relevance: ' + (e.similarity * 100).toFixed(0) + '%\n';
    ctx += '\n';
  });
  return ctx;
}

// CALL LLM WITH CONTEXT
async function callLLM(question, context, userType) {
  const sysPrompt = `You are an exclusive customer support assistant for Spinr, a rideshare platform in Saskatchewan, Canada. You help ${userType === 'driver' ? 'drivers' : 'riders'} with their questions about the Spinr platform ONLY. 
CRITICAL RULE: You MUST strictly refuse to answer any questions that are not directly related to Spinr, ridesharing, or the user's account (e.g. no politics, world news, coding, general knowledge). If asked an off-topic question, simply reply: "I am a Spinr support assistant and can only answer questions related to the Spinr app and our services." Please contact support@spinr.ca if you cannot find the answer to a valid Spinr question.`;
  const userMsg = context ? `Knowledge Base Context:\n${context}\n\nUser Question: ${question}` : `User Question: ${question}`;
  const maxTokens = parseInt(process.env.AGENT_MAX_TOKENS || '500');

  const defaultProvider = process.env.LLM_PROVIDER || 'qwen';
  const providersToTry = [defaultProvider, ...Object.keys(LLM_CONFIGS).filter(p => p !== defaultProvider)];

  let lastError = null;

  for (const provider of providersToTry) {
    const config = getLLMConfig(provider);
    if (!config || !config.url || !config.key) continue;

    try {
      const res = await fetch(config.url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${config.key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: config.model, messages: [{ role: 'system', content: sysPrompt }, { role: 'user', content: userMsg }], max_tokens: maxTokens, temperature: 0.7 })
      });
      if (!res.ok) throw new Error('LLM API error:' + res.status);
      const data = await res.json();
      if (!data.choices || !data.choices[0] || !data.choices[0].message) throw new Error('Invalid LLM response');
      return { answer: data.choices[0].message.content, model_used: config.model, tokens_used: data.usage?.total_tokens || 0 };
    } catch (err) {
      console.warn(`LLM provider ${provider} failed: ${err.message}. Trying next available...`);
      lastError = err;
    }
  }

  throw new Error('All configured LLM providers failed. Last error: ' + (lastError?.message || 'None'));
}

// RAG-BASED SEARCH
async function searchWithRAG(question, userType) {
  const q = await generateEmbedding(question);
  const entries = await vectorSearch(q, 5);
  const ctx = buildContext(entries, userType);
  const llm = await callLLM(question, ctx, userType);
  return { success: true, answer: llm.answer, model_used: llm.model_used, tokens_used: llm.tokens_used };
}

// FALLBACK KEYWORD SEARCD
async function searchExistingContent(question) {
  const q = question.toLowerCase();
  let faqs = [], articles = [];
  if (isSupabaseConfigured()) {
    const { data: faqD } = await supabase.from('faqs').select('*').or('question.ilike.%' + q + '%,answer.ilike.%' + q + '%').limit(3);
    const { data: artD } = await supabase.from('help_articles').select('*').or('title.ilike.%' + q + '%,content.ilike.%' + q + '%').limit(3);
    faqs = faqD || []; articles = artD || [];
  }
  let answer = '';
  if (faqs.length > 0) answer += 'From our FAQ\n\n' + faqs.map(f => 'Q: ' + f.question + '\nA: ' + f.answer + '\n\n').join('');
  if (articles.length > 0) answer += 'From our Help Center:\n\n' + articles.map(a => '- ' + a.title + '\n').join('');
  return { answer: answer || 'I could not find relevant information. Please contact support@spinr.ca for help.', related_articles: articles };
}

// HYBRID SEARCH FUNCTION
async function searchWithHybridApproach(q, ut, uid) {
  const st = Date.now();
  const sa = sanitizeInput(q);
  const aiEnabled = process.env.AI_AGENT_ENABLED !== 'false';
  const c = getCachedResponse(sa, ut);
  if (c) return { ...c, source: 'cache', response_time_ms: Date.now() - st, tokens_used: 0 };
  if (aiEnabled) {
    try {
      const aiResult = await searchWithRAG(sa, ut);
      if (aiResult.success) {
        const v = validateResponse(aiResult.answer);
        const r = { answer: v, source: 'ai_agent', model_used: aiResult.model_used, response_time_ms: Date.now() - st, tokens_used: aiResult.tokens_used };
        setCachedResponse(sa, ut, r);
        return r;
      }
    } catch (e) { console.warn('RAG failed:', e.message); }
  }
  const fe = process.env.FALLBACK_TO_KEYWORD_SEARCH !== 'false';
  if (fe) {
    const f = await searchExistingContent(sa);
    return { answer: f.answer, source: 'fallback_search', model_used: null, response_time_ms: Date.now() - st, tokens_used: 0, related_articles: f.related_articles };
  }
  return { answer: 'Service unavailable. Please contact support@spinr.ca for assistance.', source: 'fallback_search', model_used: null, response_time_ms: Date.now() - st, tokens_used: 0 };
}

// STore Conversation
async function storeConversation(q, a, src, mt, tuk, rtm, ut, uid) {
  if (!isSupabaseConfigured()) { return null; }
  try {
    const { data, error } = await supabase.from('agent_conversations').insert([{ user_id: uid || null, user_type: ut || 'anonymous', question: sanitizeInput(q), answer: a, source: src, model_used: mt, tokens_used: tuk, response_time_ms: rtm, created_at: new Date().toISOString() }]).select().single();
    if (error) { return null; }
    return data;
  } catch (e) { return null; }
}

export async function OPTIONS(request) { return handleCORS(new NextResponse(null, { status: 200 }), request); }

export async function POST(request) {
  try {
    let body;
    try { body = await request.json(); } catch (e) { return handleCORS(NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }), request); }
    const { question, user_type, user_id } = body;
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return handleCORS(NextResponse.json({ error: 'Question is required' }, { status: 400 }), request);
    }
    const vut = ['rider', 'driver', 'anonymous'];
    const ut = vut.includes(user_type) ? user_type : 'anonymous';
    const rid = user_id || request.headers.get('x-forwarded-for') || 'anonymous';
    const rl = checkRL(rid);
    if (!rl.ok) {
      return handleCORS(NextResponse.json({ error: 'Rate limit', retryAfter: rl.retry }, { status: 429 }), request);
    }
    const sr = await searchWithHybridApproach(question, ut, user_id);
    const cnv = await storeConversation(question, sr.answer, sr.source, sr.model_used, sr.tokens_used, sr.response_time_ms, ut, user_id);
    const res = { answer: sr.answer, source: sr.source, model_used: sr.model_used, conversation_id: cnv?.id || null, response_time_ms: sr.response_time_ms };
    if (sr.related_articles && sr.related_articles.length > 0) {
      res.related_articles = sr.related_articles.map(a => ({ id: a.id, title: a.title, slug: a.slug }));
    }
    return handleCORS(NextResponse.json(res), request);
  } catch (err) {
    console.error('POST error:', err);
    return handleCORS(NextResponse.json({ answer: 'Error occurred. Please contact support@spinr.ca', source: 'fallback_search', model_used: null, conversation_id: null }, { status: 500 }), request);
  }
}


export async function GET(request) {
  return handleCORS(NextResponse.json({ service: 'AI Agent Search', status: 'healthy', timestamp: new Date().toISOString(), config: { ai_enabled: process.env.AI_AGENT_ENABLED !== 'false', fallback_enabled: process.env.FALLBACK_TO_KEYWORD_SEARCH !== 'false', llm_provider: process.env.LLM_PROVIDER || 'qwen', rate_limit: RL_MAX + ' requests/minute' } }), request);
}
