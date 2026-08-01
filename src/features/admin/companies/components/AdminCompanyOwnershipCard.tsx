import { BriefcaseBusiness, Mail, Phone, ShieldCheck, UserRound } from "lucide-react"
import { useTranslation } from "react-i18next"

import StatusBadge from "@/components/shared/badges/StatusBadge"
import { DetailItem, SectionCard } from "@/components/shared/cards/SectionCard"

import type { AdminCompanyDetails } from "../types/adminCompanies.types"

export default function AdminCompanyOwnershipCard({ company }: { company: AdminCompanyDetails }) {
  const { t } = useTranslation("adminCompanies")
  const text = (value?: string | null) => value || t("fallbacks.notAvailable")

  return (
    <SectionCard icon={UserRound} title={t("ownership.title")}>
      <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-border bg-background-secondary/70 p-4">
        <div>
          <p className="text-sm font-semibold text-text-primary">{text(company.employer?.name)}</p>
          <p className="text-xs text-text-muted">{t("ownership.primaryAccount")}</p>
        </div>
        <StatusBadge status={company.employer?.status || "pending"} variant="soft" />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <DetailItem
          icon={<BriefcaseBusiness className="h-4 w-4" />}
          label={t("ownership.employerName")}
          value={text(company.employer?.name)}
        />
        <DetailItem
          icon={<Mail className="h-4 w-4" />}
          label={t("ownership.employerEmail")}
          value={text(company.employer?.email)}
        />
        <DetailItem
          icon={<Phone className="h-4 w-4" />}
          label={t("ownership.employerPhone")}
          value={text(company.employer?.phone)}
        />
        <DetailItem
          icon={<ShieldCheck className="h-4 w-4" />}
          label={t("ownership.createdBy")}
          value={text(company.created_by?.name ?? company.created_by?.email)}
        />
      </div>
    </SectionCard>
  )
}
