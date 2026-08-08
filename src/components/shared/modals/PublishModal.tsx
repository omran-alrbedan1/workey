import { AlertCircle, Send, X } from "lucide-react"

import { CancelButton, SubmitButton } from "@/components/shared/buttons"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface PublishModalProps {
  open: boolean
  onConfirm: () => void | Promise<unknown>
  onClose: () => void
  loading?: boolean
  title: string
  description: string
  confirmText: string
  cancelText: string
  loadingText: string
  hint?: string
}

export default function PublishModal({
  open,
  onConfirm,
  onClose,
  loading = false,
  title,
  description,
  confirmText,
  cancelText,
  loadingText,
  hint,
}: PublishModalProps) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !loading && !nextOpen && onClose()}>
      <DialogContent className="overflow-hidden border-primary/15 bg-background-card p-0 shadow-2xl sm:max-w-md">
        <div className="relative bg-primary/10 px-6 pb-12 pt-6" />

        <div className="relative -mt-8 px-6 pb-6">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-background-card bg-primary text-white shadow-lg shadow-primary/20">
            <Send className="h-8 w-8" />
          </div>

          <DialogHeader className="text-start">
            <DialogTitle className="text-2xl font-bold text-text-primary">{title}</DialogTitle>
            <DialogDescription className="pt-2 text-sm leading-6 text-text-secondary">
              {description}
            </DialogDescription>
          </DialogHeader>

          {hint && (
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-primary/10 bg-primary/5 p-3 text-sm text-text-secondary">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{hint}</span>
            </div>
          )}

          <DialogFooter className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2">
            <CancelButton
              type="button"
              onClick={onClose}
              disabled={loading}
              text={cancelText}
              icon={<X className="h-4 w-4" />}
              className="w-full"
            />
            <SubmitButton
              type="button"
              onClick={onConfirm}
              isLoading={loading}
              text={confirmText}
              loadingText={loadingText}
              icon={<Send className="h-4 w-4" />}
              className="w-full shadow-lg shadow-primary/20"
            />
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
