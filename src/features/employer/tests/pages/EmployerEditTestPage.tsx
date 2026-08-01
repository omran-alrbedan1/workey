import { Pencil } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import PageHeader from "@/components/shared/headers/PageHeader"
import ErrorState from "@/components/shared/states/ErrorState"
import { Skeleton } from "@/components/ui/skeleton"
import { ROUTES } from "@/config"
import EmployerTestForm from "../components/EmployerTestForm"
import { useEmployerTest } from "../hooks/useEmployerTest"
import type { EmployerTestInput } from "../types/employerTests.types"

export default function EmployerEditTestPage() {
  const { t } = useTranslation("employerTests")
  const navigate = useNavigate()
  const { id } = useParams()
  const test = useEmployerTest(id)

  if (test.isError) {
    return (
      <ErrorState
        title={t("errors.editTitle")}
        description={t("errors.editDescription")}
        retry={() => void test.refetch()}
      />
    )
  }

  const handleSubmit = async (input: EmployerTestInput) => {
    await test.updateMutation.mutateAsync(input)
    navigate(ROUTES.employer.tests)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("editTitle")}
        description={t("editDescription")}
        icon={Pencil}
        showBackButton
        backButtonLabel={t("actions.back")}
        onBackClick={() => navigate(ROUTES.employer.tests)}
      />
      {test.isPending ? (
        <Skeleton className="h-96 w-full rounded-lg" />
      ) : (
        <EmployerTestForm
          test={test.data}
          isPending={test.updateMutation.isPending}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}
