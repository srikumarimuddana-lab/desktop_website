import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import DriverSignupClient from './DriverSignupClient'

export const metadata = {
  title: 'Sign Up to Drive | Spinr',
  description:
    'Apply to drive with Spinr in about 10 minutes. Keep 100% of your net fare — 0% commission, Saskatchewan owned and operated.',
}

export default function DriverSignupPage() {
  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen bg-gray-50">
        <DriverSignupClient />
      </main>
      <Footer />
    </>
  )
}
