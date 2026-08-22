import { AdminFeatureError } from "@/features/admin/shared/components"
import AdminReportsFilter from "../components/AdminReportsFilter"
import AdminReportsJobs from "../components/AdminReportsJobs"
import { useAdminReportsJobs } from "../hooks/useAdminReportsJobs"
import { useTranslation } from "react-i18next"

export default function AdminReportsJobsPage() {
  const { t } = useTranslation("adminReports")
  const query = useAdminReportsJobs()

  if (query.isError) {
    return (
      <AdminFeatureError
        title={t("jobs.title")}
        error={query.error}
        retry={() => void query.refetch()}
      />
    )
  }

  return (
    <div className="space-y-6">
      <AdminReportsFilter
        filters={query.filters}
        onApply={query.applyFilters}
        onReset={query.resetFilters}
      />
      <AdminReportsJobs data={query.data} isLoading={query.isPending} />
    </div>
  )
}
