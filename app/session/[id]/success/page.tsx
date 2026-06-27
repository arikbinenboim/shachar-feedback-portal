import Image from 'next/image'
import Link from 'next/link'
import { supabasePublic } from '@/lib/supabase'
import type { Session } from '@/lib/types'

async function getSession(id: string): Promise<Pick<Session, 'title' | 'emoji'> | null> {
  const { data } = await supabasePublic
    .from('sessions')
    .select('title, emoji')
    .eq('id', id)
    .single()
  return data ?? null
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function SuccessPage({ params }: Props) {
  const { id } = await params
  const session = await getSession(id)

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div
        className="px-6 py-5 flex items-center justify-center"
        style={{ background: 'var(--accent)' }}
      >
        <Image
          src="/logo_0.png"
          alt='פרויקט השח"ר'
          width={160}
          height={60}
          style={{ height: 44, width: 'auto' }}
        />
      </div>

      <div className="flex items-center justify-center px-4 py-16">
        <div
          className="w-full max-w-md rounded-2xl p-10 shadow-sm text-center"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-5"
            style={{ background: '#f0fdf4', border: '2px solid #bbf7d0' }}
          >
            ✅
          </div>
          <h1 className="text-2xl font-black mb-2" style={{ color: 'var(--accent)' }}>
            תודה על המשוב!
          </h1>
          {session && (
            <p className="text-sm mb-1 font-medium" style={{ color: 'var(--label)' }}>
              {session.emoji} {session.title}
            </p>
          )}
          <p className="text-sm leading-relaxed mt-3 mb-8" style={{ color: 'var(--label)' }}>
            המשוב שלך נשמר. הוא עוזר לנו לשפר כל מפגש ומפגש.
          </p>
          <Link
            href="/"
            className="block w-full py-3 rounded-xl font-bold text-base transition-all"
            style={{ background: 'var(--accent)', color: 'white' }}
          >
            חזרה לכל המפגשים
          </Link>
        </div>
      </div>
    </div>
  )
}
