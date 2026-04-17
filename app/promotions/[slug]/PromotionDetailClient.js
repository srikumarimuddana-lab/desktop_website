'use client'
import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Gift,
  Shield,
  Loader2,
  Trophy,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function PromotionDetailClient({ promo }) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    driverId: '',
    city: promo.city,
  })
  const [accepted, setAccepted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(null)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
  const canSubmit =
    form.fullName.trim().length > 1 &&
    validEmail &&
    form.phone.trim().length >= 7 &&
    form.driverId.trim().length >= 3 &&
    accepted &&
    !submitting

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/promotion-signups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promotion_slug: promo.slug,
          full_name: form.fullName.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          driver_id: form.driverId.trim(),
          city: form.city.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to accept quest')
      }
      setSuccess(data)
      toast.success('Quest accepted! Check your email for confirmation.')
    } catch (err) {
      toast.error(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="pt-28 pb-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href="/promotions"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all promotions
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
                <Gift className="w-3.5 h-3.5" />
                {promo.audience === 'driver' ? 'Driver Quest' : 'Rider Quest'}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                {promo.title}
              </h1>
              <p className="text-lg text-gray-300 mb-6 max-w-2xl">{promo.shortDescription}</p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl border border-white/10">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span className="text-sm">
                    {promo.goalRides} rides goal
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl border border-white/10">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm">{promo.windowDays} day window</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl border border-white/10">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm">{promo.city}</span>
                </div>
              </div>
            </div>

            <div className="bg-white text-gray-900 rounded-2xl p-6 shadow-2xl text-center">
              <p className="text-sm text-gray-500 font-medium mb-1">Your bonus</p>
              <p className="text-6xl font-extrabold text-primary leading-none">
                ${promo.reward}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                paid on the weekly payout after you hit {promo.goalRides} trips
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How it works</h2>
                <ol className="space-y-4">
                  {promo.howItWorks.map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-gray-700 leading-relaxed pt-1">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Terms
                </h2>
                <ul className="space-y-3">
                  {promo.terms.map((term, i) => (
                    <li key={i} className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm leading-relaxed">{term}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <Card className="shadow-xl border border-gray-200 rounded-2xl sticky top-24">
                <CardContent className="p-8">
                  {success ? (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Quest accepted!
                      </h3>
                      <p className="text-gray-600 mb-6">
                        We've logged your registration. Your 30-day window starts now —
                        head to the driver app and start picking up rides.
                      </p>
                      {success.reference && (
                        <p className="text-xs text-gray-400 mb-6">
                          Reference: <span className="font-mono">{success.reference}</span>
                        </p>
                      )}
                      <Link href="/drive">
                        <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-6 font-bold">
                          Open driver resources
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                          Accept this quest
                        </h3>
                        <p className="text-sm text-gray-500">
                          Use the details you registered your Spinr driver account with.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="fullName">Full name</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={form.fullName}
                          onChange={handleChange}
                          placeholder="Jane Doe"
                          required
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="email">Driver account email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          required
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="phone">Phone number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="306-555-0123"
                          required
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="driverId">Spinr driver ID</Label>
                        <Input
                          id="driverId"
                          name="driverId"
                          value={form.driverId}
                          onChange={handleChange}
                          placeholder="Found in your driver app profile"
                          required
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={form.city}
                          onChange={handleChange}
                          className="h-11"
                          readOnly
                        />
                      </div>

                      <label className="flex items-start gap-3 cursor-pointer select-none pt-2">
                        <input
                          type="checkbox"
                          checked={accepted}
                          onChange={(e) => setAccepted(e.target.checked)}
                          className="mt-1 w-4 h-4 accent-primary shrink-0"
                        />
                        <span className="text-sm text-gray-600 leading-relaxed">
                          I have read and accept the quest terms above, and confirm I am an
                          approved Spinr driver in {promo.city}.
                        </span>
                      </label>

                      <Button
                        type="submit"
                        disabled={!canSubmit}
                        className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 text-white rounded-xl disabled:opacity-50"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Accepting...
                          </>
                        ) : (
                          <>Accept quest & earn ${promo.reward}</>
                        )}
                      </Button>

                      <p className="text-xs text-center text-gray-400">
                        Questions? Email{' '}
                        <a href="mailto:support@spinr.ca" className="text-primary">
                          support@spinr.ca
                        </a>
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
