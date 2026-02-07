'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Save, FileText, Loader2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

// Dynamically import the editor to avoid SSR issues
const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="border rounded-lg p-4 min-h-[350px] bg-muted/30 animate-pulse" />
})

const defaultPolicies = {
  'rider-terms': {
    slug: 'rider-terms',
    title: 'Rider Terms of Service',
    content_html: '<h2>1. Introduction</h2><p>Welcome to Spinr. These Terms govern your use as a rider.</p>'
  },
  'driver-terms': {
    slug: 'driver-terms',
    title: 'Driver Terms of Service',
    content_html: '<h2>1. Driver Obligations</h2><p>Drivers must maintain a valid license and insurance.</p>'
  },
  'rider-policy': {
    slug: 'rider-policy',
    title: 'Rider Privacy Policy',
    content_html: '<h2>1. Rider Data Collection</h2><p>We collect location and payment data.</p>'
  },
  'driver-policy': {
    slug: 'driver-policy',
    title: 'Driver Privacy Policy',
    content_html: '<h2>1. Driver Data Collection</h2><p>We collect license and vehicle info.</p>'
  },
  'driver-agreement': {
    slug: 'driver-agreement',
    title: 'Driver Agreement (Legacy)',
    content_html: '<h2>Legacy Agreement</h2><p>This is the old driver agreement file.</p>'
  },
  'privacy': {
    slug: 'privacy',
    title: 'Privacy Policy (Legacy)',
    content_html: '<h2>Legacy Privacy</h2><p>This is the old privacy policy file.</p>'
  },
  'terms': {
    slug: 'terms',
    title: 'Terms of Service (Legacy)',
    content_html: '<h2>Legacy Terms</h2><p>This is the old terms file.</p>'
  }
}

export default function PoliciesPage() {
  const [policies, setPolicies] = useState(defaultPolicies)
  const [activeTab, setActiveTab] = useState('rider-terms')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPolicies()
  }, [])

  const fetchPolicies = async () => {
    try {
      const slugs = ['rider-terms', 'driver-terms', 'rider-policy', 'driver-policy', 'driver-agreement', 'privacy', 'terms']
      const fetched = { ...defaultPolicies }

      for (const slug of slugs) {
        try {
          const { data: { session } } = await supabase.auth.getSession()
          const headers = session ? { Authorization: `Bearer ${session.access_token}` } : {}
          const res = await fetch(`/api/legal/${slug}`, { headers })
          if (res.ok) {
            const data = await res.json()
            if (data?.content_html) {
              fetched[slug] = data
            }
          }
        } catch (e) {
          console.log(`Using default for ${slug}`)
        }
      }
      setPolicies(fetched)
    } catch (err) {
      console.error('Error fetching policies:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (slug) => {
    setSaving(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      const res = await fetch(`/api/legal/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(policies[slug])
      })

      if (res.ok) {
        toast.success('Policy updated successfully!', {
          description: `${policies[slug].title} has been saved.`
        })
      } else {
        toast.error('Failed to save policy', {
          description: 'Please try again or check your connection.'
        })
      }
    } catch (err) {
      toast.error('Error occurred', {
        description: 'Could not save the policy. Please try again.'
      })
    } finally {
      setSaving(false)
    }
  }

  const updatePolicy = useCallback((slug, field, value) => {
    setPolicies(prev => ({
      ...prev,
      [slug]: { ...prev[slug], [field]: value }
    }))
  }, [])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Policy Manager</h1>
        <p className="text-muted-foreground">Edit legal documents with the rich text editor.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex flex-wrap h-auto gap-2">
            <TabsTrigger value="rider-terms">Rider Terms</TabsTrigger>
            <TabsTrigger value="rider-policy">Rider Privacy</TabsTrigger>
            <TabsTrigger value="driver-terms">Driver Terms</TabsTrigger>
            <TabsTrigger value="driver-policy">Driver Privacy</TabsTrigger>
            <TabsTrigger value="driver-agreement">Driver Agreement (Legacy)</TabsTrigger>
          </TabsList>

          <TabsContent value="rider-terms"><PolicyEditor slug="rider-terms" policies={policies} updatePolicy={updatePolicy} handleSave={handleSave} saving={saving} /></TabsContent>
          <TabsContent value="rider-policy"><PolicyEditor slug="rider-policy" policies={policies} updatePolicy={updatePolicy} handleSave={handleSave} saving={saving} /></TabsContent>
          <TabsContent value="driver-terms"><PolicyEditor slug="driver-terms" policies={policies} updatePolicy={updatePolicy} handleSave={handleSave} saving={saving} /></TabsContent>
          <TabsContent value="driver-policy"><PolicyEditor slug="driver-policy" policies={policies} updatePolicy={updatePolicy} handleSave={handleSave} saving={saving} /></TabsContent>
          <TabsContent value="driver-agreement"><PolicyEditor slug="driver-agreement" policies={policies} updatePolicy={updatePolicy} handleSave={handleSave} saving={saving} /></TabsContent>
        </Tabs>
      )}
    </div>
  )
}

const PolicyEditor = ({ slug, policies, updatePolicy, handleSave, saving }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary" />
        {policies[slug]?.title}
      </CardTitle>
      <CardDescription>
        Use the toolbar to format text. Changes are saved when you click Save.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label>Document Title</Label>
        <Input
          value={policies[slug]?.title || ''}
          onChange={(e) => updatePolicy(slug, 'title', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Content</Label>
        <RichTextEditor
          content={policies[slug]?.content_html || ''}
          onChange={(html) => updatePolicy(slug, 'content_html', html)}
          placeholder="Start writing your policy..."
        />
      </div>

      <div className="flex justify-between items-center pt-4">
        <Link
          href={`/legal/${slug}`}
          target="_blank"
          className="text-primary hover:text-primary/80 text-sm flex items-center gap-1"
        >
          <Eye className="w-4 h-4" /> Preview Page
        </Link>
        <Button
          onClick={() => handleSave(slug)}
          className="bg-primary hover:bg-primary/90"
          disabled={saving}
        >
          {saving ? (
            <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...</>
          ) : (
            <><Save className="w-4 h-4 mr-2" /> Save Changes</>
          )}
        </Button>
      </div>
    </CardContent>
  </Card>
)
