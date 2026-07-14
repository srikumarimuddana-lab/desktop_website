'use client'

// Web booking flow: choose vehicle type (fresh authed estimate with
// surge-locking estimate_token) → choose saved card → POST /api/v1/rides.
// One Idempotency-Key per booking attempt, reused across the SCA second leg
// so a double-click or 3DS re-book can never create two rides.

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Navigation, Users } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { apiFetch } from '@/lib/spinr-api'
import { getStripe } from '@/lib/stripe'
import { useAuth } from '@/components/auth/AuthProvider'
import { LoginDialog } from '@/components/auth/LoginDialog'
import PaymentMethodPicker from '@/components/ride/PaymentMethodPicker'
import { BOOKING_CONTEXT_KEY } from '@/app/ride/FareCalculator'

const ESTIMATE_STALE_MS = 4 * 60 * 1000

export default function BookRideClient() {
  const router = useRouter()
  const { status } = useAuth()
  const [loginOpen, setLoginOpen] = useState(false)

  const [trip, setTrip] = useState(null) // {pickup:{address,lat,lng}, dropoff:{...}}
  const [estimates, setEstimates] = useState(null)
  const [estimatedAt, setEstimatedAt] = useState(0)
  const [vehicleTypeId, setVehicleTypeId] = useState(null)
  const [cardId, setCardId] = useState(null)
  const [booking, setBooking] = useState(false)
  const [error, setError] = useState(null)
  const idempotencyKeyRef = useRef(null)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(BOOKING_CONTEXT_KEY)
      if (raw) setTrip(JSON.parse(raw))
    } catch {
      setTrip(null)
    }
  }, [])

  useEffect(() => {
    if (status === 'anon') setLoginOpen(true)
    if (status === 'authed') setLoginOpen(false)
  }, [status])

  const runEstimate = useCallback(async (t) => {
    const data = await apiFetch('/api/v1/rides/estimate', {
      method: 'POST',
      body: {
        pickup_lat: t.pickup.lat,
        pickup_lng: t.pickup.lng,
        dropoff_lat: t.dropoff.lat,
        dropoff_lng: t.dropoff.lng,
      },
    })
    setEstimates(data.estimates || [])
    setEstimatedAt(Date.now())
    return data.estimates || []
  }, [])

  useEffect(() => {
    if (status !== 'authed' || !trip) return
    runEstimate(trip)
      .then((items) => {
        const firstAvailable = items.find((e) => e.available) || items[0]
        if (firstAvailable) setVehicleTypeId(firstAvailable.vehicle_type?.id)
      })
      .catch((err) => setError(err.message))
  }, [status, trip, runEstimate])

  const selected = (estimates || []).find((e) => e.vehicle_type?.id === vehicleTypeId)

  async function handleBook() {
    if (!trip || !selected || !cardId) return
    setBooking(true)
    setError(null)
    // New attempt (not the SCA second leg) → new idempotency key.
    if (!idempotencyKeyRef.current) idempotencyKeyRef.current = crypto.randomUUID()
    try {
      let estimate = selected
      // Surge-lock tokens are short-lived; silently refresh a stale quote.
      if (Date.now() - estimatedAt > ESTIMATE_STALE_MS) {
        const fresh = await runEstimate(trip)
        estimate = fresh.find((e) => e.vehicle_type?.id === vehicleTypeId)
        if (!estimate) throw new Error('That vehicle type is no longer available. Pick another.')
      }

      const body = {
        vehicle_type_id: estimate.vehicle_type.id,
        pickup_address: trip.pickup.address,
        pickup_lat: trip.pickup.lat,
        pickup_lng: trip.pickup.lng,
        dropoff_address: trip.dropoff.address,
        dropoff_lat: trip.dropoff.lat,
        dropoff_lng: trip.dropoff.lng,
        payment_method: 'card',
        payment_method_id: cardId,
        estimate_token: estimate.estimate_token,
      }

      let ride = await apiFetch('/api/v1/rides', {
        method: 'POST',
        body,
        idempotencyKey: idempotencyKeyRef.current,
      })

      if (ride?.requires_action) {
        // SCA two-step: confirm the hold with Stripe, then re-book with the
        // pinned PaymentIntent (same idempotency key — no duplicate ride).
        const stripe = await getStripe()
        if (!stripe) throw new Error('Payment confirmation is unavailable. Try again later.')
        const { error: scaError } = await stripe.confirmCardPayment(
          ride.payment_authorization.client_secret
        )
        if (scaError) throw new Error(scaError.message)
        ride = await apiFetch('/api/v1/rides', {
          method: 'POST',
          body: {
            ...body,
            payment_method_id: undefined,
            preauthorized_payment_intent_id: ride.payment_authorization.payment_intent_id,
          },
          idempotencyKey: idempotencyKeyRef.current,
        })
      }

      try {
        sessionStorage.removeItem(BOOKING_CONTEXT_KEY)
      } catch {}
      toast.success('Ride booked! Finding you a driver…')
      router.push(`/ride/confirmation/${ride.id}`)
    } catch (err) {
      // 409 → rider already has an active ride: take them to it.
      if (err.status === 409) {
        try {
          const active = await apiFetch('/api/v1/rides/active')
          const activeRide = Array.isArray(active) ? active[0] : active
          if (activeRide?.id) {
            toast.info('You already have a ride in progress — showing it.')
            router.push(`/ride/confirmation/${activeRide.id}`)
            return
          }
        } catch {}
      }
      idempotencyKeyRef.current = null // next click is a fresh attempt
      setError(err.message)
    } finally {
      setBooking(false)
    }
  }

  if (!trip) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-xl text-center space-y-4">
        <h1 className="text-2xl font-bold">Book a ride</h1>
        <p className="text-gray-600">Start by choosing your pickup and destination.</p>
        <Button asChild>
          <Link href="/ride">Set pickup & destination</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-xl space-y-6">
      <h1 className="text-3xl font-bold">Confirm your ride</h1>

      <Card>
        <CardContent className="pt-6 space-y-2 text-sm">
          <p className="flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
            <span className="truncate" title={trip.pickup.address}>{trip.pickup.address}</span>
          </p>
          <p className="flex items-start gap-2">
            <Navigation className="w-4 h-4 mt-0.5 text-primary shrink-0" />
            <span className="truncate" title={trip.dropoff.address}>{trip.dropoff.address}</span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Choose your ride</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {estimates === null && <p className="text-sm text-gray-500">Getting live prices…</p>}
          {estimates?.map((e) => {
            const id = e.vehicle_type?.id
            const price = parseFloat(e.grand_total ?? e.total_fare)
            return (
              <button
                key={id}
                type="button"
                disabled={!e.available}
                onClick={() => setVehicleTypeId(id)}
                className={cn(
                  'w-full flex items-center justify-between rounded-lg border p-3 text-left transition-colors',
                  vehicleTypeId === id
                    ? 'border-primary ring-1 ring-primary bg-red-50/50'
                    : 'border-gray-200 hover:border-gray-300',
                  !e.available && 'opacity-50 cursor-not-allowed'
                )}
              >
                <div>
                  <p className="font-semibold">{e.vehicle_type?.name}</p>
                  <p className="text-xs text-gray-500">
                    {e.available
                      ? `Pickup in ~${e.eta_minutes} min`
                      : 'No drivers nearby right now'}
                    {e.surge_multiplier > 1 && ` · ${e.surge_multiplier}x demand pricing`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">${price.toFixed(2)}</p>
                  {e.driver_count > 0 && (
                    <p className="text-[10px] text-gray-400 flex items-center justify-end gap-1">
                      <Users className="w-3 h-3" />
                      {e.driver_count} nearby
                    </p>
                  )}
                </div>
              </button>
            )
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pay with</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentMethodPicker selectedId={cardId} onSelect={setCardId} />
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button
        className="w-full h-12 text-lg font-bold"
        disabled={booking || !selected || !selected.available || !cardId}
        onClick={handleBook}
      >
        {booking
          ? 'Booking…'
          : selected
            ? `Book ${selected.vehicle_type?.name} · $${parseFloat(selected.grand_total ?? selected.total_fare).toFixed(2)}`
            : 'Book ride'}
      </Button>
      <p className="text-xs text-center text-gray-500">
        The price shown is locked when you book. You'll track your ride in the Spinr app or
        right here on the confirmation page.
      </p>

      <LoginDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        title="Log in to book your ride"
      />
    </div>
  )
}
