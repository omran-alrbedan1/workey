import {
  Activity,
  BriefcaseBusiness,
  CalendarCheck,
  FileCheck2,
  LockKeyhole,
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

import AdminUserActivityPanel from "../components/AdminUserActivityPanel"
import AdminUserOverview from "../components/AdminUserOverview"
import AdminUserRelatedPanel from "../components/AdminUserRelatedPanel"
import AdminUserSecurityPanel from "../components/AdminUserSecurityPanel"
import { useAdminUserDetails } from "../hooks/useAdminUserDetails"

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
  const isSuspended = user.status === "suspended"
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricStatusCard
          title={t("details.metrics.applications")}
          value={user.counts?.applications ?? user.applications?.length ?? 0}
          icon={BriefcaseBusiness}
        />
        <MetricStatusCard
          title={t("details.metrics.jobs")}
          value={user.counts?.jobs ?? user.jobs?.length ?? 0}
          icon={FileCheck2}
        />
        <MetricStatusCard
          title={t("details.metrics.interviews")}
          value={user.counts?.interviews ?? user.interviews?.length ?? 0}
          icon={CalendarCheck}
        />
        <MetricStatusCard
          title={t("details.metrics.tests")}
          value={user.counts?.tests ?? user.tests?.length ?? 0}
          icon={ShieldCheck}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="h-auto w-full justify-start gap-2 overflow-x-auto rounded-lg border border-border p-2">
          <TabsTrigger value="overview" className="gap-2 px-4 py-2.5">
            <UserRound className="h-4 w-4" />
            {t("details.tabs.overview")}
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2 px-4 py-2.5">
            <Activity className="h-4 w-4" />
            {t("details.tabs.activity")}
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 px-4 py-2.5">
            <LockKeyhole className="h-4 w-4" />
            {t("details.tabs.security")}
          </TabsTrigger>
          <TabsTrigger value="related" className="gap-2 px-4 py-2.5">
            <BriefcaseBusiness className="h-4 w-4" />
            {t("details.tabs.related")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <AdminUserOverview user={user} />
        </TabsContent>
        <TabsContent value="activity">
          <AdminUserActivityPanel user={user} />
        </TabsContent>
        <TabsContent value="security">
          <AdminUserSecurityPanel user={user} />
        </TabsContent>
        <TabsContent value="related">
          <AdminUserRelatedPanel user={user} />
        </TabsContent>
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
