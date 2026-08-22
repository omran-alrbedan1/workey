import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import {
  CalendarPlus,
  Download,
  Eye,
  FileText,
  MailQuestion,
  MoreHorizontal,
  User,
  Calendar,
  Target,
} from "lucide-react"
import { DataTable, type Column } from "@/components/shared/custom/DataTable"
import { StatusBadge } from "@/components/shared/badges"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ROUTES } from "@/config"
import { keyOf, valueOf } from "@/lib/keyValue"
import { showErrorToast, showSuccessToast } from "@/lib/toast"
import type { EmployerCollection } from "@/features/employer/shared/services/employerResponse.utils"
import type { ApplicationStatusKey, EmployerApplicant } from "../types/employerApplicants.types"
import { employerApplicantsService } from "../services/employerApplicants.service"
import { candidateDisplayName, candidateSecondaryText } from "../utils/candidateDisplay"
import { canDownloadCv, getApplicationCvDocument } from "../utils/cv"
import { getAllowedApplicationActions } from "../utils/applicationActions"
import ApplicationStatusChangeDialog from "./ApplicationStatusChangeDialog"

function getKey(v: unknown): string {
  return keyOf(v)
}

function getValue(v: unknown): string {
  return valueOf(v)
}

interface EmployerApplicantMobileCardProps {
  application: EmployerApplicant
  isUpdating: boolean
  downloadingId: string | number | null
  onViewDetails: (application: EmployerApplicant) => void
  onDownload: (application: EmployerApplicant) => void
  onStatusChange: (application: EmployerApplicant, status: ApplicationStatusKey) => void
  onScheduleInterview: (application: EmployerApplicant) => void
  onRequestInformation: (application: EmployerApplicant) => void
}

function EmployerApplicantMobileCard({
  application,
  isUpdating,
  downloadingId,
  onViewDetails,
  onDownload,
  onStatusChange,
  onScheduleInterview,
  onRequestInformation,
}: EmployerApplicantMobileCardProps) {
  const { t, i18n } = useTranslation("employerApplicants")
  const navigate = useNavigate()
  const statusKey = getKey(application.status)
  const statusValue = getValue(application.status)
  const allowedActions = getAllowedApplicationActions(application)
  const score = application.match_score ?? application.matching_score

  return (
    <article className="rounded-2xl border border-border bg-background-card p-4 shadow-card">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
          <User className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-text-primary">
            {candidateDisplayName(application, t("unknownCandidate"))}
          </h3>
          <p className="truncate text-xs text-text-muted">
            {candidateSecondaryText(application, "-")}
          </p>
        </div>
        <StatusBadge
          status={statusKey}
          label={statusValue || t(`statuses.${statusKey}`, { defaultValue: statusKey })}
          variant="soft"
        />
      </div>

      <div className="mt-4 space-y-2 rounded-xl bg-background-secondary p-3 text-xs text-text-secondary">
        <p className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          {t("columns.applied")}:{" "}
          {(() => {
            const date = application.applied_at || application.created_at
            return date ? new Date(date).toLocaleDateString(i18n.language) : "-"
          })()}
        </p>
        <p className="flex items-center gap-2">
          <Target className="h-3.5 w-3.5 text-primary" />
          {t("columns.match")}:{" "}
          {score == null ? "-" : `${score <= 1 ? Math.round(score * 100) : Math.round(score)}%`}
        </p>
        <p className="flex items-center gap-2">
          <FileText className="h-3.5 w-3.5 text-primary" />
          {t("columns.assessments")}:{" "}
          {(() => {
            const hasTests = application.tests_count != null && application.tests_count > 0
            const hasInterviews =
              application.interviews_count != null && application.interviews_count > 0
            const hasData = hasTests || hasInterviews
            return hasData
              ? t("assessmentCounts", {
                  tests: application.tests_count ?? 0,
                  interviews: application.interviews_count ?? 0,
                })
              : "-"
          })()}
        </p>
      </div>

      <div className="mt-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" disabled={isUpdating} className="w-full">
              {t("actions.label")} <MoreHorizontal className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>{t("actions.label")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => onViewDetails(application)}>
              <Eye /> {t("actions.viewDetails")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => onDownload(application)}
              disabled={!canDownloadCv(application) || downloadingId === application.id}
            >
              <Download />{" "}
              {canDownloadCv(application)
                ? t("actions.downloadCv")
                : t("actions.noCv", { defaultValue: "No CV attached" })}
            </DropdownMenuItem>
            {(allowedActions.statusTargets.length > 0 || allowedActions.flows.length > 0) && (
              <>
                <DropdownMenuSeparator />
                {allowedActions.statusTargets.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onSelect={() => onStatusChange(application, status as ApplicationStatusKey)}
                  >
                    {t(`statuses.${status}`)}
                  </DropdownMenuItem>
                ))}
                {allowedActions.flows.includes("assign_test") && (
                  <DropdownMenuItem onSelect={() => navigate(ROUTES.employer.tests)}>
                    <FileText /> {t("actions.assignTest")}
                  </DropdownMenuItem>
                )}
                {allowedActions.flows.includes("schedule_interview") && (
                  <DropdownMenuItem onSelect={() => onScheduleInterview(application)}>
                    <CalendarPlus /> {t("actions.scheduleInterview")}
                  </DropdownMenuItem>
                )}
                {allowedActions.flows.includes("request_information") && (
                  <DropdownMenuItem onSelect={() => onRequestInformation(application)}>
                    <MailQuestion /> {t("actions.requestInformation")}
                  </DropdownMenuItem>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </article>
  )
}

function useHandleDownload() {
  const { t } = useTranslation(["employerApplicants", "common"])
  const [downloadingId, setDownloadingId] = useState<string | number | null>(null)

  const handleDownload = async (application: EmployerApplicant) => {
    if (!canDownloadCv(application)) {
      showErrorToast(t("common:applicantsToasts.noCvAttached"))
      return
    }

    setDownloadingId(application.id)
    try {
      const blob = await employerApplicantsService.downloadCv(application.id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = getApplicationCvDocument(application)?.name ?? `cv-${application.id}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      showSuccessToast(t("common:applicantsToasts.cvDownloaded"))
    } catch {
      showErrorToast(t("common:applicantsToasts.cvDownloadFailed"))
    } finally {
      setDownloadingId(null)
    }
  }

  return { downloadingId, handleDownload }
}

export default function EmployerApplicantsTable({
  collection,
  isLoading,
  isUpdating,
  onPageChange,
  onStatusChange,
  onReviewTests,
  onScheduleInterview,
}: {
  collection?: EmployerCollection<EmployerApplicant>
  isLoading: boolean
  isUpdating: boolean
  onPageChange: (page: number) => void
  onStatusChange: (applicationId: string | number, status: string, note?: string) => void
  onReviewTests: (application: EmployerApplicant) => void
  onScheduleInterview: (application: EmployerApplicant) => void
}) {
  const { t, i18n } = useTranslation("employerApplicants")
  const navigate = useNavigate()
  const { downloadingId, handleDownload } = useHandleDownload()
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [statusDialogApplication, setStatusDialogApplication] = useState<EmployerApplicant | null>(
    null,
  )
  const [targetStatus, setTargetStatus] = useState<ApplicationStatusKey | null>(null)

  const handleStatusClick = (application: EmployerApplicant, status: ApplicationStatusKey) => {
    setStatusDialogApplication(application)
    setTargetStatus(status)
    setStatusDialogOpen(true)
  }

  const handleStatusConfirm = async (note?: string) => {
    if (statusDialogApplication && targetStatus) {
      await onStatusChange(statusDialogApplication.id, targetStatus, note)
      setStatusDialogOpen(false)
      setStatusDialogApplication(null)
      setTargetStatus(null)
    }
  }

  const handleViewDetails = (application: EmployerApplicant) =>
    navigate(ROUTES.employer.applicantDetails(application.id))
  const handleRequestInformation = (application: EmployerApplicant) => {
    navigate(ROUTES.employer.applicantDetails(application.id), {
      state: { openInformationRequest: true },
    })
  }
  const handleCardStatusChange = (application: EmployerApplicant, status: ApplicationStatusKey) => {
    handleStatusClick(application, status)
  }

  const columns: Column<EmployerApplicant>[] = [
    {
      key: "candidate",
      header: t("columns.candidate"),
      cell: (application) => (
        <div>
          <p className="font-semibold text-text-primary">
            {candidateDisplayName(application, t("unknownCandidate"))}
          </p>
          <p className="text-xs text-text-muted">{candidateSecondaryText(application, "-")}</p>
        </div>
      ),
    },
    {
      key: "applied",
      header: t("columns.applied"),
      cell: (application) => {
        const date = application.applied_at || application.created_at
        return date ? new Date(date).toLocaleDateString(i18n.language) : "-"
      },
    },
    {
      key: "status",
      header: t("columns.status"),
      cell: (application) => {
        const statusKey = getKey(application.status)
        const statusValue = getValue(application.status)
        return (
          <StatusBadge
            status={statusKey}
            label={statusValue || t(`statuses.${statusKey}`, { defaultValue: statusKey })}
            variant="soft"
          />
        )
      },
    },
    {
      key: "match",
      header: t("columns.match"),
      cell: (application) => {
        const score = application.match_score ?? application.matching_score
        return score == null ? "-" : `${score <= 1 ? Math.round(score * 100) : Math.round(score)}%`
      },
    },
    {
      key: "assessments",
      header: t("columns.assessments"),
      cell: (application) => {
        const hasTests = application.tests_count != null && application.tests_count > 0
        const hasInterviews =
          application.interviews_count != null && application.interviews_count > 0
        const hasData = hasTests || hasInterviews

        return (
          <div className="flex flex-col items-start gap-1">
            {hasData ? (
              <button
                type="button"
                className="text-start text-sm text-primary hover:underline"
                onClick={() => onReviewTests(application)}
              >
                {t("assessmentCounts", {
                  tests: application.tests_count ?? 0,
                  interviews: application.interviews_count ?? 0,
                })}
              </button>
            ) : (
              <span className="text-sm text-text-muted">-</span>
            )}
            {getAllowedApplicationActions(application).flows.includes("schedule_interview") && (
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                onClick={() => onScheduleInterview(application)}
              >
                <CalendarPlus className="h-3.5 w-3.5" /> {t("actions.scheduleInterview")}
              </button>
            )}
          </div>
        )
      },
    },
    {
      key: "actions",
      header: t("columns.nextStep"),
      className: "text-end",
      cell: (application) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                disabled={isUpdating}
                aria-label={t("actions.menuFor", {
                  name: candidateDisplayName(application, t("unknownCandidate")),
                })}
              >
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>{t("actions.label")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => navigate(ROUTES.employer.applicantDetails(application.id))}
              >
                <Eye /> {t("actions.viewDetails")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => void handleDownload(application)}
                disabled={!canDownloadCv(application) || downloadingId === application.id}
              >
                <Download />{" "}
                {canDownloadCv(application)
                  ? t("actions.downloadCv")
                  : t("actions.noCv", { defaultValue: "No CV attached" })}
              </DropdownMenuItem>
              {(() => {
                const allowedActions = getAllowedApplicationActions(application)
                if (allowedActions.statusTargets.length === 0 && allowedActions.flows.length === 0)
                  return null
                return (
                  <>
                    <DropdownMenuSeparator />
                    {allowedActions.statusTargets.map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onSelect={() =>
                          handleStatusClick(application, status as ApplicationStatusKey)
                        }
                      >
                        {t(`statuses.${status}`)}
                      </DropdownMenuItem>
                    ))}
                    {allowedActions.flows.includes("assign_test") && (
                      <DropdownMenuItem onSelect={() => navigate(ROUTES.employer.tests)}>
                        <FileText /> {t("actions.assignTest")}
                      </DropdownMenuItem>
                    )}
                    {allowedActions.flows.includes("schedule_interview") && (
                      <DropdownMenuItem onSelect={() => onScheduleInterview(application)}>
                        <CalendarPlus /> {t("actions.scheduleInterview")}
                      </DropdownMenuItem>
                    )}
                    {allowedActions.flows.includes("request_information") && (
                      <DropdownMenuItem onSelect={() => handleRequestInformation(application)}>
                        <MailQuestion /> {t("actions.requestInformation")}
                      </DropdownMenuItem>
                    )}
                  </>
                )
              })()}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]

  const MobileApplicantCard = ({ item }: { item: EmployerApplicant }) => (
    <EmployerApplicantMobileCard
      application={item}
      isUpdating={isUpdating}
      downloadingId={downloadingId}
      onViewDetails={handleViewDetails}
      onDownload={handleDownload}
      onStatusChange={handleCardStatusChange}
      onScheduleInterview={onScheduleInterview}
      onRequestInformation={handleRequestInformation}
    />
  )

  return (
    <>
      <DataTable
        data={collection?.items ?? []}
        columns={columns}
        getRowId={(application) => application.id}
        loading={isLoading}
        pagination={{
          total: collection?.pagination.total ?? 0,
          page: collection?.pagination.currentPage ?? 1,
          lastPage: collection?.pagination.lastPage ?? 1,
          perPage: collection?.pagination.perPage,
        }}
        onPageChange={onPageChange}
        emptyMessage={t("empty.title")}
        emptyDescription={t("empty.description")}
        className="bg-background-card shadow-card"
        mobileCardComponent={MobileApplicantCard}
      />
      <ApplicationStatusChangeDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        currentStatus={statusDialogApplication?.status || null}
        targetStatus={targetStatus}
        onConfirm={handleStatusConfirm}
        isSubmitting={isUpdating}
      />
    </>
  )
}
