import { AlertCircle, Check, ShieldCheck, X } from "lucide-react"
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
import Logo from "@/components/shared/logo/Logo"

interface ApproveModalProps {
  open: boolean
  onConfirm: () => void | Promise<unknown>
  onClose: () => void
  loading?: boolean
  name: string
  title?: string
  description?: string
  confirmText?: string
}

export default function ApproveModal({
  open,
  onConfirm,
  onClose,
  loading = false,
  name,
  title,
  description,
  confirmText,
}: ApproveModalProps) {
  const { t } = useTranslation("common")

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="overflow-hidden border-primary/15 bg-background-card p-0 shadow-2xl sm:max-w-md">
        <div className="relative bg-primary/15  bg-gradient-primary/30 px-6 pb-12 pt-6">
          <Logo size="lg" alt="Workey" className="relative mx-auto" />
        </div>

        <div className="relative -mt-8 px-6 pb-6">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-background-card bg-primary text-white shadow-lg shadow-primary/20">
            <ShieldCheck className="h-8 w-8" />
          </div>

          <DialogHeader className="text-start">
            <DialogTitle className="text-2xl font-bold text-text-primary">
              {title ?? t("modals.approve.title")}
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm leading-6 text-text-secondary">
              {description ?? t("modals.approve.description", { name })}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 flex items-start gap-3 rounded-xl border border-primary/10 bg-primary/5 p-3 text-sm text-text-secondary">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{t("modals.approve.hint")}</span>
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
              text={confirmText ?? t("modals.approve.confirm")}
              loadingText={t("modals.processing")}
              icon={<Check className="h-4 w-4" />}
              className="w-full shadow-lg shadow-primary/20"
            />
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
