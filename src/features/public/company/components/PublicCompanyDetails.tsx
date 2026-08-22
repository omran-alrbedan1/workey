import { MapPin, Globe, Calendar, Briefcase, CheckCircle, ExternalLink, Users } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import type { PublicCompany } from "../types/publicCompany.types"

interface PublicCompanyDetailsProps {
  company: PublicCompany
  isLoading?: boolean
}

export default function PublicCompanyDetails({ company, isLoading }: PublicCompanyDetailsProps) {
  const { t } = useTranslation("publicCompany")
  const { t: tCommon } = useTranslation("common")

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      {company.cover_image && (
        <div className="relative h-48 overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
          <img
            src={company.cover_image}
            alt={tCommon("imageAlts.companyCover", { name: company.name })}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Company Header */}
      <div className="flex items-start gap-4">
        {company.logo && (
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-background-card">
            <img
              src={company.logo}
              alt={tCommon("imageAlts.companyLogo", { name: company.name })}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-text-primary">{company.name}</h1>
            {company.is_verified && <CheckCircle className="h-5 w-5 text-primary" />}
          </div>
          {company.industry && <p className="text-sm text-text-muted">{company.industry}</p>}
        </div>
      </div>

      {/* Company Info */}
      <div className="grid gap-4 sm:grid-cols-2">
        {company.location && (
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <MapPin className="h-4 w-4" />
            <span>{company.location}</span>
          </div>
        )}
        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <Globe className="h-4 w-4" />
            <span>{company.website}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
        {company.size && (
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Users className="h-4 w-4" />
            <span>{company.size}</span>
          </div>
        )}
        {company.founded_year && (
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Calendar className="h-4 w-4" />
            <span>
              {t("founded")} {company.founded_year}
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      {company.description && (
        <div>
          <h2 className="mb-2 font-semibold text-text-primary">{t("about")}</h2>
          <p className="text-sm text-text-muted whitespace-pre-wrap">{company.description}</p>
        </div>
      )}

      {/* Social Links */}
      {company.social_links && (
        <div className="flex gap-2">
          {company.social_links.linkedin && (
            <Button variant="outline" size="icon" asChild>
              <a href={company.social_links.linkedin} target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4" />
              </a>
            </Button>
          )}
          {company.social_links.twitter && (
            <Button variant="outline" size="icon" asChild>
              <a href={company.social_links.twitter} target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4" />
              </a>
            </Button>
          )}
          {company.social_links.facebook && (
            <Button variant="outline" size="icon" asChild>
              <a href={company.social_links.facebook} target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      )}

      {/* Jobs Stats */}
      <div className="flex items-center gap-2 rounded-lg border border-border bg-background-card p-4">
        <Briefcase className="h-5 w-5 text-primary" />
        <div>
          <p className="text-2xl font-bold text-text-primary">{company.total_jobs ?? 0}</p>
          <p className="text-sm text-text-muted">{t("openPositions")}</p>
        </div>
      </div>
    </div>
  )
}
