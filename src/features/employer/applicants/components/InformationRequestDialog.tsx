import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { useTranslation } from "react-i18next"
import {
  Plus,
  Trash2,
  MessageSquare,
  Calendar,
  FileText,
  Tag,
  AlignLeft,
  CheckCircle,
} from "lucide-react"

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
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { InformationRequest, InformationRequestInput } from "../types/employerApplicants.types"
import {
  informationRequestSchema,
  type InformationRequestFormValues,
} from "../validation/employerApplicants.validation"

interface InformationRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: InformationRequest | null
  onSubmit: (input: InformationRequestInput) => void
  isSubmitting: boolean
}

export default function InformationRequestDialog({
  open,
  onOpenChange,
  request,
  onSubmit,
  isSubmitting,
}: InformationRequestDialogProps) {
  const { t } = useTranslation("employerApplicants")
  const form = useForm<InformationRequestFormValues>({
    resolver: zodResolver(informationRequestSchema),
    defaultValues: {
      message: "",
      due_at: "",
      requested_items: [{ label: "", description: "", is_required: true }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "requested_items",
  })

  useEffect(() => {
    if (!open) {
      form.reset()
    } else if (request) {
      form.setValue("message", request.message)
      form.setValue("due_at", request.due_at ? request.due_at.slice(0, 16) : "")
      form.setValue(
        "requested_items",
        request.requested_items.map((item) => ({
          label: item.label,
          description: item.description || "",
          is_required: item.is_required || false,
        })),
      )
    }
  }, [form, open, request])

  const submit = async (values: InformationRequestFormValues) => {
    await onSubmit({
      message: values.message.trim(),
      due_at: values.due_at || null,
      requested_items: values.requested_items.map((item) => ({
        label: item.label.trim(),
        description: item.description?.trim() || null,
        is_required: item.is_required,
      })),
    })
  }

  const addItem = () => {
    append({ label: "", description: "", is_required: false })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)}>
            <DialogHeader>
              <DialogTitle>{t("informationRequests.dialogTitle")}</DialogTitle>
              <DialogDescription>{t("informationRequests.dialogDescription")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-5">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="message"
                label={t("informationRequests.messageLabel")}
                placeholder={t("informationRequests.messagePlaceholder")}
                leftIcon={MessageSquare}
                iconPosition="left"
                disabled={isSubmitting}
                rows={3}
              />
              <FormField
                control={form.control}
                name="due_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      {t("informationRequests.dueAtLabel")}
                    </FormLabel>
                    <FormControl>
                      <Input type="datetime-local" disabled={isSubmitting} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <FileText className="h-4 w-4 text-primary" />
                    {t("informationRequests.requestedItemsLabel")}
                  </label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={addItem}
                    disabled={isSubmitting}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {t("informationRequests.addItem")}
                  </Button>
                </div>
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="rounded-lg border border-border bg-background p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 space-y-3">
                          <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name={`requested_items.${index}.label`}
                            label={t("informationRequests.itemLabel")}
                            placeholder={t("informationRequests.itemLabelPlaceholder")}
                            leftIcon={Tag}
                            iconPosition="left"
                            disabled={isSubmitting}
                          />
                          <CustomFormField
                            fieldType={FormFieldType.TEXTAREA}
                            control={form.control}
                            name={`requested_items.${index}.description`}
                            label={t("informationRequests.itemDescription")}
                            placeholder={t("informationRequests.itemDescriptionPlaceholder")}
                            leftIcon={AlignLeft}
                            iconPosition="left"
                            disabled={isSubmitting}
                            rows={2}
                          />
                        </div>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-8 w- mt-6 text-red-600 hover:text-red-700"
                            onClick={() => remove(index)}
                            disabled={isSubmitting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <CustomFormField
                          fieldType={FormFieldType.CHECKBOX}
                          control={form.control}
                          name={`requested_items.${index}.is_required`}
                          label={t("informationRequests.itemRequired")}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <CancelButton
                type="button"
                disabled={isSubmitting}
                onClick={() => onOpenChange(false)}
                text={t("informationRequests.cancel")}
              />
              <SubmitButton
                isLoading={isSubmitting}
                text={t("informationRequests.submit")}
                loadingText={t("informationRequests.submitting")}
                className="w-auto"
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
