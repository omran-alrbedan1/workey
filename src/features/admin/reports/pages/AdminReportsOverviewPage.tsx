import { AdminFeatureError } from "@/features/admin/shared/components"
import AdminReportsOverview from "../components/AdminReportsOverview"
import { useAdminReportsOverview } from "../hooks/useAdminReportsOverview"
import { useTranslation } from "react-i18next"

export default function AdminReportsOverviewPage() {
  const { t } = useTranslation("adminReports")
  const query = useAdminReportsOverview()

  if (query.isError) {
    return (
      <AdminFeatureError
        title={t("title")}
        error={query.error}
        retry={() => void query.refetch()}
      />
    )
  }

  return (
    <AdminReportsOverview
      data={query.data}
      isLoading={query.isPending}
    />
  )
}
