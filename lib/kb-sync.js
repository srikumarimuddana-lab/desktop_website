import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { getEmbeddings } from '@/lib/langchain'
import { v4 as uuidv4 } from 'uuid'

/**
 * Strip HTML tags from content for cleaner embeddings.
 * Help articles use Tiptap HTML; we need plain text for embedding quality.
 */
function stripHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
}

/**
 * Sync a CMS record (FAQ or help article) to the AI knowledge base.
 * Generates an embedding and upserts into the knowledge_base table.
 * Fire-and-forget — errors are logged but never thrown.
 *
 * @param {string} sourceType - 'cms_faq' or 'cms_article'
 * @param {string} sourceId - The UUID of the FAQ or article
 * @param {string} title - The question (FAQ) or title (article)
 * @param {string} content - The answer (FAQ) or article content (may contain HTML)
 * @param {string} category - Category string
 */
export async function syncToKB(sourceType, sourceId, title, content, category) {
  try {
    if (!isSupabaseConfigured()) return

    const cleanContent = stripHtml(content)
    if (!cleanContent) {
      console.warn('[KB Sync] Empty content, skipping sync for', sourceType, sourceId)
      return
    }

    const prefix = sourceType === 'cms_faq' ? 'FAQ' : 'Help'
    const kbTitle = `${prefix}: ${title}`
    const embeddingText = `${kbTitle}. ${cleanContent}`

    // Generate embedding
    const embedding = await getEmbeddings().embedQuery(embeddingText)

    // Check if entry already exists
    const { data: existing } = await supabase
      .from('knowledge_base')
      .select('id')
      .eq('source', sourceType)
      .eq('source_id', sourceId)
      .maybeSingle()

    if (existing) {
      // Update existing entry
      const { error } = await supabase
        .from('knowledge_base')
        .update({
          title: kbTitle,
          content: cleanContent,
          category: category || 'general',
          tags: [sourceType === 'cms_faq' ? 'faq' : 'help-article', category || 'general'],
          embedding: embedding,
          is_active: true
        })
        .eq('id', existing.id)

      if (error) {
        console.error('[KB Sync] Update failed:', error.message)
      } else {
        console.log('[KB Sync] Updated KB entry for', sourceType, sourceId)
      }
    } else {
      // Insert new entry
      const { error } = await supabase
        .from('knowledge_base')
        .insert({
          id: uuidv4(),
          title: kbTitle,
          content: cleanContent,
          category: category || 'general',
          tags: [sourceType === 'cms_faq' ? 'faq' : 'help-article', category || 'general'],
          source: sourceType,
          source_id: sourceId,
          embedding: embedding,
          is_active: true
        })

      if (error) {
        console.error('[KB Sync] Insert failed:', error.message)
      } else {
        console.log('[KB Sync] Created KB entry for', sourceType, sourceId)
      }
    }
  } catch (err) {
    console.error('[KB Sync] syncToKB error:', err.message)
  }
}

/**
 * Delete a CMS record's corresponding KB entry.
 * Fire-and-forget — errors are logged but never thrown.
 *
 * @param {string} sourceType - 'cms_faq' or 'cms_article'
 * @param {string} sourceId - The UUID of the FAQ or article
 */
export async function deleteFromKB(sourceType, sourceId) {
  try {
    if (!isSupabaseConfigured()) return

    const { error } = await supabase
      .from('knowledge_base')
      .delete()
      .eq('source', sourceType)
      .eq('source_id', sourceId)

    if (error) {
      console.error('[KB Sync] Delete failed:', error.message)
    } else {
      console.log('[KB Sync] Deleted KB entry for', sourceType, sourceId)
    }
  } catch (err) {
    console.error('[KB Sync] deleteFromKB error:', err.message)
  }
}
