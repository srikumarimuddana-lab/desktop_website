'use client'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import DOMPurify from 'isomorphic-dompurify'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Plus, Trash2, Edit, Save, Loader2, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
// Textarea is no longer needed
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

// Dynamically import the editor to avoid SSR issues
const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="border rounded-lg p-4 min-h-[150px] bg-muted/30 animate-pulse" />
})

export default function FAQsPage() {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingFaq, setEditingFaq] = useState(null)
  const [form, setForm] = useState({ question: '', answer: '', category: 'general', tags: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => { fetchFaqs() }, [])

  const fetchFaqs = async () => {
    try { const res = await fetch('/api/faqs'); if (res.ok) setFaqs(await res.json()) }
    catch { } finally { setLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const res = await fetch(editingFaq ? `/api/faqs/${editingFaq.id}` : '/api/faqs', {
        method: editingFaq ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tags: form.tags.split(',').map(t => t.trim()).filter(t => t) })
      })
      if (res.ok) {
        toast.success(editingFaq ? 'FAQ updated!' : 'FAQ created!', {
          description: `"${form.question}" has been saved.`
        })
        setDialogOpen(false)
        resetForm()
        fetchFaqs()
      } else {
        toast.error('Failed to save FAQ')
      }
    } catch {
      toast.error('Error occurred')
    }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this FAQ?')) return
    try {
      const res = await fetch(`/api/faqs/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('FAQ deleted!')
        fetchFaqs()
      }
    } catch {
      toast.error('Error deleting FAQ')
    }
  }

  const handleEdit = (faq) => { setEditingFaq(faq); setForm({ question: faq.question, answer: faq.answer, category: faq.category, tags: (faq.tags || []).join(', ') }); setDialogOpen(true) }
  const resetForm = () => { setEditingFaq(null); setForm({ question: '', answer: '', category: 'general', tags: '' }) }
  const catColors = { general: 'bg-gray-500', rider: 'bg-blue-500', driver: 'bg-primary' }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-3xl font-bold mb-2">FAQ Manager</h1><p className="text-muted-foreground">Create and manage support articles.</p></div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm() }}>
          <DialogTrigger asChild><Button className="bg-primary hover:bg-primary/90"><Plus className="w-4 h-4 mr-2" /> Add FAQ</Button></DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>{editingFaq ? 'Edit' : 'Create'} FAQ</DialogTitle><DialogDescription>Fill in the details.</DialogDescription></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2"><Label>Question</Label><Input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} required /></div>
              <div className="space-y-2">
                <Label>Answer</Label>
                <RichTextEditor
                  content={form.answer}
                  onChange={(html) => setForm({ ...form, answer: html })}
                  placeholder="Write the content here..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="general">General</SelectItem><SelectItem value="rider">Rider</SelectItem><SelectItem value="driver">Driver</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Tags (comma-separated)</Label><Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={saving}>{saving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> {editingFaq ? 'Update' : 'Create'}</>}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {loading ? <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
        : faqs.length === 0 ? (
          <Card><CardContent className="p-12 text-center"><HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" /><h3 className="text-xl font-semibold mb-2">No FAQs Yet</h3><p className="text-muted-foreground mb-6">Create your first FAQ.</p><Button onClick={() => setDialogOpen(true)} className="bg-primary hover:bg-primary/90"><Plus className="w-4 h-4 mr-2" /> Create FAQ</Button></CardContent></Card>
        ) : (
          <div className="space-y-4">
            {faqs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((faq) => (
              <Card key={faq.id}>
                <CardContent className="p-6 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${catColors[faq.category]} text-white text-xs`}>{faq.category}</Badge>
                      {faq.tags?.map((tag, i) => <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>)}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                    {/* Render partial HTML in the preview card properly or strip tags for preview */}
                    <div className="text-muted-foreground text-sm line-clamp-2" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(faq.answer) }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(faq)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(faq.id)} className="text-primary hover:text-primary/80"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Pagination Controls */}
            {faqs.length > itemsPerPage && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm font-medium">
                  Page {currentPage} of {Math.ceil(faqs.length / itemsPerPage)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(Math.ceil(faqs.length / itemsPerPage), p + 1))}
                  disabled={currentPage >= Math.ceil(faqs.length / itemsPerPage)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      <div className="mt-8 text-center"><Link href="/support" target="_blank" className="text-primary hover:text-primary/80 text-sm">View Support Page →</Link></div>
    </div>
  )
}
