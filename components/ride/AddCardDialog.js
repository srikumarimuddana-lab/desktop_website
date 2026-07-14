'use client'

// Save-a-card flow: POST /payments/setup-intent → Stripe Elements
// (PaymentElement) → stripe.confirmSetup → POST /payments/cards with the
// resulting payment_method_id. Raw card data never touches our servers.

import { useEffect, useState } from 'react'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { apiFetch } from '@/lib/spinr-api'
import { getStripe } from '@/lib/stripe'

function AddCardForm({ onSaved }) {
  const stripe = useStripe()
  const elements = useElements()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!stripe || !elements) return
    setBusy(true)
    setError(null)
    try {
      const { error: confirmError, setupIntent } = await stripe.confirmSetup({
        elements,
        redirect: 'if_required',
      })
      if (confirmError) {
        setError(confirmError.message)
        return
      }
      const paymentMethodId =
        typeof setupIntent.payment_method === 'string'
          ? setupIntent.payment_method
          : setupIntent.payment_method?.id
      const saved = await apiFetch('/api/v1/payments/cards', {
        method: 'POST',
        body: { payment_method_id: paymentMethodId },
      })
      toast.success('Card saved')
      onSaved?.(saved)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement options={{ terms: { card: 'never' } }} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" className="w-full" disabled={!stripe || busy}>
        {busy ? 'Saving…' : 'Save card'}
      </Button>
    </form>
  )
}

export default function AddCardDialog({ open, onOpenChange, onSaved }) {
  const [stripe, setStripe] = useState(null)
  const [clientSecret, setClientSecret] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!open) {
      setClientSecret(null)
      setError(null)
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const [stripeInstance, intent] = await Promise.all([
          getStripe(),
          apiFetch('/api/v1/payments/setup-intent', { method: 'POST', body: {} }),
        ])
        if (cancelled) return
        if (!stripeInstance || intent?.mock) {
          setError(
            'Card setup is not available right now. Please try again later or add a card in the Spinr app.'
          )
          return
        }
        setStripe(stripeInstance)
        setClientSecret(intent.client_secret)
      } catch (err) {
        if (!cancelled) setError(err.message)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a payment card</DialogTitle>
          <DialogDescription>
            Your card details go directly to Stripe — Spinr never sees the number.
          </DialogDescription>
        </DialogHeader>
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : clientSecret && stripe ? (
          <Elements stripe={stripe} options={{ clientSecret }}>
            <AddCardForm
              onSaved={(card) => {
                onOpenChange(false)
                onSaved?.(card)
              }}
            />
          </Elements>
        ) : (
          <p className="text-sm text-gray-500 py-4 text-center">Loading secure card form…</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
