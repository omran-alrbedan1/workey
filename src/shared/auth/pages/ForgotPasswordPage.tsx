import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Mail, Send } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import { SubmitButton } from "@/components/shared/buttons"
import { Form } from "@/components/ui/form"
import { images } from "@/constants/images"
import { showErrorToast, showSuccessToast } from "@/lib/toast"
import { passwordService } from "../services/password.service"
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../validation/password.validation"

export default function ForgotPasswordPage({ loginPath }: { loginPath: string }) {
  const { t } = useTranslation("authPassword")
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })
  const request = useMutation({
    mutationFn: passwordService.forgotPassword,
    onSuccess: (response) => {
      showSuccessToast(
        response.message ?? t("forgot.success"),
      )
    },
    onError: (error) => showErrorToast(error, t("forgot.error")),
  })

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <img src={images.logo} alt="Workey" className="mb-8 h-24 w-auto" />
        <h1 className="text-3xl font-bold text-text-primary">{t("forgot.title")}</h1>
        <p className="mt-2 text-sm text-text-secondary">
          {t("forgot.description")}
        </p>
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
        <Link className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary" to={loginPath}>
          <ArrowLeft className="h-4 w-4" /> {t("forgot.back")}
        </Link>
      </div>
    </main>
  )
}
