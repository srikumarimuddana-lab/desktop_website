import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  Gift,
  MapPin,
  Clock,
  Car,
  Sparkles,
  Trophy,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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

      {/* Hero */}
      <section className="relative pt-28 sm:pt-32 pb-16 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/saskatchewan_hero.png"
            alt=""
            fill
            className="object-cover opacity-20"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-white" />
          <div className="absolute top-0 right-0 w-[36rem] h-[36rem] bg-red-100/60 rounded-full blur-[120px] pointer-events-none" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-semibold">
                Exclusive, invite-only
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-5 leading-[1.1] tracking-tight">
              Spinr <span className="text-primary">Promotions</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl leading-relaxed">
              You made it here through a private link. Pick a quest below, accept the terms,
              and start earning. Only active promotions are shown.
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              <div className="inline-flex items-center gap-2 bg-white border border-gray-100 rounded-full px-4 py-2 shadow-sm">
                <Trophy className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-gray-700">Real bonuses</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white border border-gray-100 rounded-full px-4 py-2 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-gray-700">No surge, no catch</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white border border-gray-100 rounded-full px-4 py-2 shadow-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-gray-700">Saskatoon</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promo Grid */}
      <section className="pb-20 sm:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {activePromos.length === 0 ? (
            <div className="max-w-xl mx-auto text-center py-20 bg-white rounded-[32px] border border-gray-100 shadow-sm px-6">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Gift className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                No promotions are live right now
              </h2>
              <p className="text-gray-600">Check back soon — new quests launch regularly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
              {activePromos.map((promo) => (
                <Link
                  key={promo.slug}
                  href={`/promotions/${promo.slug}`}
                  className="group block"
                >
                  <div className="bg-white border border-gray-100 rounded-[32px] shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 transition-all duration-300 overflow-hidden h-full flex flex-col">
                    {/* Dark header */}
                    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 sm:p-8 text-white overflow-hidden">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/25 rounded-full blur-[80px] pointer-events-none" />
                      <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-blue-500/15 rounded-full blur-[70px] pointer-events-none" />

                      <div className="relative flex items-start justify-between gap-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-semibold uppercase tracking-wider border border-white/10">
                          <Car className="w-3.5 h-3.5" />
                          {promo.audience === 'driver' ? 'Driver Quest' : 'Rider Quest'}
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] text-white/60 uppercase tracking-wider font-medium">
                            Bonus
                          </p>
                          <p className="text-3xl sm:text-4xl font-extrabold text-primary leading-none">
                            {promo.heroHighlight}
                          </p>
                        </div>
                      </div>

                      <h2 className="relative text-2xl sm:text-3xl font-bold mt-8 leading-tight">
                        {promo.title}
                      </h2>
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-8 flex-1 flex flex-col">
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {promo.shortDescription}
                      </p>

                      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
                        <div className="bg-red-50/50 rounded-xl p-3 text-center">
                          <Trophy className="w-4 h-4 text-primary mx-auto mb-1" />
                          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                            Rides
                          </p>
                          <p className="text-sm font-bold text-gray-900">
                            {promo.goalRides}
                          </p>
                        </div>
                        <div className="bg-red-50/50 rounded-xl p-3 text-center">
                          <Clock className="w-4 h-4 text-primary mx-auto mb-1" />
                          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                            Days
                          </p>
                          <p className="text-sm font-bold text-gray-900">
                            {promo.windowDays}
                          </p>
                        </div>
                        <div className="bg-red-50/50 rounded-xl p-3 text-center">
                          <MapPin className="w-4 h-4 text-primary mx-auto mb-1" />
                          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                            City
                          </p>
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {promo.city}
                          </p>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <div className="flex items-center justify-between p-4 bg-gray-50 group-hover:bg-primary group-hover:text-white rounded-2xl transition-colors">
                          <span className="font-bold text-gray-900 group-hover:text-white">
                            View quest & accept
                          </span>
                          <ArrowRight className="w-5 h-5 text-primary group-hover:text-white group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
