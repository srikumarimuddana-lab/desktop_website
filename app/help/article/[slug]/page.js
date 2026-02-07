import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
    ChevronRight,
    ArrowLeft,
    ThumbsUp,
    ThumbsDown,
    Mail,
    Sparkles,
} from 'lucide-react'
import DOMPurify from 'isomorphic-dompurify'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    HELP_CATEGORIES,
} from '@/constants/helpTopics'

export const revalidate = 0

// Dynamic metadata
export async function generateMetadata({ params }) {
    const { slug } = await params

    const { data: article } = await supabase
        .from('help_articles')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!article) {
        return { title: 'Article Not Found | Spinr Help' }
    }

    return {
        title: `${article.title} | Spinr Help`,
        description: `Learn about ${article.title.toLowerCase()}. Get help with ${article.category_title.toLowerCase()} on Spinr.`,
    }
}

export default async function ArticlePage({ params }) {
    const { slug } = await params

    // Fetch article from Supabase
    const { data: article } = await supabase
        .from('help_articles')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!article) {
        notFound()
    }

    const category = HELP_CATEGORIES.find((c) => c.id === article.category_id)
    const Icon = category?.icon || Sparkles

    // Fetch related articles (same category, not current one, limit 3)
    const { data: relatedArticles } = await supabase
        .from('help_articles')
        .select('slug, title')
        .eq('category_id', article.category_id)
        .neq('id', article.id)
        .limit(3)

    return (
        <main className="min-h-screen bg-gray-50">
            <Header />

            <div className="pt-20 pb-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm mb-8 flex-wrap">
                        <Link
                            href="/help"
                            className="text-gray-500 hover:text-red-600 transition-colors"
                        >
                            Help Center
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                        <Link
                            href={`/help/category/${category?.slug || 'general'}`}
                            className="text-gray-500 hover:text-red-600 transition-colors"
                        >
                            {category?.title || 'General'}
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                        <span className="text-gray-900 font-medium">{article.title}</span>
                    </nav>

                    {/* Article Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div
                                className={`w-12 h-12 rounded-xl ${category?.color || 'bg-red-50 text-red-600'} flex items-center justify-center`}
                            >
                                <Icon className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">
                                {category?.title || 'Help Article'}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {article.title}
                        </h1>
                    </div>

                    {/* Article Content */}
                    <Card className="bg-white border-gray-100 shadow-sm mb-8">
                        <CardContent className="p-8 md:p-10">
                            <div
                                className="prose prose-lg max-w-none 
                  prose-headings:font-bold prose-headings:text-gray-900
                  prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                  prose-p:text-gray-600 prose-p:leading-relaxed
                  prose-ul:text-gray-600 prose-ol:text-gray-600
                  prose-li:my-1
                  prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-gray-900"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(article.content),
                                }}
                            />
                        </CardContent>
                    </Card>

                    {/* Was this helpful? */}
                    <Card className="bg-white border-gray-100 shadow-sm mb-8">
                        <CardContent className="p-6 text-center">
                            <p className="text-gray-900 font-semibold mb-4">
                                Was this article helpful?
                            </p>
                            <div className="flex items-center justify-center gap-4">
                                <Button
                                    variant="outline"
                                    className="gap-2 hover:bg-green-50 hover:border-green-200 hover:text-green-600"
                                >
                                    <ThumbsUp className="w-4 h-4" />
                                    Yes
                                </Button>
                                <Button
                                    variant="outline"
                                    className="gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                                >
                                    <ThumbsDown className="w-4 h-4" />
                                    No
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Related Articles */}
                    {relatedArticles && relatedArticles.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Related articles
                            </h2>
                            <div className="grid gap-3">
                                {relatedArticles.map((related) => (
                                    <Link
                                        key={related.slug}
                                        href={`/help/article/${related.slug}`}
                                        className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-red-200 hover:shadow-sm transition-all group"
                                    >
                                        <span className="text-gray-900 group-hover:text-red-600 transition-colors">
                                            {related.title}
                                        </span>
                                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-red-400 transition-colors" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}


                    {/* Still need help */}
                    <Card className="bg-gradient-to-r from-red-500 to-orange-500 border-0">
                        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-white text-center sm:text-left">
                                <p className="font-semibold text-lg">Still have questions?</p>
                                <p className="text-white/80 text-sm">
                                    Our support team is here to help
                                </p>
                            </div>
                            <a href="mailto:support@spinr.ca">
                                <Button className="bg-white text-red-600 hover:bg-gray-100 font-semibold shadow-lg">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Contact Support
                                </Button>
                            </a>
                        </CardContent>
                    </Card>

                    {/* Back Button */}
                    <div className="mt-8 text-center">
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
