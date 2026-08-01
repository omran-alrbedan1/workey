import { DataTable, type Column } from "@/components/shared/custom/DataTable"
import { StatusBadge } from "@/components/shared/badges"
import type { AdminPagination } from "@/features/admin/shared/types/adminApi.types"
import type { AdminApplicationRecord } from "../types/adminApplications.types"
import { images } from "@/constants/images"
import { useTranslation } from "react-i18next"

type CandidateLike = NonNullable<ReturnType<typeof candidateFor>>

function candidateFor(item: AdminApplicationRecord) {
  return (
    item.candidate ??
    item.job_seeker ??
    item.jobSeeker ??
    item.applicant ??
    item.seeker ??
    item.candidate_user ??
    item.job_seeker_user ??
    item.candidate_profile ??
    item.job_seeker_profile ??
    item.profile ??
    item.user ??
    item.application?.candidate ??
    item.application?.job_seeker ??
    item.application?.jobSeeker ??
    item.application?.applicant ??
    item.application?.seeker ??
    item.application?.candidate_user ??
    item.application?.job_seeker_user ??
    item.application?.candidate_profile ??
    item.application?.job_seeker_profile ??
    item.application?.profile ??
    item.application?.user
  )
}

function fullNameFromParts(person?: CandidateLike) {
  return [person?.first_name, person?.last_name].filter(Boolean).join(" ").trim()
}

function personName(person?: CandidateLike): string | undefined {
  if (!person) return undefined
  return (
    person.full_name ||
    person.name ||
    fullNameFromParts(person) ||
    person.user?.full_name ||
    person.user?.name ||
    fullNameFromParts(person.user) ||
    person.profile?.full_name ||
    person.profile?.name ||
    [person.profile?.first_name, person.profile?.last_name].filter(Boolean).join(" ").trim() ||
    undefined
  )
}

function personEmail(person?: CandidateLike): string | undefined {
  if (!person) return undefined
  return person.email || person.user?.email || person.profile?.email || undefined
}

function candidateNameFor(item: AdminApplicationRecord) {
  const candidate = candidateFor(item)
  return (
    personName(candidate) ||
    item.candidate_name ||
    item.job_seeker_name ||
    item.applicant_name ||
    item.application?.candidate_name ||
    item.application?.job_seeker_name ||
    item.application?.applicant_name
  )
}

function candidateEmailFor(item: AdminApplicationRecord) {
  const candidate = candidateFor(item)
  return (
    personEmail(candidate) ||
    item.candidate_email ||
    item.job_seeker_email ||
    item.applicant_email ||
    item.application?.candidate_email ||
    item.application?.job_seeker_email ||
    item.application?.applicant_email
  )
}

function jobFor(item: AdminApplicationRecord) {
  return item.job ?? item.application?.job
}

function companyFor(item: AdminApplicationRecord) {
  return (
    item.company ?? item.job?.company ?? item.application?.company ?? item.application?.job?.company
  )
}

function appliedAtFor(item: AdminApplicationRecord) {
  return item.applied_at ?? item.submitted_at ?? item.created_at
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
  const columns: Column<AdminApplicationRecord>[] = [
    {
      key: "candidate",
      header: t("columns.candidate"),
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
      cell: (item) => (
        <div>
          <p className="text-text-primary">{jobFor(item)?.title || "-"}</p>
          <p className="text-xs text-text-muted">{companyFor(item)?.name || "-"}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: t("columns.status"),
      cell: (item) => <StatusBadge status={item.status} variant="soft" />,
    },
    {
      key: "match",
      header: t("columns.match"),
      cell: (item) => {
        const score = item.match_score ?? item.matching_score
        return score != null ? `${score}%` : "-"
      },
    },
    {
      key: "created",
      header: t("columns.applied"),
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
      emptyMessage={t("empty")}
      emptyDescription={t("emptyDescription")}
      emptyImage={images.emptyJobs}
      emptyImageAlt={t("empty")}
      className="rounded-2xl bg-background-card shadow-card"
    />
  )
}
