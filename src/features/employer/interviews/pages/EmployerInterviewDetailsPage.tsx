import { useState } from "react"
import type { ElementType } from "react"
import {
  Calendar,
  CalendarSync,
  CheckCircle,
  ClipboardCheck,
  Clock,
  FileText,
  History,
  ListChecks,
  MapPin,
  Ban,
  MoreHorizontal,
  UserX,
  UserRound,
  Video,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import PageHeader from "@/components/shared/headers/PageHeader"
import ErrorState from "@/components/shared/states/ErrorState"
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
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ROUTES } from "@/config"
import { cn } from "@/lib/utils"
import CompleteInterviewDialog from "../components/CompleteInterviewDialog"
import AttendanceInterviewDialog from "../components/AttendanceInterviewDialog"
import CancelInterviewDialog from "../components/CancelInterviewDialog"
import EvaluateInterviewDialog from "../components/EvaluateInterviewDialog"
import NoShowInterviewDialog from "../components/NoShowInterviewDialog"
import RescheduleInterviewDialog from "../components/RescheduleInterviewDialog"
import VideoSessionSetup from "../components/VideoSessionSetup"
import { useEmployerInterview } from "../hooks/useEmployerInterview"
import type {
  EmployerInterviewHistoryItem,
  EmployerInterviewScheduleHistoryItem,
} from "../types/employerInterviews.types"
import {
  actionAllowed,
  bothPartiesPresent,
  hasStarted,
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
  const [evaluateOpen, setEvaluateOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [attendanceOpen, setAttendanceOpen] = useState(false)
  const [noShowOpen, setNoShowOpen] = useState(false)
  const [videoOpen, setVideoOpen] = useState(false)

  if (interview.isPending) {
    return <InterviewDetailsSkeleton />
  }

  if (interview.isError || !interview.data) {
    return (
      <ErrorState
        title={t("errors.title")}
        description={t("errors.notFound")}
        retry={() => void interview.refetch()}
      />
    )
  }

  const data = interview.data
  const statusKey = interviewKey(data.status)
  const isCompleted = statusKey === "completed"
  const startAt = scheduledStart(data)
  const endAt = scheduledEnd(data)
  const interviewType = data.type ?? data.interview_type
  const interviewMode = data.mode ?? data.interview_mode
  const modeKey = interviewKey(interviewMode)
  const isOnline = modeKey === "online"
  const active = isActiveInterview(data)
  const started = hasStarted(data)
  const canReschedule = actionAllowed(data, "reschedule", active)
  const canCancel = actionAllowed(data, "cancel", active)
  const canRecordAttendance = actionAllowed(data, "attendance", active && started)
  const canMarkNoShow = actionAllowed(data, "no_show", active && started)
  const canComplete = actionAllowed(data, "complete", statusKey === "confirmed" && started && bothPartiesPresent(data))
  const canEvaluate = actionAllowed(data, "evaluate", isCompleted && !data.evaluation)
  const canJoinVideo = isOnline && active && actionAllowed(data, "join_video", true)
  const durationMinutes =
    startAt && endAt
      ? Math.round((new Date(endAt).getTime() - new Date(startAt).getTime()) / 60_000)
      : data.duration_minutes
  const evaluation = data.evaluation
  const note = data.internal_note || data.note || data.notes
  const hasNotes = Boolean(note || data.candidate_message || data.attendance_note || data.completion_note || data.cancellation_reason)
  const hasEvaluation = Boolean(evaluation)
  const hasHistory = Boolean(data.status_history?.length || data.schedule_history?.length)

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
            canEvaluate={canEvaluate}
            canMarkNoShow={canMarkNoShow}
            canCancel={canCancel}
            onReschedule={() => setRescheduleOpen(true)}
            onRecordAttendance={() => setAttendanceOpen(true)}
            onComplete={() => setCompleteOpen(true)}
            onEvaluate={() => setEvaluateOpen(true)}
            onMarkNoShow={() => setNoShowOpen(true)}
            onCancel={() => setCancelOpen(true)}
          />
        }
      />

      <section className="rounded-lg border border-border bg-background-card p-4 shadow-card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className={cn("flex min-w-0 items-start gap-3", isRtl && "flex-row-reverse text-right")}>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserRound className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-lg font-semibold text-text-primary">
                  {interviewCandidateName(data, t("unknownCandidate"))}
                </h2>
                <StatusBadge
                  status={statusKey}
                  label={interviewValue(data.status)}
                  variant="soft"
                />
              </div>
              <p className="mt-1 text-sm text-text-muted">
                {interviewJobTitle(data) || interviewValue(interviewType)}
              </p>
            </div>
          </div>
          {canJoinVideo && (
            <Button onClick={() => setVideoOpen(true)} className="shrink-0">
              <Video className="h-4 w-4" />
              {t("video.join")}
            </Button>
          )}
        </div>
      </section>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList
          className={cn("flex h-auto flex-wrap", isRtl ? "justify-end" : "justify-start")}
        >
          <TabsTrigger value="overview" className="gap-2">
            <Calendar className="h-4 w-4" />
            {t("tabs.overview")}
          </TabsTrigger>
          {hasNotes && (
            <TabsTrigger value="notes" className="gap-2">
              <FileText className="h-4 w-4" />
              {t("tabs.notes")}
            </TabsTrigger>
          )}
          {hasEvaluation && (
            <TabsTrigger value="evaluation" className="gap-2">
              <ClipboardCheck className="h-4 w-4" />
              {t("tabs.evaluation")}
            </TabsTrigger>
          )}
          {hasHistory && (
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              {t("tabs.history")}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview">
          <section className="grid gap-4 rounded-lg border border-border bg-background-card p-5 shadow-card sm:grid-cols-2">
            <DetailItem
              isRtl={isRtl}
              icon={Calendar}
              label={t("columns.scheduled")}
              value={
                startAt
                  ? new Date(startAt).toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })
                  : "-"
              }
            />
            <DetailItem
              isRtl={isRtl}
              icon={Clock}
              label={t("columns.type")}
              value={`${interviewValue(interviewType)} - ${durationMinutes ?? "-"}m`}
            />
            <DetailItem
              isRtl={isRtl}
              icon={isOnline ? Video : MapPin}
              label={t("schedule.mode")}
              value={
                isOnline
                  ? data.meeting_link || t("interviewModes.video")
                  : data.location_text || data.location || interviewValue(interviewMode)
              }
              className="sm:col-span-2"
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
            {(data.confirmed_at || data.attendance_recorded_at || data.cancelled_at || data.completed_at) && (
              <div className={cn(
                "grid gap-2 rounded-lg border border-border bg-muted/20 p-3 text-xs text-text-muted sm:col-span-2 sm:grid-cols-2",
                isRtl && "text-right",
              )}>
                {data.confirmed_at && <span>{t("details.confirmedAt")}: {new Date(data.confirmed_at).toLocaleString()}</span>}
                {data.attendance_recorded_at && <span>{t("details.attendanceAt")}: {new Date(data.attendance_recorded_at).toLocaleString()}</span>}
                {data.cancelled_at && <span>{t("details.cancelledAt")}: {new Date(data.cancelled_at).toLocaleString()}</span>}
                {data.completed_at && <span>{t("details.completedAt")}: {new Date(data.completed_at).toLocaleString()}</span>}
              </div>
            )}
          </section>
        </TabsContent>

        {hasNotes && (
          <TabsContent value="notes">
            <section className="space-y-4 rounded-lg border border-border bg-background-card p-5 shadow-card">
              {note && <TextBlock isRtl={isRtl} label={t("details.notes")} value={note} />}
              {data.candidate_message && <TextBlock isRtl={isRtl} label={t("details.candidateMessage")} value={data.candidate_message} />}
              {data.attendance_note && <TextBlock isRtl={isRtl} label={t("details.attendanceNote")} value={data.attendance_note} />}
              {data.completion_note && <TextBlock isRtl={isRtl} label={t("details.completionNote")} value={data.completion_note} />}
              {data.cancellation_reason && <TextBlock isRtl={isRtl} label={t("details.cancellationReason")} value={data.cancellation_reason} />}
            </section>
          </TabsContent>
        )}

        {hasEvaluation && (
          <TabsContent value="evaluation">
            <section className="space-y-4 rounded-lg border border-border bg-background-card p-5 shadow-card">
              {evaluation?.recommendation && (
                <TextBlock
                  isRtl={isRtl}
                  label={t("details.recommendation")}
                  value={interviewValue(evaluation.recommendation)}
                />
              )}
              {evaluation?.overall_comment && (
                <TextBlock isRtl={isRtl} label={t("details.overallComment")} value={evaluation.overall_comment} />
              )}
              {evaluation?.items && evaluation.items.length > 0 ? (
                <div className="space-y-2">
                  <p className={cn("text-xs font-medium text-text-muted", isRtl && "text-right")}>{t("details.evaluationItems")}</p>
                  {evaluation.items.map((item, i) => (
                    <div key={i} className="rounded-lg border border-border p-3">
                      <div className={cn("flex items-center justify-between", isRtl && "flex-row-reverse text-right")}>
                        <span className="text-sm font-medium text-text-primary">{item.criterion}</span>
                        <span className="text-sm font-semibold text-primary">{item.score}/5</span>
                      </div>
                      {item.comment && <p className={cn("mt-1 text-xs text-text-muted", isRtl && "text-right")}>{item.comment}</p>}
                    </div>
                  ))}
                </div>
              ) : null}
            </section>
          </TabsContent>
        )}

        {hasHistory && (
          <TabsContent value="history">
            <InterviewHistoryFromResponse
              isRtl={isRtl}
              statusHistory={data.status_history ?? []}
              scheduleHistory={data.schedule_history ?? []}
            />
          </TabsContent>
        )}
      </Tabs>

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
        onSubmit={(id, input) => interview.rescheduleMutation.mutateAsync(input)}
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
      <EvaluateInterviewDialog
        open={evaluateOpen}
        isPending={interview.evaluateMutation.isPending}
        onOpenChange={setEvaluateOpen}
        onSubmit={(input) => interview.evaluateMutation.mutateAsync(input)}
      />
      <VideoSessionSetup
        interviewId={data.id}
        open={videoOpen}
        onOpenChange={setVideoOpen}
      />
    </div>
  )
}

function InterviewActionsMenu({
  isRtl,
  canReschedule,
  canRecordAttendance,
  canComplete,
  canEvaluate,
  canMarkNoShow,
  canCancel,
  onReschedule,
  onRecordAttendance,
  onComplete,
  onEvaluate,
  onMarkNoShow,
  onCancel,
}: {
  isRtl: boolean
  canReschedule: boolean
  canRecordAttendance: boolean
  canComplete: boolean
  canEvaluate: boolean
  canMarkNoShow: boolean
  canCancel: boolean
  onReschedule: () => void
  onRecordAttendance: () => void
  onComplete: () => void
  onEvaluate: () => void
  onMarkNoShow: () => void
  onCancel: () => void
}) {
  const { t } = useTranslation("employerInterviews")
  const hasActions =
    canReschedule ||
    canRecordAttendance ||
    canComplete ||
    canEvaluate ||
    canMarkNoShow ||
    canCancel

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
          <DropdownMenuItem className={cn(isRtl && "flex-row-reverse text-right")} onSelect={onReschedule}>
            <CalendarSync /> {t("actions.reschedule")}
          </DropdownMenuItem>
        )}
        {canRecordAttendance && (
          <DropdownMenuItem className={cn(isRtl && "flex-row-reverse text-right")} onSelect={onRecordAttendance}>
            <ListChecks /> {t("actions.attendance")}
          </DropdownMenuItem>
        )}
        {canComplete && (
          <DropdownMenuItem className={cn(isRtl && "flex-row-reverse text-right")} onSelect={onComplete}>
            <CheckCircle /> {t("actions.complete")}
          </DropdownMenuItem>
        )}
        {canEvaluate && (
          <DropdownMenuItem className={cn(isRtl && "flex-row-reverse text-right")} onSelect={onEvaluate}>
            <ClipboardCheck /> {t("actions.evaluate")}
          </DropdownMenuItem>
        )}
        {canMarkNoShow && (
          <DropdownMenuItem className={cn(isRtl && "flex-row-reverse text-right")} onSelect={onMarkNoShow}>
            <UserX /> {t("actions.noShow")}
          </DropdownMenuItem>
        )}
        {canCancel && (
          <DropdownMenuItem
            className={cn("text-red-600 focus:text-red-700", isRtl && "flex-row-reverse text-right")}
            onSelect={onCancel}
          >
            <Ban /> {t("actions.cancel")}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function InterviewDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-64 w-full rounded-xl" />
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
          <h3 className={cn("flex items-center gap-2 text-sm font-semibold text-text-primary", isRtl && "flex-row-reverse text-right")}>
            <History className="h-4 w-4 text-primary" />
            {t("history.statusTitle")}
          </h3>
          {statusHistory.map((item) => (
            <div key={item.id} className="rounded-lg border border-border p-3">
              <div className={cn("flex flex-wrap items-center justify-between gap-2", isRtl && "flex-row-reverse text-right")}>
                <p className="text-sm font-medium text-text-primary">
                  {interviewValue(item.from_status)} {"->"} {interviewValue(item.to_status)}
                </p>
                {item.created_at && (
                  <p className="text-xs text-text-muted">{formatDateTime(item.created_at)}</p>
                )}
              </div>
              {item.reason && <p className={cn("mt-2 text-sm text-text-muted", isRtl && "text-right")}>{item.reason}</p>}
              {item.changed_by?.name && (
                <p className={cn("mt-1 text-xs text-text-muted", isRtl && "text-right")}>
                  {t("history.actor", { actor: item.changed_by.name })}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {scheduleHistory.length > 0 && (
        <section className="space-y-3 rounded-lg border border-border bg-background-card p-5 shadow-card">
          <h3 className={cn("flex items-center gap-2 text-sm font-semibold text-text-primary", isRtl && "flex-row-reverse text-right")}>
            <CalendarSync className="h-4 w-4 text-primary" />
            {t("history.scheduleTitle")}
          </h3>
          {scheduleHistory.map((item) => (
            <div key={item.id} className="rounded-lg border border-border p-3">
              <div className={cn("flex flex-wrap items-center justify-between gap-2", isRtl && "flex-row-reverse text-right")}>
                <p className="text-sm font-medium text-text-primary">
                  {formatDateTime(item.previous_start_at)} {"->"} {formatDateTime(item.new_start_at)}
                </p>
                {item.created_at && (
                  <p className="text-xs text-text-muted">{formatDateTime(item.created_at)}</p>
                )}
              </div>
              <p className={cn("mt-1 text-xs text-text-muted", isRtl && "text-right")}>
                {interviewValue(item.previous_mode)} {"->"} {interviewValue(item.new_mode)}
              </p>
              {(item.previous_meeting_link || item.previous_location_text || item.new_meeting_link || item.new_location_text) && (
                <p className={cn("mt-1 text-xs text-text-muted", isRtl && "text-right")}>
                  {item.previous_meeting_link || item.previous_location_text || "-"} {"->"}{" "}
                  {item.new_meeting_link || item.new_location_text || "-"}
                </p>
              )}
              {item.reason && <p className={cn("mt-2 text-sm text-text-muted", isRtl && "text-right")}>{item.reason}</p>}
              {item.changed_by?.name && (
                <p className={cn("mt-1 text-xs text-text-muted", isRtl && "text-right")}>
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
      <p className={cn("mb-1 flex items-center gap-1.5 text-xs font-medium text-text-muted", isRtl && "flex-row-reverse text-right")}>
        <Icon className="h-3.5 w-3.5 text-primary" />
        {label}
      </p>
      <p className={cn("text-sm font-medium text-text-primary", isRtl && "text-right")}>{value || "-"}</p>
    </div>
  )
}

function TextBlock({ isRtl, label, value }: { isRtl: boolean; label: string; value?: string | null }) {
  return (
    <div className={cn(isRtl && "text-right")}>
      <p className="text-xs font-medium text-text-muted">{label}</p>
      <p className="mt-1 text-sm text-text-primary">{value || "-"}</p>
    </div>
  )
}

function formatDateTime(value?: string | null) {
  if (!value) return "-"
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString()
}
