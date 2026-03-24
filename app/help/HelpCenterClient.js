'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
    Search,
    ChevronRight,
    Mail,
    ArrowRight,
    Sparkles,
    Phone,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { HELP_CATEGORIES, POPULAR_ARTICLES } from '@/constants/helpTopics'

export default function HelpCenterClient() {
    const [searchQuery, setSearchQuery] = useState('')
    const [hoveredCategory, setHoveredCategory] = useState(null)

    // Search across all articles
    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return []

        const query = searchQuery.toLowerCase()
        const results = []

        HELP_CATEGORIES.forEach((category) => {
            category.articles.forEach((article) => {
                if (article.title.toLowerCase().includes(query)) {
                    results.push({
                        ...article,
                        categoryId: category.id,
                        categoryTitle: category.title,
                        categorySlug: category.slug,
                        icon: category.icon,
                    })
                }
            })
        })

        return results.slice(0, 8) // Limit to 8 results
    }, [searchQuery])

    const isSearching = searchQuery.trim().length > 0

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-orange-500 text-white">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                            <Sparkles className="w-4 h-4" />
                            <span>Spinr Help Center</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            How can we help you?
                        </h1>
                        <p className="text-lg md:text-xl text-white/80 mb-10">
                            Search for answers or browse topics below
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-2xl mx-auto">
                            <div className="relative flex items-center bg-white rounded-2xl shadow-2xl shadow-red-900/20 overflow-hidden">
                                <Search className="absolute left-5 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search for help..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-14 pr-4 py-5 text-gray-900 text-lg placeholder:text-gray-400 focus:outline-none"
                                />
                                <Button
                                    className="absolute right-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold"
                                    onClick={() => { }}
                                >
                                    Search
                                </Button>
                            </div>

                            {/* Search Results Dropdown */}
                            {isSearching && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                                    {searchResults.length > 0 ? (
                                        <div className="py-2">
                                            {searchResults.map((article) => {
                                                const Icon = article.icon
                                                return (
                                                    <Link
                                                        key={article.id}
                                                        href={`/help/article/${article.slug}`}
                                                        className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                                                            <Icon className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex-1 text-left">
                                                            <p className="text-gray-900 font-medium">
                                                                {article.title}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {article.categoryTitle}
                                                            </p>
                                                        </div>
                                                        <ChevronRight className="w-5 h-5 text-gray-300" />
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    ) : (
                                        <div className="px-5 py-8 text-center text-gray-500">
                                            <p className="font-medium text-gray-900 mb-1">
                                                No results found
                                            </p>
                                            <p className="text-sm">
                                                Try different keywords or browse categories below
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                {/* Popular Articles */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Popular articles
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {POPULAR_ARTICLES.slice(0, 4).map((article) => {
                            const Icon = article.icon
                            return (
                                <Link
                                    key={article.id}
                                    href={`/help/article/${article.slug}`}
                                    className="group"
                                >
                                    <Card className="h-full border-gray-100 hover:border-red-200 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                                        <CardContent className="p-6">
                                            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500 mb-4 group-hover:bg-red-100 transition-colors">
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                                                {article.title}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {article.categoryTitle}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            )
                        })}
                    </div>
                </section>

                {/* Choose Help Type */}
                <section className="mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                        Choose the type of help you need
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {['riding', 'driving', 'applying'].map((catId) => {
                            const category = HELP_CATEGORIES.find((c) => c.id === catId)
                            if (!category) return null
                            const Icon = category.icon
                            return (
                                <Link
                                    key={category.id}
                                    href={`/help/category/${category.slug}`}
                                    className="group"
                                >
                                    <Card
                                        className={`h-full border-2 transition-all duration-300 ${hoveredCategory === category.id
                                            ? 'border-red-300 shadow-xl shadow-red-100'
                                            : 'border-gray-100 hover:border-red-200'
                                            }`}
                                        onMouseEnter={() => setHoveredCategory(category.id)}
                                        onMouseLeave={() => setHoveredCategory(null)}
                                    >
                                        <CardContent className="p-8">
                                            <div
                                                className={`w-16 h-16 rounded-2xl ${category.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                                            >
                                                <Icon className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                {category.title}
                                            </h3>
                                            <p className="text-gray-500 mb-4">
                                                {category.description}
                                            </p>
                                            <div className="flex items-center text-red-500 font-medium">
                                                <span>View articles</span>
                                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            )
                        })}
                    </div>
                </section>

                {/* All Help Topics */}
                <section className="mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                        All help topics
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {HELP_CATEGORIES.map((category) => {
                            const Icon = category.icon
                            return (
                                <div key={category.id} className="space-y-4">
                                    <Link
                                        href={`/help/category/${category.slug}`}
                                        className="flex items-center gap-3 group"
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-xl ${category.color} flex items-center justify-center`}
                                        >
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                                            {category.title}
                                        </h3>
                                    </Link>

                                    <ul className="space-y-2 pl-13">
                                        {category.articles.slice(0, 5).map((article) => (
                                            <li key={article.id}>
                                                <Link
                                                    href={`/help/article/${article.slug}`}
                                                    className="flex items-center text-gray-600 hover:text-red-600 transition-colors py-1"
                                                >
                                                    <ChevronRight className="w-4 h-4 mr-2 text-gray-300" />
                                                    <span className="text-sm">{article.title}</span>
                                                </Link>
                                            </li>
                                        ))}
                                        {category.articles.length > 5 && (
                                            <li>
                                                <Link
                                                    href={`/help/category/${category.slug}`}
                                                    className="text-sm text-red-500 hover:text-red-600 font-medium pl-6"
                                                >
                                                    View all {category.articles.length} articles →
                                                </Link>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* Still Need Help */}
                <section>
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
                </section>
            </div>
        </div>
    )
}
