import { Briefcase, Calendar, CheckCircle, ExternalLink, ListChecks, MapPin, UserRound, Video } from "lucide-react"
import { useTranslation } from "react-i18next"
import { StatusBadge } from "@/components/shared/badges"
import { type KeyValueField } from "@/lib/keyValue"
import { cn } from "@/lib/utils"
import {
  interviewCandidateName,
  interviewJobTitle,
  interviewValue,
} from "../utils/interviewDisplay"
import type { EmployerInterview } from "../types/employerInterviews.types"
import DetailItem from "./DetailItem"
import TextBlock from "./TextBlock"

interface InterviewInfoSectionProps {
  isRtl: boolean
  data: EmployerInterview
  statusKey: string
  interviewType?: KeyValueField
  interviewMode?: KeyValueField
  isOnline: boolean
  startAt?: string | null
  durationMinutes?: number
}

export default function InterviewInfoSection({
  isRtl,
  data,
  statusKey,
  interviewType,
  interviewMode,
  isOnline,
  startAt,
  durationMinutes,
}: InterviewInfoSectionProps) {
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
          icon={Calendar}
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
          value={interviewValue(interviewMode) || "-"}
        />
        {isOnline ? (
          <DetailItem
            isRtl={isRtl}
            icon={ExternalLink}
            label={t("schedule.meetingLink")}
            value={data.meeting_link || "-"}
          />
        ) : (
          <DetailItem
            isRtl={isRtl}
            icon={MapPin}
            label={t("schedule.location")}
            value={data.location_text || data.location || "-"}
          />
        )}
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
