import { ScrollText } from "lucide-react"
import { useTranslation } from "react-i18next"

import PageHeader from "@/components/shared/headers/PageHeader"
import { AdminFeatureError } from "@/features/admin/shared/components"
import AdminAuditLogsFilter from "../components/AdminAuditLogsFilter"
import AdminAuditLogsTable from "../components/AdminAuditLogsTable"
import { useAdminAuditLogs } from "../hooks/useAdminAuditLogs"

export default function AdminAuditLogsPage() {
  const { t } = useTranslation("adminAuditLogs")
  const logs = useAdminAuditLogs()

  if (logs.isError && !logs.data) {
    return <AdminFeatureError title={t("title")} error={logs.error} retry={() => void logs.refetch()} />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        description={t("description")}
        icon={ScrollText}
        count={logs.data?.pagination.total}
      />
      <div>
        <AdminAuditLogsFilter
          filters={logs.filters}
          onApply={logs.applyFilters}
          onReset={logs.resetFilters}
        />
        <AdminAuditLogsTable
          logs={logs.data?.items ?? []}
          isLoading={logs.isPending}
          pagination={logs.data?.pagination}
          onPageChange={logs.setPage}
        />
      </div>
    </div>
  )
}
