import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, DollarSign, Shield, Clock, MapPin, Smartphone, CreditCard, Apple, Play, UserCheck, Car } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import SmartDownloadButton from '@/components/ui/SmartDownloadButton'
import SmartAppLink from '@/components/ui/SmartAppLink'
import FareCalculator from './FareCalculator'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import JsonLdInjector from '@/components/seo/JsonLdInjector'
import { IMAGES } from '@/constants/images'
import PhoneMockupUI from '@/components/home/PhoneMockupUI'
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="max-w-xl">
              <span className="text-[#E63946] font-bold tracking-widest text-sm uppercase mb-4 block">
                Revolutionizing Your Commute
              </span>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]">
                Your ride, <br />
                <span className="text-[#E63946]">your way.</span>
              </h1>
              <p className="text-xl text-gray-500 mb-10 leading-relaxed">
                Experience fair pricing, verified safety protocols, and 24/7 support with every Spinr trip.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <SmartDownloadButton size="lg" className="rounded-xl px-10 py-7 text-lg font-bold bg-[#E63946] hover:bg-[#D62839] text-white shadow-lg shadow-red-100">
                  Request a Ride
                </SmartDownloadButton>
              </div>
            </div>

            {/* Right Image - Landscape Card style */}
            <div className="relative h-[500px] lg:h-[600px] w-full flex items-center justify-center bg-gray-50 rounded-3xl overflow-hidden">
              <div className="relative w-[90%] max-w-[600px] aspect-video bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 rotate-[-2deg] hover:rotate-0 transition-all duration-700 ease-out">
                <Image
                  src={IMAGES.rider.hero}
                  alt="Spinr App Interface"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Decorative blob */}
              <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-red-100 rounded-full blur-3xl -z-10 opacity-60 mix-blend-multiply"></div>
              <div className="absolute -left-20 -top-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl -z-10 opacity-60 mix-blend-multiply"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-bold text-red-100 mb-6">01</div>
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-[#E63946] mb-6">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">1. Set your destination</h3>
              <p className="text-gray-500 leading-relaxed">
                Enter where you want to go to see the upfront price immediately.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-bold text-red-100 mb-6">02</div>
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-[#E63946] mb-6">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">2. Match with a driver</h3>
              <p className="text-gray-500 leading-relaxed">
                Our smart algorithm finds the closest Spinr partner for a quick pickup.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-bold text-red-100 mb-6">03</div>
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-[#E63946] mb-6">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">3. Hop in and enjoy</h3>
              <p className="text-gray-500 leading-relaxed">
                Secure payments and real-time tracking included in every trip for peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Impact Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Our Community Impact</h2>
            <p className="text-lg text-gray-500 leading-relaxed">
              We believe in a fair-pay model. Spinr takes a lower commission than competitors, ensuring more money stays in the hands of your local drivers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Card 1 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="relative h-64 w-full">
                <Image
                  src="https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=800&q=80"
                  alt="Happy Driver"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Support Local Drivers</h3>
                <p className="text-gray-500 leading-relaxed">
                  Every ride helps a driver in your neighborhood thrive. We give 90% of the fare back to our partners.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="relative h-64 w-full">
                <Image
                  src="https://images.unsplash.com/photo-1581094794329-cd8081648a31?auto=format&fit=crop&w=800&q=80"
                  alt="Fair Commission"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Fair Commission Model</h3>
                <p className="text-gray-500 leading-relaxed">
                  We prioritize driver earnings to ensure premium service for you. Better pay means better rides.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fare Transparency Calculator Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-red-50/50 skew-x-12 translate-x-32"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Know before you go. <br />
                <span className="text-red-500">Total Transparency.</span>
              </h2>
              <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                No more guessing games. With Spinr, you can see your estimated fare instantly. Our calculator uses real-time distance data to give you an accurate price range based on our fair-pay model.
              </p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="p-1 bg-red-100 rounded-full mt-1">
                    <ArrowRight className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Upfront Pricing</h4>
                    <p className="text-sm text-gray-500">Price locked in before you book.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-1 bg-red-100 rounded-full mt-1">
                    <ArrowRight className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">No Surge Pricing</h4>
                    <p className="text-sm text-gray-500">Same fair rates, even during rush hour.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <FareCalculator />
            </div>
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

      {/* Download App Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready for a Fairer Ride?
            </h2>
            <p className="text-red-100 max-w-2xl mx-auto text-lg">
              Scan to download and start riding in seconds.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-6 max-w-4xl mx-auto">
            {/* Rider App QR */}
            <SmartAppLink appType="rider" title="Rider App" qrSize={80} className="flex-1 shadow-lg" />

            {/* Driver App QR */}
            <SmartAppLink appType="driver" title="Driver App" qrSize={80} className="flex-1 shadow-lg" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
