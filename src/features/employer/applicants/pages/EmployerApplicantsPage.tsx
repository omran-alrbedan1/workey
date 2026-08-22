import { BriefcaseBusiness, MapPin, UsersRound } from "lucide-react"
import { useTranslation } from "react-i18next"
import PageHeader from "@/components/shared/headers/PageHeader"
import { StatusBadge } from "@/components/shared/badges"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import EmployerFeatureError from "@/features/employer/shared/components/EmployerFeatureError"
import ApplicationTestsDialog from "../components/ApplicationTestsDialog"
import EmployerApplicantsTable from "../components/EmployerApplicantsTable"
import ScheduleInterviewDialog from "../components/ScheduleInterviewDialog"
import { useEmployerApplicantsPage } from "../hooks/useEmployerApplicantsPage"
import type { EmployerApplicantsPageModel } from "../hooks/useEmployerApplicantsPage"

export default function EmployerApplicantsPage() {
  const { t } = useTranslation("employerApplicants")
  const model = useEmployerApplicantsPage()

  if (model.isError) {
    return (
      <EmployerFeatureError
        title={t("title")}
        error={model.jobs.error ?? model.applicants.error}
        retry={model.retry}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} icon={UsersRound} />
      <JobSelector model={model} />
      <ApplicantsTable model={model} />
      <ApplicantsDialogs model={model} />
    </div>
  )
}

function JobSelector({ model }: { model: EmployerApplicantsPageModel }) {
  const { t } = useTranslation("employerApplicants")
  const selectedJob = model.selectedJob

  return (
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
            {selectedJob && <SelectedJobMeta job={selectedJob} />}
          </div>
        </div>

        <Select
          disabled={model.jobs.isPending || !model.jobs.data?.items.length}
          value={model.selectedJobId == null ? "" : String(model.selectedJobId)}
          onValueChange={model.selectJob}
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
            {model.jobs.data?.items.map((job) => (
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
  )
}

function SelectedJobMeta({
  job,
}: {
  job: NonNullable<EmployerApplicantsPageModel["selectedJob"]>
}) {
  const { t } = useTranslation("employerApplicants")

  return (
    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-text-muted">
      <span className="inline-flex items-center gap-1.5">
        <UsersRound className="h-3.5 w-3.5 text-primary" />
        {job.applications_count ?? 0} {t("columns.candidate")}
      </span>
      {job.location && (
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          {job.location}
        </span>
      )}
    </div>
  )
}

function ApplicantsTable({ model }: { model: EmployerApplicantsPageModel }) {
  return (
    <EmployerApplicantsTable
      collection={model.applicants.data}
      isLoading={model.isLoading}
      isUpdating={model.isUpdating}
      onPageChange={model.applicants.setPage}
      onStatusChange={model.changeStatus}
      onReviewTests={model.setTestApplication}
      onScheduleInterview={model.setInterviewApplication}
    />
  )
}

function ApplicantsDialogs({ model }: { model: EmployerApplicantsPageModel }) {
  return (
    <>
      <ApplicationTestsDialog
        application={model.testApplication}
        open={model.testApplication !== null}
        onOpenChange={(open) => {
          if (!open) model.setTestApplication(null)
        }}
        onNextStep={model.moveToNextStep}
      />
      <ScheduleInterviewDialog
        application={model.interviewApplication}
        open={model.interviewApplication !== null}
        isPending={model.applicants.scheduleInterviewMutation.isPending}
        onOpenChange={(open) => {
          if (!open) model.setInterviewApplication(null)
        }}
        onSubmit={model.scheduleInterview}
      />
    </>
  )
}
