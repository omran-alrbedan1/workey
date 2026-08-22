import { CheckSquare, Clock3 } from "lucide-react"
import { useTranslation } from "react-i18next"

import StatusBadge from "@/components/shared/badges/StatusBadge"
import { SectionCard } from "@/components/shared/cards/SectionCard"
import { keyOf } from "@/lib/keyValue"

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
  const statusKey = keyOf(company.approval_status ?? company.status, "pending")
  const latestDecision = company.latest_decision ?? company.approval_decision ?? null
  const latestDecisionActor =
    latestDecision?.actor?.name ??
    latestDecision?.actor?.email ??
    latestDecision?.actor_name ??
    (statusKey === "approved"
      ? company.approved_by?.name ?? company.approved_by?.email
      : statusKey === "rejected"
        ? company.rejected_by?.name ?? company.rejected_by?.email
        : statusKey === "suspended"
          ? company.suspended_by?.name ?? company.suspended_by?.email
          : null)
  const latestDecisionReason =
    latestDecision?.reason ??
    company.rejection_reason ??
    company.approval_notes ??
    company.admin_notes ??
    null
  const latestDecisionDate =
    latestDecision?.decided_at ??
    latestDecision?.created_at ??
    (statusKey === "approved"
      ? company.approved_at
      : statusKey === "rejected"
        ? company.rejected_at
        : statusKey === "suspended"
          ? company.suspended_at
          : null)

  return (
    <SectionCard icon={CheckSquare} title={t("verification.title")}>
      <div className="space-y-3">
        <div className="rounded-2xl border border-border bg-background-secondary/60 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
            {t("verification.currentStatus")}
          </p>
          <div className="mt-3">
            <StatusBadge status={company.approval_status ?? company.status ?? "pending"} variant="soft" />
          </div>
        </div>

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

        <div className="rounded-2xl border border-border bg-background-secondary/60 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-text-primary">
            <Clock3 className="h-4 w-4 text-primary" />
            {t("verification.latestDecision")}
          </div>
          <div className="mt-3 grid gap-3 text-sm text-text-secondary md:grid-cols-3">
            <div>
              <p className="text-xs font-medium text-text-muted">{t("verification.decisionActor")}</p>
              <p className="mt-1 text-text-primary">{latestDecisionActor || t("fallbacks.notAvailable")}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-text-muted">{t("verification.decisionDate")}</p>
              <p className="mt-1 text-text-primary">
                {formatDate(latestDecisionDate) || t("fallbacks.notAvailable")}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-text-muted">{t("verification.reason")}</p>
              <p className="mt-1 text-text-primary">{latestDecisionReason || t("fallbacks.notAvailable")}</p>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  )
}
