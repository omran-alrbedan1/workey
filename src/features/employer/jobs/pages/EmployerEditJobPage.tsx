import { Pencil } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import PageHeader from "@/components/shared/headers/PageHeader"
import { Skeleton } from "@/components/ui/skeleton"
import { ROUTES } from "@/config"
import EmployerFeatureError from "@/features/employer/shared/components/EmployerFeatureError"
import EmployerJobForm from "../components/EmployerJobForm"
import EmployerJobScreeningQuestions from "../components/EmployerJobScreeningQuestions"
import EmployerJobSkills from "../components/EmployerJobSkills"
import { useEmployerJob } from "../hooks/useEmployerJob"
import { useEmployerSkills } from "../hooks/useEmployerSkills"
import { keyOf } from "@/lib/keyValue"
import type {
  EmployerJobInput,
  EmploymentType,
  ExperienceLevel,
  JobWorkMode,
} from "../types/employerJobs.types"

export default function EmployerEditJobPage() {
  const { t } = useTranslation("employerJobs")
  const navigate = useNavigate()
  const { id } = useParams()
  const job = useEmployerJob(id)
  const skills = useEmployerSkills()

  if (job.isError) {
    return (
      <EmployerFeatureError
        title={t("editTitle")}
        error={job.error}
        retry={() => void job.refetch()}
      />
    )
  }

  const toFormValue = (v: unknown): string => {
    return keyOf(v)
  }

  const initialValues: EmployerJobInput | undefined = job.data
    ? {
        title: job.data.title,
        description: job.data.description ?? "",
        department: job.data.department ?? null,
        responsibilities: job.data.responsibilities ?? null,
        benefits: job.data.benefits ?? null,
        requirements: job.data.requirements ?? "",
        employment_type: toFormValue(job.data.employment_type) as EmploymentType,
        experience_level: toFormValue(job.data.experience_level) as ExperienceLevel,
        education_level: toFormValue(job.data.education_level) || null,
        work_mode: (toFormValue(job.data.work_mode) as JobWorkMode) || "remote",
        location: job.data.location ?? null,
        city_id: job.data.city?.id ?? null,
        application_deadline: job.data.application_deadline ?? null,
        salary_min: job.data.salary_min ?? null,
        salary_max: job.data.salary_max ?? null,
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
          isPending={job.attachSkillsMutation.isPending || job.detachSkillMutation.isPending}
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
          onUpdate={(questionId, input) =>
            job.updateScreeningQuestionMutation.mutateAsync({ questionId, input })
          }
          onDelete={job.deleteScreeningQuestionMutation.mutateAsync}
        />
      )}
    </div>
  )
}
