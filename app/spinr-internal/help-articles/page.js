'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Plus, Trash2, Edit, Save, Loader2, BookOpen, Star, ExternalLink } from 'lucide-react'
import DOMPurify from 'isomorphic-dompurify'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

// Dynamically import the editor to avoid SSR issues
const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
    ssr: false,
    loading: () => <div className="border rounded-lg p-4 min-h-[200px] bg-muted/30 animate-pulse" />
})

const CATEGORIES = [
    { id: 'riding', title: 'Riding with Spinr' },
    { id: 'driving', title: 'Driving with Spinr' },
    { id: 'applying', title: 'Applying to Drive' },
    { id: 'account', title: 'Profile & Account' },
    { id: 'app', title: 'Using the App' },
    { id: 'safety', title: 'Safety & Policies' }
]

export default function HelpArticlesPage() {
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingArticle, setEditingArticle] = useState(null)
    const [form, setForm] = useState({
        title: '',
        slug: '',
        category_id: 'riding',
        content: '',
        is_popular: false,
        order_index: 1
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [filterCategory, setFilterCategory] = useState('all')
    const itemsPerPage = 8

    useEffect(() => {
        fetchArticles()
    }, [])

    const fetchArticles = async () => {
        try {
            const res = await fetch('/api/help-articles')
            if (res.ok) setArticles(await res.json())
        } catch (e) {
            console.error('Error fetching articles:', e)
        } finally {
            setLoading(false)
        }
    }

    const generateSlug = (title) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const payload = {
                ...form,
                slug: form.slug || generateSlug(form.title)
            }

            const res = await fetch(
                editingArticle ? `/api/help-articles/${editingArticle.id}` : '/api/help-articles',
                {
                    method: editingArticle ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                }
            )

            if (res.ok) {
                toast.success(editingArticle ? 'Article updated!' : 'Article created!', {
                    description: `"${form.title}" has been saved.`
                })
                setDialogOpen(false)
                resetForm()
                fetchArticles()
            } else {
                const err = await res.json()
                toast.error(err.error || 'Failed to save article')
            }
        } catch (e) {
            toast.error('Error occurred')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this article?')) return
        try {
            const res = await fetch(`/api/help-articles/${id}`, { method: 'DELETE' })
            if (res.ok) {
                toast.success('Article deleted!')
                fetchArticles()
            }
        } catch (e) {
            toast.error('Error deleting article')
        }
    }

    const handleEdit = (article) => {
        setEditingArticle(article)
        setForm({
            title: article.title,
            slug: article.slug,
            category_id: article.category_id,
            content: article.content,
            is_popular: article.is_popular,
            order_index: article.order_index || 1
        })
        setDialogOpen(true)
    }

    const resetForm = () => {
        setEditingArticle(null)
        setForm({
            title: '',
            slug: '',
            category_id: 'riding',
            content: '',
            is_popular: false,
            order_index: articles.length + 1
        })
    }

    const catColors = {
        riding: 'bg-red-500',
        driving: 'bg-blue-500',
        applying: 'bg-green-500',
        account: 'bg-purple-500',
        app: 'bg-orange-500',
        safety: 'bg-teal-500'
    }

    // Filtering
    const filteredArticles = filterCategory === 'all'
        ? articles
        : articles.filter(a => a.category_id === filterCategory)

    // Pagination
    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage)
    const paginatedArticles = filteredArticles.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Help Articles</h1>
                    <p className="text-muted-foreground">
                        Create and manage help center articles.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/help" target="_blank">
                        <Button variant="outline" className="gap-2">
                            <ExternalLink className="w-4 h-4" />
                            View Help Center
                        </Button>
                    </Link>
                    <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm() }}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary hover:bg-primary/90">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Article
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{editingArticle ? 'Edit' : 'Create'} Help Article</DialogTitle>
                                <DialogDescription>Fill in the article details below.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Title *</Label>
                                        <Input
                                            value={form.title}
                                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                                            placeholder="How to request a ride"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Slug (auto-generated if empty)</Label>
                                        <Input
                                            value={form.slug}
                                            onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                            placeholder="how-to-request-ride"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>Category *</Label>
                                        <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {CATEGORIES.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id}>{cat.title}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Order</Label>
                                        <Input
                                            type="number"
                                            value={form.order_index}
                                            onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) || 1 })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Popular Article</Label>
                                        <div className="flex items-center gap-2 h-10">
                                            <Switch
                                                checked={form.is_popular}
                                                onCheckedChange={(checked) => setForm({ ...form, is_popular: checked })}
                                            />
                                            <span className="text-sm text-muted-foreground">
                                                {form.is_popular ? 'Featured' : 'Normal'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Content *</Label>
                                    <RichTextEditor
                                        content={form.content}
                                        onChange={(html) => setForm({ ...form, content: html })}
                                        placeholder="Write the article content here..."
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={saving}>
                                        {saving ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" /> {editingArticle ? 'Update' : 'Create'}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-4 mb-6">
                <Label className="text-sm font-medium">Filter by category:</Label>
                <Select value={filterCategory} onValueChange={(v) => { setFilterCategory(v); setCurrentPage(1) }}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {CATEGORIES.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.title}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">
                    {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Articles List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : articles.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No Articles Yet</h3>
                        <p className="text-muted-foreground mb-6">Create your first help article.</p>
                        <Button onClick={() => setDialogOpen(true)} className="bg-primary hover:bg-primary/90">
                            <Plus className="w-4 h-4 mr-2" /> Create Article
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {paginatedArticles.map((article) => (
                        <Card key={article.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6 flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <Badge className={`${catColors[article.category_id] || 'bg-gray-500'} text-white text-xs`}>
                                            {article.category_title || article.category_id}
                                        </Badge>
                                        {article.is_popular && (
                                            <Badge variant="outline" className="text-xs gap-1 border-yellow-400 text-yellow-600">
                                                <Star className="w-3 h-3 fill-yellow-400" /> Popular
                                            </Badge>
                                        )}
                                        <span className="text-xs text-muted-foreground">/{article.slug}</span>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2 truncate">{article.title}</h3>
                                    <div
                                        className="text-muted-foreground text-sm line-clamp-2"
                                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
                                    />
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(article)}>
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(article.id)}
                                        className="text-destructive hover:text-destructive/80"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            <span className="text-sm font-medium px-4">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage >= totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
