import { useCallback, useEffect, useRef, useState } from "react"
import { Participant, Room, RoomEvent } from "livekit-client"
import type { VideoRoomConnectionState } from "../types/videoInterview.types"

interface UseVideoRoomOptions {
  url: string
  token: string
  onError?: (error: Error) => void
}

export function useVideoRoom({ url, token }: UseVideoRoomOptions) {
  const roomRef = useRef<Room | null>(null)
  const [connectionState, setConnectionState] = useState<VideoRoomConnectionState>("idle")
  const [participants, setParticipants] = useState<Participant[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOff, setIsCameraOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  const refreshParticipants = useCallback((room: Room) => {
    const list = Array.from(room.remoteParticipants.values())
    const local: Participant[] = room.localParticipant ? [room.localParticipant] : []
    setParticipants([...list, ...local])
  }, [])

  const connect = useCallback(async () => {
    if (!url || !token) return
    const room = new Room({
      adaptiveStream: true,
      dynacast: true,
      publishDefaults: {
        simulcast: true,
      },
    })
    roomRef.current = room

    room
      .on(RoomEvent.ParticipantConnected, () => refreshParticipants(room))
      .on(RoomEvent.ParticipantDisconnected, () => refreshParticipants(room))
      .on(RoomEvent.TrackSubscribed, () => refreshParticipants(room))
      .on(RoomEvent.TrackUnsubscribed, () => refreshParticipants(room))
      .on(RoomEvent.LocalTrackPublished, () => refreshParticipants(room))
      .on(RoomEvent.LocalTrackUnpublished, () => refreshParticipants(room))
      .on(RoomEvent.ActiveSpeakersChanged, () => refreshParticipants(room))
      .on(RoomEvent.ConnectionStateChanged, (state) => {
        setConnectionState(
          state === "connected"
            ? "connected"
            : state === "connecting"
              ? "connecting"
              : "disconnected",
        )
      })

    try {
      setConnectionState("connecting")
      setError(null)
      await room.connect(url, token)
      await room.localParticipant.setMicrophoneEnabled(true)
      await room.localParticipant.setCameraEnabled(true)
      refreshParticipants(room)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to connect to the video room."
      setError(message)
      setConnectionState("error")
    }
  }, [refreshParticipants, token, url])

  useEffect(() => {
    if (url && token) void connect()
    return () => {
      const room = roomRef.current
      if (room) void room.disconnect()
      roomRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleMute = async () => {
    const room = roomRef.current
    if (!room) return
    const next = !isMuted
    setIsMuted(next)
    await room.localParticipant.setMicrophoneEnabled(!next)
  }

  const toggleCamera = async () => {
    const room = roomRef.current
    if (!room) return
    const next = !isCameraOff
    setIsCameraOff(next)
    await room.localParticipant.setCameraEnabled(!next)
  }

  const toggleScreenShare = async () => {
    const room = roomRef.current
    if (!room) return
    if (isScreenSharing) {
      await room.localParticipant.setScreenShareEnabled(false)
      setIsScreenSharing(false)
    } else {
      await room.localParticipant.setScreenShareEnabled(true)
      setIsScreenSharing(true)
    }
  }

  const startRecording = () => {
    setIsRecording(true)
  }

  const stopRecording = () => {
    setIsRecording(false)
  }

  const disconnect = () => {
    const room = roomRef.current
    if (room) void room.disconnect()
    setConnectionState("disconnected")
  }

  return {
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
  }
}
