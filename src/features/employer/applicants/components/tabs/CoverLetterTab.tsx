import { FileText } from "lucide-react"
import { useTranslation } from "react-i18next"

interface CoverLetterTabProps {
  coverLetter: string | null | undefined
}

export default function CoverLetterTab({ coverLetter }: CoverLetterTabProps) {
  const { t } = useTranslation("employerApplicants")

  if (!coverLetter) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-background/50 p-8 text-center text-sm text-text-muted">
        {t("coverLetter.empty")}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-text-primary">
        <FileText className="h-5 w-5 text-primary" />
        {t("coverLetter.title")}
      </h3>
      <div className="rounded-lg border border-border bg-background p-6">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
          {coverLetter}
        </p>
      </div>
    </div>
  )
}
