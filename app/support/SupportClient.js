'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, Car, CreditCard, MessageSquare, Mail, ChevronLeft, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent } from '@/components/ui/card'

export default function SupportClient() {
  const [faqs, setFaqs] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all') // 'all', 'rider', 'driver', 'general'
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 5

  useEffect(() => {
    fetchFaqs()
  }, [])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, activeCategory])

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
    { id: '7', category: 'driver', question: 'What documents do I need?', answer: 'Valid driver license, vehicle registration, and proof of insurance.' },
    { id: '8', category: 'rider', question: 'How is the fare calculated?', answer: 'Base fare + distance + time. You see the upfront price before booking.' },
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

  // Pagination Logic
  const totalPages = Math.ceil(filteredFaqs.length / ITEMS_PER_PAGE)
  const paginatedFaqs = filteredFaqs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const FAQList = ({ items }) => {
    if (items.length === 0) return <p className="text-center text-gray-500 py-8">No results found.</p>

    return (
      <Accordion type="single" collapsible className="space-y-4">
        {items.map((faq) => (
          <AccordionItem
            key={faq.id}
            value={faq.id}
            className="bg-white border border-gray-100 rounded-xl px-4 sm:px-6 py-2 shadow-sm data-[state=open]:border-red-100 data-[state=open]:ring-1 data-[state=open]:ring-red-50 transition-all"
          >
            <AccordionTrigger className="text-gray-900 hover:text-primary text-left font-semibold text-base py-4 hover:no-underline">
              <div className="flex items-start gap-3 w-full">
                <span className={`p-1.5 rounded-md mt-0.5 shrink-0 ${faq.category === 'rider' ? 'bg-red-50 text-primary' : faq.category === 'driver' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                  {faq.category === 'rider' ? <Car className="w-4 h-4" /> : faq.category === 'driver' ? <Car className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                </span>
                <span className="flex-1 mr-2">{faq.question}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 text-base leading-relaxed pl-12 pb-4">
              <div
                className="prose prose-sm max-w-none text-gray-600
                  prose-p:my-1 prose-ul:my-1 prose-li:my-0.5
                  prose-headings:font-semibold prose-headings:text-gray-900 prose-headings:my-2
                  prose-strong:font-semibold prose-strong:text-gray-900
                  prose-a:text-primary prose-a:hover:underline"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    )
  }

  const CategoryCard = ({ type, icon: Icon, title, desc, active }) => (
    <div
      onClick={() => setActiveCategory(active ? 'all' : type)}
      className={`cursor-pointer p-6 rounded-2xl border transition-all duration-300 w-full ${active
        ? 'border-primary bg-red-50/50 shadow-md ring-1 ring-primary'
        : 'border-gray-100 bg-white hover:border-red-200 hover:shadow-lg'}`}
    >
      <div className="flex items-center gap-4 mb-3">
        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-primary shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-500 text-sm leading-relaxed">
        {desc}
      </p>
    </div>
  )

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">

      {/* Header & Search */}
      <div className="text-center mb-12 space-y-6">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 px-2">
          Hello. <span className="text-primary">How can we help?</span>
        </h1>
        <p className="text-gray-500 text-lg hidden sm:block">
          Search for help with your account, recent trips, or safety concerns.
        </p>

        <div className="max-w-xl mx-auto relative flex items-center shadow-lg rounded-full bg-white p-1.5 border border-gray-100 focus-within:ring-2 focus-within:ring-primary/20 transition-shadow">
          <Search className="ml-3 sm:ml-4 w-5 h-5 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search help articles..."
            className="flex-1 bg-transparent border-none outline-none px-2 sm:px-4 text-gray-700 placeholder:text-gray-400 h-10 min-w-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            onClick={() => { }}
            className="rounded-full px-5 sm:px-8 bg-primary hover:bg-primary/90 text-white font-semibold shadow-md h-10 shrink-0"
          >
            Search
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-20">

        {/* Left Column: Articles (Mobile: Top) */}
        <div className="lg:col-span-8 order-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Top Articles</h2>
            {activeCategory !== 'all' && (
              <span className="text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded-full flex items-center gap-1">
                Filtered by {activeCategory}
                <button onClick={() => setActiveCategory('all')} className="ml-1 hover:text-red-500">×</button>
              </span>
            )}
          </div>

          <FAQList items={paginatedFaqs} />

          {/* Pagination Controls */}
          {filteredFaqs.length > ITEMS_PER_PAGE && (
            <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </Button>
              <span className="text-sm font-medium text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Right Column: Categories (Mobile: Bottom) */}
        <div className="lg:col-span-4 order-2">
          <h2 className="text-xl font-bold text-gray-900 mb-6 lg:mb-6 mt-4 lg:mt-0">Browse by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <CategoryCard
              type="rider"
              icon={Car}
              title="Riding"
              desc="Safety, lost items, and ride profiles."
              active={activeCategory === 'rider'}
            />
            <CategoryCard
              type="driver"
              icon={Car}
              title="Driving"
              desc="Requirements, earnings, and vehicle help."
              active={activeCategory === 'driver'}
            />
            <CategoryCard
              type="account"
              icon={CreditCard}
              title="Account"
              desc="Payments, profile info, and receipts."
              active={activeCategory === 'account'}
            />
          </div>
        </div>

      </div>

      {/* Still Need Help */}
      <Card className="bg-white border border-gray-100 shadow-sm rounded-3xl overflow-hidden mb-8">
        <CardContent className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Still need help?</h3>
            <p className="text-gray-500">Our support team is available 24/7 to assist you.</p>
          </div>
          <div>
            <a href="mailto:support@spinr.ca">
              <Button className="h-12 px-8 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-red-200 flex items-center gap-2">
                <Mail className="w-5 h-5" /> Email Us
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
