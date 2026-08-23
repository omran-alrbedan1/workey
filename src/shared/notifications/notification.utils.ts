import type { TFunction } from "i18next"
import { ROUTES } from "@/config"
import type { NotificationRecordBase } from "./types"

type NotificationScope = "admin" | "employer"

function valueFrom(record: NotificationRecordBase, keys: string[]): unknown {
  for (const key of keys) {
    if (record[key as keyof NotificationRecordBase] != null) {
      return record[key as keyof NotificationRecordBase]
    }
    if (record.data?.[key] != null) return record.data[key]
  }
  return undefined
}

function idFrom(record: NotificationRecordBase, keys: string[]): string | number | undefined {
  const value = valueFrom(record, keys)
  return typeof value === "string" || typeof value === "number" ? value : undefined
}

function internalPath(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined
  if (!value.startsWith("/") || value.startsWith("//")) return undefined
  return value
}

function normalizeTypeKey(type: string): string {
  return type.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "")
}

function fallbackTypeLabel(type: string): string {
  return type.replace(/[_.]+/g, " ").replace(/w/g, (char) => char.toUpperCase())
}

function localizedTypeKey(notification: NotificationRecordBase): string | undefined {
  return notification.type ? normalizeTypeKey(notification.type) : undefined
}

function titleFallback(notification: NotificationRecordBase, t: TFunction): string {
  const typeKey = localizedTypeKey(notification)
  if (typeKey) {
    return t(`titles.${typeKey}`, {
      defaultValue: notification.title ?? fallbackTypeLabel(typeKey),
    })
  }

  return notification.title ?? notificationTypeLabel(notification, t)
}

function messageFallback(notification: NotificationRecordBase, t: TFunction): string {
  const typeKey = localizedTypeKey(notification)
  if (typeKey) {
    return t(`messages.${typeKey}`, {
      defaultValue: notification.message ?? notification.text ?? notification.body ?? "",
    })
  }

  return notification.message ?? notification.text ?? notification.body ?? ""
}

export function isNotificationUnread(notification: NotificationRecordBase): boolean {
  return !notification.read_at && notification.is_read !== true
}

export function notificationTypeLabel(notification: NotificationRecordBase, t: TFunction): string {
  const typeKey = localizedTypeKey(notification)
  if (!typeKey) {
    return t("types.general", { defaultValue: "General" })
  }

  return t(`types.${typeKey}`, { defaultValue: fallbackTypeLabel(typeKey) })
}

export function notificationTitle(notification: NotificationRecordBase, t: TFunction): string {
  const key = notification.translation_key ?? notification.translationKey
  const params =
    notification.translation_params ?? notification.translationParams ?? notification.params

  if (key) {
    return t(key, {
      ...(params ?? {}),
      defaultValue: titleFallback(notification, t),
    })
  }

  return titleFallback(notification, t)
}

export function notificationMessage(notification: NotificationRecordBase, t: TFunction): string {
  const key = notification.translation_key ?? notification.translationKey

  if (key) {
    return t(key, {
      defaultValue: notification.message ?? notification.text ?? notification.body ?? "",
    })
  }

  return messageFallback(notification, t)
}

export function resolveNotificationTarget(
  notification: NotificationRecordBase,
  scope: NotificationScope,
): string | undefined {
  const explicitPath = internalPath(
    valueFrom(notification, ["url", "path", "link", "target_url", "targetPath"]),
  )
  if (explicitPath) return explicitPath

  const applicationId = idFrom(notification, [
    "application_id",
    "applicationId",
    "related_application_id",
    "relatedApplicationId",
  ])
  const jobId = idFrom(notification, ["job_id", "jobId", "related_job_id", "relatedJobId"])
  const interviewId = idFrom(notification, [
    "interview_id",
    "interviewId",
    "related_interview_id",
    "relatedInterviewId",
  ])
  const companyId = idFrom(notification, [
    "company_id",
    "companyId",
    "related_company_id",
    "relatedCompanyId",
  ])
  const userId = idFrom(notification, ["user_id", "userId", "related_user_id", "relatedUserId"])
  const testId = idFrom(notification, ["test_id", "testId", "related_test_id", "relatedTestId"])
  const entityType = String(
    valueFrom(notification, ["entity_type", "entityType", "related_type"]) ?? "",
  ).toLowerCase()
  const entityId = idFrom(notification, ["entity_id", "entityId", "related_id", "relatedId"])

  if (scope === "employer") {
    if (applicationId) return ROUTES.employer.applicantDetails(applicationId)
    if (interviewId) return ROUTES.employer.interviewDetails(interviewId)
    if (jobId) return ROUTES.employer.jobDetails(jobId)
    if (testId) return ROUTES.employer.testDetails(testId)
    if (entityId && entityType.includes("application"))
      return ROUTES.employer.applicantDetails(entityId)
    if (entityId && entityType.includes("interview"))
      return ROUTES.employer.interviewDetails(entityId)
    if (entityId && entityType.includes("job")) return ROUTES.employer.jobDetails(entityId)
    if (entityId && entityType.includes("test")) return ROUTES.employer.testDetails(entityId)
    return undefined
  }

  if (applicationId) return ROUTES.admin.applicationDetails(applicationId)
  if (jobId) return ROUTES.admin.jobDetails(jobId)
  if (companyId) return ROUTES.admin.companyDetails(companyId)
  if (userId) return ROUTES.admin.userDetails(userId)
  if (entityId && entityType.includes("application"))
    return ROUTES.admin.applicationDetails(entityId)
  if (entityId && entityType.includes("job")) return ROUTES.admin.jobDetails(entityId)
  if (entityId && entityType.includes("company")) return ROUTES.admin.companyDetails(entityId)
  if (
    entityId &&
    (entityType.includes("user") ||
      entityType.includes("candidate") ||
      entityType.includes("employer"))
  ) {
    return ROUTES.admin.userDetails(entityId)
  }

  return undefined
}
