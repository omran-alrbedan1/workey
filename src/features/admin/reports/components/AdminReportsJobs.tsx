import { useTranslation } from "react-i18next"
import { SectionCard } from "@/components/shared/cards/SectionCard"
import type { AdminJobsReport } from "../types/adminReports.types"

interface Props {
  data?: AdminJobsReport
  isLoading: boolean
}

export default function AdminReportsJobs({ data, isLoading }: Props) {
  const { t } = useTranslation("adminReports")
  if (isLoading)
    return (
      <SectionCard icon={() => null} title={t("jobs.title")}>
        <div className="h-32 animate-pulse rounded bg-muted" />
      </SectionCard>
    )
  if (!data)
    return (
      <SectionCard icon={() => null} title={t("jobs.title")}>
        <p className="text-sm text-text-muted">{t("jobs.empty")}</p>
      </SectionCard>
    )
  const summaries = [
    ["jobs.total", data.total],
    ["jobs.published", data.published],
    ["jobs.closed", data.closed],
    ["jobs.draft", data.draft],
    ["jobs.avgApplications", data.average_applications_per_job],
  ] as const
  return (
    <SectionCard icon={() => null} title={t("jobs.title")}>
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {summaries.map(([label, count]) => (
            <div key={label} className="rounded-lg border border-border/60 p-3">
              <p className="text-xs text-text-secondary">{t(label)}</p>
              <p className="mt-1 text-xl font-bold">{count.toLocaleString()}</p>
            </div>
          ))}
        </div>
        {data.by_status.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold">{t("jobs.statusCounts")}</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.by_status.map((status) => (
                <div
                  key={status.key}
                  className="flex justify-between rounded-lg border border-border/60 px-4 py-3"
                >
                  <span className="text-sm text-text-secondary">{status.value}</span>
                  <b>{status.count.toLocaleString()}</b>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  )
}
