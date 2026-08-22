import type { NotificationRecordBase } from "@/shared/notifications/types"

export interface EmployerNotification extends NotificationRecordBase {}

export interface EmployerUnreadCount {
  count: number
  unread_count?: number
}
