import LegalShell from '../LegalShell'
import { PRIVACY } from '../content'

export const metadata = { title: 'Privacy Policy | Spinr Design Sample' }

export default function PrivacyPage() {
  return (
    <LegalShell
      kicker="Your information"
      doc={PRIVACY}
      other={{ href: '/preview/legal/terms', label: 'Terms of service' }}
    />
  )
}
