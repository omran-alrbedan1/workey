import {
  Award,
  Building2,
  Download,
  Eye,
  GraduationCap,
  Paperclip,
  Sparkles,
  UserRound,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { valueOf } from "@/lib/keyValue"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ApplicationCvDocument } from "../../utils/cv"
import type { EmployerApplicantDetail } from "../../types/employerApplicants.types"
import CoverLetterTab from "../tabs/CoverLetterTab"
import { InfoItem, ProfileLinkItems, SectionCard, TimelineItem, formatPeriod } from "./section-ui"

interface CandidateProfileSectionProps {
  application: EmployerApplicantDetail
  cvDocument: ApplicationCvDocument | null
  isCvBusy: boolean
  onPreviewCv: () => void
  onDownloadCv: () => void
}

export default function CandidateProfileSection({
  application,
  cvDocument,
  isCvBusy,
  onPreviewCv,
  onDownloadCv,
}: CandidateProfileSectionProps) {
  const { t, i18n } = useTranslation(["employerApplicants", "common"])
  const profile = application.submitted_snapshot?.profile

  return (
    <div className="space-y-6">
      {!profile ? (
        <p className="rounded-lg border border-dashed border-border bg-background/50 p-8 text-center text-sm text-text-muted">
          {t("candidate.profileEmpty")}
        </p>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <SectionCard title={t("candidate.profileTitle")} icon={UserRound}>
              <InfoItem
                label={t("candidate.summary")}
                value={profile.identity?.summary ?? profile.professional?.summary ?? "-"}
              />
              <InfoItem
                label={t("candidate.availability")}
                value={valueOf(profile.availability?.status) || "-"}
              />
            </SectionCard>

            <SectionCard title={t("candidate.linksTitle")} icon={Sparkles}>
              <ProfileLinkItems profile={profile} />
            </SectionCard>

            {(profile.skills?.length ?? 0) > 0 && (
              <SectionCard
                title={t("candidate.skillsTitle")}
                icon={Award}
                className="lg:col-span-2"
              >
                <div className="flex flex-wrap gap-2">
                  {profile.skills!.map((skill, index) => (
                    <Badge
                      key={`${skill.slug ?? skill.name ?? index}-${index}`}
                      variant="secondary"
                    >
                      {skill.name || skill.slug || "-"}
                    </Badge>
                  ))}
                </div>
              </SectionCard>
            )}
          </div>

          {(profile.experiences?.length ?? 0) > 0 && (
            <SectionCard title={t("candidate.experiencesTitle")} icon={Building2}>
              <div className="space-y-3">
                {profile.experiences!.map((experience, index) => (
                  <TimelineItem
                    key={`${experience.title ?? "experience"}-${index}`}
                    title={experience.title || "-"}
                    subtitle={experience.company}
                    meta={formatPeriod(
                      experience.start_date,
                      experience.end_date,
                      experience.is_current,
                      i18n.language,
                      t("candidate.present"),
                    )}
                    description={experience.description}
                  />
                ))}
              </div>
            </SectionCard>
          )}

          {(profile.education?.length ?? 0) > 0 && (
            <SectionCard title={t("candidate.educationTitle")} icon={GraduationCap}>
              <div className="space-y-3">
                {profile.education!.map((education, index) => (
                  <TimelineItem
                    key={`${education.degree ?? "education"}-${index}`}
                    title={education.degree || "-"}
                    subtitle={
                      [education.institution, education.field_of_study]
                        .filter(Boolean)
                        .join(" · ") || undefined
                    }
                    meta={formatPeriod(
                      education.start_date,
                      education.end_date,
                      education.is_current,
                      i18n.language,
                      t("candidate.present"),
                    )}
                  />
                ))}
              </div>
            </SectionCard>
          )}
        </>
      )}

      {cvDocument && (
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background-card p-5 shadow-card">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Paperclip className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-text-primary">
                {t("candidate.documentsTitle")}
              </h3>
              <p className="truncate text-xs text-text-muted" title={cvDocument.name}>
                {cvDocument.name}
              </p>
              <p className="text-xs text-text-muted">{t("candidate.cvSupplementaryHint")}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {cvDocument.canPreview && (
              <Button variant="outline" size="sm" disabled={isCvBusy} onClick={onPreviewCv}>
                <Eye className="h-4 w-4" /> {t("candidate.previewCv")}
              </Button>
            )}
            {cvDocument.canDownload && (
              <Button variant="outline" size="sm" disabled={isCvBusy} onClick={onDownloadCv}>
                <Download className="h-4 w-4" /> {t("candidate.downloadCv")}
              </Button>
            )}
          </div>
        </section>
      )}

      {application.cover_letter && <CoverLetterTab coverLetter={application.cover_letter} />}
    </div>
  )
}
