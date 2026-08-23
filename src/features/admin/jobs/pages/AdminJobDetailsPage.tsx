import { useState } from "react"
import {
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  ClipboardList,
  DollarSign,
  MapPin,
  UsersRound,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"

import PageHeader from "@/components/shared/headers/PageHeader"
import ErrorState from "@/components/shared/states/ErrorState"
import { StatusBadge } from "@/components/shared/badges"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ROUTES } from "@/config"
import AdminApplicationsTable from "@/features/admin/applications/components/AdminApplicationsTable"
import { normalizeKeyValueLabel } from "@/features/admin/shared/services/adminResponse.utils"
import type { AdminKeyValueField } from "@/features/admin/shared/types/adminApi.types"
import { keyOf, valueOf } from "@/lib/keyValue"
import { useAdminJobApplications, useAdminJobDetails } from "../hooks/useAdminJobDetails"
import type { AdminJobRecord } from "../types/adminJobs.types"

function display(value?: string | number | null) {
  return value === undefined || value === null || value === "" ? "-" : String(value)
}

function displayKeyValue(value?: AdminKeyValueField) {
  return normalizeKeyValueLabel(value, "-") || "-"
}

function translatedKeyValue(namespace: string, value?: AdminKeyValueField) {
  const key = keyOf(value)
  return key ? `${namespace}.${key}` : ""
}

function formatDate(value?: string | null) {
  if (!value) return "-"
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString()
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value?: React.ReactNode
}) {
  return (
    <div className="flex gap-3 rounded-md border border-border bg-background-card p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div className="min-w-0">
        <p className="text-xs font-medium text-text-muted">{label}</p>
        <div className="mt-1 text-sm font-medium text-text-primary">{value ?? "-"}</div>
      </div>
    </div>
  )
}

function TextSection({ title, value }: { title: string; value?: string | null }) {
  if (!value) return null
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap text-sm leading-6 text-text-secondary">{value}</p>
      </CardContent>
    </Card>
  )
}

function OverviewTab({ data }: { data: AdminJobRecord }) {
  const { t } = useTranslation("adminJobs")
  const accepting = data.is_accepting_applications ?? data.accepting_applications
  const salary =
    data.salary_min || data.salary_max
      ? `${display(data.salary_min)} - ${display(data.salary_max)}`
      : "-"

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <DetailItem
          icon={ClipboardList}
          label={t("columns.status")}
          value={<StatusBadge status={data.status} variant="soft" />}
        />
        <DetailItem
          icon={MapPin}
          label={t("columns.workMode")}
          value={
            keyOf(data.work_mode)
              ? t(translatedKeyValue("workModes", data.work_mode), {
                  defaultValue: valueOf(data.work_mode),
                })
              : "-"
          }
        />
        <DetailItem
          icon={BriefcaseBusiness}
          label={t("columns.employment")}
          value={valueOf(data.employment_type, "-")}
        />
        <DetailItem
          icon={UsersRound}
          label={t("columns.applications")}
          value={display(data.applications_count)}
        />
        <DetailItem icon={MapPin} label={t("columns.location")} value={display(data.location)} />
        <DetailItem
          icon={CalendarClock}
          label={t("details.deadline")}
          value={formatDate(data.application_deadline)}
        />
        <DetailItem icon={DollarSign} label={t("details.salary")} value={salary} />
        <DetailItem
          icon={CalendarClock}
          label={t("columns.accepting")}
          value={
            accepting === undefined
              ? "-"
              : accepting
                ? t("filters.accepting")
                : t("filters.notAccepting")
          }
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("details.overview")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <DetailItem
            icon={BriefcaseBusiness}
            label={t("details.department")}
            value={display(data.department)}
          />
          <DetailItem
            icon={ClipboardList}
            label={t("details.experienceLevel")}
            value={valueOf(data.experience_level, "-")}
          />
          <DetailItem
            icon={CalendarClock}
            label={t("details.createdAt")}
            value={formatDate(data.created_at)}
          />
          <DetailItem
            icon={CalendarClock}
            label={t("details.publishedAt")}
            value={formatDate(data.published_at)}
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <TextSection title={t("details.descriptionTitle")} value={data.description} />
        <TextSection title={t("details.requirementsTitle")} value={data.requirements} />
        <TextSection title={t("details.responsibilitiesTitle")} value={data.responsibilities} />
        <TextSection title={t("details.benefitsTitle")} value={data.benefits} />
      </div>

      {data.skills && data.skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("details.skills")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => {
                const type = skill.requirement_type ?? skill.pivot?.requirement_type
                const weight = skill.weight ?? skill.pivot?.weight
                return (
                  <span
                    key={skill.id}
                    className="rounded-full border border-border bg-background-secondary px-3 py-1 text-xs font-medium text-text-secondary"
                  >
                    {skill.name ?? `#${skill.id}`}
                    {type ? ` - ${type}` : ""}
                    {weight ? ` (${weight}/5)` : ""}
                  </span>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function CompanyTab({ data }: { data: AdminJobRecord }) {
  const { t } = useTranslation("adminJobs")
  const navigate = useNavigate()
  const company = data.company

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-base">{t("details.company")}</CardTitle>
        {company?.id && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.admin.companyDetails(company.id!))}
          >
            <Building2 className="me-2 h-4 w-4" />
            {t("details.viewCompany")}
          </Button>
        )}
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <DetailItem
          icon={Building2}
          label={t("details.companyName")}
          value={display(company?.name)}
        />
        <DetailItem
          icon={ClipboardList}
          label={t("details.companyStatus")}
          value={displayKeyValue(company?.approval_status ?? company?.status)}
        />
        <DetailItem
          icon={UsersRound}
          label={t("details.employer")}
          value={display(company?.employer?.name)}
        />
        <DetailItem
          icon={UsersRound}
          label={t("details.employerEmail")}
          value={display(company?.employer?.email)}
        />
      </CardContent>
    </Card>
  )
}

function ApplicantsTab({ jobId }: { jobId: string | number }) {
  const { t } = useTranslation("adminJobs")
  const [page, setPage] = useState(1)
  const applications = useAdminJobApplications(jobId, page)

  if (applications.isError) {
    return (
      <ErrorState
        size="sm"
        title={t("details.applicantsErrorTitle")}
        description={t("details.applicantsErrorDescription")}
        retry={() => void applications.refetch()}
      />
    )
  }

  return (
    <AdminApplicationsTable
      applications={applications.data?.items ?? []}
      isLoading={applications.isPending}
      pagination={applications.data?.pagination}
      onPageChange={setPage}
    />
  )
}

export default function AdminJobDetailsPage() {
  const { t } = useTranslation("adminJobs")
  const { id } = useParams()
  const navigate = useNavigate()
  const job = useAdminJobDetails(id)

  if (!id) {
    return (
      <ErrorState
        title={t("details.missingId")}
        description={t("details.missingIdDescription")}
        variant="404"
      />
    )
  }

  if (job.isPending) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={t("details.title")}
          icon={BriefcaseBusiness}
          showBackButton
          backButtonLabel={t("details.back")}
          onBackClick={() => navigate(ROUTES.admin.jobs)}
        />
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    )
  }

  if (job.isError || !job.data) {
    return (
      <ErrorState
        title={t("details.errorTitle")}
        description={t("details.errorDescription")}
        retry={() => void job.refetch()}
      />
    )
  }

  const data = job.data

  return (
    <div className="space-y-6">
      <PageHeader
        title={data.title}
        description={data.company?.name || t("unknownCompany")}
        icon={BriefcaseBusiness}
        showBackButton
        backButtonLabel={t("details.back")}
        onBackClick={() => navigate(ROUTES.admin.jobs)}
      />
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="overflow-x-auto">
          <TabsTrigger value="overview">{t("details.tabs.overview")}</TabsTrigger>
          <TabsTrigger value="company">{t("details.tabs.company")}</TabsTrigger>
          <TabsTrigger value="applicants">{t("details.tabs.applicants")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab data={data} />
        </TabsContent>
        <TabsContent value="company">
          <CompanyTab data={data} />
        </TabsContent>
        <TabsContent value="applicants">
          <ApplicantsTab jobId={id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
