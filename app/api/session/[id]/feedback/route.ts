import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { supabaseAdmin } from '@/lib/supabase'
import type { FeedbackFormState } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: sessionId } = await params

  let body: FeedbackFormState
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const row = {
    session_id: sessionId,
    submitted_by: session.user.email,
    clarity: body.clarity ? parseInt(body.clarity, 10) : null,
    pace_atmosphere: body.pace_atmosphere ? parseInt(body.pace_atmosphere, 10) : null,
    belonging: body.belonging ? parseInt(body.belonging, 10) : null,
    readiness: body.readiness ? parseInt(body.readiness, 10) : null,
    key_takeaway: body.key_takeaway || null,
    improvement: body.improvement || null,
  }

  const { error } = await supabaseAdmin.from('session_feedback').insert(row)

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
