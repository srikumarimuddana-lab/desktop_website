import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, DollarSign, Shield, Clock, MapPin, Smartphone, CreditCard, Apple, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import JsonLdInjector from '@/components/seo/JsonLdInjector'
import { IMAGES } from '@/constants/images'
import { getSeoMetadata, getStructuredData } from '@/lib/seo'

// Dynamic metadata from database
export async function generateMetadata() {
  return getSeoMetadata('/ride', {
    title: "Ride with Spinr - Affordable Local Rides",
    description: "Get rides in Regina and Saskatoon for just $1 platform fee. No surge pricing, verified local drivers, fair transparent pricing.",
    keywords: "ride Spinr, cheap rides Saskatchewan, Regina taxi, Saskatoon rides, no surge pricing"
  })
}

export default async function RidePage() {
  // Fetch structured data from database
  const structuredData = await getStructuredData('/ride')

  const benefits = [
    { icon: DollarSign, title: 'Flat $1 Platform Fee', description: 'Just $1 per trip. No surge pricing, no hidden charges, no surprises.' },
    { icon: Shield, title: 'Verified Local Drivers', description: 'All drivers are Saskatchewan locals, background checked and fully insured.' },
    { icon: Clock, title: 'Fast & Reliable', description: 'Get picked up in minutes. Available across Regina and Saskatoon.' },
    { icon: MapPin, title: 'Track Your Ride', description: 'Real-time GPS tracking. Share your trip with friends and family.' },
    { icon: CreditCard, title: 'Easy Payment', description: 'Pay with card or Apple Pay. No cash needed, automatic receipts.' },
    { icon: Smartphone, title: 'Easy to Use', description: 'Simple, intuitive app. Request a ride in just a few taps.' },
  ]

  const howItWorks = [
    { step: '1', title: 'Download the App', description: 'Get Spinr from the App Store or Google Play. Sign up in seconds.' },
    { step: '2', title: 'Request a Ride', description: 'Enter your destination. See the price upfront before you confirm.' },
    { step: '3', title: 'Enjoy Your Trip', description: 'Your local driver arrives in minutes. Sit back and relax.' },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* JSON-LD Structured Data */}
      {structuredData && <JsonLdInjector data={structuredData} />}

      {/* Hero Section with Image */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 min-h-[70vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src={IMAGES.rider.hero}
            alt="Person using phone for rideshare"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/60" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-2 mb-6">
              <span className="text-primary text-sm font-medium">No Surge Pricing, Ever</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
              Ride with <span className="text-primary">Spinr</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8">
              Just <span className="text-primary font-semibold">$1</span> platform fee per trip. 
              No hidden costs. No surge pricing. Fair rides for Saskatchewan.
            </p>

            {/* App Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white">
                <Apple className="mr-2 w-5 h-5" />
                Download for iOS
              </Button>
              <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white">
                <Play className="mr-2 w-5 h-5" />
                Download for Android
              </Button>
            </div>

            <p className="text-muted-foreground text-sm mt-4">Coming soon to App Store and Google Play</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Getting a Ride is <span className="text-primary">Easy</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {howItWorks.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-foreground">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Transparent <span className="text-primary">Pricing</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              With Spinr, what you see is what you pay. No surprise fees.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Other Apps */}
                  <div className="bg-gray-700/50 rounded-xl p-6">
                    <h4 className="text-gray-400 font-medium mb-4">Other Rideshare Apps</h4>
                    <ul className="space-y-3">
                      <li className="flex justify-between text-gray-300"><span>Base Fare</span><span>$2.50</span></li>
                      <li className="flex justify-between text-gray-300"><span>Service Fee</span><span>$2.75</span></li>
                      <li className="flex justify-between text-gray-300"><span>Booking Fee</span><span>$1.50</span></li>
                      <li className="flex justify-between text-red-400"><span>Surge Pricing</span><span>1.5x - 3x</span></li>
                      <li className="border-t border-gray-600 pt-3 flex justify-between text-white font-semibold">
                        <span>Hidden Total</span><span className="text-red-400">$$$</span>
                      </li>
                    </ul>
                  </div>

                  {/* Spinr */}
                  <div className="bg-red-500/20 rounded-xl p-6 border-2 border-primary">
                    <h4 className="text-primary font-medium mb-4">Spinr</h4>
                    <ul className="space-y-3">
                      <li className="flex justify-between text-gray-300"><span>Trip Cost</span><span>Driver&apos;s Rate</span></li>
                      <li className="flex justify-between text-primary"><span>Platform Fee</span><span>$1.00</span></li>
                      <li className="flex justify-between text-gray-300"><span>Surge Pricing</span><span className="text-primary">Never</span></li>
                      <li className="flex justify-between text-gray-300"><span>Hidden Fees</span><span className="text-primary">None</span></li>
                      <li className="border-t border-red-500/30 pt-3 flex justify-between text-white font-semibold">
                        <span>Your Total</span><span className="text-primary">Fair Price</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Riders Love <span className="text-primary">Spinr</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Ready for a Fairer Ride?
          </h2>
          <p className="text-red-100 mb-8 max-w-2xl mx-auto">
            Download Spinr and experience rideshare the way it should be. Just $1 per trip.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white">
              <Apple className="mr-2 w-5 h-5" />
              App Store
            </Button>
            <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white">
              <Play className="mr-2 w-5 h-5" />
              Google Play
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
