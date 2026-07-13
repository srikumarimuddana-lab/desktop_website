'use client'

// Application status page — renders the backend's authoritative
// driver_onboarding_status (+detail copy) and routes the applicant to the
// right next action: resume the wizard, re-upload documents, or download
// the driver app once verified.

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Clock, FileWarning, ShieldAlert } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SmartAppLink from '@/components/ui/SmartAppLink'
import { useAuth } from '@/components/auth/AuthProvider'

const WIZARD_STATES = new Set([
  'profile_incomplete',
  'vehicle_required',
  'documents_required',
  'documents_rejected',
  'documents_expired',
])

const PRESENTATION = {
  pending_review: {
    icon: Clock,
    tone: 'text-amber-600 bg-amber-50',
    title: 'Application under review',
    body: "Our team is reviewing your documents. This usually takes 1–2 business days — we'll text and email you the moment you're approved.",
  },
  verified: {
    icon: CheckCircle2,
    tone: 'text-green-600 bg-green-50',
    title: "You're approved to drive!",
    body: 'Download the Spinr Driver app and log in with the same phone number — you go online and take your first trip from the app.',
  },
  suspended: {
    icon: ShieldAlert,
    tone: 'text-red-600 bg-red-50',
    title: 'Account suspended',
    body: 'Your driver account is currently suspended. Contact support@spinr.ca for help.',
  },
}

export default function DriverStatusClient() {
  const router = useRouter()
  const { user, status } = useAuth()
  const onboarding = user?.driver_onboarding_status || null

  useEffect(() => {
    if (status === 'anon') router.replace('/drive/signup')
    if (status === 'authed' && (!onboarding || WIZARD_STATES.has(onboarding))) {
      router.replace('/drive/signup')
    }
  }, [status, onboarding, router])

  if (status !== 'authed' || !onboarding || WIZARD_STATES.has(onboarding)) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-gray-500">Loading…</div>
    )
  }

  const p = PRESENTATION[onboarding] || {
    icon: FileWarning,
    tone: 'text-gray-600 bg-gray-100',
    title: 'Application status',
    body: user?.driver_onboarding_detail || 'Check back soon for an update.',
  }
  const Icon = p.icon

  return (
    <div className="container mx-auto px-4 py-12 max-w-xl">
      <Card>
        <CardHeader className="text-center">
          <div className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full ${p.tone}`}>
            <Icon className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">{p.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-gray-600">{user?.driver_onboarding_detail || p.body}</p>

          {onboarding === 'verified' && (
            <div className="space-y-3">
              <p className="text-sm font-medium">Get the Spinr Driver app</p>
              <div className="flex justify-center">
                <SmartAppLink appType="driver" />
              </div>
            </div>
          )}

          {onboarding === 'pending_review' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                While you wait, download the driver app — you'll use it to go online once
                approved.
              </p>
              <div className="flex justify-center">
                <SmartAppLink appType="driver" />
              </div>
            </div>
          )}

          {onboarding === 'suspended' && (
            <Button asChild variant="outline">
              <Link href="/support">Contact support</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
