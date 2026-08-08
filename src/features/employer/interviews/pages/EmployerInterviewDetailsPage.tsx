import { useState } from "react"
import {
  ArrowLeft,
  Calendar,
  CalendarSync,
  CheckCircle,
  ClipboardCheck,
  Clock,
  ListChecks,
  MapPin,
  Ban,
  UserX,
  UserRound,
  Video,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ROUTES } from "@/config"
import CompleteInterviewDialog from "../components/CompleteInterviewDialog"
import AttendanceInterviewDialog from "../components/AttendanceInterviewDialog"
import CancelInterviewDialog from "../components/CancelInterviewDialog"
import EvaluateInterviewDialog from "../components/EvaluateInterviewDialog"
import InterviewHistoryPanel from "../components/InterviewHistoryPanel"
import NoShowInterviewDialog from "../components/NoShowInterviewDialog"
import RescheduleInterviewDialog from "../components/RescheduleInterviewDialog"
import { useEmployerInterview } from "../hooks/useEmployerInterview"
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
  const { t } = useTranslation("employerInterviews")
  const { id } = useParams()
  const navigate = useNavigate()
  const interview = useEmployerInterview(id)
  const [rescheduleOpen, setRescheduleOpen] = useState(false)
  const [completeOpen, setCompleteOpen] = useState(false)
  const [evaluateOpen, setEvaluateOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [attendanceOpen, setAttendanceOpen] = useState(false)
  const [noShowOpen, setNoShowOpen] = useState(false)

  if (interview.isPending) {
    return <Skeleton className="h-96 w-full rounded-lg" />
  }

  if (interview.isError || !interview.data) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate(ROUTES.employer.interviews)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("back")}
        </Button>
        <div className="text-center text-text-muted">{t("errors.notFound")}</div>
      </div>
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
  const durationMinutes =
    startAt && endAt
      ? Math.round((new Date(endAt).getTime() - new Date(startAt).getTime()) / 60_000)
      : data.duration_minutes
  const evaluation = data.evaluation

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(ROUTES.employer.interviews)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("back")}
        </Button>
        <div className="flex items-center gap-2">
          {(canReschedule || canCancel || canRecordAttendance || canMarkNoShow || canComplete) && (
            <>
              {canReschedule && <Button variant="outline" size="sm" onClick={() => setRescheduleOpen(true)}>
                <CalendarSync className="mr-2 h-4 w-4" /> {t("actions.reschedule")}
              </Button>}
              {canRecordAttendance && <Button variant="outline" size="sm" onClick={() => setAttendanceOpen(true)}>
                <ListChecks className="mr-2 h-4 w-4" /> {t("actions.attendance")}
              </Button>}
              {canComplete && <Button variant="outline" size="sm" onClick={() => setCompleteOpen(true)}>
                <CheckCircle className="mr-2 h-4 w-4" /> {t("actions.complete")}
              </Button>}
              {canMarkNoShow && <Button variant="outline" size="sm" onClick={() => setNoShowOpen(true)}>
                <UserX className="mr-2 h-4 w-4" /> {t("actions.noShow")}
              </Button>}
              {canCancel && <Button variant="destructive" size="sm" onClick={() => setCancelOpen(true)}>
                <Ban className="mr-2 h-4 w-4" /> {t("actions.cancel")}
              </Button>}
            </>
          )}
          {canEvaluate && (
            <Button variant="outline" size="sm" onClick={() => setEvaluateOpen(true)}>
              <ClipboardCheck className="mr-2 h-4 w-4" /> {t("actions.evaluate")}
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserRound className="h-5 w-5 text-primary" />
            {interviewCandidateName(data, t("unknownCandidate"))}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-text-muted" />
            <span className="text-sm">
              {startAt
                ? new Date(startAt).toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })
                : "-"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-text-muted" />
            <span className="text-sm capitalize">{interviewValue(interviewType)} - {durationMinutes ?? "-"}m</span>
          </div>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Video className="h-4 w-4 text-text-muted" />
            ) : (
              <MapPin className="h-4 w-4 text-text-muted" />
            )}
            <span className="text-sm capitalize">
              {isOnline
                ? data.meeting_link || t("interviewModes.video")
                : data.location_text || data.location || interviewValue(interviewMode)}
            </span>
          </div>
          {interviewJobTitle(data) && (
            <div className="flex items-center gap-2">
              <span className="text-sm">{interviewJobTitle(data)}</span>
            </div>
          )}
          <div>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              statusKey === "completed"
                ? "bg-green-100 text-green-700"
                : statusKey === "cancelled"
                  ? "bg-red-100 text-red-700"
                  : statusKey === "scheduled"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
            }`}>
              {interviewValue(data.status)}
            </span>
          </div>
          {(data.internal_note || data.candidate_message || data.notes) && (
            <div className="sm:col-span-2">
              <p className="text-xs font-medium text-text-muted">{t("details.notes")}</p>
              <p className="text-sm">{data.internal_note || data.candidate_message || data.notes}</p>
            </div>
          )}
          {data.completion_note && (
            <div className="sm:col-span-2">
              <p className="text-xs font-medium text-text-muted">{t("details.completionNote")}</p>
              <p className="text-sm">{data.completion_note}</p>
            </div>
          )}
          {(data.confirmed_at || data.attendance_recorded_at || data.cancelled_at || data.completed_at) && (
            <div className="sm:col-span-2 grid gap-2 rounded-md border border-border p-3 text-xs text-text-muted sm:grid-cols-2">
              {data.confirmed_at && <span>{t("details.confirmedAt")}: {new Date(data.confirmed_at).toLocaleString()}</span>}
              {data.attendance_recorded_at && <span>{t("details.attendanceAt")}: {new Date(data.attendance_recorded_at).toLocaleString()}</span>}
              {data.cancelled_at && <span>{t("details.cancelledAt")}: {new Date(data.cancelled_at).toLocaleString()}</span>}
              {data.completed_at && <span>{t("details.completedAt")}: {new Date(data.completed_at).toLocaleString()}</span>}
            </div>
          )}
          {evaluation?.recommendation && (
            <div className="sm:col-span-2">
              <p className="text-xs font-medium text-text-muted">{t("details.recommendation")}</p>
              <p className="text-sm capitalize">{interviewValue(evaluation.recommendation)}</p>
            </div>
          )}
          {evaluation?.overall_comment && (
            <div className="sm:col-span-2">
              <p className="text-xs font-medium text-text-muted">{t("details.overallComment")}</p>
              <p className="text-sm">{evaluation.overall_comment}</p>
            </div>
          )}
          {evaluation?.items && evaluation.items.length > 0 && (
            <div className="sm:col-span-2 space-y-2">
              <p className="text-xs font-medium text-text-muted">{t("details.evaluationItems")}</p>
              {evaluation.items.map((item, i) => (
                <div key={i} className="rounded-md border border-border p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.criterion}</span>
                    <span className="text-sm font-medium text-primary">{item.score}/5</span>
                  </div>
                  {item.comment && <p className="mt-1 text-xs text-text-muted">{item.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <InterviewHistoryPanel interviewId={data.id} />

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
    </div>
  )
}
