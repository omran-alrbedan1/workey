import { Pencil } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import PageHeader from "@/components/shared/headers/PageHeader"
import ErrorState from "@/components/shared/states/ErrorState"
import { Skeleton } from "@/components/ui/skeleton"
import { ROUTES } from "@/config"
import EmployerJobForm from "../components/EmployerJobForm"
import EmployerJobScreeningQuestions from "../components/EmployerJobScreeningQuestions"
import EmployerJobSkills from "../components/EmployerJobSkills"
import { useEmployerJob } from "../hooks/useEmployerJob"
import { useEmployerSkills } from "../hooks/useEmployerSkills"
import type { EmployerJobInput } from "../types/employerJobs.types"

export default function EmployerEditJobPage() {
  const { t } = useTranslation("employerJobs")
  const navigate = useNavigate()
  const { id } = useParams()
  const job = useEmployerJob(id)
  const skills = useEmployerSkills()

  if (job.isError) {
    return (
      <ErrorState
        title={t("errors.editTitle")}
        description={t("errors.editDescription")}
        retry={() => void job.refetch()}
      />
    )
  }

  const toFormValue = (v: unknown): string => {
    if (!v) return ""
    if (typeof v === "string") return v
    if (typeof v === "object") return (v as { key?: string }).key ?? (v as { value?: string }).value ?? ""
    return ""
  }

  const initialValues: EmployerJobInput | undefined = job.data
    ? {
        title: job.data.title,
        description: job.data.description ?? "",
        department: job.data.department ?? "",
        responsibilities: job.data.responsibilities ?? "",
        benefits: job.data.benefits ?? "",
        requirements: job.data.requirements ?? "",
        employment_type: toFormValue(job.data.employment_type),
        experience_level: toFormValue(job.data.experience_level),
        work_mode: toFormValue(job.data.work_mode) || "remote",
        location: job.data.location ?? "",
        application_deadline: job.data.application_deadline ?? "",
        salary_min: job.data.salary_min ?? undefined,
        salary_max: job.data.salary_max ?? undefined,
      }
    : undefined

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("editTitle")}
        description={t("editDescription")}
        icon={Pencil}
        showBackButton
        backButtonLabel={t("actions.back")}
        onBackClick={() => navigate(ROUTES.employer.jobs)}
      />
      {job.isPending ? (
        <Skeleton className="h-96 w-full rounded-lg" />
      ) : (
        <EmployerJobForm
          initialValues={initialValues}
          isPending={job.updateMutation.isPending}
          onSubmit={job.updateMutation.mutateAsync}
          submitText={t("actions.save")}
          pendingText={t("actions.saving")}
        />
      )}
      {job.data && (
        <EmployerJobSkills
          skills={job.data.skills ?? []}
          availableSkills={skills.data?.items ?? []}
          isLoadingSkills={skills.isPending}
          skillsError={skills.isError}
          isPending={
            job.attachSkillsMutation.isPending || job.detachSkillMutation.isPending
          }
          onAttach={job.attachSkillsMutation.mutateAsync}
          onDetach={(skillId) => job.detachSkillMutation.mutate(skillId)}
        />
      )}
      {job.data && (
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
