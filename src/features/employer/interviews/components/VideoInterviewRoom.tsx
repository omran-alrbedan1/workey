import { useTranslation } from "react-i18next"
import EmptyState from "@/components/shared/states/EmptyState"
import {
  AlertTriangle,
  Camera,
  CameraOff,
  Loader2,
  Mic,
  MicOff,
  MonitorUp,
  PhoneOff,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useVideoRoom } from "../hooks/useVideoRoom"
import ParticipantTile from "./ParticipantTile"

export default function VideoInterviewRoom({
  url,
  token,
  onLeave,
}: {
  url: string
  token: string
  onLeave: () => void
}) {
  const { t } = useTranslation("employerInterviews")
  const {
    connectionState,
    participants,
    error,
    deviceWarning,
    unexpectedDisconnect,
    isMuted,
    isCameraOff,
    isScreenSharing,
    toggleMute,
    toggleCamera,
    toggleScreenShare,
    leave,
  } = useVideoRoom({ url, token })

  const handleLeave = () => {
    leave()
    onLeave()
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <p className="text-sm font-medium text-destructive">{error}</p>
        <p className="max-w-md text-xs text-text-muted">{t("video.errors.retryHint")}</p>
        <Button variant="outline" onClick={handleLeave}>
          {t("video.close")}
        </Button>
      </div>
    )
  }

  if (connectionState === "connecting") {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-background-card">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-text-muted">{t("video.connecting")}</p>
      </div>
    )
  }

  const showReconnecting = connectionState === "reconnecting"
  const showDisconnectedBanner = connectionState === "disconnected" && unexpectedDisconnect

  return (
    <div className="space-y-4">
      {(showReconnecting || showDisconnectedBanner || deviceWarning) && (
        <div className="space-y-2">
          {showReconnecting && (
            <div className="flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("video.reconnecting")}
            </div>
          )}
          {showDisconnectedBanner && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
              <p className="text-sm text-destructive">{t("video.errors.disconnected")}</p>
              <Button size="sm" variant="outline" onClick={handleLeave}>
                {t("video.startNewSession")}
              </Button>
            </div>
          )}
          {deviceWarning && (
            <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-text-muted">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {deviceWarning}
            </div>
          )}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {participants.map((participant) => (
          <ParticipantTile key={participant.identity} participant={participant} />
        ))}
        {participants.length === 0 ? (
          <EmptyState
            title={t("video.noParticipants")}
            description={t("video.noParticipants")}
            className="aspect-video rounded-xl border border-dashed border-border bg-background-card"
          />
        ) : null}
      </div>

      <div className="flex items-center justify-center gap-3 rounded-2xl border border-border bg-background-card p-4">
        <Button
          variant={isMuted ? "destructive" : "secondary"}
          size="icon"
          title={isMuted ? t("video.unmute") : t("video.mute")}
          onClick={() => void toggleMute()}
          className={
            isMuted
              ? "bg-black text-white hover:bg-black/90 hover:text-white"
              : "bg-black text-white hover:bg-black/90 hover:text-white"
          }
        >
          {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
        <Button
          variant={isCameraOff ? "destructive" : "secondary"}
          size="icon"
          title={isCameraOff ? t("video.cameraOn") : t("video.cameraOff")}
          onClick={() => void toggleCamera()}
          className={
            isCameraOff
              ? "bg-black text-white hover:bg-black/90 hover:text-white"
              : "bg-black text-white hover:bg-black/90 hover:text-white"
          }
        >
          {isCameraOff ? <CameraOff className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
        </Button>
        <Button
          variant={isScreenSharing ? "default" : "secondary"}
          size="icon"
          title={t("video.screenShare")}
          onClick={() => void toggleScreenShare()}
          className="bg-black text-white hover:bg-black/90 hover:text-white"
        >
          <MonitorUp className="h-5 w-5" />
        </Button>
        <Button
          variant="destructive"
          onClick={handleLeave}
          className="bg-black text-white hover:bg-black/90 hover:text-white"
        >
          <PhoneOff className="h-4 w-4" />
          {t("video.leave")}
        </Button>
      </div>
    </div>
  )
}
