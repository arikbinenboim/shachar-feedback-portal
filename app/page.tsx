import Image from 'next/image'
import Link from 'next/link'
import { supabasePublic } from '@/lib/supabase'
import type { Session } from '@/lib/types'

// Thumbnail color palettes cycling per session index
const PALETTES = [
  { from: '#1f2255', to: '#3d4178' },
  { from: '#0f4c81', to: '#1a6fa8' },
  { from: '#1a472a', to: '#2d6a4f' },
  { from: '#4a1942', to: '#6b2d6b' },
  { from: '#7b3f00', to: '#a85a00' },
  { from: '#003049', to: '#0a4f6e' },
]

async function getSessions(): Promise<Session[]> {
  const { data, error } = await supabasePublic
    .from('sessions')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching sessions:', error)
    return []
  }
  return data ?? []
}

function SessionCard({ session, index }: { session: Session; index: number }) {
  const palette = PALETTES[index % PALETTES.length]

  return (
    <Link href={`/session/${session.id}`} className="group block">
      <div
        className="rounded-2xl overflow-hidden shadow-sm transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-1"
        style={{ border: '1px solid var(--border)' }}
      >
        {/* Thumbnail */}
        <div
          className="relative h-44 flex flex-col items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${palette.from}, ${palette.to})`,
          }}
        >
          {/* Glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 50% 20%, rgba(253,215,0,0.15) 0%, transparent 65%)',
            }}
          />
          {/* Emoji badge */}
          <div
            className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-3 shadow-lg"
            style={{ background: 'rgba(253,215,0,0.15)', border: '1px solid rgba(253,215,0,0.3)' }}
          >
            {session.emoji}
          </div>
          {/* Status badge */}
          <div
            className="relative z-10 px-3 py-1 rounded-full text-xs font-semibold"
            style={
              session.is_active
                ? { background: 'rgba(253,215,0,0.2)', color: '#fdd700', border: '1px solid rgba(253,215,0,0.4)' }
                : { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.15)' }
            }
          >
            {session.is_active ? '● פתוח למילוי' : 'סגור'}
          </div>
        </div>

        {/* Card body */}
        <div className="p-5" style={{ background: 'var(--surface)' }}>
          <h2
            className="font-bold text-base leading-snug mb-1 group-hover:text-[#1f2255] transition-colors"
            style={{ color: 'var(--text)' }}
          >
            {session.title}
          </h2>
          {session.date && (
            <p className="text-xs mb-2" style={{ color: 'var(--sublabel)' }}>
              {new Date(session.date).toLocaleDateString('he-IL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}
          {session.description && (
            <p
              className="text-sm leading-relaxed line-clamp-2"
              style={{ color: 'var(--label)' }}
            >
              {session.description}
            </p>
          )}
          {session.is_active && (
            <div
              className="mt-4 w-full py-2.5 rounded-xl text-sm font-bold text-center transition-colors"
              style={{ background: 'var(--accent)', color: 'white' }}
            >
              מלא משוב ←
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default async function LandingPage() {
  const sessions = await getSessions()

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Hero */}
      <div
        className="relative overflow-hidden px-6 pt-10 pb-9 text-center"
        style={{ background: 'var(--accent)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(253,215,0,0.12) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 mb-4">
          <Image
            src="/logo_0.png"
            alt='פרויקט השח"ר'
            width={240}
            height={90}
            className="mx-auto"
            style={{ maxWidth: '65%', height: 'auto' }}
            priority
          />
        </div>
        <div
          className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-3"
          style={{
            background: 'rgba(253,215,0,0.12)',
            border: '1px solid rgba(253,215,0,0.35)',
            color: 'var(--gold)',
          }}
        >
          💬 שאלוני משוב
        </div>
        <h1
          className="relative z-10 text-white font-black mb-2"
          style={{ fontSize: 'clamp(20px, 5vw, 32px)' }}
        >
          משובי מפגשים — פרויקט השח&quot;ר
        </h1>
        <p className="relative z-10 text-sm" style={{ color: '#c7caec' }}>
          בחרו את המפגש שהשתתפתם בו ומלאו את שאלון המשוב
        </p>
      </div>

      {/* Sessions grid */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        {sessions.length === 0 ? (
          <div className="text-center py-20" style={{ color: 'var(--sublabel)' }}>
            <div className="text-4xl mb-3">📭</div>
            <p className="text-sm">אין מפגשים פעילים כרגע</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sessions.map((session, i) => (
              <SessionCard key={session.id} session={session} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Partner logos */}
      <div
        className="flex items-center justify-center gap-10 flex-wrap px-6 pb-10"
        style={{ opacity: 0.7 }}
      >
        <Image src="/logo_1.png" alt="partner" width={80} height={46} style={{ height: 40, width: 'auto' }} />
        <Image src="/logo_2.png" alt="partner" width={80} height={46} style={{ height: 40, width: 'auto' }} />
      </div>
    </div>
  )
}
