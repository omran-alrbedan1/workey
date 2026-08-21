import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  ClipboardList,
  Hash,
  History,
  Mail,
  Target,
  User,
  UsersRound,
  Video,
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
import type {
  AdminApplicationInterviewEntry,
  AdminApplicationStatusHistoryEntry,
  AdminApplicationTestEntry,
} from "../types/adminApplications.types"
import { valueOf } from "@/lib/keyValue"
import { useAdminApplicationDetails } from "../hooks/useAdminApplicationDetails"
import {
  appliedAtFor,
  candidateEmailFor,
  candidateNameFor,
  companyFor,
  jobFor,
} from "../utils/applicationDisplay"

function display(value?: string | number | null) {
  return value === undefined || value === null || value === "" ? "-" : String(value)
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

function FactRow({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-text-muted">{label}</p>
      <p className="text-sm font-medium text-text-primary">{value ?? "-"}</p>
    </div>
  )
}

function StatusHistoryEntry({
  entry,
}: {
  entry: AdminApplicationStatusHistoryEntry
}) {
  const { t } = useTranslation("adminApplications")
  const roleLabel = valueOf(entry.changed_by?.role)
  const actor = entry.changed_by?.name
    ? `${entry.changed_by.name}${roleLabel ? ` (${roleLabel})` : ""}`
    : t("details.systemActor")

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-border bg-background-secondary p-3">
      <div className="flex items-center gap-2">
        {entry.from_status ? (
          <StatusBadge status={entry.from_status} variant="soft" size="sm" />
        ) : (
          <span className="text-xs text-text-muted">—</span>
        )}
        <ArrowRight className="h-3.5 w-3.5 text-text-muted rtl:rotate-180" />
        <StatusBadge status={entry.to_status} variant="soft" size="sm" />
      </div>
      <span className="text-xs text-text-secondary">{t("details.changedBy", { actor })}</span>
      <span className="ms-auto text-xs text-text-muted">{formatDate(entry.changed_at)}</span>
    </div>
  )
}

function TestAuditItem({ entry }: { entry: AdminApplicationTestEntry }) {
  const { t } = useTranslation("adminApplications")
  const attempt = entry.attempt
  const score =
    attempt && attempt.total_score != null
      ? `${display(attempt.total_score)} / ${display(attempt.max_score)}${
          attempt.percentage != null ? ` (${attempt.percentage}%)` : ""
        }`
      : null

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-medium text-text-primary">
            {entry.test?.title || `#${entry.id}`}
          </p>
          {(entry.attempt_number != null || entry.max_attempts != null) && (
            <p className="mt-0.5 text-xs text-text-muted">
              {t("details.attemptOf", {
                current: display(entry.attempt_number),
                max: display(entry.max_attempts),
              })}
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {entry.state && <StatusBadge status={entry.state} variant="soft" size="sm" />}
          {attempt?.grading_status && (
            <StatusBadge status={attempt.grading_status} variant="outline" size="sm" />
          )}
        </div>
      </div>

      <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        <FactRow label={t("details.assignedAt")} value={formatDate(entry.assigned_at)} />
        <FactRow label={t("details.deadlineAt")} value={formatDate(entry.deadline_at)} />
        <FactRow label={t("details.score")} value={score ?? "-"} />
        <FactRow label={t("details.startedAt")} value={formatDate(attempt?.started_at)} />
        <FactRow label={t("details.submittedAt")} value={formatDate(attempt?.submitted_at)} />
        <FactRow label={t("details.evaluatedAt")} value={formatDate(attempt?.evaluated_at)} />
      </div>
    </div>
  )
}

function InterviewAuditItem({ entry }: { entry: AdminApplicationInterviewEntry }) {
  const { t } = useTranslation("adminApplications")
  const scheduledWindow = [formatDate(entry.scheduled_at), formatDate(entry.scheduled_end_at)]
    .filter((value) => value !== "-")
    .join(" – ")

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-medium text-text-primary">
            {[valueOf(entry.type), valueOf(entry.mode)]
              .filter((value) => value && value !== "-")
              .join(" · ") || `#${entry.id}`}
          </p>
          {scheduledWindow !== "-" && (
            <p className="mt-0.5 text-xs text-text-muted">
              {t("details.scheduledWindow")}: {scheduledWindow}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <StatusBadge status={entry.status} variant="soft" size="sm" />
        </div>
      </div>

      <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
        <FactRow
          label={t("details.duration")}
          value={
            entry.duration_minutes != null
              ? t("details.minutes", { count: entry.duration_minutes })
              : "-"
          }
        />
        <FactRow
          label={t("details.evaluation")}
          value={entry.evaluated ? t("details.evaluated") : t("details.notEvaluated")}
        />
      </div>
    </div>
  )
}

export default function AdminApplicationDetailsPage() {
  const { t } = useTranslation("adminApplications")
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const query = useAdminApplicationDetails(id)

  if (!id) {
    return (
      <ErrorState
        title={t("errors.missingId")}
        description={t("errors.missingIdDescription")}
        variant="404"
      />
    )
  }

  if (query.isPending) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={t("title")}
          icon={ClipboardList}
          showBackButton
          backButtonLabel={t("details.back")}
          onBackClick={() => navigate(ROUTES.admin.applications)}
        />
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    )
  }

  if (query.isError || !query.data) {
    return (
      <ErrorState
        title={t("errors.errorTitle")}
        description={t("errors.errorDescription")}
        retry={() => void query.refetch()}
      />
    )
  }

  const data = query.data
  const job = jobFor(data)
  const company = companyFor(data)
  const candidateName = candidateNameFor(data) || candidateEmailFor(data) || t("unknownCandidate")
  const matchScore = data.match_score ?? data.matching_score

  return (
    <div className="space-y-6">
      <PageHeader
        title={candidateName}
        description={[job?.title || t("unknownJob"), company?.name].filter(Boolean).join(" · ")}
        icon={ClipboardList}
        showBackButton
        backButtonLabel={t("details.back")}
        onBackClick={() => navigate(ROUTES.admin.applications)}
      />

      <p className="rounded-lg border border-dashed border-border bg-background-secondary px-4 py-2 text-xs text-text-muted">
        {t("details.readOnlyNote")}
      </p>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.admin.applications)}>
          <UsersRound className="mr-2 h-4 w-4 rtl:rotate-180" />
          {t("details.back")}
        </Button>
        {job?.id && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.admin.jobDetails(job.id!))}
          >
            <BriefcaseBusiness className="mr-2 h-4 w-4" />
            {t("details.viewJob")}
          </Button>
        )}
        {company?.id && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.admin.companyDetails(company.id!))}
          >
            <Building2 className="mr-2 h-4 w-4" />
            {t("details.viewCompany")}
          </Button>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <DetailItem
          icon={ClipboardList}
          label={t("columns.status")}
          value={<StatusBadge status={data.status} variant="soft" />}
        />
        <DetailItem icon={Target} label={t("columns.match")} value={matchScore != null ? `${matchScore}%` : "-"} />
        <DetailItem icon={CalendarClock} label={t("details.appliedAt")} value={formatDate(appliedAtFor(data))} />
        <DetailItem icon={CalendarClock} label={t("details.updatedAt")} value={formatDate(data.updated_at)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4 text-primary" />
              {t("details.candidate")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <FactRow label={t("details.candidateName")} value={display(candidateNameFor(data))} />
            <FactRow
              label={t("details.candidateEmail")}
              value={
                candidateEmailFor(data) ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-text-muted" />
                    {candidateEmailFor(data)}
                  </span>
                ) : (
                  "-"
                )
              }
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BriefcaseBusiness className="h-4 w-4 text-primary" />
              {t("details.positionTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <FactRow label={t("details.job")} value={job?.title || t("unknownJob")} />
            <FactRow
              label={t("details.company")}
              value={company?.name || t("unknownCompany")}
            />
            <FactRow
              label={t("details.applicationId")}
              value={
                <span className="inline-flex items-center gap-1.5">
                  <Hash className="h-3.5 w-3.5 text-text-muted" />
                  {display(data.id)}
                </span>
              }
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="h-4 w-4 text-primary" />
            {t("details.statusHistoryTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(data.status_history?.length ?? 0) === 0 ? (
            <p className="text-sm text-text-muted">{t("details.statusHistoryEmpty")}</p>
          ) : (
            data.status_history!.map((entry) => <StatusHistoryEntry key={entry.id} entry={entry} />)
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="h-4 w-4 text-primary" />
            {t("details.testsTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(data.tests?.length ?? 0) === 0 ? (
            <p className="text-sm text-text-muted">{t("details.testsEmpty")}</p>
          ) : (
            data.tests!.map((entry) => <TestAuditItem key={entry.id} entry={entry} />)
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Video className="h-4 w-4 text-primary" />
            {t("details.interviewsTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(data.interviews?.length ?? 0) === 0 ? (
            <p className="text-sm text-text-muted">{t("details.interviewsEmpty")}</p>
          ) : (
            data.interviews!.map((entry) => <InterviewAuditItem key={entry.id} entry={entry} />)
          )}
        </CardContent>
      </Card>
    </div>
  )
}
