export interface VideoSessionResponse {
  token: string
  url: string
  room: string
  participant_name?: string
  expires_at?: string | null
}

export interface VideoSessionInput {
  participant_name?: string
  role?: "interviewer" | "candidate"
}

export type VideoRoomConnectionState =
  | "idle"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected"
  | "error"
