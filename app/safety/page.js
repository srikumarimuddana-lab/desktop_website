import Image from 'next/image'
import Link from 'next/link'
import { Shield, CheckCircle, Car, AlertTriangle, Smartphone, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import JsonLdInjector from '@/components/seo/JsonLdInjector'
import { getSeoMetadata, getStructuredData } from '@/lib/seo'

// Dynamic metadata from database
export async function generateMetadata() {
    return getSeoMetadata('/safety', {
        title: "Safety Standards - Spinr Rideshare",
        description: "Learn about Spinr's rigorous safety standards including driver vetting, vehicle inspections, and zero-tolerance policies in Saskatchewan.",
        keywords: "Spinr safety, rideshare safety Saskatchewan, driver vetting, vehicle inspection"
    })
}

export default async function SafetyPage() {
    const structuredData = await getStructuredData('/safety')

    return (
        <main className="min-h-screen bg-background font-sans text-foreground selection:bg-red-100">
            <Header />

            {structuredData && <JsonLdInjector data={structuredData} />}

            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Our Safety Standards
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Your safety is non-negotiable. We've established the strictest standards in the industry to ensure every ride is secure, reliable, and comfortable.
                    </p>
                </div>
            </section>

            {/* Driver Vetting Section */}
            <section className="py-20 bg-white border-y border-gray-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-4">
                                <UserCheck className="w-6 h-6 text-primary" />
                                <span className="text-sm font-bold tracking-widest text-primary uppercase">Driver Screening</span>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Who's behind the wheel?</h2>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-1">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Criminal Record Checks</h3>
                                        <p className="text-gray-600 mt-1">Every driver must pass a comprehensive RCMP criminal record check.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-1">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Vulnerable Sector Check</h3>
                                        <p className="text-gray-600 mt-1">Enhanced screening to ensure safety for all members of our community.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-1">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Clean Driving Abstract</h3>
                                        <p className="text-gray-600 mt-1">We verify driving history to ensure only safe, responsible drivers are on our platform.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Zero Tolerance Policy</h3>
                            <p className="text-gray-600 mb-6">
                                Spinr maintains a strict zero-tolerance policy for drug and alcohol use. Any confirmed report results in immediate and permanent removal from our platform.
                            </p>
                            <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-xl">
                                <AlertTriangle className="w-5 h-5" />
                                <span className="font-semibold">Report a safety concern immediately</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vehicle Standards Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-6 rounded-2xl shadow-sm">
                                    <Car className="w-8 h-8 text-primary mb-4" />
                                    <h3 className="font-bold text-gray-900 mb-2">Annual Inspections</h3>
                                    <p className="text-sm text-gray-500">Mandatory SGI mechanical safety inspections every 12 months.</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm">
                                    <Shield className="w-8 h-8 text-primary mb-4" />
                                    <h3 className="font-bold text-gray-900 mb-2">$2M Liability</h3>
                                    <p className="text-sm text-gray-500">Commercial insurance coverage for every ride.</p>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Road-Ready Vehicles</h2>
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                It's not just about the driver; it's about the ride. We adhere to Saskatchewan's strict vehicle for-hire regulations. No clunkers, no deferred maintenance, just safe, reliable transport.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-gray-700">
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                                    Max vehicle age of 10 years
                                </li>
                                <li className="flex items-center gap-3 text-gray-700">
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                                    4 doors and 5+ seatbelts required
                                </li>
                                <li className="flex items-center gap-3 text-gray-700">
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                                    Winter tires recommended seasonally
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* In-App Safety */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                        <Smartphone className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Technology protecting you 24/7</h2>
                    <p className="text-gray-600 text-lg mb-12">
                        Our app is built with safety features accessible at the tap of a button.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">GPS Tracking</h3>
                            <p className="text-gray-500">Every trip is tracked in real-time. Share your ETA and location with loved ones instantly.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Anonymous Contact</h3>
                            <p className="text-gray-500">Call or message your driver without ever revealing your personal phone number.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">2-Way Ratings</h3>
                            <p className="text-gray-500">We remove community members who violate our safety standards or rating thresholds.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-primary text-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8 tracking-tight">Have more questions about safety?</h2>
                    <Link href="/support">
                        <Button size="lg" className="bg-white text-primary hover:bg-gray-100 rounded-full px-10 py-6 text-lg font-bold shadow-lg transition-transform hover:scale-105">
                            Visit Help Center
                        </Button>
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    )
}
