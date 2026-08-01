import { useTranslation } from "react-i18next"
import { SectionCard } from "@/components/shared/cards/SectionCard"
import type { AdminJobsReport } from "../types/adminReports.types"

interface AdminReportsJobsProps {
  data?: AdminJobsReport
  isLoading: boolean
}

export default function AdminReportsJobs({
  data,
  isLoading,
}: AdminReportsJobsProps) {
  const { t } = useTranslation("adminReports")

  if (isLoading) {
    return (
      <SectionCard icon={() => null} title={t("jobs.title")}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-48 rounded bg-muted" />
          <div className="h-4 w-32 rounded bg-muted" />
        </div>
      </SectionCard>
    )
  }

  const statusCounts = data?.status_counts
  const avgApplications = data?.average_applications_per_job

  return (
    <SectionCard icon={() => null} title={t("jobs.title")}>
      <div className="space-y-6">
        {typeof avgApplications === "number" && (
          <div className="flex items-center gap-4 rounded-lg border border-border/60 bg-background-card/50 px-5 py-4">
            <span className="text-sm font-medium text-text-secondary">
              {t("jobs.avgApplications")}
            </span>
            <span className="text-2xl font-bold text-text-primary">
              {avgApplications.toLocaleString(undefined, { maximumFractionDigits: 1 })}
            </span>
          </div>
        )}

        {statusCounts && Object.keys(statusCounts).length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-text-secondary">
              {t("jobs.statusCounts")}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div
                  key={status}
                  className="flex items-center justify-between rounded-lg border border-border/60 bg-background-card/50 px-4 py-3"
                >
                  <span className="text-sm font-medium text-text-secondary capitalize">
                    {status.replace(/_/g, " ")}
                  </span>
                  <span className="text-lg font-bold text-text-primary">
                    {count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {(!statusCounts || Object.keys(statusCounts).length === 0) && (
          <p className="text-sm text-text-muted">{t("jobs.empty")}</p>
        )}
      </div>
    </SectionCard>
  )
}
