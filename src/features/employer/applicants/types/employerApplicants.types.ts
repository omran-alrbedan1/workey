import type { KeyValueField } from "@/lib/keyValue"
import type { ApplicationTestAssignmentResponse } from "@/features/employer/tests/types/employerTests.types"

// Application Status - LocalizedValue
export interface ApplicationStatus {
  id: string | number
  key: ApplicationStatusKey
  value: string
}

export type ApplicationStatusKey =
  | "submitted"
  | "under_review"
  | "shortlisted"
  | "test_pending"
  | "test_completed"
  | "interview_pending"
  | "interview_scheduled"
  | "interview_completed"
  | "final_review"
  | "accepted"
  | "rejected"
  | "withdrawn"
  | "on_hold"
  | "need_more_information"

// Application Snapshot - Candidate data at time of application
export interface ApplicationSnapshot {
  profile?: ApplicationSnapshotProfile
  cv_snapshot_id?: string | number
  cv_snapshot_path?: string
  snapshot_status?: "available" | "not_available" | "partial"
  captured_at?: string
  origin?: "initial_application" | "profile_update"
  accuracy?: "high" | "medium" | "low"
}

export interface ApplicationSnapshotProfile {
  identity?: {
    name?: string
    full_name?: string
    first_name?: string
    last_name?: string
    email?: string
    phone?: string
    headline?: string
    summary?: string
  }
  location?: {
    city?: string
    country?: string
    full_address?: string
    location_text?: string
  }
  professional_links?: Array<{ label?: string; url?: string }>
  professional?: {
    headline?: string
    summary?: string
    portfolio_url?: string
    linkedin_url?: string
    github_url?: string
    other_links?: Array<{ label?: string; url?: string }>
  }
  experiences?: Array<{
    title?: string
    company?: string
    start_date?: string
    end_date?: string
    is_current?: boolean
    description?: string
  }>
  education?: Array<{
    degree?: string
    institution?: string
    field_of_study?: string
    start_date?: string
    end_date?: string
    is_current?: boolean
  }>
  skills?: Array<{
    name?: string
    slug?: string
    icon_url?: string
  }>
  availability?: {
    status?: "immediately" | "within_1_month" | "within_3_months" | "flexible" | "not_looking"
    notice_period_days?: number | null
  }
}

// Screening Answers - Fixed contract
export interface ApplicationScreeningAnswer {
  id?: string | number
  question_id?: string | number
  question_text: string
  question_type: KeyValueField
  is_required: boolean
  sort_order: number
  answer: {
    value: string | number | boolean | null
    selected_options: Array<{
      option_text: string
    }>
  }
}

// Job Posting Reference
export interface JobPostingReference {
  id: string | number
  title: string
}

// Main Application Types
export interface EmployerApplicantListItem {
  id: string | number
  job_posting: JobPostingReference
  status: ApplicationStatus
  applied_at?: string
  created_at?: string
  candidate_summary?: {
    name?: string
    email?: string
    headline?: string
    city?: string
  }
  job_seeker_profile?: {
    id?: string | number
    headline?: string | null
    summary?: string | null
    phone?: string | null
    location?: string | null
    name?: string
    user?: {
      id?: string | number
      name?: string
      email?: string
    }
  }
  match_score?: number | null
  matching_score?: number | null
  tests_count?: number | null
  interviews_count?: number | null
}

export interface EmployerApplicantDetail extends EmployerApplicantListItem {
  cover_letter?: string | null
  consent_flags?: Record<string, boolean>
  screening_answers?: ApplicationScreeningAnswer[]
  submitted_snapshot?: ApplicationSnapshot
  status_history?: ApplicationStatusHistoryEntry[]
  allowed_status_transitions?: ApplicationStatus[]
  allowed_actions?: string[]
  permissions?: {
    can_view?: boolean
    can_manage?: boolean
    can_view_internal_notes?: boolean
    can_create_internal_notes?: boolean
    can_edit_internal_notes?: boolean
    can_delete_internal_notes?: boolean
    can_request_information?: boolean
    can_cancel_information_requests?: boolean
  }
  can_edit_internal_notes?: boolean
  can_delete_internal_notes?: boolean
}

// Backward compatibility alias
export type EmployerApplicant = EmployerApplicantDetail

// Status History
export interface ApplicationStatusHistoryEntry {
  id: string | number
  from_status?: ApplicationStatus | null
  to_status: ApplicationStatus
  changed_by?: {
    id: string | number
    name?: string
    role?: string | KeyValueField
  }
  note?: string | null
  changed_at: string
}

// Status Change Input - Fixed: note instead of notes
export interface ApplicationStatusChangeInput {
  status: ApplicationStatusKey
  note?: string | null
}

// Internal Notes - Updated with permission fields
export interface ApplicationInternalNote {
  id: string | number
  application_id?: string | number
  body?: string | null
  version: number
  is_edited?: boolean
  is_deleted?: boolean
  can_edit?: boolean
  can_delete?: boolean
  edit_deadline_at?: string | null
  author?: {
    id?: string | number
    name?: string
  }
  created_at?: string
  edited_at?: string
  deleted_at?: string
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

// Information Requests - Updated with proper LocalizedValue
export interface InformationRequest {
  id: string | number
  job_application_id: string | number
  message: string
  requested_items: InformationRequestItem[]
  due_at?: string | null
  status: KeyValueField
  is_expired?: boolean
  previous_application_status?: ApplicationStatus | null
  requested_by?: {
    id?: string | number
    name?: string
  }
  responded_at?: string | null
  cancelled_at?: string | null
  cancelled_by?: {
    id?: string | number
    name?: string
  }
  response?: InformationRequestResponse | null
  created_at?: string
  updated_at?: string
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
  message: string // Changed from response_text
  attachments?: InformationRequestAttachment[]
  submitted_at?: string
}

export interface InformationRequestAttachment {
  id: string | number
  original_name: string // Changed from file_name
  mime_type?: string // Changed from file_type
  extension?: string
  size_bytes: number // Changed from file_size
  download_available?: boolean
  created_at?: string
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

// Legacy types for Tests/Interviews (not changing in this task)
export type EmployerTestAttempt = ApplicationTestAssignmentResponse

export interface EmployerTestEvaluationInput {
  score: number
  feedback?: string
}

export interface EmployerInterviewInput {
  type: "hr" | "technical" | "final"
  mode: "online" | "on_site"
  scheduled_start_at: string
  scheduled_end_at: string
  duration_minutes?: number
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
