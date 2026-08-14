import { zodResolver } from "@hookform/resolvers/zod"
import { Mail, Send } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import { SubmitButton } from "@/components/shared/buttons"
import { Form } from "@/components/ui/form"
import { showErrorToast, showSuccessToast } from "@/lib/toast"
import { passwordService } from "../services/password.service"
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../validation/password.validation"

export default function ForgotPasswordForm() {
  const { t } = useTranslation("authPassword")
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })
  const request = useMutation({
    mutationFn: passwordService.forgotPassword,
    onSuccess: (response) => {
      showSuccessToast(response.message ?? t("forgot.success"))
    },
    onError: (error) => showErrorToast(error, t("forgot.error")),
  })

  return (
    <Form {...form}>
      <form
        className="mt-7 space-y-4"
        onSubmit={form.handleSubmit((values) => request.mutate(values))}
      >
        <CustomFormField
          fieldType={FormFieldType.EMAIL}
          control={form.control}
          name="email"
          label={t("email")}
          placeholder="you@example.com"
          disabled={request.isPending}
          leftIcon={Mail}
          iconPosition="left"
        />
        <SubmitButton
          isLoading={request.isPending}
          text={t("forgot.send")}
          loadingText={t("forgot.sending")}
          icon={<Send />}
        />
      </form>
    </Form>
  )
}
