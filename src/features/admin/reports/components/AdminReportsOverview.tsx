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

import { MetricStatusCard } from "@/components/shared/cards/MetricCard"
import type { AdminOverviewReport } from "../types/adminReports.types"

interface AdminReportsOverviewProps {
  data?: AdminOverviewReport
  isLoading: boolean
}

const overviewFields: Array<{
  key: keyof AdminOverviewReport
  icon: React.ElementType
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

function extractValue(value: unknown): number {
  if (value == null) return 0
  if (typeof value === "number") return value
  if (typeof value === "string") return numericValue(value) ?? 0
  if (Array.isArray(value)) return value.length
  if (typeof value !== "object") return 0

  const record = value as Record<string, unknown>
  const directTotal =
    numericValue(record.total) ??
    numericValue(record.count) ??
    numericValue(record.total_count) ??
    numericValue(record.value)

  if (directTotal !== null) return directTotal

  return Object.values(record).reduce((sum, entry) => {
    const parsed = numericValue(entry)
    return parsed === null ? sum : sum + parsed
  }, 0)
}

export default function AdminReportsOverview({
  data,
  isLoading,
}: AdminReportsOverviewProps) {
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

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {overviewFields.map((field) => {
        const raw = data?.[field.key]
        const total = extractValue(raw)
        return (
          <MetricStatusCard
            key={field.key}
            title={t(field.translationKey)}
            value={total.toLocaleString()}
            icon={field.icon}
          />
        )
      })}
    </div>
  )
}
