import { useTranslation } from "react-i18next"
import { SectionCard } from "@/components/shared/cards/SectionCard"
import type { AdminCvParsingReport } from "../types/adminReports.types"

interface Props {
  data?: AdminCvParsingReport
  isLoading: boolean
}

export default function AdminReportsCvParsing({ data, isLoading }: Props) {
  const { t } = useTranslation("adminReports")
  if (isLoading)
    return (
      <SectionCard icon={() => null} title={t("cvParsing.title")}>
        <div className="h-32 animate-pulse rounded bg-muted" />
      </SectionCard>
    )
  if (!data)
    return (
      <SectionCard icon={() => null} title={t("cvParsing.title")}>
        <p className="text-sm text-text-muted">{t("cvParsing.empty")}</p>
      </SectionCard>
    )
  const summaries = [
    ["cvParsing.total", data.total_uploaded_cvs],
    ["cvParsing.parsed", data.parsed_count],
    ["cvParsing.failed", data.failed_count],
    ["cvParsing.generated", data.suggestions_generated_count],
    ["cvParsing.accepted", data.suggestions_accepted],
    ["cvParsing.rejected", data.suggestions_rejected],
    ["cvParsing.applied", data.suggestions_applied],
  ] as const
  return (
    <SectionCard icon={() => null} title={t("cvParsing.title")}>
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {summaries.map(([label, count]) => (
            <div key={label} className="rounded-lg border border-border/60 p-3">
              <p className="text-xs text-text-secondary">{t(label)}</p>
              <p className="mt-1 text-xl font-bold">{count.toLocaleString()}</p>
            </div>
          ))}
        </div>
        {data.suggestions_by_status.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold">{t("cvParsing.byStatus")}</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.suggestions_by_status.map((status) => (
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
