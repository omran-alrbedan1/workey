import { useTranslation } from "react-i18next"
import { SectionCard } from "@/components/shared/cards/SectionCard"
import EmptyState from "@/components/shared/states/EmptyState"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { AdminApplicationsReport } from "../types/adminReports.types"

interface AdminReportsApplicationsProps {
  data?: AdminApplicationsReport
  isLoading: boolean
}

export default function AdminReportsApplications({
  data,
  isLoading,
}: AdminReportsApplicationsProps) {
  const { t, i18n } = useTranslation("adminReports")

  const statusCounts = data?.status_counts
  const dailyCounts = data?.daily_counts

  if (isLoading) {
    return (
      <SectionCard icon={() => null} title={t("applications.title")}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-48 rounded bg-muted" />
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="h-4 w-40 rounded bg-muted" />
        </div>
      </SectionCard>
    )
  }

  return (
    <SectionCard icon={() => null} title={t("applications.title")}>
      <div className="space-y-6">
        {statusCounts && Object.keys(statusCounts).length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-text-secondary">
              {t("applications.statusCounts")}
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

        {dailyCounts && dailyCounts.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-text-secondary">
              {t("applications.dailyCounts")}
            </h3>
            <div className="overflow-x-auto rounded-lg border border-border/60">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("applications.date")}</TableHead>
                    <TableHead className="text-end">{t("applications.count")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyCounts.map((row) => (
                    <TableRow key={row.date}>
                      <TableCell className="text-sm text-text-primary">
                        {new Date(row.date).toLocaleDateString(i18n.language)}
                      </TableCell>
                      <TableCell className="text-end text-sm font-semibold text-text-primary">
                        {row.count.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {(!statusCounts || Object.keys(statusCounts).length === 0) &&
          (!dailyCounts || dailyCounts.length === 0) && (
            <EmptyState
              title={t("applications.empty")}
              description={t("applications.empty")}
              className="rounded-lg border border-dashed border-border/60 bg-background-secondary/40 py-8"
            />
          )}
      </div>
    </SectionCard>
  )
}
