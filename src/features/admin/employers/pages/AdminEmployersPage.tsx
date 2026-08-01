import { BriefcaseBusiness } from "lucide-react"

import { AdminFeatureError } from "@/features/admin/shared/components"
import PageHeader from "@/components/shared/headers/PageHeader"
import AdminEmployersTable from "../components/AdminEmployersTable"
import { useAdminEmployers } from "../hooks/useAdminEmployers"
import { useTranslation } from "react-i18next"

export default function AdminEmployersPage() {
  const { t } = useTranslation("adminShared")
  const employers = useAdminEmployers()
  if (employers.isError)
    return (
      <AdminFeatureError
        title={t("employers.title")}
        error={employers.error}
        retry={() => {
          void employers.refetch()
        }}
      />
    )
  return (
    <div className="space-y-6">
      <PageHeader
        title={t("employers.title")}
        description={t("employers.description")}
        icon={BriefcaseBusiness}
        count={employers.data?.pagination.total}
      />
      <AdminEmployersTable
        users={employers.data?.items ?? []}
        isLoading={employers.isPending}
        pagination={employers.data?.pagination}
        onPageChange={employers.setPage}
        isUpdating={employers.statusMutation.isPending}
        onStatusChange={(id, status, reason) =>
          employers.statusMutation.mutateAsync({ id, status, reason })
        }
      />
    </div>
  )
}
