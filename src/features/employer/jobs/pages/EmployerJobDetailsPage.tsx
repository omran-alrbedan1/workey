import { Briefcase, ListChecks, Trophy } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import PageHeader from "@/components/shared/headers/PageHeader"
import ErrorState from "@/components/shared/states/ErrorState"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ROUTES } from "@/config"
import { useEmployerJob } from "../hooks/useEmployerJob"
import { useEmployerSkills } from "../hooks/useEmployerSkills"
import { useRankedCandidates } from "../hooks/useRankedCandidates"
import EmployerJobOverview from "../components/EmployerJobOverview"
import EmployerJobSkills from "../components/EmployerJobSkills"
import EmployerJobScreeningQuestionsTab from "../components/EmployerJobScreeningQuestionsTab"
import EmployerJobRankedCandidatesTab from "../components/EmployerJobRankedCandidatesTab"

export default function EmployerJobDetailsPage() {
  const { t } = useTranslation("employerJobs")
  const navigate = useNavigate()
  const { id } = useParams()
  const job = useEmployerJob(id)
  const skills = useEmployerSkills()
  const rankedCandidates = useRankedCandidates(id)

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
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="gap-2">
              <Briefcase className="h-4 w-4" />
              {t("tabs.overview")}
            </TabsTrigger>
            <TabsTrigger value="screening" className="gap-2">
              <ListChecks className="h-4 w-4" />
              {t("tabs.screeningQuestions")}
            </TabsTrigger>
            <TabsTrigger value="ranked" className="gap-2">
              <Trophy className="h-4 w-4" />
              {t("tabs.rankedCandidates")}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <EmployerJobOverview job={job.data} showSkills={false} />
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
          </TabsContent>

          {/* Screening Questions Tab */}
          <TabsContent value="screening">
            <EmployerJobScreeningQuestionsTab screeningQuestions={job.screeningQuestions ?? []} />
          </TabsContent>

          {/* Ranked Candidates Tab */}
          <TabsContent value="ranked">
            <EmployerJobRankedCandidatesTab
              candidates={rankedCandidates.data?.items ?? []}
              isLoading={rankedCandidates.isPending}
              isError={rankedCandidates.isError}
              onRetry={() => void rankedCandidates.refetch()}
            />
          </TabsContent>
        </Tabs>
      ) : null}
    </div>
  )
}
