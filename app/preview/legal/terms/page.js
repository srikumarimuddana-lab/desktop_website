import { previewMetadata } from '@/lib/preview-content'
import LegalShell from '../LegalShell'
import { TERMS } from '../content'

export const revalidate = 0

export async function generateMetadata() {
  return previewMetadata('/preview/legal/terms', {
    title: 'Terms of Service | Spinr Design Sample',
    description: 'Draft terms of service. Design sample.',
  })
}

export default function TermsPage() {
  return (
    <LegalShell
      kicker="The agreement"
      doc={TERMS}
      other={{ href: '/preview/legal/privacy', label: 'Privacy policy' }}
    />
  )
}
