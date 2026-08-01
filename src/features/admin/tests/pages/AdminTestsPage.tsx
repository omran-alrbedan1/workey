import { FlaskConical, Plus } from "lucide-react"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { AdminFeatureError } from "@/features/admin/shared/components"
import PageHeader from "@/components/shared/headers/PageHeader"
import AddTestDialog from "../components/AddTestDialog"
import AdminTestsTable from "../components/AdminTestsTable"
import { useAdminTests } from "../hooks/useAdminTests"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { adminCompaniesService } from "@/features/admin/companies/services/adminCompanies.service"
export default function AdminTestsPage() {
  const { t } = useTranslation("adminTests")
  const [createOpen, setCreateOpen] = useState(false)
  const tests = useAdminTests()
  const companies = useQuery({
    queryKey: ["admin", "tests", "companies"],
    queryFn: () => adminCompaniesService.list({ page: 1, per_page: 100 }),
    enabled: createOpen,
  })
  if (tests.isError)
    return (
      <AdminFeatureError
        title={t("title")}
        error={tests.error}
        retry={() => {
          void tests.refetch()
        }}
      />
    )
  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        description={t("description")}
        icon={FlaskConical}
        count={tests.data?.pagination.total}
        rightContent={
          <Button className="text-white" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            {t("form.add")}
          </Button>
        }
      />
      <AddTestDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        isPending={tests.createMutation.isPending}
        companies={companies.data?.items ?? []}
        isLoadingCompanies={companies.isPending}
        onCreate={(input) => tests.createMutation.mutateAsync(input)}
      />
      <AdminTestsTable
        tests={tests.data?.items ?? []}
        isLoading={tests.isPending}
        pagination={tests.data?.pagination}
        isDeleting={tests.deleteMutation.isPending}
        isUpdating={tests.updateMutation.isPending}
        onDelete={(id) => tests.deleteMutation.mutateAsync(id)}
        onUpdate={(input) => tests.updateMutation.mutateAsync(input)}
      />
    </div>
  )
}
