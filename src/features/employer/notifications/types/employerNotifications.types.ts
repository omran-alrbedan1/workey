export interface EmployerNotification {
  id: string | number
  type?: string
  title?: string
  message?: string
  read_at?: string | null
  is_read?: boolean
  created_at?: string
  updated_at?: string
  data?: Record<string, unknown>
  application_id?: string | number
  job_id?: string | number
  interview_id?: string | number
}

export interface EmployerUnreadCount {
  count: number
}
