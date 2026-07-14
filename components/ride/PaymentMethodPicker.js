'use client'

// Saved-card selector for web booking. Cards come from GET /payments/cards
// (a demo card in non-Stripe environments); adding a card goes through
// AddCardDialog (Stripe Elements).

import { useCallback, useEffect, useState } from 'react'
import { CreditCard, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { apiFetch } from '@/lib/spinr-api'
import AddCardDialog from '@/components/ride/AddCardDialog'

export default function PaymentMethodPicker({ selectedId, onSelect }) {
  const [cards, setCards] = useState(null)
  const [error, setError] = useState(null)
  const [addOpen, setAddOpen] = useState(false)

  const load = useCallback(async () => {
    try {
      const rows = await apiFetch('/api/v1/payments/cards')
      const list = Array.isArray(rows) ? rows : rows?.cards || []
      setCards(list)
      return list
    } catch (err) {
      setError(err.message)
      setCards([])
      return []
    }
  }, [])

  useEffect(() => {
    load().then((list) => {
      const preferred = list.find((c) => c.is_default) || list[0]
      if (preferred) onSelect?.(preferred.id)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load])

  if (cards === null) {
    return <p className="text-sm text-gray-500">Loading payment methods…</p>
  }

  return (
    <div className="space-y-2">
      {error && <p className="text-sm text-red-600">{error}</p>}
      {cards.map((card) => (
        <button
          key={card.id}
          type="button"
          onClick={() => onSelect?.(card.id)}
          className={cn(
            'w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-colors',
            selectedId === card.id
              ? 'border-primary ring-1 ring-primary bg-red-50/50'
              : 'border-gray-200 hover:border-gray-300'
          )}
        >
          <CreditCard className="h-5 w-5 text-gray-500 shrink-0" />
          <span className="flex-1 text-sm font-medium">
            {card.brand} •••• {card.last4}
          </span>
          <span className="text-xs text-gray-400">
            {card.exp_month}/{String(card.exp_year).slice(-2)}
          </span>
        </button>
      ))}
      {cards.length === 0 && !error && (
        <p className="text-sm text-gray-500">No saved cards yet — add one to book.</p>
      )}
      <Button variant="outline" size="sm" className="gap-1" onClick={() => setAddOpen(true)}>
        <Plus className="h-4 w-4" /> Add card
      </Button>
      <AddCardDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSaved={async (card) => {
          const list = await load()
          const saved = list.find((c) => c.id === card?.id) || card
          if (saved?.id) onSelect?.(saved.id)
        }}
      />
    </div>
  )
}
