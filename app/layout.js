import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import CookieBanner from '@/components/ui/CookieBanner'
import CustomScripts from '@/components/seo/CustomScripts'
import ChatWidget from '@/components/ai/ChatWidget'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Spinr | Proudly Canadian Rideshare',
  description: 'A Canadian rideshare platform. Drivers keep 100% of the net fare — 0% commission, ever. Riders pay a flat $1 fee per trip and never a surge multiplier. Riding in Saskatoon.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <CustomScripts position="head" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <CustomScripts position="body_start" />
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: 'white',
            },
          }}
        />
        <CookieBanner />
        <ChatWidget />
        <SpeedInsights />
        <CustomScripts position="body_end" />
      </body>
    </html>
  )
}
