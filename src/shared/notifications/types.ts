export interface NotificationRecordBase {
  id: string | number
  type?: string
  title?: string
  message?: string
  text?: string
  body?: string
  translation_key?: string
  translationKey?: string
  translation_params?: Record<string, unknown>
  translationParams?: Record<string, unknown>
  params?: Record<string, unknown>
  data?: Record<string, unknown>
  read_at?: string | null
  is_read?: boolean
  created_at?: string
  updated_at?: string
  url?: string
  path?: string
  entity_type?: string
  entity_id?: string | number
  application_id?: string | number
  job_id?: string | number
  interview_id?: string | number
  company_id?: string | number
  user_id?: string | number
  test_id?: string | number
}

export interface UnreadCountResponse {
  count?: number
  unread_count?: number
}
