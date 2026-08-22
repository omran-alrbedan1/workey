import { DataTable, type Column } from "@/components/shared/custom/DataTable"
import { StatusBadge } from "@/components/shared/badges"
import type { AdminPagination } from "@/features/admin/shared/types/adminApi.types"
import type { AdminApplicationRecord } from "../types/adminApplications.types"
import { images } from "@/constants/images"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import {
  User,
  BriefcaseBusiness,
  ShieldCheck,
  Target,
  Calendar,
  Building2,
  Eye,
} from "lucide-react"
import { ROUTES } from "@/config"
import {
  appliedAtFor,
  candidateEmailFor,
  candidateNameFor,
  companyFor,
  jobFor,
} from "../utils/applicationDisplay"

interface AdminApplicationMobileCardProps {
  application: AdminApplicationRecord
  onViewDetails: (application: AdminApplicationRecord) => void
}

const AdminApplicationMobileCard = ({
  application,
  onViewDetails,
}: AdminApplicationMobileCardProps) => {
  const { t } = useTranslation("adminApplications")
  const job = jobFor(application)
  const company = companyFor(application)
  const score = application.match_score ?? application.matching_score

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onViewDetails(application)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onViewDetails(application)
        }
      }}
      className="cursor-pointer rounded-2xl border border-border bg-background-card p-4 shadow-card transition-colors hover:bg-muted/30"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
          <User className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-text-primary">
            {candidateNameFor(application) || candidateEmailFor(application) || t("unknownCandidate")}
          </h3>
          <p className="truncate text-xs text-text-muted">
            {candidateEmailFor(application) || "-"}
          </p>
        </div>
        <StatusBadge status={application.status} variant="soft" />
      </div>

      <div className="mt-4 space-y-2 rounded-xl bg-background-secondary p-3 text-xs text-text-secondary">
        <p className="flex items-center gap-2">
          <BriefcaseBusiness className="h-3.5 w-3.5 text-primary" />
          <span className="truncate">{job?.title || "-"}</span>
        </p>
        {company?.name && (
          <p className="flex items-center gap-2">
            <Building2 className="h-3.5 w-3.5 text-primary" />
            {company.name}
          </p>
        )}
        {score != null && (
          <p className="flex items-center gap-2">
            <Target className="h-3.5 w-3.5 text-primary" />
            {t("columns.match")}: {score}%
          </p>
        )}
        {appliedAtFor(application) && (
          <p className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            {new Date(appliedAtFor(application)!).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="mt-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
          <Eye className="h-3.5 w-3.5" />
          {t("actions.viewDetails")}
        </span>
      </div>
    </article>
  )
}

export default function AdminApplicationsTable({
  applications,
  isLoading,
  pagination,
  onPageChange,
}: {
  applications: AdminApplicationRecord[]
  isLoading: boolean
  pagination?: AdminPagination
  onPageChange: (page: number) => void
}) {
  const { t } = useTranslation("adminApplications")
  const navigate = useNavigate()

  const viewDetails = (application: AdminApplicationRecord) => {
    navigate(ROUTES.admin.applicationDetails(application.id))
  }

  const MobileCardWrapper = ({ item }: { item: AdminApplicationRecord }) => (
    <AdminApplicationMobileCard application={item} onViewDetails={viewDetails} />
  )

  const columns: Column<AdminApplicationRecord>[] = [
    {
      key: "candidate",
      header: t("columns.candidate"),
      headerIcon: User,
      cell: (item) => (
        <div>
          <p className="font-semibold text-text-primary">
            {candidateNameFor(item) || candidateEmailFor(item) || t("unknownCandidate")}
          </p>
          <p className="text-xs text-text-muted">{candidateEmailFor(item) || "-"}</p>
        </div>
      ),
    },
    {
      key: "job",
      header: t("columns.job"),
      headerIcon: BriefcaseBusiness,
      cell: (item) => <span className="text-text-primary">{jobFor(item)?.title || "-"}</span>,
    },
    {
      key: "company",
      header: t("columns.company"),
      headerIcon: Building2,
      cell: (item) => <span className="text-text-primary">{companyFor(item)?.name || "-"}</span>,
    },
    {
      key: "status",
      header: t("columns.status"),
      headerIcon: ShieldCheck,
      cell: (item) => <StatusBadge status={item.status} variant="soft" />,
    },
    {
      key: "match",
      header: t("columns.match"),
      headerIcon: Target,
      cell: (item) => {
        const score = item.match_score ?? item.matching_score
        return score != null ? `${score}%` : "-"
      },
    },
    {
      key: "created",
      header: t("columns.applied"),
      headerIcon: Calendar,
      cell: (item) =>
        appliedAtFor(item) ? new Date(appliedAtFor(item)!).toLocaleDateString() : "-",
    },
  ]
  return (
    <DataTable
      data={applications}
      columns={columns}
      getRowId={(item) => item.id}
      loading={isLoading}
      pagination={{
        total: pagination?.total ?? applications.length,
        page: pagination?.currentPage ?? 1,
        lastPage: pagination?.lastPage ?? 1,
        perPage: pagination?.perPage,
      }}
      onPageChange={onPageChange}
      onRowClick={viewDetails}
      mobileCardComponent={MobileCardWrapper}
      emptyMessage={t("empty")}
      emptyDescription={t("emptyDescription")}
      emptyImage={images.emptyJobs}
      emptyImageAlt={t("empty")}
      className="rounded-2xl relative overflow-visible bg-background-card shadow-card"
    />
  )
}
