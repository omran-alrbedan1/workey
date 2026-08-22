import { useTranslation } from "react-i18next"
import {
  Users,
  Building2,
  BriefcaseBusiness,
  ClipboardList,
  FlaskConical,
  UsersRound,
  Bell,
  FileText,
  ScrollText,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { MetricStatusCard } from "@/components/shared/cards/MetricCard"
import type { AdminOverviewReport } from "../types/adminReports.types"

interface AdminReportsOverviewProps {
  data?: AdminOverviewReport
  isLoading: boolean
}

const overviewFields: Array<{
  key: keyof AdminOverviewReport
  icon: LucideIcon
  translationKey: string
}> = [
  { key: "users", icon: Users, translationKey: "overview.users" },
  { key: "companies", icon: Building2, translationKey: "overview.companies" },
  { key: "jobs", icon: BriefcaseBusiness, translationKey: "overview.jobs" },
  { key: "applications", icon: ClipboardList, translationKey: "overview.applications" },
  { key: "tests", icon: FlaskConical, translationKey: "overview.tests" },
  { key: "interviews", icon: UsersRound, translationKey: "overview.interviews" },
  { key: "notifications", icon: Bell, translationKey: "overview.notifications" },
  { key: "cvs", icon: FileText, translationKey: "overview.cvs" },
  { key: "audit_logs", icon: ScrollText, translationKey: "overview.auditLogs" },
]

function numericValue(value: unknown): number | null {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function extractValue(value: unknown): number | null {
  if (value == null) return null
  if (typeof value === "number") return value
  if (typeof value === "string") return numericValue(value)
  if (Array.isArray(value) || typeof value !== "object") return null

  const record = value as Record<string, unknown>
  return (
    numericValue(record.total) ??
    numericValue(record.count) ??
    numericValue(record.total_count) ??
    numericValue(record.value)
  )
}

export default function AdminReportsOverview({ data, isLoading }: AdminReportsOverviewProps) {
  const { t } = useTranslation("adminReports")

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {overviewFields.map((field) => (
          <div
            key={field.key}
            className="animate-pulse rounded-2xl border border-border bg-background-card p-5"
          >
            <div className="mb-3 h-4 w-24 rounded bg-muted" />
            <div className="h-8 w-16 rounded bg-muted" />
          </div>
        ))}
      </div>
    )
  }

  const fieldsWithData = overviewFields
    .map((field) => ({ ...field, total: extractValue(data?.[field.key]) }))
    .filter((field) => field.total !== null)

  if (fieldsWithData.length === 0) {
    return <p className="text-sm text-text-muted">{t("overview.empty")}</p>
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {fieldsWithData.map((field) => {
        return (
          <MetricStatusCard
            key={field.key}
            title={t(field.translationKey)}
            value={field.total!.toLocaleString()}
            icon={field.icon}
          />
        )
      })}
    </div>
  )
}
