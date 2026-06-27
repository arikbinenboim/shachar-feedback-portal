import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import Image from 'next/image'
import { supabasePublic } from '@/lib/supabase'
import FeedbackFormClient from '@/components/FeedbackFormClient'
import SignInButton from '@/components/SignInButton'
import type { Session } from '@/lib/types'

async function getSession(id: string): Promise<Session | null> {
  const { data } = await supabasePublic
    .from('sessions')
    .select('*')
    .eq('id', id)
    .single()
  return data ?? null
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function SessionPage({ params }: Props) {
  const { id } = await params
  const [authSession, feedbackSession] = await Promise.all([
    auth(),
    getSession(id),
  ])

  if (!feedbackSession) notFound()

  // Not authenticated → show sign-in prompt
  if (!authSession?.user?.email) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
        <div
          className="relative overflow-hidden px-6 pt-10 pb-9 text-center"
          style={{ background: 'var(--accent)' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(253,215,0,0.12) 0%, transparent 70%)' }}
          />
          <div className="relative z-10 mb-4">
            <Image
              src="/logo_0.png"
              alt='פרויקט השח"ר'
              width={200}
              height={75}
              className="mx-auto"
              style={{ maxWidth: '55%', height: 'auto' }}
              priority
            />
          </div>
          <div
            className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3"
            style={{ background: 'rgba(253,215,0,0.15)', border: '1px solid rgba(253,215,0,0.3)' }}
          >
            {feedbackSession.emoji}
          </div>
          <h1
            className="relative z-10 text-white font-black mb-2"
            style={{ fontSize: 'clamp(18px, 4vw, 26px)' }}
          >
            {feedbackSession.title}
          </h1>
        </div>

        <div className="flex items-center justify-center px-4 py-14">
          <div
            className="w-full max-w-sm rounded-2xl p-8 shadow-sm text-center"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-5"
              style={{ background: 'var(--accent-bg)' }}
            >
              🔐
            </div>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>
              נדרשת כניסה
            </h2>
            <p className="text-sm mb-7" style={{ color: 'var(--label)' }}>
              היכנסו עם חשבון Google כדי למלא את שאלון המשוב
            </p>
            <SignInButton callbackUrl={`/session/${id}`} />
          </div>
        </div>
      </div>
    )
  }

  if (!feedbackSession.is_active) {
    redirect('/')
  }

  return (
    <FeedbackFormClient
      session={feedbackSession}
      userEmail={authSession.user.email}
      userName={authSession.user.name}
    />
  )
}
