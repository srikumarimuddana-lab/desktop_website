import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BookRideClient from './BookRideClient'

export const metadata = {
  title: 'Book a Ride | Spinr',
  description: 'Book your Spinr ride online — transparent pricing, no surprises.',
  robots: { index: false },
}

export default function BookRidePage() {
  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen bg-gray-50">
        <BookRideClient />
      </main>
      <Footer />
    </>
  )
}
