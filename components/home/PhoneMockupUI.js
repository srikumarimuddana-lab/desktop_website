import Image from 'next/image'

export default function PhoneMockupUI() {
    return (
        <div className="relative w-[320px] h-[400px] rounded-[48px] overflow-hidden">
            <Image
                src="/spinr_app_phone.png"
                alt="Spinr app showing ride in progress"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 320px"
            />
        </div>
    )
}
