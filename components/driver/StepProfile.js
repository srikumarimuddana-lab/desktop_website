'use client'

// Wizard step 1 — personal details. POSTs /users/profile with role:"driver",
// which flips is_driver and moves the onboarding state machine forward.

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { apiFetch } from '@/lib/spinr-api'

const GENDERS = ['Male', 'Female', 'Other']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function StepProfile({ user, onDone }) {
  const [firstName, setFirstName] = useState(user?.first_name || '')
  const [lastName, setLastName] = useState(user?.last_name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [gender, setGender] = useState(user?.gender || '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const canSubmit =
    firstName.trim() && lastName.trim() && EMAIL_RE.test(email.trim()) && gender && !busy

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      await apiFetch('/api/v1/users/profile', {
        method: 'POST',
        body: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
          gender,
          role: 'driver',
        },
      })
      toast.success('Details saved')
      await onDone?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dp-first">First name</Label>
          <Input
            id="dp-first"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={busy}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dp-last">Last name</Label>
          <Input
            id="dp-last"
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={busy}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="dp-email">Email</Label>
        <Input
          id="dp-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={busy}
        />
        <p className="text-xs text-gray-500">
          One account covers riding and driving — if this email is already on another
          Spinr account, log in to that account instead.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="dp-gender">Gender</Label>
        <Select value={gender} onValueChange={setGender} disabled={busy}>
          <SelectTrigger id="dp-gender">
            <SelectValue placeholder="Select…" />
          </SelectTrigger>
          <SelectContent>
            {GENDERS.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" className="w-full" disabled={!canSubmit}>
        {busy ? 'Saving…' : 'Continue'}
      </Button>
    </form>
  )
}
