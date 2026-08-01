import { CalendarClock } from "lucide-react"
import { useTranslation } from "react-i18next"
import PageHeader from "@/components/shared/headers/PageHeader"
import ErrorState from "@/components/shared/states/ErrorState"
import EmptyState from "@/components/shared/states/EmptyState"
import { Skeleton } from "@/components/ui/skeleton"
import { useEmployerJobs } from "@/features/employer/jobs/hooks/useEmployerJobs"
import { useEmployerApplicants } from "@/features/employer/applicants/hooks/useEmployerApplicants"
import EmployerInterviewsTable from "../components/EmployerInterviewsTable"
import { useEmployerInterviews } from "../hooks/useEmployerInterviews"

export default function EmployerInterviewsPage() {
  const { t } = useTranslation("employerInterviews")
  const jobs = useEmployerJobs()

  const firstJobId = jobs.data?.items[0]?.id
  const applicants = useEmployerApplicants(firstJobId)
  const firstApplicationId = applicants.data?.items[0]?.id

  const interviews = useEmployerInterviews(firstApplicationId)

  if (jobs.isError || applicants.isError || interviews.isError) {
    return (
      <ErrorState
        title={t("errors.title")}
        description={t("errors.description")}
        retry={() => void (jobs.isError ? jobs.refetch() : applicants.isError ? applicants.refetch() : interviews.refetch())}
      />
    )
  }

  const hasJobs = !!jobs.data?.items.length
  const hasApplicants = hasJobs && !!applicants.data?.items.length

  const isJobsLoading = jobs.isPending
  const isApplicantsLoading = hasJobs && applicants.isPending
  const isInterviewsLoading = hasApplicants && interviews.isPending

  const isLoading = isJobsLoading || isApplicantsLoading || isInterviewsLoading

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} icon={CalendarClock} />
      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-lg" />
      ) : !hasJobs ? (
        <EmptyState title={t("noJobs")} description={t("jobFilter")} />
      ) : !hasApplicants ? (
        <EmptyState title={t("empty.title")} description={t("empty.description")} />
      ) : (
        <EmployerInterviewsTable
          interviews={interviews.data?.items ?? []}
          isLoading={false}
        />
      )}
    </div>
  )
}
