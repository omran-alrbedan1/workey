import { zodResolver } from "@hookform/resolvers/zod"
import { BriefcaseBusiness, Phone, Save } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import { SubmitButton } from "@/components/shared/buttons"
import { Form } from "@/components/ui/form"
import { applyApiValidationErrors } from "@/lib/forms"
import { showErrorToast } from "@/lib/toast"
import type { EmployerProfile, EmployerProfileInput } from "../types/employerProfile.types"
import {
  employerProfileSchema,
  type EmployerProfileFormValues,
} from "../validation/employerProfile.validation"

export default function EmployerProfileForm({
  profile,
  isPending,
  onSubmit,
}: {
  profile: EmployerProfile
  isPending: boolean
  onSubmit: (input: EmployerProfileInput) => Promise<unknown>
}) {
  const { t } = useTranslation("employerProfile")
  const form = useForm<EmployerProfileFormValues>({
    resolver: zodResolver(employerProfileSchema),
    defaultValues: { job_title: "", phone: "", bio: "" },
  })

  useEffect(() => {
    form.reset({
      job_title: profile.job_title ?? "",
      phone: profile.phone ?? "",
      bio: profile.bio ?? "",
    })
  }, [form, profile])

  const submit = async (values: EmployerProfileFormValues) => {
    form.clearErrors()

    try {
      await onSubmit(values)
    } catch (error) {
      if (!applyApiValidationErrors(form.setError, error)) {
        showErrorToast(error, t("toasts.updateError"))
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        className="grid gap-5 rounded-lg border border-border bg-background-card p-5 shadow-card md:grid-cols-2"
      >
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="job_title"
          label={t("fields.jobTitle")}
          leftIcon={BriefcaseBusiness}
          iconPosition="left"
        />
        <CustomFormField
          fieldType={FormFieldType.PHONE}
          control={form.control}
          name="phone"
          label={t("fields.phone")}
          leftIcon={Phone}
          iconPosition="left"
        />
        <div className="md:col-span-2">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="bio"
            label={t("fields.bio")}
          />
        </div>
        <div className="md:col-span-2 md:justify-self-end">
          <SubmitButton
            isLoading={isPending}
            text={t("actions.save")}
            loadingText={t("actions.saving")}
            icon={<Save className="h-4 w-4" />}
          />
        </div>
      </form>
    </Form>
  )
}
