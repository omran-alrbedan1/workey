import { CalendarCheck, Clock3, Eye, MoreHorizontal, Tag, UserRound, Video } from "lucide-react"
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

interface EmployerInterviewMobileCardProps {
  interview: EmployerInterview
  candidateFallbackName?: string
  onViewDetails: (interview: EmployerInterview) => void
}

function EmployerInterviewMobileCard({
  interview,
  candidateFallbackName,
  onViewDetails,
}: EmployerInterviewMobileCardProps) {
  const { t, i18n } = useTranslation("employerInterviews")
  const statusKey = keyOf(interview.status)
  const scheduledAt = interview.scheduled_start_at ?? interview.scheduled_at

  return (
    <article className="rounded-2xl border border-border bg-background-card p-4 shadow-card">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
          <Video className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-text-primary">
            {interviewCandidateName(interview, candidateFallbackName ?? t("unknownCandidate"))}
          </h3>
          <p className="truncate text-xs text-text-muted">
            {String(valueOf(interview.mode ?? interview.interview_mode, "-"))}
          </p>
        </div>
        <StatusBadge
          status={statusKey}
          label={String(valueOf(interview.status) || t(`statuses.${statusKey}`, { defaultValue: statusKey }))}
          variant="soft"
        />
      </div>

      <div className="mt-4 space-y-2 rounded-xl bg-background-secondary p-3 text-xs text-text-secondary">
        <p className="flex items-center gap-2">
          <Tag className="h-3.5 w-3.5 text-primary" />
          {t("columns.type")}: <span className="capitalize">{valueOf(interview.type ?? interview.interview_type, "-")}</span>
        </p>
        <p className="flex items-center gap-2">
          <Clock3 className="h-3.5 w-3.5 text-primary" />
          {t("columns.scheduled")}:{" "}
          {scheduledAt
            ? new Date(scheduledAt).toLocaleString(i18n.language, {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : "-"}
        </p>
      </div>

      <div className="mt-4">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onViewDetails(interview)}
          className="w-full"
        >
          <Eye className="mr-2 h-4 w-4" /> {t("actions.viewDetails")}
        </Button>
      </div>
    </article>
  )
}

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

  const handleViewDetails = (interview: EmployerInterview) => navigate(ROUTES.employer.interviewDetails(interview.id))

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
      className: "text-end",
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
              <DropdownMenuItem onSelect={() => handleViewDetails(item)}>
                <Eye /> {t("actions.viewDetails")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]

  const MobileInterviewCard = ({ item }: { item: EmployerInterview }) => (
    <EmployerInterviewMobileCard
      interview={item}
      candidateFallbackName={candidateFallbackName}
      onViewDetails={handleViewDetails}
    />
  )

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
      mobileCardComponent={MobileInterviewCard}
    />
  )
}
