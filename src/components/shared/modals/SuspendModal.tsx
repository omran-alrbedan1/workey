import { zodResolver } from "@hookform/resolvers/zod"
import { AlertTriangle, Ban, X } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { CancelButton, SubmitButton } from "@/components/shared/buttons"
import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import Logo from "@/components/shared/logo/Logo"
import { createSuspendSchema, type SuspendFormValues } from "./validations/sharedModals.validation"

interface SuspendModalProps {
  open: boolean
  onConfirm: (reason?: string) => void | Promise<unknown>
  onClose: () => void
  loading?: boolean
  name: string
}

export default function SuspendModal({
  open,
  onConfirm,
  onClose,
  loading = false,
  name,
}: SuspendModalProps) {
  const { t } = useTranslation("common")
  const form = useForm<SuspendFormValues>({
    resolver: zodResolver(createSuspendSchema(t)),
    defaultValues: { reason: "" },
  })

  useEffect(() => {
    if (!open) form.reset({ reason: "" })
  }, [form, open])

  const handleSubmit = (data: SuspendFormValues) => onConfirm(data.reason?.trim())

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="overflow-hidden border-red-500/15 bg-background-card p-0 shadow-2xl sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="relative bg-red-100 px-6 pb-12 pt-6 dark:bg-red-950/40">
              <Logo size="lg" alt="Workey" className="relative mx-auto" />
            </div>

            <div className="relative -mt-8 px-6 pb-6">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-background-card bg-red-600 text-white shadow-lg shadow-red-600/20">
                <Ban className="h-8 w-8" />
              </div>

              <DialogHeader className="text-start">
                <DialogTitle className="text-2xl font-bold text-text-primary">
                  {t("modals.suspend.title")}
                </DialogTitle>
                <DialogDescription className="pt-2 text-sm leading-6 text-text-secondary">
                  {t("modals.suspend.description", { name })}
                </DialogDescription>
              </DialogHeader>

              <div className="py-5">
                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="reason"
                  placeholder={t("modals.suspend.reasonPlaceholder")}
                  disabled={loading}
                  rows={4}
                  maxLength={255}
                  containerClassName="space-y-2"
                  inputClassName="focus-visible:ring-1 focus-visible:ring-red-500"
                />
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-red-200 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{t("modals.suspend.hint")}</span>
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
                  isLoading={loading}
                  text={t("modals.suspend.confirm")}
                  loadingText={t("modals.processing")}
                  icon={<Ban className="h-4 w-4" />}
                  className="w-full bg-red-600 shadow-lg shadow-red-600/20 hover:bg-red-700"
                />
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
