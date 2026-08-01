import {
  BriefcaseBusiness,
  ClipboardList,
  MapPin,
  ShieldCheck,
  MapPinned,
  UsersRound,
} from "lucide-react"
import { DataTable, type Column } from "@/components/shared/custom/DataTable"
import { StatusBadge } from "@/components/shared/badges"
import type { AdminPagination } from "@/features/admin/shared/types/adminApi.types"
import type { AdminJobRecord } from "../types/adminJobs.types"
import { images } from "@/constants/images"
import { ROUTES } from "@/config"
import { keyOf, valueOf } from "@/lib/keyValue"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

export default function AdminJobsTable({
  jobs,
  isLoading,
  pagination,
  onPageChange,
}: {
  jobs: AdminJobRecord[]
  isLoading: boolean
  pagination?: AdminPagination
  onPageChange: (page: number) => void
}) {
  const { t } = useTranslation("adminJobs")
  const navigate = useNavigate()
  const columns: Column<AdminJobRecord>[] = [
    {
      key: "job",
      header: t("columns.job"),
      headerIcon: BriefcaseBusiness,
      cell: (job) => (
        <div>
          <p className="font-semibold text-text-primary">{job.title}</p>
          <p className="text-xs text-text-muted">{job.company?.name || t("unknownCompany")}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: t("columns.status"),
      headerIcon: ShieldCheck,
      cell: (job) => <StatusBadge status={job.status} variant="soft" />,
    },
    {
      key: "type",
      header: t("columns.employment"),
      headerIcon: ClipboardList,
      cell: (job) => valueOf(job.employment_type, "-"),
    },
    {
      key: "location",
      header: t("columns.location"),
      headerIcon: MapPin,
      cell: (job) => job.location || "-",
    },
    {
      key: "work_mode",
      header: t("columns.workMode"),
      headerIcon: MapPinned,
      cell: (job) => {
        const workModeKey = keyOf(job.work_mode)
        return workModeKey
          ? t(`workModes.${workModeKey}`, { defaultValue: valueOf(job.work_mode, workModeKey) })
          : "-"
      },
    },
    {
      key: "accepting",
      header: t("columns.accepting"),
      headerIcon: ShieldCheck,
      cell: (job) => {
        const accepting = job.is_accepting_applications ?? job.accepting_applications
        if (accepting === undefined) return "-"
        return accepting ? t("filters.accepting") : t("filters.notAccepting")
      },
    },
    {
      key: "applications",
      header: t("columns.applications"),
      headerIcon: UsersRound,
      cell: (job) => job.applications_count ?? "-",
    },
  ]
  return (
    <DataTable
      data={jobs}
      columns={columns}
      getRowId={(job) => job.id}
      loading={isLoading}
      pagination={{
        total: pagination?.total ?? jobs.length,
        page: pagination?.currentPage ?? 1,
        lastPage: pagination?.lastPage ?? 1,
        perPage: pagination?.perPage,
      }}
      onPageChange={onPageChange}
      onRowClick={(job) => navigate(ROUTES.admin.jobDetails(job.id))}
      emptyMessage={t("empty")}
      emptyDescription={t("emptyDescription")}
      emptyImage={images.emptyJobs}
      emptyImageAlt={t("empty")}
      className="rounded-2xl bg-background-card shadow-card"
    />
  )
}
