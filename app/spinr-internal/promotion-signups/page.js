'use client'
import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Loader2,
  Users,
  Gift,
  Search,
  Download,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Hash,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { PROMOTIONS } from '@/constants/promotions'
import { toast } from 'sonner'

export default function PromotionSignupsPage() {
  const [signups, setSignups] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [promoFilter, setPromoFilter] = useState('all')

  useEffect(() => {
    fetchSignups()
  }, [])

  const fetchSignups = async () => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const headers = session
        ? { Authorization: `Bearer ${session.access_token}` }
        : {}
      const res = await fetch('/api/promotion-signups', { headers })
      if (res.ok) {
        setSignups(await res.json())
      } else {
        toast.error('Failed to load signups')
      }
    } catch {
      toast.error('Error loading signups')
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return signups.filter((s) => {
      const matchesPromo = promoFilter === 'all' || s.promotion_slug === promoFilter
      const matchesQuery =
        !q ||
        s.full_name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.phone?.includes(q) ||
        s.driver_id?.toLowerCase().includes(q) ||
        s.reference?.toLowerCase().includes(q)
      return matchesPromo && matchesQuery
    })
  }, [signups, query, promoFilter])

  const stats = useMemo(() => {
    const total = signups.length
    const byPromo = signups.reduce((acc, s) => {
      acc[s.promotion_slug] = (acc[s.promotion_slug] || 0) + 1
      return acc
    }, {})
    const potentialPayout = signups.reduce((sum, s) => sum + (s.reward_amount || 0), 0)
    return { total, byPromo, potentialPayout }
  }, [signups])

  const handleExport = () => {
    if (filtered.length === 0) {
      toast.error('Nothing to export')
      return
    }
    const headers = [
      'reference',
      'promotion_slug',
      'full_name',
      'email',
      'phone',
      'driver_id',
      'city',
      'goal_rides',
      'window_days',
      'reward_amount',
      'status',
      'accepted_at',
      'expires_at',
    ]
    const escape = (v) => {
      if (v == null) return ''
      const s = String(v).replace(/"/g, '""')
      return /[",\n]/.test(s) ? `"${s}"` : s
    }
    const rows = [
      headers.join(','),
      ...filtered.map((s) => headers.map((h) => escape(s[h])).join(',')),
    ]
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `spinr-promotion-signups-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatDate = (iso) => {
    if (!iso) return '—'
    try {
      return new Date(iso).toLocaleString('en-CA', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    } catch {
      return iso
    }
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Promotion Signups</h1>
          <p className="text-muted-foreground text-sm">
            Monitor drivers who accepted active quests.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchSignups} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={handleExport}
            disabled={filtered.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Total Signups
              </p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center">
              <Gift className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Active Promotions
              </p>
              <p className="text-2xl font-bold">
                {PROMOTIONS.filter((p) => p.status === 'active').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center">
              <Hash className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Max Payout Exposure
              </p>
              <p className="text-2xl font-bold">${stats.potentialPayout}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, phone, driver ID, reference..."
            className="pl-9 h-10"
          />
        </div>
        <select
          value={promoFilter}
          onChange={(e) => setPromoFilter(e.target.value)}
          className="h-10 px-3 rounded-md border border-input bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="all">All promotions</option>
          {PROMOTIONS.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      {/* Table/List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No signups yet</h3>
            <p className="text-muted-foreground">
              Drivers who accept a quest via their invite link will appear here.
            </p>
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
                      <th className="px-4 py-3 font-semibold">Reference</th>
                      <th className="px-4 py-3 font-semibold">Driver</th>
                      <th className="px-4 py-3 font-semibold">Contact</th>
                      <th className="px-4 py-3 font-semibold">Promotion</th>
                      <th className="px-4 py-3 font-semibold">Accepted</th>
                      <th className="px-4 py-3 font-semibold">Expires</th>
                      <th className="px-4 py-3 font-semibold">Bonus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s) => (
                      <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs">{s.reference}</td>
                        <td className="px-4 py-3">
                          <p className="font-semibold">{s.full_name}</p>
                          <p className="text-xs text-muted-foreground">
                            ID: {s.driver_id}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs">{s.email}</p>
                          <p className="text-xs text-muted-foreground">{s.phone}</p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className="bg-primary text-white text-xs">
                            {s.promotion_slug}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">{s.city}</p>
                        </td>
                        <td className="px-4 py-3 text-xs">{formatDate(s.accepted_at)}</td>
                        <td className="px-4 py-3 text-xs">{formatDate(s.expires_at)}</td>
                        <td className="px-4 py-3 font-bold text-primary">
                          ${s.reward_amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 lg:hidden">
            {filtered.map((s) => (
              <Card key={s.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">{s.full_name}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {s.reference}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-primary text-white text-xs">
                        ${s.reward_amount}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{s.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{s.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Hash className="w-3.5 h-3.5" />
                      <span>Driver ID: {s.driver_id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>
                        {s.city} · {s.promotion_slug}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Accepted {formatDate(s.accepted_at)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Expires {formatDate(s.expires_at)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
