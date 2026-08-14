import { useEffect, useRef } from "react"
import { Participant, Track } from "livekit-client"

export default function ParticipantTile({ participant }: { participant: Participant }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const videoPub = participant.getTrackPublication(Track.Source.Camera)
    const screenPub = participant.getTrackPublication(Track.Source.ScreenShare)
    const audioPub = participant.getTrackPublication(Track.Source.Microphone)

    const videoTrack = screenPub?.track ?? videoPub?.track
    const audioTrack = audioPub?.track

    if (videoTrack && videoRef.current) {
      videoTrack.attach(videoRef.current)
      return () => {
        videoTrack.detach(videoRef.current as HTMLMediaElement)
      }
    }
    if (audioTrack && audioRef.current) {
      audioTrack.attach(audioRef.current)
      return () => {
        audioTrack.detach(audioRef.current as HTMLMediaElement)
      }
    }
  }, [participant, participant.getTrackPublication])

  const isLocal = participant.isLocal
  const name = isLocal ? "You" : participant.name || participant.identity || "Participant"

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-black">
      <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" muted={isLocal} />
      <audio ref={audioRef} autoPlay />
      <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white">
        {name}
        {participant.isSpeaking ? " •" : ""}
      </div>
    </div>
  )
}
