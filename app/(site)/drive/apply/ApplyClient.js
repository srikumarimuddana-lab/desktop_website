'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { APP_URLS } from '@/lib/app-links'
import { Reveal } from '../../Reveal'

/*
 * The application form.
 *
 * Step order is the one security decision visible in this file: the phone
 * check comes LAST, not first. Collecting the details before verifying means
 * (a) nobody hits an auth wall before they can see what is being asked, and
 * (b) the session token exists for the few seconds between "code accepted"
 * and "application submitted" rather than for the ten minutes someone spends
 * typing in their VIN. The register call fires immediately after verify.
 *
 * Nothing here ever sees a token. Every call goes to /api/driver-signup/*,
 * which talks to the backend server-side and keeps the session in an httpOnly
 * cookie.
 *
 * Form state is kept whole across a failed submit on purpose. If the session
 * lapses between verifying and registering, the applicant goes back one step
 * and re-confirms their number — they never retype the form.
 */

const STEPS = ['About you', 'Your car', 'Your licence', 'Confirm it is you']

/** Vehicles must be under ten years old. Enforced by the backend at approval,
 *  so this warns rather than blocks — a hard stop here would wrongly turn away
 *  an edge case that a human would have waved through. */
const VEHICLE_MAX_AGE_YEARS = 10

const RESEND_COOLDOWN_S = 30

function Field({ label, hint, error, children }) {
  return (
    <label className="sp-ap-field">
      <span className="sp-ap-label">{label}</span>
      {children}
      {hint && !error && <em className="sp-ap-hint">{hint}</em>}
      {error && (
        <em className="sp-ap-err" role="alert">
          {error}
        </em>
      )}
    </label>
  )
}

export default function ApplyClient({ serviceAreas, backendReachable }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    service_area_id: serviceAreas[0]?.id || '',
    vehicle_make: '',
    vehicle_model: '',
    vehicle_color: '',
    vehicle_year: '',
    license_plate: '',
    vehicle_vin: '',
    vehicle_type_id: '',
    license_number: '',
    license_expiry_date: '',
  })
  const [vehicleTypes, setVehicleTypes] = useState([])
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [consent, setConsent] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [busy, setBusy] = useState(false)
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState(null)
  const [done, setDone] = useState(null)
  const headingRef = useRef(null)

  const set = (key) => (e) => {
    const value = e.target.value
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
  }

  // Vehicle types are per service area — an area with no fare configured for a
  // type must not offer it, or the driver picks something that fails later at
  // ride creation. Refetched whenever the area changes.
  useEffect(() => {
    if (!form.service_area_id) return
    let cancelled = false
    fetch(`/api/driver-signup/options?service_area_id=${encodeURIComponent(form.service_area_id)}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return
        const types = d?.vehicle_types || []
        setVehicleTypes(types)
        // Drop a selection that the new area does not offer.
        setForm((f) => (types.some((t) => t.id === f.vehicle_type_id) ? f : { ...f, vehicle_type_id: '' }))
      })
      .catch(() => {
        if (!cancelled) setVehicleTypes([])
      })
    return () => {
      cancelled = true
    }
  }, [form.service_area_id])

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  // Move focus to the new step's heading so a screen-reader or keyboard user
  // is not left at the bottom of the previous step's markup.
  useEffect(() => {
    headingRef.current?.focus()
  }, [step, done])

  const selectedArea = useMemo(
    () => serviceAreas.find((a) => a.id === form.service_area_id),
    [serviceAreas, form.service_area_id]
  )

  const vehicleAgeWarning = useMemo(() => {
    const year = parseInt(form.vehicle_year, 10)
    if (!year || String(form.vehicle_year).length !== 4) return null
    const age = new Date().getFullYear() - year
    if (age >= VEHICLE_MAX_AGE_YEARS) {
      return `Vehicles need to be under ${VEHICLE_MAX_AGE_YEARS} years old. You can still apply, but this may not pass inspection.`
    }
    return null
  }, [form.vehicle_year])

  function validateStep(index) {
    const next = {}
    if (index === 0) {
      if (!form.first_name.trim()) next.first_name = 'Required.'
      if (!form.last_name.trim()) next.last_name = 'Required.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Enter a valid email address.'
      if (!form.service_area_id) next.service_area_id = 'Choose where you will drive.'
    }
    if (index === 1) {
      if (!form.vehicle_make.trim()) next.vehicle_make = 'Required.'
      if (!form.vehicle_model.trim()) next.vehicle_model = 'Required.'
      if (!/^\d{4}$/.test(form.vehicle_year.trim())) next.vehicle_year = 'Enter a 4-digit year.'
      if (!form.license_plate.trim()) next.license_plate = 'Required.'
    }
    if (index === 2) {
      if (!form.license_number.trim()) next.license_number = 'Required.'
      if (!form.license_expiry_date) next.license_expiry_date = 'Required.'
      else if (new Date(form.license_expiry_date) <= new Date()) {
        next.license_expiry_date = 'Your licence needs to be in date.'
      }
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function goNext() {
    setNotice(null)
    if (validateStep(step)) setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  const post = useCallback(async (action, body) => {
    const res = await fetch(`/api/driver-signup/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    // A non-JSON body here means an edge error, not an application error.
    const data = await res.json().catch(() => ({ ok: false, message: 'Something went wrong. Please try again.' }))
    return data
  }, [])

  async function sendCode() {
    setNotice(null)
    if (!/^\d{10}$/.test(phone.replace(/\D/g, '').replace(/^1/, ''))) {
      setErrors({ phone: 'Enter a 10-digit Canadian mobile number.' })
      return
    }
    setErrors({})
    setBusy(true)
    const data = await post('otp', { phone })
    setBusy(false)
    if (!data.ok) {
      setNotice({ tone: 'bad', text: data.message })
      return
    }
    setCodeSent(true)
    setCooldown(RESEND_COOLDOWN_S)
    setNotice({ tone: 'ok', text: 'We sent you a 4-digit code by text.' })
  }

  async function submit() {
    setNotice(null)
    if (!/^\d{4}$/.test(code.trim())) {
      setErrors({ code: 'Enter the 4-digit code.' })
      return
    }
    if (!consent) {
      setErrors({ consent: 'Please accept the Terms of Service and Privacy Policy.' })
      return
    }
    setErrors({})
    setBusy(true)

    const verified = await post('verify', { phone, code, consent_accepted: true })
    if (!verified.ok) {
      setBusy(false)
      if (verified.code === 'bad_code') setErrors({ code: verified.message })
      else setNotice({ tone: 'bad', text: verified.message })
      return
    }

    // Register straight away — the whole reason the phone step is last is to
    // keep this gap as short as possible.
    const registered = await post('register', {
      ...form,
      city: selectedArea?.city || selectedArea?.name || '',
      // The account may already carry a name from a previous rider signup;
      // what was typed here is what the applicant means to submit.
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
    })
    setBusy(false)

    if (!registered.ok) {
      if (registered.code === 'session_expired') {
        // Nothing typed is lost — they re-confirm the number and submit again.
        setCodeSent(false)
        setCode('')
        setNotice({ tone: 'bad', text: registered.message })
        return
      }
      setNotice({ tone: 'bad', text: registered.message })
      return
    }

    setDone({ status: registered.status, driverCode: registered.driver_code })
  }

  // ── unavailable / not-open states ─────────────────────────────────────────

  if (!backendReachable || serviceAreas.length === 0) {
    return (
      <Shell heading="Drive with Spinr" headingRef={headingRef}>
        <p className="sp-ap-lede">
          {backendReachable
            ? 'We are not taking applications for a new area just yet. Spinr operates in Saskatoon today.'
            : 'Applications are briefly unavailable. Please try again in a few minutes, or apply straight from the Spinr driver app.'}
        </p>
        <a className="sp-btn" href={APP_URLS.driver.ios} target="_blank" rel="noopener noreferrer">
          Get the driver app
        </a>
      </Shell>
    )
  }

  // ── submitted ─────────────────────────────────────────────────────────────

  if (done) {
    return (
      <Shell heading="Application started" headingRef={headingRef}>
        <p className="sp-ap-lede">
          Your details are in and your driver account is created. It is marked
          <strong> pending</strong> while we review it{done.driverCode ? <> — your reference is <b>{done.driverCode}</b></> : null}.
        </p>
        <div className="sp-ap-next">
          <h2 className="sp-display">One more thing, in the app</h2>
          <p>
            The last part needs your phone&rsquo;s camera. Download the Spinr driver app, sign in with
            the same number, and you will be asked for photos of your licence, your ride-share
            insurance and your vehicle inspection, plus consent for the criminal record check.
            Nothing moves forward until those are in.
          </p>
          <div className="sp-ap-actions">
            <a className="sp-btn" href={APP_URLS.driver.ios} target="_blank" rel="noopener noreferrer">
              Download for iPhone
            </a>
            <a className="sp-btn-ghost" href={APP_URLS.driver.android} target="_blank" rel="noopener noreferrer">
              Download for Android
            </a>
          </div>
        </div>
        <p className="sp-ap-fine">
          Questions before then? Email <a href="mailto:support@spinr.ca">support@spinr.ca</a>.
        </p>
      </Shell>
    )
  }

  // ── the form ──────────────────────────────────────────────────────────────

  return (
    <Shell heading="Start your application" headingRef={headingRef}>
      <p className="sp-ap-lede">
        About ten minutes. You keep 100% of the net fare — Spinr never takes a share of what you
        earn. Worth checking <Link href="/drive/requirements">what you will need</Link> before you
        start.
      </p>

      <ol className="sp-ap-steps" aria-label="Progress">
        {STEPS.map((label, i) => (
          <li key={label} className={i === step ? 'is-on' : i < step ? 'is-done' : ''} aria-current={i === step ? 'step' : undefined}>
            <span className="sp-ap-stepn sp-display">{i + 1}</span>
            <span className="sp-ap-steplabel">{label}</span>
          </li>
        ))}
      </ol>

      <div className="sp-ap-card">
        {step === 0 && (
          <div className="sp-ap-grid">
            <Field label="First name" error={errors.first_name}>
              <input value={form.first_name} onChange={set('first_name')} autoComplete="given-name" />
            </Field>
            <Field label="Last name" error={errors.last_name}>
              <input value={form.last_name} onChange={set('last_name')} autoComplete="family-name" />
            </Field>
            <Field label="Email" error={errors.email} hint="Where we send updates about your application.">
              <input type="email" value={form.email} onChange={set('email')} autoComplete="email" />
            </Field>
            <Field label="Where you will drive" error={errors.service_area_id}>
              <select value={form.service_area_id} onChange={set('service_area_id')}>
                {serviceAreas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="sp-ap-grid">
            <Field label="Make" error={errors.vehicle_make}>
              <input value={form.vehicle_make} onChange={set('vehicle_make')} placeholder="Toyota" />
            </Field>
            <Field label="Model" error={errors.vehicle_model}>
              <input value={form.vehicle_model} onChange={set('vehicle_model')} placeholder="Corolla" />
            </Field>
            <Field label="Year" error={errors.vehicle_year} hint={vehicleAgeWarning}>
              <input inputMode="numeric" maxLength={4} value={form.vehicle_year} onChange={set('vehicle_year')} placeholder="2019" />
            </Field>
            <Field label="Colour">
              <input value={form.vehicle_color} onChange={set('vehicle_color')} placeholder="Silver" />
            </Field>
            <Field label="Licence plate" error={errors.license_plate}>
              <input value={form.license_plate} onChange={set('license_plate')} />
            </Field>
            <Field label="VIN" hint="Optional now — you will need it before your inspection.">
              <input value={form.vehicle_vin} onChange={set('vehicle_vin')} maxLength={17} />
            </Field>
            {vehicleTypes.length > 0 && (
              <Field label="Vehicle type" hint="What you will be dispatched for.">
                <select value={form.vehicle_type_id} onChange={set('vehicle_type_id')}>
                  <option value="">Choose one</option>
                  {vehicleTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </Field>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="sp-ap-grid">
            <Field label="Driver's licence number" error={errors.license_number}>
              <input value={form.license_number} onChange={set('license_number')} />
            </Field>
            <Field label="Licence expiry" error={errors.license_expiry_date}>
              <input type="date" value={form.license_expiry_date} onChange={set('license_expiry_date')} />
            </Field>
            <p className="sp-ap-note">
              A full Class 5 licence held for three years or more. Class 1 to 4 holders can drive
              with Spinr but need separate approval — apply anyway and we will walk you through it.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="sp-ap-grid">
            <Field label="Mobile number" error={errors.phone} hint="We text you a 4-digit code.">
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  setErrors((p) => ({ ...p, phone: undefined }))
                }}
                placeholder="306 555 0142"
                autoComplete="tel"
                disabled={codeSent}
              />
            </Field>

            {!codeSent ? (
              <button type="button" className="sp-btn" onClick={sendCode} disabled={busy}>
                {busy ? 'Sending…' : 'Send me a code'}
              </button>
            ) : (
              <>
                <Field label="Your code" error={errors.code}>
                  <input inputMode="numeric" maxLength={4} value={code} onChange={(e) => setCode(e.target.value)} autoComplete="one-time-code" />
                </Field>
                <button
                  type="button"
                  className="sp-ap-link"
                  onClick={sendCode}
                  disabled={busy || cooldown > 0}
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : 'Send a new code'}
                </button>

                <label className="sp-ap-consent">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                  <span>
                    I agree to the <Link href="/legal/terms">Terms of Service</Link> and{' '}
                    <Link href="/legal/privacy">Privacy Policy</Link>.
                  </span>
                </label>
                {errors.consent && (
                  <em className="sp-ap-err" role="alert">
                    {errors.consent}
                  </em>
                )}

                <button type="button" className="sp-btn" onClick={submit} disabled={busy}>
                  {busy ? 'Submitting…' : 'Submit application'}
                </button>
              </>
            )}
          </div>
        )}

        {notice && (
          <p className={`sp-ap-notice ${notice.tone === 'ok' ? 'is-ok' : 'is-bad'}`} role="status">
            {notice.text}
          </p>
        )}

        <div className="sp-ap-nav">
          {step > 0 && (
            <button type="button" className="sp-btn-ghost" onClick={() => setStep((s) => s - 1)} disabled={busy}>
              Back
            </button>
          )}
          {step < STEPS.length - 1 && (
            <button type="button" className="sp-btn" onClick={goNext}>
              Continue
            </button>
          )}
        </div>
      </div>

      <p className="sp-ap-fine">
        Spinr drivers are independent contractors. You choose when you drive and which trips you
        take.
      </p>
    </Shell>
  )
}

function Shell({ heading, headingRef, children }) {
  return (
    <section className="sp-sec sp-ap-sec">
      <div className="sp-wrap sp-ap-wrap">
        <Reveal>
          <span className="sp-kick">Driving with Spinr</span>
          <h1 className="sp-display sp-h2" tabIndex={-1} ref={headingRef}>
            {heading}
          </h1>
        </Reveal>
        {children}
      </div>
    </section>
  )
}
