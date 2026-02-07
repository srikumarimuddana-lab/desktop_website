import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, ArrowLeft, Search } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getCategoryBySlug, HELP_CATEGORIES } from '@/constants/helpTopics'

// Generate static params for all categories
export async function generateStaticParams() {
    return HELP_CATEGORIES.map((cat) => ({ slug: cat.slug }))
}

// Dynamic metadata
export async function generateMetadata({ params }) {
    const { slug } = await params
    const category = getCategoryBySlug(slug)

    if (!category) {
        return { title: 'Category Not Found | Spinr Help' }
    }

    return {
        title: `${category.title} | Spinr Help`,
        description: `Get help with ${category.title.toLowerCase()}. ${category.description}`,
    }
}

export default async function CategoryPage({ params }) {
    const { slug } = await params
    const category = getCategoryBySlug(slug)

    if (!category) {
        notFound()
    }

    const Icon = category.icon

    return (
        <main className="min-h-screen bg-gray-50">
            <Header />

            <div className="pt-20 pb-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm mb-8">
                        <Link
                            href="/help"
                            className="text-gray-500 hover:text-red-600 transition-colors"
                        >
                            Help Center
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                        <span className="text-gray-900 font-medium">{category.title}</span>
                    </nav>

                    {/* Category Header */}
                    <div className="mb-10">
                        <div
                            className={`w-16 h-16 rounded-2xl ${category.color} flex items-center justify-center mb-6`}
                        >
                            <Icon className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            {category.title}
                        </h1>
                        <p className="text-lg text-gray-500">{category.description}</p>
                    </div>

                    {/* Articles List */}
                    <div className="space-y-3 mb-10">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            {category.articles.length} articles in this category
                        </h2>

                        {category.articles.map((article) => (
                            <Link
                                key={article.id}
                                href={`/help/article/${article.slug}`}
                                className="group block"
                            >
                                <Card className="border-gray-100 hover:border-red-200 hover:shadow-md transition-all duration-200">
                                    <CardContent className="p-5 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity`}
                                            >
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                                                    {article.title}
                                                </h3>
                                                {article.popular && (
                                                    <span className="inline-block mt-1 text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                                                        Popular
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {/* Other Categories */}
                    <div className="mb-10">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Other help topics
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {HELP_CATEGORIES.filter((c) => c.id !== category.id).map(
                                (cat) => {
                                    const CatIcon = cat.icon
                                    return (
                                        <Link
                                            key={cat.id}
                                            href={`/help/category/${cat.slug}`}
                                            className="group"
                                        >
                                            <Card className="border-gray-100 hover:border-red-200 transition-all">
                                                <CardContent className="p-4 flex items-center gap-3">
                                                    <div
                                                        className={`w-8 h-8 rounded-lg ${cat.color} flex items-center justify-center`}
                                                    >
                                                        <CatIcon className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors truncate">
                                                        {cat.title}
                                                    </span>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    )
                                }
                            )}
                        </div>
                    </div>

                    {/* Back Button */}
                    <div className="text-center">
                        <Link href="/help">
                            <Button variant="ghost" className="gap-2 text-gray-600">
                                <ArrowLeft className="w-4 h-4" />
                                Back to Help Center
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    )
}
