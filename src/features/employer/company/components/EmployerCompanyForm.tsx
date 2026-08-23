import { zodResolver } from "@hookform/resolvers/zod"
import { Building2, Globe2, MapPin, Save } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import { SubmitButton } from "@/components/shared/buttons"
import { Form } from "@/components/ui/form"
import { applyApiValidationErrors } from "@/lib/forms"
import { showErrorToast } from "@/lib/toast"
import type { EmployerCompany, EmployerCompanyInput } from "../types/employerCompany.types"
import {
  employerCompanySchema,
  type EmployerCompanyFormValues,
} from "../validation/employerCompany.validation"
import CompanyLogoSection from "./CompanyLogoSection"
import CompanyCoverSection from "./CompanyCoverSection"

const normalizeOptional = (value: string | null | undefined): string | null => {
  if (value === null || value === undefined) return null
  const normalized = value.trim()
  return normalized === "" ? null : normalized
}

export default function EmployerCompanyForm({
  company,
  isPending,
  onSubmit,
  onLogoUpload,
  onLogoRemove,
  onCoverUpload,
  onCoverRemove,
  isLogoUploading,
  isCoverUploading,
}: {
  company: EmployerCompany
  isPending: boolean
  onSubmit: (input: EmployerCompanyInput) => Promise<unknown>
  onLogoUpload: (file: File) => void
  onLogoRemove: () => void
  onCoverUpload: (file: File) => void
  onCoverRemove: () => void
  isLogoUploading: boolean
  isCoverUploading: boolean
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

  const handleSubmit = async (values: EmployerCompanyFormValues) => {
    form.clearErrors()

    const input: EmployerCompanyInput = {
      name: values.name.trim(),
      industry: normalizeOptional(values.industry),
      website: normalizeOptional(values.website),
      location: normalizeOptional(values.location),
      description: normalizeOptional(values.description),
    }

    try {
      await onSubmit(input)
    } catch (error) {
      if (!applyApiValidationErrors(form.setError, error)) {
        showErrorToast(error, t("toasts.updateError"))
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <CompanyLogoSection
          logoUrl={company.logo_url}
          isUploading={isLogoUploading}
          onUpload={onLogoUpload}
          onRemove={onLogoRemove}
        />
        <CompanyCoverSection
          coverUrl={company.cover_image_url || company.cover_url}
          isUploading={isCoverUploading}
          onUpload={onCoverUpload}
          onRemove={onCoverRemove}
        />
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
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
    </div>
  )
}
