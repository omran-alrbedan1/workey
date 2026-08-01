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

function extractValue(value: number | Record<string, number> | undefined): number {
  if (value == null) return 0
  if (typeof value === "number") return value
  return Object.values(value).reduce((sum, val) => sum + val, 0)
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
