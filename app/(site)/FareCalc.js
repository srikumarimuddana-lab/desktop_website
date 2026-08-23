'use client'

import { useState } from 'react'

/*
 * The SPINRULATOR — a physical-feeling keypad, in the spirit of the
 * retro calculator on the reference site. Enter a fare, see who keeps what.
 *
 * TYPICAL_COMMISSION is an industry range for commission-taking platforms,
 * not a quoted figure from any named competitor.
 */
const TYPICAL_COMMISSION = 0.25

export default function FareCalc() {
  const [raw, setRaw] = useState('24')     // a typical Saskatoon fare
  const [mode, setMode] = useState('ride') // 'ride' | 'month'
  const [pressed, setPressed] = useState(null)

  const fare = Number(raw || 0)
  const rides = mode === 'month' ? 90 : 1
  const gross = fare * rides

  const spinrDriver = gross                       // 0% commission
  const otherDriver = gross * (1 - TYPICAL_COMMISSION)
  const difference = spinrDriver - otherDriver
  const riderFee = 1 * rides

  const money = (n) =>
    n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 })

  function key(k) {
    setPressed(k)
    setTimeout(() => setPressed(null), 130)
    if (k === 'clear') return setRaw('')
    if (k === 'back') return setRaw((v) => v.slice(0, -1))
    if (k === '.') return setRaw((v) => (v.includes('.') ? v : (v || '0') + '.'))
    setRaw((v) => (v.length >= 6 ? v : (v === '0' ? '' : v) + k))
  }

  const KEYS = [
    ['7', '8', '9', 'back'],
    ['4', '5', '6', 'clear'],
    ['1', '2', '3', '.'],
    ['0', '00'],
  ]

  return (
    <div className="sp-calcwrap">
      {/* ── Readout side ─────────────────────────── */}
      <div className="sp-calccopy">
        <h2 className="sp-display sp-h2">
          See what a commission
          <br />
          <span className="sp-accent">actually costs.</span>
        </h2>
        <p className="sp-lede">
          Spinr takes nothing. Elsewhere, a fifth to nearly a third of every fare
          is gone before the driver sees it.
        </p>

        <div className="sp-readout">
          <span className="sp-readout-k">Driver keeps with Spinr</span>
          <b className="sp-readout-n">{money(spinrDriver)}</b>
          <div className="sp-readout-row">
            <span>On a {TYPICAL_COMMISSION * 100}% commission platform</span>
            <b>{money(otherDriver)}</b>
          </div>
          <div className="sp-readout-row sp-readout-win">
            <span>Difference</span>
            <b>+{money(difference)}</b>
          </div>
          <p className="sp-readout-fine">
            Rider pays {money(riderFee)} in platform fees over the same
            {mode === 'month' ? ' month' : ' trip'} — flat, never a percentage.
          </p>
        </div>
      </div>

      {/* ── The machine ──────────────────────────── */}
      <div className="sp-calcvis">
        <div className="sp-machine">
          <span className="sp-screw sp-screw-1" aria-hidden="true" />
          <span className="sp-screw sp-screw-2" aria-hidden="true" />
          <span className="sp-screw sp-screw-3" aria-hidden="true" />
          <span className="sp-screw sp-screw-4" aria-hidden="true" />

          <div className="sp-machine-top">
            <span className="sp-machine-brand">SPINRULATOR</span>
            <span className="sp-leds"><i className="on" /><i /></span>
          </div>

          <div className="sp-lcd">
            <span className="sp-lcd-k">
              {mode === 'month' ? 'Average fare' : 'This fare'}
            </span>
            <div className="sp-lcd-amt">
              <b>${raw || '0'}</b>
              <span>{mode === 'month' ? '/ ride' : ''}</span>
            </div>
          </div>

          <div className="sp-modes" role="group" aria-label="Calculate for">
            <button
              type="button"
              className={mode === 'ride' ? 'on' : ''}
              aria-pressed={mode === 'ride'}
              onClick={() => setMode('ride')}
            >
              One ride
            </button>
            <button
              type="button"
              className={mode === 'month' ? 'on' : ''}
              aria-pressed={mode === 'month'}
              onClick={() => setMode('month')}
            >
              A month (90 rides)
            </button>
          </div>

          <div className="sp-keys">
            {KEYS.flat().map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => key(k)}
                className={[
                  pressed === k ? 'kp' : '',
                  k === '0' ? 'sp-k-zero' : '',
                  k === 'back' || k === 'clear' ? 'sp-k-fn' : '',
                ].join(' ')}
                aria-label={k === 'back' ? 'Backspace' : k === 'clear' ? 'Clear' : k}
              >
                {k === 'back' ? '⌫' : k === 'clear' ? 'C' : k}
              </button>
            ))}
            <button type="button" className="sp-k-go" onClick={() => setRaw(raw || '0')}>
              Total
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
