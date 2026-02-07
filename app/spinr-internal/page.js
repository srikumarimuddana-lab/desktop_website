'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Car, FileText, HelpCircle, Settings, ChevronRight, Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { isSupabaseConfigured } from '@/lib/supabase'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalFaqs: 0, totalPolicies: 0, totalSeoPages: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const { data: { session } } = await import('@/lib/supabase').then(m => m.supabase.auth.getSession())
      const headers = session ? { Authorization: `Bearer ${session.access_token}` } : {}

      const res = await fetch('/api/admin/stats', { headers })
      if (res.ok) setStats(await res.json())
    } catch { } finally { setLoading(false) }
  }

  const menu = [
    { title: 'Policy Manager', desc: 'Edit Terms, Privacy, Driver Agreement', icon: FileText, href: '/spinr-internal/policies', color: 'bg-blue-50 text-blue-600' },
    { title: 'FAQ Manager', desc: 'Create and manage FAQs', icon: HelpCircle, href: '/spinr-internal/faqs', color: 'bg-purple-50 text-purple-600' },
    { title: 'SEO Manager', desc: 'Control Sitemap, Metadata & Structured Data', icon: Search, href: '/spinr-internal/seo', color: 'bg-green-50 text-green-600' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to Spinr Admin</h1>
        <p className="text-muted-foreground">Manage content, FAQs, legal documents, and SEO.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card><CardContent className="p-6 flex items-center justify-between">
          <div><p className="text-muted-foreground text-sm">Total FAQs</p><p className="text-3xl font-bold">{loading ? '...' : stats.totalFaqs}</p></div>
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center"><HelpCircle className="w-6 h-6 text-purple-600" /></div>
        </CardContent></Card>
        <Card><CardContent className="p-6 flex items-center justify-between">
          <div><p className="text-muted-foreground text-sm">Legal Docs</p><p className="text-3xl font-bold">{loading ? '...' : stats.totalPolicies}</p></div>
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center"><FileText className="w-6 h-6 text-blue-600" /></div>
        </CardContent></Card>
        <Card><CardContent className="p-6 flex items-center justify-between">
          <div><p className="text-muted-foreground text-sm">SEO Pages</p><p className="text-3xl font-bold">{loading ? '...' : stats.totalSeoPages}</p></div>
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center"><Search className="w-6 h-6 text-green-600" /></div>
        </CardContent></Card>
        <Card><CardContent className="p-6 flex items-center justify-between">
          <div><p className="text-muted-foreground text-sm">Status</p><p className="text-lg font-bold text-primary">{isSupabaseConfigured() ? 'Connected' : 'Demo Mode'}</p></div>
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center"><Settings className="w-6 h-6 text-primary" /></div>
        </CardContent></Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {menu.map((item, i) => (
          <Link key={i} href={item.href}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-6 flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}><item.icon className="w-6 h-6" /></div>
                  <div><h3 className="text-xl font-semibold mb-1">{item.title}</h3><p className="text-muted-foreground text-sm">{item.desc}</p></div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {!isSupabaseConfigured() && (
        <Card className="mt-8 bg-amber-50 border-amber-200">
          <CardContent className="p-6">
            <h3 className="text-amber-700 font-semibold mb-2">Setup Required: Connect Supabase</h3>
            <p className="text-amber-600 text-sm mb-4">Add credentials to <code className="bg-amber-100 px-1 rounded">.env.local</code>:</p>
            <pre className="bg-white p-4 rounded-lg text-sm overflow-x-auto">NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
              NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key</pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
