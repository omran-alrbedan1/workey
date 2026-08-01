import { HelpCircle } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import PageHeader from "@/components/shared/headers/PageHeader"
import ErrorState from "@/components/shared/states/ErrorState"
import { Skeleton } from "@/components/ui/skeleton"
import { ROUTES } from "@/config"
import EmployerJobScreeningQuestions from "../components/EmployerJobScreeningQuestions"
import { useEmployerJob } from "../hooks/useEmployerJob"

export default function EmployerJobScreeningQuestionsPage() {
  const { t } = useTranslation("employerJobs")
  const navigate = useNavigate()
  const { id } = useParams()
  const job = useEmployerJob(id)

  if (job.isError) {
    return (
      <ErrorState
        title={t("errors.editTitle")}
        description={t("errors.editDescription")}
        retry={() => void job.refetch()}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("screeningQuestions.pageTitle")}
        description={job.data?.title ?? t("screeningQuestions.pageDescription")}
        icon={HelpCircle}
        showBackButton
        backButtonLabel={t("actions.backToJob")}
        onBackClick={() => navigate(id ? ROUTES.employer.jobDetails(id) : ROUTES.employer.jobs)}
      />
      {job.isPending ? (
        <Skeleton className="h-80 w-full rounded-lg" />
      ) : (
        <EmployerJobScreeningQuestions
          questions={job.screeningQuestions}
          isLoading={job.isScreeningQuestionsLoading}
          isPending={
            job.createScreeningQuestionMutation.isPending ||
            job.updateScreeningQuestionMutation.isPending ||
            job.deleteScreeningQuestionMutation.isPending
          }
          onCreate={job.createScreeningQuestionMutation.mutateAsync}
          onUpdate={job.updateScreeningQuestionMutation.mutateAsync}
          onDelete={job.deleteScreeningQuestionMutation.mutateAsync}
        />
      )}
    </div>
  )
}
