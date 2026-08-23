'use client'

import CookieConsent from 'react-cookie-consent'

export default function CookieBanner() {
    return (
        <CookieConsent
            location="bottom"
            buttonText="I Understand"
            ariaAcceptLabel="I Understand"
            cookieName="spinrCookieConsent"
            style={{ background: "#2B373B" }}
            buttonStyle={{ color: "#ffffff", fontSize: "14px", fontWeight: "bold", borderRadius: "8px", padding: "10px 20px", background: "#db3344" }}
            expires={150}
        >
            This website uses cookies to enhance the user experience.
        </CookieConsent>
    )
}
