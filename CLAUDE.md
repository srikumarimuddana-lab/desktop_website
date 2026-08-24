# Spinr Website — Project Knowledge Base

> This file provides full project context for AI agents (Claude, Copilot, Gemini, etc.).
> Last updated: 2026-04-03

---

## What Is Spinr

> ### ⚠️ Spinr Pass — the driver side of the business model
>
> **Spinr Pass is a subscription drivers pay for access to the platform** —
> the driver app, dispatch, in-app payments, support. It is *why* there is no
> commission: Spinr is paid a flat amount for access rather than a share of
> each fare. Not launched yet; drivers pay nothing today.
>
> **Say it per audience; never explain the business model as a whole.**
> Spinr does not publish how it earns. Copy states what each audience is
> charged and stops there:
>
> - **To riders:** "$1 per ride — that is what Spinr takes from a fare."
>   Do not mention the Pass on rider-facing surfaces; it is not their charge.
> - **To drivers:** "0% commission — no share of your fare, ever. Access to
>   the app is a monthly Spinr Pass. Every driver gets 6 months free right now."
> - **Nowhere:** a combined "here is how we make money" reveal, revenue-leg
>   lists, or corporate accounts as a revenue source.
>
> **6 months free applies to ALL drivers at present**, not just new signups —
> but it is a present-tense offer. Say "every driver, right now"; never
> "forever", and never invent an end date.
>
> **Spinr Pass tiers** — two monthly plans, separated by rides allowed per
> day: **Part-time $19.99, up to 4 rides a day** and **Full-time $49.99,
> unlimited rides**. BOTH prices are introductory rates — neither is the
> standard price, and both must be labelled as such wherever they appear.
> Fully specified — no placeholders
> remain on `/preview/drive`.
>
> "Unlimited" is a promise. If a cap or fair-use rule is ever introduced it
> must change in four places at once: the Pass card, the home FAQ, the help
> FAQ, and `app/drive/DrivePageClient.js` — the FAQs also feed the AI
> assistant through `lib/kb-sync.js`.
>
> The Part-time cap is a HARD stop: at 4 rides the driver is offered no more
> that day, resetting the next day. Stated on the Pass card itself, not buried
> in an FAQ — a limit discovered mid-shift is worse than one read before
> subscribing — and answered directly in the help FAQ, which also reaches the
> AI assistant.
>
> **Switching plans is a cancel and a re-subscribe** — the driver cancels the
> plan they are on and subscribes to the other. That is the whole of what is
> known: say nothing about when a cancellation takes effect, refunds or
> proration, or what happens to the remaining free months. Stated on the Pass
> card, the live `/drive` plan grid, and the help FAQ — which also reaches the
> AI assistant.
>
> **Both $19.99 and $49.99 must always be labelled introductory rates**
> wherever they appear. Advertising a promotional price without saying it is
> promotional is misleading, and these numbers reach drivers through the FAQ
> and — via `lib/kb-sync.js` → `knowledge_base` — through the AI assistant's
> answers.
>
> **The line that holds:** Spinr never takes a **percentage of the fare**.
> That is true now and stays true with a Pass, because a Pass is a flat,
> disclosed amount — the same philosophy as the rider's flat $1. It is the
> opposite of a commission, which grows as the driver earns more.
>
> **Safe to say (now and after launch):** "0% commission", "we never take a
> share of your fare", "drivers keep 100% of the net fare", "the number you
> accept is the number you are paid".
>
> **NOT safe to say:** anything asserting Spinr charges drivers *nothing at
> all* — "Spinr's cut: $0.00", "Spinr takes $0.00 of your fare", "drivers pay
> no platform fee". These were removed on 2026-08-22 for exactly this reason.
> Do not reintroduce them.
>
> **Still unset:** price, billing period, launch date, and whether existing
> drivers are grandfathered. `/preview/drive` has the Pass section built with
> those rendered as visibly bracketed `[PRICE]` / `[PERIOD]` slots (`.sp-todo`,
> a dashed red hatch — impossible to mistake for a real number). **Never
> substitute a guess:** FAQ copy flows through `lib/kb-sync.js` into
> `knowledge_base`, so an invented price would be quoted to drivers by the AI
> assistant as fact.

Spinr is a **Proudly Canadian rideshare platform**. Drivers keep 100% of net fare (0% commission). Riders pay a flat $1 platform fee per trip. No surge pricing. **Saskatoon, Saskatchewan is the only approved and operating market.**

> ### ⚠️ Calgary — a planned second market, NOT an approved one
>
> Calgary is the intended next city. **Approval has not been granted.** Until
> it is, nothing public may say, imply or hint that Spinr operates, is
> launching, is expanding, or is "coming soon" to Calgary or anywhere outside
> Saskatoon. That covers page copy, FAQs, SEO metadata, help articles,
> promotions and anything the AI assistant can reach — a FAQ answer flows
> through `lib/kb-sync.js` into `knowledge_base`, so a stray "coming to
> Calgary" would be quoted back to riders by the assistant as fact.
>
> **Saying "not yet" is correct. Saying "soon" is not ours to say.**
>
> What this means for new work: do not add a *second* hardcoded city, but do
> not hardcode Saskatoon any harder either. Where a city or province is
> needed, prefer reading it from the service area. `SERVED_CITIES` in
> `app/api/agent/search/route.js` is the single switch for what the assistant
> will admit to serving; adding to it is a launch action, not a code tidy.
>
> Readiness, and what is genuinely in the way, is written up in
> `docs/second-market-readiness.md`. The short version: per-area tax config
> already exists and already names Alberta, but the compliance reporting,
> insurance model and governing law of the legal documents are all
> Saskatchewan-specific and are real blockers, not copy changes.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, React 19) |
| Language | JavaScript/JSX (no TypeScript) |
| Styling | Tailwind CSS 3.4 + Shadcn/ui (Radix primitives) |
| Database | Supabase (PostgreSQL + pgvector + RLS) |
| AI/RAG | LangChain.js + Alibaba DashScope (Qwen LLM, text-embedding-v4) |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |
| Rich Text | Tiptap (WYSIWYG editor in admin) |
| Notifications | Sonner (toast) |
| Deployment | Vercel (standalone output) |
| Package Manager | npm (`.npmrc` has `legacy-peer-deps=true` for Vercel) |

---

## Directory Structure

```
desktop_website/
├── app/                          # Next.js App Router
│   ├── api/
│   │   ├── [[...path]]/route.js  # Catch-all API (FAQs, help articles, legal, SEO, admin)
│   │   └── agent/search/route.js # AI chat agent endpoint (LangChain hybrid RAG)
│   ├── about/page.js
│   ├── account-deletion/page.js
│   ├── app/page.js
│   ├── drive/                    # Driver onboarding (page.js + DrivePageClient.js)
│   ├── help/                     # Help center (page.js, HelpCenterClient.js, article/[slug], category/[slug])
│   ├── legal/[slug]/page.js      # Dynamic legal pages
│   ├── ride/                     # Rider page (page.js + FareCalculator.js)
│   ├── safety/page.js
│   ├── spinr-internal/           # Admin dashboard (protected)
│   │   ├── login/page.js
│   │   ├── layout.js             # Auth guard
│   │   ├── page.js               # Dashboard stats
│   │   ├── faqs/page.js
│   │   ├── help-articles/page.js
│   │   ├── policies/page.js      # Legal doc WYSIWYG editor
│   │   ├── seo/page.js
│   │   └── agent-conversations/page.js
│   ├── support/page.js
│   ├── layout.js                 # Root layout (providers, ChatWidget, SpeedInsights)
│   ├── globals.css
│   ├── sitemap.ts                # Dynamic XML sitemap
│   ├── robots.ts
│   └── not-found.js
├── components/
│   ├── ai/ChatWidget.js          # Floating AI chat bot widget
│   ├── home/                     # Hero, phone mockup, rider image
│   ├── layout/Header.js, Footer.js
│   ├── seo/CustomScripts.js, JsonLdInjector.js
│   ├── ui/                       # 60+ Shadcn components + CookieBanner, SafeHtml, SmartAppLink
│   └── RichTextEditor.js         # Tiptap editor for admin
├── lib/
│   ├── langchain.js              # LangChain singletons (getEmbeddings, getLLM, getPolishLLM) — lazy init
│   ├── hybrid-retriever.js       # hybridRetrieve(q, topK, {audience}) — hybrid_search RPC + re-rank
│   ├── audience.js               # rider/driver affinity weighting for retrieval
│   ├── polish.js                 # optional light-model tone pass over a grounded answer
│   ├── fact-guard.js             # pure fact-token comparison policing the polish pass
│   ├── context-builder.js        # XML-bounded context formatting for LLM prompts
│   ├── kb-sync.js                # syncToKB(), deleteFromKB() — CMS auto-sync to KB
│   ├── supabase.js               # Supabase client + mock fallback for dev
│   ├── seo.js                    # SEO metadata fetchers
│   ├── app-links.js              # App Store / Play Store URLs + platform detection
│   └── utils.js                  # cn() utility (clsx + tailwind-merge)
├── constants/
│   ├── helpTopics.js             # Static help center data (fallback)
│   └── images.js
├── hooks/
│   ├── use-mobile.jsx
│   └── use-toast.js
├── scripts/
│   └── ingest-documents.js       # CLI: chunk .docx files → embeddings → Supabase KB
├── spinrhelpfiles/               # 11 Word docs (6 driver, 5 rider)
├── supabase/                     # SQL migrations and seeds
│   ├── knowledge_base_seed.sql   # ~40 manually curated KB entries
│   ├── hybrid_search_migration.sql  # BM25 + vector hybrid search RPC
│   ├── cms_sync_migration.sql    # source_id column for CMS sync
│   ├── create_vector_search.sql  # Original vector search (legacy)
│   └── update_vector_dimensions.sql # 1536 → 1024 dimension migration
├── public/                       # Static assets (logo, images, QR codes)
├── docs/superpowers/             # Design specs and implementation plans
├── .env.local                    # Environment variables (gitignored)
├── .npmrc                        # legacy-peer-deps=true
├── next.config.js
├── tailwind.config.js
├── jsconfig.json                 # Path aliases: @/*
└── package.json
```

---

## Architecture

### Public Website
Standard Next.js pages. Server components fetch SEO metadata from Supabase, client components handle interactivity. The `FareCalculator` uses Nominatim (geocoding) + OSRM (routing) — both free/open APIs.

### Admin CMS (`/spinr-internal`)
Protected by Supabase Auth. Super admin email: `admin@spinr.ca` (hardcoded). Manages FAQs, help articles, legal docs, SEO metadata. All CRUD goes through the catch-all API route.

### AI Chat Agent
The `ChatWidget.js` component POSTs to `/api/agent/search`. The pipeline:

```
User Question + user_type → Rate Limit → Cache (keyed by audience) → Retrieval → LLM → Polish → Response
                                                                        ↓
                                              Supabase hybrid_search RPC (BM25 + pgvector, RRF)
                                              match_count = topK*4 when audience is known
                                                                        ↓
                                              lib/audience.js re-rank: own ×1.4 / shared ×1.0 /
                                              other-audience ×0.4  → top 4
                                                                        ↓
                                              LangChain ChatOpenAI (Qwen via DashScope)
                                              audience note + XML-bounded context + system prompt
                                                                        ↓
                                              OPTIONAL lib/polish.js — light model rewrites for tone
                                              only; rejected unless fact-identical (lib/fact-guard.js)
                                                                        ↓
                                              Validate → Store conversation → Return
```

**Audience-aware retrieval.** `user_type` used to reach only the system prompt, so a
rider and a driver asking the same words got the same sources. Retrieval now honours
it: the `knowledge_base.category` already carries `rider` / `driver` / `general` /
`safety` / `pricing`, so a wider candidate pool is fetched and re-ranked by audience
affinity. Cross-audience rows are demoted, never dropped — a rider asking how driver
pay works still reaches that answer, just below rider-facing material. Anonymous
queries keep plain RRF order. No migration was needed.

**Polish stage (off by default).** Set `POLISH_MODEL_NAME` to run a second, cheaper
model over the grounded answer for tone. It is treated as untrusted: `lib/fact-guard.js`
compares fact-shaped tokens (money, percentages, decimals, multi-digit numbers, emails,
URLs) before and after, and the rewrite is discarded unless the set is identical, or if
it grows past 1.5× the draft. Falling back to the draft is silent and safe. Bare single
digits are excluded from the comparison on purpose — they are list numbering far more
often than facts, and guarding them rejected every honest rewrite.

**Fallback chain:** Hybrid RAG → keyword search on faqs/help_articles tables → "contact support@spinr.ca"

**Location guard:** Detects city names in queries and injects hard-negative context (Spinr is ONLY in Saskatoon). `NON_SASKATOON_CITIES` in `app/api/agent/search/route.js` is a deliberate not-served list — Regina is an entry there so the agent can never claim Regina service; it is not marketing copy.

### The Spinr backend is the source of truth for FAQs, legal text and chat

FAQs and legal documents are maintained in the **spinrvm** admin dashboard —
that is the copy riders and drivers agree to in the app. This site used to keep
its own separate copies, so the same question could be answered one way in the
app and another way here. It now reads from the backend first:

```
spinrvm API  ->  website CMS (/spinr-internal)  ->  hardcoded draft
```

`lib/spinr-api.js` owns every call. It returns `null` on any failure — unset
`SPINR_API_URL`, timeout, non-2xx, bad JSON — so each caller has exactly one
fallback branch. **Both lower layers must stay wired up.** A legal page has to
render; "the backend was slow" is not a reason to show a visitor nothing where
terms should be.

| Surface | Backend endpoint | Falls back to |
|---|---|---|
| Help centre FAQs | `GET /faqs?audience=` | `faqs` table, then the page's `pickFaqs()` list |
| `/legal/terms`, `/legal/privacy` | `GET /legal-documents?audience=rider&type=` | `legal_docs` table, then `app/(site)/legal/content.js` |
| Chat widget | `POST /ai/public-chat` | local LangChain RAG, then keyword search |
| Driver signup | `auth/send-otp`, `auth/verify-otp`, `drivers/register` | nothing — the form says applications are unavailable and points at the app |
| Fare estimate | `POST /rides/public-estimate` | nothing — the page says it cannot price the trip. There is no honest fallback for a price. |

Two things to know before touching this:

- **Backend legal text is PLAIN TEXT, not HTML** — ALL-CAPS headings,
  hard-wrapped paragraphs, `- ` bullets. `toPlainTextDoc()` in
  `app/(site)/legal/[slug]/page.js` converts it; `toDoc()` right above it is
  for the CMS's HTML blobs. They are not interchangeable. `LegalShell` keeps
  two separate flags for this reason: `doc.published` controls the DRAFT stamp,
  `doc.fromCms` controls whether the body is HTML. A backend document is
  published but is not HTML.
- **The chat surface ships dark.** The backend gates it behind
  `ai_public_chat_enabled`, off by default, so until an admin enables it every
  call returns 503 and the site answers from the local pipeline as before.
  Seeing `source: "fallback_search"` is expected until that flag is flipped;
  `source: "spinr_backend"` means it is live.

Backend-side prerequisites for this to work at all: `ALLOWED_ORIGINS` on the
Spinr backend must include this site's origin, and `ai_public_chat_enabled`
must be on for the chat (the content endpoints need no flag).

Note the assistant reached through `/ai/public-chat` answers from the
**backend's** FAQ rows, not from `knowledge_base`. `lib/kb-sync.js` still
serves the local fallback pipeline, so a FAQ added in `/spinr-internal` still
reaches that — but a FAQ that should reach riders and drivers belongs in the
spinrvm dashboard.

### Driver signup runs against the backend, and holds no token in the browser

`/drive/apply` creates a **real** account and a **real** `drivers` row through
the existing spinrvm APIs — `auth/send-otp`, `auth/verify-otp`,
`drivers/register`. An applicant who starts here lands in the spinrvm admin
dashboard as `status: pending` immediately. It is not a lead form.

```
browser  ->  /api/driver-signup/{otp,verify,register}  ->  spinrvm
                     (httpOnly cookie lives here)
```

Rules for anyone touching this:

- **The bearer token never reaches client JavaScript.** verify-otp's token goes
  into an httpOnly, Secure, SameSite=lax cookie scoped to `/api/driver-signup`,
  is read back server-side for register, and is **deleted the moment the
  application is submitted**. Do not move any of these calls into a client
  component.
- **The refresh token is discarded on purpose.** A 30-day refresh credential on
  a marketing site buys nothing here — the flow completes in seconds. The
  session is also capped at 20 minutes regardless of what the backend reports.
- **The phone step is LAST, and that is deliberate.** It keeps the auth wall
  out of the way and holds the token for seconds rather than the minutes
  someone spends typing a VIN. Do not "improve" the flow by verifying first.
- **Two backend error shapes exist.** `HTTPException` returns
  `{ detail: "..." }` (prose for users); `SpinrException` returns
  `{ success, error: { message, action_hint } }` where `message` can be a token
  like `ERR_OTP_INVALID`. `backendMessage()` in the route handles both and
  refuses to show a token-shaped string. Do not simplify it back to reading
  `detail`.
- **send-otp is metered per client IP backend-side**, so every applicant shares
  the Vercel egress IP's 6/minute bucket. Never forge `CF-Connecting-IP` to
  escape that — the backend treats it as authoritative. The route meters per
  real client IP on its own side; the backend's per-phone send cap is the
  actual control. If volume ever outgrows it, the fix is a trusted-caller
  mechanism on the backend.
- **The web flow does not finish an application.** Licence, insurance and
  inspection photos and the CRC consent need the app. The last step is a
  hand-off and must keep saying so — "application started", never "approved".
- **Gender is deliberately not collected here** even though the backend accepts
  it, because there is no stated purpose for it on a public web form.

Service areas and vehicle types are read from the backend, so the form does not
hardcode Saskatoon and cannot offer a vehicle type with no fare configured for
the area.

**Two error-handling rules that are easy to undo by accident:**

- **A timed-out write is not a failed write.** `drivers/register` may complete
  after we stop waiting, so that case returns its own `submit_uncertain`
  outcome — the applicant is told we could not confirm it and how to check,
  and the session is deliberately kept so a retry works. Retrying is safe
  because register is an upsert. Do not collapse this back into a generic
  error; telling someone their application failed when it succeeded is the
  worst outcome this flow has.
- **Signup writes use their own timeout** (`SPINR_WRITE_TIMEOUT_MS`, 15s), not
  the 4s content-read budget. verify-otp and register do real work and 4s
  would fail applications that were about to succeed.

**Verifying it:** `scripts/verify-spinr-integration.mjs` drives the real routes
over HTTP against a stub that can be told to misbehave in each way the backend
can — bad codes, lockouts, suspended accounts, conflicts, hung writes,
non-JSON gateway errors, hollow legal documents, garbage FAQ payloads. There is
no JS test runner in this repo, so this script is the regression net; run it
after touching anything in this section.

### Fare estimates come from the backend's engine — never from this repo

`/ride` searches, `/ride/estimate` prices. Uber works this way and the split
earns its keep: the URL *is* the trip, so a quote is linkable, back/forward
work, and the page server-renders instead of flashing a spinner.

```
/ride  ──(Nominatim resolves 2 addresses)──▶  /ride/estimate?flat=&flng=&tlat=&tlng=&from=&to=
                                                       │
                                          POST /rides/public-estimate (SSR)
```

**No fare arithmetic belongs on this site.** `TripEstimate.js` used to price
trips from `MIN_PER_KM 1.2 / MAX_PER_KM 2.0 / MIN_FARE 4.0` against an OSRM
distance. Those constants were invented — they knew nothing about surge, area
fees, tax, minimum fares or vehicle type, so the range shown had no
relationship to what a rider was charged. The backend's
`compute_ride_estimates` is the single fare path for every quoting surface;
anything computed here would drift from the app the first time someone touched
pricing. `EstimateClient.js` formats what it is given and multiplies nothing.

Things that will bite:

- **Coordinates travel in the URL, addresses do not.** The estimate page must
  price the exact points the visitor picked. Re-geocoding the label here could
  resolve somewhere slightly different and quote a different trip.
- **Money arrives as exact decimal strings** (the backend uses Decimal, never
  float). Prefix them with `$`; never `parseFloat` and re-round, which is how a
  displayed price starts drifting from a charged one.
- **The map draws the backend's polyline**, already decoded to `[[lat,lng],…]`.
  Do not compute a route here — the line on screen should be the line the fare
  was priced on. Leaflet over OSM tiles, so no Maps key is needed; ODbL
  attribution is required and Leaflet renders it.
- **`RouteMap` is `ssr:false`** because Leaflet touches `window`. Anything
  inside it is invisible until hydration, so honesty caveats (the
  straight-line-preview note) live in the parent's server-rendered markup.
- **Every uncached estimate costs a Google Directions call** — pricing needs
  the road distance. The backend caps this with `public_fare_estimate_enabled`
  (off by default), a 10/minute per-IP limit and a 180s cache. Do not add a
  poll or an on-keystroke estimate.
- **Surge copy is deliberately absent when the multiplier is 1.** This site's
  own copy says "No surge pricing" while the backend runs a surge engine with a
  2.5× cap. Rather than pick a side, the page states an elevated quote when
  there is one and says nothing about surge when there is not. Worth resolving
  properly — see the note in `EstimateClient.js`.

### Admin edits must reach the front end — no hardcoded CMS content

**Rule: anything editable in `/spinr-internal` is READ AT REQUEST TIME, never
baked into a page.** A FAQ, help article, legal doc or SEO row added in the
admin dashboard has to appear on the site without a deploy — that is the point
of the CMS, and it is also what keeps the AI assistant correct, since
`lib/kb-sync.js` pushes the same row into `knowledge_base` for retrieval.
Hardcode the copy and you silently break both at once: the page goes stale and
the assistant answers from a row nobody can see on the site.

What that means in practice for any new page:

| Requirement | How |
|---|---|
| Fresh on every request | `export const revalidate = 0` |
| SEO from the `seo_pages` table | `generateMetadata()` → `getSeoMetadata(path, defaults)` |
| JSON-LD from the CMS | `getStructuredData(path)` → `<JsonLdInjector>` |
| FAQs / help articles | fetch from Supabase in the server component, pass as props |
| Offline / unconfigured Supabase | every reader takes a `fallback` so the page still renders |

`lib/preview-content.js` provides these readers for the `/preview` pages
(`getFaqs`, `getHelpArticles`, `previewMetadata`). Note `previewMetadata`
merges the CMS row but then **forces `robots: noindex` back on** — the design
sample must never be indexed, and that is not left to a CMS row someone could
edit. When a preview page is promoted to production, drop that override and
use `getSeoMetadata` directly.

Adding a new FAQ in the admin dashboard therefore lands in three places with
no further work: the FAQ list on the page, the help centre, and the
assistant's retrieval corpus.

### CMS → KB Auto-Sync
When admin creates/updates/deletes FAQs or help articles, `lib/kb-sync.js` automatically:
- Generates an embedding via DashScope
- Upserts/deletes the corresponding `knowledge_base` entry
- Tracked via `source` + `source_id` columns
- Fire-and-forget (doesn't block the API response)

---

## Database Tables (Supabase)

| Table | Purpose | RLS |
|-------|---------|-----|
| `knowledge_base` | AI agent knowledge (embeddings, content, categories) | Public read, admin write |
| `faqs` | FAQ entries managed via CMS | Public read, admin write |
| `help_articles` | Help center articles managed via CMS | Public read, admin write |
| `legal_docs` | Legal documents (terms, privacy, etc.) | Public read, admin write |
| `seo_pages` | Per-page SEO metadata, JSON-LD, sitemap config | Public read, admin write |
| `agent_conversations` | Chat history for analytics | Insert by anon, read by admin |

### Key: `knowledge_base` table
- `embedding`: vector(1024) — DashScope text-embedding-v4
- `fts`: tsvector — auto-generated from title + content (for BM25 search)
- `source`: origin identifier — `website_analysis` (seed), `docx_ingestion` (Word docs), `cms_faq`, `cms_article`
- `source_id`: links back to FAQ/article UUID (for CMS sync)
- `is_active`: boolean toggle

### Key RPC: `hybrid_search(query_text, query_embedding, match_count, ...)`
Combines BM25 full-text search + pgvector cosine similarity using Reciprocal Rank Fusion. Returns ranked results with `combined_score`.

---

## API Routes

### Catch-all: `/api/[[...path]]/route.js` (~915 lines)

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/faqs` | GET | No | List all FAQs |
| `/api/faqs` | POST | Yes | Create FAQ (+ KB sync) |
| `/api/faqs/:id` | PUT | Yes | Update FAQ (+ KB sync) |
| `/api/faqs/:id` | DELETE | Yes | Delete FAQ (+ KB sync) |
| `/api/help-articles` | GET | No | List articles |
| `/api/help-articles` | POST | Yes | Create article (+ KB sync) |
| `/api/help-articles/:slug` | GET | No | Get single article |
| `/api/help-articles/:id` | PUT | Yes | Update article (+ KB sync) |
| `/api/help-articles/:id` | DELETE | Yes | Delete article (+ KB sync) |
| `/api/help-categories` | GET | No | List categories |
| `/api/legal/:slug` | GET | No | Get legal doc |
| `/api/legal/:slug` | PUT | Yes | Update legal doc |
| `/api/seo-pages` | GET/POST | Mixed | SEO metadata CRUD |
| `/api/seo-pages/:path` | PUT/DELETE | Yes | SEO page management |
| `/api/admin/stats` | GET | No | Dashboard counts |
| `/api/admin/seed-seo` | POST | No | Seed default SEO pages |

### AI Agent: `/api/agent/search/route.js` (~291 lines)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/agent/search` | POST | AI chat query (hybrid RAG) |
| `/api/agent/search` | GET | Health check |

---

## Environment Variables

Required in Vercel (and `.env.local` for local dev):

```
# Spinr backend (the `spinrvm` repo) — source of truth for FAQs, legal text
# and the AI assistant. Unset = the site falls back to its own CMS and its own
# retrieval stack, exactly as it behaved before the integration.
SPINR_API_URL=https://api-spinr.spinr.ca/api/v1
SPINR_API_TIMEOUT_MS=4000     # content reads, inside a server-rendered request
SPINR_AI_TIMEOUT_MS=20000     # one assistant turn
SPINR_WRITE_TIMEOUT_MS=15000  # driver-signup writes (otp/verify/register)
SPINR_ESTIMATE_TIMEOUT_MS=10000  # a fare quote (backend waits on Google Directions)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://cfrazforbupizntxvvtp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<jwt>

# LLM (Alibaba DashScope — OpenAI-compatible)
LLM_API_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions
LLM_API_KEY=<key>
LLM_MODEL_NAME=qwen-vl-max-2025-04-08

# Embeddings (Alibaba DashScope)
EMBEDDING_API_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1/embeddings
EMBEDDING_API_KEY=<key>
EMBEDDING_MODEL_NAME=text-embedding-v4

# IMPORTANT: Also set OPENAI_API_KEY to the same DashScope key
# (the openai npm package reads this automatically)
OPENAI_API_KEY=<same key as LLM_API_KEY>

# Feature flags
AI_AGENT_ENABLED=true
FALLBACK_TO_KEYWORD_SEARCH=true
AGENT_RATE_LIMIT=10
AGENT_MAX_TOKENS=500

# OPTIONAL — light-model polish pass over the grounded answer.
# Unset (the default) ships the RAG answer as written.
# Same provider, cheaper model:
#   POLISH_MODEL_NAME=qwen-turbo
# Real OpenAI — all three are required, because OPENAI_API_KEY above is the
# DashScope key and a bare OpenAI model name would otherwise be sent there:
#   POLISH_MODEL_NAME=gpt-4o-mini
#   POLISH_API_URL=https://api.openai.com/v1
#   POLISH_API_KEY=sk-...
# POLISH_MAX_TOKENS=400
# POLISH_TIMEOUT_MS=6000
```

---

## Key Patterns & Conventions

### Module System
- Next.js App Router pages use ESM `import/export`
- Standalone scripts (e.g., `scripts/ingest-documents.js`) use CommonJS `require()`
- Path aliases: `@/` maps to project root (`jsconfig.json`)

### LangChain Initialization
LangChain instances (`getEmbeddings()`, `getLLM()`) are **lazily initialized** in `lib/langchain.js`. This is required because Vercel serverless may not have env vars ready at module load time.

### Supabase Client
`lib/supabase.js` exports a singleton client. If Supabase is not configured, it returns a mock client that allows the app to run in demo mode with hardcoded data.

### Component Pattern
- Server components for pages (data fetching, metadata)
- Client components (`'use client'`) for interactivity
- Shadcn/ui components in `components/ui/` — don't modify these directly

### Error Handling in API
- Supabase errors return 500 with error message
- Auth failures return 401
- Not found returns 404
- AI agent errors fail silently to fallback chain

---

## Scripts

### `node scripts/ingest-documents.js`
Ingests Word docs from `spinrhelpfiles/` into `knowledge_base`:
- `--force` — clear and re-ingest all docx entries
- `--file "X.docx"` — ingest single file
- Uses mammoth for .docx parsing, LangChain RecursiveCharacterTextSplitter for chunking

---

## Known Issues & Gotchas

1. **Vercel peer deps**: `.npmrc` must have `legacy-peer-deps=true` or build fails
2. **LangChain + Vercel**: All LangChain packages must be in `serverExternalPackages` in `next.config.js` to avoid ESM/CJS bundling issues
3. **OPENAI_API_KEY**: Must be set in Vercel env vars to the DashScope key — the `openai` npm package reads it directly, overriding what LangChain passes
4. **Vector dimensions**: Embeddings are 1024-dimensional (DashScope text-embedding-v4), not 1536 (OpenAI ada-002). The `knowledge_base.embedding` column is `vector(1024)`.
5. **Auth bypass in dev**: If Supabase is not configured AND `NODE_ENV=development`, admin auth is bypassed. Never deploy with this.
6. **CORS headers**: `X-Frame-Options: ALLOWALL` in `next.config.js` — allows clickjacking. Should be `DENY` or `SAMEORIGIN` in production.
7. **Catch-all route is large**: `app/api/[[...path]]/route.js` is ~915 lines. Consider splitting if it grows further.

---

## Recent Changes (April 2026)

- Replaced hand-rolled RAG with **LangChain.js hybrid search** (BM25 + vector + RRF)
- Added **document ingestion** from Word docs (`scripts/ingest-documents.js`)
- Added **CMS auto-sync** — FAQ and help article CRUD auto-updates AI knowledge base
- Added Vercel Speed Insights
- Knowledge base scaled from ~40 seed entries to 100+ (with Word doc chunks)
