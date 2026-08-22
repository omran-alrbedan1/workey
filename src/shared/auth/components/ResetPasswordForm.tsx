import { zodResolver } from "@hookform/resolvers/zod"
import { KeyRound, Lock } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useTranslation } from "react-i18next"

import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import { SubmitButton } from "@/components/shared/buttons"
import { Form } from "@/components/ui/form"
import { showErrorToast, showSuccessToast } from "@/lib/toast"
import { passwordService } from "../services/password.service"
import {
  createResetPasswordSchema,
  type ResetPasswordFormValues,
} from "../validation/password.validation"

export default function ResetPasswordForm({ loginPath }: { loginPath: string }) {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { t } = useTranslation("authPassword")
  const resetToken = params.get("token") ?? params.get("otp") ?? params.get("code") ?? ""
  const hasResetLinkValues = Boolean(params.get("email") && resetToken)
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(createResetPasswordSchema(t)),
    defaultValues: {
      email: params.get("email") ?? "",
      token: resetToken,
      password: "",
      password_confirmation: "",
    },
  })
  const reset = useMutation({
    mutationFn: passwordService.resetPassword,
    onSuccess: (response) => {
      showSuccessToast(response.message ?? t("reset.success"))
      navigate(loginPath, { replace: true })
    },
    onError: (error) => showErrorToast(error, t("reset.error")),
  })

  return (
    <Form {...form}>
      <form className="mt-7 space-y-4" onSubmit={form.handleSubmit((values) => reset.mutate(values))}>
        {!hasResetLinkValues && (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            {t("reset.missingLinkValues")}
          </p>
        )}
        <CustomFormField
          fieldType={FormFieldType.EMAIL}
          control={form.control}
          name="email"
          label={t("email")}
          placeholder={t("reset.emailPlaceholder")}
          disabled={reset.isPending}
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="token"
          label={t("reset.token")}
          placeholder={t("reset.tokenPlaceholder")}
          disabled={reset.isPending}
          leftIcon={KeyRound}
          iconPosition="left"
        />
        <CustomFormField
          fieldType={FormFieldType.PASSWORD}
          control={form.control}
          name="password"
          label={t("reset.newPassword")}
          placeholder={t("reset.passwordPlaceholder")}
          disabled={reset.isPending}
          leftIcon={Lock}
          iconPosition="left"
        />
        <CustomFormField
          fieldType={FormFieldType.PASSWORD}
          control={form.control}
          name="password_confirmation"
          label={t("reset.confirmPassword")}
          placeholder={t("reset.confirmPasswordPlaceholder")}
          disabled={reset.isPending}
          leftIcon={Lock}
          iconPosition="left"
        />
        <SubmitButton
          isLoading={reset.isPending}
          text={t("reset.submit")}
          loadingText={t("reset.submitting")}
          icon={<KeyRound />}
        />
      </form>
    </Form>
  )
}
