import {
  ArrowLeft,
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
import { ROUTES } from "@/config"
import { normalizeKeyValueLabel } from "@/features/admin/shared/services/adminResponse.utils"
import type { AdminKeyValueField } from "@/features/admin/shared/types/adminApi.types"
import { keyOf, valueOf } from "@/lib/keyValue"
import { useAdminJobDetails } from "../hooks/useAdminJobDetails"

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
    return <Skeleton className="h-[520px] w-full rounded-lg" />
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
  const accepting = data.is_accepting_applications ?? data.accepting_applications
  const salary =
    data.salary_min || data.salary_max
      ? `${display(data.salary_min)} - ${display(data.salary_max)}`
      : "-"

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

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.admin.jobs)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("details.back")}
        </Button>
        {data.company?.id && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.admin.companyDetails(data.company!.id!))}
          >
            <Building2 className="mr-2 h-4 w-4" />
            {t("details.viewCompany")}
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.admin.applications)}>
          <UsersRound className="mr-2 h-4 w-4" />
          {t("details.viewApplications")}
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <DetailItem icon={ClipboardList} label={t("columns.status")} value={<StatusBadge status={data.status} variant="soft" />} />
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
        <DetailItem icon={BriefcaseBusiness} label={t("columns.employment")} value={valueOf(data.employment_type, "-")} />
        <DetailItem icon={UsersRound} label={t("columns.applications")} value={display(data.applications_count)} />
        <DetailItem icon={MapPin} label={t("columns.location")} value={display(data.location)} />
        <DetailItem icon={CalendarClock} label={t("details.deadline")} value={formatDate(data.application_deadline)} />
        <DetailItem icon={DollarSign} label={t("details.salary")} value={salary} />
        <DetailItem
          icon={CalendarClock}
          label={t("columns.accepting")}
          value={accepting === undefined ? "-" : accepting ? t("filters.accepting") : t("filters.notAccepting")}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">{t("details.overview")}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <DetailItem icon={BriefcaseBusiness} label={t("details.department")} value={display(data.department)} />
            <DetailItem icon={ClipboardList} label={t("details.experienceLevel")} value={valueOf(data.experience_level, "-")} />
            <DetailItem icon={CalendarClock} label={t("details.createdAt")} value={formatDate(data.created_at)} />
            <DetailItem icon={CalendarClock} label={t("details.publishedAt")} value={formatDate(data.published_at)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("details.company")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-xs font-medium text-text-muted">{t("details.companyName")}</p>
              <p className="font-medium">{display(data.company?.name)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-text-muted">{t("details.companyStatus")}</p>
              <p className="font-medium">{displayKeyValue(data.company?.approval_status ?? data.company?.status)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-text-muted">{t("details.employer")}</p>
              <p className="font-medium">{display(data.company?.employer?.name)}</p>
              <p className="text-xs text-text-muted">{display(data.company?.employer?.email)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

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
