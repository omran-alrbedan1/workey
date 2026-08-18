import ErrorState from "@/components/shared/states/ErrorState"
import DataSourceIndicator from "@/components/shared/states/DataSourceIndicator"
import {
  AdminApiCoverageNotice,
  AdminAttentionQueue,
  AdminDashboardHeader,
  AdminDashboardSkeleton,
  AdminDistributionCharts,
  AdminRecentActivity,
  AdminStatsGrid,
} from "../components"
import { useAdminDashboard } from "../hooks/useAdminDashboard"
import { useTranslation } from "react-i18next"

export default function AdminDashboard() {
  const { t } = useTranslation("adminDashboard")
  const { data, isLoading, isFetching, isError, error, refetch, dataSourceStatuses } = useAdminDashboard()

  if (isLoading) return <AdminDashboardSkeleton />

  if (isError) {
    return (
      <ErrorState
        variant="network"
        title={t("errorTitle")}
        description={t("errorDescription")}
        error={error instanceof Error ? error : undefined}
        retry={() => {
          void refetch()
        }}
        className="min-h-[60vh]"
      />
    )
  }

  return (
    <div className="space-y-6">
      <AdminDashboardHeader
        isFetching={isFetching}
        onRefresh={() => {
          void refetch()
        }}
      />
      <DataSourceIndicator
        sources={dataSourceStatuses}
        onRefresh={() => {
          void refetch()
        }}
        isRefreshing={isFetching}
      />
      <AdminApiCoverageNotice failedSources={data.failedSources} />
      <AdminStatsGrid metrics={data.metrics} />
      <AdminDistributionCharts
        roles={data.roleDistribution}
        companies={data.companyDistribution}
        sampledUsers={data.sampledUsers}
        sampledCompanies={data.sampledCompanies}
      />
      <div className="grid gap-3 xl:grid-cols-[0.9fr_1.1fr]">
        <AdminAttentionQueue items={data.attentionItems} />
        <AdminRecentActivity items={data.recentActivity} />
      </div>
    </div>
  )
}
