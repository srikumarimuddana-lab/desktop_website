'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, Car, CreditCard, MessageSquare, Mail } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent } from '@/components/ui/card'

export default function SupportClient() {
  const [faqs, setFaqs] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all') // 'all', 'rider', 'driver', 'general'

  useEffect(() => {
    fetchFaqs()
  }, [])

  const fetchFaqs = async () => {
    try {
      const response = await fetch('/api/faqs')
      if (response.ok) {
        const data = await response.json()
        setFaqs(data)
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fallback FAQs
  const defaultFaqs = [
    { id: '1', category: 'general', question: 'How do I request a refund for a trip?', answer: 'Go to your trip history, select the trip, and tap "Report an Issue" to request a refund.' },
    { id: '2', category: 'rider', question: 'What should I do if I left an item in the car?', answer: 'Contact support immediately with your trip details, and we will help connect you with the driver.' },
    { id: '3', category: 'general', question: 'How do I update my payment method?', answer: 'In the app menu, go to Wallet > Payment Methods to add or remove cards.' },
    { id: '4', category: 'driver', question: 'Vehicle requirements for driving?', answer: 'You need a 2015+ vehicle with 4 doors, in good condition with valid insurance.' },
    { id: '5', category: 'driver', question: 'How do run my earnings?', answer: 'Weekly payouts happen every Tuesday directly to your bank account.' },
    { id: '6', category: 'rider', question: 'Can I share my ride status?', answer: 'Yes, use the "Share Ride" feature during your trip to send a live tracking link to friends.' },
  ]

  const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs

  // Filtering Logic
  const filteredFaqs = useMemo(() => {
    return displayFaqs.filter(faq => {
      // 1. Filter by Category
      const categoryMatch = activeCategory === 'all' ||
        (activeCategory === 'account' ? faq.category === 'general' : faq.category === activeCategory)

      // 2. Filter by Search
      const searchMatch = searchQuery === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())

      return categoryMatch && searchMatch
    })
  }, [displayFaqs, activeCategory, searchQuery])

  const FAQList = ({ items }) => {
    if (items.length === 0) return <p className="text-center text-gray-500 py-8">No results found.</p>

    return (
      <Accordion type="single" collapsible className="space-y-4">
        {items.map((faq) => (
          <AccordionItem
            key={faq.id}
            value={faq.id}
            className="bg-white border border-gray-100 rounded-xl px-6 py-2 shadow-sm data-[state=open]:border-red-100 data-[state=open]:ring-1 data-[state=open]:ring-red-50 transition-all"
          >
            <AccordionTrigger className="text-gray-900 hover:text-primary text-left font-semibold text-base py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <span className={`p-1.5 rounded-md ${faq.category === 'rider' ? 'bg-red-50 text-primary' : faq.category === 'driver' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                  {faq.category === 'rider' ? <Car className="w-4 h-4" /> : faq.category === 'driver' ? <Car className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                </span>
                {faq.question}
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 text-base leading-relaxed pl-12 pb-4">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">

      {/* Header & Search */}
      <div className="text-center mb-16 space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Hello. <span className="text-primary">How can we help?</span>
        </h1>
        <p className="text-gray-500 text-lg">
          Search for help with your account, recent trips, or safety concerns.
        </p>

        <div className="max-w-xl mx-auto relative flex items-center shadow-lg rounded-full bg-white p-2 border border-gray-100 focus-within:ring-2 focus-within:ring-primary/20 transition-shadow">
          <Search className="ml-4 w-5 h-5 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Try searching 'lost item' or 'payment method'..."
            className="flex-1 bg-transparent border-none outline-none px-4 text-gray-700 placeholder:text-gray-400 h-10"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              if (e.target.value) setActiveCategory('all')
            }}
          />
          <Button
            onClick={() => setActiveCategory('all')}
            className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white font-semibold shadow-md"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Categories */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">

        {/* Card 1: Riding */}
        <div
          onClick={() => setActiveCategory(activeCategory === 'rider' ? 'all' : 'rider')}
          className={`cursor-pointer p-8 rounded-2xl border transition-all duration-300 ${activeCategory === 'rider' ? 'border-primary bg-red-50/50 shadow-md ring-1 ring-primary' : 'border-gray-100 bg-white hover:border-red-200 hover:shadow-lg'}`}
        >
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-primary mb-4">
            <Car className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Riding with Spinr</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Requesting a ride, safety features, lost & found items, and ride profiles.
          </p>
        </div>

        {/* Card 2: Driving */}
        <div
          onClick={() => setActiveCategory(activeCategory === 'driver' ? 'all' : 'driver')}
          className={`cursor-pointer p-8 rounded-2xl border transition-all duration-300 ${activeCategory === 'driver' ? 'border-primary bg-red-50/50 shadow-md ring-1 ring-primary' : 'border-gray-100 bg-white hover:border-red-200 hover:shadow-lg'}`}
        >
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-primary mb-4">
            <Car className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Driving with Spinr</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Vehicle requirements, earnings, driver app help, and documentation.
          </p>
        </div>

        {/* Card 3: Account */}
        <div
          onClick={() => setActiveCategory(activeCategory === 'account' ? 'all' : 'account')}
          className={`cursor-pointer p-8 rounded-2xl border transition-all duration-300 ${activeCategory === 'account' ? 'border-primary bg-red-50/50 shadow-md ring-1 ring-primary' : 'border-gray-100 bg-white hover:border-red-200 hover:shadow-lg'}`}
        >
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-primary mb-4">
            <CreditCard className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Account & Payments</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Update phone number, payment methods, past trips, and receipts.
          </p>
        </div>
      </div>

      {/* Top Articles */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Articles</h2>
      <div className="mb-20">
        <FAQList items={filteredFaqs} />
      </div>

      {/* Still Need Help */}
      <Card className="bg-white border border-gray-100 shadow-sm rounded-3xl overflow-hidden">
        <CardContent className="p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Still need help?</h3>
            <p className="text-gray-500">Our support team is available 24/7 to assist you with any issues.</p>
          </div>
          <div className="flex gap-4">
            <Button className="h-12 px-8 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-red-200 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" /> Live Chat
            </Button>
            <Button variant="outline" className="h-12 px-8 border-gray-200 hover:bg-gray-50 text-gray-900 font-bold rounded-xl flex items-center gap-2">
              <Mail className="w-5 h-5" /> Email Us
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
