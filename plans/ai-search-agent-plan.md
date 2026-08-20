# AI Search Agent Implementation Plan

## Overview
Implement an AI-powered search agent for Spinr rideshare platform that allows riders and drivers to ask questions using an LLM. The system will use **RAG (Retrieval Augmented Generation)** with vector embeddings to intelligently search the knowledge base, support multiple LLM providers (Qwen, Kimi, MinMax, GPT-4, Gemini Flash), and store all conversations for admin review.

---

## 📊 Plan Analysis & Reng andcommendations

### ✅ What's Excellent (Keep As-Is)
| Aspect | Status | Why It's Good |
|--------|--------|---------------|
| RAG Architecture | ✅ Excellent | Clear flow with visual diagrams - developers can understand easily |
| Multi-LLM Support | ✅ Excellent | 6 providers with OpenAI-compatible API = easy switching |
| Database Design | ✅ Good | 3 tables with proper RLS policies for security |
| API Design | ✅ Good | RESTful endpoints match existing patterns in `app/api/[[...path]]/route.js` |
| Hybrid Search | ✅ Excellent | AI + keyword fallback = resilient system |
| Integration Points | ✅ Good | Leverages existing `lib/supabase.js` and admin dashboard |

### ⚠️ Critical Issues Fixed Below
| Issue | Impact | Fix |
|-------|--------|-----|
| Missing `embedding` column in SQL | 🔴 Critical | Added below |
| Missing pgvector extension | 🔴 Critical | Added below |
| Missing HNSW index | 🟡 Medium | Added below |
| Vector search uses `$1` syntax | 🟡 Medium | Fixed with RPC function |
| No input sanitization detail | 🟡 Medium | Added below |
| No caching strategy detail | 🟢 Low | Added below |

### 💡 Best Practice Recommendations

**1. Use Supabase RPC for Vector Search** (Instead of direct query)
The `$1` syntax in the original plan won't work with Supabase JS client. Use a database function instead.

**2. Cache Common Answers** (Cost optimization)
Store responses for frequently asked questions to reduce LLM API calls.

**3. Input Sanitization** (Security)
Sanitize user input before sending to LLM to prevent prompt injection.

**4. Rate Limiting** (Security)
Implement per-user rate limiting to prevent abuse.

**5. Monitoring** (Operations)
Log token usage, response times, and error rates for observability.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            User Interface                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │ Chat Widget  │  │ Help Page    │  │ Support Page │                  │
│  │ (Floating)   │  │ Integration  │  │ Integration  │                  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                  │
│         │                 │                 │                           │
│         └─────────────────┼─────────────────┘                           │
│                           │                                             │
│                    ┌──────▼──────┐                                      │
│                    │  API Route  │                                      │
│                    │ /api/agent  │                                      │
│                    └──────┬──────┘                                      │
│                           │                                             │
│                    ┌──────▼──────┐                                      │
│                    │  1️⃣ RAG     │ ◄─── FIRST: Try RAG with embeddings  │
│                    │  (Primary)  │                                      │
│                    └──────┬──────┘                                      │
│                           │                                             │
│              ┌────────────┼────────────┐                                │
│              │ Success    │            │ Fail                           │
│              ▼            │            ▼                                │
│    ┌─────────────┐       │    ┌─────────────┐                          │
│    │ Generate    │       │    │ 2️⃣ Fallback │ ◄─── SECOND: Keyword     │
│    │ Embedding   │       │    │   Search    │         search           │
│    └──────┬──────┘       │    └──────┬──────┘                          │
│           │              │           │                                  │
│    ┌──────▼──────┐       │    ┌──────▼──────┐                          │
│    │ Vector      │       │    │ Search FAQs │                          │
│    │ Search in   │       │    │ & Articles  │                          │
│    │ Knowledge   │       │    └──────┬──────┘                          │
│    │ Base (DB)   │       │           │                                  │
│    └──────┬──────┘       │           │                                  │
│           │              │           │                                  │
│    ┌──────▼──────┐       │           │                                  │
│    │ Build       │       │           │                                  │
│    │ Context     │       │           │                                  │
│    └──────┬──────┘       │           │                                  │
│           │              │           │                                  │
│    ┌──────▼──────┐       │           │                                  │
│    │ Send to LLM │       │           │                                  │
│    │ (Qwen/Kimi/ │       │           │                                  │
│    │  GPT-4 etc) │       │           │                                  │
│    └──────┬──────┘       │           │                                  │
│           │              │           │                                  │
│           └──────────────┼───────────┘                                  │
│                          │                                              │
│                   ┌──────▼──────┐                                       │
│                   │ Return      │                                       │
│                   │ Answer to   │                                       │
│                   │ User        │                                       │
│                   └──────┬──────┘                                       │
│                          │                                              │
│                   ┌──────▼──────┐                                       │
│                   │Conversations│                                       │
│                   │   Table     │                                       │
│                   │  (Storage)  │                                       │
│                   └─────────────┘                                       │
└─────────────────────────────────────────────────────────────────────────┘
```

### Flow Summary
1️⃣ **RAG First** (Primary): Generate embedding → Vector search in knowledge base → Build context → Send to LLM → Return answer
2️⃣ **Fallback Second** (If RAG fails): Keyword search in FAQs & articles → Return answer

---

## RAG (Retrieval Augmented Generation) Architecture

### How the AI Agent References the Database

The AI agent uses **RAG** to intelligently search and retrieve relevant information from the knowledge base:

```
┌─────────────────────────────────────────────────────────────────┐
│                    RAG Architecture Flow                         │
│                                                                  │
│  1. User Question                                                │
│     "How do I get a refund?"                                     │
│            │                                                     │
│            ▼                                                     │
│  2. Generate Embedding                                           │
│     (Vector representation of question)                          │
│            │                                                     │
│            ▼                                                     │
│  3. Vector Search in Database                                    │
│     ┌─────────────────────────────────────┐                     │
│     │  knowledge_base (with embeddings)   │                     │
│     │  - Find similar questions/answers   │                     │
│     │  - Return top 3-5 relevant entries  │                     │
│     └─────────────────────────────────────┘                     │
│            │                                                     │
│            ▼                                                     │
│  4. Build Context                                                │
│     "Based on our knowledge base:                               │
│      - Refund process: Go to trip history...                    │
│      - Timeline: 5-7 business days..."                          │
│            │                                                     │
│            ▼                                                     │
│  5. Send to LLM with Context                                     │
│     ┌─────────────────────────────────────┐                     │
│     │  LLM (Qwen/Kimi/GPT-4/Gemini)      │                     │
│     │  - Receives: User question          │                     │
│     │  - Receives: Retrieved context      │                     │
│     │  - Generates: Natural answer        │                     │
│     └─────────────────────────────────────┘                     │
│            │                                                     │
│            ▼                                                     │
│  6. Return Answer to User                                        │
│     "To request a refund, go to your trip history..."           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Vector Database Options

**Option 1: Supabase pgvector (Recommended) ✅**
- Supabase has built-in pgvector extension
- No additional database needed
- Cost-effective (included in Supabase plan)
- Easy integration with existing setup
- Your codebase already uses Supabase (`lib/supabase.js`)

**Option 2: Pinecone (External)**
- Dedicated vector database
- Better for large-scale deployments (>1M vectors)
- Additional cost (~$70/month starter)

**Option 3: Weaviate (Self-hosted)**
- Open-source vector database
- Full control
- Requires separate hosting

**Recommendation**: Use **Supabase pgvector** since you're already using Supabase. It's cost-effective and integrates seamlessly with your existing `lib/supabase.js`.

---

## Multi-Model Support

### Supported LLM Providers

The system will support multiple LLM providers with easy switching:

| Provider | Model | API Compatibility | Cost | Notes |
|----------|-------|-------------------|------|-------|
| **Qwen** | qwen-3.5 | OpenAI-compatible | Low | Your current subscription |
| **Kimi** | kimi | OpenAI-compatible | Low | Good for coding tasks |
| **MinMax** | minmax | OpenAI-compatible | Low | Cost-effective |
| **OpenAI** | gpt-4 | Native | High | Best quality |
| **Google** | gemini-flash | OpenAI-compatible | Medium | Fast responses |
| **Anthropic** | claude | OpenAI-compatible | High | Best reasoning |

### Model Configuration

```env
# Primary LLM (used first)
LLM_PROVIDER=qwen
LLM_API_URL=https://your-qwen-endpoint.com/v1/chat/completions
LLM_API_KEY=your-api-key
LLM_MODEL_NAME=qwen-3.5

# Fallback LLM (used if primary fails)
LLM_FALLBACK_PROVIDER=kimi
LLM_FALLBACK_API_URL=https://your-kimi-endpoint.com/v1/chat/completions
LLM_FALLBACK_API_KEY=your-kimi-key
LLM_FALLBACK_MODEL_NAME=kimi

# Embedding Model (for vector search)
EMBEDDING_PROVIDER=openai
EMBEDDING_API_URL=https://api.openai.com/v1/embeddings
EMBEDDING_API_KEY=your-openai-key
EMBEDDING_MODEL_NAME=text-embedding-ada-002
```

### Model Switching Logic

```javascript
// Easy model switching via environment variables
const LLM_CONFIGS = {
  qwen: {
    url: process.env.LLM_API_URL,
    key: process.env.LLM_API_KEY,
    model: process.env.LLM_MODEL_NAME
  },
  kimi: {
    url: process.env.LLM_KIMI_API_URL,
    key: process.env.LLM_KIMI_API_KEY,
    model: 'kimi'
  },
  minmax: {
    url: process.env.LLM_MINMAX_API_URL,
    key: process.env.LLM_MINMAX_API_KEY,
    model: 'minmax'
  },
  'gpt-4': {
    url: 'https://api.openai.com/v1/chat/completions',
    key: process.env.OPENAI_API_KEY,
    model: 'gpt-4'
  },
  'gemini-flash': {
    url: process.env.LLM_GEMINI_API_URL,
    key: process.env.LLM_GEMINI_API_KEY,
    model: 'gemini-flash'
  }
};

// Get active model from env or default
const activeModel = process.env.LLM_PROVIDER || 'qwen';
const config = LLM_CONFIGS[activeModel];
```

---

## Database Schema

### 1. Knowledge Base Table (with Vector Embeddings)
```sql
-- Enable pgvector extension (run this first in Supabase SQL Editor)
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS public.knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  source TEXT DEFAULT 'manual', -- 'manual', 'faq_import', 'conversation_review'
  embedding vector(1536), -- OpenAI ada-002 embedding dimension (1536 dimensions)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access
CREATE POLICY "Allow public read access on knowledge_base"
  ON public.knowledge_base FOR SELECT
  USING (true);

-- Policy: Allow authenticated users to manage
CREATE POLICY "Allow authenticated users to manage knowledge_base"
  ON public.knowledge_base FOR ALL
  USING ((SELECT auth.role()) = 'authenticated');

-- Index for faster searches
CREATE INDEX idx_knowledge_base_category ON public.knowledge_base(category);
CREATE INDEX idx_knowledge_base_tags ON public.knowledge_base USING GIN(tags);
CREATE INDEX idx_knowledge_base_active ON public.knowledge_base(is_active);

-- Vector similarity search index (HNSW for fast approximate nearest neighbor)
CREATE INDEX idx_knowledge_base_embedding ON public.knowledge_base
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);
```

### 2. Conversations Table
```sql
CREATE TABLE IF NOT EXISTS public.agent_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT, -- Optional: for logged-in users
  user_type TEXT CHECK (user_type IN ('rider', 'driver', 'anonymous')),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  source TEXT CHECK (source IN ('ai_agent', 'fallback_search', 'knowledge_base')),
  model_used TEXT, -- e.g., 'qwen-3.5', 'gpt-4', etc.
  tokens_used INTEGER DEFAULT 0,
  response_time_ms INTEGER,
  is_helpful BOOLEAN, -- User feedback
  feedback_text TEXT,
  needs_review BOOLEAN DEFAULT false,
  reviewed_by TEXT, -- Admin email
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.agent_conversations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to insert their own conversations
CREATE POLICY "Allow users to insert conversations"
  ON public.agent_conversations FOR INSERT
  WITH CHECK (true);

-- Policy: Allow users to read their own conversations
CREATE POLICY "Allow users to read own conversations"
  ON public.agent_conversations FOR SELECT
  USING (user_id IS NULL OR user_id = (SELECT auth.uid()::text));

-- Policy: Allow authenticated users (admins) to read all
CREATE POLICY "Allow authenticated users to read all conversations"
  ON public.agent_conversations FOR SELECT
  USING ((SELECT auth.role()) = 'authenticated');

-- Policy: Allow authenticated users to update (for review)
CREATE POLICY "Allow authenticated users to update conversations"
  ON public.agent_conversations FOR UPDATE
  USING ((SELECT auth.role()) = 'authenticated');

-- Indexes for admin queries
CREATE INDEX idx_conversations_created_at ON public.agent_conversations(created_at DESC);
CREATE INDEX idx_conversations_user_type ON public.agent_conversations(user_type);
CREATE INDEX idx_conversations_needs_review ON public.agent_conversations(needs_review);
CREATE INDEX idx_conversations_source ON public.agent_conversations(source);
```

### 3. Knowledge Base Entries from Conversations
```sql
CREATE TABLE IF NOT EXISTS public.knowledge_base_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.agent_conversations(id),
  question_pattern TEXT NOT NULL,
  answer_template TEXT NOT NULL,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  is_approved BOOLEAN DEFAULT false,
  approved_by TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.knowledge_base_entries ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to manage
CREATE POLICY "Allow authenticated users to manage knowledge_base_entries"
  ON public.knowledge_base_entries FOR ALL
  USING ((SELECT auth.role()) = 'authenticated');
```

---

## API Endpoints

### 1. AI Agent Search Endpoint
**POST** `/api/agent/search`

Request:
```json
{
  "question": "How do I request a refund?",
  "user_type": "rider",
  "user_id": "optional-user-id"
}
```

Response:
```json
{
  "answer": "To request a refund, go to your trip history...",
  "source": "ai_agent",
  "model_used": "qwen-3.5",
  "conversation_id": "uuid",
  "related_articles": [...]
}
```

### 2. Conversation Feedback Endpoint
**POST** `/api/agent/feedback`

Request:
```json
{
  "conversation_id": "uuid",
  "is_helpful": true,
  "feedback_text": "optional feedback"
}
```

### 3. Admin: Get Conversations
**GET** `/api/admin/conversations`

Query params:
- `page`: Page number
- `limit`: Items per page
- `user_type`: Filter by rider/driver
- `source`: Filter by ai_agent/fallback_search
- `needs_review`: Filter flagged conversations
- `date_from`: Start date
- `date_to`: End date

### 4. Admin: Review Conversation
**PUT** `/api/admin/conversations/:id/review`

Request:
```json
{
  "needs_review": false,
  "create_knowledge_entry": true,
  "knowledge_entry": {
    "question_pattern": "refund request",
    "answer_template": "To request a refund...",
    "category": "rider",
    "tags": ["refund", "payment"]
  }
}
```

### 5. Admin: Knowledge Base CRUD
**GET** `/api/admin/knowledge-base`
**POST** `/api/admin/knowledge-base`
**PUT** `/api/admin/knowledge-base/:id`
**DELETE** `/api/admin/knowledge-base/:id`

---

## Hybrid Search Logic (with RAG)

```javascript
// Main search function with RAG + fallback
async function searchWithHybridApproach(question, userType) {
  const startTime = Date.now();
  
  // Step 1: Try RAG-based AI Agent first
  try {
    const aiResponse = await searchWithRAG(question, userType);
    if (aiResponse.success) {
      return {
        answer: aiResponse.answer,
        source: 'ai_agent',
        model_used: aiResponse.model_used,
        response_time_ms: Date.now() - startTime,
        tokens_used: aiResponse.tokens_used
      };
    }
  } catch (error) {
    console.warn('RAG AI agent failed, falling back to keyword search:', error);
  }

  // Step 2: Fallback to existing keyword search
  const fallbackResults = await searchExistingContent(question);
  return {
    answer: fallbackResults.answer,
    source: 'fallback_search',
    model_used: null,
    response_time_ms: Date.now() - startTime,
    tokens_used: 0
  };
}

// RAG-based search with vector embeddings
async function searchWithRAG(question, userType) {
  // 1. Generate embedding for user question
  const questionEmbedding = await generateEmbedding(question);
  
  // 2. Vector search in knowledge base (find top 5 similar entries)
  const relevantEntries = await vectorSearch(questionEmbedding, 5);
  
  // 3. Build context from retrieved entries
  const context = buildContext(relevantEntries, userType);
  
  // 4. Send to LLM with context
  const llmResponse = await callLLM(question, context, userType);
  
  return {
    success: true,
    answer: llmResponse.answer,
    model_used: llmResponse.model_used,
    tokens_used: llmResponse.tokens_used
  };
}

// Generate embedding using OpenAI-compatible API
async function generateEmbedding(text) {
  const response = await fetch(process.env.EMBEDDING_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.EMBEDDING_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: process.env.EMBEDDING_MODEL_NAME || 'text-embedding-ada-002',
      input: text
    })
  });
  
  const data = await response.json();
  return data.data[0].embedding;
}

// Vector search using pgvector RPC function
async function vectorSearch(embedding, limit = 5) {
  const { data, error } = await supabase
    .rpc('search_knowledge_base', {
      query_embedding: embedding,
      match_count: limit,
      similarity_threshold: 0.7
    });
  
  if (error) {
    console.error('Vector search error:', error);
    return [];
  }
  
  return data || [];
}

// Fallback keyword search (existing functionality)
async function searchExistingContent(question) {
  const query = question.toLowerCase();
  
  // Search FAQs
  const { data: faqs } = await supabase
    .from('faqs')
    .select('*')
    .or(`question.ilike.%${query}%,answer.ilike.%${query}%`)
    .limit(3);
  
  // Search help articles
  const { data: articles } = await supabase
    .from('help_articles')
    .select('*')
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .limit(3);
  
  // Build answer from found content
  let answer = '';
  if (faqs?.length > 0) {
    answer += 'From our FAQs:\n';
    faqs.forEach(faq => {
      answer += `Q: ${faq.question}\nA: ${faq.answer}\n\n`;
    });
  }
  if (articles?.length > 0) {
    answer += 'From our Help Center:\n';
    articles.forEach(article => {
      answer += `- ${article.title}\n`;
    });
  }
  
  return {
    answer: answer || 'I could not find relevant information. Please contact support@spinr.ca for assistance.',
    related_articles: articles || []
  };
}

// Build context from retrieved knowledge base entries
function buildContext(entries, userType) {
  if (entries.length === 0) return '';
  
  let context = 'Based on our knowledge base:\n\n';
  entries.forEach((entry, index) => {
    context += `${index + 1}. ${entry.title}\n`;
    context += `   ${entry.content}\n`;
    if (entry.category) context += `   Category: ${entry.category}\n`;
    context += '\n';
  });
  
  return context;
}

// Call LLM with context (supports multiple providers)
async function callLLM(question, context, userType) {
  const provider = process.env.LLM_PROVIDER || 'qwen';
  const config = getLLMConfig(provider);
  
  const systemPrompt = `You are a helpful assistant for Spinr, a rideshare platform in Saskatchewan.
You help ${userType === 'driver' ? 'drivers' : 'riders'} with their questions.
Use the provided knowledge base context to answer questions accurately.
If the context doesn't contain the answer, say so politely and suggest contacting support.`;
  
  const userMessage = context
    ? `Context:\n${context}\n\nQuestion: ${question}`
    : question;
  
  const response = await fetch(config.url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 500,
      temperature: 0.7
    })
  });
  
  const data = await response.json();
  return {
    answer: data.choices[0].message.content,
    model_used: config.model,
    tokens_used: data.usage?.total_tokens || 0
  };
}

// Get LLM configuration for a provider
function getLLMConfig(provider) {
  const configs = {
    qwen: {
      url: process.env.LLM_API_URL,
      key: process.env.LLM_API_KEY,
      model: process.env.LLM_MODEL_NAME || 'qwen-3.5'
    },
    kimi: {
      url: process.env.LLM_KIMI_API_URL,
      key: process.env.LLM_KIMI_API_KEY,
      model: 'kimi'
    },
    minmax: {
      url: process.env.LLM_MINMAX_API_URL,
      key: process.env.LLM_MINMAX_API_KEY,
      model: 'minmax'
    },
    'gpt-4': {
      url: 'https://api.openai.com/v1/chat/completions',
      key: process.env.OPENAI_API_KEY,
      model: 'gpt-4'
    },
    'gemini-flash': {
      url: process.env.LLM_GEMINI_API_URL,
      key: process.env.LLM_GEMINI_API_KEY,
      model: 'gemini-flash'
    }
  };
  
  return configs[provider] || configs.qwen;
}
```

---

## UI Components

### 1. Floating Chat Widget
- Appears on all pages (optional toggle)
- Minimizable chat bubble
- Quick access to common questions
- User type selector (Rider/Driver)

### 2. Help Page Integration
- "Ask AI" button in search bar
- AI-powered search results
- Conversation history for logged-in users

### 3. Support Page Integration
- AI chat interface
- Category-aware responses
- Related article suggestions

### 4. Admin Dashboard
- Conversation list with filters
- Conversation detail view
- Knowledge base management
- Analytics dashboard (questions per day, helpfulness ratings)

---

## Environment Variables

```env
# ============================================
# AI AGENT CONFIGURATION
# ============================================

# Primary LLM Provider (qwen, kimi, minmax, gpt-4, gemini-flash)
LLM_PROVIDER=qwen

# Qwen Configuration
LLM_API_URL=https://your-qwen-endpoint.com/v1/chat/completions
LLM_API_KEY=your-qwen-api-key
LLM_MODEL_NAME=qwen-3.5

# Kimi Configuration (Fallback)
LLM_KIMI_API_URL=https://your-kimi-endpoint.com/v1/chat/completions
LLM_KIMI_API_KEY=your-kimi-api-key

# MinMax Configuration
LLM_MINMAX_API_URL=https://your-minmax-endpoint.com/v1/chat/completions
LLM_MINMAX_API_KEY=your-minmax-api-key

# OpenAI GPT-4 Configuration
OPENAI_API_KEY=your-openai-api-key

# Google Gemini Flash Configuration
LLM_GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-flash:generateContent
LLM_GEMINI_API_KEY=your-gemini-api-key

# ============================================
# EMBEDDING CONFIGURATION (for Vector Search)
# ============================================

# Embedding Provider (openai, or self-hosted)
EMBEDDING_PROVIDER=openai
EMBEDDING_API_URL=https://api.openai.com/v1/embeddings
EMBEDDING_API_KEY=your-openai-api-key
EMBEDDING_MODEL_NAME=text-embedding-ada-002

# ============================================
# FEATURE FLAGS
# ============================================

# Enable/disable AI agent
AI_AGENT_ENABLED=true

# Enable fallback to keyword search if AI fails
FALLBACK_TO_KEYWORD_SEARCH=true

# Rate limiting (requests per minute per user)
AGENT_RATE_LIMIT=10

# Max tokens for LLM response
AGENT_MAX_TOKENS=500

# Enable conversation storage
STORE_CONVERSATIONS=true
```

---

## Implementation Steps

### Phase 1: Database Setup
1. Create knowledge_base table
2. Create agent_conversations table
3. Create knowledge_base_entries table
4. Add indexes for performance
5. Set up RLS policies

### Phase 2: API Implementation
1. Create `/api/agent/search` endpoint
2. Implement Qwen LLM integration
3. Implement hybrid search logic
4. Create conversation storage
5. Create feedback endpoint

### Phase 3: Admin Features
1. Create admin conversations page
2. Implement conversation review interface
3. Create knowledge base management UI
4. Add analytics dashboard

### Phase 4: User Interface
1. Create floating chat widget component
2. Integrate AI search into help page
3. Integrate AI search into support page
4. Add user type detection

### Phase 5: Testing & Optimization
1. Test AI responses
2. Test fallback mechanism
3. Optimize response times
4. Add rate limiting
5. Monitor token usage

---

## Key Features

### For Users (Riders/Drivers)
- Natural language question asking
- Instant AI-powered answers
- Related article suggestions
- Conversation history
- Feedback mechanism (helpful/not helpful)

### For Admins
- View all conversations
- Filter by date, user type, source
- Flag conversations for review
- Create knowledge base entries from conversations
- Edit/delete knowledge base entries
- Analytics on question patterns
- Monitor AI performance

### System Features
- Hybrid search (AI + keyword fallback)
- OpenAI-compatible API (easy model switching)
- Conversation storage for audit trail
- Knowledge base management
- Rate limiting to prevent abuse
- Token usage tracking

---

## Cost Optimization

1. **Use Qwen**: Open-source, cost-effective
2. **Cache common answers**: Store frequently asked questions
3. **Rate limiting**: Prevent abuse
4. **Token limits**: Set max tokens per response
5. **Fallback to keyword search**: Reduce LLM calls when possible
6. **Batch processing**: Process multiple questions efficiently

---

## Security Considerations

1. **Rate limiting**: Prevent abuse of AI endpoint
2. **Input sanitization**: Clean user inputs before LLM
3. **Output validation**: Validate AI responses before showing
4. **User authentication**: Optional for conversations
5. **Admin-only access**: Restrict admin features
6. **Data privacy**: Handle user data according to privacy policy

---

## Implementation Details

### Input Sanitization (Security)

Sanitize user input before sending to LLM to prevent prompt injection:

```javascript
// Sanitize user input before sending to LLM
function sanitizeInput(input) {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .slice(0, 1000) // Limit length
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove JS protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/\b(system|assistant|ignore previous|forget instructions)\b/gi, '') // Remove prompt injection attempts
    .replace(/\n{3,}/g, '\n\n'); // Limit newlines
}

// Validate LLM response before showing to user
function validateResponse(response) {
  if (!response || typeof response !== 'string') {
    return 'I apologize, but I could not generate a response. Please try again or contact support.';
  }
  
  // Check for hallucinated contact info
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const phonePattern = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
  
  const emails = response.match(emailPattern) || [];
  const phones = response.match(phonePattern) || [];
  
  // Only allow official Spinr contact info
  const allowedEmails = ['support@spinr.ca', 'help@spinr.ca'];
  const allowedPhones = [];
  
  emails.forEach(email => {
    if (!allowedEmails.includes(email.toLowerCase())) {
      response = response.replace(email, 'support@spinr.ca');
    }
  });
  
  phones.forEach(phone => {
    if (!allowedPhones.includes(phone)) {
      response = response.replace(phone, '');
    }
  });
  
  return response;
}
```

### Caching Strategy (Cost Optimization)

Cache common answers to reduce LLM API calls:

```javascript
// Simple in-memory cache (use Redis for production)
const responseCache = new Map();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

// Generate cache key from question
function getCacheKey(question, userType) {
  const normalized = question.toLowerCase().trim().replace(/\s+/g, ' ');
  return `${userType}:${normalized}`;
}

// Get cached response
function getCachedResponse(question, userType) {
  const key = getCacheKey(question, userType);
  const cached = responseCache.get(key);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.response;
  }
  
  return null;
}

// Set cached response
function setCachedResponse(question, userType, response) {
  const key = getCacheKey(question, userType);
  responseCache.set(key, {
    response,
    timestamp: Date.now()
  });
  
  // Limit cache size
  if (responseCache.size > 1000) {
    const oldestKey = responseCache.keys().next().value;
    responseCache.delete(oldestKey);
  }
}

// Updated search function with caching
async function searchWithHybridApproach(question, userType) {
  const startTime = Date.now();
  const sanitizedQuestion = sanitizeInput(question);
  
  // Check cache first
  const cachedResponse = getCachedResponse(sanitizedQuestion, userType);
  if (cachedResponse) {
    return {
      ...cachedResponse,
      source: 'cache',
      response_time_ms: Date.now() - startTime,
      tokens_used: 0
    };
  }
  
  // Step 1: Try RAG-based AI Agent first
  try {
    const aiResponse = await searchWithRAG(sanitizedQuestion, userType);
    if (aiResponse.success) {
      const validatedAnswer = validateResponse(aiResponse.answer);
      const result = {
        answer: validatedAnswer,
        source: 'ai_agent',
        model_used: aiResponse.model_used,
        response_time_ms: Date.now() - startTime,
        tokens_used: aiResponse.tokens_used
      };
      
      // Cache successful responses
      setCachedResponse(sanitizedQuestion, userType, result);
      return result;
    }
  } catch (error) {
    console.warn('RAG AI agent failed, falling back to keyword search:', error);
  }

  // Step 2: Fallback to existing keyword search
  const fallbackResults = await searchExistingContent(sanitizedQuestion);
  return {
    answer: fallbackResults.answer,
    source: 'fallback_search',
    model_used: null,
    response_time_ms: Date.now() - startTime,
    tokens_used: 0
  };
}
```

### Rate Limiting (Security)

Implement per-user rate limiting to prevent abuse:

```javascript
// Rate limiting implementation
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = parseInt(process.env.AGENT_RATE_LIMIT || '10');

function checkRateLimit(userId) {
  const now = Date.now();
  const userLimits = rateLimitMap.get(userId) || { count: 0, windowStart: now };
  
  // Reset window if expired
  if (now - userLimits.windowStart > RATE_LIMIT_WINDOW) {
    userLimits.count = 0;
    userLimits.windowStart = now;
  }
  
  // Check if limit exceeded
  if (userLimits.count >= RATE_LIMIT_MAX) {
    return {
      allowed: false,
      retryAfter: Math.ceil((RATE_LIMIT_WINDOW - (now - userLimits.windowStart)) / 1000)
    };
  }
  
  // Increment count
  userLimits.count++;
  rateLimitMap.set(userId, userLimits);
  
  return { allowed: true };
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [userId, limits] of rateLimitMap.entries()) {
    if (now - limits.windowStart > RATE_LIMIT_WINDOW * 2) {
      rateLimitMap.delete(userId);
    }
  }
}, RATE_LIMIT_WINDOW);
```

### Monitoring & Logging (Operations)

Log token usage, response times, and error rates:

```javascript
// Monitoring and logging
const metrics = {
  totalRequests: 0,
  aiAgentRequests: 0,
  fallbackRequests: 0,
  cacheHits: 0,
  totalTokensUsed: 0,
  averageResponseTime: 0,
  errors: 0
};

function logMetrics() {
  console.log('📊 AI Agent Metrics:', {
    totalRequests: metrics.totalRequests,
    aiAgentSuccessRate: metrics.totalRequests > 0 
      ? ((metrics.aiAgentRequests / metrics.totalRequests) * 100).toFixed(2) + '%'
      : '0%',
    cacheHitRate: metrics.totalRequests > 0
      ? ((metrics.cacheHits / metrics.totalRequests) * 100).toFixed(2) + '%'
      : '0%',
    averageResponseTime: metrics.averageResponseTime.toFixed(0) + 'ms',
    totalTokensUsed: metrics.totalTokensUsed,
    errors: metrics.errors
  });
}

// Log metrics every 5 minutes
setInterval(logMetrics, 5 * 60 * 1000);

// Update metrics in search function
async function searchWithHybridApproach(question, userType) {
  metrics.totalRequests++;
  const startTime = Date.now();
  
  // ... existing code ...
  
  // Update metrics based on result
  if (result.source === 'cache') {
    metrics.cacheHits++;
  } else if (result.source === 'ai_agent') {
    metrics.aiAgentRequests++;
    metrics.totalTokensUsed += result.tokens_used;
  } else {
    metrics.fallbackRequests++;
  }
  
  // Update average response time
  const responseTime = Date.now() - startTime;
  metrics.averageResponseTime = 
    (metrics.averageResponseTime * (metrics.totalRequests - 1) + responseTime) / metrics.totalRequests;
  
  return result;
}
```

---

## Future Enhancements

1. **Multi-language support**: Support multiple languages
2. **Voice input**: Allow voice questions
3. **Image recognition**: Support image-based queries
4. **Proactive suggestions**: Suggest questions based on context
5. **Integration with mobile app**: Extend to mobile applications
6. **Advanced analytics**: ML-based question pattern analysis

---

## Complete SQL Schema (Ready to Run)

Copy and paste this SQL into your Supabase SQL Editor to create all required tables:

```sql
-- =====================================================
-- AI SEARCH AGENT DATABASE SCHEMA
-- =====================================================
-- Run this script in your Supabase SQL Editor
-- (Supabase Dashboard → SQL Editor → New Query → Paste → Run)
-- =====================================================

-- =====================================================
-- 0. ENABLE PGVECTOR EXTENSION (Required for vector search)
-- =====================================================
CREATE EXTENSION IF NOT EXISTS vector;

-- =====================================================
-- 1. KNOWLEDGE BASE TABLE (with Vector Embeddings)
-- =====================================================
-- Stores knowledge base entries for the AI agent
-- Can be populated manually or from reviewed conversations
CREATE TABLE IF NOT EXISTS public.knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  source TEXT DEFAULT 'manual', -- 'manual', 'faq_import', 'conversation_review'
  embedding vector(1536), -- OpenAI ada-002 embedding dimension (1536 dimensions)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access (for AI agent to reference)
CREATE POLICY "Allow public read access on knowledge_base"
  ON public.knowledge_base FOR SELECT
  USING (true);

-- Policy: Allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to manage knowledge_base"
  ON public.knowledge_base FOR ALL
  USING ((SELECT auth.role()) = 'authenticated');

-- Indexes for faster searches
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON public.knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_tags ON public.knowledge_base USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_active ON public.knowledge_base(is_active);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_source ON public.knowledge_base(source);

-- Vector similarity search index (HNSW for fast approximate nearest neighbor)
-- This enables fast cosine similarity search on embeddings
CREATE INDEX IF NOT EXISTS idx_knowledge_base_embedding ON public.knowledge_base
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- =====================================================
-- 2. AGENT CONVERSATIONS TABLE
-- =====================================================
-- Stores all questions and answers from the AI agent
-- Allows admin to review and improve knowledge base
CREATE TABLE IF NOT EXISTS public.agent_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT, -- Optional: for logged-in users (Supabase auth.uid())
  user_type TEXT CHECK (user_type IN ('rider', 'driver', 'anonymous')),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  source TEXT CHECK (source IN ('ai_agent', 'fallback_search', 'knowledge_base')),
  model_used TEXT, -- e.g., 'qwen-3.5', 'gpt-4', etc.
  tokens_used INTEGER DEFAULT 0,
  response_time_ms INTEGER,
  is_helpful BOOLEAN, -- User feedback (true/false/null)
  feedback_text TEXT, -- Optional user feedback
  needs_review BOOLEAN DEFAULT false, -- Flag for admin review
  reviewed_by TEXT, -- Admin email who reviewed
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.agent_conversations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert conversations (for anonymous users)
CREATE POLICY "Allow anyone to insert conversations"
  ON public.agent_conversations FOR INSERT
  WITH CHECK (true);

-- Policy: Allow users to read their own conversations
CREATE POLICY "Allow users to read own conversations"
  ON public.agent_conversations FOR SELECT
  USING (user_id IS NULL OR user_id = (SELECT auth.uid()::text));

-- Policy: Allow authenticated users (admins) to read all conversations
CREATE POLICY "Allow authenticated users to read all conversations"
  ON public.agent_conversations FOR SELECT
  USING ((SELECT auth.role()) = 'authenticated');

-- Policy: Allow authenticated users to update conversations (for review)
CREATE POLICY "Allow authenticated users to update conversations"
  ON public.agent_conversations FOR UPDATE
  USING ((SELECT auth.role()) = 'authenticated');

-- Policy: Allow authenticated users to delete conversations
CREATE POLICY "Allow authenticated users to delete conversations"
  ON public.agent_conversations FOR DELETE
  USING ((SELECT auth.role()) = 'authenticated');

-- Indexes for admin queries and analytics
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON public.agent_conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_user_type ON public.agent_conversations(user_type);
CREATE INDEX IF NOT EXISTS idx_conversations_needs_review ON public.agent_conversations(needs_review);
CREATE INDEX IF NOT EXISTS idx_conversations_source ON public.agent_conversations(source);
CREATE INDEX IF NOT EXISTS idx_conversations_is_helpful ON public.agent_conversations(is_helpful);

-- =====================================================
-- 3. KNOWLEDGE BASE ENTRIES TABLE
-- =====================================================
-- Stores approved Q&A pairs from conversations
-- These can be used to improve AI responses
CREATE TABLE IF NOT EXISTS public.knowledge_base_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.agent_conversations(id) ON DELETE SET NULL,
  question_pattern TEXT NOT NULL, -- Pattern or example question
  answer_template TEXT NOT NULL, -- Template answer
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  is_approved BOOLEAN DEFAULT false,
  approved_by TEXT, -- Admin email
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.knowledge_base_entries ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to manage entries
CREATE POLICY "Allow authenticated users to manage knowledge_base_entries"
  ON public.knowledge_base_entries FOR ALL
  USING ((SELECT auth.role()) = 'authenticated');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_kb_entries_conversation ON public.knowledge_base_entries(conversation_id);
CREATE INDEX IF NOT EXISTS idx_kb_entries_approved ON public.knowledge_base_entries(is_approved);
CREATE INDEX IF NOT EXISTS idx_kb_entries_category ON public.knowledge_base_entries(category);

-- =====================================================
-- 4. INSERT SAMPLE KNOWLEDGE BASE ENTRIES
-- =====================================================
-- Pre-populate with common questions from existing FAQs
INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
  (
    'How to request a refund',
    'To request a refund for a trip, go to your trip history in the app, select the trip, and tap "Report an Issue" to request a refund. Refunds are typically processed within 5-7 business days.',
    'rider',
    ARRAY['refund', 'payment', 'trip', 'issue'],
    'faq_import'
  ),
  (
    'Driver earnings and commission',
    'Drivers keep 100% of the fare. Spinr charges 0% commission. We make money through the flat $1 fee charged to riders, not by taking from your earnings. Weekly payouts happen every Tuesday directly to your bank account.',
    'driver',
    ARRAY['earnings', 'commission', 'payout', 'payment'],
    'faq_import'
  ),
  (
    'Where Spinr is available',
    'Spinr is currently available in Saskatoon, Saskatchewan. We plan to expand to more communities soon.',
    'general',
    ARRAY['location', 'availability', 'cities', 'saskatoon'],
    'faq_import'
  ),
  (
    'How much does a ride cost',
    'You pay the driver''s rate plus a flat $1 platform fee. There''s no surge pricing - the price you see is the price you pay. The fare is calculated based on distance and time.',
    'rider',
    ARRAY['pricing', 'cost', 'fare', 'fee'],
    'faq_import'
  ),
  (
    'Vehicle requirements for drivers',
    'You need a 2015 or newer vehicle with 4 doors, in good condition with valid insurance. The vehicle must pass a safety inspection.',
    'driver',
    ARRAY['vehicle', 'requirements', 'car', 'inspection'],
    'faq_import'
  ),
  (
    'Required documents for drivers',
    'To drive with Spinr, you need: Valid driver''s license, vehicle registration, proof of insurance, and a background check clearance.',
    'driver',
    ARRAY['documents', 'license', 'registration', 'insurance', 'background'],
    'faq_import'
  ),
  (
    'How to update payment method',
    'In the app menu, go to Wallet > Payment Methods to add or remove cards. You can add credit/debit cards, and set a default payment method.',
    'rider',
    ARRAY['payment', 'wallet', 'card', 'update'],
    'faq_import'
  ),
  (
    'Safety guidelines',
    'For riders: Always verify your driver''s name, photo, and license plate before getting in. Use the "Share ride status" feature to let friends track your trip. Sit in the back seat and always wear your seatbelt.',
    'safety',
    ARRAY['safety', 'guidelines', 'verification', 'tracking'],
    'faq_import'
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 5. CREATE RPC FUNCTION FOR VECTOR SEARCH
-- =====================================================
-- This function performs vector similarity search using pgvector
-- It's called from the JavaScript code via supabase.rpc()
CREATE OR REPLACE FUNCTION search_knowledge_base(
  query_embedding vector(1536),
  match_count INT DEFAULT 5,
  similarity_threshold FLOAT DEFAULT 0.7
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  category TEXT,
  tags TEXT[],
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kb.id,
    kb.title,
    kb.content,
    kb.category,
    kb.tags,
    1 - (kb.embedding <=> query_embedding) AS similarity
  FROM public.knowledge_base kb
  WHERE kb.is_active = true
    AND kb.embedding IS NOT NULL
    AND 1 - (kb.embedding <=> query_embedding) > similarity_threshold
  ORDER BY kb.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Grant execute permission to anon and authenticated users
GRANT EXECUTE ON FUNCTION search_knowledge_base TO anon;
GRANT EXECUTE ON FUNCTION search_knowledge_base TO authenticated;

-- =====================================================
-- 6. CREATE FUNCTION TO UPDATE UPDATED_AT TIMESTAMP
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for knowledge_base table
DROP TRIGGER IF EXISTS update_knowledge_base_updated_at ON public.knowledge_base;
CREATE TRIGGER update_knowledge_base_updated_at
  BEFORE UPDATE ON public.knowledge_base
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
SELECT 'AI Agent database schema created successfully! ✅' as status;
```

---

## Quick Start Checklist

- [ ] Run the SQL schema above in Supabase SQL Editor
- [ ] Add environment variables to `.env.local`:
  ```env
  LLM_API_URL=https://your-qwen-endpoint.com/v1/chat/completions
  LLM_API_KEY=your-api-key
  LLM_MODEL_NAME=qwen-3.5
  AI_AGENT_ENABLED=true
  FALLBACK_TO_KEYWORD_SEARCH=true
  ```
- [ ] Create API endpoint: `app/api/agent/search/route.js`
- [ ] Create admin page: `app/spinr-internal/agent-conversations/page.js`
- [ ] Create chat widget: `components/ai/ChatWidget.js`
- [ ] Integrate AI search into help/support pages
- [ ] Test with sample questions
- [ ] Monitor conversations in admin dashboard
