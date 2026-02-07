import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import JsonLdInjector from '@/components/seo/JsonLdInjector'
import { getSeoMetadata, getStructuredData } from '@/lib/seo'
import HelpCenterClient from './HelpCenterClient'

import { supabase } from '@/lib/supabase'

export const revalidate = 0

// Dynamic metadata
export async function generateMetadata() {
    return getSeoMetadata('/help', {
        title: 'Spinr Help Center | Get Help & Support',
        description:
            'Get help with Spinr. Find answers to common questions about riding, driving, payments, and more. Browse our comprehensive help topics or search for specific answers.',
        keywords:
            'Spinr help, Spinr support, rideshare FAQ, Spinr questions, riding help, driver support, Saskatchewan rideshare help',
    })
}

export default async function HelpCenterPage() {
    // Fetch structured data from database
    const structuredData = await getStructuredData('/help')

    // Fetch all help articles
    const { data: articles } = await supabase
        .from('help_articles')
        .select('*')
        .order('order_index', { ascending: true })

    return (
        <main className="min-h-screen bg-background">
            <Header />

            {/* JSON-LD Structured Data */}
            {structuredData && <JsonLdInjector data={structuredData} />}

            <div className="pt-16">
                <HelpCenterClient articles={articles || []} />
            </div>

            <Footer />
        </main>
    )
}
