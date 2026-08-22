import { previewMetadata } from '@/lib/preview-content'
import LegalShell from '../LegalShell'
import { PRIVACY } from '../content'

export const revalidate = 0

export async function generateMetadata() {
  return previewMetadata('/preview/legal/privacy', {
    title: 'Privacy Policy | Spinr Design Sample',
    description: 'Draft privacy policy. Design sample.',
  })
}

export default function PrivacyPage() {
  return (
    <LegalShell
      kicker="Your information"
      doc={PRIVACY}
      other={{ href: '/preview/legal/terms', label: 'Terms of service' }}
    />
  )
}
