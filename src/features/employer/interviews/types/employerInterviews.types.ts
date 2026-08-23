import type { KeyValueField } from "@/lib/keyValue"
import type {
  ApplicationSnapshot,
  ApplicationStatus,
} from "@/features/employer/applicants/types/employerApplicants.types"

export type InterviewType = "hr" | "technical" | "final"
export type InterviewMode = "online" | "on_site"
export type InterviewStatus =
  | "scheduled"
  | "confirmed"
  | "rescheduled"
  | "completed"
  | "cancelled"
  | "no_show"
  | "evaluated"
export type InterviewAttendanceStatus = "pending" | "present" | "absent" | "excused"
export type InterviewRecommendation = "advance" | "hold" | "reject"

export interface InterviewActor {
  id?: string | number
  name?: string
  role?: KeyValueField
}

export interface EmployerInterviewAllowedActions {
  update?: boolean
  reschedule?: boolean
  cancel?: boolean
  attendance?: boolean
  no_show?: boolean
  complete?: boolean
  evaluate?: boolean
  view_history?: boolean
  join_video?: boolean
}

export interface InterviewCandidateSummary {
  name?: string
  email?: string
  headline?: string
  city?: string
}

export interface InterviewJobPostingReference {
  id?: string | number
  title?: string
}

export interface InterviewApplicationReference {
  id: string | number
  status?: ApplicationStatus | KeyValueField
  candidate_summary?: InterviewCandidateSummary
  submitted_snapshot?: ApplicationSnapshot
  job_posting?: InterviewJobPostingReference
  allowed_actions?: string[]
}

export interface EmployerInterviewEvaluationItem {
  id?: string | number
  criterion: string
  score: number
  comment?: string | null
  sort_order?: number
  created_at?: string
  updated_at?: string
}

export interface EmployerInterviewEvaluation {
  id?: string | number
  interview_id?: string | number
  evaluated_by_user_id?: string | number
  evaluated_by?: InterviewActor
  recommendation?: KeyValueField
  overall_comment?: string | null
  evaluated_at?: string | null
  items?: EmployerInterviewEvaluationItem[]
  created_at?: string
  updated_at?: string
}

export interface EmployerInterview {
  id: string | number
  job_application_id?: string | number
  application_id?: string | number
  type?: KeyValueField
  interview_type?: KeyValueField
  mode?: KeyValueField
  interview_mode?: KeyValueField
  status?: KeyValueField
  state?: KeyValueField
  scheduled_start_at?: string
  scheduled_end_at?: string
  scheduled_at?: string
  ends_at?: string
  duration_minutes?: number
  location_text?: string | null
  location?: string | null
  meeting_link?: string | null
  video_provider?: string | null
  embedded_video_available?: boolean
  candidate_message?: string | null
  internal_note?: string | null
  note?: string | null
  notes?: string | null
  completion_note?: string | null
  cancellation_reason?: string | null
  candidate_confirmation_status?: KeyValueField
  candidate_attendance_status?: KeyValueField
  interviewer_attendance_status?: KeyValueField
  attendance_note?: string | null
  scheduled_by_user_id?: string | number
  confirmed_by_user_id?: string | number | null
  completed_by_user_id?: string | number | null
  cancelled_by_user_id?: string | number | null
  attendance_recorded_by_user_id?: string | number | null
  confirmed_at?: string | null
  completed_at?: string | null
  cancelled_at?: string | null
  attendance_recorded_at?: string | null
  evaluation?: EmployerInterviewEvaluation | null
  status_history?: EmployerInterviewHistoryItem[]
  schedule_history?: EmployerInterviewScheduleHistoryItem[]
  job_application?: InterviewApplicationReference
  allowed_actions?: EmployerInterviewAllowedActions | string[] | null
  permissions?: Partial<
    Record<"VIEW_INTERVIEWS" | "MANAGE_INTERVIEWS" | "EVALUATE_INTERVIEWS", boolean>
  >
}

export interface EmployerInterviewInput {
  type: InterviewType
  mode: InterviewMode
  scheduled_start_at: string
  scheduled_end_at: string
  duration_minutes?: number
  meeting_link?: string | null
  video_provider?: "livekit" | null
  location_text?: string | null
  candidate_message?: string
  internal_note?: string
}

export interface EmployerInterviewUpdateInput {
  type?: InterviewType
  candidate_message?: string | null
  internal_note?: string | null
}

export interface EmployerInterviewCompleteInput {
  completion_note?: string
}

export interface EmployerInterviewEvaluateInput {
  recommendation: InterviewRecommendation
  overall_comment?: string
  items: EmployerInterviewEvaluationItem[]
}

export interface EmployerInterviewRescheduleInput {
  mode: InterviewMode
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
  candidate_status?: InterviewAttendanceStatus
  interviewer_status?: InterviewAttendanceStatus
  note?: string | null
}

export interface EmployerInterviewNoShowInput {
  party: "candidate" | "interviewer" | "both"
  reason: string
}

export interface EmployerInterviewHistoryItem {
  id: string | number
  interview_id?: string | number
  from_status?: KeyValueField | null
  to_status?: KeyValueField | null
  reason?: string | null
  metadata?: Record<string, unknown> | null
  changed_by?: InterviewActor
  created_at?: string
}

export interface EmployerInterviewScheduleHistoryItem {
  id: string | number
  interview_id?: string | number
  previous_start_at?: string | null
  previous_end_at?: string | null
  new_start_at?: string | null
  new_end_at?: string | null
  previous_mode?: KeyValueField | null
  new_mode?: KeyValueField | null
  previous_meeting_link?: string | null
  new_meeting_link?: string | null
  previous_location_text?: string | null
  new_location_text?: string | null
  reason?: string | null
  changed_by?: InterviewActor
  created_at?: string
}
