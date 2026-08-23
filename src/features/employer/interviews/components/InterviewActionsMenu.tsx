import { Ban, CalendarSync, CheckCircle, ListChecks, MoreHorizontal, UserX } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface InterviewActionsMenuProps {
  isRtl: boolean
  canReschedule: boolean
  canRecordAttendance: boolean
  canComplete: boolean
  canMarkNoShow: boolean
  canCancel: boolean
  onReschedule: () => void
  onRecordAttendance: () => void
  onComplete: () => void
  onMarkNoShow: () => void
  onCancel: () => void
}

export default function InterviewActionsMenu({
  isRtl,
  canReschedule,
  canRecordAttendance,
  canComplete,
  canMarkNoShow,
  canCancel,
  onReschedule,
  onRecordAttendance,
  onComplete,
  onMarkNoShow,
  onCancel,
}: InterviewActionsMenuProps) {
  const { t } = useTranslation("employerInterviews")
  const hasActions =
    canReschedule || canRecordAttendance || canComplete || canMarkNoShow || canCancel

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 bg-background/80 shadow-sm hover:bg-background"
          disabled={!hasActions}
          aria-label={t("actions.label")}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRtl ? "start" : "end"} className="w-52">
        <DropdownMenuLabel>{t("actions.label")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {canReschedule && (
          <DropdownMenuItem
            className={cn(isRtl && "flex-row-reverse text-end")}
            onSelect={onReschedule}
          >
            <CalendarSync /> {t("actions.reschedule")}
          </DropdownMenuItem>
        )}
        {canRecordAttendance && (
          <DropdownMenuItem
            className={cn(isRtl && "flex-row-reverse text-end")}
            onSelect={onRecordAttendance}
          >
            <ListChecks /> {t("actions.attendance")}
          </DropdownMenuItem>
        )}
        {canComplete && (
          <DropdownMenuItem
            className={cn(isRtl && "flex-row-reverse text-end")}
            onSelect={onComplete}
          >
            <CheckCircle /> {t("actions.complete")}
          </DropdownMenuItem>
        )}
        {canMarkNoShow && (
          <DropdownMenuItem
            className={cn(isRtl && "flex-row-reverse text-end")}
            onSelect={onMarkNoShow}
          >
            <UserX /> {t("actions.noShow")}
          </DropdownMenuItem>
        )}
        {canCancel && (
          <DropdownMenuItem
            className={cn("text-red-600 focus:text-red-700", isRtl && "flex-row-reverse text-end")}
            onSelect={onCancel}
          >
            <Ban /> {t("actions.cancel")}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
