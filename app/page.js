import Link from 'next/link'
import Image from 'next/image'
import { QRCodeSVG } from 'qrcode.react'
import { ArrowRight, DollarSign, Shield, Clock, Users, Percent, CreditCard, Car, CheckCircle, Ticket, Heart, Smartphone, ShieldCheck, Wallet, MousePointerClick } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import JsonLdInjector from '@/components/seo/JsonLdInjector'
import HeroMockUI from '@/components/home/HeroMockUI'
import RiderImageUI from '@/components/home/RiderImageUI'
import PhoneMockupUI from '@/components/home/PhoneMockupUI'
import { IMAGES } from '@/constants/images'
import { getSeoMetadata, getStructuredData } from '@/lib/seo'

// Dynamic metadata from database
export async function generateMetadata() {
  return getSeoMetadata('/', {
    title: "Spinr - 0% Commission Rideshare in Saskatchewan",
    description: "Saskatchewan's own rideshare platform. Drivers keep 100% of fares, riders pay just $1. No surge pricing. Now serving Regina & Saskatoon.",
    keywords: "rideshare Saskatchewan, 0% commission, Regina rideshare, Saskatoon rideshare"
  })
}

export default async function Home() {
  // Fetch structured data from database
  const structuredData = await getStructuredData('/')

  const driverBenefits = [
    { icon: Percent, title: '0% Commission', description: 'Keep 100% of every fare. Forever.' },
    { icon: DollarSign, title: '6 Months Free', description: 'No subscription for your first 6 months.' },
    { icon: CreditCard, title: 'Daily Payouts', description: 'Get paid every day, not weekly.' },
  ]
  const riderBenefits = [
    { icon: DollarSign, title: 'Flat $1 Fee', description: 'No surge pricing, no surprises.' },
    { icon: Shield, title: 'Safe & Local', description: 'Verified Saskatchewan drivers.' },
    { icon: Clock, title: 'Fast Pickups', description: 'Reliable service across Regina & Saskatoon.' },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* JSON-LD Structured Data */}
      {structuredData && <JsonLdInjector data={structuredData} />}

      {/* Hero Section with 2-Column Layout */}
      <section className="relative pt-32 pb-20 min-h-[90vh] flex items-center overflow-hidden bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Column: Text Content */}
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-2 mb-8">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-primary text-sm font-medium">Now serving Regina & Saskatoon</span>
              </div>

              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-foreground mb-8 leading-[1.1] tracking-tight">
                Move freely.<br />
                <span className="text-primary">Earn on your terms.</span>
              </h1>

              <p className="text-xl sm:text-2xl text-muted-foreground mb-10 leading-relaxed max-w-lg">
                Reliable rides in minutes or flexible earnings whenever you want. The choice is yours with Spinr.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/ride">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-7 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                    <Users className="mr-2 h-5 w-5" /> Request a Ride
                  </Button>
                </Link>
                <Link href="/drive">
                  <Button size="lg" variant="outline" className="border-2 border-gray-200 text-foreground hover:bg-gray-50 text-lg px-8 py-7 rounded-full">
                    <Car className="mr-2 h-5 w-5" /> Start Driving
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                    <Image src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80" alt="User" width={40} height={40} />
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                    <Image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="User" width={40} height={40} />
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                    <Image src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" alt="User" width={40} height={40} />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Trusted by Saskatchewan</span><br />
                  Growing community every day
                </div>
              </div>
            </div>

            {/* Right Column: Mock UI */}
            <div className="relative z-10 hidden lg:block">
              {/* Blur Blob Background */}
              <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-red-100/50 to-blue-50/50 blur-3xl opacity-70 -z-10 rounded-full" />
              <HeroMockUI />
            </div>

          </div>
        </div>
      </section>

      {/* NEW: Your city, at your fingertips Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Content Left */}
            <div className="order-2 lg:order-1">
              <span className="bg-red-50 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-6 inline-block">
                Rider Path
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Your city, at your <br />
                <span className="text-primary">fingertips.</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Experience a ride-sharing service built for your comfort and safety. With Spinr, you're never more than a few minutes away from your destination.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Fixed Pricing</h4>
                    <p className="text-sm text-gray-500">No surprises at the end of the trip.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">24/7 Support</h4>
                    <p className="text-sm text-gray-500">We're here whenever you need us.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Right */}
            <div className="order-1 lg:order-2">
              <RiderImageUI />
            </div>

          </div>
        </div>
      </section>

      {/* NEW: Exclusive Rider Benefits Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* Left Text */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Exclusive Rider Benefits in <br />
                  <span className="text-primary">Saskatchewan</span>
                </h2>
                <p className="text-gray-600 mb-8 max-w-lg">
                  We're tailoring our experience to the Land of Living Skies. From Regina to Saskatoon, enjoy localized perks that make commuting easier.
                </p>

                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-gray-700 font-medium">
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-primary" />
                    </div>
                    Winter-Ready Pickups
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 font-medium">
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                      <Ticket className="w-4 h-4 text-primary" />
                    </div>
                    Local Events Shuttle Service
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 font-medium">
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-primary" />
                    </div>
                    SGI-Integrated Safety Standards
                  </li>
                </ul>
              </div>

              {/* Right Card */}
              <div className="flex justify-center">
                <div className="bg-white border-2 border-dashed border-red-200 rounded-3xl p-8 w-full max-w-sm text-center shadow-sm">
                  <div className="w-16 h-16 bg-red-50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-8 h-8 fill-current" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Prairie Rewards</h3>
                  <p className="text-gray-500 text-sm">
                    Earn points on every trip across Saskatchewan and redeem for local discounts.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* NEW: Why Choose Spinr Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Spinr
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Experience the best way to move around your city with safety, savings, and ease at the core of everything we do.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Safety First</h3>
              <p className="text-gray-600 leading-relaxed">
                Verified drivers and real-time tracking for peace of mind on every journey you take.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                <Wallet className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Savings</h3>
              <p className="text-gray-600 leading-relaxed">
                Transparent pricing with no hidden fees. Know exactly what you pay before you ride.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                <MousePointerClick className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Effortless Travel</h3>
              <p className="text-gray-600 leading-relaxed">
                One tap to go anywhere in the city. Seamless pickups and efficient routing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Get the App CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[48px] p-8 md:p-16 shadow-xl border border-gray-100 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center relative z-10">

              {/* Text Content */}
              <div>
                <span className="bg-red-50 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-6 inline-block">
                  Mobile App
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Ready to ride? <br />
                  Get the Spinr app.
                </h2>
                <p className="text-lg text-gray-600 mb-10 max-w-md">
                  Download now on iOS and Android to start riding or driving in moments.
                </p>

                <div className="flex flex-col sm:flex-row gap-6">
                  {/* QR Card 1: Rider App */}
                  <Link href="https://apps.apple.com/ca/app/spinr/id123456789" target="_blank" className="bg-white p-6 rounded-2xl flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer min-w-[320px] group border border-gray-100">
                    <div className="bg-white p-2 rounded-xl border border-gray-100 shrink-0">
                      <QRCodeSVG
                        value="https://apps.apple.com/ca/app/spinr/id123456789"
                        size={128}
                        level="H"
                        fgColor="#000000"
                        bgColor="#ffffff"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-xl mb-2">Rider App</h4>
                      <div className="flex items-center text-gray-500 gap-1 group-hover:text-primary transition-colors font-medium">
                        Scan to download <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </Link>

                  {/* QR Card 2: Driver App */}
                  <Link href="https://play.google.com/store/apps/details?id=com.spinr.driver" target="_blank" className="bg-white p-6 rounded-2xl flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer min-w-[320px] group border border-gray-100">
                    <div className="bg-white p-2 rounded-xl border border-gray-100 shrink-0">
                      <QRCodeSVG
                        value="https://play.google.com/store/apps/details?id=com.spinr.driver"
                        size={128}
                        level="H"
                        fgColor="#000000"
                        bgColor="#ffffff"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-xl mb-2">Driver App</h4>
                      <div className="flex items-center text-gray-500 gap-1 group-hover:text-primary transition-colors font-medium">
                        Scan to download <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Phone Mockup Component */}
              <div className="relative w-full flex justify-center lg:justify-center mt-10 lg:mt-0">
                <div className="relative transform lg:translate-y-10 lg:scale-110 origin-bottom transition-transform duration-500 hover:translate-y-8">
                  <PhoneMockupUI />
                </div>
              </div>

            </div>

            {/* Decorative Background Blob */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-50/50 to-transparent -z-0 rounded-r-[48px]" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
