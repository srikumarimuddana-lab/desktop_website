import LegalShell from '../LegalShell'
import { TERMS } from '../content'

export const metadata = { title: 'Terms of Service | Spinr Design Sample' }

export default function TermsPage() {
  return (
    <LegalShell
      kicker="The agreement"
      doc={TERMS}
      other={{ href: '/preview/legal/privacy', label: 'Privacy policy' }}
    />
  )
}
