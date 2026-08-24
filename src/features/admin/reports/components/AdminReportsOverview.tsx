import { useTranslation } from "react-i18next"
import { Building2, ClipboardList, FileText, FlaskConical, ScrollText, Users } from "lucide-react"
import { MetricStatusCard } from "@/components/shared/cards/MetricCard"
import type { AdminOverviewReport, LocalizedCount } from "../types/adminReports.types"

interface Props {
  data?: AdminOverviewReport
  isLoading: boolean
}

function Breakdown({ title, items }: { title: string; items: LocalizedCount[] }) {
  if (!items.length) return null
  return (
    <section className="rounded-xl border border-border bg-background-card p-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item.key}
            className="rounded-full bg-background-secondary px-3 py-1 text-xs text-text-secondary"
          >
            {item.value}: <b className="text-text-primary">{item.count.toLocaleString()}</b>
          </span>
        ))}
      </div>
    </section>
  )
}

export default function AdminReportsOverview({ data, isLoading }: Props) {
  const { t } = useTranslation("adminReports")
  if (isLoading)
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 11 }, (_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    )
  if (!data) return <p className="text-sm text-text-muted">{t("overview.empty")}</p>
  const metrics = [
    ["overview.users", data.users.total, Users],
    ["overview.companies", data.companies.total, Building2],
    ["overview.jobs", data.jobs.total, FileText],
    ["overview.applications", data.applications.total, ClipboardList],
    ["overview.tests", data.tests.total, FlaskConical],
    ["overview.interviews", data.interviews.total, Users],
    ["overview.notifications", data.notifications.total, FileText],
    ["overview.cvs", data.cv_files.total, FileText],
    ["overview.parsed", data.cv_parsing_results.success, FileText],
    ["overview.failed", data.cv_parsing_results.failed, FileText],
    ["overview.auditLogs", data.audit_logs.count, ScrollText],
  ] as const
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map(([label, value, icon]) => (
          <MetricStatusCard
            key={label}
            title={t(label)}
            value={value.toLocaleString()}
            icon={icon}
          />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Breakdown title={t("overview.usersByRole")} items={data.users.by_role} />
        <Breakdown title={t("overview.usersByStatus")} items={data.users.by_status} />
        <Breakdown
          title={t("overview.companiesByStatus")}
          items={data.companies.by_approval_status}
        />
        <Breakdown title={t("overview.jobsByStatus")} items={data.jobs.by_status} />
        <Breakdown title={t("overview.applicationsByStatus")} items={data.applications.by_status} />
        <Breakdown title={t("overview.interviewsByStatus")} items={data.interviews.by_status} />
        <Breakdown title={t("overview.cvsByStatus")} items={data.cv_files.by_status} />
      </div>
    </div>
  )
}
