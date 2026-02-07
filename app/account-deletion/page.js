import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, Smartphone, Trash2, AlertTriangle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
    title: 'Delete Account | Spinr',
    description: 'Instructions on how to delete your Spinr account and personal data.',
}

export default function AccountDeletionPage() {
    return (
        <main className="min-h-screen bg-background text-gray-900 font-sans">
            <Header />

            <div className="pt-32 pb-20 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">

                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-6">
                        <Trash2 className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Delete Your Spinr Account</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        At Spinr, we value your privacy and provide a simple way to delete your account and personal data.
                        If you no longer wish to use our services, follow the instructions below.
                    </p>
                </div>

                <div className="grid gap-10 md:grid-cols-2">

                    {/* Option 1: In-App */}
                    <Card className="border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl overflow-hidden">
                        <CardContent className="p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                    <Smartphone className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold">Option 1: Delete from the App</h2>
                            </div>

                            <ol className="space-y-4 text-gray-600 list-decimal pl-5 marker:text-gray-400 marker:font-medium">
                                <li className="pl-2">Open the <span className="font-semibold text-gray-900">Spinr app</span>.</li>
                                <li className="pl-2">Go to <span className="font-semibold text-gray-900">Profile → View Profile → Account Information</span> and click on the menu.</li>
                                <li className="pl-2">Tap on <span className="font-semibold text-red-600">Delete My Account</span>.</li>
                                <li className="pl-2">Follow the on-screen instructions to confirm.</li>
                            </ol>

                            <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-500 flex gap-3">
                                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                                <p>Your account and all associated data will be permanently deleted immediately upon confirmation.</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Option 2: Email */}
                    <Card className="border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl overflow-hidden">
                        <CardContent className="p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold">Option 2: Request via Email</h2>
                            </div>

                            <p className="text-gray-600 mb-6 leading-relaxed">
                                If you are unable to delete your account from the app, you can request deletion via email.
                            </p>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold text-gray-900 min-w-[80px]">Email:</span>
                                    <a href="mailto:support@spinr.ca" className="text-primary hover:underline font-medium">Support@spinr.ca</a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold text-gray-900 min-w-[80px]">Subject:</span>
                                    <span className="text-gray-700 bg-gray-100 px-2 py-1 rounded">Account Deletion Request</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-900 block mb-2">Please Include:</span>
                                    <ul className="list-disc pl-5 text-gray-600 space-y-1">
                                        <li>Your registered phone number or email</li>
                                        <li>Reason for deletion (optional)</li>
                                    </ul>
                                </div>
                            </div>

                            <a href="mailto:Support@spinr.ca?subject=Account Deletion Request">
                                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-6 rounded-xl">
                                    Send Email Request <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </a>
                        </CardContent>
                    </Card>

                </div>

                {/* What Happens Next */}
                <div className="mt-20 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">What Happens After Deletion?</h2>

                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="bg-gray-50 rounded-2xl p-6 text-center">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-400 font-bold">1</div>
                            <p className="text-gray-600 text-sm">All personal data, including ride history and payment details, will be <span className="font-semibold text-gray-900">permanently removed</span>.</p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-6 text-center">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-400 font-bold">2</div>
                            <p className="text-gray-600 text-sm">Any active ride requests or bookings will be <span className="font-semibold text-gray-900">canceled automatically</span>.</p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-6 text-center">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-400 font-bold">3</div>
                            <p className="text-gray-600 text-sm">Deletion requests via email are processed within <span className="font-semibold text-gray-900">7 business days</span>.</p>
                        </div>
                    </div>

                    <p className="text-center text-gray-500 text-sm mt-8">
                        <span className="font-semibold text-gray-900">Note:</span> If you have any pending payments or refunds, they must be resolved before deletion.
                    </p>
                </div>

                {/* Support CTA */}
                <div className="mt-16 text-center">
                    <p className="text-gray-600 mb-4">Need Help?</p>
                    <a href="mailto:support@spinr.ca" className="text-primary font-bold hover:underline text-lg">Support@spinr.ca</a>
                </div>

            </div>

            <Footer />
        </main>
    )
}
