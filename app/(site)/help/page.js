import HelpClient from './HelpClient'
import { getFaqs, getHelpArticles, previewMetadata } from '@/lib/preview-content'
import { pickFaqs } from '@/lib/faq-fallback'

/* revalidate 0: FAQs and help articles created in /spinr-internal must show
 * on the next request. The same rows are pushed into knowledge_base by
 * lib/kb-sync.js, so the page and the AI assistant stay in step. */
export const revalidate = 0

export async function generateMetadata() {
  return previewMetadata('/help', {
    title: 'Help centre | Spinr',
    description: 'Riding, driving and account help in one place, plus an AI assistant that answers from the same help centre.',
  })
}

const FAQ_FALLBACK = pickFaqs([
  'What does a ride actually cost?',
  'Which fees does Spinr keep?',
  'How does 0% commission work?',
  'What is the Spinr Pass?',
  'What happens when I hit 4 rides on the Part-time plan?',
  'Can I switch between Part-time and Full-time?',
  'Where can I use Spinr?',
  'Who is driving me?',
  'Can the AI assistant book for me?',
])

export default async function HelpPage() {
  const [faq, articles] = await Promise.all([
    getFaqs({ limit: 9, fallback: FAQ_FALLBACK }),
    getHelpArticles(),
  ])
  return <HelpClient faq={faq} articles={articles} />
}
