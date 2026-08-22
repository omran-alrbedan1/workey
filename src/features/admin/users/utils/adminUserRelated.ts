import { valueOf } from "@/lib/keyValue"
import type { KeyValueField } from "@/lib/keyValue"

import type {
  AdminUserApplicationItem,
  AdminUserInterviewItem,
  AdminUserJobItem,
  AdminUserTestAssignmentItem,
} from "../types/adminUsers.types"

export interface AdminUserRelatedItemView {
  id: string | number
  title: string
  subtitle?: string | null
  status?: KeyValueField
  date?: string | null
}

export function mapApplicationItem(
  item: AdminUserApplicationItem,
  emptyLabel: string,
): AdminUserRelatedItemView {
  return {
    id: item.id,
    title: item.job?.title || emptyLabel,
    subtitle: item.company?.name ?? null,
    status: item.status,
    date: item.applied_at ?? null,
  }
}

export function mapJobItem(
  item: AdminUserJobItem,
  emptyLabel: string,
): AdminUserRelatedItemView {
  const subtitle = [
    item.company?.name,
    item.location,
    typeof item.applications_count === "number"
      ? `${item.applications_count}`
      : null,
  ]
    .filter(Boolean)
    .join(" · ")
  return {
    id: item.id,
    title: item.title || emptyLabel,
    subtitle: subtitle || null,
    status: item.status,
    date: item.created_at ?? null,
  }
}

export function mapInterviewItem(
  item: AdminUserInterviewItem,
): AdminUserRelatedItemView {
  return {
    id: item.id,
    title: item.job?.title || valueOf(item.type),
    subtitle: [
      valueOf(item.type),
      valueOf(item.mode),
      item.duration_minutes != null ? `${item.duration_minutes}m` : null,
      item.company?.name,
    ]
      .filter(Boolean)
      .join(" · ") || null,
    status: item.status,
    date: item.scheduled_at ?? null,
  }
}

export function mapTestAssignmentItem(
  item: AdminUserTestAssignmentItem,
  emptyLabel: string,
): AdminUserRelatedItemView {
  const percentage = item.attempt?.percentage
  return {
    id: item.id,
    title: item.test?.title || emptyLabel,
    subtitle: [
      item.company?.name,
      percentage != null ? `${percentage}%` : null,
    ]
      .filter(Boolean)
      .join(" · ") || null,
    status: item.state,
    date: item.assignment?.deadline_at ?? item.assignment?.assigned_at ?? null,
  }
}
