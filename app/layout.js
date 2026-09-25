import './globals.css'
import { headers } from 'next/headers'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import CookieBanner from '@/components/ui/CookieBanner'
import CustomScripts from '@/components/seo/CustomScripts'
import CustomHeadHtml from '@/components/seo/CustomHeadHtml'
import ChatWidget from '@/components/ai/ChatWidget'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { getCustomHead } from '@/lib/seo'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL('https://spinr.ca'),
  title: 'Spinr | Proudly Canadian Rideshare',
  description: 'A Canadian rideshare platform. Drivers keep 100% of the net fare — 0% commission, ever. Riders pay a flat $1 fee per trip and never a surge multiplier. Riding in Saskatoon.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default async function RootLayout({ children }) {
  const requestHeaders = await headers()
  const pathname = requestHeaders.get('x-pathname') || '/'
  const customHead = await getCustomHead(pathname)

  return (
    // data-scroll-behavior: the site scrolls smoothly to in-page anchors, but
    // a route change should land at the top instantly — this tells Next to
    // switch smooth scrolling off for the length of a navigation.
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <CustomScripts position="head" />
        {customHead && <CustomHeadHtml html={customHead} />}
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
