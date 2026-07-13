'use client'

// Fare calculator backed by the Spinr backend.
//   Logged out — GET /api/v1/fares (public, real per-vehicle rates incl.
//     surge) + OSRM road distance for an approximate total.
//   Logged in  — POST /api/v1/rides/estimate (exact totals, ETA, driver
//     availability and a surge-locking estimate_token per vehicle type).
// "Book" gates on the shared phone-OTP login, then hands off to /ride/book
// via sessionStorage.

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Navigation, X, Loader2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiFetch } from '@/lib/spinr-api'
import { useAuth } from '@/components/auth/AuthProvider'
import { useLoginGate } from '@/components/auth/LoginDialog'

export const BOOKING_CONTEXT_KEY = 'spinr_booking'

function approxTotal(rate, distanceKm) {
    const base = parseFloat(rate.base_fare || 0)
    const perKm = parseFloat(rate.per_km_rate || 0)
    const minFare = parseFloat(rate.minimum_fare || 0)
    const booking = parseFloat(rate.booking_fee || 0)
    const surge = parseFloat(rate.surge_multiplier || 1)
    const core = Math.max(base + perKm * distanceKm, minFare) * surge
    return core + booking
}

export default function FareCalculator() {
    const router = useRouter()
    const { status } = useAuth()
    const { requireLogin, loginDialog } = useLoginGate({
        title: 'Log in to book your ride',
    })

    const [pickup, setPickup] = useState('')
    const [dropoff, setDropoff] = useState('')
    const [pickupCoords, setPickupCoords] = useState(null)
    const [dropoffCoords, setDropoffCoords] = useState(null)

    const [suggestions, setSuggestions] = useState([])
    const [activeInput, setActiveInput] = useState(null) // 'pickup' or 'dropoff'
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [results, setResults] = useState(null) // {mode: 'exact'|'approx', items: [...]}

    const suggestionRef = useRef(null)

    // Debounced Nominatim autocomplete (unchanged: free, no key, CA-biased)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (activeInput && ((activeInput === 'pickup' && pickup.length > 2) || (activeInput === 'dropoff' && dropoff.length > 2))) {
                searchAddress(activeInput === 'pickup' ? pickup : dropoff)
            } else {
                setSuggestions([])
            }
        }, 500)
        return () => clearTimeout(timer)
    }, [pickup, dropoff, activeInput])

    const searchAddress = async (query) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ' Saskatchewan')}&countrycodes=ca&limit=5`)
            if (res.ok) setSuggestions(await res.json())
        } catch (err) {
            console.error('Search failed', err)
        }
    }

    async function roadDistanceKm() {
        const query = `${pickupCoords.lon},${pickupCoords.lat};${dropoffCoords.lon},${dropoffCoords.lat}`
        const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${query}?overview=false`)
        if (!res.ok) throw new Error('Could not calculate route')
        const data = await res.json()
        if (data.code !== 'Ok' || !data.routes?.length) throw new Error('No route found')
        return data.routes[0].distance / 1000
    }

    const calculateFare = async () => {
        if (!pickupCoords || !dropoffCoords) {
            setError('Please select valid pickup and dropoff locations from the suggestions.')
            return
        }
        setLoading(true)
        setError(null)
        setResults(null)
        try {
            if (status === 'authed') {
                const data = await apiFetch('/api/v1/rides/estimate', {
                    method: 'POST',
                    body: {
                        pickup_lat: parseFloat(pickupCoords.lat),
                        pickup_lng: parseFloat(pickupCoords.lon),
                        dropoff_lat: parseFloat(dropoffCoords.lat),
                        dropoff_lng: parseFloat(dropoffCoords.lon),
                    },
                })
                setResults({
                    mode: 'exact',
                    items: (data.estimates || []).map((e) => ({
                        id: e.vehicle_type?.id,
                        name: e.vehicle_type?.name,
                        total: parseFloat(e.grand_total ?? e.total_fare),
                        distanceKm: e.distance_km,
                        etaMinutes: e.eta_minutes,
                        available: e.available,
                        driverCount: e.driver_count,
                        surge: e.surge_multiplier,
                    })),
                })
            } else {
                const [rates, distanceKm] = await Promise.all([
                    apiFetch(`/api/v1/fares?lat=${parseFloat(pickupCoords.lat)}&lng=${parseFloat(pickupCoords.lon)}`, { retryOn401: false }),
                    roadDistanceKm(),
                ])
                if (!rates?.length) throw new Error('Spinr is not available at that pickup location yet.')
                setResults({
                    mode: 'approx',
                    items: rates.map((r) => ({
                        id: r.vehicle_type?.id,
                        name: r.vehicle_type?.name,
                        total: approxTotal(r, distanceKm),
                        distanceKm: Math.round(distanceKm * 10) / 10,
                        surge: parseFloat(r.surge_multiplier || 1),
                    })),
                })
            }
        } catch (err) {
            console.error('Fare estimate failed', err)
            setError(err.message || 'Could not calculate fare. Please try distinct locations.')
        } finally {
            setLoading(false)
        }
    }

    async function handleBook() {
        const user = await requireLogin()
        if (!user) return
        try {
            sessionStorage.setItem(
                BOOKING_CONTEXT_KEY,
                JSON.stringify({
                    pickup: { address: pickup, lat: parseFloat(pickupCoords.lat), lng: parseFloat(pickupCoords.lon) },
                    dropoff: { address: dropoff, lat: parseFloat(dropoffCoords.lat), lng: parseFloat(dropoffCoords.lon) },
                })
            )
        } catch {
            // sessionStorage unavailable — /ride/book will ask again
        }
        router.push('/ride/book')
    }

    const handleSelect = (item) => {
        if (activeInput === 'pickup') {
            setPickup(item.display_name)
            setPickupCoords({ lat: item.lat, lon: item.lon })
        } else {
            setDropoff(item.display_name)
            setDropoffCoords({ lat: item.lat, lon: item.lon })
        }
        setSuggestions([])
        setActiveInput(null)
        setResults(null)
    }

    const canBook = pickupCoords && dropoffCoords && results && !loading

    return (
        <Card className="bg-white border-2 border-red-500 shadow-xl overflow-visible relative z-10">
            <CardContent className="p-6 sm:p-8">
                <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Fare Transparency Calculator</h3>
                    <p className="text-sm text-gray-500 mt-1">Know exactly what you'll pay before you book.</p>
                </div>

                <div className="space-y-4 relative">
                    {/* Pickup */}
                    <div className="relative">
                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Pickup Location</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 w-5 h-5 text-red-500" />
                            <Input
                                placeholder="Current location or address"
                                className="pl-10 h-11 border-gray-200 focus:border-red-500 focus:ring-red-500 text-ellipsis overflow-hidden whitespace-nowrap"
                                value={pickup}
                                onChange={(e) => setPickup(e.target.value)}
                                onFocus={() => setActiveInput('pickup')}
                                title={pickup}
                            />
                            {pickup && <button onClick={() => { setPickup(''); setPickupCoords(null); setResults(null) }} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>}
                        </div>
                        {suggestions.length > 0 && activeInput === 'pickup' && (
                            <div ref={suggestionRef} className="absolute left-0 right-0 top-[100%] bg-white border border-gray-100 rounded-lg shadow-xl z-50 mt-1 max-h-60 overflow-y-auto">
                                {suggestions.map((item, idx) => (
                                    <div key={idx} className="p-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 flex items-start gap-2 border-b border-gray-50 last:border-0" onClick={() => handleSelect(item)}>
                                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                        <span>{item.display_name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Dropoff */}
                    <div className="relative">
                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Destination</Label>
                        <div className="relative">
                            <Navigation className="absolute left-3 top-3 w-5 h-5 text-red-500" />
                            <Input
                                placeholder="Where to?"
                                className="pl-10 h-11 border-gray-200 focus:border-red-500 focus:ring-red-500 text-ellipsis overflow-hidden whitespace-nowrap"
                                value={dropoff}
                                onChange={(e) => setDropoff(e.target.value)}
                                onFocus={() => setActiveInput('dropoff')}
                                title={dropoff}
                            />
                            {dropoff && <button onClick={() => { setDropoff(''); setDropoffCoords(null); setResults(null) }} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>}
                        </div>
                        {suggestions.length > 0 && activeInput === 'dropoff' && (
                            <div className="absolute left-0 right-0 top-[100%] bg-white border border-gray-100 rounded-lg shadow-xl z-50 mt-1 max-h-60 overflow-y-auto">
                                {suggestions.map((item, idx) => (
                                    <div key={idx} className="p-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 flex items-start gap-2 border-b border-gray-50 last:border-0" onClick={() => handleSelect(item)}>
                                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                        <span>{item.display_name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Results */}
                    {(results || loading || error) && (
                        <div className="bg-red-50 rounded-lg p-4 mt-6 border border-red-100">
                            {loading ? (
                                <div className="flex items-center justify-center py-2 text-red-500 gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" /> Getting prices...
                                </div>
                            ) : error ? (
                                <p className="text-sm text-red-600 text-center">{error}</p>
                            ) : (
                                <div className="space-y-2">
                                    {results.items.map((item) => (
                                        <div key={item.id || item.name} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-red-100">
                                            <div>
                                                <p className="font-semibold text-gray-900">{item.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {item.distanceKm} km
                                                    {results.mode === 'exact' && item.available && item.etaMinutes != null && ` · pickup in ~${item.etaMinutes} min`}
                                                    {results.mode === 'exact' && !item.available && ' · no drivers nearby right now'}
                                                    {item.surge > 1 && ` · ${item.surge}x demand pricing`}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xl font-bold text-red-600">
                                                    {results.mode === 'approx' && '~'}${item.total.toFixed(2)}
                                                </span>
                                                {results.mode === 'exact' && item.driverCount > 0 && (
                                                    <p className="text-[10px] text-gray-400 flex items-center justify-end gap-1"><Users className="w-3 h-3" />{item.driverCount} nearby</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="text-[10px] text-gray-500 pt-2 border-t border-red-100 italic">
                                        <p className="mb-1"><span className="font-bold text-red-600">100% of Net Fare</span> goes to the driver.</p>
                                        {results.mode === 'approx'
                                            ? <p>Estimates use live Spinr rates for your pickup area. Log in and book to lock in your exact price.</p>
                                            : <p>Prices include fees and taxes and are locked when you book.</p>}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <Button
                        className="w-full h-12 text-lg font-bold bg-[#E63946] hover:bg-[#D62839] text-white shadow-md mt-4"
                        onClick={calculateFare}
                        disabled={loading || !pickupCoords || !dropoffCoords}
                    >
                        {loading ? 'Calculating...' : results ? 'Refresh prices' : 'Estimate Fare'}
                    </Button>

                    {canBook && (
                        <Button
                            variant="outline"
                            className="w-full h-12 text-lg font-bold border-2 border-[#E63946] text-[#E63946] hover:bg-red-50"
                            onClick={handleBook}
                        >
                            Book this ride
                        </Button>
                    )}
                </div>
            </CardContent>
            {loginDialog}
        </Card>
    )
}
