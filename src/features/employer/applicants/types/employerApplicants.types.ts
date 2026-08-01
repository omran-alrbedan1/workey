export interface EmployerApplicant {
  id: string | number
  status:
    | string
    | {
        key?: string
        value?: string
        label?: string
        name?: string
      }
  status_note?: string | null
  status_changed_by?: {
    id?: string | number
    name?: string
    role?: string
  } | null
  match_score?: number | null
  created_at?: string
  applied_at?: string
  cover_letter?: string | null
  consent_flags?: Record<string, boolean>
  screening_answers?: ApplicationScreeningAnswer[]
  job_seeker_profile?: {
    id?: string | number
    user_id?: string | number
    headline?: string
    summary?: string
    phone?: string
    location?: string
    city?: string | null
    portfolio_url?: string
    linkedin_url?: string
    github_url?: string
    name?: string
    full_name?: string
    first_name?: string
    last_name?: string
    email?: string
    user?: {
      id?: string | number
      name?: string
      email?: string
      role?: {
        key?: string
        value?: string
      }
      status?: {
        key?: string
        value?: string
      }
    }
  }
  candidate?: {
    id?: string | number
    name?: string
    full_name?: string
    first_name?: string
    last_name?: string
    email?: string
    headline?: string | null
    summary?: string
    profile?: { headline?: string | null }
    user?: {
      id?: string | number
      name?: string
      full_name?: string
      first_name?: string
      last_name?: string
      email?: string
    }
  }
  job?: { id?: string | number; title?: string }
  tests_count?: number
  interviews_count?: number
}

export interface EmployerApplicantStatusInput {
  status: string
  notes?: string
}

export interface ApplicationScreeningAnswer {
  id?: string | number
  question_id?: string | number
  question_text: string
  question_type: string
  selected_options?: Array<{ id?: string | number; text: string }>
  answer_text?: string | null
  answer_number?: number | null
  answer_boolean?: boolean | null
}

export interface EmployerTestAttempt {
  id: string | number
  assignment_id?: string | number
  test_assignment_id?: string | number
  attempt_id?: string | number
  test_attempt_id?: string | number
  status?: string
  score?: number | null
  feedback?: string | null
  deadline_at?: string | null
  due_at?: string | null
  submitted_at?: string | null
  evaluated_at?: string | null
  max_score?: number
  max_attempts?: number | null
  attempt_number?: number | null
  test?: {
    id?: string | number
    title?: string
    max_score?: number
  }
}

export interface EmployerTestEvaluationInput {
  score: number
  feedback?: string
}

export interface EmployerInterviewInput {
  type: string
  mode: "online" | "on_site"
  scheduled_start_at: string
  scheduled_end_at: string
  meeting_link?: string | null
  location_text?: string | null
  candidate_message?: string
  internal_note?: string
}

export interface EmployerInterviewEvaluationInput {
  overall_score: number
  notes: string
  items: unknown[]
}

export interface ApplicationInternalNote {
  id: string | number
  application_id?: string | number
  body?: string | null
  version: number
  is_deleted?: boolean
  author?: {
    id?: string | number
    name?: string
  }
  created_at?: string
  updated_at?: string
}

export interface ApplicationInternalNoteInput {
  body: string
}

export interface ApplicationInternalNoteUpdateInput {
  body?: string
  version: number
}

export interface ApplicationInternalNoteRevision {
  id: string | number
  note_id?: string | number
  body?: string | null
  version: number
  actor?: {
    id?: string | number
    name?: string
  }
  created_at?: string
}

export interface InformationRequestItem {
  id?: string | number
  label: string
  description?: string | null
  is_required?: boolean
}

export interface InformationRequestResponse {
  id: string | number
  information_request_id: string | number
  response_text?: string | null
  attachments?: InformationRequestAttachment[]
  submitted_at?: string
}

export interface InformationRequestAttachment {
  id: string | number
  file_name: string
  file_size?: number
  file_type?: string
}

export interface InformationRequest {
  id: string | number
  application_id?: string | number
  message: string
  status?: "pending" | "submitted" | "cancelled" | string
  due_at?: string | null
  requested_items: InformationRequestItem[]
  response?: InformationRequestResponse | null
  created_at?: string
  updated_at?: string
}

export interface InformationRequestInput {
  message: string
  requested_items: InformationRequestItem[]
  due_at?: string | null
}

export interface InformationRequestUpdateInput {
  message?: string
  requested_items?: InformationRequestItem[]
  due_at?: string | null
}

export interface CancelInformationRequestInput {
  reason: string
}
