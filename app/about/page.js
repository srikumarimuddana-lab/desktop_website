import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Users, Heart, Target, Shield } from 'lucide-react'
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
  const values = [
    {
      icon: Heart,
      title: 'Fairness First',
      description: 'We believe drivers deserve to keep what they earn. That\'s why we charge 0% commission - forever.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'We\'re Saskatchewan locals building for Saskatchewan people. Our success is tied to our community.'
    },
    {
      icon: Shield,
      title: 'Transparency',
      description: 'No hidden fees, no surge pricing, no surprises. What you see is what you pay.'
    },
    {
      icon: Target,
      title: 'Local Focus',
      description: 'We\'re not trying to conquer the world - just make ridesharing better for Regina and Saskatoon.'
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* JSON-LD Structured Data */}
      {structuredData && <JsonLdInjector data={structuredData} />}

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 min-h-[60vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src={IMAGES.about.hero}
            alt="Team collaboration"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/70" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
              About <span className="text-primary">Spinr</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground">
              We&apos;re on a mission to make ridesharing fair for everyone in Saskatchewan.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Our <span className="text-primary">Mission</span>
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
                <p className="text-2xl text-primary font-medium leading-relaxed">
                  &quot;Fairness for Drivers, Value for Riders.&quot;
                </p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Spinr was born from a simple frustration: watching talented drivers in our community struggle 
                to make ends meet while rideshare giants take 25-30% of every fare. We knew there had to be 
                a better way.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                As Saskatchewan locals ourselves, we understand the unique needs of our province. The cold 
                winters that make reliable transportation essential. The tight-knit communities that value 
                trust and accountability. The hardworking people who deserve to keep what they earn.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                That&apos;s why we built Spinr - a rideshare platform where drivers keep 100% of their fares and 
                riders pay just a flat $1 fee per trip. No percentages, no surge pricing, no corporate greed. 
                Just fair, transparent, local ridesharing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Image Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={IMAGES.about.team}
                alt="Spinr Team working together"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white text-xl font-semibold">Built by Saskatchewan, for Saskatchewan</p>
                <p className="text-white/80 text-sm mt-1">Our team is committed to fair ridesharing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Our <span className="text-primary">Values</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* The Spinr Difference */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                The Spinr <span className="text-primary">Difference</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* For Drivers */}
              <div className="bg-card rounded-2xl p-8 border border-border">
                <h3 className="text-2xl font-bold text-primary mb-4">For Drivers</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span className="text-muted-foreground">Keep 100% of every fare you earn</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span className="text-muted-foreground">First 6 months completely free</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span className="text-muted-foreground">Get paid daily, not weekly</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span className="text-muted-foreground">Local support from real people</span>
                  </li>
                </ul>
              </div>

              {/* For Riders */}
              <div className="bg-card rounded-2xl p-8 border border-border">
                <h3 className="text-2xl font-bold text-primary mb-4">For Riders</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span className="text-muted-foreground">Flat $1 platform fee, every trip</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span className="text-muted-foreground">No surge pricing, ever</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span className="text-muted-foreground">Verified local Saskatchewan drivers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span className="text-muted-foreground">More money goes to your driver</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Join the Rideshare Revolution
          </h2>
          <p className="text-red-100 mb-8 max-w-2xl mx-auto">
            Be part of a community that values fairness and transparency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/drive">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Drive with Spinr
              </Button>
            </Link>
            <Link href="/ride">
              <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white">
                Ride with Spinr
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
