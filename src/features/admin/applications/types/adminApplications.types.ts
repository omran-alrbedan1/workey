export interface AdminApplicationRecord {
  id: string | number
  status: string
  match_score?: number | null
  matching_score?: number | null
  created_at?: string
  applied_at?: string
  submitted_at?: string
  candidate?: { id?: string | number; name?: string; email?: string }
  job_seeker?: { id?: string | number; name?: string; email?: string }
  user?: { id?: string | number; name?: string; email?: string }
  company?: { id?: string | number; name?: string }
  job?: {
    id?: string | number
    title?: string
    company?: { id?: string | number; name?: string }
  }
  application?: {
    candidate?: { id?: string | number; name?: string; email?: string }
    job_seeker?: { id?: string | number; name?: string; email?: string }
    user?: { id?: string | number; name?: string; email?: string }
    company?: { id?: string | number; name?: string }
    job?: {
      id?: string | number
      title?: string
      company?: { id?: string | number; name?: string }
    }
  }
  tests_count?: number
  interviews_count?: number
}
