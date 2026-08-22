import {
  Ban,
  Building2,
  BriefcaseBusiness,
  Check,
  Activity,
  Edit,
  ExternalLink,
  ShieldCheck,
  Users,
  X,
} from "lucide-react"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"

import StatusBadge from "@/components/shared/badges/StatusBadge"
import PageHeader from "@/components/shared/headers/PageHeader"
import { ApproveModal, RejectModal, SuspendModal } from "@/components/shared/modals"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ROUTES } from "@/config"
import { images } from "@/constants/images"
import { AdminFeatureError } from "@/features/admin/shared/components"

import AdminCompanyOverview from "../components/AdminCompanyOverview"
import AdminCompanyOwnershipCard from "../components/AdminCompanyOwnershipCard"
import AdminCompanyJobsPanel from "../components/AdminCompanyJobsPanel"
import AdminCompanyActivityPanel from "../components/AdminCompanyActivityPanel"
import AdminCompanyVerificationCard from "../components/AdminCompanyVerificationCard"
import AdminCompanyFormDialog from "../components/AdminCompanyFormDialog"
import CompanyMemberList from "../components/CompanyMemberList"
import { useAdminCompanyDetails } from "../hooks/useAdminCompanyDetails"
import { getCompanyApprovalActions, type CompanyApprovalAction } from "../utils/approvalActions"

export default function AdminCompanyDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation("adminCompanies")
  const companyQuery = useAdminCompanyDetails(id)
  const [editOpen, setEditOpen] = useState(false)
  const [approvalAction, setApprovalAction] = useState<CompanyApprovalAction | null>(null)

  if (!id) {
    return (
      <AdminFeatureError
        title={t("errors.detailsTitle")}
        error={new Error(t("errors.missingId"))}
        retry={() => navigate(ROUTES.admin.companies)}
      />
    )
  }

  if (companyQuery.isError && !companyQuery.hasFallbackData) {
    return (
      <AdminFeatureError
        title={t("errors.detailsTitle")}
        error={companyQuery.error}
        retry={() => {
          void companyQuery.refetch()
        }}
      />
    )
  }

  const company = companyQuery.company
  if (!company) return null

  const approvalActions = getCompanyApprovalActions(company)
  const isUpdating =
    companyQuery.approveMutation.isPending ||
    companyQuery.rejectMutation.isPending ||
    companyQuery.suspendMutation.isPending
  const closeApprovalModal = () => {
    if (!isUpdating) setApprovalAction(null)
  }
  const confirmApprove = async () => {
    await companyQuery.approveMutation.mutateAsync()
    setApprovalAction(null)
  }
  const confirmReject = async (reason: string) => {
    await companyQuery.rejectMutation.mutateAsync(reason)
    setApprovalAction(null)
  }
  const confirmSuspend = async () => {
    await companyQuery.suspendMutation.mutateAsync()
    setApprovalAction(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={company.name}
        description={company.website || company.industry || t("details.descriptionFallback")}
        icon={Building2}
        showBackButton
        backButtonLabel={t("details.back")}
        onBackClick={() => navigate(ROUTES.admin.companies)}
        image={{
          src: images.companies,
          alt: t("details.imageAlt"),
        }}
        rightContent={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <StatusBadge
              status={company.approval_status ?? company.status ?? "pending"}
              variant="soft"
            />
            {approvalActions.includes("approve") ? (
              <Button
                size="sm"
                disabled={isUpdating}
                onClick={() => setApprovalAction("approve")}
                className="gap-2"
              >
                <Check className="h-4 w-4" />
                {t("actions.approve")}
              </Button>
            ) : null}
            {approvalActions.includes("reject") ? (
              <Button
                size="sm"
                variant="outline"
                disabled={isUpdating}
                onClick={() => setApprovalAction("reject")}
                className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <X className="h-4 w-4" />
                {t("actions.reject")}
              </Button>
            ) : null}
            {approvalActions.includes("suspend") ? (
              <Button
                size="sm"
                variant="outline"
                disabled={isUpdating}
                onClick={() => setApprovalAction("suspend")}
                className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <Ban className="h-4 w-4" />
                {t("actions.suspend")}
              </Button>
            ) : null}
            {company.website ? (
              <Button asChild size="sm" variant="outline" className="gap-2">
                <a href={company.website} target="_blank" rel="noreferrer">
                  {t("actions.visitSite")}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            ) : null}
            <Button size="sm" onClick={() => setEditOpen(true)} className="gap-2">
              <Edit className="h-4 w-4" />
              {t("details.edit")}
            </Button>
          </div>
        }
      />
      <AdminCompanyFormDialog
        open={editOpen}
        mode="edit"
        company={company}
        isSubmitting={companyQuery.updateMutation.isPending}
        onOpenChange={setEditOpen}
        onSubmit={(input) =>
          companyQuery.updateMutation.mutate(input, {
            onSuccess: () => setEditOpen(false),
          })
        }
      />

      {companyQuery.isBackendCoverageMissing ? (
        <div className="rounded-2xl border border-amber-300/50 bg-amber-50/60 p-4 text-sm text-amber-900">
          {t("details.backendCoverageWarning")}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-border bg-background-card p-4 shadow-card">
          <p className="text-xs uppercase tracking-wide text-text-muted">
            {t("details.approvalStatus")}
          </p>
          <div className="mt-3">
            <StatusBadge
              status={company.approval_status ?? company.status ?? "pending"}
              size="lg"
            />
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-background-card p-4 shadow-card">
          <p className="text-xs uppercase tracking-wide text-text-muted">
            {t("overview.industry")}
          </p>
          <p className="mt-3 text-lg font-semibold text-text-primary">
            {company.industry || t("fallbacks.industryMissing")}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-background-card p-4 shadow-card">
          <p className="text-xs uppercase tracking-wide text-text-muted">{t("details.location")}</p>
          <p className="mt-3 text-lg font-semibold text-text-primary">
            {company.location || t("fallbacks.notAvailable")}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-background-card p-4 shadow-card">
          <p className="text-xs uppercase tracking-wide text-text-muted">
            {t("details.companyId")}
          </p>
          <p className="mt-3 text-lg font-semibold text-text-primary">{company.id}</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="h-auto w-full justify-start gap-2 overflow-x-auto rounded-2xl border border-border  p-2">
          <TabsTrigger value="overview" className="gap-2  px-4 py-2.5">
            <Building2 className="h-4 w-4" />
            {t("details.tabs.overview")}
          </TabsTrigger>
          <TabsTrigger value="membersOwnership" className="gap-2  px-4 py-2.5">
            <Users className="h-4 w-4" />
            {t("details.tabs.membersOwnership")}
          </TabsTrigger>
          <TabsTrigger value="jobs" className="gap-2  px-4 py-2.5">
            <BriefcaseBusiness className="h-4 w-4" />
            {t("details.tabs.jobs")}
          </TabsTrigger>
          <TabsTrigger value="verification" className="gap-2  px-4 py-2.5">
            <ShieldCheck className="h-4 w-4" />
            {t("details.tabs.verification")}
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2  px-4 py-2.5">
            <Activity className="h-4 w-4" />
            {t("details.tabs.activity")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <AdminCompanyOverview company={company} />
        </TabsContent>

        <TabsContent value="membersOwnership" className="space-y-6">
          <AdminCompanyOwnershipCard company={company} />
          <CompanyMemberList companyId={company.id} />
        </TabsContent>

        <TabsContent value="jobs">
          <AdminCompanyJobsPanel companyId={company.id} />
        </TabsContent>

        <TabsContent value="verification">
          <AdminCompanyVerificationCard company={company} />
        </TabsContent>

        <TabsContent value="activity">
          <AdminCompanyActivityPanel company={company} />
        </TabsContent>
      </Tabs>

      <ApproveModal
        open={approvalAction === "approve"}
        name={company.name}
        loading={isUpdating}
        onClose={closeApprovalModal}
        onConfirm={confirmApprove}
        title={t("modals.approveTitle")}
        description={t("modals.approveDescription", { name: company.name })}
        confirmText={t("modals.approveConfirm")}
      />
      <RejectModal
        open={approvalAction === "reject"}
        name={company.name}
        loading={isUpdating}
        onClose={closeApprovalModal}
        onConfirm={confirmReject}
        title={t("modals.rejectTitle")}
        description={t("modals.rejectDescription", { name: company.name })}
        confirmText={t("modals.rejectConfirm")}
      />
      <SuspendModal
        open={approvalAction === "suspend"}
        name={company.name}
        loading={isUpdating}
        onClose={closeApprovalModal}
        onConfirm={confirmSuspend}
      />
    </div>
  )
}
