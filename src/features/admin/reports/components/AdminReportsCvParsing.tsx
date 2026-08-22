import { CheckCircle2, XCircle, UserRoundCheck } from "lucide-react"
import { useTranslation } from "react-i18next"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SectionCard } from "@/components/shared/cards/SectionCard"
import type { AdminCvParsingReport } from "../types/adminReports.types"

interface AdminReportsCvParsingProps {
  data?: AdminCvParsingReport
  isLoading: boolean
}

export default function AdminReportsCvParsing({
  data,
  isLoading,
}: AdminReportsCvParsingProps) {
  const { t, i18n } = useTranslation("adminReports")

  if (isLoading) {
    return (
      <SectionCard icon={() => null} title={t("cvParsing.title")}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-48 rounded bg-muted" />
          <div className="h-4 w-32 rounded bg-muted" />
        </div>
      </SectionCard>
    )
  }

  const dailyCounts = data?.daily_counts
  const summaryCards = [
    {
      key: "success_count",
      label: t("cvParsing.success"),
      value: data?.success_count,
      icon: CheckCircle2,
      className: "text-emerald-500",
    },
    {
      key: "failed_count",
      label: t("cvParsing.failed"),
      value: data?.failed_count,
      icon: XCircle,
      className: "text-red-500",
    },
    {
      key: "profile_suggestion_count",
      label: t("cvParsing.profileSuggestions"),
      value: data?.profile_suggestion_count,
      icon: UserRoundCheck,
      className: "text-blue-500",
    },
  ].filter((card) => typeof card.value === "number")
  const hasDailyCounts = Boolean(dailyCounts && dailyCounts.length > 0)
  const showFailedDailyCount = Boolean(dailyCounts?.some((row) => row.failed_count !== undefined))

  return (
    <SectionCard icon={() => null} title={t("cvParsing.title")}>
      <div className="space-y-6">
        {summaryCards.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-3">
            {summaryCards.map((card) => {
              const Icon = card.icon
              return (
                <div
                  key={card.key}
                  className="flex items-center gap-3 rounded-lg border border-border/60 bg-background-card/50 px-4 py-3"
                >
                  <Icon className={`h-5 w-5 ${card.className}`} />
                  <div>
                    <p className="text-xs font-medium text-text-secondary">{card.label}</p>
                    <p className="text-lg font-bold text-text-primary">
                      {card.value!.toLocaleString()}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {hasDailyCounts && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-text-secondary">
              {t("cvParsing.dailyCounts")}
            </h3>
            <div className="overflow-x-auto rounded-lg border border-border/60">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("cvParsing.date")}</TableHead>
                    <TableHead className="text-end">{t("cvParsing.parsed")}</TableHead>
                    {showFailedDailyCount && (
                      <TableHead className="text-end">{t("cvParsing.failed")}</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyCounts.map((row) => (
                    <TableRow key={row.date}>
                      <TableCell className="text-sm text-text-primary">
                        {new Date(row.date).toLocaleDateString(i18n.language)}
                      </TableCell>
                      <TableCell className="text-end text-sm font-semibold text-text-primary">
                        {row.parsed_count.toLocaleString()}
                      </TableCell>
                      {showFailedDailyCount && (
                        <TableCell className="text-end text-sm text-text-primary">
                          {row.failed_count?.toLocaleString() ?? "-"}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {summaryCards.length === 0 && !hasDailyCounts && (
          <p className="text-sm text-text-muted">{t("cvParsing.empty")}</p>
        )}
      </div>
    </SectionCard>
  )
}
