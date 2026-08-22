import { BriefcaseBusiness, Building2, MapPin, ShieldCheck } from "lucide-react"
import { useTranslation } from "react-i18next"

import { StatusBadge } from "@/components/shared/badges"
import { keyOf } from "@/lib/keyValue"
import type { EmployerCompany } from "../types/employerCompany.types"

interface CompanyVisualHeaderProps {
  company: EmployerCompany
}

export default function CompanyVisualHeader({ company }: CompanyVisualHeaderProps) {
  const { t } = useTranslation("employerCompany")
  const coverUrl = company.cover_image_url || company.cover_url
  const status = keyOf(company.approval_status ?? company.status, "pending")

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-background-card shadow-card">
      <div className="relative h-48 bg-background-secondary sm:h-60">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={t("visualHeader.coverAlt", { name: company.name })}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,hsl(var(--primary)/0.18),hsl(var(--background-secondary)),hsl(var(--accent)/0.16))]">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-border/70 bg-background-card/80 text-primary shadow-sm backdrop-blur">
              <Building2 className="h-8 w-8" />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
      </div>

      <div className="relative px-5 pb-5 pt-0 sm:px-6 sm:pb-6">
        <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border-4 border-background-card bg-background-secondary shadow-card">
              {company.logo_url ? (
                <img
                  src={company.logo_url}
                  alt={t("visualHeader.logoAlt", { name: company.name })}
                  className="h-full w-full object-contain"
                />
              ) : (
                <Building2 className="h-10 w-10 text-text-muted" />
              )}
            </div>
            <div className="min-w-0 pb-1">
              <h2 className="truncate text-2xl font-bold text-text-primary sm:text-3xl">
                {company.name}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2 text-sm text-text-secondary">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background-secondary px-2.5 py-1">
                  <BriefcaseBusiness className="h-4 w-4 text-primary" />
                  {company.industry || t("visualHeader.industryFallback")}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background-secondary px-2.5 py-1">
                  <MapPin className="h-4 w-4 text-primary" />
                  {company.location || t("visualHeader.locationFallback")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pb-1">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-text-secondary">
              {t("visualHeader.verification")}
            </span>
            <StatusBadge status={status} variant="soft" />
          </div>
        </div>
      </div>
    </section>
  )
}
