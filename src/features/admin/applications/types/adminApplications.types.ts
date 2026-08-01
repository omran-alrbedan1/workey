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
