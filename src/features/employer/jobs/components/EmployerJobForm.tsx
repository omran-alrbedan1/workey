import { zodResolver } from "@hookform/resolvers/zod"
import {
  Briefcase,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Gift,
  GraduationCap,
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
import type {
  EmployerJobInput,
  EmploymentType,
  ExperienceLevel,
  EducationLevel,
  JobWorkMode,
} from "../types/employerJobs.types"
import {
  employerJobSchema,
  type EmployerJobFormValues,
} from "../validation/employerJobs.validation"

const employmentTypeOptions: { value: EmploymentType; label: string }[] = [
  { value: "full_time", label: "employmentTypes.full_time" },
  { value: "part_time", label: "employmentTypes.part_time" },
  { value: "contract", label: "employmentTypes.contract" },
  { value: "internship", label: "employmentTypes.internship" },
]

const experienceLevelOptions: { value: ExperienceLevel; label: string }[] = [
  { value: "entry_level", label: "experienceLevels.entry_level" },
  { value: "junior", label: "experienceLevels.junior" },
  { value: "mid_level", label: "experienceLevels.mid_level" },
  { value: "senior", label: "experienceLevels.senior" },
]

const workModeOptions: { value: JobWorkMode; label: string }[] = [
  { value: "remote", label: "workModes.remote" },
  { value: "on_site", label: "workModes.on_site" },
  { value: "hybrid", label: "workModes.hybrid" },
]

const educationLevelOptions: { value: string; label: string }[] = [
  { value: "", label: "educationLevels.none" },
  { value: "high_school", label: "educationLevels.high_school" },
  { value: "diploma", label: "educationLevels.diploma" },
  { value: "bachelor", label: "educationLevels.bachelor" },
  { value: "master", label: "educationLevels.master" },
  { value: "doctorate", label: "educationLevels.doctorate" },
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
      employment_type: "full_time" as EmploymentType,
      experience_level: "entry_level" as ExperienceLevel,
      education_level: "" as EducationLevel,
      work_mode: "remote" as JobWorkMode,
      location: "",
      application_deadline: null,
      salary_min: undefined,
      salary_max: undefined,
    },
  })

  useEffect(() => {
    if (initialValues) {
      form.reset({
        title: initialValues.title,
        description: initialValues.description,
        department: initialValues.department ?? "",
        responsibilities: initialValues.responsibilities ?? "",
        benefits: initialValues.benefits ?? "",
        requirements: initialValues.requirements,
        employment_type: initialValues.employment_type,
        experience_level: initialValues.experience_level,
        education_level: initialValues.education_level ?? "",
        work_mode: initialValues.work_mode,
        location: initialValues.location ?? "",
        application_deadline: initialValues.application_deadline ?? null,
        salary_min: initialValues.salary_min ?? undefined,
        salary_max: initialValues.salary_max ?? undefined,
      })
    }
  }, [form, initialValues])

  const workMode = form.watch("work_mode")

  useEffect(() => {
    if (workMode !== "remote") return
    if (!form.getValues("location")) return
    form.setValue("location", "")
    form.clearErrors("location")
  }, [workMode, form])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          const normalized: EmployerJobInput = {
            title: values.title,
            description: values.description,
            department: values.department?.trim() || null,
            responsibilities: values.responsibilities?.trim() || null,
            benefits: values.benefits?.trim() || null,
            requirements: values.requirements,
            employment_type: values.employment_type,
            experience_level: values.experience_level,
            education_level: values.education_level?.trim() || null,
            work_mode: values.work_mode,
            location: values.work_mode === "remote" ? null : values.location?.trim() || null,
            application_deadline: values.application_deadline || null,
            salary_min: values.salary_min ?? null,
            salary_max: values.salary_max ?? null,
          }
          await onSubmit(normalized)
        })}
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
          name="education_level"
          label={t("fields.educationLevel")}
          placeholder={t("fields.educationLevel")}
          options={educationLevelOptions.map((opt) => ({
            value: opt.value,
            label: opt.value === null ? t(opt.label) : t(opt.label),
          }))}
          leftIcon={GraduationCap}
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
        {workMode !== "remote" && (
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="location"
            label={t("fields.location")}
            leftIcon={MapPin}
          />
        )}
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
