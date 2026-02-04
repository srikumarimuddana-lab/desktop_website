import { Star } from 'lucide-react'
import Image from 'next/image'

export default function RiderImageUI() {
    return (
        <div className="relative w-full max-w-[500px] aspect-[4/3] mx-auto">
            {/* Background Shape */}
            <div className="absolute inset-0 bg-[#F3E3D3] rounded-[40px] transform rotate-3 scale-95 opacity-50 z-0" />

            {/* Main Image Container */}
            <div className="absolute inset-0 overflow-hidden rounded-[40px] z-10 border-[6px] border-white shadow-xl">
                <Image
                    src="/happy_rider_photo.png"
                    alt="Happy Spinr Rider"
                    fill
                    className="object-cover"
                />
            </div>
        </div>
    )
}

