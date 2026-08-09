import { CalendarCheck, Clock3, Eye, MoreHorizontal, Tag, UserRound } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
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
import type { EmployerCollection } from "@/features/employer/shared/services/employerResponse.utils"
import { keyOf, valueOf } from "@/lib/keyValue"
import type { EmployerInterview } from "../types/employerInterviews.types"
import { interviewCandidateName } from "../utils/interviewDisplay"

export default function EmployerInterviewsTable({
  interviews,
  isLoading,
  collection,
  onPageChange,
  candidateFallbackName,
}: {
  interviews: EmployerInterview[]
  isLoading: boolean
  collection?: EmployerCollection<EmployerInterview>
  onPageChange?: (page: number) => void
  candidateFallbackName?: string
}) {
  const { t, i18n } = useTranslation("employerInterviews")
  const navigate = useNavigate()

  const columns: Column<EmployerInterview>[] = [
    {
      key: "candidate",
      header: t("columns.candidate"),
      headerIcon: UserRound,
      cell: (item) => (
        <div>
          <p className="font-semibold text-text-primary">
            {interviewCandidateName(item, candidateFallbackName ?? t("unknownCandidate"))}
          </p>
          <p className="text-xs text-text-muted">
            {valueOf(item.mode ?? item.interview_mode, "-")}
          </p>
        </div>
      ),
    },
    {
      key: "interview_type",
      header: t("columns.type"),
      headerIcon: Tag,
      cell: (item) => (
        <span className="capitalize">{valueOf(item.type ?? item.interview_type, "-")}</span>
      ),
    },
    {
      key: "scheduled_at",
      header: t("columns.scheduled"),
      headerIcon: Clock3,
      cell: (item) => {
        const scheduledAt = item.scheduled_start_at ?? item.scheduled_at
        return scheduledAt
          ? new Date(scheduledAt).toLocaleString(i18n.language, {
              dateStyle: "medium",
              timeStyle: "short",
            })
          : "-"
      },
    },
    {
      key: "status",
      header: t("columns.status"),
      headerIcon: CalendarCheck,
      cell: (item) => {
        const statusKey = keyOf(item.status)
        return (
          <StatusBadge
            status={statusKey}
            label={valueOf(item.status) || t(`statuses.${statusKey}`, { defaultValue: statusKey })}
            variant="soft"
          />
        )
      },
    },
    {
      key: "actions",
      header: t("columns.actions"),
      className: "text-right",
      cell: (item) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>{t("actions.label")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => navigate(ROUTES.employer.interviewDetails(item.id))}>
                <Eye /> {t("actions.viewDetails")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      data={interviews}
      columns={columns}
      loading={isLoading}
      pagination={{
        total: collection?.pagination.total ?? interviews.length,
        page: collection?.pagination.currentPage ?? 1,
        lastPage: collection?.pagination.lastPage ?? 1,
        perPage: collection?.pagination.perPage,
      }}
      onPageChange={onPageChange ?? (() => {})}
      getRowId={(item) => item.id}
      emptyMessage={t("empty.title")}
      emptyDescription={t("empty.description")}
      className="bg-background-card shadow-card"
    />
  )
}
