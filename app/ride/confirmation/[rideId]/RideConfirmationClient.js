'use client'

// Post-booking status view. Polls GET /rides/{id} every 10s (REST — no
// WebSocket on web) until a terminal state, offers pre-trip cancel, and
// hands live tracking off to the mobile app via the store QR/link.

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Car, CheckCircle2, Clock, Loader2, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SmartAppLink from '@/components/ui/SmartAppLink'
import { apiFetch } from '@/lib/spinr-api'
import { useAuth } from '@/components/auth/AuthProvider'

const POLL_MS = 10_000
const TERMINAL = new Set(['completed', 'cancelled'])
const CANCELLABLE = new Set(['scheduled', 'searching', 'driver_assigned', 'driver_accepted', 'driver_arrived'])

const STATUS_COPY = {
  scheduled: { title: 'Ride scheduled', body: 'We’ll start looking for your driver closer to pickup time.' },
  searching: { title: 'Finding your driver…', body: 'Hang tight — we’re matching you with a nearby driver.' },
  driver_assigned: { title: 'Driver assigned', body: 'Your driver is confirming the trip.' },
  driver_accepted: { title: 'Driver on the way', body: 'Your driver is heading to your pickup location.' },
  driver_arrived: { title: 'Your driver has arrived', body: 'Meet your driver at the pickup location.' },
  in_progress: { title: 'Trip in progress', body: 'Enjoy the ride!' },
  completed: { title: 'Trip completed', body: 'Thanks for riding with Spinr.' },
  cancelled: { title: 'Ride cancelled', body: 'This ride was cancelled.' },
}

export default function RideConfirmationClient({ rideId }) {
  const { status: authStatus } = useAuth()
  const [ride, setRide] = useState(null)
  const [error, setError] = useState(null)
  const [cancelling, setCancelling] = useState(false)
  const timerRef = useRef(null)

  const load = useCallback(async () => {
    try {
      const data = await apiFetch(`/api/v1/rides/${rideId}`)
      setRide(data)
      setError(null)
      return data
    } catch (err) {
      setError(err.message)
      return null
    }
  }, [rideId])

  useEffect(() => {
    if (authStatus !== 'authed') return undefined
    let stopped = false
    async function tick() {
      const data = await load()
      if (stopped) return
      if (!data || !TERMINAL.has(data.status)) {
        timerRef.current = setTimeout(tick, POLL_MS)
      }
    }
    tick()
    return () => {
      stopped = true
      clearTimeout(timerRef.current)
    }
  }, [authStatus, load])

  async function handleCancel() {
    if (!window.confirm('Cancel this ride?')) return
    setCancelling(true)
    try {
      await apiFetch(`/api/v1/rides/${rideId}/cancel`, {
        method: 'POST',
        body: { reason: 'Cancelled from website' },
      })
      toast.success('Ride cancelled')
      await load()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setCancelling(false)
    }
  }

  if (authStatus === 'loading' || (authStatus === 'authed' && !ride && !error)) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin inline-block" />
      </div>
    )
  }

  if (authStatus === 'anon') {
    return (
      <div className="container mx-auto px-4 py-16 max-w-xl text-center space-y-4">
        <p className="text-gray-600">Log in to view your ride.</p>
        <Button asChild>
          <Link href="/ride">Back to Ride</Link>
        </Button>
      </div>
    )
  }

  if (error && !ride) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-xl text-center space-y-4">
        <p className="text-red-600">{error}</p>
        <Button asChild variant="outline">
          <Link href="/ride">Back to Ride</Link>
        </Button>
      </div>
    )
  }

  const copy = STATUS_COPY[ride.status] || { title: ride.status, body: '' }
  const searching = ride.status === 'searching' || ride.status === 'driver_assigned'
  const cancelled = ride.status === 'cancelled'
  const completed = ride.status === 'completed'
  const fare = ride.grand_total ?? ride.total_fare

  return (
    <div className="container mx-auto px-4 py-10 max-w-xl space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-2">
            {cancelled ? (
              <XCircle className="w-10 h-10 text-red-500" />
            ) : completed ? (
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            ) : searching ? (
              <Clock className="w-10 h-10 text-amber-500" />
            ) : (
              <Car className="w-10 h-10 text-primary" />
            )}
          </div>
          <CardTitle className="text-2xl">{copy.title}</CardTitle>
          <p className="text-gray-500 text-sm">{copy.body}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm space-y-1 border rounded-lg p-3">
            <p className="text-gray-500">From: <span className="text-gray-900">{ride.pickup_address}</span></p>
            <p className="text-gray-500">To: <span className="text-gray-900">{ride.dropoff_address}</span></p>
            {fare != null && (
              <p className="text-gray-500">Fare: <span className="text-gray-900 font-semibold">${parseFloat(fare).toFixed(2)}</span></p>
            )}
          </div>

          {ride.driver && (
            <div className="border rounded-lg p-3 text-sm space-y-1 bg-red-50/40">
              <p className="font-semibold">{ride.driver.name}</p>
              <p className="text-gray-600">
                {[ride.driver.vehicle_color, ride.driver.vehicle_make, ride.driver.vehicle_model]
                  .filter(Boolean)
                  .join(' ')}
                {ride.driver.license_plate && (
                  <span className="ml-2 font-mono font-semibold">{ride.driver.license_plate}</span>
                )}
              </p>
              {ride.driver.rating != null && <p className="text-gray-500">★ {ride.driver.rating}</p>}
              {ride.pickup_otp && (
                <p className="text-gray-700 pt-1">
                  Pickup code: <span className="font-mono font-bold text-lg">{ride.pickup_otp}</span>
                </p>
              )}
            </div>
          )}

          {!cancelled && !completed && (
            <div className="text-center space-y-3 border-t pt-4">
              <p className="text-sm font-medium">Track your ride live in the Spinr app</p>
              <p className="text-xs text-gray-500">
                Log in with the same phone number — your ride will be right there.
              </p>
              <div className="flex justify-center">
                <SmartAppLink appType="rider" />
              </div>
            </div>
          )}

          {CANCELLABLE.has(ride.status) && (
            <Button
              variant="outline"
              className="w-full border-red-300 text-red-600 hover:bg-red-50"
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling ? 'Cancelling…' : 'Cancel ride'}
            </Button>
          )}

          {(cancelled || completed) && (
            <Button asChild className="w-full">
              <Link href="/ride">Book another ride</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
