import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Spinr | $0 Commission Rideshare in Saskatchewan',
  description: 'Drivers keep 100% of net fare with 0% commission. Riders pay just $1 flat fee per trip. Saskatchewan\'s own rideshare.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
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
      </body>
    </html>
  )
}
