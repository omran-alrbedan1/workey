import { useState } from "react"
import { Loader2, Video } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { showErrorToast } from "@/lib/toast"
import { employerInterviewsService } from "../services/employerInterviews.service"
import type { VideoSessionResponse } from "../types/videoInterview.types"
import VideoInterviewRoom from "./VideoInterviewRoom"

export default function VideoSessionSetup({
  interviewId,
  open,
  onOpenChange,
}: {
  interviewId: string | number
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation("employerInterviews")
  const [session, setSession] = useState<VideoSessionResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const startSession = async () => {
    if (session) return
    setIsLoading(true)
    try {
      const created = await employerInterviewsService.createVideoSession(interviewId, {
        participant_name: "Interviewer",
        role: "interviewer",
      })
      setSession(created)
    } catch {
      showErrorToast(t("video.sessionError"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = (next: boolean) => {
    if (!next) {
      setSession(null)
    }
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{t("video.title")}</DialogTitle>
          <DialogDescription>{t("video.description")}</DialogDescription>
        </DialogHeader>

        {!session ? (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Video className="h-7 w-7" />
            </div>
            <p className="text-sm text-text-muted">{t("video.setupHint")}</p>
            <Button onClick={() => void startSession()} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Video className="h-4 w-4" />}
              {isLoading ? t("video.starting") : t("video.start")}
            </Button>
          </div>
        ) : (
          <VideoInterviewRoom
            url={session.url}
            token={session.token}
            onLeave={() => handleClose(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
