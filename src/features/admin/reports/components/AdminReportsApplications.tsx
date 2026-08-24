import { useTranslation } from "react-i18next"
import { SectionCard } from "@/components/shared/cards/SectionCard"
import EmptyState from "@/components/shared/states/EmptyState"
import type { AdminApplicationsReport } from "../types/adminReports.types"

interface Props {
  data?: AdminApplicationsReport
  isLoading: boolean
}

export default function AdminReportsApplications({ data, isLoading }: Props) {
  const { t, i18n } = useTranslation("adminReports")
  if (isLoading)
    return (
      <SectionCard icon={() => null} title={t("applications.title")}>
        <div className="h-32 animate-pulse rounded bg-muted" />
      </SectionCard>
    )
  if (!data)
    return (
      <SectionCard icon={() => null} title={t("applications.title")}>
        <EmptyState title={t("applications.empty")} description={t("applications.empty")} />
      </SectionCard>
    )
  const summaries = [
    ["applications.total", data.total],
    ["applications.active", data.active],
    ["applications.final", data.final],
    ["applications.accepted", data.accepted],
    ["applications.rejected", data.rejected],
  ] as const
  const perDay = Object.entries(data.per_day)
  return (
    <SectionCard icon={() => null} title={t("applications.title")}>
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
            <h3 className="mb-3 text-sm font-semibold">{t("applications.statusCounts")}</h3>
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
        {perDay.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold">{t("applications.dailyCounts")}</h3>
            <div className="space-y-2">
              {perDay.map(([date, count]) => (
                <div
                  key={date}
                  className="flex justify-between rounded-lg bg-background-secondary px-4 py-2 text-sm"
                >
                  <span>{new Date(`${date}T00:00:00`).toLocaleDateString(i18n.language)}</span>
                  <b>{count.toLocaleString()}</b>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  )
}
