import { CalendarClock, UserRound } from "lucide-react"
import { useTranslation } from "react-i18next"
import PageHeader from "@/components/shared/headers/PageHeader"
import ErrorState from "@/components/shared/states/ErrorState"
import { StatusBadge } from "@/components/shared/badges"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import EmployerInterviewsTable from "../components/EmployerInterviewsTable"
import { useEmployerInterviewsPage } from "../hooks/useEmployerInterviewsPage"
import type { EmployerInterviewsPageModel } from "../hooks/useEmployerInterviewsPage"

export default function EmployerInterviewsPage() {
  const { t } = useTranslation("employerInterviews")
  const model = useEmployerInterviewsPage(t("unknownCandidate"))

  if (model.isError) {
    return (
      <ErrorState
        title={t("errors.title")}
        description={t("errors.description")}
        retry={model.retry}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} icon={CalendarClock} />
      <InterviewScopeSelector model={model} />
      <EmployerInterviewsTable
        interviews={model.interviews.data?.items ?? []}
        isLoading={model.isLoading}
        collection={model.interviews.data}
        candidateFallbackName={model.selectedApplicationCandidateName}
      />
    </div>
  )
}

function InterviewScopeSelector({ model }: { model: EmployerInterviewsPageModel }) {
  const { t } = useTranslation("employerInterviews")
  const selectedApplication = model.selectedApplication

  return (
    <section className="rounded-lg border border-border bg-background-card p-4 shadow-card">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CalendarClock className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
              {t("scope.label")}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <h2 className="truncate text-lg font-semibold text-text-primary">
                {model.selectedJob?.title ?? t("scope.noJobs")}
              </h2>
              {selectedApplication?.status && (
                <StatusBadge status={selectedApplication.status} variant="soft" />
              )}
            </div>
            <p className="mt-1 text-sm text-text-muted">
              {selectedApplication
                ? t("scope.selectedApplication", {
                    name:
                      model.applicationOptions.find(
                        (option) =>
                          String(option.application.id) === String(selectedApplication.id),
                      )?.candidateName ?? t("unknownCandidate"),
                  })
                : t("scope.noApplications")}
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:w-[44rem]">
          <Select
            disabled={model.jobs.isPending || !model.jobs.data?.items.length}
            value={model.selectedJobId}
            onValueChange={model.selectJob}
          >
            <SelectTrigger className="h-auto min-h-11 justify-between border-border bg-background px-3 py-2 text-start shadow-none">
              <div className="min-w-0">
                <p className="text-xs font-medium text-text-muted">{t("scope.job")}</p>
                <p className="truncate text-sm font-semibold text-text-primary">
                  {model.selectedJob?.title ?? t("scope.noJobs")}
                </p>
              </div>
            </SelectTrigger>
            <SelectContent>
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

          <Select
            disabled={model.applicants.isPending || !model.applicationOptions.length}
            value={model.selectedApplicationId}
            onValueChange={model.selectApplication}
          >
            <SelectTrigger className="h-auto min-h-11 justify-between border-border bg-background px-3 py-2 text-start shadow-none">
              <div className="min-w-0">
                <p className="text-xs font-medium text-text-muted">{t("scope.application")}</p>
                <p className="truncate text-sm font-semibold text-text-primary">
                  {model.applicationOptions.find(
                    (option) => String(option.application.id) === model.selectedApplicationId,
                  )?.candidateName ?? t("scope.noApplications")}
                </p>
              </div>
            </SelectTrigger>
            <SelectContent>
              {model.applicationOptions.map(({ application, candidateName }) => (
                <SelectItem key={application.id} value={String(application.id)}>
                  <div className="flex min-w-0 flex-col gap-1 py-1">
                    <span className="inline-flex items-center gap-2 truncate font-medium">
                      <UserRound className="h-3.5 w-3.5 text-primary" />
                      {candidateName}
                    </span>
                    <span className="truncate text-xs text-text-muted">
                      {t("scope.interviewCount", {
                        count: application.interviews_count ?? 0,
                      })}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  )
}
