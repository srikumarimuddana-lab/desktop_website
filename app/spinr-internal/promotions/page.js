'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Plus,
  Trash2,
  Edit,
  Save,
  Loader2,
  Gift,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

const EMPTY_FORM = {
  slug: '',
  audience: 'driver',
  status: 'draft',
  title: '',
  shortDescription: '',
  heroHighlight: '',
  reward: 200,
  goalRides: 15,
  windowDays: 30,
  city: 'Saskatoon',
  startDate: '',
  endDate: '',
  howItWorksText: '',
  termsText: '',
  smsTemplate:
    'Hi {name}! Spinr is offering you a ${reward} bonus for completing {goal_rides} rides in {window_days} days in {city}. Use code {code} at {link} — expires in 24 hours.',
}

function toFormShape(p) {
  return {
    id: p.id,
    slug: p.slug || '',
    audience: p.audience || 'driver',
    status: p.status || 'draft',
    title: p.title || '',
    shortDescription: p.shortDescription || '',
    heroHighlight: p.heroHighlight || '',
    reward: p.reward ?? 0,
    goalRides: p.goalRides ?? 0,
    windowDays: p.windowDays ?? 30,
    city: p.city || 'Saskatoon',
    startDate: p.startDate || '',
    endDate: p.endDate || '',
    howItWorksText: (p.howItWorks || []).join('\n'),
    termsText: (p.terms || []).join('\n'),
    smsTemplate: p.smsTemplate || EMPTY_FORM.smsTemplate,
  }
}

function fromFormShape(f) {
  return {
    slug: (f.slug || '').trim().toLowerCase(),
    audience: f.audience,
    status: f.status,
    title: f.title.trim(),
    shortDescription: f.shortDescription.trim(),
    heroHighlight: f.heroHighlight.trim(),
    reward: Number(f.reward) || 0,
    goalRides: Number(f.goalRides) || 0,
    windowDays: Number(f.windowDays) || 30,
    city: f.city.trim(),
    startDate: f.startDate || null,
    endDate: f.endDate || null,
    howItWorks: (f.howItWorksText || '')
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean),
    terms: (f.termsText || '')
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean),
    smsTemplate: f.smsTemplate.trim(),
  }
}

export default function PromotionsCmsPage() {
  const [promos, setPromos] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [origin, setOrigin] = useState('')
  const [copiedId, setCopiedId] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') setOrigin(window.location.origin)
    fetchPromos()
  }, [])

  const fetchPromos = async () => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const headers = session
        ? { Authorization: `Bearer ${session.access_token}` }
        : {}
      const res = await fetch('/api/promotions', { headers })
      if (res.ok) setPromos(await res.json())
      else toast.error('Failed to load promotions')
    } catch {
      toast.error('Error loading promotions')
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setDialogOpen(true)
  }

  const openEdit = (p) => {
    setEditing(p)
    setForm(toFormShape(p))
    setDialogOpen(true)
  }

  const updateField = (key, value) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.slug || !form.title) {
      toast.error('Slug and title are required')
      return
    }
    setSaving(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const headers = {
        'Content-Type': 'application/json',
        ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
      }
      const payload = fromFormShape(form)
      const url = editing ? `/api/promotions/${editing.id}` : '/api/promotions'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed')
      toast.success(editing ? 'Promotion updated' : 'Promotion created')
      setDialogOpen(false)
      fetchPromos()
    } catch (err) {
      toast.error(err.message || 'Error saving')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (p) => {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const headers = session
        ? { Authorization: `Bearer ${session.access_token}` }
        : {}
      const res = await fetch(`/api/promotions/${p.id}`, {
        method: 'DELETE',
        headers,
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Failed')
      }
      toast.success('Deleted')
      fetchPromos()
    } catch (err) {
      toast.error(err.message || 'Error deleting')
    }
  }

  const copyLink = async (p) => {
    const link = `${origin}/promotions/${p.slug}`
    try {
      await navigator.clipboard.writeText(link)
      setCopiedId(p.id)
      setTimeout(() => setCopiedId(''), 2000)
    } catch {
      toast.error('Could not copy')
    }
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Promotions</h1>
          <p className="text-muted-foreground text-sm">
            Create and edit quest offers, rewards, terms, and SMS templates.
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          New promotion
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? 'Edit promotion' : 'Create promotion'}
            </DialogTitle>
            <DialogDescription>
              All fields are editable. Status must be "active" to be visible
              and usable for coupon generation.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Complete 30 Rides, Earn $500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>URL slug</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => updateField('slug', e.target.value)}
                  placeholder="driver-500-bonus"
                  required
                  disabled={!!editing}
                />
                <p className="text-xs text-muted-foreground">
                  /promotions/<span className="font-mono">{form.slug || 'your-slug'}</span>
                </p>
              </div>

              <div className="space-y-2">
                <Label>Hero highlight</Label>
                <Input
                  value={form.heroHighlight}
                  onChange={(e) => updateField('heroHighlight', e.target.value)}
                  placeholder="$500 Bonus"
                  required
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label>Short description</Label>
                <Textarea
                  value={form.shortDescription}
                  onChange={(e) =>
                    updateField('shortDescription', e.target.value)
                  }
                  rows={2}
                  placeholder="One-line pitch shown on the card and hero."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Audience</Label>
                <Select
                  value={form.audience}
                  onValueChange={(v) => updateField('audience', v)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="driver">Driver</SelectItem>
                    <SelectItem value="rider">Rider</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => updateField('status', v)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Reward ($)</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.reward}
                  onChange={(e) => updateField('reward', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Goal rides</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.goalRides}
                  onChange={(e) => updateField('goalRides', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Window (days)</Label>
                <Input
                  type="number"
                  min="1"
                  value={form.windowDays}
                  onChange={(e) => updateField('windowDays', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={form.city}
                  onChange={(e) => updateField('city', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Start date</Label>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => updateField('startDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>End date</Label>
                <Input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => updateField('endDate', e.target.value)}
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label>How it works (one step per line)</Label>
                <Textarea
                  value={form.howItWorksText}
                  onChange={(e) =>
                    updateField('howItWorksText', e.target.value)
                  }
                  rows={5}
                  placeholder={'Register with your code\nAccept the quest\nComplete the rides\nGet paid'}
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label>Terms (one bullet per line)</Label>
                <Textarea
                  value={form.termsText}
                  onChange={(e) => updateField('termsText', e.target.value)}
                  rows={5}
                  placeholder={'Open to approved Spinr drivers in Saskatoon only\nBonus paid on the next weekly payout\n...'}
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label>SMS template</Label>
                <Textarea
                  value={form.smsTemplate}
                  onChange={(e) => updateField('smsTemplate', e.target.value)}
                  rows={4}
                  className="font-mono text-xs"
                />
                <p className="text-xs text-muted-foreground">
                  Placeholders: <code className="bg-gray-100 px-1">{'{name}'}</code>{' '}
                  <code className="bg-gray-100 px-1">{'{code}'}</code>{' '}
                  <code className="bg-gray-100 px-1">{'{link}'}</code>{' '}
                  <code className="bg-gray-100 px-1">{'{reward}'}</code>{' '}
                  <code className="bg-gray-100 px-1">{'{goal_rides}'}</code>{' '}
                  <code className="bg-gray-100 px-1">{'{window_days}'}</code>{' '}
                  <code className="bg-gray-100 px-1">{'{city}'}</code>{' '}
                  <code className="bg-gray-100 px-1">{'{title}'}</code>
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {editing ? 'Save changes' : 'Create promotion'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : promos.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No promotions yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first quest offer to start generating coupons.
            </p>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={openCreate}
            >
              <Plus className="w-4 h-4 mr-2" />
              New promotion
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {promos.map((p) => (
            <Card
              key={p.id}
              className="border border-gray-200 hover:border-primary/30 transition-all"
            >
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        className={
                          p.status === 'active'
                            ? 'bg-green-600 text-white text-xs'
                            : 'bg-gray-400 text-white text-xs'
                        }
                      >
                        {p.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {p.audience}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-lg leading-tight">
                      {p.title}
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                      /promotions/{p.slug}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary leading-none">
                      ${p.reward}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {p.goalRides} rides · {p.windowDays}d
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {p.shortDescription}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto pt-2 border-t border-gray-100">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEdit(p)}
                  >
                    <Edit className="w-3.5 h-3.5 mr-1.5" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyLink(p)}
                  >
                    {copiedId === p.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1.5" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy link
                      </>
                    )}
                  </Button>
                  {p.status === 'active' && (
                    <a
                      href={`/promotions/${p.slug}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                        View
                      </Button>
                    </a>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-primary hover:text-primary/80 ml-auto"
                    onClick={() => handleDelete(p)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
