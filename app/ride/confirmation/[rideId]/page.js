import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import RideConfirmationClient from './RideConfirmationClient'

export const metadata = {
  title: 'Your Ride | Spinr',
  robots: { index: false },
}

export default async function RideConfirmationPage({ params }) {
  const { rideId } = await params
  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen bg-gray-50">
        <RideConfirmationClient rideId={rideId} />
      </main>
      <Footer />
    </>
  )
}
