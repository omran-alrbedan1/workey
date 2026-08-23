import { zodResolver } from "@hookform/resolvers/zod"
import { Building2, Globe, Lock, Mail, Phone, UserRound, UserRoundPlus } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import { SubmitButton } from "@/components/shared/buttons"
import { Form } from "@/components/ui/form"
import { useEmployerRegister } from "../hooks/useEmployerRegister"
import {
  employerRegisterSchema,
  type EmployerRegisterFormValues,
} from "../validation/employerAuth.validation"

export default function EmployerRegisterForm() {
  const { t } = useTranslation("employerAuth")
  const registration = useEmployerRegister()
  const form = useForm<EmployerRegisterFormValues>({
    resolver: zodResolver(employerRegisterSchema),
    defaultValues: {
      name: "",
      company_name: "",
      company_website: "",
      phone: "",
      terms_accepted: false,
      email: "",
      password: "",
      password_confirmation: "",
    },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => registration.mutate(values))}
        className="space-y-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label={t("fields.name")}
            placeholder={t("fields.namePlaceholder")}
            disabled={registration.isPending}
            leftIcon={UserRound}
            iconPosition="left"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="company_name"
            label={t("fields.companyName")}
            placeholder={t("fields.companyNamePlaceholder")}
            disabled={registration.isPending}
            leftIcon={Building2}
            iconPosition="left"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="company_website"
            label={t("fields.companyWebsite", { defaultValue: "Company website" })}
            placeholder={t("fields.companyWebsitePlaceholder", {
              defaultValue: "https://company.com",
            })}
            disabled={registration.isPending}
            leftIcon={Globe}
            iconPosition="left"
          />
          <CustomFormField
            fieldType={FormFieldType.PHONE}
            control={form.control}
            name="phone"
            label={t("fields.phone", { defaultValue: "Phone number" })}
            placeholder={t("fields.phonePlaceholder", { defaultValue: "+1 555 0200" })}
            disabled={registration.isPending}
            leftIcon={Phone}
            iconPosition="left"
          />
        </div>
        <CustomFormField
          fieldType={FormFieldType.EMAIL}
          control={form.control}
          name="email"
          label={t("fields.email")}
          placeholder={t("fields.emailPlaceholder")}
          disabled={registration.isPending}
          leftIcon={Mail}
          iconPosition="left"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <CustomFormField
            fieldType={FormFieldType.PASSWORD}
            control={form.control}
            name="password"
            label={t("fields.password")}
            placeholder={t("fields.passwordCreatePlaceholder")}
            disabled={registration.isPending}
            leftIcon={Lock}
            iconPosition="left"
          />
          <CustomFormField
            fieldType={FormFieldType.PASSWORD}
            control={form.control}
            name="password_confirmation"
            label={t("fields.passwordConfirmation")}
            placeholder={t("fields.passwordConfirmationPlaceholder")}
            disabled={registration.isPending}
            leftIcon={Lock}
            iconPosition="left"
          />
        </div>
        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="terms_accepted"
          label={t("fields.termsAccepted", {
            defaultValue: "I accept the terms and conditions",
          })}
          disabled={registration.isPending}
        />
        <SubmitButton
          isLoading={registration.isPending}
          text={t("actions.createAccount")}
          loadingText={t("actions.creatingAccount")}
          icon={<UserRoundPlus className="h-4 w-4" />}
        />
      </form>
    </Form>
  )
}
