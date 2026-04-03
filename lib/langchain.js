import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai'

// Derive base URL from the full endpoint URL
// DashScope: https://dashscope-intl.aliyuncs.com/compatible-mode/v1/embeddings
//         -> https://dashscope-intl.aliyuncs.com/compatible-mode/v1
function deriveBaseURL(fullURL, suffix) {
  if (!fullURL) return null
  const idx = fullURL.lastIndexOf(suffix)
  return idx !== -1 ? fullURL.substring(0, idx) : fullURL
}

// LangChain Embeddings — wraps DashScope text-embedding-v4
export const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.EMBEDDING_API_KEY || process.env.OPENAI_API_KEY || '',
  model: process.env.EMBEDDING_MODEL_NAME || 'text-embedding-v4',
  configuration: {
    baseURL: deriveBaseURL(
      process.env.EMBEDDING_API_URL,
      '/embeddings'
    ) || 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1'
  }
})

// LangChain LLM — wraps DashScope Qwen
export const llm = new ChatOpenAI({
  openAIApiKey: process.env.LLM_API_KEY || '',
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
