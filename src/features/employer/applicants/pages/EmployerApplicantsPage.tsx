import { useEffect, useState } from "react"
import { UsersRound } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import PageHeader from "@/components/shared/headers/PageHeader"
import ErrorState from "@/components/shared/states/ErrorState"
import { useEmployerJobs } from "@/features/employer/jobs/hooks/useEmployerJobs"
import EmployerApplicantsTable from "../components/EmployerApplicantsTable"
import ApplicationTestsDialog from "../components/ApplicationTestsDialog"
import ScheduleInterviewDialog from "../components/ScheduleInterviewDialog"
import { useEmployerApplicants } from "../hooks/useEmployerApplicants"
import type { EmployerApplicant } from "../types/employerApplicants.types"

export default function EmployerApplicantsPage() {
  const { t } = useTranslation("employerApplicants")
  const { jobId } = useParams()
  const navigate = useNavigate()
  const jobs = useEmployerJobs()
  const selectedJobId = jobId || jobs.data?.items[0]?.id
  const applicants = useEmployerApplicants(selectedJobId)
  const [testApplication, setTestApplication] = useState<EmployerApplicant | null>(null)
  const [interviewApplication, setInterviewApplication] = useState<EmployerApplicant | null>(null)

  useEffect(() => {
    if (!jobId && selectedJobId) {
      navigate(`/employer/jobs/${selectedJobId}/applicants`, { replace: true })
    }
  }, [jobId, navigate, selectedJobId])

  if (jobs.isError || applicants.isError) {
    return (
      <ErrorState
        variant="network"
        title={t("errors.title")}
        description={t("errors.description")}
        retry={() => void (jobs.isError ? jobs.refetch() : applicants.refetch())}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} icon={UsersRound} />
      <div className="flex flex-col gap-2 sm:max-w-md">
        <label htmlFor="applicant-job" className="text-sm font-medium text-text-primary">
          {t("jobFilter.label")}
        </label>
        <select
          id="applicant-job"
          className="h-10 rounded-md border border-border bg-background-card px-3 text-sm"
          disabled={jobs.isPending || !jobs.data?.items.length}
          value={selectedJobId == null ? "" : String(selectedJobId)}
          onChange={(event) => {
            applicants.setPage(1)
            navigate(`/employer/jobs/${event.target.value}/applicants`)
          }}
        >
          {!jobs.data?.items.length && <option value="">{t("jobFilter.noJobs")}</option>}
          {jobs.data?.items.map((job) => (
            <option key={job.id} value={String(job.id)}>
              {job.title}
            </option>
          ))}
        </select>
      </div>
      <EmployerApplicantsTable
        collection={applicants.data}
        isLoading={jobs.isPending || applicants.isPending}
        isUpdating={applicants.statusMutation.isPending || applicants.scheduleInterviewMutation.isPending}
        onPageChange={applicants.setPage}
        onStatusChange={(applicationId, status) =>
          applicants.statusMutation.mutate({ applicationId, input: { status } })
        }
        onReviewTests={setTestApplication}
        onScheduleInterview={setInterviewApplication}
      />
      <ApplicationTestsDialog
        application={testApplication}
        open={testApplication !== null}
        onOpenChange={(open) => {
          if (!open) setTestApplication(null)
        }}
        onNextStep={(applicationId, status) =>
          applicants.statusMutation.mutateAsync({ applicationId, input: { status } })
        }
      />
      <ScheduleInterviewDialog
        application={interviewApplication}
        open={interviewApplication !== null}
        isPending={applicants.scheduleInterviewMutation.isPending}
        onOpenChange={(open) => {
          if (!open) setInterviewApplication(null)
        }}
        onSubmit={(applicationId, input) =>
          applicants.scheduleInterviewMutation.mutateAsync({ applicationId, input })
        }
      />
    </div>
  )
}
