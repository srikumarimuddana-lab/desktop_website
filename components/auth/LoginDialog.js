'use client'

// Phone-OTP login dialog — the SAME rider/driver auth the mobile apps use
// (spinrvm backend /auth/send-otp + /auth/verify-otp). New phone numbers get
// an account created automatically on verify (is_new_user).
//
// Usage:
//   const { requireLogin, loginDialog } = useLoginGate()
//   ...
//   const user = await requireLogin()   // resolves when authed, null if closed
//   return <>{...}{loginDialog}</>

import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { sendOtp, verifyOtp } from '@/lib/spinr-api'
import { useAuth } from '@/components/auth/AuthProvider'

const OTP_LENGTH = 4
const RESEND_COOLDOWN_S = 30

/** "306 555 1234" / "(306) 555-1234" / "+1 306..." → "+13065551234" or null */
function toE164(input) {
  const digits = (input || '').replace(/\D/g, '')
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  return null
}

export function LoginDialog({ open, onOpenChange, onSuccess, title, description }) {
  const { reload } = useAuth()
  const [step, setStep] = useState('phone') // 'phone' | 'code'
  const [phoneInput, setPhoneInput] = useState('')
  const [phone, setPhone] = useState(null) // E.164 actually sent
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (!open) {
      setStep('phone')
      setPhoneInput('')
      setPhone(null)
      setCode('')
      setError(null)
      setBusy(false)
      setCooldown(0)
    }
  }, [open])

  useEffect(() => {
    if (cooldown <= 0) return undefined
    const t = setTimeout(() => setCooldown((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  async function handleSendOtp(e) {
    e?.preventDefault()
    setError(null)
    const e164 = toE164(phoneInput)
    if (!e164) {
      setError('Enter a valid 10-digit Canadian phone number.')
      return
    }
    setBusy(true)
    try {
      await sendOtp(e164)
      setPhone(e164)
      setStep('code')
      setCode('')
      setCooldown(RESEND_COOLDOWN_S)
    } catch (err) {
      // Render backend rate-limit / validation messages verbatim.
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const handleVerify = useCallback(
    async (fullCode) => {
      setBusy(true)
      setError(null)
      try {
        const auth = await verifyOtp(phone, fullCode)
        // Re-read the profile so driver onboarding fields are present.
        const me = await reload()
        toast.success(
          auth.is_new_user ? 'Welcome to Spinr! Your account is ready.' : 'Welcome back!'
        )
        // Resolve the gate BEFORE closing — closing resolves it with null.
        onSuccess?.(me || auth.user)
        onOpenChange(false)
      } catch (err) {
        setCode('')
        setError(err.message)
      } finally {
        setBusy(false)
      }
    },
    [phone, reload, onOpenChange, onSuccess]
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title || 'Log in or sign up'}</DialogTitle>
          <DialogDescription>
            {step === 'phone'
              ? description ||
                'Enter your mobile number and we’ll text you a verification code. New to Spinr? The same step creates your account.'
              : `Enter the ${OTP_LENGTH}-digit code we sent to ${phone}.`}
          </DialogDescription>
        </DialogHeader>

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-phone">Mobile number</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground shrink-0">+1</span>
                <Input
                  id="login-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="306 555 1234"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  disabled={busy}
                  autoFocus
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={busy || !phoneInput.trim()}>
              {busy ? 'Sending code…' : 'Send code'}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <InputOTP
                maxLength={OTP_LENGTH}
                value={code}
                onChange={(value) => {
                  setCode(value)
                  if (value.length === OTP_LENGTH && !busy) handleVerify(value)
                }}
                disabled={busy}
                autoFocus
              >
                <InputOTPGroup>
                  {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                    <InputOTPSlot key={i} index={i} className="h-12 w-12 text-lg" />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            {busy && <p className="text-sm text-muted-foreground text-center">Verifying…</p>}
            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
                onClick={() => {
                  setStep('phone')
                  setCode('')
                  setError(null)
                }}
                disabled={busy}
              >
                Change number
              </button>
              <button
                type="button"
                className="text-primary underline-offset-4 hover:underline disabled:opacity-50 disabled:no-underline"
                onClick={handleSendOtp}
                disabled={busy || cooldown > 0}
              >
                {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

/**
 * Imperative login gate. requireLogin() resolves with the user when already
 * authed or after a successful dialog login; resolves null if dismissed.
 */
export function useLoginGate(dialogProps = {}) {
  const { user, status } = useAuth()
  const [open, setOpen] = useState(false)
  const pendingRef = useRef(null)

  const requireLogin = useCallback(() => {
    if (status === 'authed' && user) return Promise.resolve(user)
    return new Promise((resolve) => {
      pendingRef.current = resolve
      setOpen(true)
    })
  }, [status, user])

  const handleOpenChange = useCallback((next) => {
    setOpen(next)
    if (!next && pendingRef.current) {
      pendingRef.current(null)
      pendingRef.current = null
    }
  }, [])

  const handleSuccess = useCallback((loggedInUser) => {
    if (pendingRef.current) {
      pendingRef.current(loggedInUser)
      pendingRef.current = null
    }
  }, [])

  const loginDialog = (
    <LoginDialog
      open={open}
      onOpenChange={handleOpenChange}
      onSuccess={handleSuccess}
      {...dialogProps}
    />
  )

  return { requireLogin, loginDialog, isLoggedIn: status === 'authed' }
}
