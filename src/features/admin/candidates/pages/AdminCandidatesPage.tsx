import { UserRoundCheck } from "lucide-react"

import { AdminFeatureError } from "@/features/admin/shared/components"
import PageHeader from "@/components/shared/headers/PageHeader"
import AdminCandidatesTable from "../components/AdminCandidatesTable"
import { useAdminCandidates } from "../hooks/useAdminCandidates"
import { useTranslation } from "react-i18next"

export default function AdminCandidatesPage() {
  const { t } = useTranslation("adminShared")
  const candidates = useAdminCandidates()
  if (candidates.isError)
    return (
      <AdminFeatureError
        title={t("candidates.title")}
        error={candidates.error}
        retry={() => {
          void candidates.refetch()
        }}
      />
    )
  return (
    <div className="space-y-6">
      <PageHeader
        title={t("candidates.title")}
        description={t("candidates.description")}
        icon={UserRoundCheck}
        count={candidates.data?.pagination.total}
      />
      <AdminCandidatesTable
        users={candidates.data?.items ?? []}
        isLoading={candidates.isPending}
        pagination={candidates.data?.pagination}
        onPageChange={candidates.setPage}
        isUpdating={candidates.statusMutation.isPending}
        onStatusChange={(id, status, reason) =>
          candidates.statusMutation.mutateAsync({ id, status, reason })
        }
      />
    </div>
  )
}
