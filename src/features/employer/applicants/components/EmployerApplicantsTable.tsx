import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { DataTable, type Column } from "@/components/shared/custom/DataTable"
import { StatusBadge } from "@/components/shared/badges"
import type { EmployerCollection } from "@/features/employer/shared/services/employerResponse.utils"
import type { EmployerApplicant } from "../types/employerApplicants.types"
import { CalendarPlus, Download, Eye, MoreHorizontal } from "lucide-react"
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
import { showSuccessToast, showErrorToast } from "@/lib/toast"
import { employerApplicantsService } from "../services/employerApplicants.service"

const nextStatuses = [
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
  if (!v) return ""
  if (typeof v === "string") return v
  if (typeof v === "object") return (v as { key?: string }).key ?? ""
  return ""
}

function getValue(v: unknown): string {
  if (!v) return ""
  if (typeof v === "string") return v
  if (typeof v === "object") {
    const record = v as { value?: string; label?: string; name?: string; key?: string }
    return record.value ?? record.label ?? record.name ?? record.key ?? ""
  }
  return ""
}

function useHandleDownload() {
  const [downloadingId, setDownloadingId] = useState<string | number | null>(null)
  const handleDownload = async (applicationId: string | number) => {
    setDownloadingId(applicationId)
    try {
      const blob = await employerApplicantsService.downloadSelectedCv(applicationId)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `cv-${applicationId}.pdf`
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
  onStatusChange: (applicationId: string | number, status: string) => void
  onReviewTests: (application: EmployerApplicant) => void
  onScheduleInterview: (application: EmployerApplicant) => void
}) {
  const { t, i18n } = useTranslation("employerApplicants")
  const navigate = useNavigate()
  const { downloadingId, handleDownload } = useHandleDownload()
  const columns: Column<EmployerApplicant>[] = [
    {
      key: "candidate",
      header: t("columns.candidate"),
      cell: (application) => {
        const candidate = application.candidate
        return (
          <div>
            <p className="font-semibold text-text-primary">
              {candidate?.full_name || candidate?.name || candidate?.email || t("unknownCandidate")}
            </p>
            <p className="text-xs text-text-muted">
              {candidate?.headline || candidate?.profile?.headline || candidate?.email || "—"}
            </p>
          </div>
        )
      },
    },
    {
      key: "applied",
      header: t("columns.applied"),
      cell: (application) => {
        const date = application.applied_at || application.created_at
        return date ? new Date(date).toLocaleDateString(i18n.language) : "—"
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
      cell: (application) =>
        application.match_score == null
          ? "—"
          : `${application.match_score <= 1 ? Math.round(application.match_score * 100) : Math.round(application.match_score)}%`,
    },
    {
      key: "assessments",
      header: t("columns.assessments"),
      cell: (application) => (
        <div className="flex flex-col items-start gap-1">
          <button type="button" className="text-start text-sm text-primary hover:underline" onClick={() => onReviewTests(application)}>
            {t("assessmentCounts", { tests: application.tests_count ?? 0, interviews: application.interviews_count ?? 0 })}
          </button>
          <button type="button" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline" onClick={() => onScheduleInterview(application)}>
            <CalendarPlus className="h-3.5 w-3.5" /> {t("actions.scheduleInterview")}
          </button>
        </div>
      ),
    },
    {
      key: "actions",
      header: t("columns.nextStep"),
      className: "text-right",
      cell: (application) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8" disabled={isUpdating} aria-label={t("actions.menuFor", {
                name:
                  application.candidate?.full_name ||
                  application.candidate?.name ||
                  t("unknownCandidate"),
              })}>
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
                onSelect={() => void handleDownload(application.id)}
                disabled={downloadingId === application.id}
              >
                <Download /> {t("actions.downloadCv")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {nextStatuses
                .filter((status) => status !== getKey(application.status))
                .map((status) => (
                  <DropdownMenuItem key={status} onSelect={() => onStatusChange(application.id, status)}>
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
  )
}
