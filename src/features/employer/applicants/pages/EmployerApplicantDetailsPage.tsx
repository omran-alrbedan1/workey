import {
  Briefcase,
  Calendar,
  ChevronDown,
  Download,
  FileText,
  HelpCircle,
  Mail,
  MessageSquare,
  User,
  CheckCircle2,
} from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ROUTES } from "@/config"
import { cn } from "@/lib/utils"
import { showSuccessToast, showErrorToast } from "@/lib/toast"
import { useEmployerApplicantDetail, useDownloadCv } from "../hooks/useEmployerApplicantDetail"
import PageHeader from "@/components/shared/headers/PageHeader"
import ErrorState from "@/components/shared/states/ErrorState"
import {
  useEmployerApplicants,
} from "../hooks/useEmployerApplicants"
import InternalNotes from "../components/InternalNotes"
import InformationRequests from "../components/InformationRequests"
import type { ApplicationScreeningAnswer } from "../types/employerApplicants.types"

const nextStatuses = [
  "shortlisted",
  "test_pending",
  "test_completed",
  "final_review",
  "on_hold",
  "accepted",
  "rejected",
] as const

function getKey(v: unknown): string {
  if (!v) return ""
  if (typeof v === "string") return v
  if (typeof v === "object") return (v as { key?: string }).key ?? ""
  return ""
}

function AnswerDisplay({ answer }: { answer: ApplicationScreeningAnswer }) {
  const { t } = useTranslation("employerApplicants")
  const type = getKey(answer.question_type)
  const Icon = type === "boolean" ? CheckCircle2 : type === "number" ? ChevronDown : MessageSquare
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <p className="mb-2 text-sm font-medium text-text-primary">{answer.question_text}</p>
      <div className="flex items-start gap-2 text-sm text-text-secondary">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <span>
          {answer.answer_text
            ? answer.answer_text
            : answer.answer_number != null
              ? String(answer.answer_number)
              : answer.answer_boolean != null
                ? (answer.answer_boolean ? t("answers.yes") : t("answers.no"))
                : answer.selected_options?.map((o) => o.text).join(", ") || "—"}
        </span>
      </div>
    </div>
  )
}

export default function EmployerApplicantDetailsPage() {
  const { t } = useTranslation("employerApplicants")
  const navigate = useNavigate()
  const { id } = useParams()
  const { data: application, isPending, isError, refetch } = useEmployerApplicantDetail(id)
  const downloadCv = useDownloadCv()
  const { statusMutation } = useEmployerApplicants(application?.job?.id)

  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownloadCv = async () => {
    if (!id) return
    setIsDownloading(true)
    try {
      await downloadCv(id)
      showSuccessToast("CV downloaded")
    } catch {
      showErrorToast("Failed to download CV")
    } finally {
      setIsDownloading(false)
    }
  }

  const handleStatusChange = (status: string) => {
    if (!id) return
    statusMutation.mutate({ applicationId: id, input: { status } })
  }

  if (isError) {
    return (
      <ErrorState
        title={t("errors.title")}
        description={t("errors.description")}
        retry={() => void refetch()}
      />
    )
  }

  const candidate = application?.candidate
  const candidateName = candidate?.full_name || candidate?.name || candidate?.email || t("unknownCandidate")

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("detailTitle")}
        description={candidateName}
        icon={User}
        showBackButton
        backButtonLabel={t("actions.back")}
        onBackClick={() => {
          if (application?.job?.id) {
            navigate(ROUTES.employer.jobApplicants(application.job.id))
          } else {
            navigate(ROUTES.employer.applicants)
          }
        }}
      />

      {isPending ? (
        <div className="space-y-6">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      ) : application ? (
        <>
          {/* Candidate Info Card */}
          <Card className="overflow-hidden border-border bg-background-card shadow-card">
            <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-8">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl font-bold text-white backdrop-blur-sm">
                    {candidateName.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-white">
                    <h2 className="text-xl font-bold">{candidateName}</h2>
                    {candidate?.headline && (
                      <p className="text-sm text-white/80">{candidate.headline}</p>
                    )}
                    {candidate?.email && (
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-white/70">
                        <Mail className="h-3.5 w-3.5" />
                        {candidate.email}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {application.match_score != null && (
                    <div className={cn(
                      "rounded-lg px-4 py-2 text-center backdrop-blur-sm",
                      application.match_score >= 70 ? "bg-emerald-500/30" :
                      application.match_score >= 40 ? "bg-amber-500/30" :
                      "bg-red-500/30"
                    )}>
                      <p className="text-2xl font-bold text-white">
                        {application.match_score <= 1
                          ? Math.round(application.match_score * 100)
                          : Math.round(application.match_score)}%
                      </p>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-white/70">
                        {t("columns.match")}
                      </p>
                    </div>
                  )}
                  <Badge
                    variant="secondary"
                    className="self-start bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                  >
                    {getKey(application.status) || "applied"}
                  </Badge>
                </div>
              </div>
            </div>
            <CardContent className="space-y-6 p-6">
              {/* Quick Info */}
              <div className="flex flex-wrap gap-4 text-sm text-text-muted">
                {application.job?.title && (
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-primary" />
                    <span>{application.job.title}</span>
                  </div>
                )}
                {application.applied_at && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{t("columns.applied")}: {new Date(application.applied_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  onClick={() => void handleDownloadCv()}
                  disabled={isDownloading}
                  className="gap-2 text-white"
                >
                  <Download className="h-4 w-4" />
                  {isDownloading ? t("actions.downloading") : t("actions.downloadCv")}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => id && navigate(ROUTES.employer.applicantInternalNotes(id))}
                >
                  <MessageSquare className="h-4 w-4" />
                  {t("actions.internalNotes")}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => id && navigate(ROUTES.employer.applicantInformationRequests(id))}
                >
                  <FileText className="h-4 w-4" />
                  {t("actions.informationRequests")}
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text-muted">{t("actions.changeStatus")}:</span>
                  <Select
                    value=""
                    onValueChange={handleStatusChange}
                    disabled={statusMutation.isPending}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder={t("actions.changeStatus")} />
                    </SelectTrigger>
                    <SelectContent>
                      {nextStatuses
                        .filter((s) => s !== getKey(application.status))
                        .map((s) => (
                          <SelectItem key={s} value={s}>
                            {t(`statuses.${s}`)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Screening Answers */}
              {application.screening_answers && application.screening_answers.length > 0 && (
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                    <HelpCircle className="h-4 w-4 text-primary" />
                    {t("screeningAnswers.title")}
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {application.screening_answers.map((answer, i) => (
                      <AnswerDisplay key={answer.id ?? i} answer={answer} />
                    ))}
                  </div>
                </div>
              )}

              {/* Cover Letter */}
              {application.cover_letter && (
                <div className="space-y-2">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                    <FileText className="h-4 w-4 text-primary" />
                    {t("coverLetter.title")}
                  </h3>
                  <div className="rounded-lg border border-border bg-background p-4">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
                      {application.cover_letter}
                    </p>
                  </div>
                </div>
              )}

              {/* Tests & Interviews */}
              <div className="flex gap-3">
                {(application.tests_count ?? 0) > 0 && (
                  <div className="rounded-lg border border-border bg-background/50 px-4 py-3">
                    <p className="text-xs font-medium text-text-muted">Tests</p>
                    <p className="text-lg font-bold text-text-primary">{application.tests_count}</p>
                  </div>
                )}
                {(application.interviews_count ?? 0) > 0 && (
                  <div className="rounded-lg border border-border bg-background/50 px-4 py-3">
                    <p className="text-xs font-medium text-text-muted">Interviews</p>
                    <p className="text-lg font-bold text-text-primary">{application.interviews_count}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Internal Notes */}
          <InternalNotes applicationId={id!} />

          {/* Information Requests */}
          <InformationRequests applicationId={id!} />
        </>
      ) : null}
    </div>
  )
}
