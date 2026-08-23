export interface VideoSessionResponse {
  token: string
  url: string
  provider?: string
  participant_token?: string
  fallback_meeting_link?: string | null
  room?: string | { name?: string }
  participant?: {
    identity?: string
    display_name?: string
    role?: "employer" | "candidate"
  }
  access_token?: string
  livekit_token?: string
  livekit_url?: string
  ws_url?: string
  server_url?: string
  room_name?: string
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
