import { MapPin, DollarSign, Car } from 'lucide-react'

export default function HeroMockUI() {
    return (
        <div className="relative w-full max-w-[500px] aspect-square mx-auto">
            {/* Main Container - The Map Surface */}
            <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl overflow-hidden border-[8px] border-white ring-1 ring-gray-900/5">

                {/* Map Background - Image of Regina */}
                <div className="absolute inset-0">
                    <img
                        src="/regina_map_bg.png"
                        alt="Map of Regina"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Map Pin Overlay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="relative">
                        <span className="absolute -inset-4 bg-primary/20 rounded-full animate-ping" />
                        <MapPin className="w-8 h-8 text-primary drop-shadow-md relative z-10" fill="currentColor" />
                    </div>
                </div>

                {/* Floating Card 1: Earnings (Top Right) */}
                <div className="absolute top-8 right-8 animate-bounce" style={{ animationDuration: '3s' }}>
                    <div className="bg-white rounded-2xl shadow-lg p-3 flex items-center gap-3 border border-gray-100">
                        <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Earned</p>
                            <p className="text-lg font-bold text-gray-900">$24.50</p>
                        </div>
                    </div>
                </div>

                {/* Floating Card 2: Driver Status (Bottom) */}
                <div className="absolute bottom-8 left-8 right-8">
                    <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center transform -scale-x-100">
                                    <Car className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">Driver arriving</p>
                                    <p className="text-xs text-gray-500">2 min away</p>
                                </div>
                            </div>
                            <span className="bg-red-50 text-primary text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                                Spinr X
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-3/4 rounded-full" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
