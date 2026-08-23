import { useState } from "react"
import { Loader2, Video } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { showErrorToast } from "@/lib/toast"
import { employerInterviewsService } from "../services/employerInterviews.service"
import type { VideoSessionResponse } from "../types/videoInterview.types"
import VideoInterviewRoom from "./VideoInterviewRoom"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

type VideoErrorLike = {
  status?: number
  code?: string
  message?: string
  response?: {
    status?: number
    data?: {
      code?: string
      message?: string
    }
  }
}

function videoSessionErrorMessage(error: unknown, fallback: string, t: (key: string) => string) {
  const typedError = isRecord(error) ? (error as VideoErrorLike) : undefined
  const status = typedError?.status ?? typedError?.response?.status
  const code = String(typedError?.code ?? typedError?.response?.data?.code ?? "").toLowerCase()
  const message = typedError?.message ?? typedError?.response?.data?.message

  if (status === 401 || code.includes("token")) {
    return t("common:videoErrors.sessionExpired")
  }
  if (status === 403 || code.includes("denied") || code.includes("forbidden")) {
    return t("common:videoErrors.accessDenied")
  }
  if (code.includes("livekit") || code.includes("video")) {
    return message || t("common:videoErrors.roomCreationFailed")
  }
  return message || fallback
}

/**
 * Full-page video section for online interviews: hosts the LiveKit room
 * inline instead of a large modal.
 */
export default function VideoInterviewSection({ interviewId }: { interviewId: string | number }) {
  const { t } = useTranslation(["employerInterviews", "common"])
  const [session, setSession] = useState<VideoSessionResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const startSession = async () => {
    if (session) return
    setIsLoading(true)
    try {
      const created = await employerInterviewsService.createVideoSession(interviewId)
      if (!created.url || !created.token) {
        showErrorToast(t("video.errors.invalidSession"))
        return
      }
      setSession(created)
    } catch (error) {
      showErrorToast(videoSessionErrorMessage(error, t("video.sessionError"), t))
    } finally {
      setIsLoading(false)
    }
  }

  const leaveSession = () => setSession(null)

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-background-card shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/30 px-5 py-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Video className="h-4 w-4" />
          </span>
          {t("video.title")}
        </h3>
        {!session && (
          <Button onClick={() => void startSession()} disabled={isLoading} size="sm">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Video className="h-4 w-4" />
            )}
            {isLoading ? t("video.starting") : t("video.start")}
          </Button>
        )}
      </div>

      <div className="p-5">
        {!session ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Video className="h-6 w-6" />
            </div>
            <p className="text-sm text-text-muted">{t("video.setupHint")}</p>
          </div>
        ) : (
          <VideoInterviewRoom url={session.url} token={session.token} onLeave={leaveSession} />
        )}
      </div>
    </section>
  )
}
