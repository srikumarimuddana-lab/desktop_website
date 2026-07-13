'use client'

// Driver signup wizard. The step shown is DERIVED from the backend's
// onboarding state machine (user.driver_onboarding_status via /auth/me) —
// there is no client-side step bookkeeping to persist, so a hard reload
// resumes exactly where the applicant left off.

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Stepper } from '@/components/ui/stepper'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth/AuthProvider'
import { LoginDialog } from '@/components/auth/LoginDialog'
import StepProfile from '@/components/driver/StepProfile'
import StepVehicle from '@/components/driver/StepVehicle'
import StepDocuments from '@/components/driver/StepDocuments'

const STEP_LABELS = ['Your details', 'Vehicle & licence', 'Documents']

const STATUS_DONE = new Set(['pending_review', 'verified', 'suspended'])

function stepForStatus(status) {
  switch (status) {
    case 'vehicle_required':
      return 1
    case 'documents_required':
    case 'documents_rejected':
    case 'documents_expired':
      return 2
    case 'profile_incomplete':
    default:
      // New rider accounts (no driver flag yet) have no onboarding status —
      // they start at the profile step, which sets role: "driver".
      return 0
  }
}

export default function DriverSignupClient() {
  const router = useRouter()
  const { user, status, reload } = useAuth()
  const [loginOpen, setLoginOpen] = useState(false)

  const onboarding = user?.driver_onboarding_status || null

  useEffect(() => {
    if (status === 'anon') setLoginOpen(true)
    if (status === 'authed') setLoginOpen(false)
  }, [status])

  useEffect(() => {
    if (onboarding && STATUS_DONE.has(onboarding)) {
      router.replace('/drive/status')
    }
  }, [onboarding, router])

  const step = stepForStatus(onboarding)

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <h1 className="text-3xl font-bold text-center">Sign up to drive with Spinr</h1>
      <p className="text-gray-600 text-center mt-2 mb-8">
        Keep 100% of your net fare. Apply in about 10 minutes — as an independent
        contractor you choose when and where you drive.
      </p>

      <Stepper steps={STEP_LABELS} current={step} className="mb-8 px-2" />

      {status === 'loading' && (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">Loading…</CardContent>
        </Card>
      )}

      {status === 'anon' && (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <p className="text-gray-600">
              Log in or create your account with your phone number to start your driver
              application.
            </p>
            <Button onClick={() => setLoginOpen(true)}>Log in to continue</Button>
          </CardContent>
        </Card>
      )}

      {status === 'authed' && user && !STATUS_DONE.has(onboarding) && (
        <Card>
          <CardContent className="pt-6">
            {step === 0 && <StepProfile user={user} onDone={reload} />}
            {step === 1 && <StepVehicle user={user} onDone={reload} />}
            {step === 2 && (
              <StepDocuments
                user={user}
                onboardingStatus={onboarding}
                onDone={async () => {
                  const me = await reload()
                  if (me?.driver_onboarding_status && STATUS_DONE.has(me.driver_onboarding_status)) {
                    router.push('/drive/status')
                  }
                }}
              />
            )}
          </CardContent>
        </Card>
      )}

      <LoginDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        title="Log in to start driving"
        description="Enter your mobile number — this becomes (or already is) your Spinr account."
      />
    </div>
  )
}
