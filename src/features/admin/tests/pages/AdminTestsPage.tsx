import { FlaskConical, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { AdminFeatureError } from "@/features/admin/shared/components"
import PageHeader from "@/components/shared/headers/PageHeader"
import AdminTestsTable from "../components/AdminTestsTable"
import { useAdminTests } from "../hooks/useAdminTests"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/config"

export default function AdminTestsPage() {
  const { t } = useTranslation("adminTests")
  const navigate = useNavigate()
  const tests = useAdminTests()

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
          <Button className="text-white" onClick={() => navigate(ROUTES.admin.testsCreate)}>
            <Plus className="h-4 w-4" />
            {t("form.add")}
          </Button>
        }
      />
      <AdminTestsTable
        tests={tests.data?.items ?? []}
        isLoading={tests.isPending}
        pagination={tests.data?.pagination}
        isDeleting={tests.deleteMutation.isPending}
        isUpdating={tests.updateMutation.isPending}
        onDelete={(id) => tests.deleteMutation.mutateAsync(id)}
        onUpdate={(input) => tests.updateMutation.mutateAsync(input)}
        onPageChange={tests.setPage}
      />
    </div>
  )
}
