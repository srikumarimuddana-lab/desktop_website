# CMS Auto-Sync to AI Knowledge Base Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Automatically sync FAQ and help article create/update/delete operations to the AI knowledge base with embeddings, so the chat agent always has up-to-date content.

**Architecture:** A new `lib/kb-sync.js` module provides `syncToKB()` and `deleteFromKB()` functions. These are called fire-and-forget after successful Supabase operations in the existing catch-all API route. A `source_id` column is added to `knowledge_base` to link KB entries back to their CMS source records.

**Tech Stack:** Supabase (PostgreSQL), LangChain OpenAIEmbeddings (DashScope), Next.js API routes

**Spec:** `docs/superpowers/specs/2026-04-02-cms-kb-sync-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `desktop_website/supabase/cms_sync_migration.sql` | Create | Add `source_id` column + index to `knowledge_base` |
| `desktop_website/lib/kb-sync.js` | Create | `syncToKB()` and `deleteFromKB()` — embedding + upsert/delete |
| `desktop_website/app/api/[[...path]]/route.js` | Modify | Add import + sync calls after 6 CRUD operations |

---

## Task 1: SQL Migration

**Files:**
- Create: `desktop_website/supabase/cms_sync_migration.sql`

- [ ] **Step 1: Create the migration file**

Create `desktop_website/supabase/cms_sync_migration.sql`:

```sql
-- =====================================================
-- CMS SYNC MIGRATION
-- Adds source_id column to knowledge_base for linking
-- CMS records (FAQs, help articles) to KB entries
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Add source_id column for matching CMS records to KB entries
ALTER TABLE public.knowledge_base
ADD COLUMN IF NOT EXISTS source_id TEXT;

-- 2. Create composite index for fast lookups by source + source_id
CREATE INDEX IF NOT EXISTS idx_kb_source_id
ON public.knowledge_base(source, source_id);

-- 3. Verify
SELECT 'cms_sync migration complete' AS status;
```

- [ ] **Step 2: Commit**

```bash
cd desktop_website && git add supabase/cms_sync_migration.sql && git commit -m "feat: add cms_sync SQL migration with source_id column"
```

- [ ] **Step 3: Run in Supabase SQL Editor**

Open Supabase dashboard → SQL Editor → paste contents → Run.
Expected: "cms_sync migration complete".

---

## Task 2: Create KB Sync Module

**Files:**
- Create: `desktop_website/lib/kb-sync.js`

- [ ] **Step 1: Create `desktop_website/lib/kb-sync.js`**

```javascript
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
```

- [ ] **Step 2: Commit**

```bash
cd desktop_website && git add lib/kb-sync.js && git commit -m "feat: add KB sync module for CMS auto-sync"
```

---

## Task 3: Hook Into API Route — FAQ Operations

**Files:**
- Modify: `desktop_website/app/api/[[...path]]/route.js`

This task adds the import and hooks sync calls into the 3 FAQ operations (POST, PUT, DELETE).

- [ ] **Step 1: Add the import**

At the top of `desktop_website/app/api/[[...path]]/route.js`, after line 3 (`import { createClient } from '@supabase/supabase-js'`), add:

```javascript
import { syncToKB, deleteFromKB } from '@/lib/kb-sync'
```

- [ ] **Step 2: Hook FAQ POST (after line 420)**

Find this block (around line 419-420):
```javascript
        return handleCORS(NextResponse.json(data))
      }

      demoFaqs.unshift(newFaq)
```

Replace with:
```javascript
        // Sync to AI knowledge base (fire-and-forget)
        syncToKB('cms_faq', data.id, data.question, data.answer, data.category)
        return handleCORS(NextResponse.json(data))
      }

      demoFaqs.unshift(newFaq)
```

- [ ] **Step 3: Hook FAQ PUT (after line 458)**

Find this block (around line 455-458):
```javascript
        if (!data) {
          return handleCORS(NextResponse.json({ error: 'FAQ not found' }, { status: 404 }))
        }
        return handleCORS(NextResponse.json(data))
      }
```

Replace with:
```javascript
        if (!data) {
          return handleCORS(NextResponse.json({ error: 'FAQ not found' }, { status: 404 }))
        }
        // Sync to AI knowledge base (fire-and-forget)
        syncToKB('cms_faq', id, body.question, body.answer, body.category)
        return handleCORS(NextResponse.json(data))
      }
```

- [ ] **Step 4: Hook FAQ DELETE (after line 488)**

Find this block (around line 487-488):
```javascript
        if (error) {
          console.error('Supabase error:', error)
          return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
        }
        return handleCORS(NextResponse.json({ success: true }))
      }
```

Replace with:
```javascript
        if (error) {
          console.error('Supabase error:', error)
          return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
        }
        // Delete from AI knowledge base (fire-and-forget)
        deleteFromKB('cms_faq', id)
        return handleCORS(NextResponse.json({ success: true }))
      }
```

- [ ] **Step 5: Commit**

```bash
cd desktop_website && git add app/api/\[\[...path\]\]/route.js && git commit -m "feat: auto-sync FAQ operations to AI knowledge base"
```

---

## Task 4: Hook Into API Route — Help Article Operations

**Files:**
- Modify: `desktop_website/app/api/[[...path]]/route.js`

This task hooks sync calls into the 3 help article operations (POST, PUT, DELETE).

- [ ] **Step 1: Hook Help Article POST (after line 572)**

Find this block (around line 570-572):
```javascript
        if (error) {
          console.error('Supabase error:', error)
          return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
        }
        return handleCORS(NextResponse.json(data))
      }
```
(This is the help article POST success path)

Replace the `return handleCORS(NextResponse.json(data))` line with:
```javascript
        // Sync to AI knowledge base (fire-and-forget)
        syncToKB('cms_article', data.id, data.title, data.content, data.category_id)
        return handleCORS(NextResponse.json(data))
```

- [ ] **Step 2: Hook Help Article PUT (after line 613)**

Find this block (around line 610-613):
```javascript
        if (!data) {
          return handleCORS(NextResponse.json({ error: 'Article not found' }, { status: 404 }))
        }
        return handleCORS(NextResponse.json(data))
      }
```

Replace with:
```javascript
        if (!data) {
          return handleCORS(NextResponse.json({ error: 'Article not found' }, { status: 404 }))
        }
        // Sync to AI knowledge base (fire-and-forget)
        syncToKB('cms_article', id, body.title, body.content, body.category_id)
        return handleCORS(NextResponse.json(data))
      }
```

- [ ] **Step 3: Hook Help Article DELETE (after line 637)**

Find this block (around line 636-637):
```javascript
        if (error) {
          console.error('Supabase error:', error)
          return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
        }
        return handleCORS(NextResponse.json({ success: true }))
      }
```
(This is the help article DELETE success path)

Replace with:
```javascript
        if (error) {
          console.error('Supabase error:', error)
          return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
        }
        // Delete from AI knowledge base (fire-and-forget)
        deleteFromKB('cms_article', id)
        return handleCORS(NextResponse.json({ success: true }))
      }
```

- [ ] **Step 4: Commit**

```bash
cd desktop_website && git add app/api/\[\[...path\]\]/route.js && git commit -m "feat: auto-sync help article operations to AI knowledge base"
```

---

## Task 5: Verification

No files to change — testing task.

- [ ] **Step 1: Start dev server**

```bash
cd desktop_website && npm run dev
```

- [ ] **Step 2: Test FAQ create sync**

Go to `/spinr-internal/faqs`, create a new FAQ:
- Question: "How do I use a coupon code?"
- Answer: "Enter your coupon code in the promo field before confirming your ride. The discount will be applied to your fare automatically."
- Category: "rider"

After saving, open the chat widget and ask "how do I use a coupon code?". Expected: the AI agent returns the answer you just entered.

- [ ] **Step 3: Test FAQ update sync**

Edit the FAQ you just created. Change the answer to include "Coupon codes are case-insensitive." Save.

Ask the chat widget "are coupon codes case sensitive?". Expected: the AI agent mentions they are case-insensitive.

- [ ] **Step 4: Test FAQ delete sync**

Delete the test FAQ. Ask the chat widget "how do I use a coupon code?" again. Expected: the AI agent no longer has specific coupon info and falls back to a generic response.

- [ ] **Step 5: Test help article create sync**

Go to `/spinr-internal/help-articles`, create a new article. After saving, verify it's queryable via the chat widget.

- [ ] **Step 6: Check Vercel logs**

After deploying, check Vercel runtime logs for `[KB Sync]` messages confirming sync operations.

- [ ] **Step 7: Push and deploy**

```bash
cd desktop_website && git push origin main
```
