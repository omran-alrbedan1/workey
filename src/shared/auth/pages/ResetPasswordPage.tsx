import { zodResolver } from "@hookform/resolvers/zod"
import { KeyRound, Lock } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useTranslation } from "react-i18next"

import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import { SubmitButton } from "@/components/shared/buttons"
import { Form } from "@/components/ui/form"
import { images } from "@/constants/images"
import { showErrorToast, showSuccessToast } from "@/lib/toast"
import { passwordService } from "../services/password.service"
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../validation/password.validation"

export default function ResetPasswordPage({ loginPath }: { loginPath: string }) {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { t } = useTranslation("authPassword")
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: params.get("email") ?? "",
      token: params.get("token") ?? "",
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
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <img src={images.logo} alt="Workey" className="mb-8 h-24 w-auto" />
        <h1 className="text-3xl font-bold text-text-primary">{t("reset.title")}</h1>
        <p className="mt-2 text-sm text-text-secondary">
          {t("reset.description")}
        </p>
        <Form {...form}>
          <form className="mt-7 space-y-4" onSubmit={form.handleSubmit((values) => reset.mutate(values))}>
            <CustomFormField fieldType={FormFieldType.EMAIL} control={form.control} name="email" label={t("email")} disabled={reset.isPending} />
            <CustomFormField fieldType={FormFieldType.INPUT} control={form.control} name="token" label={t("reset.token")} disabled={reset.isPending} leftIcon={KeyRound} iconPosition="left" />
            <CustomFormField fieldType={FormFieldType.PASSWORD} control={form.control} name="password" label={t("reset.newPassword")} disabled={reset.isPending} leftIcon={Lock} iconPosition="left" />
            <CustomFormField fieldType={FormFieldType.PASSWORD} control={form.control} name="password_confirmation" label={t("reset.confirmPassword")} disabled={reset.isPending} leftIcon={Lock} iconPosition="left" />
            <SubmitButton isLoading={reset.isPending} text={t("reset.submit")} loadingText={t("reset.submitting")} icon={<KeyRound />} />
          </form>
        </Form>
      </div>
    </main>
  )
}
