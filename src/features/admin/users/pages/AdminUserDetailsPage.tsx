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
import { useState } from "react"

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
import type { AdminUserRole } from "../types/adminUsers.types"

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

const ROLE_METRICS: Record<AdminUserRole | "default", Array<"applications" | "jobs" | "interviews" | "tests">> = {
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
  const query = useAdminUserDetails(id)
  const [statusAction, setStatusAction] = useState<"activate" | "suspend" | null>(null)

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
  const roleKey = keyOf(user.role)
  const role: AdminUserRole | "default" =
    roleKey === "admin" || roleKey === "job_seeker" || roleKey === "employer"
      ? roleKey
      : "default"
  const tabs = USER_DETAILS_TABS[role]
  const metrics = ROLE_METRICS[role]
  const closeStatusModal = () => {
    if (!query.statusMutation.isPending) setStatusAction(null)
  }
  const confirmActivate = async () => {
    await query.statusMutation.mutateAsync({ id: user.id, status: "active" })
    setStatusAction(null)
  }
  const confirmSuspend = async (reason?: string) => {
    await query.statusMutation.mutateAsync({ id: user.id, status: "suspended", reason })
    setStatusAction(null)
  }
  const renderTabContent = (value: UserDetailsTabValue) => {
    switch (value) {
      case "overview":
        return <AdminUserOverview user={user} />
      case "activity":
        return <AdminUserActivityPanel user={user} logs={role === "admin" ? "activity" : "both"} />
      case "audit":
        return <AdminUserActivityPanel user={user} logs="audit" />
      case "logins":
        return <AdminUserLoginHistoryPanel user={user} />
      case "sessions":
        return <AdminUserActiveSessionsPanel user={user} />
      case "company":
        return <AdminUserCompanyPanel user={user} />
      case "security":
        return <AdminUserSecurityPanel user={user} />
      case "applications":
      case "jobs":
      case "interviews":
      case "tests":
        return <AdminUserRelatedSection user={user} section={value} />
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

      {metrics.length ? (
        <div
          className={
            metrics.length >= 4
              ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
              : "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          }
        >
          {metrics.map((metric) => {
            const Icon = METRIC_ICONS[metric]
            const count =
              metric === "applications"
                ? user.counts?.applications ?? user.applications?.length ?? 0
                : metric === "jobs"
                  ? user.counts?.jobs ?? user.jobs?.length ?? 0
                  : metric === "interviews"
                    ? user.counts?.interviews ?? user.interviews?.length ?? 0
                    : user.counts?.tests ?? user.tests?.length ?? 0
            return (
              <MetricStatusCard
                key={metric}
                title={t(`details.metrics.${metric}`)}
                value={count}
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
