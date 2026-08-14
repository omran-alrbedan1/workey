export type ActivityType =
  | "user_created"
  | "user_updated"
  | "user_deleted"
  | "company_created"
  | "company_updated"
  | "company_approved"
  | "company_rejected"
  | "company_suspended"
  | "job_created"
  | "job_updated"
  | "job_published"
  | "job_closed"
  | "application_submitted"
  | "application_status_changed"
  | "interview_scheduled"
  | "interview_completed"
  | "test_assigned"
  | "test_completed"
  | "invitation_sent"
  | "invitation_accepted"
  | "member_added"
  | "member_removed"

export interface Activity {
  id: string | number
  type: ActivityType
  title: string
  description: string
  timestamp: string
  actor?: {
    id: string | number
    name: string
    email?: string
  }
  entity?: {
    type: "user" | "company" | "job" | "application" | "interview" | "test"
    id: string | number
    name?: string
  }
  metadata?: Record<string, unknown>
}

export interface ActivityFilters {
  type?: ActivityType
  actor_id?: string | number
  entity_type?: string
  entity_id?: string | number
  from_date?: string
  to_date?: string
}

export interface ActivityListParams {
  page?: number
  per_page?: number
  filters?: ActivityFilters
}

export interface ActivityListResponse {
  data: Activity[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}
