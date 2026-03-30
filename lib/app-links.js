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
