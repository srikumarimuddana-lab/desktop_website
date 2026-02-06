'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Car, Home } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="text-center max-w-md mx-auto">
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <Car className="w-12 h-12 text-primary" />
                </div>

                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    404 - Page Not Found
                </h1>

                <p className="text-gray-600 mb-8 text-lg">
                    Oops! Looks like you've taken a wrong turn. The page you're looking for doesn't exist or has been moved.
                </p>

                <Link href="/">
                    <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-lg shadow-lg shadow-red-100">
                        <Home className="w-5 h-5" />
                        Back to Home
                    </Button>
                </Link>
            </div>

            {/* Decorative Background */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-red-50/50 rounded-full blur-3xl opacity-60" />
                <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-50/50 rounded-full blur-3xl opacity-60" />
            </div>
        </div>
    )
}
