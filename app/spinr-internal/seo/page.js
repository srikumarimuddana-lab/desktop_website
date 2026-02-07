'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save, X, AlertCircle, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export default function SEOManagerPage() {
  const [seoPages, setSeoPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingPage, setEditingPage] = useState(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchSeoPages()
  }, [])

  const fetchSeoPages = async () => {
    try {
      const res = await fetch('/api/seo-pages')
      if (res.ok) {
        const data = await res.json()
        setSeoPages(data)
      }
    } catch (error) {
      toast.error('Failed to load SEO pages')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setIsCreating(true)
    setEditingPage({
      path: '',
      title: '',
      description: '',
      keywords: '',
      og_image: '',
      canonical: '',
      sitemap_priority: 0.5,
      sitemap_frequency: 'weekly',
      structured_data: '',
      custom_head: '',
      custom_body_start: '',
      custom_body_end: '',
      sitemap_priority: 0.5,
      sitemap_frequency: 'weekly',
      structured_data: '',
      no_index: false
    })
  }

  const handleEdit = (page) => {
    setIsCreating(false)
    setEditingPage({
      ...page,
      structured_data: page.structured_data ? JSON.stringify(page.structured_data, null, 2) : ''
    })
  }

  const handleCancel = () => {
    setEditingPage(null)
    setIsCreating(false)
  }

  const handleSave = async () => {
    if (!editingPage) return

    // Validate required fields
    if (!editingPage.path || !editingPage.title) {
      toast.error('Path and Title are required')
      return
    }

    // Validate JSON-LD if provided
    let parsedStructuredData = null
    if (editingPage.structured_data && editingPage.structured_data.trim()) {
      try {
        parsedStructuredData = JSON.parse(editingPage.structured_data)
      } catch (error) {
        toast.error('Invalid JSON in Structured Data field')
        return
      }
    }

    const payload = {
      ...editingPage,
      structured_data: parsedStructuredData
    }

    try {
      const method = isCreating ? 'POST' : 'PUT'
      const url = isCreating ? '/api/seo-pages' : `/api/seo-pages/${encodeURIComponent(editingPage.path)}`

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        toast.success(isCreating ? 'SEO page created!' : 'SEO page updated!')
        fetchSeoPages()
        handleCancel()
      } else {
        const error = await res.json()
        toast.error(error.error || 'Failed to save SEO page')
      }
    } catch (error) {
      toast.error('An error occurred while saving')
    }
  }

  const handleDelete = async (path) => {
    if (!confirm(`Delete SEO configuration for "${path}"?`)) return

    try {
      const res = await fetch(`/api/seo-pages/${encodeURIComponent(path)}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        toast.success('SEO page deleted')
        fetchSeoPages()
      } else {
        toast.error('Failed to delete SEO page')
      }
    } catch (error) {
      toast.error('An error occurred while deleting')
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading SEO pages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">SEO Manager</h1>
          <p className="text-muted-foreground">
            Control sitemap, metadata, and structured data for every page
          </p>
        </div>
        {!editingPage && (
          <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            New SEO Page
          </Button>
        )}
      </div>

      {/* Info Card */}
      {!editingPage && (
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-900 text-sm font-medium">Database-First SEO Engine</p>
              <p className="text-blue-700 text-xs mt-1">
                Changes here automatically update <code>/sitemap.xml</code>, page metadata, and JSON-LD structured data. No code changes needed.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Editor Form */}
      {editingPage && (
        <Card className="mb-8">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center justify-between">
              <span>{isCreating ? 'Create New SEO Page' : `Edit: ${editingPage.path}`}</span>
              <div className="flex gap-2">
                <Button onClick={handleSave} className="bg-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button onClick={handleCancel} variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Path */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Page Path <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                placeholder="e.g., /drive or /legal/terms"
                value={editingPage.path}
                onChange={(e) => setEditingPage({ ...editingPage, path: e.target.value })}
                disabled={!isCreating}
                className={!isCreating ? 'bg-gray-50' : ''}
              />
              <p className="text-xs text-muted-foreground">
                The URL path for this page. Cannot be changed after creation.
              </p>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Page Title <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                placeholder="e.g., Drive with Spinr - 0% Commission"
                value={editingPage.title}
                onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Shown in browser tabs and search results (50-60 characters recommended).
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Meta Description</Label>
              <Textarea
                placeholder="e.g., Keep 100% of your earnings. No commission..."
                value={editingPage.description || ''}
                onChange={(e) => setEditingPage({ ...editingPage, description: e.target.value })}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Shown in search results (150-160 characters recommended).
              </p>
            </div>

            {/* Keywords */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Keywords</Label>
              <Input
                type="text"
                placeholder="rideshare, saskatchewan, driver, earnings"
                value={editingPage.keywords || ''}
                onChange={(e) => setEditingPage({ ...editingPage, keywords: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Comma-separated keywords for this page.
              </p>
            </div>

            {/* Open Graph Image */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Open Graph Image URL</Label>
              <Input
                type="url"
                placeholder="https://example.com/images/og-image.jpg"
                value={editingPage.og_image || ''}
                onChange={(e) => setEditingPage({ ...editingPage, og_image: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Image shown when shared on social media (1200x630px recommended).
              </p>
            </div>

            {/* Canonical URL */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Canonical URL</Label>
              <Input
                type="url"
                placeholder="https://spinr.ca/drive"
                value={editingPage.canonical || ''}
                onChange={(e) => setEditingPage({ ...editingPage, canonical: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Override the canonical URL (usually auto-generated from path).
              </p>
            </div>

            {/* Sitemap Settings */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Sitemap Priority</Label>
                <Input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={editingPage.sitemap_priority}
                  onChange={(e) => setEditingPage({ ...editingPage, sitemap_priority: parseFloat(e.target.value) })}
                />
                <p className="text-xs text-muted-foreground">
                  0.0 to 1.0 (1.0 = highest priority)
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Change Frequency</Label>
                <select
                  value={editingPage.sitemap_frequency}
                  onChange={(e) => setEditingPage({ ...editingPage, sitemap_frequency: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="always">Always</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="never">Never</option>
                </select>
                <p className="text-xs text-muted-foreground">
                  How often the page content changes
                </p>
              </div>
            </div>

            {/* No Index */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="no_index"
                checked={editingPage.no_index}
                onChange={(e) => setEditingPage({ ...editingPage, no_index: e.target.checked })}
                className="mt-1"
              />
              <div>
                <Label htmlFor="no_index" className="font-semibold cursor-pointer">
                  Exclude from Sitemap (noindex)
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Check this to hide the page from search engines and sitemap.
                </p>
              </div>
            </div>

            {/* JSON-LD Structured Data */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">JSON-LD Structured Data (Advanced)</Label>
              <Textarea
                placeholder='{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": []}'
                value={editingPage.structured_data || ''}
                onChange={(e) => setEditingPage({ ...editingPage, structured_data: e.target.value })}
                rows={10}
                className="font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">
                Paste valid JSON-LD for Google Rich Results (e.g., FAQPage, LocalBusiness).
                <a
                  href="https://schema.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline ml-1"
                >
                  Learn more →
                </a>
              </p>
            </div>

            {/* Custom Scripts */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-sm">Custom Scripts & Tags</h3>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Custom Head Content</Label>
                <p className="text-xs text-muted-foreground">Scripts/Tags to inject into <code>&lt;head&gt;</code> (e.g., Google Analytics, Meta Pixels, Verification Tags).</p>
                <Textarea
                  placeholder='<script>...</script> or <meta ... />'
                  value={editingPage.custom_head || ''}
                  onChange={(e) => setEditingPage({ ...editingPage, custom_head: e.target.value })}
                  rows={4}
                  className="font-mono text-xs bg-gray-50"
                  spellCheck={false}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Custom Body Start</Label>
                <p className="text-xs text-muted-foreground">Scripts to inject immediately after <code>&lt;body&gt;</code> opening tag (e.g., GTM noscript).</p>
                <Textarea
                  placeholder='<noscript>...</noscript>'
                  value={editingPage.custom_body_start || ''}
                  onChange={(e) => setEditingPage({ ...editingPage, custom_body_start: e.target.value })}
                  rows={3}
                  className="font-mono text-xs bg-gray-50"
                  spellCheck={false}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Custom Body End (Footer)</Label>
                <p className="text-xs text-muted-foreground">Scripts to inject before <code>&lt;/body&gt;</code> closing tag (e.g., Chat widgets, Tracking scripts).</p>
                <Textarea
                  placeholder='<script>...</script>'
                  value={editingPage.custom_body_end || ''}
                  onChange={(e) => setEditingPage({ ...editingPage, custom_body_end: e.target.value })}
                  rows={4}
                  className="font-mono text-xs bg-gray-50"
                  spellCheck={false}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pages List */}
      {!editingPage && (
        <Card>
          <CardHeader className="border-b">
            <CardTitle>All SEO Pages ({seoPages.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {seoPages.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No SEO pages configured yet</p>
                <Button onClick={handleCreate} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First SEO Page
                </Button>
              </div>
            ) : (
              <div className="divide-y">
                {seoPages.map((page) => (
                  <div key={page.path} className="p-4 hover:bg-gray-50 transition-colors flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                          {page.path}
                        </code>
                        {page.no_index && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded">
                            noindex
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          Priority: {page.sitemap_priority} | {page.sitemap_frequency}
                        </span>
                      </div>
                      <h3 className="font-semibold text-base mb-1">{page.title}</h3>
                      {page.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {page.description}
                        </p>
                      )}
                      {page.structured_data && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                          <Check className="w-3 h-3" />
                          JSON-LD configured
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => handleEdit(page)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(page.path)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
