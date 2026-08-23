import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import { MessageSquare, Send, User, Phone, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import { CancelButton, SubmitButton } from "@/components/shared/buttons"
import {
  createSendMessageSchema,
  type SendMessageFormValues,
} from "./validation/sharedModals.validation"

interface SendMessageModalProps {
  open: boolean
  onConfirm: (message: string) => void
  onClose: () => void
  loading?: boolean
  name: string
  phone?: string
}

const SendMessageModal: React.FC<SendMessageModalProps> = ({
  open,
  onConfirm,
  onClose,
  loading,
  name,
  phone,
}) => {
  const { t } = useTranslation("common")

  const form = useForm<SendMessageFormValues>({
    resolver: zodResolver(createSendMessageSchema(t)),
    defaultValues: { message: "" },
  })

  const handleSubmit = (data: SendMessageFormValues) => {
    onConfirm(data.message)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <div className="flex items-center gap-3 rtl:text-start">
                <div className="rounded-xl bg-linear-to-br from-primary/20 to-primary/10 p-2.5">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-xl">{t("modals.sendMessage.title")}</DialogTitle>
                  <DialogDescription>{t("modals.sendMessage.description")}</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{t("modals.sendMessage.to")}</p>
                  <p className="font-semibold text-foreground">{name}</p>
                </div>
                {phone && (
                  <>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        {t("modals.sendMessage.phone")}
                      </p>
                      <p className="font-semibold text-xs text-foreground">{phone}</p>
                    </div>
                  </>
                )}
              </div>

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="message"
                label={t("modals.sendMessage.message")}
                placeholder={t("modals.sendMessage.messagePlaceholder")}
                disabled={loading}
                required
                rows={5}
                maxLength={500}
                description={t("modals.sendMessage.messageHint")}
                containerClassName="space-y-2"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-2">
              <CancelButton
                onClick={onClose}
                disabled={loading}
                text={t("modals.cancel")}
                icon={<X className="h-4 w-4" />}
              />
              <SubmitButton
                isLoading={loading}
                text={t("modals.sendMessage.confirm")}
                loadingText={t("modals.sendMessage.confirmLoading")}
                icon={<Send className="h-4 w-4" />}
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default SendMessageModal
