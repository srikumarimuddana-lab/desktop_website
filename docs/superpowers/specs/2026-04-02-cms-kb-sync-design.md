# CMS Auto-Sync to AI Knowledge Base

**Date:** 2026-04-02
**Status:** Approved
**Scope:** Auto-sync FAQ and help article CRUD operations to the AI knowledge base with embeddings

---

## Problem Statement

When admins create, update, or delete FAQs and help articles via the CMS (`/spinr-internal`), the AI chat agent's knowledge base doesn't reflect those changes. Admins must manually re-run the ingestion script or edit SQL to keep the AI up to date.

## Goals

- Automatically sync FAQ and help article content to `knowledge_base` on every create/update/delete
- Sync happens immediately on save (~1-2 second delay acceptable)
- If sync fails, the CMS save still succeeds (fire-and-forget)
- KB entries from CMS are tracked separately via `source` and `source_id` fields
- No new infrastructure — uses existing DashScope embedding endpoint

## Non-Goals

- Syncing legal documents (deferred)
- Syncing SEO pages (not needed for AI)
- Background queue or retry mechanism (overkill for admin volume)
- Admin UI for viewing sync status

---

## Architecture

### New Module: `lib/kb-sync.js`

Exports two functions:

**`syncToKB(sourceType, sourceId, title, content, category)`**
1. Generates embedding from `"{title}. {content}"` using `getEmbeddings()` from `lib/langchain.js`
2. Upserts into `knowledge_base` matching on `source = sourceType` AND `source_id = sourceId`
3. If no existing entry, inserts new row
4. If existing entry found, updates title, content, category, tags, embedding
5. Sets `is_active = true`

**`deleteFromKB(sourceType, sourceId)`**
1. Deletes from `knowledge_base` where `source = sourceType` AND `source_id = sourceId`

Both functions are async and fire-and-forget — errors are logged but not thrown.

### KB Entry Format

| Field | FAQ Value | Help Article Value |
|-------|-----------|-------------------|
| `title` | `"FAQ: {question}"` | `"Help: {article_title}"` |
| `content` | The answer text | The article content (HTML stripped) |
| `category` | FAQ category field | Article category_id |
| `tags` | `['faq', category]` | `['help-article', category_id]` |
| `source` | `cms_faq` | `cms_article` |
| `source_id` | FAQ UUID | Article UUID |
| `embedding` | Generated from title + content | Generated from title + content |
| `is_active` | `true` | `true` |

### Database Change

Add `source_id` column to `knowledge_base` for matching CMS records to KB entries:

```sql
ALTER TABLE public.knowledge_base ADD COLUMN IF NOT EXISTS source_id TEXT;
CREATE INDEX IF NOT EXISTS idx_kb_source_id ON public.knowledge_base(source, source_id);
```

### Integration Points in `app/api/[[...path]]/route.js`

**FAQ Operations:**
- POST `/api/faqs` (line ~420): after successful Supabase insert → `syncToKB('cms_faq', data.id, data.question, data.answer, data.category)`
- PUT `/api/faqs/:id` (line ~450): after successful Supabase update → `syncToKB('cms_faq', id, body.question, body.answer, body.category)`
- DELETE `/api/faqs/:id`: after successful Supabase delete → `deleteFromKB('cms_faq', id)`

**Help Article Operations:**
- POST `/api/help-articles` (line ~572): after successful Supabase insert → `syncToKB('cms_article', data.id, data.title, data.content, data.category_id)`
- PUT `/api/help-articles/:id` (line ~600): after successful Supabase update → `syncToKB('cms_article', id, body.title, body.content, body.category_id)`
- DELETE `/api/help-articles/:id`: after successful Supabase delete → `deleteFromKB('cms_article', id)`

### Error Handling

- `syncToKB` and `deleteFromKB` wrap all operations in try-catch
- On failure: `console.error('[KB Sync] ...')` with details
- CMS operation (the FAQ/article save) is NOT affected by sync failure
- Admin can re-save the item to retry sync

### Help Article Content

Help article `content` field contains HTML from the Tiptap editor. Before embedding, HTML tags should be stripped to get clean text for better embedding quality. Use a simple regex strip: `content.replace(/<[^>]*>/g, '')`.

---

## Files

| File | Action | Purpose |
|------|--------|---------|
| `desktop_website/lib/kb-sync.js` | Create | `syncToKB()` and `deleteFromKB()` functions |
| `desktop_website/supabase/cms_sync_migration.sql` | Create | Add `source_id` column + index |
| `desktop_website/app/api/[[...path]]/route.js` | Modify | Add sync calls after FAQ/article CRUD operations |

---

## Success Criteria

1. Creating a FAQ in admin panel → immediately queryable by AI chat agent
2. Updating a FAQ → AI agent returns updated content
3. Deleting a FAQ → AI agent no longer references it
4. Same for help articles
5. CMS saves complete successfully even if sync fails
