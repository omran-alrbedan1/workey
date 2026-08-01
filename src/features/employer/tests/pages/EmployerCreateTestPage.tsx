import { Plus } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import PageHeader from "@/components/shared/headers/PageHeader"
import { ROUTES } from "@/config"
import EmployerTestForm from "../components/EmployerTestForm"
import { useEmployerTests } from "../hooks/useEmployerTests"
import type { EmployerTestInput } from "../types/employerTests.types"

export default function EmployerCreateTestPage() {
  const { t } = useTranslation("employerTests")
  const navigate = useNavigate()
  const tests = useEmployerTests()

  const handleSubmit = async (input: EmployerTestInput) => {
    const createdTest = await tests.createMutation.mutateAsync(input)
    return createdTest
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("createTitle")}
        description={t("createDescription")}
        icon={Plus}
        showBackButton
        backButtonLabel={t("actions.back")}
        onBackClick={() => navigate(ROUTES.employer.tests)}
      />
      <EmployerTestForm
        isPending={tests.createMutation.isPending}
        onSubmit={handleSubmit}
        onComplete={() => navigate(ROUTES.employer.tests)}
      />
    </div>
  )
}
