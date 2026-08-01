import { AlertCircle, PowerOff, X } from "lucide-react"
import { useTranslation } from "react-i18next"

import { CancelButton, SubmitButton } from "@/components/shared/buttons"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { images } from "@/constants/images"

interface DeactivateModalProps {
  open: boolean
  onConfirm: () => void | Promise<unknown>
  onClose: () => void
  loading?: boolean
  name: string
}

export default function DeactivateModal({
  open,
  onConfirm,
  onClose,
  loading = false,
  name,
}: DeactivateModalProps) {
  const { t } = useTranslation("common")

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="overflow-hidden border-red-500/15 bg-background-card p-0 shadow-2xl sm:max-w-md">
        <div className="relative bg-red-100 px-6 pb-12 pt-6 dark:bg-red-950/40">
          <img src={images.logo} alt="Workey" className="relative mx-auto h-16 w-auto" />
        </div>

        <div className="relative -mt-8 px-6 pb-6">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-background-card bg-red-600 text-white shadow-lg shadow-red-600/20">
            <PowerOff className="h-8 w-8" />
          </div>

          <DialogHeader className="text-start">
            <DialogTitle className="text-2xl font-bold text-text-primary">
              {t("modals.deactivate.title")}
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm leading-6 text-text-secondary">
              {t("modals.deactivate.description", { name })}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{t("modals.deactivate.hint")}</span>
          </div>

          <DialogFooter className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2">
            <CancelButton
              type="button"
              onClick={onClose}
              disabled={loading}
              text={t("modals.cancel")}
              icon={<X className="h-4 w-4" />}
              className="w-full"
            />
            <SubmitButton
              type="button"
              onClick={onConfirm}
              isLoading={loading}
              text={t("modals.deactivate.confirm")}
              loadingText={t("modals.processing")}
              icon={<PowerOff className="h-4 w-4" />}
              className="w-full bg-red-600 shadow-lg shadow-red-600/20 hover:bg-red-700"
            />
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
