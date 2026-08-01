import { CalendarCheck, Eye, UserRound } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/config"
import { keyOf, valueOf } from "@/lib/keyValue"
import type { EmployerInterview } from "../types/employerInterviews.types"
import { DataTable } from "@/components/shared/custom/DataTable"

export default function EmployerInterviewsTable({
  interviews,
  isLoading,
}: {
  interviews: EmployerInterview[]
  isLoading: boolean
}) {
  const { t } = useTranslation("employerInterviews")
  const navigate = useNavigate()

  const columns = [
    {
      key: "candidate",
      header: t("columns.candidate"),
      cell: (item: EmployerInterview) => (
        <div className="flex items-center gap-2">
          <UserRound className="h-4 w-4 text-text-muted" />
          <span className="font-medium">
            {item.candidate?.full_name || item.candidate?.name || item.candidate?.email || t("unknownCandidate")}
          </span>
        </div>
      ),
    },
    {
      key: "interview_type",
      header: t("columns.type"),
      cell: (item: EmployerInterview) => (
        <span className="capitalize">{item.interview_type ?? "-"}</span>
      ),
    },
    {
      key: "scheduled_at",
      header: t("columns.scheduled"),
      cell: (item: EmployerInterview) =>
        item.scheduled_at
          ? new Date(item.scheduled_at).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })
          : "-",
    },
    {
      key: "status",
      header: t("columns.status"),
      cell: (item: EmployerInterview) => {
        const statusKey = keyOf(item.status)
        return (
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            statusKey === "completed"
              ? "bg-green-100 text-green-700"
              : statusKey === "cancelled"
                ? "bg-red-100 text-red-700"
                : statusKey === "scheduled"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
          }`}>
            {valueOf(item.status) || "-"}
          </span>
        )
      },
    },
    {
      key: "actions",
      header: t("columns.actions"),
      cell: (item: EmployerInterview) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate(ROUTES.employer.interviewDetails(item.id))}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      data={interviews}
      columns={columns}
      loading={isLoading}
      pagination={{ total: interviews.length, page: 1, lastPage: 1 }}
      onPageChange={() => {}}
      getRowId={(item) => item.id}
      empty={{
        title: t("empty.title"),
        description: t("empty.description"),
        icon: CalendarCheck,
      }}
    />
  )
}
