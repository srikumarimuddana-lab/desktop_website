'use client'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Loader2,
  Plus,
  Trash2,
  RefreshCw,
  Copy,
  Check,
  Ticket,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Send,
  MessageSquare,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

const DEFAULT_SMS_TEMPLATE =
  'Hi {name}! Spinr is offering you a ${reward} bonus for completing {goal_rides} rides in {window_days} days in {city}. Use code {code} at {link} — expires in 24 hours.'

function renderTemplate(template, vars) {
  const text = template || DEFAULT_SMS_TEMPLATE
  return text.replace(/\{(\w+)\}/g, (_, key) => {
    const v = vars[key]
    return v == null ? '' : String(v)
  })
}

function buildLink(origin, slug, code) {
  return `${origin}/promotions/${slug}?code=${encodeURIComponent(code)}`
}

function buildSms(promo, coupon, link) {
  if (!promo) return link
  return renderTemplate(promo.smsTemplate, {
    name: coupon.recipient_name || 'there',
    code: coupon.code,
    link,
    reward: promo.reward,
    goal_rides: promo.goalRides,
    window_days: promo.windowDays,
    city: promo.city,
    title: promo.title,
  })
}

function couponStatusBadge(coupon) {
  const now = Date.now()
  const exp = coupon.expires_at ? new Date(coupon.expires_at).getTime() : 0
  if (coupon.status === 'used') {
    return <Badge className="bg-gray-500 text-white text-xs">Used</Badge>
  }
  if (exp && exp < now) {
    return <Badge className="bg-red-200 text-red-800 text-xs">Expired</Badge>
  }
  return <Badge className="bg-green-600 text-white text-xs">Active</Badge>
}

function smsStatusBadge(coupon) {
  const s = coupon.sms_status || 'not_sent'
  if (s === 'sent') return <Badge className="bg-green-600 text-white text-xs">SMS sent</Badge>
  if (s === 'queued') return <Badge className="bg-blue-500 text-white text-xs">Queued</Badge>
  if (s === 'failed') return <Badge className="bg-red-500 text-white text-xs">Failed</Badge>
  if (s === 'skipped') return <Badge className="bg-yellow-500 text-white text-xs">Skipped</Badge>
  return <Badge variant="outline" className="text-xs">Not sent</Badge>
}

function timeLeft(iso) {
  if (!iso) return '—'
  const ms = new Date(iso).getTime() - Date.now()
  if (ms <= 0) return 'expired'
  const h = Math.floor(ms / 3_600_000)
  const m = Math.floor((ms % 3_600_000) / 60_000)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export default function PromotionCouponsPage() {
  const [coupons, setCoupons] = useState([])
  const [promos, setPromos] = useState([])
  const [loading, setLoading] = useState(true)
  const [origin, setOrigin] = useState('')
  const [twilioConfigured, setTwilioConfigured] = useState(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedPromo, setSelectedPromo] = useState('')
  const [autoSend, setAutoSend] = useState(true)
  const [recipients, setRecipients] = useState([{ name: '', phone: '' }])
  const [generating, setGenerating] = useState(false)
  const [generatedBatch, setGeneratedBatch] = useState(null)
  const [copiedKey, setCopiedKey] = useState('')
  const [resendingId, setResendingId] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') setOrigin(window.location.origin)
    Promise.all([fetchCoupons(), fetchPromos()])
  }, [])

  const authHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session
      ? { Authorization: `Bearer ${session.access_token}` }
      : {}
  }

  const fetchCoupons = async () => {
    setLoading(true)
    try {
      const headers = await authHeaders()
      const res = await fetch('/api/promotion-coupons', { headers })
      if (res.ok) setCoupons(await res.json())
      else toast.error('Failed to load coupons')
    } catch {
      toast.error('Error loading coupons')
    } finally {
      setLoading(false)
    }
  }

  const fetchPromos = async () => {
    try {
      const headers = await authHeaders()
      const res = await fetch('/api/promotions', { headers })
      if (res.ok) {
        const data = await res.json()
        setPromos(data)
        const firstActive = data.find((p) => p.status === 'active')
        if (firstActive && !selectedPromo) setSelectedPromo(firstActive.slug)
      }
    } catch {
      // ignore
    }
  }

  const activePromos = promos.filter((p) => p.status === 'active')
  const selectedPromoObj = useMemo(
    () => promos.find((p) => p.slug === selectedPromo),
    [selectedPromo, promos]
  )

  const stats = useMemo(() => {
    const now = Date.now()
    const total = coupons.length
    const active = coupons.filter(
      (c) =>
        c.status === 'pending' &&
        c.expires_at &&
        new Date(c.expires_at).getTime() > now
    ).length
    const used = coupons.filter((c) => c.status === 'used').length
    const expired = coupons.filter(
      (c) =>
        c.status === 'pending' &&
        c.expires_at &&
        new Date(c.expires_at).getTime() <= now
    ).length
    const smsSent = coupons.filter((c) => c.sms_status === 'sent').length
    return { total, active, used, expired, smsSent }
  }, [coupons])

  const addRecipient = () =>
    setRecipients((r) => [...r, { name: '', phone: '' }])
  const removeRecipient = (i) =>
    setRecipients((r) => r.filter((_, idx) => idx !== i))
  const updateRecipient = (i, field, value) =>
    setRecipients((r) =>
      r.map((item, idx) => (idx === i ? { ...item, [field]: value } : item))
    )

  const openDialog = () => {
    setGeneratedBatch(null)
    setRecipients([{ name: '', phone: '' }])
    if (!selectedPromo && activePromos[0]) {
      setSelectedPromo(activePromos[0].slug)
    }
    setDialogOpen(true)
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    const trimmed = recipients
      .map((r) => ({ name: r.name.trim(), phone: r.phone.trim() }))
      .filter((r) => r.phone || r.name)

    if (!selectedPromo) {
      toast.error('Pick a promotion')
      return
    }
    if (trimmed.length === 0) {
      toast.error('Add at least one recipient')
      return
    }

    setGenerating(true)
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(await authHeaders()),
      }
      const res = await fetch('/api/promotion-coupons', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          promotion_slug: selectedPromo,
          recipients: trimmed,
          send_sms: autoSend,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to generate')
      const couponsList = data.coupons || data
      setGeneratedBatch(couponsList)
      setTwilioConfigured(!!data.twilio_configured)
      if (autoSend && data.twilio_configured === false) {
        toast.warning(
          'Codes generated, but Twilio isn\'t configured — SMS not sent. Copy manually below.'
        )
      } else {
        toast.success(`Generated ${couponsList.length} coupon${couponsList.length === 1 ? '' : 's'}`)
      }
      fetchCoupons()
    } catch (err) {
      toast.error(err.message || 'Error generating coupons')
    } finally {
      setGenerating(false)
    }
  }

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(''), 2000)
    } catch {
      toast.error('Could not copy')
    }
  }

  const resendSms = async (couponId) => {
    setResendingId(couponId)
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(await authHeaders()),
      }
      const res = await fetch(`/api/promotion-coupons/${couponId}/resend-sms`, {
        method: 'POST',
        headers,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed')
      if (data.ok) toast.success('SMS sent')
      else toast.error(data.error || 'Failed to send')
      fetchCoupons()
    } catch (err) {
      toast.error(err.message || 'Failed to resend')
    } finally {
      setResendingId('')
    }
  }

  const handleExport = () => {
    if (coupons.length === 0) {
      toast.error('Nothing to export')
      return
    }
    const headers = [
      'code',
      'promotion_slug',
      'recipient_name',
      'recipient_phone',
      'status',
      'expires_at',
      'used_at',
      'used_by_email',
      'sms_status',
      'sms_error',
      'sms_sent_at',
      'created_at',
    ]
    const escape = (v) => {
      if (v == null) return ''
      const s = String(v).replace(/"/g, '""')
      return /[",\n]/.test(s) ? `"${s}"` : s
    }
    const rows = [
      headers.join(','),
      ...coupons.map((c) => headers.map((h) => escape(c[h])).join(',')),
    ]
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `spinr-coupons-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const promoForCoupon = (slug) => promos.find((p) => p.slug === slug)

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Promotion Coupons</h1>
          <p className="text-muted-foreground text-sm">
            Generate invite-only codes. 24h expiry, one driver per code.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => { fetchCoupons(); fetchPromos() }} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={coupons.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90" onClick={openDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Generate Codes
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Generate coupon codes</DialogTitle>
                <DialogDescription>
                  Each code is single-use and expires 24 hours from now.
                </DialogDescription>
              </DialogHeader>

              {!generatedBatch ? (
                <form onSubmit={handleGenerate} className="space-y-5 mt-4">
                  <div className="space-y-2">
                    <Label>Promotion</Label>
                    {activePromos.length === 0 ? (
                      <div className="p-3 rounded-lg border border-yellow-200 bg-yellow-50 text-sm text-yellow-900 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>
                          No active promotions. Create one on the Promotions page first.
                        </span>
                      </div>
                    ) : (
                      <Select value={selectedPromo} onValueChange={setSelectedPromo}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a promotion" />
                        </SelectTrigger>
                        <SelectContent>
                          {activePromos.map((p) => (
                            <SelectItem key={p.slug} value={p.slug}>
                              {p.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Recipients</Label>
                      <span className="text-xs text-muted-foreground">
                        {recipients.length}/100
                      </span>
                    </div>
                    <div className="space-y-2">
                      {recipients.map((r, i) => (
                        <div key={i} className="flex gap-2">
                          <Input
                            placeholder="Name (optional)"
                            value={r.name}
                            onChange={(e) =>
                              updateRecipient(i, 'name', e.target.value)
                            }
                            className="flex-1"
                          />
                          <Input
                            placeholder="Phone (e.g. 306-555-0123)"
                            value={r.phone}
                            onChange={(e) =>
                              updateRecipient(i, 'phone', e.target.value)
                            }
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeRecipient(i)}
                            disabled={recipients.length === 1}
                          >
                            <Trash2 className="w-4 h-4 text-primary" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addRecipient}
                      disabled={recipients.length >= 100}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add recipient
                    </Button>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer select-none p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <input
                      type="checkbox"
                      checked={autoSend}
                      onChange={(e) => setAutoSend(e.target.checked)}
                      className="mt-1 w-4 h-4 accent-primary shrink-0"
                    />
                    <span className="text-sm text-gray-700 leading-relaxed">
                      <span className="font-semibold">Send SMS automatically via Twilio</span>
                      <br />
                      <span className="text-xs text-muted-foreground">
                        If Twilio isn't configured on the server, codes are still
                        generated — you'll see a "Copy SMS" button for each one.
                      </span>
                    </span>
                  </label>

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
                      disabled={generating || activePromos.length === 0}
                    >
                      {generating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Ticket className="w-4 h-4 mr-2" />
                          Generate {recipients.length} code{recipients.length === 1 ? '' : 's'}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4 mt-4">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-green-900 mb-0.5">
                        {generatedBatch.length} code{generatedBatch.length === 1 ? '' : 's'} generated
                      </p>
                      <p className="text-green-800">
                        {twilioConfigured
                          ? 'SMS delivery is running in the background — status below.'
                          : 'Twilio is not configured. Copy each SMS below and send manually.'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {generatedBatch.map((c) => {
                      const promo = promoForCoupon(c.promotion_slug)
                      const link = buildLink(origin, c.promotion_slug, c.code)
                      const sms = buildSms(promo, c, link)
                      return (
                        <div
                          key={c.id}
                          className="border border-gray-200 rounded-xl p-4 bg-white"
                        >
                          <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                            <div>
                              <p className="font-mono font-bold text-gray-900">
                                {c.code}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {c.recipient_name || 'Unnamed'}
                                {c.recipient_phone ? ` · ${c.recipient_phone}` : ''}
                              </p>
                            </div>
                            <div className="flex gap-2 items-center">
                              {smsStatusBadge(c)}
                              <Badge className="bg-green-600 text-white">24h</Badge>
                            </div>
                          </div>
                          {c.sms_error && (
                            <p className="text-xs text-red-600 mb-2">
                              SMS error: {c.sms_error}
                            </p>
                          )}
                          <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-xs text-gray-700 font-mono whitespace-pre-wrap break-all mb-2">
                            {sms}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(sms, `sms-${c.id}`)}
                            >
                              {copiedKey === `sms-${c.id}` ? (
                                <>
                                  <Check className="w-3 h-3 mr-1.5" /> Copied
                                </>
                              ) : (
                                <>
                                  <MessageSquare className="w-3 h-3 mr-1.5" /> Copy SMS
                                </>
                              )}
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(link, `link-${c.id}`)}
                            >
                              {copiedKey === `link-${c.id}` ? (
                                <>
                                  <Check className="w-3 h-3 mr-1.5" /> Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 mr-1.5" /> Copy link
                                </>
                              )}
                            </Button>
                            {twilioConfigured && c.sms_status !== 'sent' && c.recipient_phone && (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => resendSms(c.id)}
                                disabled={resendingId === c.id}
                              >
                                {resendingId === c.id ? (
                                  <>
                                    <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                                    Sending
                                  </>
                                ) : (
                                  <>
                                    <Send className="w-3 h-3 mr-1.5" /> Send SMS
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setGeneratedBatch(null)
                        setRecipients([{ name: '', phone: '' }])
                      }}
                    >
                      Generate more
                    </Button>
                    <Button
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => setDialogOpen(false)}
                    >
                      Done
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <Ticket className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Total
              </p>
              <p className="text-xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Active
              </p>
              <p className="text-xl font-bold">{stats.active}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Redeemed
              </p>
              <p className="text-xl font-bold">{stats.used}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Expired
              </p>
              <p className="text-xl font-bold">{stats.expired}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                SMS Sent
              </p>
              <p className="text-xl font-bold">{stats.smsSent}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : coupons.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No coupons yet</h3>
            <p className="text-muted-foreground mb-6">
              Generate your first batch to invite drivers to a promotion.
            </p>
            <Button className="bg-primary hover:bg-primary/90" onClick={openDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Generate Codes
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden lg:block">
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="px-4 py-3 font-semibold">Code</th>
                      <th className="px-4 py-3 font-semibold">Recipient</th>
                      <th className="px-4 py-3 font-semibold">Promotion</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Expires</th>
                      <th className="px-4 py-3 font-semibold">SMS</th>
                      <th className="px-4 py-3 font-semibold">Redeemed by</th>
                      <th className="px-4 py-3 font-semibold"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((c) => {
                      const link = buildLink(origin, c.promotion_slug, c.code)
                      return (
                        <tr
                          key={c.id}
                          className="border-b last:border-0 hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 font-mono text-xs font-bold">
                            {c.code}
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-medium">{c.recipient_name || '—'}</p>
                            <p className="text-xs text-muted-foreground">
                              {c.recipient_phone || '—'}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-xs">{c.promotion_slug}</td>
                          <td className="px-4 py-3">{couponStatusBadge(c)}</td>
                          <td className="px-4 py-3 text-xs">
                            {c.status === 'pending' ? timeLeft(c.expires_at) : '—'}
                          </td>
                          <td className="px-4 py-3">{smsStatusBadge(c)}</td>
                          <td className="px-4 py-3 text-xs">
                            {c.used_by_email || '—'}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              {c.status === 'pending' && c.recipient_phone && c.sms_status !== 'sent' && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => resendSms(c.id)}
                                  disabled={resendingId === c.id}
                                  title="Send/Resend SMS"
                                >
                                  {resendingId === c.id ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Send className="w-3.5 h-3.5" />
                                  )}
                                </Button>
                              )}
                              {c.status === 'pending' && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    copyToClipboard(link, `link-${c.id}`)
                                  }
                                  title="Copy invite link"
                                >
                                  {copiedKey === `link-${c.id}` ? (
                                    <Check className="w-3.5 h-3.5 text-green-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 lg:hidden">
            {coupons.map((c) => {
              const link = buildLink(origin, c.promotion_slug, c.code)
              return (
                <Card key={c.id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-mono font-bold text-gray-900">
                          {c.code}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {c.recipient_name || 'Unnamed'}
                          {c.recipient_phone ? ` · ${c.recipient_phone}` : ''}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {couponStatusBadge(c)}
                        {smsStatusBadge(c)}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Promotion: {c.promotion_slug}</p>
                      {c.status === 'pending' && (
                        <p>Expires in: {timeLeft(c.expires_at)}</p>
                      )}
                      {c.used_by_email && <p>Used by: {c.used_by_email}</p>}
                      {c.sms_error && (
                        <p className="text-red-600">SMS error: {c.sms_error}</p>
                      )}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {c.status === 'pending' && c.recipient_phone && c.sms_status !== 'sent' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resendSms(c.id)}
                          disabled={resendingId === c.id}
                        >
                          {resendingId === c.id ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                              Sending
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5 mr-2" /> Send SMS
                            </>
                          )}
                        </Button>
                      )}
                      {c.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(link, `link-${c.id}`)}
                        >
                          {copiedKey === `link-${c.id}` ? (
                            <>
                              <Check className="w-3.5 h-3.5 mr-2" /> Link copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 mr-2" /> Copy invite link
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
