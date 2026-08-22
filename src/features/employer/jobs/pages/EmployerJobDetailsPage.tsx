import { Briefcase, ListChecks, Users } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import PageHeader from "@/components/shared/headers/PageHeader"
import ErrorState from "@/components/shared/states/ErrorState"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ROUTES } from "@/config"
import { useEmployerJob } from "../hooks/useEmployerJob"
import { useEmployerSkills } from "../hooks/useEmployerSkills"
import { useJobApplicants } from "../hooks/useJobApplicants"
import EmployerJobOverview from "../components/EmployerJobOverview"
import EmployerJobSkills from "../components/EmployerJobSkills"
import EmployerJobScreeningQuestionsTab from "../components/EmployerJobScreeningQuestionsTab"
import EmployerJobApplicantsTab from "../components/EmployerJobApplicantsTab"

export default function EmployerJobDetailsPage() {
  const { t } = useTranslation("employerJobs")
  const navigate = useNavigate()
  const { id } = useParams()
  const job = useEmployerJob(id)
  const skills = useEmployerSkills()
  const applicants = useJobApplicants(id)

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
        title={t("detailsTitle")}
        description={t("detailsDescription")}
        icon={Briefcase}
        showBackButton
        backButtonLabel={t("actions.back")}
        onBackClick={() => navigate(ROUTES.employer.jobs)}
      />

      {job.isPending ? (
        <Skeleton className="h-96 w-full rounded-xl" />
      ) : job.data ? (
        <Tabs defaultValue="information" className="space-y-6">
          <TabsList className="w-full">
            <TabsTrigger value="information" className="gap-2">
              <Briefcase className="h-4 w-4" />
              {t("tabs.jobInformation")}
            </TabsTrigger>
            <TabsTrigger value="applicants" className="gap-2">
              <Users className="h-4 w-4" />
              {t("tabs.applicants")}
            </TabsTrigger>
            <TabsTrigger value="screening" className="gap-2">
              <ListChecks className="h-4 w-4" />
              {t("tabs.screeningQuestions")}
            </TabsTrigger>
          </TabsList>

          {/* Job Information Tab */}
          <TabsContent value="information" className="space-y-6">
            <EmployerJobOverview job={job.data} showSkills={false} />
            <EmployerJobSkills
              skills={job.data.skills ?? []}
              availableSkills={skills.data?.items ?? []}
              isLoadingSkills={skills.isPending}
              skillsError={skills.isError}
              isPending={job.attachSkillsMutation.isPending || job.detachSkillMutation.isPending}
              onAttach={job.attachSkillsMutation.mutateAsync}
              onDetach={(skillId) => job.detachSkillMutation.mutate(skillId)}
            />
          </TabsContent>

          {/* Applicants Tab */}
          <TabsContent value="applicants">
            <EmployerJobApplicantsTab
              rows={applicants.rows}
              collection={applicants.collection}
              isLoading={applicants.isLoading}
              isError={applicants.isError}
              sortBy={applicants.sortBy}
              onSortChange={applicants.setSortBy}
              onRetry={applicants.retry}
              page={applicants.page}
              onPageChange={applicants.setPage}
            />
          </TabsContent>

          {/* Screening Questions Tab */}
          <TabsContent value="screening">
            <EmployerJobScreeningQuestionsTab
              questions={job.screeningQuestions ?? []}
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
          </TabsContent>
        </Tabs>
      ) : null}
    </div>
  )
}
