export interface LocalizedOption {
  key?: string | null
  value?: string | null
}

export type LocalizedOptionField = LocalizedOption | null

interface AdminApplicationPerson {
  id?: string | number
  name?: string
  full_name?: string
  first_name?: string
  last_name?: string
  email?: string
  user?: AdminApplicationPerson
  profile?: {
    name?: string
    full_name?: string
    first_name?: string
    last_name?: string
    email?: string
  }
}

export interface AdminApplicationRecord {
  id: string | number
  status: string
  match_score?: number | null
  matching_score?: number | null
  created_at?: string
  applied_at?: string
  submitted_at?: string
  updated_at?: string
  candidate_name?: string | null
  candidate_email?: string | null
  job_seeker_name?: string | null
  job_seeker_email?: string | null
  applicant_name?: string | null
  applicant_email?: string | null
  candidate_user?: AdminApplicationPerson
  job_seeker_user?: AdminApplicationPerson
  applicant?: AdminApplicationPerson
  jobSeeker?: AdminApplicationPerson
  seeker?: AdminApplicationPerson
  candidate_profile?: AdminApplicationPerson
  job_seeker_profile?: AdminApplicationPerson
  profile?: AdminApplicationPerson
  candidate?: AdminApplicationPerson
  job_seeker?: AdminApplicationPerson
  user?: AdminApplicationPerson
  company?: { id?: string | number; name?: string }
  job?: {
    id?: string | number
    title?: string
    company?: { id?: string | number; name?: string }
  }
  application?: {
    candidate_name?: string | null
    candidate_email?: string | null
    job_seeker_name?: string | null
    job_seeker_email?: string | null
    applicant_name?: string | null
    applicant_email?: string | null
    candidate_user?: AdminApplicationPerson
    job_seeker_user?: AdminApplicationPerson
    applicant?: AdminApplicationPerson
    jobSeeker?: AdminApplicationPerson
    seeker?: AdminApplicationPerson
    candidate_profile?: AdminApplicationPerson
    job_seeker_profile?: AdminApplicationPerson
    profile?: AdminApplicationPerson
    candidate?: AdminApplicationPerson
    job_seeker?: AdminApplicationPerson
    user?: AdminApplicationPerson
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

export interface AdminApplicationStatusHistoryEntry {
  id: string | number
  from_status?: LocalizedOptionField
  to_status?: LocalizedOptionField
  changed_by?: {
    id?: string | number | null
    name?: string | null
    role?: LocalizedOptionField
  } | null
  changed_at?: string | null
}

export interface AdminApplicationTestEntry {
  id: string | number
  test?: { id?: string | number | null; title?: string | null } | null
  attempt_number?: number | null
  max_attempts?: number | null
  state?: LocalizedOptionField
  assigned_at?: string | null
  deadline_at?: string | null
  attempt?: {
    id?: string | number | null
    grading_status?: LocalizedOptionField
    total_score?: number | null
    max_score?: number | null
    percentage?: number | null
    started_at?: string | null
    submitted_at?: string | null
    evaluated_at?: string | null
  } | null
}

export interface AdminApplicationInterviewEntry {
  id: string | number
  type?: LocalizedOptionField
  mode?: LocalizedOptionField
  status?: LocalizedOptionField
  scheduled_at?: string | null
  scheduled_end_at?: string | null
  duration_minutes?: number | null
  evaluated?: boolean
}

export interface AdminApplicationDetailRecord extends AdminApplicationRecord {
  status_history?: AdminApplicationStatusHistoryEntry[]
  tests?: AdminApplicationTestEntry[]
  interviews?: AdminApplicationInterviewEntry[]
}
