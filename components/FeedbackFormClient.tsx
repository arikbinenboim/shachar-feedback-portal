'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import { FeedbackFormState, initialFeedbackState, Session } from '@/lib/types'

interface Props {
  session: Session
  userEmail: string
  userName?: string | null
}

function ScaleInput({
  value,
  onChange,
  minLabel,
  maxLabel,
  error,
}: {
  value: string
  onChange: (v: string) => void
  minLabel?: string
  maxLabel?: string
  error?: boolean
}) {
  return (
    <div>
      <div className="flex gap-2 flex-wrap">
        {[1, 2, 3, 4, 5].map((n) => {
          const selected = value === String(n)
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(String(n))}
              className="w-12 h-12 rounded-xl font-bold text-sm transition-all"
              style={{
                background: selected ? 'var(--accent)' : 'var(--surface2)',
                border: selected
                  ? '1px solid var(--accent)'
                  : error
                  ? '1px solid var(--danger)'
                  : '1px solid var(--border2)',
                color: selected ? 'white' : 'var(--label)',
              }}
            >
              {n}
            </button>
          )
        })}
      </div>
      {(minLabel || maxLabel) && (
        <div
          className="flex justify-between mt-2 text-xs"
          style={{ color: 'var(--sublabel)' }}
        >
          <span>1 · {minLabel}</span>
          <span>5 · {maxLabel}</span>
        </div>
      )}
      {error && (
        <p className="text-xs mt-1 font-medium" style={{ color: 'var(--danger)' }}>
          נא לבחור דירוג
        </p>
      )}
    </div>
  )
}

function Question({
  number,
  label,
  required,
  children,
}: {
  number: number
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className="rounded-2xl p-6 mb-4 shadow-sm"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRight: '4px solid var(--accent)',
      }}
    >
      <div className="mb-4">
        <span
          className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold ml-2"
          style={{ background: 'var(--accent)', color: 'white' }}
        >
          {number}
        </span>
        <span className="font-bold text-base" style={{ color: 'var(--text)' }}>
          {label}
          {required && (
            <span className="mr-1" style={{ color: 'var(--gold-dark)' }}>
              *
            </span>
          )}
        </span>
      </div>
      {children}
    </div>
  )
}

export default function FeedbackFormClient({ session, userEmail, userName }: Props) {
  const [form, setForm] = useState<FeedbackFormState>(initialFeedbackState)
  const [errors, setErrors] = useState<Partial<Record<keyof FeedbackFormState, boolean>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [focused, setFocused] = useState<string | null>(null)

  const setVal = (field: keyof FeedbackFormState, v: string) =>
    setForm((prev) => ({ ...prev, [field]: v }))

  const validate = () => {
    const errs: Partial<Record<keyof FeedbackFormState, boolean>> = {}
    const required: (keyof FeedbackFormState)[] = [
      'clarity', 'pace_atmosphere', 'belonging', 'readiness', 'key_takeaway',
    ]
    for (const f of required) {
      if (!form[f].trim()) errs[f] = true
    }
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setIsSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch(`/api/session/${session.id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Server error')
      window.location.href = `/session/${session.id}/success`
    } catch {
      setSubmitError('שגיאה בשליחת המשוב. נסה שוב.')
      setIsSubmitting(false)
    }
  }

  const inputStyle = (field: string, isError?: boolean) => ({
    background: 'var(--surface2)',
    border: `1px solid ${isError ? 'var(--danger)' : focused === field ? 'var(--accent)' : 'var(--border2)'}`,
    boxShadow: focused === field ? '0 0 0 3px rgba(31,34,85,0.10)' : 'none',
    color: 'var(--text)',
    fontFamily: "'Heebo', sans-serif",
    outline: 'none',
    width: '100%',
    borderRadius: 12,
    padding: '12px 14px',
    fontSize: 15,
    resize: 'vertical' as const,
  })

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Sticky header */}
      <div
        className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between gap-4"
        style={{ background: 'var(--accent)' }}
      >
        <Image
          src="/logo_0.png"
          alt='פרויקט השח"ר'
          width={130}
          height={50}
          style={{ height: 38, width: 'auto' }}
        />
        <div className="flex items-center gap-3">
          <span className="text-sm hidden sm:block" style={{ color: 'rgba(255,255,255,0.65)' }}>
            {userName ?? userEmail}
          </span>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg"
            style={{ color: 'rgba(255,255,255,0.75)', background: 'rgba(255,255,255,0.1)' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            יציאה
          </button>
        </div>
      </div>

      {/* Session hero */}
      <div
        className="relative overflow-hidden px-6 pt-8 pb-7 text-center"
        style={{ background: 'var(--accent)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(253,215,0,0.10) 0%, transparent 70%)' }}
        />
        <div
          className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3"
          style={{ background: 'rgba(253,215,0,0.15)', border: '1px solid rgba(253,215,0,0.3)' }}
        >
          {session.emoji}
        </div>
        <h1
          className="relative z-10 text-white font-black mb-1"
          style={{ fontSize: 'clamp(18px, 4vw, 26px)' }}
        >
          {session.title}
        </h1>
        {session.description && (
          <p className="relative z-10 text-sm mt-2 mx-auto" style={{ color: '#c7caec', maxWidth: 480 }}>
            {session.description}
          </p>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto px-4 pt-6 pb-16" noValidate>

        <Question number={1} label="עד כמה התוכן היום היה ברור ומובן?" required>
          <ScaleInput
            value={form.clarity}
            onChange={(v) => setVal('clarity', v)}
            minLabel="ברור לחלוטין"
            maxLabel="לא היה ברור"
            error={errors.clarity}
          />
        </Question>

        <Question number={2} label="איך היה הקצב והאווירה של המפגש?" required>
          <ScaleInput
            value={form.pace_atmosphere}
            onChange={(v) => setVal('pace_atmosphere', v)}
            minLabel="מעולה"
            maxLabel="לא עבד בשבילי"
            error={errors.pace_atmosphere}
          />
        </Question>

        <Question number={3} label="עד כמה אתה מרגיש שייך לפרויקט ולחזון שלו?" required>
          <ScaleInput
            value={form.belonging}
            onChange={(v) => setVal('belonging', v)}
            minLabel="מאוד מחובר"
            maxLabel="לא חיבר אותי"
            error={errors.belonging}
          />
        </Question>

        <Question number={4} label="עד כמה אתה מרגיש מוכן להמשיך למודולים ולתרגילים הבאים?" required>
          <ScaleInput
            value={form.readiness}
            onChange={(v) => setVal('readiness', v)}
            minLabel="מוכן ונרגש"
            maxLabel="לא מוכן"
            error={errors.readiness}
          />
        </Question>

        <Question number={5} label="מה הדבר הכי משמעותי שלקחת מהמפגש היום?" required>
          <p className="text-xs mb-3" style={{ color: 'var(--sublabel)' }}>
            אפשר במשפט או שניים — כל תשובה עוזרת.
          </p>
          <textarea
            value={form.key_takeaway}
            onChange={(e) => setVal('key_takeaway', e.target.value)}
            onFocus={() => setFocused('key_takeaway')}
            onBlur={() => setFocused(null)}
            rows={3}
            style={{
              ...inputStyle('key_takeaway', errors.key_takeaway),
              minHeight: 90,
            }}
          />
          {errors.key_takeaway && (
            <p className="text-xs mt-1 font-medium" style={{ color: 'var(--danger)' }}>
              שדה חובה
            </p>
          )}
        </Question>

        <Question number={6} label="מה היית משנה או משפר?">
          <p className="text-xs mb-3" style={{ color: 'var(--sublabel)' }}>
            אופציונלי
          </p>
          <textarea
            value={form.improvement}
            onChange={(e) => setVal('improvement', e.target.value)}
            onFocus={() => setFocused('improvement')}
            onBlur={() => setFocused(null)}
            rows={3}
            style={{ ...inputStyle('improvement'), minHeight: 90 }}
          />
        </Question>

        {submitError && (
          <div
            className="mb-4 px-4 py-3 rounded-xl text-sm font-medium"
            style={{ background: '#fef2f2', border: '1px solid #fecaca', color: 'var(--danger)' }}
          >
            {submitError}
          </div>
        )}

        {Object.keys(errors).length > 0 && (
          <div
            className="mb-4 px-4 py-3 rounded-xl text-sm font-medium"
            style={{ background: '#fef2f2', border: '1px solid #fecaca', color: 'var(--danger)' }}
          >
            נא לענות על כל שאלות החובה (1–5)
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl font-bold text-base transition-all shadow-md hover:shadow-lg active:scale-[0.99] disabled:opacity-60"
          style={{ background: 'var(--accent)', color: 'white' }}
        >
          {isSubmitting ? '⏳ שולח...' : '✅ שלח משוב'}
        </button>
      </form>
    </div>
  )
}
