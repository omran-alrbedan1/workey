import { AdminFeatureError } from "@/features/admin/shared/components"
import AdminReportsFilter from "../components/AdminReportsFilter"
import AdminReportsCvParsing from "../components/AdminReportsCvParsing"
import { useAdminReportsCvParsing } from "../hooks/useAdminReportsCvParsing"
import { useTranslation } from "react-i18next"

export default function AdminReportsCvParsingPage() {
  const { t } = useTranslation("adminReports")
  const query = useAdminReportsCvParsing()

  if (query.isError) {
    return (
      <AdminFeatureError
        title={t("cvParsing.title")}
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
      <AdminReportsCvParsing
        data={query.data}
        isLoading={query.isPending}
      />
    </div>
  )
}
