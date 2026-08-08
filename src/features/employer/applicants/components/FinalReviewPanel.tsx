import { useMemo, useState } from "react"
import {
  AlertTriangle,
  Briefcase,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileSearch,
  FileText,
  Hourglass,
  Info,
  Link,
  ListChecks,
  MessageSquare,
  ShieldCheck,
  UserRound,
  Video,
  XCircle,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { StatusBadge } from "@/components/shared/badges"
import { keyOf, valueOf } from "@/lib/keyValue"
import { useInternalNotes } from "../hooks/useInternalNotes"
import { useRankedCandidates } from "@/features/employer/jobs/hooks/useRankedCandidates"
import ApplicationStatusHistory from "./ApplicationStatusHistory"
import { candidateDisplayName } from "../utils/candidateDisplay"
import type {
  ApplicationStatusKey,
  EmployerApplicantDetail,
  EmployerTestAttempt,
} from "../types/employerApplicants.types"
import type { EmployerInterview } from "@/features/employer/interviews/types/employerInterviews.types"
import type { RankedCandidate } from "@/features/employer/jobs/types/employerJobs.types"

type DecisionStatus = "accepted" | "rejected" | "on_hold"

interface EvidenceQuery<T> {
  isPending: boolean
  data?: { items: T[] }
}

interface FinalReviewPanelProps {
  application: EmployerApplicantDetail
  tests: EvidenceQuery<EmployerTestAttempt>
  interviews: EvidenceQuery<EmployerInterview>
  isDecisionPending: boolean
  isCvBusy: boolean
  onPreviewCv: () => Promise<void>
  onDownloadCv: () => Promise<void>
  onDecision: (status: DecisionStatus, note: string) => Promise<unknown>
  onRequestInformation: () => void
}

function formatDate(value?: string | null) {
  if (!value) return "-"
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString()
}

function percent(value?: number | null) {
  if (value == null) return "-"
  return `${Math.round(value)}%`
}

function transitionKeys(application: EmployerApplicantDetail) {
  return new Set(application.allowed_status_transitions?.map((status) => status.key) ?? [])
}

function canManageApplication(application: EmployerApplicantDetail) {
  if (application.permissions?.can_manage === false) return false
  if (!application.allowed_actions) return true
  return application.allowed_actions.some((action) =>
    ["MANAGE_APPLICATIONS", "manage_applications", "update_status", "final_decision"].includes(action),
  )
}

function isTerminal(statusKey: string) {
  return ["accepted", "rejected", "withdrawn"].includes(statusKey)
}

function candidateName(application: EmployerApplicantDetail, fallback: string) {
  return candidateDisplayName(application, fallback)
}

function findMatchingContext(application: EmployerApplicantDetail, candidates?: RankedCandidate[]) {
  return candidates?.find((candidate) => String(candidate.application_id) === String(application.id)) ?? null
}

function EvidenceItem({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <p className="text-xs font-medium text-text-muted">{label}</p>
      <p className="mt-1 text-sm text-text-primary">{value ?? "-"}</p>
    </div>
  )
}

function DecisionDialog({
  decision,
  isPending,
  onClose,
  onConfirm,
}: {
  decision: DecisionStatus | null
  isPending: boolean
  onClose: () => void
  onConfirm: (note: string) => Promise<unknown>
}) {
  const { t } = useTranslation("employerApplicants")
  const [note, setNote] = useState("")
  const isOpen = decision !== null

  const close = () => {
    if (isPending) return
    setNote("")
    onClose()
  }

  const confirm = async () => {
    if (!note.trim()) return
    await onConfirm(note.trim())
    setNote("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{decision ? t(`finalReview.decisions.${decision}.title`) : ""}</DialogTitle>
          <DialogDescription>{decision ? t(`finalReview.decisions.${decision}.description`) : ""}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-3">
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            {t("finalReview.decisions.finalWarning")}
          </div>
          <div className="space-y-2">
            <label htmlFor="decision-note" className="text-sm font-medium text-text-primary">
              {t("finalReview.decisions.internalNote")}
            </label>
            <Textarea
              id="decision-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={4}
              maxLength={2000}
              placeholder={t("finalReview.decisions.internalNotePlaceholder")}
              disabled={isPending}
            />
            {!note.trim() && <p className="text-xs text-red-600">{t("finalReview.decisions.noteRequired")}</p>}
          </div>
          <p className="text-xs text-text-muted">{t("finalReview.decisions.candidateMessageUnsupported")}</p>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={close} disabled={isPending}>
            {t("actions.cancel")}
          </Button>
          <Button
            type="button"
            variant={decision === "rejected" ? "destructive" : "default"}
            onClick={() => void confirm()}
            disabled={isPending || !note.trim()}
          >
            {isPending ? t("actions.processing") : t("actions.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function SnapshotSection({ application }: { application: EmployerApplicantDetail }) {
  const { t } = useTranslation("employerApplicants")
  const profile = application.submitted_snapshot?.profile
  const identity = profile?.identity
  const location = profile?.location
  const professional = profile?.professional

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <UserRound className="h-4 w-4 text-primary" />
          {t("finalReview.snapshot.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!profile ? (
          <p className="text-sm text-text-muted">{t("finalReview.snapshot.empty")}</p>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <EvidenceItem label={t("finalReview.snapshot.name")} value={identity?.name || identity?.full_name} />
              <EvidenceItem label={t("finalReview.snapshot.email")} value={identity?.email} />
              <EvidenceItem label={t("finalReview.snapshot.phone")} value={identity?.phone} />
              <EvidenceItem label={t("finalReview.snapshot.location")} value={location?.full_address || location?.city || location?.country} />
              <EvidenceItem label={t("finalReview.snapshot.availability")} value={profile.availability?.status} />
              <EvidenceItem label={t("finalReview.snapshot.headline")} value={professional?.headline} />
            </div>
            {professional?.summary && <p className="text-sm text-text-secondary">{professional.summary}</p>}
            <div className="flex flex-wrap gap-2">
              {profile.skills?.map((skill) => (
                <Badge key={skill.slug || skill.name} variant="secondary">
                  {skill.name || skill.slug}
                </Badge>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {(profile.experiences?.length ?? 0) > 0 && (
                <div>
                  <p className="mb-2 text-xs font-medium text-text-muted">{t("finalReview.snapshot.experience")}</p>
                  <div className="space-y-2">
                    {profile.experiences?.slice(0, 3).map((experience, index) => (
                      <div key={`${experience.company}-${experience.title}-${index}`} className="rounded-md border border-border p-3 text-sm">
                        <p className="font-medium">{experience.title || "-"}</p>
                        <p className="text-text-muted">{experience.company || "-"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {(profile.education?.length ?? 0) > 0 && (
                <div>
                  <p className="mb-2 text-xs font-medium text-text-muted">{t("finalReview.snapshot.education")}</p>
                  <div className="space-y-2">
                    {profile.education?.slice(0, 3).map((education, index) => (
                      <div key={`${education.institution}-${education.degree}-${index}`} className="rounded-md border border-border p-3 text-sm">
                        <p className="font-medium">{education.degree || "-"}</p>
                        <p className="text-text-muted">{education.institution || "-"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

function TestsSection({ tests }: { tests: EvidenceQuery<EmployerTestAttempt> }) {
  const { t } = useTranslation("employerApplicants")
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ListChecks className="h-4 w-4 text-primary" />
          {t("finalReview.tests.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tests.isPending ? (
          <Skeleton className="h-24 w-full" />
        ) : !tests.data?.items.length ? (
          <p className="text-sm text-text-muted">{t("tests.empty")}</p>
        ) : (
          tests.data.items.map((assignment) => {
            const attempt = assignment.attempt
            return (
              <div key={assignment.id} className="rounded-md border border-border p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{assignment.test?.title || t("tests.untitled")}</p>
                    <p className="mt-1 text-xs text-text-muted">
                      {t("finalReview.tests.attempt", {
                        attempt: assignment.attempt_number,
                        max: assignment.max_attempts,
                        remaining: assignment.attempts_remaining,
                      })}
                    </p>
                  </div>
                  <StatusBadge status={keyOf(assignment.state)} label={valueOf(assignment.state)} variant="soft" />
                </div>
                <div className="mt-3 grid gap-3 text-sm md:grid-cols-4">
                  <EvidenceItem label={t("finalReview.tests.grading")} value={valueOf(attempt?.grading_status)} />
                  <EvidenceItem label={t("finalReview.tests.score")} value={attempt?.total_score == null ? "-" : `${attempt.total_score} / ${attempt.max_score ?? "-"}`} />
                  <EvidenceItem label={t("finalReview.tests.percentage")} value={percent(attempt?.percentage)} />
                  <EvidenceItem label={t("finalReview.tests.submittedAt")} value={formatDate(attempt?.submitted_at)} />
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}

function InterviewsSection({ interviews }: { interviews: EvidenceQuery<EmployerInterview> }) {
  const { t } = useTranslation("employerApplicants")
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Video className="h-4 w-4 text-primary" />
          {t("finalReview.interviews.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {interviews.isPending ? (
          <Skeleton className="h-24 w-full" />
        ) : !interviews.data?.items.length ? (
          <p className="text-sm text-text-muted">{t("interviews.empty")}</p>
        ) : (
          interviews.data.items.map((interview) => (
            <div key={interview.id} className="rounded-md border border-border p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{valueOf(interview.type ?? interview.interview_type, t("interviews.defaultType"))}</p>
                  <p className="mt-1 text-xs text-text-muted">
                    {valueOf(interview.mode ?? interview.interview_mode)} | {formatDate(interview.scheduled_start_at ?? interview.scheduled_at)}
                  </p>
                </div>
                <StatusBadge status={keyOf(interview.status)} label={valueOf(interview.status)} variant="soft" />
              </div>
              <div className="mt-3 grid gap-3 text-sm md:grid-cols-3">
                <EvidenceItem label={t("finalReview.interviews.confirmation")} value={valueOf(interview.candidate_confirmation_status)} />
                <EvidenceItem label={t("finalReview.interviews.candidateAttendance")} value={valueOf(interview.candidate_attendance_status)} />
                <EvidenceItem label={t("finalReview.interviews.interviewerAttendance")} value={valueOf(interview.interviewer_attendance_status)} />
              </div>
              {interview.evaluation && (
                <div className="mt-3 rounded-md bg-muted/40 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium">{valueOf(interview.evaluation.recommendation)}</p>
                    <p className="text-xs text-text-muted">{formatDate(interview.evaluation.evaluated_at)}</p>
                  </div>
                  {interview.evaluation.overall_comment && (
                    <p className="mt-2 text-sm text-text-secondary">{interview.evaluation.overall_comment}</p>
                  )}
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {interview.evaluation.items?.map((item) => (
                      <div key={item.id ?? item.criterion} className="rounded border border-border bg-background p-2 text-xs">
                        <span className="font-medium">{item.criterion}</span>
                        <span className="float-right text-primary">{item.score}/5</span>
                        {item.comment && <p className="mt-1 text-text-muted">{item.comment}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

function MatchingSection({ application, matching }: { application: EmployerApplicantDetail; matching: EvidenceQuery<RankedCandidate> }) {
  const { t } = useTranslation("employerApplicants")
  const match = useMemo(() => findMatchingContext(application, matching.data?.items), [application, matching.data?.items])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldCheck className="h-4 w-4 text-primary" />
          {t("finalReview.matching.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-text-muted">{t("finalReview.matching.supportOnly")}</p>
        {matching.isPending ? (
          <Skeleton className="h-20 w-full" />
        ) : !match ? (
          <p className="text-sm text-text-muted">{t("finalReview.matching.unavailable")}</p>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              <EvidenceItem label={t("finalReview.matching.score")} value={percent(match.matching_score ?? match.score)} />
              <EvidenceItem label={t("finalReview.matching.version")} value={match.matching_score_version} />
              <EvidenceItem label={t("finalReview.matching.reasons")} value={match.reasons?.length ?? 0} />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-medium text-text-muted">{t("finalReview.matching.matchedSkills")}</p>
                <div className="flex flex-wrap gap-2">
                  {match.matched_skills?.map((skill) => <Badge key={skill.id} variant="secondary">{skill.name || skill.slug}</Badge>)}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-text-muted">{t("finalReview.matching.missingSkills")}</p>
                <div className="flex flex-wrap gap-2">
                  {match.missing_skills?.map((skill) => <Badge key={skill.id} variant="outline">{skill.name || skill.slug}</Badge>)}
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

function NotesSection({ applicationId }: { applicationId: string | number }) {
  const { t } = useTranslation("employerApplicants")
  const notes = useInternalNotes(applicationId)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageSquare className="h-4 w-4 text-primary" />
          {t("finalReview.notes.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {notes.isLoading ? (
          <Skeleton className="h-20 w-full" />
        ) : notes.notes.length === 0 ? (
          <p className="text-sm text-text-muted">{t("internalNotes.empty")}</p>
        ) : (
          notes.notes.map((note) => (
            <div key={note.id} className="rounded-md border border-border p-3">
              <p className="whitespace-pre-wrap text-sm">{note.body}</p>
              <p className="mt-2 text-xs text-text-muted">
                {note.author?.name || "Unknown"} | v{note.version} | {formatDate(note.created_at)}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

export default function FinalReviewPanel({
  application,
  tests,
  interviews,
  isDecisionPending,
  isCvBusy,
  onPreviewCv,
  onDownloadCv,
  onDecision,
  onRequestInformation,
}: FinalReviewPanelProps) {
  const { t } = useTranslation("employerApplicants")
  const [decision, setDecision] = useState<DecisionStatus | null>(null)
  const statusKey = keyOf(application.status)
  const transitions = transitionKeys(application)
  const terminal = isTerminal(statusKey)
  const canManage = canManageApplication(application)
  const jobId = application.job_posting?.id
  const matching = useRankedCandidates(jobId)
  const canAccept = canManage && !terminal && transitions.has("accepted")
  const canReject = canManage && !terminal && transitions.has("rejected")
  const canHold = canManage && !terminal && transitions.has("on_hold")
  const canRequestInfo = canManage && !terminal && transitions.has("need_more_information")

  const confirmDecision = async (note: string) => {
    if (!decision) return
    await onDecision(decision, note)
    setDecision(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ClipboardCheck className="h-5 w-5 text-primary" />
            {t("finalReview.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <EvidenceItem label={t("finalReview.summary.candidate")} value={candidateName(application, t("unknownCandidate"))} />
            <EvidenceItem label={t("finalReview.summary.job")} value={application.job_posting?.title} />
            <EvidenceItem label={t("finalReview.summary.status")} value={valueOf(application.status)} />
            <EvidenceItem label={t("finalReview.summary.applied")} value={formatDate(application.applied_at ?? application.created_at)} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => void onPreviewCv()} disabled={isCvBusy}>
              <FileSearch className="h-4 w-4" />
              {t("finalReview.cv.preview")}
            </Button>
            <Button type="button" variant="outline" onClick={() => void onDownloadCv()} disabled={isCvBusy}>
              <Download className="h-4 w-4" />
              {t("finalReview.cv.download")}
            </Button>
            {terminal && (
              <Badge variant="secondary" className="gap-1">
                <Info className="h-3.5 w-3.5" />
                {t("finalReview.terminal")}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <SnapshotSection application={application} />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Briefcase className="h-4 w-4 text-primary" />
                {t("finalReview.application.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {application.cover_letter && (
                <div>
                  <p className="mb-1 text-xs font-medium text-text-muted">{t("coverLetter.title")}</p>
                  <p className="whitespace-pre-wrap text-sm text-text-secondary">{application.cover_letter}</p>
                </div>
              )}
              <div>
                <p className="mb-2 text-xs font-medium text-text-muted">{t("screeningAnswers.title")}</p>
                {application.screening_answers?.length ? (
                  <div className="space-y-2">
                    {application.screening_answers.map((answer) => (
                      <div key={answer.id ?? answer.question_id} className="rounded-md border border-border p-3 text-sm">
                        <p className="font-medium">{answer.question_text}</p>
                        <p className="mt-1 text-text-muted">{String(answer.answer.value ?? "-")}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-text-muted">{t("screeningAnswers.empty")}</p>
                )}
              </div>
            </CardContent>
          </Card>
          <TestsSection tests={tests} />
          <InterviewsSection interviews={interviews} />
          <MatchingSection application={application} matching={matching} />
          <NotesSection applicationId={application.id} />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4 text-primary" />
                {t("finalReview.timeline.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ApplicationStatusHistory history={application.status_history ?? []} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="xl:sticky xl:top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {t("finalReview.decisions.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!canManage && (
                <div className="rounded-md border border-border bg-muted/40 p-3 text-sm text-text-muted">
                  {t("finalReview.decisions.viewOnly")}
                </div>
              )}
              {terminal && (
                <div className="rounded-md border border-border bg-muted/40 p-3 text-sm text-text-muted">
                  {t("finalReview.decisions.terminal")}
                </div>
              )}
              {!terminal && canManage && !canAccept && !canReject && !canHold && !canRequestInfo && (
                <div className="rounded-md border border-border bg-muted/40 p-3 text-sm text-text-muted">
                  {t("finalReview.decisions.noTransitions")}
                </div>
              )}
              <Button type="button" className="w-full justify-start" disabled={!canAccept || isDecisionPending} onClick={() => setDecision("accepted")}>
                <CheckCircle2 className="h-4 w-4" />
                {t("finalReview.actions.accept")}
              </Button>
              <Button type="button" variant="destructive" className="w-full justify-start" disabled={!canReject || isDecisionPending} onClick={() => setDecision("rejected")}>
                <XCircle className="h-4 w-4" />
                {t("finalReview.actions.reject")}
              </Button>
              <Button type="button" variant="outline" className="w-full justify-start" disabled={!canHold || isDecisionPending} onClick={() => setDecision("on_hold")}>
                <Hourglass className="h-4 w-4" />
                {t("finalReview.actions.hold")}
              </Button>
              <Button type="button" variant="outline" className="w-full justify-start" disabled={!canRequestInfo || isDecisionPending} onClick={onRequestInformation}>
                <FileText className="h-4 w-4" />
                {t("finalReview.actions.requestInfo")}
              </Button>
              <div className="rounded-md border border-border p-3 text-xs text-text-muted">
                <div className="mb-1 flex items-center gap-2 font-medium text-text-primary">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {t("finalReview.decisions.manualOnlyTitle")}
                </div>
                {t("finalReview.decisions.manualOnly")}
              </div>
              <div className="rounded-md border border-border p-3 text-xs text-text-muted">
                <div className="mb-1 flex items-center gap-2 font-medium text-text-primary">
                  <Link className="h-3.5 w-3.5" />
                  {t("finalReview.decisions.metadataTitle")}
                </div>
                {t("finalReview.decisions.metadataUnsupported")}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DecisionDialog
        decision={decision}
        isPending={isDecisionPending}
        onClose={() => setDecision(null)}
        onConfirm={confirmDecision}
      />
    </div>
  )
}
