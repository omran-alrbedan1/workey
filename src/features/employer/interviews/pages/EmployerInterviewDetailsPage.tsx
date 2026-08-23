import { useEffect, useState } from "react"
import type { ElementType, ReactNode } from "react"
import {
  Ban,
  Briefcase,
  Calendar,
  CalendarSync,
  CheckCircle,
  ClipboardCheck,
  Clock,
  ExternalLink,
  HelpCircle,
  History,
  ListChecks,
  MapPin,
  MoreHorizontal,
  Plus,
  StickyNote,
  UserRound,
  UserX,
  Video,
  X,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import PageHeader from "@/components/shared/headers/PageHeader"
import ErrorState from "@/components/shared/states/ErrorState"
import EmptyState from "@/components/shared/states/EmptyState"
import EmployerFeatureError from "@/features/employer/shared/components/EmployerFeatureError"
import { StatusBadge } from "@/components/shared/badges"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { ROUTES } from "@/config"
import { valueOf, type KeyValueField } from "@/lib/keyValue"
import { showErrorToast } from "@/lib/toast"
import { cn } from "@/lib/utils"
import CompleteInterviewDialog from "../components/CompleteInterviewDialog"
import AttendanceInterviewDialog from "../components/AttendanceInterviewDialog"
import CancelInterviewDialog from "../components/CancelInterviewDialog"
import InterviewEvaluationForm from "../components/InterviewEvaluationForm"
import NoShowInterviewDialog from "../components/NoShowInterviewDialog"
import RescheduleInterviewDialog from "../components/RescheduleInterviewDialog"
import VideoInterviewSection from "../components/VideoInterviewSection"
import { useEmployerInterview } from "../hooks/useEmployerInterview"
import type { ApplicationSnapshotProfile } from "@/features/employer/applicants/types/employerApplicants.types"
import type {
  EmployerInterview,
  EmployerInterviewEvaluation,
  EmployerInterviewEvaluateInput,
  EmployerInterviewHistoryItem,
  EmployerInterviewScheduleHistoryItem,
} from "../types/employerInterviews.types"
import {
  actionAllowed,
  interviewCandidateName,
  interviewJobTitle,
  interviewKey,
  interviewValue,
  isActiveInterview,
  scheduledEnd,
  scheduledStart,
} from "../utils/interviewDisplay"

export default function EmployerInterviewDetailsPage() {
  const { t, i18n } = useTranslation("employerInterviews")
  const isRtl = i18n.dir() === "rtl"
  const { id } = useParams()
  const navigate = useNavigate()
  const interview = useEmployerInterview(id)
  const [rescheduleOpen, setRescheduleOpen] = useState(false)
  const [completeOpen, setCompleteOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [attendanceOpen, setAttendanceOpen] = useState(false)
  const [noShowOpen, setNoShowOpen] = useState(false)

  if (interview.isPending) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={t("details.title")}
          icon={Calendar}
          showBackButton
          backButtonLabel={t("back")}
          onBackClick={() => navigate(ROUTES.employer.interviews)}
        />
        <Skeleton className="h-72 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    )
  }

  if (interview.isError) {
    return (
      <EmployerFeatureError
        title={t("title")}
        error={interview.error}
        retry={() => void interview.refetch()}
      />
    )
  }

  if (!interview.data) {
    return <ErrorState title={t("errors.title")} description={t("errors.notFound")} />
  }

  const data = interview.data
  const statusKey = interviewKey(data.status)
  const startAt = scheduledStart(data)
  const endAt = scheduledEnd(data)
  const interviewType = data.type ?? data.interview_type
  const interviewMode = data.mode ?? data.interview_mode
  const modeKey = interviewKey(interviewMode)
  const isOnline = modeKey === "online"
  const active = isActiveInterview(data)
  const canUpdate = actionAllowed(data, "update")
  const canReschedule = actionAllowed(data, "reschedule")
  const canCancel = actionAllowed(data, "cancel")
  const canRecordAttendance = actionAllowed(data, "attendance")
  const canMarkNoShow = actionAllowed(data, "no_show")
  const canComplete = actionAllowed(data, "complete")
  const canEvaluate = actionAllowed(data, "evaluate") && !data.evaluation
  const canJoinVideo = isOnline && active && actionAllowed(data, "join_video")
  const durationMinutes =
    startAt && endAt
      ? Math.round((new Date(endAt).getTime() - new Date(startAt).getTime()) / 60_000)
      : data.duration_minutes
  const evaluation = data.evaluation
  const hasHistory = Boolean(data.status_history?.length || data.schedule_history?.length)
  const applicationId = data.job_application_id ?? data.application_id ?? data.job_application?.id
  const snapshotProfile = data.job_application?.submitted_snapshot?.profile

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("details.title")}
        description={interviewCandidateName(data, t("unknownCandidate"))}
        icon={Calendar}
        showBackButton
        backButtonLabel={t("back")}
        onBackClick={() => navigate(ROUTES.employer.interviews)}
        rightContent={
          <InterviewActionsMenu
            isRtl={isRtl}
            canReschedule={canReschedule}
            canRecordAttendance={canRecordAttendance}
            canComplete={canComplete}
            canMarkNoShow={canMarkNoShow}
            canCancel={canCancel}
            onReschedule={() => setRescheduleOpen(true)}
            onRecordAttendance={() => setAttendanceOpen(true)}
            onComplete={() => setCompleteOpen(true)}
            onMarkNoShow={() => setNoShowOpen(true)}
            onCancel={() => setCancelOpen(true)}
          />
        }
      />

      {canJoinVideo && <VideoInterviewSection interviewId={data.id} />}

      <InterviewInfoSection
        isRtl={isRtl}
        data={data}
        statusKey={statusKey}
        interviewType={interviewType}
        interviewMode={interviewMode}
        isOnline={isOnline}
        startAt={startAt}
        durationMinutes={durationMinutes}
      />

      <section className="space-y-4">
        <div className={cn(isRtl && "text-end")}>
          <h2 className="text-lg font-semibold text-text-primary">{t("hrAssistance.title")}</h2>
          <p className="mt-0.5 text-sm text-text-muted">{t("hrAssistance.description")}</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <PrivateNotesCard
            savedNote={data.internal_note || data.note || data.notes}
            canEdit={canUpdate}
            isSaving={interview.noteMutation.isPending}
            onSave={(value) => interview.noteMutation.mutateAsync(value)}
          />
          <PreparedQuestionsCard isRtl={isRtl} />
          <CandidateContextCard
            isRtl={isRtl}
            data={data}
            profile={snapshotProfile}
            applicationId={applicationId}
          />
          <EvaluationCard
            isRtl={isRtl}
            evaluation={evaluation}
            canEvaluate={canEvaluate}
            isSubmitting={interview.evaluateMutation.isPending}
            onSubmit={(input) => interview.evaluateMutation.mutateAsync(input)}
          />
        </div>
      </section>

      {hasHistory && (
        <InterviewHistoryFromResponse
          isRtl={isRtl}
          statusHistory={data.status_history ?? []}
          scheduleHistory={data.schedule_history ?? []}
        />
      )}

      <RescheduleInterviewDialog
        interviewId={data.id}
        currentScheduledAt={startAt}
        currentScheduledEndAt={endAt}
        currentMode={modeKey}
        currentMeetingLink={data.meeting_link}
        currentLocationText={data.location_text ?? data.location}
        open={rescheduleOpen}
        isPending={interview.rescheduleMutation.isPending}
        onOpenChange={setRescheduleOpen}
        onSubmit={(_id, input) => interview.rescheduleMutation.mutateAsync(input)}
      />
      <CompleteInterviewDialog
        open={completeOpen}
        isPending={interview.completeMutation.isPending}
        onOpenChange={setCompleteOpen}
        onSubmit={(note) => interview.completeMutation.mutateAsync(note)}
      />
      <AttendanceInterviewDialog
        open={attendanceOpen}
        isPending={interview.attendanceMutation.isPending}
        onOpenChange={setAttendanceOpen}
        onSubmit={(input) => interview.attendanceMutation.mutateAsync(input)}
      />
      <NoShowInterviewDialog
        open={noShowOpen}
        isPending={interview.noShowMutation.isPending}
        onOpenChange={setNoShowOpen}
        onSubmit={(input) => interview.noShowMutation.mutateAsync(input)}
      />
      <CancelInterviewDialog
        open={cancelOpen}
        isPending={interview.cancelMutation.isPending}
        onOpenChange={setCancelOpen}
        onSubmit={(input) => interview.cancelMutation.mutateAsync(input)}
      />
    </div>
  )
}

function InterviewActionsMenu({
  isRtl,
  canReschedule,
  canRecordAttendance,
  canComplete,
  canMarkNoShow,
  canCancel,
  onReschedule,
  onRecordAttendance,
  onComplete,
  onMarkNoShow,
  onCancel,
}: {
  isRtl: boolean
  canReschedule: boolean
  canRecordAttendance: boolean
  canComplete: boolean
  canMarkNoShow: boolean
  canCancel: boolean
  onReschedule: () => void
  onRecordAttendance: () => void
  onComplete: () => void
  onMarkNoShow: () => void
  onCancel: () => void
}) {
  const { t } = useTranslation("employerInterviews")
  const hasActions =
    canReschedule || canRecordAttendance || canComplete || canMarkNoShow || canCancel

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 bg-background/80 shadow-sm hover:bg-background"
          disabled={!hasActions}
          aria-label={t("actions.label")}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRtl ? "start" : "end"} className="w-52">
        <DropdownMenuLabel>{t("actions.label")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {canReschedule && (
          <DropdownMenuItem
            className={cn(isRtl && "flex-row-reverse text-end")}
            onSelect={onReschedule}
          >
            <CalendarSync /> {t("actions.reschedule")}
          </DropdownMenuItem>
        )}
        {canRecordAttendance && (
          <DropdownMenuItem
            className={cn(isRtl && "flex-row-reverse text-end")}
            onSelect={onRecordAttendance}
          >
            <ListChecks /> {t("actions.attendance")}
          </DropdownMenuItem>
        )}
        {canComplete && (
          <DropdownMenuItem
            className={cn(isRtl && "flex-row-reverse text-end")}
            onSelect={onComplete}
          >
            <CheckCircle /> {t("actions.complete")}
          </DropdownMenuItem>
        )}
        {canMarkNoShow && (
          <DropdownMenuItem
            className={cn(isRtl && "flex-row-reverse text-end")}
            onSelect={onMarkNoShow}
          >
            <UserX /> {t("actions.noShow")}
          </DropdownMenuItem>
        )}
        {canCancel && (
          <DropdownMenuItem
            className={cn("text-red-600 focus:text-red-700", isRtl && "flex-row-reverse text-end")}
            onSelect={onCancel}
          >
            <Ban /> {t("actions.cancel")}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function InterviewInfoSection({
  isRtl,
  data,
  statusKey,
  interviewType,
  interviewMode,
  isOnline,
  startAt,
  durationMinutes,
}: {
  isRtl: boolean
  data: EmployerInterview
  statusKey: string
  interviewType?: KeyValueField
  interviewMode?: KeyValueField
  isOnline: boolean
  startAt?: string | null
  durationMinutes?: number
}) {
  const { t } = useTranslation("employerInterviews")

  return (
    <section className="rounded-lg border border-border bg-background-card p-5 shadow-card">
      <div
        className={cn(
          "mb-4 flex flex-wrap items-center justify-between gap-3",
          isRtl && "flex-row-reverse text-end",
        )}
      >
        <h2 className="text-lg font-semibold text-text-primary">{t("details.infoTitle")}</h2>
        <StatusBadge status={statusKey} label={interviewValue(data.status)} variant="soft" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DetailItem
          isRtl={isRtl}
          icon={UserRound}
          label={t("columns.candidate")}
          value={interviewCandidateName(data, t("unknownCandidate"))}
        />
        <DetailItem
          isRtl={isRtl}
          icon={Briefcase}
          label={t("scope.job")}
          value={interviewJobTitle(data) ?? "-"}
        />
        <DetailItem
          isRtl={isRtl}
          icon={Clock}
          label={t("columns.type")}
          value={`${interviewValue(interviewType)}${durationMinutes ? ` - ${durationMinutes}m` : ""}`}
        />
        <DetailItem
          isRtl={isRtl}
          icon={Calendar}
          label={t("columns.scheduled")}
          value={
            startAt
              ? new Date(startAt).toLocaleString(undefined, {
                  dateStyle: "full",
                  timeStyle: "short",
                })
              : "-"
          }
        />
        <DetailItem
          isRtl={isRtl}
          icon={isOnline ? Video : MapPin}
          label={t("schedule.mode")}
          value={
            isOnline
              ? data.meeting_link || t("interviewModes.video")
              : data.location_text || data.location || interviewValue(interviewMode) || "-"
          }
        />
        {data.candidate_confirmation_status && (
          <DetailItem
            isRtl={isRtl}
            icon={CheckCircle}
            label={t("details.candidateConfirmation")}
            value={interviewValue(data.candidate_confirmation_status)}
          />
        )}
        {data.candidate_attendance_status && (
          <DetailItem
            isRtl={isRtl}
            icon={UserRound}
            label={t("details.candidateAttendance")}
            value={interviewValue(data.candidate_attendance_status)}
          />
        )}
        {data.interviewer_attendance_status && (
          <DetailItem
            isRtl={isRtl}
            icon={ListChecks}
            label={t("details.interviewerAttendance")}
            value={interviewValue(data.interviewer_attendance_status)}
          />
        )}
      </div>
      {(data.confirmed_at ||
        data.attendance_recorded_at ||
        data.cancelled_at ||
        data.completed_at) && (
        <div
          className={cn(
            "mt-4 grid gap-2 rounded-lg border border-border bg-muted/20 p-3 text-xs text-text-muted sm:grid-cols-2",
            isRtl && "text-end",
          )}
        >
          {data.confirmed_at && (
            <span>
              {t("details.confirmedAt")}: {new Date(data.confirmed_at).toLocaleString()}
            </span>
          )}
          {data.attendance_recorded_at && (
            <span>
              {t("details.attendanceAt")}: {new Date(data.attendance_recorded_at).toLocaleString()}
            </span>
          )}
          {data.cancelled_at && (
            <span>
              {t("details.cancelledAt")}: {new Date(data.cancelled_at).toLocaleString()}
            </span>
          )}
          {data.completed_at && (
            <span>
              {t("details.completedAt")}: {new Date(data.completed_at).toLocaleString()}
            </span>
          )}
        </div>
      )}
      {(data.candidate_message ||
        data.attendance_note ||
        data.completion_note ||
        data.cancellation_reason) && (
        <div className="mt-4 space-y-3 border-t border-border pt-4">
          {data.candidate_message && (
            <TextBlock
              isRtl={isRtl}
              label={t("details.candidateMessage")}
              value={data.candidate_message}
            />
          )}
          {data.attendance_note && (
            <TextBlock
              isRtl={isRtl}
              label={t("details.attendanceNote")}
              value={data.attendance_note}
            />
          )}
          {data.completion_note && (
            <TextBlock
              isRtl={isRtl}
              label={t("details.completionNote")}
              value={data.completion_note}
            />
          )}
          {data.cancellation_reason && (
            <TextBlock
              isRtl={isRtl}
              label={t("details.cancellationReason")}
              value={data.cancellation_reason}
            />
          )}
        </div>
      )}
    </section>
  )
}

function PrivateNotesCard({
  savedNote,
  canEdit,
  isSaving,
  onSave,
}: {
  savedNote?: string | null
  canEdit: boolean
  isSaving: boolean
  onSave: (value: string) => Promise<unknown>
}) {
  const { t } = useTranslation("employerInterviews")
  const [draft, setDraft] = useState(savedNote ?? "")

  useEffect(() => {
    setDraft(savedNote ?? "")
  }, [savedNote])

  const dirty = draft !== (savedNote ?? "")

  return (
    <PanelCard
      icon={StickyNote}
      title={t("hrAssistance.privateNotes.title")}
      hint={t("hrAssistance.privateNotes.hint")}
    >
      <Textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={t("hrAssistance.privateNotes.placeholder")}
        rows={6}
        disabled={isSaving || !canEdit}
        className="resize-none"
      />
      <div className="flex justify-end">
        <Button
          size="sm"
          disabled={!dirty || isSaving || !canEdit}
          onClick={() => {
            void onSave(draft).catch((error) => showErrorToast(error))
          }}
        >
          {isSaving ? t("hrAssistance.privateNotes.saving") : t("hrAssistance.privateNotes.save")}
        </Button>
      </div>
    </PanelCard>
  )
}

function PreparedQuestionsCard({ isRtl }: { isRtl: boolean }) {
  const { t } = useTranslation("employerInterviews")
  const [questions, setQuestions] = useState<string[]>([])
  const [draft, setDraft] = useState("")

  const addQuestion = () => {
    const value = draft.trim()
    if (!value) return
    setQuestions((current) => [...current, value])
    setDraft("")
  }

  const removeQuestion = (index: number) => {
    setQuestions((current) => current.filter((_, i) => i !== index))
  }

  return (
    <PanelCard icon={HelpCircle} title={t("hrAssistance.preparedQuestions.title")}>
      <div className={cn("flex gap-2", isRtl && "flex-row-reverse")}>
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              addQuestion()
            }
          }}
          placeholder={t("hrAssistance.preparedQuestions.placeholder")}
        />
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="shrink-0"
          onClick={addQuestion}
          aria-label={t("hrAssistance.preparedQuestions.add")}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {questions.length === 0 ? (
        <EmptyState
          title={t("hrAssistance.preparedQuestions.empty")}
          description={t("hrAssistance.preparedQuestions.empty")}
          icon={HelpCircle}
          className="rounded-lg border border-dashed border-border/60 bg-background-secondary/40 py-8"
        />
      ) : (
        <ul className="space-y-2">
          {questions.map((question, index) => (
            <li
              key={`${question}-${index}`}
              className={cn(
                "flex items-start justify-between gap-2 rounded-md border border-border p-2",
                isRtl && "flex-row-reverse text-end",
              )}
            >
              <span className="text-sm text-text-primary">{question}</span>
              <button
                type="button"
                onClick={() => removeQuestion(index)}
                className="mt-0.5 shrink-0 text-text-muted transition-colors hover:text-destructive"
                aria-label={t("common:remove")}
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </PanelCard>
  )
}

function CandidateContextCard({
  isRtl,
  data: _data,
  profile,
  applicationId,
}: {
  isRtl: boolean
  data: EmployerInterview
  profile?: ApplicationSnapshotProfile
  applicationId?: string | number
}) {
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

function EvaluationCard({
  isRtl,
  evaluation,
  canEvaluate,
  isSubmitting,
  onSubmit,
}: {
  isRtl: boolean
  evaluation?: EmployerInterviewEvaluation | null
  canEvaluate: boolean
  isSubmitting: boolean
  onSubmit: (input: EmployerInterviewEvaluateInput) => Promise<unknown>
}) {
  const { t } = useTranslation("employerInterviews")

  return (
    <PanelCard icon={ClipboardCheck} title={t("hrAssistance.evaluation.title")}>
      {evaluation ? (
        <div className="space-y-3">
          {evaluation.recommendation && (
            <TextBlock
              isRtl={isRtl}
              label={t("details.recommendation")}
              value={interviewValue(evaluation.recommendation)}
            />
          )}
          {evaluation.overall_comment && (
            <TextBlock
              isRtl={isRtl}
              label={t("details.overallComment")}
              value={evaluation.overall_comment}
            />
          )}
          {evaluation.items && evaluation.items.length > 0 ? (
            <ContextBlock isRtl={isRtl} label={t("details.evaluationItems")}>
              {evaluation.items.map((item, index) => (
                <div key={item.id ?? index} className="rounded-md border border-border p-2">
                  <div
                    className={cn(
                      "flex items-center justify-between",
                      isRtl && "flex-row-reverse text-end",
                    )}
                  >
                    <span className="text-sm font-medium text-text-primary">{item.criterion}</span>
                    <span className="text-sm font-semibold text-primary">{item.score}/5</span>
                  </div>
                  {item.comment && <p className="mt-1 text-xs text-text-muted">{item.comment}</p>}
                </div>
              ))}
            </ContextBlock>
          ) : null}
        </div>
      ) : canEvaluate ? (
        <InterviewEvaluationForm isPending={isSubmitting} onSubmit={onSubmit} />
      ) : (
        <p className="text-sm text-text-muted">{t("hrAssistance.evaluation.notAvailable")}</p>
      )}
    </PanelCard>
  )
}

function PanelCard({
  icon: Icon,
  title,
  hint,
  children,
}: {
  icon: ElementType
  title: string
  hint?: string
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-border bg-background-card p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </span>
          {title}
        </h3>
        {hint && <span className="text-xs text-text-muted">{hint}</span>}
      </div>
      {children}
    </section>
  )
}

function ContextBlock({
  isRtl,
  label,
  children,
}: {
  isRtl: boolean
  label: string
  children: ReactNode
}) {
  return (
    <div className={cn(isRtl && "text-end")}>
      <p className="mb-1 text-xs font-medium text-text-muted">{label}</p>
      <div className="space-y-1">{children}</div>
    </div>
  )
}

function TextBlock({
  isRtl,
  label,
  value,
}: {
  isRtl: boolean
  label: string
  value?: string | null
}) {
  return (
    <div className={cn(isRtl && "text-end")}>
      <p className="text-xs font-medium text-text-muted">{label}</p>
      <p className="mt-1 whitespace-pre-line text-sm text-text-primary">{value || "-"}</p>
    </div>
  )
}

function InterviewHistoryFromResponse({
  isRtl,
  statusHistory,
  scheduleHistory,
}: {
  isRtl: boolean
  statusHistory: EmployerInterviewHistoryItem[]
  scheduleHistory: EmployerInterviewScheduleHistoryItem[]
}) {
  const { t } = useTranslation("employerInterviews")

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {statusHistory.length > 0 && (
        <section className="space-y-3 rounded-lg border border-border bg-background-card p-5 shadow-card">
          <h3
            className={cn(
              "flex items-center gap-2 text-sm font-semibold text-text-primary",
              isRtl && "flex-row-reverse text-end",
            )}
          >
            <History className="h-4 w-4 text-primary" />
            {t("history.statusTitle")}
          </h3>
          {statusHistory.map((item) => (
            <div key={item.id} className="rounded-lg border border-border p-3">
              <div
                className={cn(
                  "flex flex-wrap items-center justify-between gap-2",
                  isRtl && "flex-row-reverse text-end",
                )}
              >
                <p className="text-sm font-medium text-text-primary">
                  {interviewValue(item.from_status)} {"->"} {interviewValue(item.to_status)}
                </p>
                {item.created_at && (
                  <p className="text-xs text-text-muted">{formatDateTime(item.created_at)}</p>
                )}
              </div>
              {item.reason && (
                <p className={cn("mt-2 text-sm text-text-muted", isRtl && "text-end")}>
                  {item.reason}
                </p>
              )}
              {item.changed_by?.name && (
                <p className={cn("mt-1 text-xs text-text-muted", isRtl && "text-end")}>
                  {t("history.actor", { actor: item.changed_by.name })}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {scheduleHistory.length > 0 && (
        <section className="space-y-3 rounded-lg border border-border bg-background-card p-5 shadow-card">
          <h3
            className={cn(
              "flex items-center gap-2 text-sm font-semibold text-text-primary",
              isRtl && "flex-row-reverse text-end",
            )}
          >
            <CalendarSync className="h-4 w-4 text-primary" />
            {t("history.scheduleTitle")}
          </h3>
          {scheduleHistory.map((item) => (
            <div key={item.id} className="rounded-lg border border-border p-3">
              <div
                className={cn(
                  "flex flex-wrap items-center justify-between gap-2",
                  isRtl && "flex-row-reverse text-end",
                )}
              >
                <p className="text-sm font-medium text-text-primary">
                  {formatDateTime(item.previous_start_at)} {"->"}{" "}
                  {formatDateTime(item.new_start_at)}
                </p>
                {item.created_at && (
                  <p className="text-xs text-text-muted">{formatDateTime(item.created_at)}</p>
                )}
              </div>
              <p className={cn("mt-1 text-xs text-text-muted", isRtl && "text-end")}>
                {interviewValue(item.previous_mode)} {"->"} {interviewValue(item.new_mode)}
              </p>
              {(item.previous_meeting_link ||
                item.previous_location_text ||
                item.new_meeting_link ||
                item.new_location_text) && (
                <p className={cn("mt-1 text-xs text-text-muted", isRtl && "text-end")}>
                  {item.previous_meeting_link || item.previous_location_text || "-"} {"->"}{" "}
                  {item.new_meeting_link || item.new_location_text || "-"}
                </p>
              )}
              {item.reason && (
                <p className={cn("mt-2 text-sm text-text-muted", isRtl && "text-end")}>
                  {item.reason}
                </p>
              )}
              {item.changed_by?.name && (
                <p className={cn("mt-1 text-xs text-text-muted", isRtl && "text-end")}>
                  {t("history.actor", { actor: item.changed_by.name })}
                </p>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  )
}

function DetailItem({
  icon: Icon,
  isRtl,
  label,
  value,
  className,
}: {
  icon: ElementType
  isRtl: boolean
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={className}>
      <p
        className={cn(
          "mb-1 flex items-center gap-1.5 text-xs font-medium text-text-muted",
          isRtl && "flex-row-reverse text-end",
        )}
      >
        <Icon className="h-3.5 w-3.5 text-primary" />
        {label}
      </p>
      <p
        className={cn("truncate text-sm font-medium text-text-primary", isRtl && "text-end")}
        title={value || undefined}
      >
        {value || "-"}
      </p>
    </div>
  )
}

function formatDateTime(value?: string | null) {
  if (!value) return "-"
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString()
}
