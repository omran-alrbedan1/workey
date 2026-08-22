import { zodResolver } from "@hookform/resolvers/zod"
import { Lock, LogIn, Mail } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { ROUTES } from "@/config"
import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import { SubmitButton } from "@/components/shared/buttons"
import { Form } from "@/components/ui/form"
import { useEmployerLogin } from "../hooks/useEmployerLogin"
import {
  employerLoginSchema,
  type EmployerLoginFormValues,
} from "../validations/employerAuth.validation"

export default function EmployerLoginForm() {
  const { t } = useTranslation("employerAuth")
  const login = useEmployerLogin()
  const form = useForm<EmployerLoginFormValues>({
    resolver: zodResolver(employerLoginSchema),
    defaultValues: { email: "", password: "" },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => login.mutate(values))} className="space-y-4">
        <CustomFormField
          fieldType={FormFieldType.EMAIL}
          control={form.control}
          name="email"
          label={t("fields.email")}
          placeholder={t("fields.emailPlaceholder")}
          disabled={login.isPending}
          leftIcon={Mail}
          iconPosition="left"
        />
        <div className="text-end">
          <Link
            className="text-sm font-semibold text-primary hover:underline"
            to={ROUTES.employer.forgotPassword}
          >
            {t("actions.forgotPassword")}
          </Link>
        </div>
        <CustomFormField
          fieldType={FormFieldType.PASSWORD}
          control={form.control}
          name="password"
          label={t("fields.password")}
          placeholder={t("fields.passwordPlaceholder")}
          disabled={login.isPending}
          leftIcon={Lock}
          iconPosition="left"
        />
        <SubmitButton
          isLoading={login.isPending}
          text={t("actions.signIn")}
          loadingText={t("actions.signingIn")}
          icon={<LogIn className="h-4 w-4" />}
        />
      </form>
    </Form>
  )
}
