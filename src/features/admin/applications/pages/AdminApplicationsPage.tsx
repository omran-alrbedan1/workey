import { ClipboardList } from "lucide-react"
import { AdminFeatureError } from "@/features/admin/shared/components"
import PageHeader from "@/components/shared/headers/PageHeader"
import AdminApplicationsTable from "../components/AdminApplicationsTable"
import { useAdminApplications } from "../hooks/useAdminApplications"
import { useTranslation } from "react-i18next"

export default function AdminApplicationsPage() {
  const { t } = useTranslation("adminApplications")
  const applications = useAdminApplications()
  if (applications.isError)
    return (
      <AdminFeatureError
        title={t("title")}
        error={applications.error}
        retry={() => {
          void applications.refetch()
        }}
      />
    )
  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        description={t("description")}
        icon={ClipboardList}
        count={applications.data?.pagination.total}
      />
      <AdminApplicationsTable
        applications={applications.data?.items ?? []}
        isLoading={applications.isPending}
        pagination={applications.data?.pagination}
        onPageChange={applications.setPage}
      />
    </div>
  )
}
