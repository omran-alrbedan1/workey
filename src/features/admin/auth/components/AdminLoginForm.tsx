import { zodResolver } from "@hookform/resolvers/zod"
import { Lock, LogIn, Mail } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { ROUTES } from "@/config"

import { Form } from "@/components/ui/form"
import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import { SubmitButton } from "@/components/shared/buttons/SubmitButton"
import { useAdminLogin } from "../hooks/useAdminLogin"
import { adminLoginSchema, type AdminLoginFormValues } from "../validations/adminAuth.validation"

export default function AdminLoginForm() {
  const { t } = useTranslation("adminAuth")
  const login = useAdminLogin()
  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: "", password: "" },
  })

  const submit = (values: AdminLoginFormValues) => login.mutate(values)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
        <CustomFormField
          fieldType={FormFieldType.EMAIL}
          control={form.control}
          name="email"
          label={t("email")}
          placeholder="admin@workey.com"
          disabled={login.isPending}
          leftIcon={Mail}
          iconPosition="left"
        />
        <div className="text-end">
          <Link
            className="text-sm font-semibold text-primary hover:underline"
            to={ROUTES.auth.forgotPassword}
          >
            {t("forgotPassword")}
          </Link>
        </div>
        <CustomFormField
          fieldType={FormFieldType.PASSWORD}
          control={form.control}
          name="password"
          label={t("password")}
          placeholder={t("passwordPlaceholder")}
          disabled={login.isPending}
          leftIcon={Lock}
          iconPosition="left"
        />
        <SubmitButton
          isLoading={login.isPending}
          text={t("signIn")}
          loadingText={t("signingIn")}
          icon={<LogIn className="h-4 w-4" />}
        />
      </form>
    </Form>
  )
}
