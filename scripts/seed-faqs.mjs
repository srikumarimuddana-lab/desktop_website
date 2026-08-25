#!/usr/bin/env node
/*
 * Copy the backend's FAQ set into this website's `faqs` table.
 *
 * This is a STOPGAP, not the intended architecture — see docs/faq-parity.md.
 * The backend (spinrvm) owns FAQ content; the right fix is a public read-only
 * FAQ endpoint there that this site fetches. Until that exists, this script
 * copies the rows so the help centre and the assistant stop being empty.
 *
 * It is idempotent: rows are matched on the question text and updated in
 * place, so re-running after a backend edit syncs rather than duplicates.
 * Nothing is ever deleted — a question retired in the backend is reported and
 * left alone, because the website CMS may have edited it deliberately.
 *
 * Usage:
 *   BACKEND_SUPABASE_URL=...  BACKEND_SUPABASE_SERVICE_KEY=... \
 *   NEXT_PUBLIC_SUPABASE_URL=... SITE_SUPABASE_SERVICE_KEY=... \
 *   node scripts/seed-faqs.mjs [--dry-run]
 *
 * The two service keys are different projects: the first is the mobile-app
 * backend (read), the second is this website (write). Read-only against the
 * backend by construction — this script issues no writes there.
 */

const DRY = process.argv.includes('--dry-run')

const SRC_URL = process.env.BACKEND_SUPABASE_URL
const SRC_KEY = process.env.BACKEND_SUPABASE_SERVICE_KEY
const DST_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const DST_KEY = process.env.SITE_SUPABASE_SERVICE_KEY

for (const [name, v] of Object.entries({
  BACKEND_SUPABASE_URL: SRC_URL,
  BACKEND_SUPABASE_SERVICE_KEY: SRC_KEY,
  NEXT_PUBLIC_SUPABASE_URL: DST_URL,
  SITE_SUPABASE_SERVICE_KEY: DST_KEY,
})) {
  if (!v) {
    console.error(`Missing ${name}. See the header of this file.`)
    process.exit(1)
  }
}

/* Questions the backend carries twice. Seeding both would copy the duplication
 * into a second database; see the duplicates table in docs/faq-parity.md. */
const DROP = new Set([
  'what is the criminal record check requirement?',
  'when and how do i get paid?',
])

const rest = async (base, key, path, init = {}) => {
  const res = await fetch(`${base.replace(/\/+$/, '')}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  })
  if (!res.ok) throw new Error(`${path} -> ${res.status} ${await res.text()}`)
  return res.status === 204 ? null : res.json()
}

const main = async () => {
  const source = await rest(
    SRC_URL, SRC_KEY,
    'faqs?is_active=eq.true&select=question,answer,category,audience&order=audience,category'
  )
  const incoming = source.filter((r) => !DROP.has(String(r.question).trim().toLowerCase()))
  console.log(`backend: ${source.length} active, ${incoming.length} after dropping known duplicates`)

  const existing = await rest(DST_URL, DST_KEY, 'faqs?select=id,question,answer,category,tags')
  const byQuestion = new Map(existing.map((r) => [String(r.question).trim().toLowerCase(), r]))
  console.log(`website: ${existing.length} rows already present`)

  let created = 0, updated = 0, unchanged = 0
  for (const row of incoming) {
    const key = String(row.question).trim().toLowerCase()
    const found = byQuestion.get(key)
    /* audience has no column on this side, so it is carried as a tag - the
     * help page's rider/driver toggle can filter on it without a migration */
    const tags = ['from-backend', `audience:${row.audience || 'both'}`]

    if (!found) {
      created++
      if (!DRY) {
        await rest(DST_URL, DST_KEY, 'faqs', {
          method: 'POST',
          headers: { Prefer: 'return=minimal' },
          body: JSON.stringify([{
            id: crypto.randomUUID(),
            question: row.question,
            answer: row.answer,
            category: row.category || 'general',
            tags,
            created_at: new Date().toISOString(),
          }]),
        })
      }
      console.log(`  + ${row.question}`)
    } else if (found.answer !== row.answer || found.category !== (row.category || 'general')) {
      updated++
      if (!DRY) {
        await rest(DST_URL, DST_KEY, `faqs?id=eq.${encodeURIComponent(found.id)}`, {
          method: 'PATCH',
          headers: { Prefer: 'return=minimal' },
          body: JSON.stringify({ answer: row.answer, category: row.category || 'general', tags }),
        })
      }
      console.log(`  ~ ${row.question}`)
    } else {
      unchanged++
    }
  }

  const incomingKeys = new Set(incoming.map((r) => String(r.question).trim().toLowerCase()))
  const orphans = existing.filter(
    (r) => (r.tags || []).includes('from-backend') && !incomingKeys.has(String(r.question).trim().toLowerCase())
  )

  console.log(`\n${DRY ? '[dry run] would be ' : ''}created ${created}, updated ${updated}, unchanged ${unchanged}`)
  if (orphans.length) {
    console.log(`\n${orphans.length} row(s) came from the backend before but are no longer active there.`)
    console.log('Nothing was deleted. Retire them in the CMS if that is intended:')
    for (const o of orphans) console.log(`  ? ${o.question}`)
  }
  console.log('\nNote: this writes the faqs table only. The knowledge base the')
  console.log('assistant searches is refreshed by lib/kb-sync.js on CMS edits, so')
  console.log('re-save anything here in /spinr-internal/faqs to embed it, or run')
  console.log('the ingestion step separately.')
}

main().catch((e) => { console.error(e.message); process.exit(1) })
