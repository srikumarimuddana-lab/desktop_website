import { MapPin, Navigation } from 'lucide-react'

export default function PhoneMockupUI() {
    return (
        <div className="relative mx-auto w-[280px] h-[560px] bg-gray-900 rounded-[50px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] border-[12px] border-gray-900 overflow-hidden ring-1 ring-gray-900/5">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[30px] w-[120px] bg-gray-900 rounded-b-[20px] z-20"></div>

            {/* Screen Content */}
            <div className="w-full h-full bg-slate-50 relative flex flex-col">
                {/* Map Header */}
                <div className="absolute top-12 left-6 right-6 z-10 flex gap-2">
                    <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm text-xs font-semibold text-gray-700 flex-1 border border-gray-100">
                        Where to?
                    </div>
                </div>

                {/* Map Area (Abstract) */}
                <div className="flex-1 bg-slate-100 relative overflow-hidden">
                    {/* Map Roads */}
                    <div className="absolute inset-0 opacity-40">
                        <div className="absolute top-[20%] left-0 right-0 h-4 bg-white transform -rotate-12"></div>
                        <div className="absolute top-0 bottom-0 left-[40%] w-4 bg-white transform rotate-12"></div>
                        <div className="absolute top-[60%] left-0 right-0 h-4 bg-white transform rotate-6"></div>
                        <div className="absolute top-0 bottom-0 right-[20%] w-4 bg-white"></div>
                    </div>

                    {/* Route Line */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-current text-primary" style={{ strokeWidth: 4, strokeLinecap: 'round', opacity: 0.8 }}>
                        <path d="M 100 150 L 140 300 L 220 350" fill="none" strokeDasharray="8 8" className="animate-[dash_20s_linear_infinite]" />
                        <circle cx="100" cy="150" r="6" className="fill-blue-500 stroke-white stroke-2" />
                        <circle cx="220" cy="350" r="6" className="fill-primary stroke-white stroke-2" />
                    </svg>

                    {/* Car Icon */}
                    <div className="absolute top-[290px] left-[130px] w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center transform rotate-12">
                        <div className="w-4 h-4 bg-primary rounded-sm"></div>
                    </div>
                </div>

                {/* Bottom Sheet */}
                <div className="bg-white rounded-t-[30px] p-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] relative z-10 pb-10">
                    <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6"></div>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center shrink-0">
                            <Navigation className="w-5 h-5 text-primary fill-primary" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm">Ride in progress</h4>
                            <p className="text-gray-500 text-xs">Arriving in 4 mins</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">A</div>
                            <div className="flex-1 h-2 bg-gray-100 rounded-full"></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-[10px] font-bold text-primary">B</div>
                            <div className="flex-1 h-2 bg-gray-100 rounded-full">
                                <div className="w-2/3 h-full bg-primary rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
