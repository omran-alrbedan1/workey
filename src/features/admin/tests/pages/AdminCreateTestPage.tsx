import { FlaskConical } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import PageHeader from "@/components/shared/headers/PageHeader"
import { ROUTES } from "@/config"
import { adminCompaniesService } from "@/features/admin/companies/services/adminCompanies.service"
import AdminTestWizard from "../components/AdminTestWizard"
import { useAdminTests } from "../hooks/useAdminTests"

export default function AdminCreateTestPage() {
  const { t } = useTranslation("adminTests")
  const navigate = useNavigate()
  const tests = useAdminTests()
  const companies = useQuery({
    queryKey: ["admin", "tests", "companies"],
    queryFn: () => adminCompaniesService.list({ page: 1, per_page: 100 }),
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("create.title")}
        description={t("create.description")}
        icon={FlaskConical}
        showBackButton
        backButtonLabel={t("wizard.back")}
        onBackClick={() => navigate(ROUTES.admin.tests)}
      />
      <AdminTestWizard
        companies={companies.data?.items ?? []}
        isLoadingCompanies={companies.isPending}
        onCreate={(input) => tests.createMutation.mutateAsync(input)}
        onUpdate={(input) => tests.updateMutation.mutateAsync(input)}
        onComplete={() => navigate(ROUTES.admin.tests)}
        isPending={tests.createMutation.isPending || tests.updateMutation.isPending}
      />
    </div>
  )
}
