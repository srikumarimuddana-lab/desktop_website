'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { ArrowRight } from 'lucide-react'

import { APP_URLS, detectPlatform } from '@/lib/app-links'

export default function SmartAppLink({
    appType = 'rider', // 'rider' or 'driver'
    title = 'App',
    qrSize = 128,
    className = '',
}) {
    const [platform, setPlatform] = useState('ios')
    const [url, setUrl] = useState(APP_URLS[appType].ios)

    useEffect(() => {
        const detected = detectPlatform()
        setPlatform(detected)
        setUrl(APP_URLS[appType][detected])
    }, [appType])

    // Track click events in Google Analytics
    const trackClick = () => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'qr_code_click', {
                event_category: 'download',
                event_label: appType,
                platform: platform,
            })
        }
    }

    return (
        <Link
            href={url}
            target="_blank"
            onClick={trackClick}
            className={`bg-white p-6 rounded-2xl flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer w-full sm:min-w-[320px] group border border-gray-100 ${className}`}
        >
            <div className="bg-white p-2 rounded-xl border border-gray-100 shrink-0">
                <QRCodeSVG
                    value={url}
                    size={qrSize}
                    level="H"
                    fgColor="#000000"
                    bgColor="#ffffff"
                />
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-xl mb-2">{title}</h4>
                <div className="flex items-center text-gray-500 gap-1 group-hover:text-primary transition-colors font-medium">
                    Scan to download <ArrowRight className="w-4 h-4 ml-1" />
                </div>
            </div>
        </Link>
    )
}
