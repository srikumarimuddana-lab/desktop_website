import Link from 'next/link'
import { ArrowRight, Gift, MapPin, Clock, Car } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { PROMOTIONS } from '@/constants/promotions'

export const metadata = {
  title: 'Spinr Promotions — Driver & Rider Bonuses',
  description:
    'All active Spinr promotions in one place. Accept a quest and earn a bonus for driving or riding with Spinr in Saskatchewan.',
  robots: { index: false, follow: false },
}

export default function PromotionsPage() {
  const activePromos = PROMOTIONS.filter((p) => p.status === 'active')

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-12 bg-gradient-to-br from-red-50 via-white to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
              <Gift className="w-4 h-4" />
              <span>Exclusive, invite-only</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Spinr <span className="text-primary">Promotions</span>
            </h1>
            <p className="text-lg text-gray-600">
              You made it here through a private link. Pick a quest below, accept the terms,
              and start earning. Only active promotions are shown.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {activePromos.length === 0 ? (
            <div className="max-w-xl mx-auto text-center py-20">
              <p className="text-gray-600">No promotions are live right now. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {activePromos.map((promo) => (
                <Card
                  key={promo.slug}
                  className="border border-gray-200 hover:border-primary/40 hover:shadow-xl transition-all rounded-2xl overflow-hidden"
                >
                  <div className="bg-gray-900 text-white p-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold">
                      <Car className="w-4 h-4" />
                      {promo.audience === 'driver' ? 'For Drivers' : 'For Riders'}
                    </div>
                    <div className="text-3xl font-extrabold text-primary">
                      {promo.heroHighlight}
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-5">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{promo.title}</h2>
                      <p className="text-gray-600 leading-relaxed">{promo.shortDescription}</p>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span>{promo.city}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{promo.windowDays} days</span>
                      </div>
                    </div>
                    <Link href={`/promotions/${promo.slug}`} className="block">
                      <Button className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 text-white rounded-xl">
                        View quest & accept
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
