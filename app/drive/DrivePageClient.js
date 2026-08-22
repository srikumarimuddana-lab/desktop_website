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
import SmartAppLink from '@/components/ui/SmartAppLink'

export default function DrivePageClient({ structuredData }) {
  const [trips, setTrips] = useState([40])
  const [dailyRides, setDailyRides] = useState([5]) // Default to recommended minimum
  const avgFare = 18
  const weeklyEarnings = trips[0] * avgFare
  const competitorEarnings = weeklyEarnings * 0.75
  const spinrEarnings = weeklyEarnings

  const benefits = [
    { icon: DollarSign, title: '0% Commission Forever', description: 'Every dollar goes to you.' },
    { icon: Calendar, title: '6 Months Free', description: 'No subscription to start.' },
    { icon: Clock, title: 'Weekly Payouts', description: 'Earnings deposited every week.' },
    { icon: Shield, title: 'Full Insurance', description: 'Coverage after ride starts.' },
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
      <section id="hero" className="relative pt-32 pb-20 min-h-[90vh] flex items-center overflow-hidden">
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

            {/* Right Column: Earnings Calculator */}
            <div>
              <Card className="shadow-2xl border-0 rounded-[30px] overflow-hidden bg-white/90 backdrop-blur-sm">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900">Weekly Earnings Calculator</CardTitle>
                  <div className="flex justify-between text-sm mt-4">
                    <span className="text-muted-foreground">Weekly Trips</span>
                    <span className="text-primary font-semibold text-lg">{trips[0]} trips</span>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-2 space-y-8">
                  <div className="space-y-4">
                    <Slider value={trips} onValueChange={setTrips} max={100} min={10} step={5} className="w-full" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>10 trips</span>
                      <span>100 trips</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-secondary rounded-xl p-4 text-center">
                      <h4 className="text-muted-foreground font-medium mb-1 text-sm">Other Rideshare Companies</h4>
                      <p className="text-2xl font-bold text-foreground">${competitorEarnings.toFixed(0)}</p>
                      <p className="text-xs text-primary mt-1">-25% commission</p>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4 border-2 border-primary text-center">
                      <h4 className="text-primary font-medium mb-1 text-sm">With Spinr</h4>
                      <p className="text-2xl font-bold text-primary">${spinrEarnings.toFixed(0)}</p>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-xs text-red-500 mt-1 font-bold">0% commission!</p>
                        <p className="text-[10px] text-gray-500">(Free for 6 months)</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center bg-gray-900 rounded-xl p-4">
                    <p className="text-gray-400 mb-1 text-sm">Extra earnings with Spinr</p>
                    <p className="text-3xl font-bold text-primary">${(spinrEarnings - competitorEarnings).toFixed(0)}/week</p>
                    <p className="text-gray-400 text-xs mt-1">${((spinrEarnings - competitorEarnings) * 52).toFixed(0)} more per year!</p>
                  </div>

                  <div className="pt-2">
                    <Button className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90 text-white rounded-xl" onClick={() => document.getElementById('download').scrollIntoView({ behavior: 'smooth' })}>
                      Start Earning Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Driving with Spinr is easy</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-16">
            From signup to your first paycheck, we've streamlined the process so you can focus on the road.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
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

          {/* NEW: Quick Requirements Buttons */}
          <div className="bg-gray-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Check requirements before you start</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/support/requirements#driver-requirements">
                <Button variant="outline" className="h-12 px-6 rounded-xl border-gray-300 hover:border-primary hover:text-primary hover:bg-white text-gray-700 font-medium">
                  Driver Requirements
                </Button>
              </Link>
              <Link href="/support/requirements#vehicle-requirements">
                <Button variant="outline" className="h-12 px-6 rounded-xl border-gray-300 hover:border-primary hover:text-primary hover:bg-white text-gray-700 font-medium">
                  Vehicle Requirements
                </Button>
              </Link>
              <Link href="/support/requirements#document-requirements">
                <Button variant="outline" className="h-12 px-6 rounded-xl border-gray-300 hover:border-primary hover:text-primary hover:bg-white text-gray-700 font-medium">
                  Document Requirements
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Quick Download QR Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        {/* Decorative blur orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-500/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm font-medium mb-8 border border-white/10">
              <Car className="w-4 h-4" />
              <span>Start Earning Today</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Download the Driver App
            </h2>
            <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto">
              Scan the QR code with your phone camera or tap the card to download. Available on iOS and Android.
            </p>

            {/* QR Card - Glassmorphism style */}
            <div className="flex justify-center">
              <div className="">
                <SmartAppLink
                  appType="driver"
                  title="Spinr Driver"
                  qrSize={120}
                  className="w-full !bg-white/95 !backdrop-blur-sm !shadow-2xl !border-0 !rounded-2xl"
                />

              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Why Drivers Choose Spinr */}
      <section id="why-choose" className="py-24 bg-white">
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
                      Spinr takes 0% commission \u2014 you subscribe to the app with a monthly Spinr Pass instead, so every dollar you earn on a trip stays yours. New drivers get 6 months free, then Part-time at $19.99/month as an introductory rate, or Full-time at $49.99/month.
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
      <section id="benefits" className="py-16 bg-secondary">
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



      {/* Subscription Plans Section */}
      <section id="subscription" className="py-24 bg-white scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              0% Commission - <span className="text-primary">That's Our Promise</span>
            </h2>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium text-sm mb-8">
              <Shield className="w-4 h-4" />
              <span>We don't take any commission - ever</span>
            </div>
            <p className="text-xl text-gray-600">
              Keep 100% of your fares with our transparent subscription model.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
            {/* Standard Plan */}
            <Card className="border border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-lg relative overflow-hidden bg-white">
              <CardHeader className="text-center pb-4 border-b border-gray-100">
                <CardTitle className="text-2xl font-bold text-gray-900">Standard Driver</CardTitle>
                <div className="mt-4 flex flex-col items-center justify-center">
                  <span className="text-gray-400 line-through text-lg font-medium">$19.99/mo</span>
                  <span className="text-5xl font-extrabold text-gray-900">$0<span className="text-lg font-medium text-gray-500">/mo</span></span>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    Free for 6 Months
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8 pt-8 px-6 sm:px-8">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    The "Catch":
                  </p>
                  <p className="text-gray-600 text-sm">
                    Limited to <span className="font-bold text-gray-900">5 rides/day maximum</span>.
                  </p>
                </div>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-green-100 text-green-600 shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-gray-700 font-medium">Keep 100% of fares</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-green-100 text-green-600 shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-gray-700">Weekly Payouts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-green-100 text-green-600 shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-gray-700">Standard Support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-green-100 text-green-600 shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-gray-700">Basic App Features</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-bold py-4 rounded-xl text-lg transition-all">
                  Choose Standard
                </Button>
                <p className="text-xs text-center text-gray-400">
                  Cancel anytime. Limit resets daily.
                </p>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-primary shadow-xl relative overflow-hidden group bg-white">
              <div className="absolute top-0 inset-x-0 h-2 bg-primary" />
              <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                Most Popular
              </div>
              <CardHeader className="text-center pb-4 border-b border-gray-100">
                <CardTitle className="text-2xl font-bold text-gray-900">Pro Driver</CardTitle>
                <div className="mt-4 flex flex-col items-center justify-center">
                  <span className="text-gray-400 line-through text-lg font-medium">$49.99/mo</span>
                  <span className="text-5xl font-extrabold text-gray-900">$0<span className="text-lg font-medium text-gray-500">/mo</span></span>
                  <span className="text-sm text-green-600 font-bold mt-2">Free for 6 months</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-8 pt-8 px-6 sm:px-8">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-sm font-semibold text-blue-900 mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Pro Benefit:
                  </p>
                  <p className="text-blue-800 text-sm">
                    <span className="font-bold">Unlimited Rides</span>. Drive as much as you want with no caps.
                  </p>
                </div>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-blue-100 text-blue-600 shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-gray-900 font-medium">Keep 100% of fares</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-blue-100 text-blue-600 shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-gray-700">Weekly Payouts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-blue-100 text-blue-600 shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-gray-700">Priority 24/7 Support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-blue-100 text-blue-600 shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-gray-700">Advanced Heatmaps</span>
                  </li>
                </ul>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl text-lg shadow-lg shadow-primary/20 transition-all transform active:scale-95">
                  Try Pro Free
                </Button>
                <p className="text-xs text-center text-gray-400">
                  $49.99/mo after 6 months. Cancel anytime.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Savings Calculator */}
          <div className="max-w-4xl mx-auto bg-gray-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-4">See how much you'll save</h3>
                <p className="text-gray-400 mb-8">
                  Compare Spinr's flat subscription to the standard 25% commission.
                </p>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-300">Daily Rides</label>
                      <span className="text-2xl font-bold text-white">{dailyRides[0]} rides</span>
                    </div>
                    <Slider
                      value={dailyRides}
                      onValueChange={setDailyRides}
                      max={30}
                      min={1}
                      step={1}
                      className="w-full [&>span]:bg-primary"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>1 ride</span>
                      <span>30 rides</span>
                    </div>
                  </div>

                  <div className="p-4 bg-white/10 rounded-xl border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <span className="text-sm text-gray-300">Break-even Point</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      You only need to do <span className="text-white font-bold">5 rides in a whole month</span> to cover your subscription!
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white text-gray-900 rounded-3xl p-8 shadow-xl">
                <div className="text-center">
                  <p className="text-gray-500 font-medium mb-1">Your Monthly Savings</p>
                  <p className="text-5xl font-extrabold text-primary mb-2">
                    ${((dailyRides[0] * 30 * 18 * 0.25) - 19.99).toFixed(0)}
                  </p>
                  <p className="text-sm text-gray-400 mb-6">vs paying 25% commission</p>

                  <div className="space-y-3 pt-6 border-t border-gray-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Competitor Takes (25%)</span>
                      <span className="font-semibold text-red-500">-${(dailyRides[0] * 30 * 18 * 0.25).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Spinr Cost</span>
                      <span className="font-semibold text-gray-900">-$19.99</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2">
                      <span className="font-bold text-gray-900">Yearly Savings</span>
                      <span className="font-bold text-green-600">+${(((dailyRides[0] * 30 * 18 * 0.25) - 19.99) * 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section id="download" className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Keep 100% of Net Fare?
            </h2>
            <p className="text-red-100 max-w-2xl mx-auto text-lg">
              Join Spinr today. Scan to apply and start driving.
            </p>
          </div>

          {/* Driver App QR - SmartAppLink auto-detects iOS vs Android */}
          <div className="flex justify-center max-w-sm mx-auto">
            <SmartAppLink
              appType="driver"
              title="Driver App"
              qrSize={80}
              className="w-full shadow-lg"
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
