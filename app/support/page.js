import Image from 'next/image'
import { Mail, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import JsonLdInjector from '@/components/seo/JsonLdInjector'
import { IMAGES } from '@/constants/images'
import { getSeoMetadata, getStructuredData } from '@/lib/seo'
import SupportClient from './SupportClient'

// Dynamic metadata from database
export async function generateMetadata() {
  return getSeoMetadata('/support', {
    title: "Spinr Support & FAQs",
    description: "Get help with Spinr. Find answers to common questions about riding and driving. Local Saskatchewan support team.",
    keywords: "Spinr help, Spinr support, rideshare FAQ, contact Spinr"
  })
}

export default async function SupportPage() {
  // Fetch structured data from database
  const structuredData = await getStructuredData('/support')

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* JSON-LD Structured Data */}
      {structuredData && <JsonLdInjector data={structuredData} />}

      <div className="pt-24 pb-16">
        <SupportClient />
      </div>

      <Footer />
    </main>
  )
}
