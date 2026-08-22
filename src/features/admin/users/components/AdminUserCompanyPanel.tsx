import { Building2, ShieldCheck } from "lucide-react"
import { useTranslation } from "react-i18next"

import StatusBadge from "@/components/shared/badges/StatusBadge"
import { DetailItem, SectionCard } from "@/components/shared/cards/SectionCard"

import type { AdminUserRecord } from "../types/adminUsers.types"

export default function AdminUserCompanyPanel({ user }: { user: AdminUserRecord }) {
  const { t } = useTranslation("adminUsers")
  const employer = user.employer_profile
  const company = employer?.company

  return (
    <SectionCard icon={Building2} title={t("details.companyTitle")}>
      {company ? (
        <div className="grid gap-5 sm:grid-cols-2">
          <DetailItem
            icon={<Building2 className="h-4 w-4" />}
            label={t("details.companyName")}
            value={company.name || t("fallbacks.notAvailable")}
          />
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <ShieldCheck className="h-4 w-4 text-primary" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase text-text-muted">
                {t("details.companyStatus")}
              </p>
              <div className="mt-0.5">
                {company.approval_status ? (
                  <StatusBadge status={company.approval_status} variant="soft" />
                ) : (
                  <p className="wrap-words text-sm font-semibold text-text">
                    {t("fallbacks.notAvailable")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-border p-4 text-sm text-text-secondary">
          {t("details.noCompany")}
        </p>
      )}
    </SectionCard>
  )
}
