export interface EmployerInterview {
  id: string | number
  application_id?: string | number
  type?: string
  interview_type?: string
  mode?: "online" | "on_site" | string
  scheduled_at?: string
  scheduled_start_at?: string
  scheduled_end_at?: string
  duration_minutes?: number
  interview_mode?: string
  meeting_link?: string | null
  location_text?: string | null
  location?: string | null
  status?: string
  notes?: string | null
  candidate_message?: string | null
  internal_note?: string | null
  completion_note?: string | null
  recommendation?: string | null
  overall_comment?: string | null
  evaluation_items?: EmployerInterviewEvaluationItem[]
  created_at?: string
  updated_at?: string
  candidate?: {
    id?: string | number
    name?: string
    full_name?: string
    email?: string
  }
  job?: {
    id?: string | number
    title?: string
  }
}

export interface EmployerInterviewEvaluationItem {
  criterion?: string
  score?: number
  comment?: string
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

export interface EmployerInterviewUpdateInput {
  type?: string
  candidate_message?: string | null
  internal_note?: string | null
}

export interface EmployerInterviewCompleteInput {
  completion_note?: string
}

export interface EmployerInterviewEvaluateInput {
  recommendation: string
  overall_comment?: string
  items: EmployerInterviewEvaluationItem[]
}

export interface EmployerInterviewRescheduleInput {
  mode: "online" | "on_site"
  scheduled_start_at: string
  scheduled_end_at: string
  meeting_link?: string | null
  location_text?: string | null
  reason: string
}

export interface EmployerInterviewCancelInput {
  reason: string
  candidate_message?: string | null
}

export interface EmployerInterviewAttendanceInput {
  candidate_status?: "present" | "absent"
  interviewer_status?: "present" | "absent"
  note?: string | null
}

export interface EmployerInterviewNoShowInput {
  party: "candidate" | "interviewer"
  reason: string
}

export interface EmployerInterviewHistoryItem {
  id: string | number
  status?: string
  from_status?: string | null
  to_status?: string | null
  reason?: string | null
  actor?: { id?: string | number; name?: string }
  created_at?: string
}

export interface EmployerInterviewScheduleHistoryItem {
  id: string | number
  scheduled_start_at?: string
  scheduled_end_at?: string
  mode?: string
  meeting_link?: string | null
  location_text?: string | null
  reason?: string | null
  actor?: { id?: string | number; name?: string }
  created_at?: string
}
