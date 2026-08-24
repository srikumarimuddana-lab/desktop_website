# Second-market readiness — Calgary

**Status as of 2026-08-23: Calgary is a planned second market. Approval has
not been granted.** Nothing public may claim, imply or tease Calgary service
until it has. This document is an assessment of what a second market takes, so
that the work is known rather than discovered under time pressure.

Scope: what is already multi-market, what is hardcoded to one city, and what is
a genuine external blocker rather than a code change. Written after an audit of
both `desktop_website` and `spinrvm`.

---

## The short version

The **money plumbing is further along than expected**; the **compliance,
insurance and legal plumbing is Saskatchewan-shaped and is the real work**.
None of the blockers below are solved by editing website copy.

| Area | State |
|---|---|
| Per-area tax | Ready — already models Alberta |
| Service areas | Ready — table exists with timezone, subregions, per-area config |
| Website copy | Hardcoded to Saskatoon in ~19 files |
| AI assistant location guard | Fixed 2026-08-23 — now an allow-list |
| Compliance reporting | **Blocker** — Saskatchewan-only, no Alberta equivalent |
| Insurance model | **Blocker** — assumes a single public provincial insurer |
| Legal documents | **Blocker** — governed by Saskatchewan law |
| Municipal licensing | **Blocker** — Calgary licenses TNCs itself |

---

## Already multi-market

**Per-service-area tax config.** `service_areas.subscription_tax_config`
(migration 185) is a JSONB column holding `{enabled, province, gst_rate,
pst_rate, hst_rate}` per area, editable from the admin dashboard without a
deploy. Its own comment already works the Alberta case: *"Alberta collects GST
only (5%)"*. Adding Calgary is a row edit, not a migration.

**Ride fare tax** is carried as a `tax_breakdown` dict through
`services/fare_service.py` rather than as two hardcoded rates, so a receipt can
already render a different set of tax lines per area.

**Service areas** exist as a first-class concept with timezone (migration 105),
subregions (08), per-area driver matching (10b), referral terms (173/176/189)
and vehicle cascade (185). Dispatch, surge and referral logic are already
scoped by area rather than assuming one city.

> Worth saying plainly: whoever built this left the door open on purpose. A
> second market was anticipated at the data layer.

---

## Hardcoded to one city

**Website copy** — "Saskatoon" or "Saskatchewan" appears across roughly 19
files, including the home, ride, drive, about, help and account-deletion pages,
the legal document bodies, SEO defaults and the FAQ fallback list. Most is
prose that reads naturally and should NOT be mechanically templated; the ones
that matter are the ones stating availability, because those become false the
day a second market opens.

**Suggested approach when the time comes:** drive availability statements from
the active service areas rather than find-and-replacing a city name. Prose that
merely mentions Saskatoon as flavour can stay until it reads oddly.

**The AI assistant's location guard** *(fixed 2026-08-23)* was a deny-list of
33 Saskatchewan towns matched by substring. Two faults: any city not listed —
Calgary, Edmonton, Vancouver, Toronto — fell straight through and never
triggered the guard, and `outlook` matched "the outlook for winter". It is now
an allow-list (`SERVED_CITIES`) checked on word boundaries, so anything not
explicitly served is treated as not served. **Adding a city to `SERVED_CITIES`
is a launch action, not a code tidy.**

---

## Real blockers

These are not code problems. Each needs a decision, an application, or a
lawyer, and each has a lead time.

### 1. Municipal licensing

Calgary licenses TNCs at the city level, separately from anything provincial.
That is an application with its own requirements, fees and timeline, and it
gates everything else — drivers cannot legally be dispatched there without it.

### 2. Insurance

The platform's driver eligibility assumes a ride-share endorsement from a
single provincial insurer. Alberta's market is private, so the *shape* of the
check changes: the document being verified is issued by one of several
insurers, not one provincial body. The four TNC insurance periods themselves
are a general framework and carry over fine — it is the document verification
and the endorsement wording that are Saskatchewan-specific.

### 3. Compliance reporting

`backend/routes/admin/sgi_forms.py` generates fixed-format Saskatchewan
compliance PDFs (D00032 Driver Details, D00033 Vehicle Details) for submission
under the Saskatchewan Transportation Act, with the field mapping in
`services/data_transfer/sgi_field_maps.py`. **There is no Alberta equivalent
wired, because Alberta does not use these forms.** What Calgary requires
instead has to be established, and it will not be the same shape. This is the
single largest piece of engineering work in a second market.

### 4. Legal documents

The terms of service are governed by the laws of Saskatchewan and are written
around Saskatchewan's transportation and insurance framework. Operating in
Alberta needs those reviewed — either a governing-law clause that covers both,
or per-province documents. Counsel's call, not ours. Note the documents are
CMS-editable at `/legal/[slug]`, so the *delivery* is already flexible; it is
the content that needs review.

### 5. Driver eligibility wording

`/drive/requirements` states a full Class 5 licence and three years of licensed
experience. Alberta's classes are equivalent in structure but the page says
"Saskatchewan licence" explicitly. Small, but it is a correctness change that
has to land with the rest, not before — the site should not describe eligibility
for a market it does not serve.

---

## Sequence, if approval lands

Roughly, and with the dependencies that matter:

1. **Licence granted** — nothing below is safe to ship before this
2. **Insurance model confirmed** — what document, from whom, verified how
3. **Compliance reporting** — establish the Alberta requirement, build it
4. **Legal review** — governing law and per-province terms
5. **Create the Calgary service area** — tax config, timezone, subregions
6. **Copy** — availability statements become area-driven
7. **`SERVED_CITIES`** — add `'calgary'`. This is the last step, not the first.

Step 7 taking one line is the point of the work in steps 1–6. It is also why it
must not be done early: the guard is what currently stops the assistant telling
someone in Calgary that we will be there soon.

---

## What was done on 2026-08-23

- Location guard converted from deny-list to allow-list, with word-boundary
  matching. Calgary and every other unserved city now correctly get "we do not
  operate there", where previously they got no injected fact at all.
- `CLAUDE.md` records Calgary as planned-not-approved, with the rule that
  nothing public may claim or tease it.
- This document.

Deliberately **not** done: any multi-city refactor of the site, any Calgary
copy, any waitlist. There is no approval, so there is nothing to build toward
yet beyond not making the eventual work harder.
