import { useTranslation } from "react-i18next"
import { X, LogOut, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CancelButton, SubmitButton } from "@/components/shared/buttons"

interface LogoutModalProps {
  open: boolean
  onConfirm: () => void
  onClose: () => void
  loading?: boolean
}

const LogoutModal: React.FC<LogoutModalProps> = ({ open, onConfirm, onClose, loading }) => {
  const { t } = useTranslation("common")

  return (
    <Dialog open={open} onOpenChange={loading ? undefined : onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-500/20 to-orange-500/10">
              <LogOut className="h-6 w-6 text-orange-600" />
            </div>

            <DialogTitle className="text-xl">{t("modals.logout.title")}</DialogTitle>

            <DialogDescription>{t("modals.logout.description")}</DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-2 mt-6 w-fit mx-auto">
          <CancelButton
            onClick={onClose}
            disabled={loading}
            text={t("modals.cancel")}
            icon={<X className="h-4 w-4" />}
            className="flex-1"
          />
          <SubmitButton
            onClick={onConfirm}
            isLoading={loading}
            text={t("modals.logout.confirm")}
            loadingText={t("modals.processing")}
            icon={<LogOut className="h-4 w-4" />}
            className="bg-orange-600 hover:bg-orange-700 focus:ring-orange-500 flex-1"
          />
        </DialogFooter>

        <div className="mt-4 pt-3 border-t border-border/50">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <AlertCircle className="h-3.5 w-3.5 text-orange-400" />
            <span>{t("modals.logout.hint")}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LogoutModal
