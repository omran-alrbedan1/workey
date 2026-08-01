import { AdminFeatureError } from "@/features/admin/shared/components"
import AdminReportsFilter from "../components/AdminReportsFilter"
import AdminReportsApplications from "../components/AdminReportsApplications"
import { useAdminReportsApplications } from "../hooks/useAdminReportsApplications"
import { useTranslation } from "react-i18next"

export default function AdminReportsApplicationsPage() {
  const { t } = useTranslation("adminReports")
  const query = useAdminReportsApplications()

  if (query.isError) {
    return (
      <AdminFeatureError
        title={t("applications.title")}
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
      <AdminReportsApplications
        data={query.data}
        isLoading={query.isPending}
      />
    </div>
  )
}
