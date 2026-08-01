import { zodResolver } from "@hookform/resolvers/zod"
import {
  Briefcase,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Gift,
  ListChecks,
  MapPin,
  Save,
  TrendingUp,
} from "lucide-react"
import { useEffect } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { useTranslation } from "react-i18next"
import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import { SubmitButton } from "@/components/shared/buttons"
import { Form } from "@/components/ui/form"
import type { EmployerJobInput } from "../types/employerJobs.types"
import {
  employerJobSchema,
  type EmployerJobFormValues,
} from "../validations/employerJobs.validation"
import type { Option } from "@/types/customFormField.types"

const employmentTypeOptions: Option[] = [
  { value: "full_time", label: "employmentTypes.full_time" },
  { value: "part_time", label: "employmentTypes.part_time" },
  { value: "contract", label: "employmentTypes.contract" },
  { value: "freelance", label: "employmentTypes.freelance" },
]

const experienceLevelOptions: Option[] = [
  { value: "junior", label: "experienceLevels.junior" },
  { value: "mid", label: "experienceLevels.mid" },
  { value: "senior", label: "experienceLevels.senior" },
  { value: "lead", label: "experienceLevels.lead" },
]

const workModeOptions: Option[] = [
  { value: "remote", label: "workModes.remote" },
  { value: "on_site", label: "workModes.on_site" },
  { value: "hybrid", label: "workModes.hybrid" },
]

export default function EmployerJobForm({
  isPending,
  onSubmit,
  initialValues,
  submitText,
  pendingText,
}: {
  isPending: boolean
  onSubmit: (input: EmployerJobInput) => Promise<unknown>
  initialValues?: EmployerJobInput
  submitText?: string
  pendingText?: string
}) {
  const { t } = useTranslation("employerJobs")
  const form = useForm<EmployerJobFormValues>({
    resolver: zodResolver(employerJobSchema) as Resolver<EmployerJobFormValues>,
    defaultValues: {
      title: "",
      description: "",
      department: "",
      responsibilities: "",
      benefits: "",
      requirements: "",
      employment_type: "",
      experience_level: "",
      work_mode: "remote",
      location: "",
      application_deadline: "",
      salary_min: undefined,
      salary_max: undefined,
    },
  })

  useEffect(() => {
    if (initialValues) form.reset(initialValues)
  }, [form, initialValues])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => onSubmit(values))}
        className="grid gap-5 rounded-lg border border-border bg-background-card p-5 shadow-card md:grid-cols-2"
      >
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="title"
          label={t("fields.title")}
          leftIcon={Briefcase}
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="department"
          label={t("fields.department")}
          leftIcon={Building2}
        />
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="employment_type"
          label={t("fields.employmentType")}
          placeholder={t("fields.employmentType")}
          options={employmentTypeOptions.map((opt) => ({
            ...opt,
            label: t(opt.label),
          }))}
          leftIcon={Clock}
        />
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="experience_level"
          label={t("fields.experienceLevel")}
          placeholder={t("fields.experienceLevel")}
          options={experienceLevelOptions.map((opt) => ({
            ...opt,
            label: t(opt.label),
          }))}
          leftIcon={TrendingUp}
        />
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="work_mode"
          label={t("fields.workMode")}
          placeholder={t("fields.workMode")}
          options={workModeOptions.map((opt) => ({
            ...opt,
            label: t(opt.label),
          }))}
          leftIcon={MapPin}
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="location"
          label={t("fields.location")}
          leftIcon={MapPin}
        />
        <CustomFormField
          fieldType={FormFieldType.DATE_PICKER}
          control={form.control}
          name="application_deadline"
          label={t("fields.applicationDeadline")}
          leftIcon={Calendar}
        />
        <CustomFormField
          fieldType={FormFieldType.NUMBER}
          control={form.control}
          name="salary_min"
          label={t("fields.salaryMin")}
          leftIcon={DollarSign}
        />
        <CustomFormField
          fieldType={FormFieldType.NUMBER}
          control={form.control}
          name="salary_max"
          label={t("fields.salaryMax")}
          leftIcon={DollarSign}
        />
        <div className="md:col-span-2">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="description"
            label={t("fields.description")}
            leftIcon={FileText}
          />
        </div>
        <div className="md:col-span-2">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="responsibilities"
            label={t("fields.responsibilities")}
            leftIcon={ListChecks}
          />
        </div>
        <div className="md:col-span-2">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="benefits"
            label={t("fields.benefits")}
            leftIcon={Gift}
          />
        </div>
        <div className="md:col-span-2">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="requirements"
            label={t("fields.requirements")}
            leftIcon={FileText}
          />
        </div>
        <div className="md:col-span-2 md:justify-self-end">
          <SubmitButton
            isLoading={isPending}
            text={submitText ?? t("actions.create")}
            loadingText={pendingText ?? t("actions.creating")}
            icon={<Save className="h-4 w-4" />}
          />
        </div>
      </form>
    </Form>
  )
}
