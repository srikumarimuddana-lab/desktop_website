# FAQ parity: spinrvm (source of truth) vs the website

Compared 2026-08-25. spinrvm's live `faqs` table was queried directly
(`spinrmobileapp`, ca-central-1); the website side was read from the repo
(`constants/helpTopics.js`, `lib/faq-fallback.js`). The website's own Supabase
project is not reachable from this environment, so any FAQ rows an admin has
added through the CMS are **not** counted below — treat the website column as
"what ships in the code", not "what is live".

---

## The headline

| | spinrvm | website |
|---|---|---|
| Answered FAQ entries | **55** (live, `is_active = true`) | **5** |
| Titles with no answer behind them | 0 | **46** |
| Audience-scoped (rider / driver / both) | yes | no such column |
| Where it is edited | admin dashboard → support | website CMS (`/spinr-internal/faqs`) |

The website looks like it has more content than it does. It defines 51 help
article slugs, but only five have a body: `how-to-request-ride`,
`payment-methods`, `lost-items`, `driver-earnings`, `safety-guidelines`. The
other 46 render a placeholder and are deliberately `noindex`.

So the instinct is right: **spinrvm is the one to trust.** It has real answers,
written against the product's actual rules, and it is what the rider and driver
apps already show.

---

## What spinrvm answers that the website does not

Grouped as spinrvm groups them. Every one of these has a written answer in the
backend today.

### Rider

| Category | Question |
|---|---|
| rides | How do I book a ride? |
| rides | Can I schedule a ride for later? |
| rides | How do I cancel a ride, and will I be charged? |
| rides | How do I get a receipt for my trip? |
| pricing | How is my fare calculated? |
| pricing | What is surge pricing and when does it apply? |
| pricing | Why was my fare higher than usual? |
| payments | What payment methods can I use? |
| payments | How do refunds work? |
| wallet | How do I top up my Spinr wallet? |
| promotions | How do I use a promo code? |
| accessibility | Can I request a wheelchair-accessible vehicle or ride with a service animal? |
| account | How do I contact support or report a lost item? |
| account | How does billing work on a corporate account? |
| account | Why was my ride blocked by company policy? |

### Driver — onboarding and documents

| Category | Question |
|---|---|
| onboarding | How do I sign up to drive with Spinr? |
| onboarding | What are the requirements to drive with Spinr in Saskatchewan? |
| onboarding | What driver's licence do I need? |
| onboarding | How much driving experience do I need? |
| onboarding | What are the vehicle requirements? |
| onboarding | Do I need special SGI authorization or vehicle-for-hire registration? |
| onboarding | Am I an employee or an independent contractor? |
| onboarding | Can I drive a wheelchair-accessible vehicle (WAV)? |
| onboarding | How do I check the status of my driver application? |
| onboarding | How long does document review and approval take? |
| onboarding | Can support activate or approve my account faster? |
| documents | What documents do I need to upload? |
| documents | How do I upload or update a document? |
| documents | I uploaded my documents — were they received? |
| documents | My document was rejected — what should I do? |
| documents | What insurance do I need? |
| documents | Does my vehicle need a safety inspection, and how often? |
| documents | What are the Criminal Record Check (CRC) requirements? |
| documents | Where do I get a Criminal Record Check in Saskatchewan? |
| documents | My Criminal Record Check has expired — what happens? |

### Driver — pay, safety, troubleshooting

| Category | Question |
|---|---|
| payments | How much of the fare do I keep? |
| payments | When and how do I get paid for my trips? |
| payments | Where do I see my earnings? |
| payments | How are taxes handled for drivers? |
| payments | How does surge pricing affect what I earn? |
| safety | How does insurance coverage work while I'm driving? |
| safety | Do I have to accept service-animal or wheelchair requests? |
| troubleshooting | Why can't I go online? |
| troubleshooting | How do I go online and start getting ride requests? |
| troubleshooting | I can't start or complete a ride in the app |
| troubleshooting | I accepted a ride but can't start it in the app — what do I do? |
| troubleshooting | I can't finish sign-up because the vehicle category won't show |
| troubleshooting | What happens if a rider cancels or doesn't show up? |
| troubleshooting | How do I update my vehicle or profile details? |
| troubleshooting | How do I contact support? |

### Both audiences

| Category | Question |
|---|---|
| account | How do I delete my account? |
| account | How do I request a copy of my data? |
| safety | What safety features does Spinr have? |

---

## Duplicates inside spinrvm, to merge before copying anything

Migration 327 merged some onboarding duplicates but these survived. Seeding the
website as-is would copy the duplication across.

| Keep | Merge away |
|---|---|
| What are the Criminal Record Check (CRC) requirements? | What is the Criminal Record Check requirement? |
| When and how do I get paid for my trips? | When and how do I get paid? |

---

## Website-only content

`lib/faq-fallback.js` holds 16 marketing-voiced questions used when the
assistant cannot answer — pricing, the Spinr Pass, "Is Spinr Canadian?". These
are **not** in spinrvm and mostly should not be: they answer questions about
the business model rather than about using the product. Keep them, but check
them against the backend whenever pricing changes, because they hardcode
figures the backend owns.

Two are worth reconciling because the backend is authoritative:

- *"What does a ride actually cost?"* overlaps spinrvm's *"How is my fare
  calculated?"* — and the website's own trip estimator currently disagrees with
  `fare_service.py` (no base fare, no time component, $4 floor vs $8, $1
  booking fee vs $2). Fix the estimator before advertising either number.
- *"Where can I use Spinr?"* must stay in step with `SERVED_CITIES` and the
  service-areas table.

---

## Coverage against Canadian and Saskatchewan obligations

Checked against the rules in the backend's `CLAUDE.md` (Saskatchewan
Transportation Act, SGI, PIPEDA) — not against outside legal advice.

### Covered by spinrvm today

| Obligation | Question that carries it |
|---|---|
| Class 5 licence, 3 years' experience | What driver's licence do I need? / How much driving experience do I need? |
| Vehicle age and annual inspection | What are the vehicle requirements? / Does my vehicle need a safety inspection…? |
| SGI ride-share endorsement | What insurance do I need? / Do I need special SGI authorization…? |
| Criminal Record Check, renewed | Three CRC questions, incl. expiry |
| TNC insurance periods | How does insurance coverage work while I'm driving? |
| Independent-contractor status | Am I an employee or an independent contractor? |
| WAV + service animals (both sides) | Rider accessibility Q + driver "Do I have to accept…?" |
| Surge cap, disclosed before booking | What is surge pricing and when does it apply? |
| GST/PST as separate receipt lines | How do I get a receipt for my trip? |
| Driver tax / T4A | How are taxes handled for drivers? |
| PIPEDA access and deletion | How do I request a copy of my data? / How do I delete my account? |

### Gaps — neither spinrvm nor the website answers these

Ranked by how likely a regulator, an applicant or a rider is to ask.

1. **How long do you keep my trip data?** The 7-year trip-record retention (and
   the separate 3-year GPS ceiling) is stated on `/account-deletion` but exists
   as no FAQ anywhere. This is the single most likely follow-up to "how do I
   delete my account", and answering it wrongly is a PIPEDA problem.
2. **Am I insured as a passenger?** Insurance is answered from the driver's
   side only. A rider asking who covers them mid-trip gets nothing.
3. **Can children ride, and do you provide car seats?** Saskatchewan child-restraint
   law applies to a ride-for-hire. No answer on either side, and drivers will be
   asked this in person.
4. **Is there a minimum age to hold an account or ride alone?** Standard
   rideshare policy question; absent.
5. **Vulnerable Sector Check.** `CLAUDE.md` requires CRC *and* a Vulnerable
   Sector Check annually. The FAQs describe the CRC; the VSC is not named.
6. **Where is my data stored?** Data residency is a compliance commitment
   (Canadian region) and a live trust question for a "Proudly Canadian" brand.
7. **How do I complain, and to whom outside Spinr?** No escalation path is
   published for a rider or driver who is unhappy with the outcome.
8. **Accessibility of the app itself.** WCAG 2.1 AA is an obligation for
   customer-facing surfaces; the website has an "Accessibility features"
   placeholder and no content.

Items 1, 2 and 5 are the ones to write first: each is a statement about
compliance the company already makes internally but has not published.

---

## Recommendation on how to close it

**Do not fork the content.** Copying 55 answers into a second database creates
two sources of truth that will drift the first time someone edits one — and the
website already disagrees with the backend on fare maths, which is exactly what
that drift looks like.

Preferred order:

1. **Add a public read-only FAQ endpoint to spinrvm.** Today the only `/faqs`
   route is `backend/routes/admin/faqs.py`, mounted behind
   `require_module("support")`, so nothing anonymous can read it.
   `backend/routes/legal_documents.py` is the pattern to copy — a plain
   `APIRouter` serving published content with no auth. The website already
   talks to the backend through `lib/spinr-api.js` and would need one more
   reader function.
2. **Point the website's help centre at it**, keeping `lib/faq-fallback.js` as
   the offline fallback it already is.
3. **Only if 1 is not happening soon**, run `scripts/seed-faqs.mjs` (below) as
   a stopgap, and re-run it whenever the backend content changes.

Also worth doing regardless: the backend's `faqs` table carries two columns
the website's does not.

- `audience` (`rider` / `driver` / `both`) — the website has no equivalent, so
  a driver-only answer cannot be hidden from riders even though the help page
  already has a rider/driver toggle. The data model is behind the UI.
- `service_area_ids` — the backend can scope an FAQ to a city. The website
  cannot, which becomes a correctness problem the day a second market opens
  (see `docs/second-market-readiness.md`): a Saskatchewan-specific answer would
  show to everyone.

The seed script carries `audience` across as a `audience:<value>` tag, which
needs no migration, but a real column is the better fix if the toggle is ever
meant to filter the list rather than just steer the assistant.
