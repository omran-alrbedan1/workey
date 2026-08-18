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

  return (
    <SectionCard icon={() => null} title={t("cvParsing.title")}>
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-background-card/50 px-4 py-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="text-xs font-medium text-text-secondary">{t("cvParsing.success")}</p>
              <p className="text-lg font-bold text-text-primary">
                {data?.success_count?.toLocaleString() ?? "-"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-background-card/50 px-4 py-3">
            <XCircle className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-xs font-medium text-text-secondary">{t("cvParsing.failed")}</p>
              <p className="text-lg font-bold text-text-primary">
                {data?.failed_count?.toLocaleString() ?? "-"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-background-card/50 px-4 py-3">
            <UserRoundCheck className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-xs font-medium text-text-secondary">
                {t("cvParsing.profileSuggestions")}
              </p>
              <p className="text-lg font-bold text-text-primary">
                {data?.profile_suggestion_count?.toLocaleString() ?? "-"}
              </p>
            </div>
          </div>
        </div>

        {dailyCounts && dailyCounts.length > 0 && (
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
                    {dailyCounts[0]?.failed_count !== undefined && (
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
                      {row.failed_count !== undefined && (
                        <TableCell className="text-end text-sm text-text-primary">
                          {row.failed_count.toLocaleString()}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {(!dailyCounts || dailyCounts.length === 0) && (
          <p className="text-sm text-text-muted">{t("cvParsing.empty")}</p>
        )}
      </div>
    </SectionCard>
  )
}
