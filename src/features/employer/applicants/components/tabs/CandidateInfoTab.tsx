import {
  Briefcase,
  Calendar,
  Download,
  FileText,
  Mail,
  MessageSquare,
  MapPin,
  Phone,
  Link,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { keyOf, valueOf } from "@/lib/keyValue"
import type { ApplicationStatusKey, EmployerApplicantDetail } from "../../types/employerApplicants.types"

interface CandidateInfoTabProps {
  application: EmployerApplicantDetail
  candidateName: string
  onDownloadCv: () => void
  isDownloading: boolean
  onNavigateToInternalNotes: () => void
  onNavigateToInformationRequests: () => void
  onStatusChange: (status: ApplicationStatusKey) => void
  isStatusPending: boolean
}

export default function CandidateInfoTab({
  application,
  candidateName,
  onDownloadCv,
  isDownloading,
  onNavigateToInternalNotes,
  onNavigateToInformationRequests,
  onStatusChange,
  isStatusPending,
}: CandidateInfoTabProps) {
  const { t } = useTranslation("employerApplicants")
  const profile = application.submitted_snapshot?.profile
  const nextStatuses = application.allowed_status_transitions?.map((status) => status.key) ?? []

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="rounded-xl border border-border bg-background-card p-6 shadow-card">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          {/* Candidate Info */}
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-2xl font-bold text-white">
              {candidateName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">{candidateName}</h2>
              {(profile?.identity?.full_name || profile?.identity?.first_name || profile?.identity?.last_name) && (
                <p className="mt-1 text-sm text-text-muted">
                  {profile.professional?.headline || profile.identity?.email || ""}
                </p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-text-muted">
                {profile?.identity?.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    {profile.identity.email}
                  </span>
                )}
                {profile?.identity?.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    {profile.identity.phone}
                  </span>
                )}
                {(profile?.location?.city || profile?.location?.full_address) && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {profile.location.city || profile.location.full_address}
                  </span>
                )}
              </div>
              {/* Social Links */}
              <div className="mt-3 flex items-center gap-2">
                {profile?.professional?.linkedin_url && (
                  <a
                    href={profile.professional.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-primary"
                  >
                    <Link className="h-4 w-4" />
                  </a>
                )}
                {profile?.professional?.github_url && (
                  <a
                    href={profile.professional.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-primary"
                  >
                    <Link className="h-4 w-4" />
                  </a>
                )}
                {profile?.professional?.portfolio_url && (
                  <a
                    href={profile.professional.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-primary"
                  >
                    <Link className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Status & Match */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className="text-sm"
              >
                {valueOf(application.status, "applied")}
              </Badge>
              {application.match_score != null && (
                <div className={cn(
                  "rounded-lg px-3 py-1 text-center text-sm font-medium",
                  application.match_score >= 70 ? "bg-emerald-100 text-emerald-700" :
                  application.match_score >= 40 ? "bg-amber-100 text-amber-700" :
                  "bg-red-100 text-red-700"
                )}>
                  {application.match_score <= 1
                    ? Math.round(application.match_score * 100)
                    : Math.round(application.match_score)}% {t("columns.match")}
                </div>
              )}
            </div>
            {application.job_posting?.title && (
              <div className="flex items-center gap-1.5 text-sm text-text-muted">
                <Briefcase className="h-4 w-4" />
                <span>{application.job_posting.title}</span>
              </div>
            )}
            {application.applied_at && (
              <div className="flex items-center gap-1.5 text-sm text-text-muted">
                <Calendar className="h-4 w-4" />
                <span>{t("columns.applied")}: {new Date(application.applied_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-6">
          <Button
            type="button"
            onClick={onDownloadCv}
            disabled={isDownloading}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {isDownloading ? t("actions.downloading") : t("actions.downloadCv")}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onNavigateToInternalNotes}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            {t("actions.internalNotes")}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onNavigateToInformationRequests}
          >
            <FileText className="h-4 w-4 mr-2" />
            {t("actions.informationRequests")}
          </Button>

          {nextStatuses.length > 0 && (
          <div className="flex items-center gap-2 mr-auto">
            <span className="text-sm font-medium text-text-muted">{t("actions.changeStatus")}:</span>
            <Select
              value=""
              onValueChange={(value) => onStatusChange(value as ApplicationStatusKey)}
              disabled={isStatusPending}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t("actions.changeStatus")} />
              </SelectTrigger>
              <SelectContent>
                {nextStatuses
                  .filter((s) => s !== keyOf(application.status))
                  .map((s) => (
                    <SelectItem key={s} value={s}>
                      {t(`statuses.${s}`)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          )}
        </div>
      </div>
    </div>
  )
}
