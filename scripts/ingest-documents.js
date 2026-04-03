/**
 * SPINR Knowledge Base - Document Ingestion Script
 * =================================================
 * Reads .docx files from spinrhelpfiles/, chunks them,
 * generates embeddings via DashScope, and stores in Supabase.
 *
 * USAGE:
 *   node scripts/ingest-documents.js              # ingest docs without embeddings
 *   node scripts/ingest-documents.js --force       # re-ingest everything
 *   node scripts/ingest-documents.js --file "X.docx" # ingest single file
 */

const { createClient } = require('@supabase/supabase-js')
const { RecursiveCharacterTextSplitter } = require('@langchain/textsplitters')
const mammoth = require('mammoth')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

// Load .env.local
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env.local') })

// Config
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const EMBEDDING_API_URL = process.env.EMBEDDING_API_URL || 'https://api.openai.com/v1/embeddings'
const EMBEDDING_API_KEY = process.env.EMBEDDING_API_KEY || process.env.OPENAI_API_KEY
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL_NAME || 'text-embedding-v4'
const DOCS_DIR = path.resolve(__dirname, '..', 'spinrhelpfiles')

// Validate
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase config. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
  process.exit(1)
}
if (!EMBEDDING_API_KEY) {
  console.error('Missing embedding API key. Set EMBEDDING_API_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Derive category from filename
// SPINR-WCM-07-D* = driver, SPINR-WCM-07-R* = rider
function deriveCategory(filename) {
  if (filename.includes('-D0') || filename.includes('-D1')) return 'driver'
  if (filename.includes('-R0') || filename.includes('-R1')) return 'rider'
  return 'general'
}

// Derive human-readable title from filename
// SPINR-WCM-07-D01_Driver_Getting_Started_v1.0.docx -> "Driver Getting Started"
function deriveTitle(filename) {
  const name = path.basename(filename, '.docx')
  const parts = name.split('_')
  // Skip the first part (SPINR-WCM-07-D01) and version (v1.0)
  const meaningful = parts.slice(1).filter(p => !p.match(/^v\d/))
  return meaningful.join(' ').replace(/_/g, ' ')
}

// Generate embedding for text
async function generateEmbedding(text) {
  const res = await fetch(EMBEDDING_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${EMBEDDING_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: text.slice(0, 8000) })
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Embedding API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  if (data.data && data.data[0] && data.data[0].embedding) return data.data[0].embedding
  if (data.embedding) return data.embedding
  throw new Error('Unexpected embedding response format')
}

async function main() {
  const forceRegenerate = process.argv.includes('--force')
  const singleFileArg = process.argv.find((a, i) => process.argv[i - 1] === '--file')

  console.log('Spinr Document Ingestion')
  console.log('========================')
  console.log(`Docs directory: ${DOCS_DIR}`)
  console.log(`Embedding model: ${EMBEDDING_MODEL}`)
  if (forceRegenerate) console.log('Force mode: ON')
  console.log('')

  // Get list of .docx files
  let files
  if (singleFileArg) {
    const fullPath = path.resolve(DOCS_DIR, singleFileArg)
    if (!fs.existsSync(fullPath)) {
      console.error(`File not found: ${fullPath}`)
      process.exit(1)
    }
    files = [singleFileArg]
  } else {
    files = fs.readdirSync(DOCS_DIR).filter(f => f.endsWith('.docx'))
  }

  if (files.length === 0) {
    console.log('No .docx files found in ' + DOCS_DIR)
    return
  }

  console.log(`Found ${files.length} .docx files to process.\n`)

  // Set up text splitter
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1200,
    chunkOverlap: 200,
    separators: ['\n\n', '\n', '. ', ' ']
  })

  // Clear existing docx-ingested entries if force mode
  if (forceRegenerate) {
    console.log('Clearing existing docx_ingestion entries...')
    const { error } = await supabase
      .from('knowledge_base')
      .delete()
      .eq('source', 'docx_ingestion')
    if (error) console.warn('Warning: could not clear existing entries:', error.message)
    else console.log('Cleared.\n')
  }

  let totalChunks = 0
  let totalSuccess = 0
  let totalFailed = 0

  for (const file of files) {
    const filePath = path.join(DOCS_DIR, file)
    const category = deriveCategory(file)
    const docTitle = deriveTitle(file)

    console.log(`Processing: ${file}`)
    console.log(`  Category: ${category}, Title: ${docTitle}`)

    // Extract text from docx using mammoth
    let text
    try {
      const result = await mammoth.extractRawText({ path: filePath })
      text = result.value
    } catch (err) {
      console.error(`  Failed to read ${file}: ${err.message}`)
      totalFailed++
      continue
    }

    if (!text || text.trim().length === 0) {
      console.log(`  Skipping — empty document`)
      continue
    }

    // Chunk the text
    const chunks = await splitter.splitText(text)
    console.log(`  Split into ${chunks.length} chunks`)

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      // Prepend document title for context
      const chunkTitle = `${docTitle} (Part ${i + 1}/${chunks.length})`
      const embeddingText = `${docTitle}. ${chunk}`

      try {
        process.stdout.write(`  [${i + 1}/${chunks.length}] Embedding... `)

        const embedding = await generateEmbedding(embeddingText)

        const { error: insertError } = await supabase
          .from('knowledge_base')
          .insert({
            id: uuidv4(),
            title: chunkTitle,
            content: chunk,
            category: category,
            tags: [category, docTitle.toLowerCase()],
            source: 'docx_ingestion',
            embedding: embedding,
            is_active: true
          })

        if (insertError) {
          console.log(`FAIL (DB): ${insertError.message}`)
          totalFailed++
        } else {
          console.log(`OK (${embedding.length}d)`)
          totalSuccess++
        }

        totalChunks++

        // Rate limit: 200ms between embedding calls
        await new Promise(resolve => setTimeout(resolve, 200))

      } catch (err) {
        console.log(`FAIL: ${err.message}`)
        totalFailed++
        totalChunks++
      }
    }

    console.log('')
  }

  console.log('========================')
  console.log(`Total chunks processed: ${totalChunks}`)
  console.log(`Successful: ${totalSuccess}`)
  if (totalFailed > 0) console.log(`Failed: ${totalFailed}`)

  // Final count
  const { count } = await supabase
    .from('knowledge_base')
    .select('*', { count: 'exact', head: true })
    .not('embedding', 'is', null)
  console.log(`Total KB entries with embeddings: ${count}`)
  console.log('\nDone!')
}

main().catch(err => {
  console.error('Fatal error:', err.message)
  process.exit(1)
})
