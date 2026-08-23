'use client'
import { useState, useEffect, useCallback } from 'react'
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
  Sparkles,
  Copy,
  Check,
  Wallet,
  Headphones,
  Ticket,
  AlertTriangle,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SmartAppLink from '@/components/ui/SmartAppLink'

const normalizeCode = (v) => (v || '').toString().trim().toUpperCase()

function formatCountdown(ms) {
  if (ms <= 0) return 'expired'
  const h = Math.floor(ms / 3_600_000)
  const m = Math.floor((ms % 3_600_000) / 60_000)
  const s = Math.floor((ms % 60_000) / 1000)
  if (h > 0) return `${h}h ${m}m left`
  if (m > 0) return `${m}m ${s}s left`
  return `${s}s left`
}

export default function PromotionDetailClient({ promo, initialCode = '' }) {
  const [codeInput, setCodeInput] = useState(normalizeCode(initialCode))
  const [validation, setValidation] = useState({
    status: initialCode ? 'checking' : 'idle', // idle | checking | valid | invalid
    message: '',
    expiresAt: null,
  })
  const [countdown, setCountdown] = useState('')

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: promo.city,
  })
  const [accepted, setAccepted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(null)
  const [copied, setCopied] = useState(false)

  // Validate coupon against server
  const validateCode = useCallback(
    async (raw) => {
      const code = normalizeCode(raw)
      if (!code) {
        setValidation({ status: 'idle', message: '', expiresAt: null })
        return
      }
      setValidation((v) => ({ ...v, status: 'checking', message: '' }))
      try {
        const res = await fetch(
          `/api/promotion-coupons/${encodeURIComponent(code)}`
        )
        const data = await res.json()
        if (!res.ok || !data.valid) {
          setValidation({
            status: 'invalid',
            message: data?.error || 'This code is not valid.',
            expiresAt: null,
          })
          return
        }
        if (data.promotion_slug !== promo.slug) {
          setValidation({
            status: 'invalid',
            message: 'This code is for a different promotion.',
            expiresAt: null,
          })
          return
        }
        setValidation({
          status: 'valid',
          message: '',
          expiresAt: data.expires_at,
        })
      } catch {
        setValidation({
          status: 'invalid',
          message: 'Could not verify code. Try again.',
          expiresAt: null,
        })
      }
    },
    [promo.slug]
  )

  // Auto-validate on mount if code came via URL
  useEffect(() => {
    if (initialCode) {
      validateCode(initialCode)
    }
  }, [initialCode, validateCode])

  // Countdown ticker
  useEffect(() => {
    if (validation.status !== 'valid' || !validation.expiresAt) {
      setCountdown('')
      return
    }
    const tick = () => {
      const ms = new Date(validation.expiresAt).getTime() - Date.now()
      setCountdown(formatCountdown(ms))
      if (ms <= 0) {
        setValidation({
          status: 'invalid',
          message: 'This code has expired.',
          expiresAt: null,
        })
      }
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [validation.status, validation.expiresAt])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
  const canSubmit =
    validation.status === 'valid' &&
    form.fullName.trim().length > 1 &&
    validEmail &&
    form.phone.trim().length >= 7 &&
    accepted &&
    !submitting

  const handleCopy = async () => {
    if (!success?.reference) return
    try {
      await navigator.clipboard.writeText(success.reference)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

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
          coupon_code: normalizeCode(codeInput),
          full_name: form.fullName.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          city: form.city.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 410) {
          setValidation({
            status: 'invalid',
            message: data?.error || 'Code no longer valid',
            expiresAt: null,
          })
        }
        throw new Error(data?.error || 'Failed to accept quest')
      }
      setSuccess(data)
      toast.success('Quest accepted! Save your reference code below.')
    } catch (err) {
      toast.error(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative pt-24 sm:pt-28 pb-16 sm:pb-24 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="absolute top-0 right-1/4 w-[32rem] h-[32rem] bg-primary/25 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[28rem] h-[28rem] bg-blue-500/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href="/promotions"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All promotions
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/20 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-5 border border-primary/20">
                <Sparkles className="w-3.5 h-3.5" />
                {promo.audience === 'driver' ? 'Driver Quest' : 'Rider Quest'}
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-5 leading-[1.05] tracking-tight">
                {promo.title}
              </h1>
              <p className="text-base sm:text-lg text-gray-300 mb-8 max-w-xl leading-relaxed">
                {promo.shortDescription}
              </p>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-lg">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/10 text-center">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-primary mx-auto mb-1.5" />
                  <p className="text-[10px] sm:text-xs uppercase tracking-wider text-white/60 font-semibold">
                    Rides
                  </p>
                  <p className="text-lg sm:text-xl font-bold">{promo.goalRides}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/10 text-center">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary mx-auto mb-1.5" />
                  <p className="text-[10px] sm:text-xs uppercase tracking-wider text-white/60 font-semibold">
                    Days
                  </p>
                  <p className="text-lg sm:text-xl font-bold">{promo.windowDays}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/10 text-center">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary mx-auto mb-1.5" />
                  <p className="text-[10px] sm:text-xs uppercase tracking-wider text-white/60 font-semibold">
                    City
                  </p>
                  <p className="text-base sm:text-lg font-bold truncate">{promo.city}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white text-gray-900 rounded-[28px] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-red-100/80 rounded-full blur-2xl pointer-events-none" />
                <div className="relative text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 rounded-full mb-4">
                    <Gift className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      Your Bonus
                    </span>
                  </div>
                  <p className="text-6xl sm:text-7xl font-extrabold text-primary leading-none mb-3">
                    ${promo.reward}
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    paid on the weekly payout after you hit {promo.goalRides} trips
                  </p>
                  <a
                    href="#accept"
                    className="inline-flex items-center justify-center w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-base transition-colors shadow-lg shadow-primary/30"
                  >
                    Enter your code
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Invite-only banner */}
      <section className="py-6 bg-red-50 border-y border-red-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start sm:items-center gap-3 text-sm text-gray-700 max-w-4xl">
            <Ticket className="w-5 h-5 text-primary shrink-0 mt-0.5 sm:mt-0" />
            <p>
              <span className="font-semibold text-gray-900">Invite-only quest.</span>{' '}
              You need the unique coupon code we sent you by SMS. Each code works
              for one driver and expires 24 hours after it was issued.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="inline-block bg-red-50 text-red-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              How it works
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Four steps to your <span className="text-primary">${promo.reward} bonus</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Register with your coupon code, accept, drive, get paid. Your 30-day
              window starts the moment we confirm your registration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {promo.howItWorks.map((step, i) => (
              <div
                key={i}
                className="p-6 sm:p-7 rounded-[28px] border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all bg-white relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 text-5xl font-extrabold text-red-50 leading-none select-none">
                  {i + 1}
                </div>
                <div className="relative">
                  <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-5">
                    <span className="text-primary font-bold">Step {i + 1}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Terms + perks */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="lg:col-span-2 bg-white rounded-[32px] p-6 sm:p-10 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Quest terms</h2>
              </div>
              <ul className="space-y-4">
                {promo.terms.map((term, i) => (
                  <li key={i} className="flex gap-3 sm:gap-4">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm sm:text-base leading-relaxed">
                      {term}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white rounded-[28px] p-6 border border-gray-100 shadow-sm">
                <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1.5">Paid on top of fares</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Keep 100% of every fare you earn. The ${promo.reward} lands on top.
                </p>
              </div>
              <div className="bg-white rounded-[28px] p-6 border border-gray-100 shadow-sm">
                <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                  <Headphones className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1.5">Real human support</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Lost your code? Email{' '}
                  <a href="mailto:support@spinr.ca" className="text-primary font-semibold">
                    support@spinr.ca
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accept form */}
      <section id="accept" className="py-16 sm:py-24 bg-white scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block bg-red-50 text-red-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                Accept the quest
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                Enter your <span className="text-primary">coupon code</span>
              </h2>
              <p className="text-base sm:text-lg text-gray-600">
                Use the code we sent you by SMS. One driver, one code, 24-hour window.
              </p>
            </div>

            <Card className="border border-gray-100 shadow-xl rounded-[32px] overflow-hidden">
              <CardContent className="p-6 sm:p-10">
                {success ? (
                  <div className="text-center py-4">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                      You're in — quest accepted!
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
                      Your 30-day window starts now. Head to the driver app and start
                      picking up rides. We'll track your progress on our end.
                    </p>

                    {success.reference && (
                      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 max-w-md mx-auto mb-6">
                        <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
                          Your reference code — save this
                        </p>
                        <div className="flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3">
                          <span className="font-mono text-sm sm:text-base font-bold text-gray-900 break-all">
                            {success.reference}
                          </span>
                          <button
                            type="button"
                            onClick={handleCopy}
                            className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80"
                          >
                            {copied ? (
                              <>
                                <Check className="w-4 h-4" /> Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" /> Copy
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                          Screenshot this code. Include it if you contact{' '}
                          <a
                            href="mailto:support@spinr.ca"
                            className="text-primary font-semibold"
                          >
                            support@spinr.ca
                          </a>{' '}
                          with questions about your progress or bonus.
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                      <Link href="/drive">
                        <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-6 font-bold">
                          Driver resources
                        </Button>
                      </Link>
                      <Link href="/promotions">
                        <Button
                          variant="outline"
                          className="w-full sm:w-auto rounded-xl h-12 px-6 font-bold border-gray-300"
                        >
                          Back to promotions
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Coupon code field */}
                    <div className="space-y-2">
                      <Label htmlFor="couponCode" className="text-gray-700">
                        Coupon code
                      </Label>
                      <div className="relative">
                        <Input
                          id="couponCode"
                          name="couponCode"
                          value={codeInput}
                          onChange={(e) =>
                            setCodeInput(e.target.value.toUpperCase())
                          }
                          onBlur={() => validateCode(codeInput)}
                          placeholder="ABC-DEF-GHJ"
                          required
                          autoComplete="off"
                          className={`h-14 rounded-xl pr-11 font-mono tracking-wider text-lg text-center uppercase ${
                            validation.status === 'valid'
                              ? 'border-green-500 focus-visible:ring-green-500'
                              : validation.status === 'invalid'
                              ? 'border-red-400 focus-visible:ring-red-400'
                              : ''
                          }`}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {validation.status === 'checking' && (
                            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                          )}
                          {validation.status === 'valid' && (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          )}
                          {validation.status === 'invalid' && (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      </div>
                      {validation.status === 'valid' && (
                        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>
                            Valid code
                            {countdown ? ` · ${countdown}` : ''}
                          </span>
                        </div>
                      )}
                      {validation.status === 'invalid' && (
                        <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>
                            {validation.message}{' '}
                            <a
                              href="mailto:support@spinr.ca"
                              className="font-semibold underline"
                            >
                              Contact support
                            </a>
                            .
                          </span>
                        </div>
                      )}
                      {validation.status === 'idle' && (
                        <p className="text-xs text-gray-500">
                          Paste the code from your SMS. Links in the SMS auto-fill this
                          field for you.
                        </p>
                      )}
                    </div>

                    {/* Disable driver fields until code is valid */}
                    <fieldset
                      disabled={validation.status !== 'valid'}
                      className="space-y-5 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-2 border-t border-gray-100">
                        <div className="space-y-1.5 sm:col-span-2">
                          <Label htmlFor="fullName" className="text-gray-700">
                            Full name
                          </Label>
                          <Input
                            id="fullName"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            placeholder="Jane Doe"
                            required
                            autoComplete="name"
                            className="h-12 rounded-xl bg-white"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="email" className="text-gray-700">
                            Driver account email
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                            autoComplete="email"
                            inputMode="email"
                            className="h-12 rounded-xl bg-white"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="phone" className="text-gray-700">
                            Phone number
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="306-555-0123"
                            required
                            autoComplete="tel"
                            inputMode="tel"
                            className="h-12 rounded-xl bg-white"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="city" className="text-gray-700">
                            City
                          </Label>
                          <Input
                            id="city"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            readOnly
                            className="h-12 rounded-xl bg-gray-50 text-gray-600"
                          />
                        </div>
                      </div>

                      <label className="flex items-start gap-3 cursor-pointer select-none pt-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <input
                          type="checkbox"
                          checked={accepted}
                          onChange={(e) => setAccepted(e.target.checked)}
                          className="mt-1 w-4 h-4 accent-primary shrink-0"
                        />
                        <span className="text-sm text-gray-700 leading-relaxed">
                          I have read and accept the quest terms above, and confirm I am
                          an approved Spinr driver in {promo.city}.
                        </span>
                      </label>
                    </fieldset>

                    <Button
                      type="submit"
                      disabled={!canSubmit}
                      className="w-full h-14 text-base font-bold bg-primary hover:bg-primary/90 text-white rounded-2xl disabled:opacity-50 shadow-lg shadow-primary/20"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Accepting...
                        </>
                      ) : validation.status === 'valid' ? (
                        <>Accept quest &amp; unlock ${promo.reward} bonus</>
                      ) : (
                        <>Enter a valid code to continue</>
                      )}
                    </Button>

                    <p className="text-xs text-center text-gray-500 pt-1">
                      Questions?{' '}
                      <a
                        href="mailto:support@spinr.ca"
                        className="text-primary font-semibold"
                      >
                        support@spinr.ca
                      </a>
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Driver app download CTA */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[40px] p-6 sm:p-12 shadow-sm border border-gray-100 relative overflow-hidden max-w-5xl mx-auto">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-50/50 to-transparent -z-0 rounded-r-[40px] pointer-events-none" />
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="bg-red-50 text-red-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-5 inline-block">
                  Driver app
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  Already driving? <br />
                  Make sure you're online.
                </h2>
                <p className="text-base sm:text-lg text-gray-600 mb-6">
                  Your 30-day clock starts after we confirm your registration. Open the
                  Spinr Driver app and start accepting rides.
                </p>
              </div>
              <div className="flex justify-center lg:justify-end">
                <SmartAppLink appType="driver" title="Spinr Driver" qrSize={120} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
