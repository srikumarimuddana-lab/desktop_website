/**
 * SPINR Knowledge Base - Embedding Generator
 * ============================================
 * This script generates embeddings for all knowledge_base entries
 * that don't have embeddings yet and stores them in Supabase.
 * 
 * USAGE:
 *   node scripts/generate-embeddings.js
 * 
 * PREREQUISITES:
 *   1. Run knowledge_base_seed.sql in Supabase SQL Editor first
 *   2. Set environment variables in .env.local
 *   3. npm install dotenv @supabase/supabase-js (if not installed)
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Load environment variables from .env.local
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env.local') });

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const EMBEDDING_API_URL = process.env.EMBEDDING_API_URL || 'https://api.openai.com/v1/embeddings';
const EMBEDDING_API_KEY = process.env.EMBEDDING_API_KEY || process.env.OPENAI_API_KEY;
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL_NAME || 'text-embedding-ada-002';

// Validate configuration
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase configuration. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

if (!EMBEDDING_API_KEY) {
  console.error('❌ Missing embedding API key. Please set EMBEDDING_API_KEY or OPENAI_API_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Generate embedding for a given text using the configured embedding API
 */
async function generateEmbedding(text) {
  const response = await fetch(EMBEDDING_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${EMBEDDING_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: text.slice(0, 8000) // Truncate to avoid token limits
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Embedding API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();

  // Handle multiple response formats
  if (data.data && data.data[0] && data.data[0].embedding) {
    return data.data[0].embedding;
  } else if (data.embedding) {
    return data.embedding;
  } else if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
    return data[0];
  }

  throw new Error('Unexpected embedding response format: ' + JSON.stringify(data).slice(0, 200));
}

/**
 * Main function - fetch entries without embeddings and generate them
 */
async function main() {
  console.log('🚀 Spinr Knowledge Base Embedding Generator');
  console.log('============================================');
  console.log(`📡 Supabase URL: ${SUPABASE_URL}`);
  console.log(`🧠 Embedding API: ${EMBEDDING_API_URL}`);
  console.log(`📦 Embedding Model: ${EMBEDDING_MODEL}`);
  console.log('');

  // Fetch all entries without embeddings
  const { data: entries, error: fetchError } = await supabase
    .from('knowledge_base')
    .select('id, title, content, category, tags')
    .is('embedding', null)
    .eq('source', 'website_analysis')
    .order('created_at', { ascending: true });

  if (fetchError) {
    console.error('❌ Failed to fetch knowledge base entries:', fetchError.message);
    process.exit(1);
  }

  if (!entries || entries.length === 0) {
    console.log('✅ All entries already have embeddings. Nothing to do!');
    
    // Show total count
    const { count } = await supabase
      .from('knowledge_base')
      .select('*', { count: 'exact', head: true })
      .eq('source', 'website_analysis');
    console.log(`📊 Total entries in knowledge base: ${count}`);
    return;
  }

  console.log(`📝 Found ${entries.length} entries without embeddings.\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const embeddingText = `${entry.title}. ${entry.content}`;

    try {
      process.stdout.write(`  [${i + 1}/${entries.length}] ${entry.title}... `);
      
      const embedding = await generateEmbedding(embeddingText);

      // Update the entry with the embedding
      const { error: updateError } = await supabase
        .from('knowledge_base')
        .update({ embedding: embedding })
        .eq('id', entry.id);

      if (updateError) {
        console.log(`❌ DB update failed: ${updateError.message}`);
        failed++;
      } else {
        console.log(`✅ (${embedding.length}d)`);
        success++;
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));

    } catch (err) {
      console.log(`❌ ${err.message}`);
      failed++;
    }
  }

  console.log('\n============================================');
  console.log(`✅ Successfully embedded: ${success}/${entries.length}`);
  if (failed > 0) {
    console.log(`❌ Failed: ${failed}/${entries.length}`);
  }

  // Final count
  const { count } = await supabase
    .from('knowledge_base')
    .select('*', { count: 'exact', head: true })
    .eq('source', 'website_analysis')
    .not('embedding', 'is', null);
  console.log(`📊 Total entries with embeddings: ${count}`);
  console.log('\n🎉 Done! Your AI agent should now return accurate answers.');
}

main().catch(err => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
