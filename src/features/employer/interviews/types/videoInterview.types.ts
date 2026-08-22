export interface VideoSessionResponse {
  token: string
  url: string
  room?: string
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
