import { useTranslation } from "react-i18next"
import {
  Camera,
  CameraOff,
  Loader2,
  Mic,
  MicOff,
  MonitorUp,
  PhoneOff,
  Radio,
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
    isMuted,
    isCameraOff,
    isScreenSharing,
    isRecording,
    toggleMute,
    toggleCamera,
    toggleScreenShare,
    startRecording,
    stopRecording,
    disconnect,
  } = useVideoRoom({ url, token })

  const handleLeave = () => {
    disconnect()
    onLeave()
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center">
        <p className="text-sm text-destructive">{error}</p>
        <Button variant="outline" onClick={onLeave}>
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

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {participants.map((participant) => (
          <ParticipantTile key={participant.identity} participant={participant} />
        ))}
        {participants.length === 0 ? (
          <div className="flex aspect-video items-center justify-center rounded-xl border border-border bg-black text-sm text-white/60">
            {t("video.noParticipants")}
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-center gap-3 rounded-2xl border border-border bg-background-card p-4">
        <Button
          variant={isMuted ? "destructive" : "secondary"}
          size="icon"
          title={isMuted ? t("video.unmute") : t("video.mute")}
          onClick={() => void toggleMute()}
        >
          {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
        <Button
          variant={isCameraOff ? "destructive" : "secondary"}
          size="icon"
          title={isCameraOff ? t("video.cameraOn") : t("video.cameraOff")}
          onClick={() => void toggleCamera()}
        >
          {isCameraOff ? <CameraOff className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
        </Button>
        <Button
          variant={isScreenSharing ? "default" : "secondary"}
          size="icon"
          title={t("video.screenShare")}
          onClick={() => void toggleScreenShare()}
        >
          <MonitorUp className="h-5 w-5" />
        </Button>
        <Button
          variant={isRecording ? "default" : "secondary"}
          size="icon"
          title={t("video.record")}
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? <Radio className="h-5 w-5 animate-pulse text-red-500" /> : <Radio className="h-5 w-5" />}
        </Button>
        <Button variant="destructive" onClick={handleLeave}>
          <PhoneOff className="h-4 w-4" />
          {t("video.leave")}
        </Button>
      </div>
    </div>
  )
}
