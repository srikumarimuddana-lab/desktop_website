'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { CheckCircle2, Car, FileText, Shield, AlertCircle, Calendar, User, FileCheck } from 'lucide-react'
import Link from 'next/link'

export default function DriverRequirementsPage() {
    return (
        <main className="min-h-screen bg-background">
            <Header />

            {/* Hero Section */}
            <section className="pt-32 pb-16 bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Driver & Vehicle Requirements</h1>
                    <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
                        Everything you need to know to become a Spinr driver in Saskatchewan.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content - Left Column */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Driver Requirements */}
                        <section id="driver-requirements">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-primary">
                                    <User className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Driver Requirements</h2>
                            </div>

                            <Card className="border-border">
                                <CardContent className="p-6 space-y-4">
                                    <RequirementItem
                                        icon={Calendar}
                                        title="Age Requirement"
                                        description="You must be at least 25 years old to drive with Spinr in Saskatchewan."
                                    />
                                    <div className="border-b border-gray-100 my-2" />
                                    <RequirementItem
                                        icon={FileCheck}
                                        title="Valid Driver's Licence"
                                        description="A valid Class 1, 2, 3, 4, or 5 Saskatchewan driver's licence. Class 5 Novice 1 or 2 are NOT accepted."
                                    />
                                    <div className="border-b border-gray-100 my-2" />
                                    <RequirementItem
                                        icon={Shield}
                                        title="Driving History"
                                        description="At least 2 years of driving history in Canada or equivalent."
                                    />
                                    <div className="border-b border-gray-100 my-2" />
                                    <RequirementItem
                                        icon={CheckCircle2}
                                        title="Screening"
                                        description="Must pass a driving history review and criminal background check (Vulnerable Sector Check)."
                                    />
                                </CardContent>
                            </Card>
                        </section>

                        {/* Vehicle Requirements */}
                        <section id="vehicle-requirements">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-primary">
                                    <Car className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Vehicle Requirements</h2>
                            </div>

                            <Card className="border-border">
                                <CardContent className="p-6 space-y-4">
                                    <RequirementItem
                                        title="Vehicle Age"
                                        description="Model year 2017 or newer (9 years old max)."
                                    />
                                    <div className="border-b border-gray-100 my-2" />
                                    <RequirementItem
                                        title="Doors & Seats"
                                        description="4 doors and 5-8 seats (including the driver's seat)."
                                    />
                                    <div className="border-b border-gray-100 my-2" />
                                    <RequirementItem
                                        title="Condition"
                                        description="Must be in good cosmetic and operating condition. No salvage, rebuilt, or non-repairable titles."
                                    />
                                    <div className="border-b border-gray-100 my-2" />
                                    <RequirementItem
                                        title="Ineligible Vehicles"
                                        description="Taxis, stretch limousines, and certain rental vehicles are not eligible."
                                    />
                                </CardContent>
                            </Card>
                        </section>

                        {/* Document Requirements */}
                        <section id="document-requirements">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-primary">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Required Documents</h2>
                            </div>

                            <div className="space-y-4">
                                <p className="text-gray-600 mb-4">
                                    You'll need to upload clear photos of the following documents to the Spinr Driver app.
                                </p>

                                <Accordion type="single" collapsible className="w-full">

                                    <AccordionItem value="licence">
                                        <AccordionTrigger>Saskatchewan Driver's Licence</AccordionTrigger>
                                        <AccordionContent>
                                            Must be a valid Class 1-5 licence issued in Saskatchewan. Temporary paper licences are acceptable while waiting for the permanent card, but the permanent card must be uploaded once received.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="registration">
                                        <AccordionTrigger>Vehicle Registration</AccordionTrigger>
                                        <AccordionContent>
                                            A valid Saskatchewan Certificate of Vehicle Registration. The name on the registration does not match your name? That's okay, as long as you are listed as an eligible driver on the insurance policy (or if the owner provides authorization).
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="inspection">
                                        <AccordionTrigger>Vehicle Inspection Certificate</AccordionTrigger>
                                        <AccordionContent>
                                            A valid Light Vehicle Inspection Certificate is required. This must be completed by a certified mechanic in Saskatchewan.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="vsc">
                                        <AccordionTrigger>Vulnerable Sector Check (VSC)</AccordionTrigger>
                                        <AccordionContent>
                                            A police information check that includes a Vulnerable Sector Check. This can be obtained from your local police service (e.g., Regina Police Service, Saskatoon Police Service) or RCMP detachment. It must be dated within the last 3 months. Rideshare company name should be <b>"Spinr Mobility Inc"</b>.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="abstract">
                                        <AccordionTrigger>Driver Abstract</AccordionTrigger>
                                        <AccordionContent>
                                            A commercial driver's abstract (often called a "Carrier Profile" or standard driver abstract depending on issuer preference for rideshare) from SGI, dated within the last 30 days. It must show a clean driving record.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="gst">
                                        <AccordionTrigger>GST Account Number</AccordionTrigger>
                                        <AccordionContent>
                                            As a rideshare driver in Canada, you are considered a self-employed contractor and must register for a GST/HST account with the CRA, regardless of your income. You will need to provide this number to Spinr.
                                        </AccordionContent>
                                    </AccordionItem>

                                </Accordion>
                            </div>
                        </section>

                    </div>

                    {/* Sidebar - Right Column */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32 space-y-6">

                            {/* Quick Links Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Links</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-2">
                                    <Link href="#driver-requirements" className="text-primary hover:underline hover:text-primary/80 transition-colors">Driver Requirements</Link>
                                    <Link href="#vehicle-requirements" className="text-primary hover:underline hover:text-primary/80 transition-colors">Vehicle Requirements</Link>
                                    <Link href="#document-requirements" className="text-primary hover:underline hover:text-primary/80 transition-colors">Required Documents</Link>
                                </CardContent>
                            </Card>

                            {/* Need Help Card */}
                            <Card className="bg-gray-50 border-gray-200">
                                <CardContent className="p-6">
                                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-primary" />
                                        Still have questions?
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Our support team is here to help you through the application process.
                                    </p>
                                    <Link href="/support">
                                        <button className="w-full py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                                            Contact Support
                                        </button>
                                    </Link>
                                </CardContent>
                            </Card>

                            {/* CTA */}
                            <div className="bg-primary rounded-xl p-6 text-white text-center">
                                <h3 className="font-bold text-xl mb-2">Ready to Drive?</h3>
                                <p className="text-white/90 text-sm mb-6">Sign up today and start earning.</p>
                                <Link href="/drive">
                                    <button className="w-full py-3 bg-white text-primary font-bold rounded-lg hover:bg-gray-100 transition-colors">
                                        Become a Driver
                                    </button>
                                </Link>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </main>
    )
}

function RequirementItem({ icon: Icon, title, description }) {
    return (
        <div className="flex gap-4">
            {Icon && (
                <div className="shrink-0 mt-1">
                    <Icon className="w-5 h-5 text-gray-400" />
                </div>
            )}
            <div>
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
            </div>
        </div>
    )
}
