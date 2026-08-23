import { useEffect, useState } from "react"
import {
  Calendar,
  Video,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import PageHeader from "@/components/shared/headers/PageHeader"
import ErrorState from "@/components/shared/states/ErrorState"
import EmployerFeatureError from "@/features/employer/shared/components/EmployerFeatureError"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ROUTES } from "@/config"
import { cn } from "@/lib/utils"
import AttendanceInterviewDialog from "../components/AttendanceInterviewDialog"
import CancelInterviewDialog from "../components/CancelInterviewDialog"
import CandidateContextCard from "../components/CandidateContextCard"
import CompleteInterviewDialog from "../components/CompleteInterviewDialog"
import EvaluationCard from "../components/EvaluationCard"
import InterviewActionsMenu from "../components/InterviewActionsMenu"
import InterviewHistoryFromResponse from "../components/InterviewHistoryFromResponse"
import InterviewInfoSection from "../components/InterviewInfoSection"
import NoShowInterviewDialog from "../components/NoShowInterviewDialog"
import PreparedQuestionsCard from "../components/PreparedQuestionsCard"
import PrivateNotesCard from "../components/PrivateNotesCard"
import RescheduleInterviewDialog from "../components/RescheduleInterviewDialog"
import VideoInterviewSection from "../components/VideoInterviewSection"
import { useEmployerInterview } from "../hooks/useEmployerInterview"
import {
  actionAllowed,
  interviewCandidateName,
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
  const data = interview.data

  useEffect(() => {
    if (import.meta.env.PROD || !data) return

    const statusKey = interviewKey(data.status)
    const interviewType = data.type ?? data.interview_type
    const interviewMode = data.mode ?? data.interview_mode
    const modeKey = interviewKey(interviewMode)
    const isOnline = modeKey === "online"
    const active = isActiveInterview(data)
    const canJoinVideo = isOnline && active && data.embedded_video_available === true
    const startAt = scheduledStart(data)
    const endAt = scheduledEnd(data)
    const durationMinutes =
      startAt && endAt
        ? Math.round((new Date(endAt).getTime() - new Date(startAt).getTime()) / 60_000)
        : data.duration_minutes

    console.debug("[EmployerInterviewDetailsPage] interview info", {
      id: data.id,
      status: statusKey,
      type: interviewValue(interviewType),
      mode: interviewValue(interviewMode),
      scheduledStart: startAt,
      scheduledEnd: endAt,
      durationMinutes,
      canJoinVideo,
      embeddedVideoAvailable: data.embedded_video_available,
      videoProvider: data.video_provider,
      meetingLink: data.meeting_link,
    })
  }, [data])

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

  if (!data) {
    return <ErrorState title={t("errors.title")} description={t("errors.notFound")} />
  }

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
  const canJoinVideo = isOnline && active && data.embedded_video_available === true
  const canStartMeeting = isOnline && active && Boolean(data.meeting_link)
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
          <div className={cn("flex items-center gap-2", isRtl && "flex-row-reverse")}>
            {canStartMeeting && data.meeting_link ? (
              <Button asChild size="sm">
                <a href={data.meeting_link} target="_blank" rel="noreferrer">
                  <Video className="h-4 w-4" />
                  {t("video.start")}
                </a>
              </Button>
            ) : null}
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
          </div>
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

