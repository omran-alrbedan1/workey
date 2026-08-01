import { BadgeCheck, Building2, FileBadge2, Globe2, Mail, MapPin, Phone, Users } from "lucide-react"
import { useTranslation } from "react-i18next"

import { DetailItem, SectionCard } from "@/components/shared/cards/SectionCard"

import type { AdminCompanyDetails } from "../types/adminCompanies.types"

export default function AdminCompanyOverview({ company }: { company: AdminCompanyDetails }) {
  const { t } = useTranslation("adminCompanies")
  const formatValue = (value?: string | number | null) => {
    if (value === null || value === undefined || value === "") return t("fallbacks.notAvailable")
    return String(value)
  }

  return (
    <SectionCard icon={Building2} title={t("overview.title")}>
      <div className="grid gap-5 md:grid-cols-2">
        <DetailItem
          icon={<Building2 className="h-4 w-4" />}
          label={t("overview.legalName")}
          value={formatValue(company.legal_name ?? company.name)}
        />
        <DetailItem
          icon={<BadgeCheck className="h-4 w-4" />}
          label={t("overview.industry")}
          value={formatValue(company.industry)}
        />
        <DetailItem
          icon={<Globe2 className="h-4 w-4" />}
          label={t("overview.website")}
          value={formatValue(company.website)}
        />
        <DetailItem
          icon={<MapPin className="h-4 w-4" />}
          label={t("overview.location")}
          value={formatValue(
            company.location ?? [company.city, company.country].filter(Boolean).join(", "),
          )}
        />
        <DetailItem
          icon={<Phone className="h-4 w-4" />}
          label={t("overview.phone")}
          value={formatValue(company.phone)}
        />
        <DetailItem
          icon={<Mail className="h-4 w-4" />}
          label={t("overview.contactEmail")}
          value={formatValue(company.contact_email)}
        />
        <DetailItem
          icon={<Users className="h-4 w-4" />}
          label={t("overview.companySize")}
          value={formatValue(company.size ?? company.employee_count)}
        />
        <DetailItem
          icon={<FileBadge2 className="h-4 w-4" />}
          label={t("overview.registrationNumber")}
          value={formatValue(company.registration_number)}
        />
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-border bg-background-secondary/70 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
          {t("overview.description")}
        </p>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          {company.description || t("overview.descriptionFallback")}
        </p>
      </div>
    </SectionCard>
  )
}
