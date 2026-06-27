export interface Session {
  id: string
  created_at: string
  title: string
  description: string | null
  date: string | null
  emoji: string
  color: string
  is_active: boolean
}

export interface FeedbackFormState {
  clarity: string
  pace_atmosphere: string
  belonging: string
  readiness: string
  key_takeaway: string
  improvement: string
}

export const initialFeedbackState: FeedbackFormState = {
  clarity: '',
  pace_atmosphere: '',
  belonging: '',
  readiness: '',
  key_takeaway: '',
  improvement: '',
}
