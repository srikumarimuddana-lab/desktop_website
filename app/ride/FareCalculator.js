'use client'

import { useState, useEffect, useRef } from 'react'
import { MapPin, Navigation, ArrowRight, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function FareCalculator() {
    const [pickup, setPickup] = useState('')
    console.log("FareCalculator Rendered")
    const [dropoff, setDropoff] = useState('')
    const [pickupCoords, setPickupCoords] = useState(null)
    const [dropoffCoords, setDropoffCoords] = useState(null)

    const [suggestions, setSuggestions] = useState([])
    const [activeInput, setActiveInput] = useState(null) // 'pickup' or 'dropoff'
    const [loading, setLoading] = useState(false)
    const [fare, setFare] = useState(null)
    const [distance, setDistance] = useState(null)
    const [error, setError] = useState(null)
    const [showBreakdown, setShowBreakdown] = useState(false)

    const suggestionRef = useRef(null)

    // Debounce search
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

    // Search Address via Nominatim
    const searchAddress = async (query) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ' Saskatchewan')}&countrycodes=ca&limit=5`)
            if (res.ok) {
                const data = await res.json()
                setSuggestions(data)
            }
        } catch (err) {
            console.error("Search failed", err)
        }
    }

    // Calculate Route via OSRM
    const calculateFare = async () => {
        if (!pickupCoords || !dropoffCoords) {
            setError("Please select valid pickup and dropoff locations from the suggestions.")
            return
        }

        setLoading(true)
        setError(null)
        setFare(null)

        try {
            // OSRM Public API (Demo server - strict limits, okay for MVP)
            // Format: {longitude},{latitude};{longitude},{latitude}
            const query = `${pickupCoords.lon},${pickupCoords.lat};${dropoffCoords.lon},${dropoffCoords.lat}`
            const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${query}?overview=false`)

            if (!res.ok) throw new Error("Could not calculate route")

            const data = await res.json()
            if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
                throw new Error("No route found")
            }

            const routeDistanceMeters = data.routes[0].distance
            const routeDistanceKm = routeDistanceMeters / 1000

            // Pricing Logic
            // Low estimate: $1.20/km | High estimate: $2.00/km
            // Base Fare removed as per user request (strictly distance-based + min fare floor)
            const minRatePerKm = 1.20
            const maxRatePerKm = 2.00
            const minFare = 4.00 // Lowered for affordability

            let calculatedMin = (routeDistanceKm * minRatePerKm)
            let calculatedMax = (routeDistanceKm * maxRatePerKm)

            // Airport Surcharge logic
            const isAirport = dropoff.toLowerCase().includes('airport') || dropoff.toLowerCase().includes('yqr');
            if (isAirport) {
                calculatedMin += 2.00;
                calculatedMax += 2.00;
            }

            // Apply Minimum Fare Floor
            const finalMin = Math.max(calculatedMin, minFare)
            const finalMax = Math.max(calculatedMax, minFare)

            setDistance(routeDistanceKm.toFixed(1))

            // If both are at floor, show single price
            if (finalMin === minFare && finalMax === minFare) {
                setFare(`${minFare.toFixed(2)}`)
            } else {
                setFare(`${finalMin.toFixed(2)} - ${finalMax.toFixed(2)}`)
            }

        } catch (err) {
            console.error("Route calculation failed", err)
            setError("Could not calculate fare. Please try distinct locations.")
        } finally {
            setLoading(false)
        }
    }



    const handleSelect = (item) => {
        if (activeInput === 'pickup') {
            setPickup(item.display_name) // Show full address
            setPickupCoords({ lat: item.lat, lon: item.lon })
        } else {
            setDropoff(item.display_name) // Show full address
            setDropoffCoords({ lat: item.lat, lon: item.lon })
        }
        setSuggestions([])
        setActiveInput(null)
    }

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
                                title={pickup} // Tooltip for very long addresses
                            />
                            {pickup && <button onClick={() => { setPickup(''); setPickupCoords(null) }} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>}
                        </div>
                        {suggestions.length > 0 && activeInput === 'pickup' && (
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
                            {dropoff && <button onClick={() => { setDropoff(''); setDropoffCoords(null) }} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>}
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



                    {/* Results Area */}
                    {(fare || loading || error) && (
                        <div className="bg-red-50 rounded-lg p-4 mt-6 border border-red-100">
                            {loading ? (
                                <div className="flex items-center justify-center py-2 text-red-500 gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" /> Calculating route...
                                </div>
                            ) : error ? (
                                <p className="text-sm text-red-600 text-center">{error}</p>
                            ) : (
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Estimated Net Fare ({distance} km)</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-2xl font-bold text-red-600">${fare}</span>
                                        </div>
                                    </div>
                                    <div className="text-[10px] text-gray-500 pt-2 border-t border-red-100 italic">
                                        <p className="mb-1"><span className="font-bold text-red-600">100% of Net Fare</span> goes to the driver.</p>
                                        <p>Additional fees and taxes are not included in this estimate.</p>
                                        <p className="mt-1 text-gray-400">Minimum fare of $4.00 applies to all rides.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <Button
                        className="w-full h-12 text-lg font-bold bg-[#E63946] hover:bg-[#D62839] text-white shadow-md mt-4"
                        onClick={calculateFare}
                        disabled={loading}
                    >
                        {loading ? 'Calculating...' : 'Estimate Fare'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
