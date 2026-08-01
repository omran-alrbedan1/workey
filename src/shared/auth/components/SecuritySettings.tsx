import { zodResolver } from "@hookform/resolvers/zod"
import { KeyRound, LogOut, Lock } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import { SubmitButton } from "@/components/shared/buttons"
import { SectionCard } from "@/components/shared/cards/SectionCard"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { showErrorToast, showSuccessToast } from "@/lib/toast"
import { passwordService } from "../services/password.service"
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "../validation/password.validation"

export default function SecuritySettings({
  clearSession,
  loginPath,
}: {
  clearSession: () => void
  loginPath: string
}) {
  const client = useQueryClient()
  const navigate = useNavigate()
  const { t } = useTranslation("authPassword")
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { current_password: "", password: "", password_confirmation: "" },
  })
  const changePassword = useMutation({
    mutationFn: passwordService.changePassword,
    onSuccess: (response) => {
      form.reset()
      showSuccessToast(response.message ?? t("security.changeSuccess"))
    },
    onError: (error) => showErrorToast(error, t("security.changeError")),
  })
  const logoutAll = useMutation({
    mutationFn: passwordService.logoutAll,
    onSuccess: (response) => {
      clearSession()
      client.clear()
      showSuccessToast(response.message ?? t("security.logoutSuccess"))
      navigate(loginPath, { replace: true })
    },
    onError: (error) => showErrorToast(error, t("security.logoutError")),
  })

  return (
    <SectionCard icon={KeyRound} title={t("security.title")}>
      <Form {...form}>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit((values) => changePassword.mutate(values))}>
          <div className="md:col-span-2">
            <CustomFormField fieldType={FormFieldType.PASSWORD} control={form.control} name="current_password" label={t("security.currentPassword")} disabled={changePassword.isPending} leftIcon={Lock} iconPosition="left" />
          </div>
          <CustomFormField fieldType={FormFieldType.PASSWORD} control={form.control} name="password" label={t("security.newPassword")} disabled={changePassword.isPending} leftIcon={Lock} iconPosition="left" />
          <CustomFormField fieldType={FormFieldType.PASSWORD} control={form.control} name="password_confirmation" label={t("security.confirmPassword")} disabled={changePassword.isPending} leftIcon={Lock} iconPosition="left" />
          <SubmitButton className="md:col-span-2 md:w-auto md:justify-self-start" isLoading={changePassword.isPending} text={t("security.change")} loadingText={t("security.changing")} icon={<KeyRound />} />
        </form>
      </Form>
      <div className="mt-8 border-t border-border/60 pt-6">
        <h3 className="font-semibold text-text-primary">{t("security.sessions")}</h3>
        <p className="mt-1 text-sm text-text-secondary">{t("security.sessionsDescription")}</p>
        <Button className="mt-4" type="button" variant="destructive" disabled={logoutAll.isPending} onClick={() => logoutAll.mutate()}>
          <LogOut /> {logoutAll.isPending ? t("security.loggingOut") : t("security.logoutAll")}
        </Button>
      </div>
    </SectionCard>
  )
}
