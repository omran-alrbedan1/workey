import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { CalendarPlus, Download, Eye, MoreHorizontal } from "lucide-react"
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
import { hasSelectedCv, selectedCvDownloadName } from "../utils/cv"
import ApplicationStatusChangeDialog from "./ApplicationStatusChangeDialog"

const nextStatuses = [
  "under_review",
  "shortlisted",
  "test_pending",
  "test_completed",
  "interview_pending",
  "final_review",
  "on_hold",
  "accepted",
  "rejected",
] as const

function getKey(v: unknown): string {
  return keyOf(v)
}

function getValue(v: unknown): string {
  return valueOf(v)
}

function hasAllowedAction(application: EmployerApplicant, actions: string[]) {
  if (!application.allowed_actions) return true
  return actions.some((action) => application.allowed_actions?.includes(action))
}

function useHandleDownload() {
  const [downloadingId, setDownloadingId] = useState<string | number | null>(null)

  const handleDownload = async (application: EmployerApplicant) => {
    if (!hasSelectedCv(application)) {
      showErrorToast("No CV attached to this application")
      return
    }

    setDownloadingId(application.id)
    try {
      const blob = await employerApplicantsService.downloadSelectedCv(application.id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = selectedCvDownloadName(application)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      showSuccessToast("CV downloaded")
    } catch {
      showErrorToast("Failed to download CV")
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
  const [statusDialogApplication, setStatusDialogApplication] = useState<EmployerApplicant | null>(null)
  const [targetStatus, setTargetStatus] = useState<ApplicationStatusKey | null>(null)

  const handleStatusClick = (application: EmployerApplicant, status: ApplicationStatusKey) => {
    setStatusDialogApplication(application)
    setTargetStatus(status)
    setStatusDialogOpen(true)
  }

  const handleStatusConfirm = (note?: string) => {
    if (statusDialogApplication && targetStatus) {
      onStatusChange(statusDialogApplication.id, targetStatus, note)
    }
    setStatusDialogOpen(false)
    setStatusDialogApplication(null)
    setTargetStatus(null)
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
        const hasInterviews = application.interviews_count != null && application.interviews_count > 0
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
            {hasAllowedAction(application, ["schedule_interview", "create_interview", "MANAGE_INTERVIEWS"]) && (
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
      className: "text-right",
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
              <DropdownMenuItem onSelect={() => navigate(ROUTES.employer.applicantDetails(application.id))}>
                <Eye /> {t("actions.viewDetails")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => void handleDownload(application)}
                disabled={!hasSelectedCv(application) || downloadingId === application.id}
              >
                <Download />{" "}
                {hasSelectedCv(application)
                  ? t("actions.downloadCv")
                  : t("actions.noCv", { defaultValue: "No CV attached" })}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {(application.allowed_status_transitions?.map((s) => s.key) || nextStatuses)
                .filter((status) => status !== getKey(application.status))
                .map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onSelect={() => handleStatusClick(application, status as ApplicationStatusKey)}
                  >
                    {t(`statuses.${status}`)}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]

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
