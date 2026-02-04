import { WizardWrapper } from "@/src/components/driver-registration/WizardWrapper"
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata = {
    title: 'Become a Driver - Spinr',
    description: 'Join the Spinr driver community. 0% commission, daily payouts.'
}

export default function DriverRegistrationPage() {
    return (
        <main className="min-h-screen bg-gray-50">
            <Header />
            <div className="pt-32 pb-20 container mx-auto px-4">
                <WizardWrapper />
            </div>
            <Footer />
        </main>
    )
}
