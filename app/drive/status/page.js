import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import DriverStatusClient from './DriverStatusClient'

export const metadata = {
  title: 'Your Driver Application | Spinr',
  description: 'Track the status of your Spinr driver application.',
  robots: { index: false },
}

export default function DriverStatusPage() {
  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen bg-gray-50">
        <DriverStatusClient />
      </main>
      <Footer />
    </>
  )
}
