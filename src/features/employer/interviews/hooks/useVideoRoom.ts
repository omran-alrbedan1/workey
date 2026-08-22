import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Participant, Room, RoomEvent, Track } from "livekit-client"
import type { VideoRoomConnectionState } from "../types/videoInterview.types"

interface UseVideoRoomOptions {
  url: string
  token: string
}

export function useVideoRoom({ url, token }: UseVideoRoomOptions) {
  const { t } = useTranslation("employerInterviews")
  const roomRef = useRef<Room | null>(null)
  const leavingRef = useRef(false)

  const [connectionState, setConnectionState] = useState<VideoRoomConnectionState>("idle")
  const [participants, setParticipants] = useState<Participant[]>([])
  const [error, setError] = useState<string | null>(null)
  const [deviceWarning, setDeviceWarning] = useState<string | null>(null)
  const [unexpectedDisconnect, setUnexpectedDisconnect] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOff, setIsCameraOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)

  const describeConnectError = useCallback(
    (err: unknown) => {
      const raw = err instanceof Error ? err.message : String(err ?? "")
      const lower = raw.toLowerCase()

      if (lower.includes("token") || lower.includes("jwt") || lower.includes("expired") || lower.includes("grant")) {
        return t("video.errors.tokenExpired")
      }
      if (lower.includes("permission") || lower.includes("denied") || lower.includes("notallowed")) {
        return t("video.errors.devicePermission")
      }
      if (lower.includes("notfound") || lower.includes("404") || lower.includes("room does not exist")) {
        return t("video.errors.roomNotFound")
      }
      if (
        lower.includes("network") ||
        lower.includes("websocket") ||
        lower.includes("timeout") ||
        lower.includes("offline") ||
        lower.includes("connection")
      ) {
        return t("video.errors.network")
      }
      return t("video.errors.generic")
    },
    [t],
  )

  const syncLocalControls = useCallback((room: Room) => {
    const local = room.localParticipant
    if (!local) return
    setIsMuted(local.getTrackPublication(Track.Source.Microphone)?.isMuted ?? false)
    setIsCameraOff(!local.getTrackPublication(Track.Source.Camera)?.track)
    setIsScreenSharing(Boolean(local.getTrackPublication(Track.Source.ScreenShare)?.track))
  }, [])

  const refreshParticipants = useCallback(
    (room: Room) => {
      const remote: Participant[] = Array.from(room.remoteParticipants.values())
      setParticipants([...remote, room.localParticipant])
      syncLocalControls(room)
    },
    [syncLocalControls],
  )

  const connect = useCallback(async () => {
    if (!url || !token || roomRef.current) return

    const room = new Room({
      autoSubscribe: true,
      adaptiveStream: true,
      dynacast: true,
      publishDefaults: { simulcast: true },
    })
    roomRef.current = room

    room
      .on(RoomEvent.ParticipantConnected, () => refreshParticipants(room))
      .on(RoomEvent.ParticipantDisconnected, () => refreshParticipants(room))
      .on(RoomEvent.TrackSubscribed, () => refreshParticipants(room))
      .on(RoomEvent.TrackUnsubscribed, () => refreshParticipants(room))
      .on(RoomEvent.LocalTrackPublished, () => refreshParticipants(room))
      .on(RoomEvent.LocalTrackUnpublished, () => refreshParticipants(room))
      .on(RoomEvent.TrackMuted, () => refreshParticipants(room))
      .on(RoomEvent.TrackUnmuted, () => refreshParticipants(room))
      .on(RoomEvent.ActiveSpeakersChanged, () => refreshParticipants(room))
      .on(RoomEvent.MediaDevicesError, () => {
        setError(t("video.errors.devicePermission"))
        setConnectionState("error")
      })
      .on(RoomEvent.Reconnecting, () => setConnectionState("reconnecting"))
      .on(RoomEvent.SignalReconnecting, () => setConnectionState("reconnecting"))
      .on(RoomEvent.Reconnected, () => {
        setConnectionState("connected")
        refreshParticipants(room)
      })
      .on(RoomEvent.Disconnected, () => {
        setConnectionState("disconnected")
        // Distinguish leaving on purpose from losing the room (network drop,
        // host closed the room, token revoked mid-call).
        if (!leavingRef.current) {
          setUnexpectedDisconnect(true)
        }
      })

    try {
      setConnectionState("connecting")
      setError(null)
      await room.connect(url, token)

      // Request permissions and publish local tracks. Handle each device
      // separately so a blocked camera still allows microphone use.
      try {
        await room.localParticipant.setMicrophoneEnabled(true)
      } catch {
        setDeviceWarning(t("video.errors.microphoneUnavailable"))
      }
      try {
        await room.localParticipant.setCameraEnabled(true)
      } catch {
        setDeviceWarning((current) =>
          current ? `${current} ${t("video.errors.cameraUnavailable")}` : t("video.errors.cameraUnavailable"),
        )
      }

      refreshParticipants(room)
    } catch (err) {
      setError(describeConnectError(err))
      setConnectionState("error")
    }
  }, [describeConnectError, refreshParticipants, t, url, token])

  useEffect(() => {
    if (url && token) void connect()
    return () => {
      leavingRef.current = true
      const room = roomRef.current
      if (room) {
        // Stop local media tracks before disconnecting so camera/microphone
        // hardware indicators are released immediately.
        for (const publication of room.localParticipant.trackPublications.values()) {
          publication.track?.stop()
        }
        void room.disconnect()
      }
      roomRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleMute = async () => {
    const room = roomRef.current
    if (!room) return
    const next = !isMuted
    setIsMuted(next)
    try {
      await room.localParticipant.setMicrophoneEnabled(!next)
      syncLocalControls(room)
    } catch {
      setIsMuted(!next)
      setDeviceWarning(t("video.errors.microphoneUnavailable"))
    }
  }

  const toggleCamera = async () => {
    const room = roomRef.current
    if (!room) return
    const next = !isCameraOff
    setIsCameraOff(next)
    try {
      await room.localParticipant.setCameraEnabled(!next)
      syncLocalControls(room)
    } catch {
      setIsCameraOff(!next)
      setDeviceWarning(t("video.errors.cameraUnavailable"))
    }
  }

  const toggleScreenShare = async () => {
    const room = roomRef.current
    if (!room) return
    const next = !isScreenSharing
    try {
      await room.localParticipant.setScreenShareEnabled(next)
      setIsScreenSharing(next)
    } catch {
      setDeviceWarning(t("video.errors.screenShareFailed"))
    }
  }

  const leave = () => {
    leavingRef.current = true
    const room = roomRef.current
    if (room) {
      for (const publication of room.localParticipant.trackPublications.values()) {
        publication.track?.stop()
      }
      void room.disconnect()
    }
    roomRef.current = null
    setConnectionState("disconnected")
    setParticipants([])
  }

  return {
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
  }
}
