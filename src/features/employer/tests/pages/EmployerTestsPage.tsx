import { useMemo, useState } from "react"
import { FlaskConical, Plus } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import PageHeader from "@/components/shared/headers/PageHeader"
import EmptyState from "@/components/shared/states/EmptyState"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ROUTES } from "@/config"
import { useEmployerJobs } from "@/features/employer/jobs/hooks/useEmployerJobs"
import EmployerFeatureError from "@/features/employer/shared/components/EmployerFeatureError"
import AssignTestDialog from "../components/AssignTestDialog"
import EmployerTestsTable from "../components/EmployerTestsTable"
import { useEmployerTests } from "../hooks/useEmployerTests"
import type { AssignTestPayload, EmployerTest } from "../types/employerTests.types"

export default function EmployerTestsPage() {
  const { t } = useTranslation("employerTests")
  const navigate = useNavigate()
  const tests = useEmployerTests()
  const jobs = useEmployerJobs()
  const [assigning, setAssigning] = useState<EmployerTest | null>(null)

  const jobOptions = useMemo(
    () =>
      jobs.data?.items.map((j) => ({
        value: String(j.id),
        label: j.title,
      })) ?? [],
    [jobs.data],
  )

  if (tests.isError) {
    return (
      <EmployerFeatureError
        title={t("title")}
        error={tests.error}
        retry={() => void tests.refetch()}
      />
    )
  }

  const handleAssign = async (
    applicationId: string | number,
    testId: string | number,
    data: AssignTestPayload,
  ) => {
    await tests.assignMutation.mutateAsync({ applicationId, testId, ...data })
  }

  const isUpdating =
    tests.createMutation.isPending ||
    tests.updateMutation.isPending ||
    tests.patchMutation.isPending ||
    tests.deleteMutation.isPending ||
    tests.assignMutation.isPending

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        description={t("description")}
        icon={FlaskConical}
        count={tests.data?.pagination.total}
        rightContent={
          <Button onClick={() => navigate(ROUTES.employer.createTest)} className="text-white">
            <Plus className="mr-2 h-4 w-4" /> {t("actions.new")}
          </Button>
        }
      />
      <Card>
        <CardContent className="pt-6">
          {tests.data?.items.length === 0 && !tests.isPending ? (
            <EmptyState
              icon={FlaskConical}
              title={t("empty.title")}
              description={t("empty.description")}
              primaryAction={{
                label: t("actions.new"),
                onClick: () => navigate(ROUTES.employer.createTest),
                icon: Plus,
              }}
            />
          ) : (
            <EmployerTestsTable
              collection={tests.data}
              isLoading={tests.isPending}
              isUpdating={isUpdating}
              onPageChange={tests.setPage}
              onEdit={(test) => navigate(ROUTES.employer.editTest(test.id))}
              onToggle={async (test) =>
                await tests.patchMutation.mutateAsync({
                  id: test.id,
                  input: { is_active: !test.is_active },
                })
              }
              onDelete={tests.deleteMutation.mutateAsync}
              onAssign={(test) => setAssigning(test)}
            />
          )}
        </CardContent>
      </Card>
      <AssignTestDialog
        test={assigning}
        jobs={jobOptions}
        open={assigning !== null}
        isPending={tests.assignMutation.isPending}
        onOpenChange={(open) => {
          if (!open) setAssigning(null)
        }}
        onSubmit={handleAssign}
      />
    </div>
  )
}
