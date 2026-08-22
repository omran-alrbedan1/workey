import { useEffect, useRef } from "react"
import { MicOff, ScreenShare } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Participant, Track } from "livekit-client"

export default function ParticipantTile({ participant }: { participant: Participant }) {
  const { t } = useTranslation("employerInterviews")
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const screenPub = participant.getTrackPublication(Track.Source.ScreenShare)
  const cameraPub = participant.getTrackPublication(Track.Source.Camera)
  const micPub = participant.getTrackPublication(Track.Source.Microphone)

  // Prefer screen share when present, otherwise the camera track.
  const displayTrack = screenPub?.videoTrack ?? screenPub?.track ?? cameraPub?.videoTrack ?? cameraPub?.track
  const micTrack = micPub?.audioTrack ?? micPub?.track

  useEffect(() => {
    const element = videoRef.current
    if (!element) return
    if (!displayTrack) {
      element.srcObject = null
      return
    }
    displayTrack.attach(element)
    return () => {
      displayTrack.detach(element)
    }
  }, [displayTrack])

  useEffect(() => {
    const element = audioRef.current
    if (!element || !micTrack || participant.isLocal || micPub?.isMuted) return
    micTrack.attach(element)
    return () => {
      micTrack.detach(element)
    }
  }, [micTrack, micPub?.isMuted, participant.isLocal])

  const isMicMuted = !micPub || micPub.isMuted
  const name = participant.isLocal
    ? t("video.you")
    : participant.name || participant.identity || t("video.participant")

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-black">
      <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" muted={participant.isLocal} />
      <audio ref={audioRef} autoPlay />
      {!displayTrack && (
        <div className="flex h-full w-full items-center justify-center text-sm text-white/60">
          {name}
        </div>
      )}
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white">
        {participant.isSpeaking && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />}
        {name}
      </div>
      {screenPub?.track && (
        <span className="absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-md bg-black/60 text-white">
          <ScreenShare className="h-3.5 w-3.5" />
        </span>
      )}
      {isMicMuted && (
        <span className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-md bg-red-500/80 text-white">
          <MicOff className="h-3.5 w-3.5" />
        </span>
      )}
    </div>
  )
}
