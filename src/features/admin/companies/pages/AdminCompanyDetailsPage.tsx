import { Building2, BriefcaseBusiness, Edit, ExternalLink, ShieldCheck, Users } from "lucide-react"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"

import StatusBadge from "@/components/shared/badges/StatusBadge"
import PageHeader from "@/components/shared/headers/PageHeader"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ROUTES } from "@/config"
import { images } from "@/constants/images"
import { AdminFeatureError } from "@/features/admin/shared/components"

import AdminCompanyOverview from "../components/AdminCompanyOverview"
import AdminCompanyOwnershipCard from "../components/AdminCompanyOwnershipCard"
import AdminCompanyRecruitmentPanel from "../components/AdminCompanyRecruitmentPanel"
import AdminCompanyVerificationCard from "../components/AdminCompanyVerificationCard"
import AdminCompanyFormDialog from "../components/AdminCompanyFormDialog"
import CompanyMemberList from "../components/CompanyMemberList"
import { useAdminCompanyDetails } from "../hooks/useAdminCompanyDetails"

export default function AdminCompanyDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation("adminCompanies")
  const companyQuery = useAdminCompanyDetails(id)
  const [editOpen, setEditOpen] = useState(false)

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
          <div className="flex items-center gap-2">
            <StatusBadge
              status={company.approval_status ?? company.status ?? "pending"}
              variant="soft"
            />
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
          <p className="text-xs uppercase tracking-wide text-text-muted">{t("details.employer")}</p>
          <p className="mt-3 text-lg font-semibold text-text-primary">
            {company.employer?.name || company.employer?.email || t("fallbacks.notAvailable")}
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
          <TabsTrigger value="recruitment" className="gap-2  px-4 py-2.5">
            <BriefcaseBusiness className="h-4 w-4" />
            {t("details.tabs.recruitment")}
          </TabsTrigger>
          <TabsTrigger value="verification" className="gap-2  px-4 py-2.5">
            <ShieldCheck className="h-4 w-4" />
            {t("details.tabs.verification")}
          </TabsTrigger>
          <TabsTrigger value="members" className="gap-2  px-4 py-2.5">
            <Users className="h-4 w-4" />
            {t("details.tabs.members")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <AdminCompanyOverview company={company} />
            <AdminCompanyOwnershipCard company={company} />
          </div>
        </TabsContent>

        <TabsContent value="recruitment">
          <AdminCompanyRecruitmentPanel company={company} />
        </TabsContent>

        <TabsContent value="verification">
          <AdminCompanyVerificationCard company={company} />
        </TabsContent>

        <TabsContent value="members">
          <CompanyMemberList companyId={company.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
