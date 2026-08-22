import HelpClient from './HelpClient'
import { getFaqs, getHelpArticles, previewMetadata } from '@/lib/preview-content'

/* revalidate 0: FAQs and help articles created in /spinr-internal must show
 * on the next request. The same rows are pushed into knowledge_base by
 * lib/kb-sync.js, so the page and the AI assistant stay in step. */
export const revalidate = 0

export async function generateMetadata() {
  return previewMetadata('/preview/help', {
    title: 'Help | Spinr Design Sample',
    description: 'Riding, driving and account help in one place. Design sample.',
  })
}

const FAQ_FALLBACK = [
  ['What does a ride actually cost?', 'The ride fare, a flat $1 booking fee — the only fee Spinr keeps — plus pass-through charges where they apply (insurance, city or airport fees) and tax, each shown by name before you book. No surge multiplier, ever.'],
  ['Which fees does Spinr keep?', 'One: the $1 booking fee. The fare goes to your driver, the insurance fee to the insurer, city and airport fees to the city and airport, tax to the government — collected and passed through, never marked up.'],
  ['How does 0% commission work?', 'Drivers keep 100% of the net fare. The platform runs on the rider\u2019s flat $1 booking fee and the Spinr Pass, the subscription drivers pay for access to the app — never on a cut of the driver\u2019s money.'],
  ['Where can I use Spinr?', 'Spinr is available in Saskatoon, Saskatchewan. There is no planned launch in any other city at this time.'],
  ['Who is driving me?', 'Every driver passes a criminal record check with vulnerable sector screening, holds a full driver\u2019s licence with at least three years of experience, and carries commercial ride-share insurance.'],
  ['Can the AI assistant book for me?', 'Yes — ask it to price a trip, book or schedule a ride, pull up a past receipt, or check your wallet. It hands you to a human when it should.'],
]

export default async function HelpPage() {
  const [faq, articles] = await Promise.all([
    getFaqs({ limit: 8, fallback: FAQ_FALLBACK }),
    getHelpArticles(),
  ])
  return <HelpClient faq={faq} articles={articles} />
}
