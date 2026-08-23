'use client'

import { useEffect, useState, Suspense } from 'react'
import Script from 'next/script'
import { APP_URLS, detectPlatform } from '@/lib/app-links'
import { Loader2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

function RedirectContent() {
    const searchParams = useSearchParams()
    const appType = searchParams.get('type') === 'driver' ? 'driver' : 'rider'
    const [platform, setPlatform] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)

    useEffect(() => {
        // Detect OS
        const detectedPlatform = detectPlatform()
        setPlatform(detectedPlatform)
        const redirectUrl = APP_URLS[appType][detectedPlatform]

        // Fire Google Analytics event
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'app_download_redirect', {
                event_category: 'download',
                event_label: appType,
                platform: detectedPlatform,
            })
        }

        // Redirect after a short delay to allow gtag to fire
        const timer = setTimeout(() => {
            if (redirectUrl) {
                window.location.href = redirectUrl
            } else {
                setErrorMessage('Could not determine the correct app store link.')
            }
        }, 500) // 500ms delay

        return () => clearTimeout(timer)
    }, [appType])

    return (
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
            {errorMessage ? (
                <div className="text-red-500 font-semibold text-lg">{errorMessage}</div>
            ) : (
                <>
                    <Loader2 className="h-12 w-12 text-primary animate-spin mb-6" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Redirecting to {platform === 'ios' ? 'App Store' : 'Play Store'}...
                    </h1>
                    <p className="text-gray-500 text-lg">
                        You should be redirected automatically. If not,{' '}
                        <a
                            href={platform ? APP_URLS[appType][platform] : '#'}
                            className="text-primary hover:underline font-medium"
                        >
                            click here
                        </a>.
                    </p>
                </>
            )}
        </div>
    )
}

export default function AppRedirectPage() {
    return (
        <main className="min-h-screen flex flex-col bg-background">
            <div className="flex-1 flex items-center justify-center">
                <Suspense fallback={<div className="flex items-center justify-center p-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>}>
                    <RedirectContent />
                </Suspense>
            </div>
            {/* Google tag (gtag.js) */}
            <Script
                strategy="afterInteractive"
                src="https://www.googletagmanager.com/gtag/js?id=G-RPLY20HEGR"
            />
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-RPLY20HEGR');
                    `,
                }}
            />
        </main>
    )
}
