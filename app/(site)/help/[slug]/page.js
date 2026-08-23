import Link from 'next/link'
import { notFound } from 'next/navigation'
import SafeHtml from '@/components/ui/SafeHtml'
import { getHelpAnswer, getHelpSlugs, getRelatedAnswers } from '@/lib/help-answers'
import { previewMetadata, SITE_URL } from '@/lib/preview-content'
import { FinalCta } from '../../Chrome'

/*
 * One page for every help answer.
 *
 * The help index used to link out to /help/article/[slug] — a route in the
 * OLD design — so following any article from the new help page dropped the
 * reader onto a differently-styled site. This is the replacement: one route,
 * one layout, serving CMS articles, the hardcoded articles, and FAQ rows
 * alike (see lib/help-answers.js for the precedence).
 *
 * It is a server component so the answer is in the HTML that search engines
 * and the AI assistant's crawler see, not painted in after hydration.
 */

export const revalidate = 300

export async function generateStaticParams() {
  // Best-effort: CMS answers still render on demand if Supabase is unreachable
  // at build time, they just are not prerendered.
  const slugs = await getHelpSlugs()
  return slugs.map((s) => ({ slug: s.slug }))
}

/** First ~155 characters of prose, for the meta description and OG. */
function summarise(html, fallback) {
  const text = String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!text) return fallback
  if (text.length <= 155) return text
  const cut = text.slice(0, 155)
  const stop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf(' '))
  return (stop > 80 ? cut.slice(0, stop) : cut).trim() + '…'
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const answer = await getHelpAnswer(slug)
  if (!answer) return previewMetadata(`/help/${slug}`, { title: 'Help | Spinr' })

  const description = answer.placeholder
    ? `We have not written this one up yet. Ask the Spinr AI assistant about ${answer.title.toLowerCase()}, or email support@spinr.ca.`
    : summarise(answer.html, 'Help and support for riding and driving with Spinr in Saskatoon.')

  // A topic with no article behind it is a thin page. Keep the link working,
  // keep it out of the index.
  if (answer.placeholder) {
    const meta = await previewMetadata(`/help/${slug}`, {
      title: `${answer.title} | Spinr Help`,
      description,
    })
    return { ...meta, robots: { index: false, follow: true } }
  }

  return previewMetadata(`/help/${slug}`, {
    title: `${answer.title} | Spinr Help`,
    description,
    alternates: { canonical: `${SITE_URL}/help/${slug}` },
    openGraph: {
      type: 'article',
      title: answer.title,
      description,
      url: `${SITE_URL}/help/${slug}`,
    },
  })
}

export default async function HelpAnswerPage({ params }) {
  const { slug } = await params
  const answer = await getHelpAnswer(slug)
  if (!answer) notFound()

  const related = await getRelatedAnswers(slug, answer.categoryId)
  const description = summarise(answer.html, '')

  /* An FAQ is marked up as a Q&A pair and an article as an Article — Google
     renders them differently, and claiming the wrong one is worse than
     claiming neither. Breadcrumbs go on both. A placeholder claims neither:
     there is no article there to describe. */
  const jsonLd = answer.placeholder ? null : {
    '@context': 'https://schema.org',
    '@graph': [
      answer.kind === 'faq'
        ? {
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: answer.title,
                acceptedAnswer: { '@type': 'Answer', text: description },
              },
            ],
          }
        : {
            '@type': 'Article',
            headline: answer.title,
            description,
            author: { '@type': 'Organization', name: 'Spinr' },
            publisher: { '@type': 'Organization', name: 'Spinr' },
          },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Help', item: `${SITE_URL}/help` },
          { '@type': 'ListItem', position: 2, name: answer.title, item: `${SITE_URL}/help/${slug}` },
        ],
      },
    ],
  }

  return (
    <>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}

      <header className="sp-ans-hero">
        <div className="sp-wrap">
          <nav className="sp-ans-crumb" aria-label="Breadcrumb">
            <Link href="/help">Help centre</Link>
            {answer.categoryTitle && <span aria-hidden="true">/</span>}
            {answer.categoryTitle && (
              <Link href={`/help#${answer.categoryId}`}>{answer.categoryTitle}</Link>
            )}
          </nav>
          <h1 className="sp-display sp-ans-h">{answer.title}</h1>
        </div>
      </header>

      <div className="sp-wrap sp-ans-wrap">
        <article className="sp-ans-card">
          {answer.placeholder ? (
            <div className="sp-ans-todo">
              <span className="sp-display">Not written up yet</span>
              <p>
                This one is on the list. In the meantime the AI assistant can answer
                it — it reads the same help centre plus our full knowledge base, and
                it will hand you to a person when it should.
              </p>
              <div className="sp-ans-todo-btns">
                <Link className="sp-btn" href="/help#assistant">Ask the AI assistant</Link>
                <a className="sp-btn-ghost" href="mailto:support@spinr.ca">Email support</a>
              </div>
            </div>
          ) : (
            <SafeHtml className="sp-ans-body" content={answer.html} />
          )}
        </article>

        <aside className="sp-ans-side">
          <div className="sp-ans-ai">
            <span className="sp-ans-spark" aria-hidden="true">&#10022;</span>
            <b>Still stuck?</b>
            <p>
              The AI assistant answers from this same help centre, and knows whether
              you are asking as a rider or a driver.
            </p>
            <Link className="sp-btn sp-ans-ai-btn" href="/help#assistant">Ask the AI assistant</Link>
          </div>

          {related.length > 0 && (
            <nav className="sp-ans-rel" aria-label="Related answers">
              <h2 className="sp-display">Keep reading</h2>
              <ul>
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/help/${r.slug}`}>{r.title}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <p className="sp-ans-mail">
            Need a person? <a href="mailto:support@spinr.ca">support@spinr.ca</a>
          </p>
        </aside>
      </div>

      <FinalCta
        title={<>Answers in the app,<br />before you have to ask.</>}
        sub="Riding in Saskatoon."
      />
    </>
  )
}
