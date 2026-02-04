'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, DollarSign, Clock, Calendar, Shield, Car, CheckCircle2, FileText, Wallet, Headphones } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { IMAGES } from '@/constants/images'

export default function DrivePageClient({ structuredData }) {
  const [trips, setTrips] = useState([40])
  const avgFare = 18
  const weeklyEarnings = trips[0] * avgFare
  const competitorEarnings = weeklyEarnings * 0.75
  const spinrEarnings = weeklyEarnings

  const benefits = [
    { icon: DollarSign, title: '0% Commission Forever', description: 'Every dollar goes to you.' },
    { icon: Calendar, title: '6 Months Free', description: 'No subscription to start.' },
    { icon: Clock, title: 'Daily Payouts', description: 'Earnings deposited in 24h.' },
    { icon: Shield, title: 'Full Insurance', description: 'Coverage while on the job.' },
    { icon: Car, title: 'Be Your Own Boss', description: 'Set your own hours.' },
    { icon: CheckCircle2, title: 'Local Support', description: 'Real people in Saskatchewan.' },
  ]



  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* JSON-LD Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* Hero Section with Form */}
      <section className="relative pt-32 pb-20 min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={IMAGES.driver.hero}
            alt="Driver Background"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Column: Text */}
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Drive when you want, <br />
                <span className="text-primary">make what you need</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Earn on your own schedule. No office, no boss. Sign up today and start earning in as little as 24 hours.
              </p>

              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-primary w-5 h-5" />
                  <span className="font-semibold text-gray-700">Secure Payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-primary w-5 h-5" />
                  <span className="font-semibold text-gray-700">Flexible Hours</span>
                </div>
              </div>
            </div>

            {/* Right Column: Sign Up Form */}
            <div>
              <Card className="shadow-2xl border-0 rounded-[30px] overflow-hidden bg-white/90 backdrop-blur-sm">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900">Become a Driver</CardTitle>
                  <p className="text-gray-500">Join our community of 50,000+ drivers.</p>
                </CardHeader>
                <CardContent className="p-8 pt-2">
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <input type="text" placeholder="Enter your full name" className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Email Address</label>
                      <input type="email" placeholder="name@example.com" className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">City</label>
                      <select className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option value="">Where will you drive?</option>
                        <option value="regina">Regina</option>
                        <option value="saskatoon">Saskatoon</option>
                      </select>
                    </div>

                    <Button className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90 text-white rounded-xl mt-4">
                      Get Started
                    </Button>

                    <p className="text-[10px] text-gray-400 text-center leading-tight pt-2">
                      By proceeding, you consent to get calls, WhatsApp or SMS messages, including by automated means, from Spinr.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Driving with Spinr is easy</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-16">
            From signup to your first paycheck, we've streamlined the process so you can focus on the road.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center mb-6 text-primary">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">1. Sign Up Online</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Tell us a little about yourself and your vehicle. The form above takes less than 2 minutes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center mb-6 text-primary">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">2. Upload Documents</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Submit your driver's license, vehicle registration, and proof of insurance securely through our portal.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center mb-6 text-primary">
                <Car className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">3. Hit the Road</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Once approved, download the driver app and go online whenever you want to start earning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Earnings Calculator */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-4">
            See How Much More You Could <span className="text-primary">Earn</span>
          </h2>
          <p className="text-muted-foreground text-center mb-8">Compare earnings: Spinr vs competitors</p>
          <div className="max-w-4xl mx-auto">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-center text-card-foreground">Weekly Earnings Calculator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Weekly Trips</span>
                    <span className="text-primary font-semibold text-lg">{trips[0]} trips</span>
                  </div>
                  <Slider value={trips} onValueChange={setTrips} max={100} min={10} step={5} className="w-full" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>10 trips</span>
                    <span>100 trips</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-secondary rounded-xl p-6">
                    <h4 className="text-muted-foreground font-medium mb-2">With Uber/Lyft</h4>
                    <p className="text-3xl font-bold text-foreground">${competitorEarnings.toFixed(0)}</p>
                    <p className="text-sm text-primary mt-1">-25% commission taken</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-6 border-2 border-primary">
                    <h4 className="text-primary font-medium mb-2">With Spinr</h4>
                    <p className="text-3xl font-bold text-primary">${spinrEarnings.toFixed(0)}</p>
                    <p className="text-sm text-red-400 mt-1">0% commission - keep it all!</p>
                  </div>
                </div>
                <div className="text-center bg-gray-900 rounded-xl p-6">
                  <p className="text-gray-400 mb-2">Extra earnings with Spinr</p>
                  <p className="text-4xl font-bold text-primary">${(spinrEarnings - competitorEarnings).toFixed(0)}/week</p>
                  <p className="text-gray-400 text-sm mt-2">${((spinrEarnings - competitorEarnings) * 52).toFixed(0)} more per year!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Drivers Choose Spinr */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: Image with Overlay */}
            <div className="relative rounded-[32px] overflow-hidden shadow-2xl group">
              <div className="relative h-[600px] w-full">
                <Image
                  src="/driver_feature.png"
                  alt="Driver Perspective"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              {/* Floating Overlay Card */}
              <div className="absolute bottom-8 left-8 bg-white p-6 rounded-2xl shadow-lg max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-gray-900">Weekly Payouts</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Get paid every Tuesday directly to your bank account.
                </p>
              </div>
            </div>

            {/* Right: Content */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Why drivers choose Spinr</h2>
              <p className="text-lg text-gray-600 mb-12">
                We put our drivers first with lower commissions and 24/7 support.
              </p>

              <div className="space-y-10">
                {/* Feature 1 */}
                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center shrink-0 text-primary">
                    <Wallet className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Keep more of what you earn</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Our platform fee is one of the lowest in the industry, meaning more money in your pocket for every mile.
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center shrink-0 text-primary">
                    <Calendar className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Complete Flexibility</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Set your own hours. Whether you need a side hustle or a full-time gig, Spinr works around your life.
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center shrink-0 text-primary">
                    <Headphones className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Driver Support</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Real humans are available any time of day or night to help you with issues on the road.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Everything You Need to <span className="text-primary">Succeed</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {benefits.map((b, i) => (
              <Card key={i} className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                    <b.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">{b.title}</h3>
                  <p className="text-muted-foreground">{b.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">Ready to Keep 100% of Your Earnings?</h2>
          <p className="text-red-100 mb-8">Join Spinr today. First 6 months free, 0% commission forever.</p>
          <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white text-lg px-8">
            Apply to Drive Now <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  )
}
