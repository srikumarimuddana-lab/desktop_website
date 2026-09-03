import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai'

// Derive base URL from the full endpoint URL
// DashScope: https://dashscope-intl.aliyuncs.com/compatible-mode/v1/embeddings
//         -> https://dashscope-intl.aliyuncs.com/compatible-mode/v1
function deriveBaseURL(fullURL, suffix) {
  if (!fullURL) return null
  const idx = fullURL.lastIndexOf(suffix)
  return idx !== -1 ? fullURL.substring(0, idx) : fullURL
}

// Lazy singletons — created on first use so env vars are available
let _embeddings = null
let _llm = null
let _polish = null
let _polishResolved = false

/**
 * Output width of the embedding model, when it must be pinned.
 *
 * `knowledge_base.embedding` is `vector(1024)` and `hybrid_search` takes a
 * `vector(1024)` argument — both hard-typed (see supabase/hybrid_search_migration.sql).
 * DashScope's text-embedding-v4 returns 1024 natively, so this was never needed.
 * OpenAI's text-embedding-3-* return 1536 by default but accept a `dimensions`
 * parameter that truncates to a shorter prefix, so setting
 * EMBEDDING_DIMENSIONS=1024 lets those models be used through an
 * OpenAI-compatible endpoint (e.g. Vercel AI Gateway) WITHOUT migrating the
 * column or dropping and recreating the RPC.
 *
 * Unset = send no `dimensions` field at all, which is the pre-existing
 * behaviour and stays correct for any model that already returns 1024.
 *
 * NOTE: matching the width does NOT make vectors interchangeable. Embeddings
 * from a different model occupy a different space, so changing
 * EMBEDDING_MODEL_NAME always requires re-embedding every knowledge_base row
 * (scripts/ingest-documents.js --force, plus a re-sync of CMS-sourced rows).
 * Mixing old and new vectors in one column silently degrades retrieval rather
 * than erroring.
 */
const EMBEDDING_DIMENSIONS = parseInt(process.env.EMBEDDING_DIMENSIONS || '', 10)

export function getEmbeddings() {
  if (!_embeddings) {
    const apiKey = process.env.EMBEDDING_API_KEY || process.env.OPENAI_API_KEY || ''
    console.log('[LangChain] Initializing embeddings, key prefix:', apiKey.substring(0, 6) + '...')
    _embeddings = new OpenAIEmbeddings({
      openAIApiKey: apiKey,
      model: process.env.EMBEDDING_MODEL_NAME || 'text-embedding-v4',
      ...(Number.isFinite(EMBEDDING_DIMENSIONS) ? { dimensions: EMBEDDING_DIMENSIONS } : {}),
      configuration: {
        baseURL: deriveBaseURL(
          process.env.EMBEDDING_API_URL,
          '/embeddings'
        ) || 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1'
      }
    })
  }
  return _embeddings
}

export function getLLM() {
  if (!_llm) {
    const apiKey = process.env.LLM_API_KEY || ''
    console.log('[LangChain] Initializing LLM, key prefix:', apiKey.substring(0, 6) + '..., model:', process.env.LLM_MODEL_NAME)
    _llm = new ChatOpenAI({
      openAIApiKey: apiKey,
      model: process.env.LLM_MODEL_NAME || 'qwen-vl-max-2025-04-08',
      temperature: 0.2,
      maxTokens: parseInt(process.env.AGENT_MAX_TOKENS || '500'),
      configuration: {
        baseURL: deriveBaseURL(
          process.env.LLM_API_URL,
          '/chat/completions'
        ) || 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1'
      }
    })
  }
  return _llm
}

/**
 * Optional light model used only to rewrite an already-grounded answer
 * (see lib/polish.js). Returns null when POLISH_MODEL_NAME is unset, which
 * is the default — the pipeline then ships the RAG answer as written.
 *
 * Defaults to the SAME provider as the main LLM, so `POLISH_MODEL_NAME=qwen-turbo`
 * is all that is needed to get a cheaper, faster second pass. To use OpenAI
 * proper, set all three:
 *     POLISH_MODEL_NAME=gpt-4o-mini
 *     POLISH_API_URL=https://api.openai.com/v1
 *     POLISH_API_KEY=sk-...
 * POLISH_API_URL is required in that case: this repo sets OPENAI_API_KEY to the
 * DashScope key (see CLAUDE.md), so a bare OpenAI model name would otherwise be
 * sent to DashScope and fail as an unknown model.
 */
export function getPolishLLM() {
  if (_polishResolved) return _polish
  _polishResolved = true

  const model = process.env.POLISH_MODEL_NAME
  if (!model) return (_polish = null)

  const apiKey = process.env.POLISH_API_KEY || process.env.LLM_API_KEY || ''
  if (!apiKey) {
    console.warn('[LangChain] POLISH_MODEL_NAME set but no API key available — polish disabled')
    return (_polish = null)
  }
  const baseURL =
    (process.env.POLISH_API_URL && deriveBaseURL(process.env.POLISH_API_URL, '/chat/completions')) ||
    deriveBaseURL(process.env.LLM_API_URL, '/chat/completions') ||
    'https://dashscope-intl.aliyuncs.com/compatible-mode/v1'

  console.log('[LangChain] Polish model:', model, 'via', baseURL)
  _polish = new ChatOpenAI({
    openAIApiKey: apiKey,
    model,
    temperature: 0.4,
    maxTokens: parseInt(process.env.POLISH_MAX_TOKENS || '400'),
    timeout: parseInt(process.env.POLISH_TIMEOUT_MS || '6000'),
    maxRetries: 0,
    configuration: { baseURL },
  })
  return _polish
}
