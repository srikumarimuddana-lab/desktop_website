import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowDown, Users, Heart, Target, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import JsonLdInjector from '@/components/seo/JsonLdInjector'
import { IMAGES } from '@/constants/images'
import { getSeoMetadata, getStructuredData } from '@/lib/seo'

// Dynamic metadata from database
export async function generateMetadata() {
  return getSeoMetadata('/about', {
    title: "About Spinr - Saskatchewan's Rideshare",
    description: "Learn about Spinr's mission to bring fair, transparent ridesharing to Saskatchewan. Local team, local values, community-driven.",
    keywords: "about Spinr, Saskatchewan rideshare company, local rideshare, fair rideshare"
  })
}

export default async function AboutPage() {
  // Fetch structured data from database
  const structuredData = await getStructuredData('/about')

  return (
    <main className="min-h-screen bg-background text-foreground font-sans selection:bg-red-100">
      <Header />

      {/* JSON-LD Structured Data */}
      {structuredData && <JsonLdInjector data={structuredData} />}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8 leading-[1.1]">
                Moving <br />
                <span className="text-primary">Saskatchewan</span> <br />
                Forward
              </h1>
              <p className="text-xl text-gray-500 mb-8 leading-relaxed max-w-lg">
                Innovation meets community in every ride. We're a Regina-based startup redefining urban mobility with <span className="text-gray-900 font-semibold">0% commission</span> for drivers and <span className="text-gray-900 font-semibold">100% fair rides</span> for everyone.
              </p>
              <Link href="#mission">
                <Button size="lg" className="rounded-full px-8 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-red-200">
                  Read Our Story <ArrowDown className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Right Image */}
            <div className="relative h-[500px] w-full bg-gray-100 rounded-[50px] rounded-tr-none overflow-hidden shadow-2xl">
              <Image
                src={IMAGES.about.hero}
                alt="City movement"
                fill
                className="object-cover grayscale"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-gray-100 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              { label: 'Saskatchewan', sub: 'Communities', value: 'Regina +' },
              { label: 'Commission', sub: 'For Drivers', value: '0%' },
              { label: 'Fair Rides', sub: 'For Riders', value: '100%' },
              { label: 'Average Rating', sub: 'From our users', value: '4.9' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col pl-6 border-l-4 border-primary">
                <span className="text-4xl font-bold text-gray-900">{stat.value}</span>
                <span className="text-sm font-semibold text-gray-900 uppercase tracking-wider mt-1">{stat.label}</span>
                <span className="text-xs text-gray-500 mt-0.5">{stat.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

            {/* Left Text */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold tracking-widest text-primary uppercase">Our Mission</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                Democratizing transport for everyone.
              </h2>

              <div className="prose prose-lg text-gray-600">
                <p className="not-italic border-l-2 border-gray-200 pl-6 mb-8 text-xl font-medium text-gray-800">
                  "Spinr was born from a simple frustration: watching talented drivers in our community struggle to make ends meet while rideshare giants take 25-30% of every fare. We knew there had to be a better way."
                </p>
                <p className="mb-6">
                  As Saskatchewan locals ourselves, we understand the unique needs of our province. The cold winters that make reliable transportation essential. The tight-knit communities that value trust and accountability. The hardworking people who deserve to keep what they earn.
                </p>
                <p>
                  That's why we built Spinr - a rideshare platform where drivers keep 100% of their fares and riders pay just a flat $1 fee per trip. No percentages, no surge pricing, no corporate greed. Just fair, transparent, local ridesharing.
                </p>
              </div>

              <div className="mt-10">
                <Link href="#safety" className="text-primary font-bold hover:underline text-lg">
                  Learn about our values
                </Link>
                <div className="h-0.5 w-16 bg-primary mt-1"></div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative h-[600px] w-full rounded-2xl overflow-hidden shadow-xl bg-gray-900">
                <Image
                  src={IMAGES.about.team} // Using team image as it fits the Narrative
                  alt="Spinr Team"
                  fill
                  className="object-cover opacity-90 grayscale"
                />
              </div>
              {/* Decorative Element */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-50 rounded-full -z-10" />
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gray-50 rounded-full -z-10" />
            </div>

          </div>
        </div>
      </section>

      {/* Safety First Section */}
      <section id="safety" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Safety First</h2>
              <p className="text-gray-600 text-lg">
                We've built safety into every part of the experience, for both riders and drivers.
              </p>
            </div>
            <Link href="/safety">
              <Button variant="outline" className="rounded-full px-6 border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold hidden md:flex">
                Our Safety Standards <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-primary mb-6">
                  <Target className="w-6 h-6" /> {/* Using Target as proxy for location/pin if MapPin not imported, or fix imports next */}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Tracking</h3>
                <p className="text-gray-500 leading-relaxed">
                  Share your trip status with friends and family instantly. Know exactly where you are at all times.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-primary mb-6">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Drivers</h3>
                <p className="text-gray-500 leading-relaxed">
                  Every driver undergoes a comprehensive multi-step background check and vehicle inspection.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-primary mb-6">
                  <Users className="w-6 h-6" /> {/* Using Users or Headphones equivalent */}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Support</h3>
                <p className="text-gray-500 leading-relaxed">
                  Our dedicated safety team is available around the clock to assist you with any concerns.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left Image - Grayscale */}
            <div className="relative h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={IMAGES.rider.secondary} // Abstract night/city vibe
                alt="Global Impact"
                fill
                className="object-cover grayscale contrast-125"
              />
              <div className="absolute inset-0 bg-black/20" /> {/* Overlay for depth */}
            </div>

            {/* Right Content */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                </div>
                <span className="text-sm font-bold tracking-widest text-primary uppercase">Global Impact</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Driving sustainability.
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Spinr is committed to a greener future. We are actively offsetting carbon emissions for every ride and investing in an all-electric fleet by 2030. Our technology optimizes routes to reduce congestion and fuel consumption in dense urban centers.
              </p>

              <div className="flex items-center gap-12 border-l-4 border-primary pl-8">
                <div>
                  <p className="text-4xl font-bold text-primary mb-1">40%</p>
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-wide">Less Emissions</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-primary mb-1">100%</p>
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-wide">Carbon Neutral Goal</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-white border border-red-50 rounded-[40px] p-12 md:p-20 text-center shadow-[0_20px_60px_-15px_rgba(239,68,68,0.1)] overflow-hidden">

            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 -z-10" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <span className="text-sm font-bold tracking-[0.2em] text-primary uppercase mb-6 block">Join Us</span>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                Ready to join the movement?
              </h2>

              <p className="text-xl text-gray-500 mb-10 leading-relaxed font-light">
                Whether you're behind the wheel or in the backseat, be part of the community moving the world forward.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/ride">
                  <Button size="lg" className="rounded-xl px-10 py-7 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-red-200 w-full sm:w-auto">
                    Start Riding
                  </Button>
                </Link>
                <Link href="/drive">
                  <Button size="lg" variant="outline" className="rounded-xl px-10 py-7 text-lg font-semibold border-gray-200 text-gray-700 hover:bg-gray-50 w-full sm:w-auto">
                    Become a Driver
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
