import Link from 'next/link'
import Image from 'next/image'
import { Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.webp"
                alt="Spinr Rideshare Logo"
                width={120}
                height={40}
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-gray-400 text-sm">Saskatchewan's own rideshare. Fair for drivers, affordable for riders.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Riders</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/ride" className="hover:text-primary">How it Works</Link></li>
              <li><Link href="/support" className="hover:text-primary">Safety</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Drivers</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/drive" className="hover:text-primary">Start Driving</Link></li>
              <li><Link href="/support" className="hover:text-primary">Requirements</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link href="/legal/terms" className="hover:text-primary">Terms</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-primary">Privacy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Regina & Saskatoon, SK</span>
            <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> hello@spinr.ca</span>
          </div>
          <p>© {new Date().getFullYear()} Spinr. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
