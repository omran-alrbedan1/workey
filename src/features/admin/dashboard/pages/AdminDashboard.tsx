import {
  AdminAttentionQueue,
  AdminDashboardHeader,
  AdminDashboardSkeleton,
  AdminDistributionCharts,
  AdminRecentActivity,
  AdminStatsGrid,
} from "../components"
import { useAdminDashboard } from "../hooks/useAdminDashboard"
import { useTranslation } from "react-i18next"
import { AdminFeatureError } from "@/features/admin/shared/components"

export default function AdminDashboard() {
  const { t } = useTranslation("adminDashboard")
  const { data, isLoading, isFetching, isError, error, refetch } = useAdminDashboard()

  if (isLoading)
    return (
      <div className="space-y-6">
        <AdminDashboardHeader isFetching onRefresh={() => {}} />
        <AdminDashboardSkeleton />
      </div>
    )

  if (isError) {
    return (
      <AdminFeatureError
        title={t("pageTitle")}
        error={error}
        retry={() => {
          void refetch()
        }}
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
