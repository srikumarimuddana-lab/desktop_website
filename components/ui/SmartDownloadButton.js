'use client'

import { Button } from '@/components/ui/button'

export default function SmartDownloadButton({ children, className, variant, size, ...props }) {
    const handleDownload = () => {
        // In a real implementation, you would replace these with your actual App Store / Play Store URLs
        const IOS_URL = 'https://apps.apple.com/ca/app/spinr'
        const ANDROID_URL = 'https://play.google.com/store/apps/details?id=com.spinr.app'

        const userAgent = typeof navigator === 'undefined' ? '' : navigator.userAgent || navigator.vendor || window.opera

        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            window.open(IOS_URL, '_blank')
        } else if (/android/i.test(userAgent)) {
            window.open(ANDROID_URL, '_blank')
        } else {
            // Desktop fallback: Open iOS by default or maybe scroll to QR code
            window.open(IOS_URL, '_blank')
        }
    }

    return (
        <Button
            onClick={handleDownload}
            className={className}
            variant={variant}
            size={size}
            {...props}
        >
            {children}
        </Button>
    )
}
