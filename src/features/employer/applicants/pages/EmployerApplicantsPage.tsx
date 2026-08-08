import { useEffect, useState } from "react"
import { BriefcaseBusiness, MapPin, UsersRound } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import PageHeader from "@/components/shared/headers/PageHeader"
import ErrorState from "@/components/shared/states/ErrorState"
import { StatusBadge } from "@/components/shared/badges"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
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
  const selectedJob = jobs.data?.items.find((job) => String(job.id) === String(selectedJobId))
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
      <section className="rounded-lg border border-border bg-background-card p-4 shadow-card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BriefcaseBusiness className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                {t("jobFilter.label")}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <h2 className="truncate text-lg font-semibold text-text-primary">
                  {selectedJob?.title ?? t("jobFilter.noJobs")}
                </h2>
                {selectedJob?.status && <StatusBadge status={selectedJob.status} variant="soft" />}
              </div>
              {selectedJob && (
                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <UsersRound className="h-3.5 w-3.5 text-primary" />
                    {selectedJob.applications_count ?? 0} {t("columns.candidate")}
                  </span>
                  {selectedJob.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {selectedJob.location}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <Select
            disabled={jobs.isPending || !jobs.data?.items.length}
            value={selectedJobId == null ? "" : String(selectedJobId)}
            onValueChange={(value) => {
              applicants.setPage(1)
              navigate(`/employer/jobs/${value}/applicants`)
            }}
          >
            <SelectTrigger className="h-auto min-h-11 w-full justify-between border-border bg-background px-3 py-2 text-start shadow-none lg:w-80">
              <div className="min-w-0">
                <p className="text-xs font-medium text-text-muted">{t("jobFilter.label")}</p>
                <p className="truncate text-sm font-semibold text-text-primary">
                  {selectedJob?.title ?? t("jobFilter.noJobs")}
                </p>
              </div>
            </SelectTrigger>
            <SelectContent className="min-w-80">
              {jobs.data?.items.map((job) => (
                <SelectItem key={job.id} value={String(job.id)}>
                  <div className="flex min-w-0 flex-col gap-1 py-1">
                    <span className="truncate font-medium">{job.title}</span>
                    <span className="truncate text-xs text-text-muted">
                      {job.location || job.department || "-"}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>
      <EmployerApplicantsTable
        collection={applicants.data}
        isLoading={jobs.isPending || applicants.isPending}
        isUpdating={applicants.statusMutation.isPending || applicants.scheduleInterviewMutation.isPending}
        onPageChange={applicants.setPage}
        onStatusChange={(applicationId, status, note) =>
          applicants.statusMutation.mutate({ applicationId, input: { status: status as any, note } })
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
          applicants.statusMutation.mutateAsync({ applicationId, input: { status: status as any } })
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
