import { zodResolver } from "@hookform/resolvers/zod"
import { Building2, Globe2, MapPin, Save } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import { SubmitButton } from "@/components/shared/buttons"
import { Form } from "@/components/ui/form"
import type { EmployerCompany, EmployerCompanyInput } from "../types/employerCompany.types"
import {
  employerCompanySchema,
  type EmployerCompanyFormValues,
} from "../validations/employerCompany.validation"

export default function EmployerCompanyForm({
  company,
  isPending,
  onSubmit,
}: {
  company: EmployerCompany
  isPending: boolean
  onSubmit: (input: EmployerCompanyInput) => Promise<unknown>
}) {
  const { t } = useTranslation("employerCompany")
  const form = useForm<EmployerCompanyFormValues>({
    resolver: zodResolver(employerCompanySchema),
    defaultValues: { name: "", industry: "", website: "", location: "", description: "" },
  })

  useEffect(() => {
    form.reset({
      name: company.name ?? "",
      industry: company.industry ?? "",
      website: company.website ?? "",
      location: company.location ?? "",
      description: company.description ?? "",
    })
  }, [company, form])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          await onSubmit(values)
        })}
        className="grid gap-5 rounded-lg border border-border bg-background-card p-5 shadow-card md:grid-cols-2"
      >
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label={t("fields.name")}
          leftIcon={Building2}
          iconPosition="left"
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="industry"
          label={t("fields.industry")}
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="website"
          label={t("fields.website")}
          placeholder="https://example.com"
          leftIcon={Globe2}
          iconPosition="left"
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="location"
          label={t("fields.location")}
          leftIcon={MapPin}
          iconPosition="left"
        />
        <div className="md:col-span-2">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="description"
            label={t("fields.description")}
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
