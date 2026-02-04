import DrivePageClient from './DrivePageClient'
import { getSeoMetadata, getStructuredData } from '@/lib/seo'

// Dynamic metadata from database
export async function generateMetadata() {
  return getSeoMetadata('/drive', {
    title: "Drive for Spinr - Keep 100% of Net Fare",
    description: "Become a Spinr driver in Saskatchewan. 0% commission forever, daily payouts, first 6 months free. Keep every dollar you earn.",
    keywords: "drive Spinr, rideshare driver Saskatchewan, 0% commission driver, Regina driver jobs, Saskatoon driver"
  })
}

export default async function DrivePage() {
  // Fetch structured data from database
  const structuredData = await getStructuredData('/drive')

  return <DrivePageClient structuredData={structuredData} />
}
