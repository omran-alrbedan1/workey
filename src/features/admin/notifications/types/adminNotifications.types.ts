export interface AdminNotificationRecord {
  id: string | number
  type?: string
  title?: string
  message?: string
  data?: Record<string, unknown>
  read_at?: string | null
  created_at?: string
}
export interface UnreadCountResponse {
  count?: number
  unread_count?: number
}
