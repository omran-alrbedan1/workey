import { ExternalLink, UserRound } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { valueOf } from "@/lib/keyValue"
import { ROUTES } from "@/config"
import { cn } from "@/lib/utils"
import type { ApplicationSnapshotProfile } from "@/features/employer/applicants/types/employerApplicants.types"
import type { EmployerInterview } from "../types/employerInterviews.types"
import ContextBlock from "./ContextBlock"
import PanelCard from "./PanelCard"

interface CandidateContextCardProps {
  isRtl: boolean
  data: EmployerInterview
  profile?: ApplicationSnapshotProfile
  applicationId?: string | number
}

export default function CandidateContextCard({
  isRtl,
  data: _data,
  profile,
  applicationId,
}: CandidateContextCardProps) {
  const { t } = useTranslation("employerInterviews")
  const navigate = useNavigate()
  const identity = profile?.identity
  const skills = (profile?.skills ?? []).filter((skill) => skill.name).slice(0, 8)
  const experiences = [...(profile?.experiences ?? [])].slice(0, 2)
  const education = [...(profile?.education ?? [])].slice(0, 2)
  const summary = identity?.summary || profile?.professional?.summary
  const headline = identity?.headline || profile?.professional?.headline
  const location =
    valueOf(profile?.location?.city) ||
    valueOf(profile?.location?.country) ||
    profile?.location?.full_address
  const hasContext = Boolean(
    headline || summary || location || skills.length || experiences.length || education.length,
  )

  return (
    <PanelCard icon={UserRound} title={t("hrAssistance.candidateContext.title")}>
      {!hasContext ? (
        <p className="text-sm text-text-muted">{t("hrAssistance.candidateContext.empty")}</p>
      ) : (
        <div className="space-y-4">
          {(headline || location) && (
            <p className={cn("text-sm text-text-muted", isRtl && "text-end")}>
              {[headline, location].filter(Boolean).join(" · ")}
            </p>
          )}
          {summary && (
            <ContextBlock isRtl={isRtl} label={t("hrAssistance.candidateContext.summary")}>
              <p className="line-clamp-4 text-sm text-text-primary">{summary}</p>
            </ContextBlock>
          )}
          {skills.length > 0 && (
            <ContextBlock isRtl={isRtl} label={t("hrAssistance.candidateContext.skills")}>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, index) => (
                  <span
                    key={`${skill.slug}-${index}`}
                    className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </ContextBlock>
          )}
          {experiences.length > 0 && (
            <ContextBlock isRtl={isRtl} label={t("hrAssistance.candidateContext.experience")}>
              {experiences.map((experience, index) => (
                <p key={index} className="text-sm text-text-primary">
                  {[experience.title, experience.company].filter(Boolean).join(" - ")}
                </p>
              ))}
            </ContextBlock>
          )}
          {education.length > 0 && (
            <ContextBlock isRtl={isRtl} label={t("hrAssistance.candidateContext.education")}>
              {education.map((item, index) => (
                <p key={index} className="text-sm text-text-primary">
                  {[item.degree, item.field_of_study, item.institution].filter(Boolean).join(" - ")}
                </p>
              ))}
            </ContextBlock>
          )}
        </div>
      )}
      {applicationId && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-auto w-full"
          onClick={() => navigate(ROUTES.employer.applicantDetails(applicationId))}
        >
          {t("hrAssistance.candidateContext.viewApplication")}
          <ExternalLink className="h-4 w-4" />
        </Button>
      )}
    </PanelCard>
  )
}
