import { CheckSquare, Clock3 } from "lucide-react"
import { useTranslation } from "react-i18next"

import StatusBadge from "@/components/shared/badges/StatusBadge"
import { SectionCard } from "@/components/shared/cards/SectionCard"

import type { AdminCompanyDetails } from "../types/adminCompanies.types"

export default function AdminCompanyVerificationCard({
  company,
}: {
  company: AdminCompanyDetails
}) {
  const { t, i18n } = useTranslation("adminCompanies")
  const formatDate = (value?: string | null) => {
    if (!value) return t("fallbacks.noDate")
    const date = new Date(value)
    return Number.isNaN(date.getTime())
      ? value
      : new Intl.DateTimeFormat(i18n.resolvedLanguage, {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(date)
  }

  return (
    <SectionCard icon={CheckSquare} title={t("verification.title")}>
      <div className="space-y-3">
        {(company.verification_items?.length ?? 0) > 0 ? (
          company.verification_items?.map((item) => (
            <div
              key={item.key}
              className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-background-secondary/60 p-4"
            >
              <div>
                <p className="font-medium text-text-primary">{item.label}</p>
                <p className="mt-1 text-sm text-text-secondary">
                  {item.note || t("verification.noReviewerNote")}
                </p>
              </div>
              <div className="text-end">
                <StatusBadge status={item.status} variant="soft" />
                <p className="mt-2 text-xs text-text-muted">{formatDate(item.updated_at)}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-background-secondary/50 p-4 text-sm text-text-secondary">
            {t("verification.recordsUnavailable")}
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-background-secondary/60 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-text-primary">
              <Clock3 className="h-4 w-4 text-primary" />
              {t("verification.latestApprovalNote")}
            </div>
            <p className="mt-2 text-sm text-text-secondary">
              {company.approval_notes ||
                company.rejection_reason ||
                t("verification.noApprovalNote")}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-background-secondary/60 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-text-primary">
              <Clock3 className="h-4 w-4 text-primary" />
              {t("verification.activityTimestamps")}
            </div>
            <div className="mt-2 space-y-1 text-sm text-text-secondary">
              <p>{t("verification.created", { date: formatDate(company.created_at) })}</p>
              <p>{t("verification.approved", { date: formatDate(company.approved_at) })}</p>
              <p>{t("verification.lastActive", { date: formatDate(company.last_active_at) })}</p>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  )
}
