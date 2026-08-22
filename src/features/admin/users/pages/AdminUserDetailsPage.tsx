import {
  Activity,
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  ClipboardList,
  FileCheck2,
  KeyRound,
  LockKeyhole,
  MonitorSmartphone,
  ShieldCheck,
  ShieldOff,
  UserRound,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import { useState, type ReactNode } from "react"

import StatusBadge from "@/components/shared/badges/StatusBadge"
import { MetricStatusCard } from "@/components/shared/cards/MetricCard"
import PageHeader from "@/components/shared/headers/PageHeader"
import { ActivateModal, SuspendModal } from "@/components/shared/modals"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ROUTES } from "@/config"
import { images } from "@/constants/images"
import { AdminFeatureError } from "@/features/admin/shared/components"
import { keyOf } from "@/lib/keyValue"

import AdminUserActiveSessionsPanel from "../components/AdminUserActiveSessionsPanel"
import AdminUserActivityPanel from "../components/AdminUserActivityPanel"
import AdminUserCompanyPanel from "../components/AdminUserCompanyPanel"
import AdminUserLoginHistoryPanel from "../components/AdminUserLoginHistoryPanel"
import AdminUserOverview from "../components/AdminUserOverview"
import AdminUserRelatedSection, {
  type AdminUserRelatedSectionKey,
} from "../components/AdminUserRelatedSection"
import AdminUserSecurityPanel from "../components/AdminUserSecurityPanel"
import { useAdminUserDetails } from "../hooks/useAdminUserDetails"
import {
  useAdminUserApplications,
  useAdminUserInterviews,
  useAdminUserJobs,
  useAdminUserTestAssignments,
} from "../hooks/useAdminUserRelated"
import type { AdminUserRole } from "../types/adminUsers.types"
import {
  mapApplicationItem,
  mapInterviewItem,
  mapJobItem,
  mapTestAssignmentItem,
} from "../utils/adminUserRelated"

type UserDetailsTabValue =
  | "overview"
  | "activity"
  | "audit"
  | "logins"
  | "sessions"
  | "company"
  | AdminUserRelatedSectionKey
  | "security"

interface UserDetailsTabConfig {
  value: UserDetailsTabValue
  labelKey: string
  icon: typeof UserRound
}

const USER_DETAILS_TABS: Record<AdminUserRole | "default", UserDetailsTabConfig[]> = {
  admin: [
    { value: "overview", labelKey: "details.tabs.overview", icon: UserRound },
    { value: "activity", labelKey: "details.tabs.activity", icon: Activity },
    { value: "audit", labelKey: "details.tabs.administrativeAudit", icon: ClipboardList },
    { value: "logins", labelKey: "details.tabs.loginHistory", icon: KeyRound },
    { value: "sessions", labelKey: "details.tabs.activeSessions", icon: MonitorSmartphone },
  ],
  job_seeker: [
    { value: "overview", labelKey: "details.tabs.overview", icon: UserRound },
    { value: "applications", labelKey: "details.tabs.applications", icon: ClipboardList },
    { value: "interviews", labelKey: "details.tabs.interviews", icon: CalendarCheck },
    { value: "tests", labelKey: "details.tabs.assessments", icon: FileCheck2 },
    { value: "activity", labelKey: "details.tabs.activity", icon: Activity },
    { value: "security", labelKey: "details.tabs.security", icon: LockKeyhole },
  ],
  employer: [
    { value: "overview", labelKey: "details.tabs.overview", icon: UserRound },
    { value: "company", labelKey: "details.tabs.companyMembership", icon: Building2 },
    { value: "jobs", labelKey: "details.tabs.jobs", icon: BriefcaseBusiness },
    { value: "applications", labelKey: "details.tabs.recruitmentActivity", icon: ClipboardList },
    { value: "interviews", labelKey: "details.tabs.interviews", icon: CalendarCheck },
    { value: "tests", labelKey: "details.tabs.assessments", icon: FileCheck2 },
    { value: "activity", labelKey: "details.tabs.activity", icon: Activity },
    { value: "security", labelKey: "details.tabs.security", icon: LockKeyhole },
  ],
  default: [
    { value: "overview", labelKey: "details.tabs.overview", icon: UserRound },
    { value: "activity", labelKey: "details.tabs.activity", icon: Activity },
    { value: "security", labelKey: "details.tabs.security", icon: LockKeyhole },
  ],
}

const ROLE_METRICS: Record<
  AdminUserRole | "default",
  Array<"applications" | "jobs" | "interviews" | "tests">
> = {
  admin: [],
  job_seeker: ["applications", "interviews", "tests"],
  employer: ["jobs", "applications", "interviews", "tests"],
  default: ["applications", "jobs", "interviews", "tests"],
}

const METRIC_ICONS = {
  applications: ClipboardList,
  jobs: BriefcaseBusiness,
  interviews: CalendarCheck,
  tests: FileCheck2,
} as const

export default function AdminUserDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation("adminUsers")
  const [statusAction, setStatusAction] = useState<"activate" | "suspend" | null>(null)

  const query = useAdminUserDetails(id)
  const roleKey = keyOf(query.user?.role)
  const role: AdminUserRole | "default" =
    roleKey === "admin" || roleKey === "job_seeker" || roleKey === "employer" ? roleKey : "default"

  // Related collections come from dedicated backend endpoints; totals feed
  // the metric cards and mapped items feed the matching tabs.
  const hasCandidateCoverage = role === "job_seeker" || role === "employer"
  const applicationsQuery = useAdminUserApplications(id, { enabled: Boolean(id) && hasCandidateCoverage })
  const jobsQuery = useAdminUserJobs(id, { enabled: Boolean(id) && role === "employer" })
  const interviewsQuery = useAdminUserInterviews(id, { enabled: Boolean(id) && hasCandidateCoverage })
  const testsQuery = useAdminUserTestAssignments(id, { enabled: Boolean(id) && hasCandidateCoverage })

  if (!id) {
    return (
      <AdminFeatureError
        title={t("details.errorTitle")}
        error={new Error(t("details.missingId"))}
        retry={() => navigate(ROUTES.admin.users)}
      />
    )
  }

  if (query.isError && !query.hasFallbackData) {
    return (
      <AdminFeatureError
        title={t("details.errorTitle")}
        error={query.error}
        retry={() => void query.refetch()}
      />
    )
  }

  const user = query.user
  if (!user) return null

  const updating = query.statusMutation.isPending || query.roleMutation.isPending
  const isSuspended = keyOf(user.status) === "suspended"
  const tabs = USER_DETAILS_TABS[role]
  const metricKeys = ROLE_METRICS[role]

  const metricValues: Record<"applications" | "jobs" | "interviews" | "tests", number> = {
    applications: applicationsQuery.data?.pagination.total ?? 0,
    jobs: jobsQuery.data?.pagination.total ?? 0,
    interviews: interviewsQuery.data?.pagination.total ?? 0,
    tests: testsQuery.data?.pagination.total ?? 0,
  }

  const fallbackTitle = t("related.fallbackTitle")
  const relatedSections: Record<AdminUserRelatedSectionKey, ReactNode> = {
    applications: (
      <AdminUserRelatedSection
        section="applications"
        isLoading={applicationsQuery.isPending}
        items={applicationsQuery.data?.items.map((item) =>
          mapApplicationItem(item, fallbackTitle),
        )}
      />
    ),
    jobs: (
      <AdminUserRelatedSection
        section="jobs"
        isLoading={jobsQuery.isPending}
        items={jobsQuery.data?.items.map((item) => mapJobItem(item, fallbackTitle))}
      />
    ),
    interviews: (
      <AdminUserRelatedSection
        section="interviews"
        isLoading={interviewsQuery.isPending}
        items={interviewsQuery.data?.items.map((item) => mapInterviewItem(item))}
      />
    ),
    tests: (
      <AdminUserRelatedSection
        section="tests"
        isLoading={testsQuery.isPending}
        items={testsQuery.data?.items.map((item) =>
          mapTestAssignmentItem(item, fallbackTitle),
        )}
      />
    ),
  }

  const closeStatusModal = () => {
    if (!query.statusMutation.isPending) setStatusAction(null)
  }
  const confirmActivate = async () => {
    await query.statusMutation.mutateAsync({ id: user.id, status: "active" })
    setStatusAction(null)
  }
  const confirmSuspend = async () => {
    // The backend suspend endpoint accepts no body; a reason cannot be stored.
    await query.statusMutation.mutateAsync({ id: user.id, status: "suspended" })
    setStatusAction(null)
  }
  const renderTabContent = (value: UserDetailsTabValue) => {
    switch (value) {
      case "overview":
        return <AdminUserOverview user={user} />
      case "activity":
        return <AdminUserActivityPanel userId={id} logs="both" />
      case "audit":
        return <AdminUserActivityPanel userId={id} logs="audit" />
      case "logins":
        return <AdminUserLoginHistoryPanel userId={id} />
      case "sessions":
        return <AdminUserActiveSessionsPanel userId={id} />
      case "company":
        return <AdminUserCompanyPanel user={user} />
      case "security":
        return <AdminUserSecurityPanel user={user} userId={id} />
      case "applications":
      case "jobs":
      case "interviews":
      case "tests":
        return relatedSections[value]
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={user.name}
        description={user.email}
        icon={UserRound}
        showBackButton
        backButtonLabel={t("details.back")}
        onBackClick={() => navigate(ROUTES.admin.users)}
        image={{ src: images.usersManagement, alt: t("details.imageAlt") }}
        rightContent={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <StatusBadge status={user.status} variant="soft" />
            <Button
              size="sm"
              variant={isSuspended ? "default" : "outline"}
              disabled={updating}
              onClick={() => setStatusAction(isSuspended ? "activate" : "suspend")}
              className="gap-2"
            >
              {isSuspended ? (
                <ShieldCheck className="h-4 w-4" />
              ) : (
                <ShieldOff className="h-4 w-4" />
              )}
              {updating
                ? t("actions.updating")
                : t(isSuspended ? "actions.activate" : "actions.suspend")}
            </Button>
          </div>
        }
      />

      {metricKeys.length ? (
        <div
          className={
            metricKeys.length >= 4
              ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
              : "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          }
        >
          {metricKeys.map((metric) => {
            const Icon = METRIC_ICONS[metric]
            return (
              <MetricStatusCard
                key={metric}
                title={t(`details.metrics.${metric}`)}
                value={metricValues[metric]}
                icon={Icon}
              />
            )
          })}
        </div>
      ) : null}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="h-auto w-full justify-start gap-2 overflow-x-auto rounded-lg border border-border p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <TabsTrigger key={tab.value} value={tab.value} className="gap-2 px-4 py-2.5">
                <Icon className="h-4 w-4" />
                {t(tab.labelKey)}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {renderTabContent(tab.value)}
          </TabsContent>
        ))}
      </Tabs>

      <ActivateModal
        open={statusAction === "activate"}
        name={user.name}
        loading={query.statusMutation.isPending}
        onClose={closeStatusModal}
        onConfirm={confirmActivate}
      />
      <SuspendModal
        open={statusAction === "suspend"}
        name={user.name}
        loading={query.statusMutation.isPending}
        onClose={closeStatusModal}
        onConfirm={confirmSuspend}
      />
    </div>
  )
}
