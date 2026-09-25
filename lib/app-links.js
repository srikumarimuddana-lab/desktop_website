// lib/app-links.js

// App store URLs
export const APP_URLS = {
    rider: {
        ios: 'https://apps.apple.com/ca/app/spinr/id6755680889',
        android: 'https://play.google.com/store/apps/details?id=com.spinr.user',
    },
    driver: {
        ios: 'https://apps.apple.com/ca/app/spinr-driver/id6755680810',
        android: 'https://play.google.com/store/apps/details?id=com.spinr.driver',
    },
}

/**
 * Where a QR code should send someone. One code has to work for every phone
 * that scans it, so it points at /app, which picks the App Store or Google
 * Play for the device doing the scanning. Encoding a store URL directly would
 * send every Android phone to the App Store (or every iPhone to Play).
 * @param {'rider' | 'driver'} appType
 * @returns {string} absolute URL — a QR code has no page to resolve a relative one against
 */
export function appDownloadUrl(appType = 'rider') {
    const site = process.env.NEXT_PUBLIC_BASE_URL || 'https://spinr.ca'
    return appType === 'driver' ? `${site}/app?type=driver` : `${site}/app`
}

/**
 * Detects the user's platform based on user agent.
 * Defaults to iOS for SSR or desktop environments.
 * @returns {'ios' | 'android'} The detected platform
 */
export function detectPlatform() {
    if (typeof navigator === 'undefined') return 'ios' // Default to iOS for SSR
    const userAgent = navigator.userAgent || navigator.vendor || window.opera
    if (/android/i.test(userAgent)) return 'android'
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) return 'ios'
    return 'ios' // Default to iOS for desktop
}
