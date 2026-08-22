import { zodResolver } from "@hookform/resolvers/zod"
import {
  Briefcase,
  Building2,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  ClipboardList,
  DollarSign,
  FileText,
  Gift,
  Globe,
  GraduationCap,
  ListChecks,
  Loader2,
  MapPin,
  Plus,
  Send,
  Sparkles,
  TrendingUp,
  X,
  type LucideIcon,
} from "lucide-react"
import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import { Form } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { useCreateEmployerJob } from "../hooks/useCreateEmployerJob"
import { useEmployerSkills } from "../hooks/useEmployerSkills"
import type {
  EducationLevel,
  EmployerJobInput,
  EmploymentType,
  ExperienceLevel,
  JobSkillAssignmentInput,
  JobWorkMode,
} from "../types/employerJobs.types"
import {
  employerJobSchema,
  type EmployerJobFormValues,
} from "../validations/employerJobs.validation"

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

type WizardStepId = "basic" | "description" | "skills" | "additional" | "review"

const WIZARD_STEPS: { id: WizardStepId; labelKey: string; fields: (keyof EmployerJobFormValues)[] }[] = [
  { id: "basic", labelKey: "wizard.steps.basic", fields: ["title", "employment_type", "work_mode", "location"] },
  { id: "description", labelKey: "wizard.steps.description", fields: ["description", "requirements"] },
  { id: "skills", labelKey: "wizard.steps.skills", fields: [] },
  { id: "additional", labelKey: "wizard.steps.additional", fields: [] },
  { id: "review", labelKey: "wizard.steps.review", fields: [] },
]

const WEIGHTS = [1, 2, 3, 4, 5]

function WizardSkillPicker({
  titleKey,
  groupLabel,
  choices,
  isLoading,
  loadFailed,
  selected,
  takenIds,
  isPending,
  onAdd,
  onRemove,
  onWeightChange,
}: {
  titleKey: string
  groupLabel: string
  choices: { id: string | number; name?: string }[]
  isLoading: boolean
  loadFailed: boolean
  selected: JobSkillAssignmentInput[]
  takenIds?: Array<string | number>
  isPending: boolean
  onAdd: (skill: { id: string | number; name?: string }) => void
  onRemove: (skillId: string | number) => void
  onWeightChange: (skillId: string | number, weight: number) => void
}) {
  const { t } = useTranslation("employerJobs")
  const selectedIds = new Set(selected.map((item) => String(item.skill_id)))
  // Skills picked in the other group cannot belong to this one as well.
  const takenElsewhere = new Set((takenIds ?? []).map((id) => String(id)))
  const available = choices.filter(
    (skill) => !selectedIds.has(String(skill.id)) && !takenElsewhere.has(String(skill.id)),
  )

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <h3 className="font-semibold text-text-primary">{t(titleKey)}</h3>
      <div className="overflow-hidden rounded-md border border-border">
        <Command>
          <CommandInput placeholder={t("skills.searchPlaceholder")} disabled={isLoading} />
          <CommandList>
            <CommandEmpty>
              {isLoading ? t("skills.loading") : loadFailed ? t("skills.loadError") : t("skills.noResults")}
            </CommandEmpty>
            <CommandGroup>
              {available.map((skill) => (
                <CommandItem
                  key={skill.id}
                  value={`${skill.name ?? ""} ${skill.id}`}
                  onSelect={() => onAdd(skill)}
                >
                  <Plus />
                  <span>{skill.name || `#${skill.id}`}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
      {selected.length === 0 ? (
        <p className="text-sm text-text-muted">{t("wizard.selectedEmpty", { group: t(groupLabel) })}</p>
      ) : (
        <ul className="space-y-2">
          {selected.map((item) => {
            const meta = choices.find((choice) => String(choice.id) === String(item.skill_id))
            return (
              <li
                key={String(item.skill_id)}
                className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border bg-background px-3 py-2"
              >
                <span className="text-sm font-medium text-text-primary">
                  {meta?.name || `#${item.skill_id}`}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-muted">{t("wizard.weightLabel")}</span>
                  <div className="flex items-center gap-1">
                    {WEIGHTS.map((weight) => (
                      <button
                        key={weight}
                        type="button"
                        disabled={isPending}
                        aria-label={`${t("wizard.weightLabel")} ${weight}`}
                        aria-pressed={item.weight === weight}
                        onClick={() => onWeightChange(item.skill_id, weight)}
                        className={cn(
                          "h-7 w-7 rounded-md border border-border text-xs font-medium transition-colors",
                          item.weight === weight
                            ? "bg-primary text-white"
                            : "bg-background hover:bg-muted",
                          isPending && "opacity-50",
                        )}
                      >
                        {weight}
                      </button>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={isPending}
                    aria-label={t("skills.detachLabel", { name: meta?.name || item.skill_id })}
                    onClick={() => onRemove(item.skill_id)}
                    className="h-7 w-7 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default function EmployerCreateJobWizard() {
  const { t } = useTranslation("employerJobs")
  const createJob = useCreateEmployerJob()
  const skillsQuery = useEmployerSkills()
  const [currentStep, setCurrentStep] = useState(0)
  const [requiredSkills, setRequiredSkills] = useState<JobSkillAssignmentInput[]>([])
  const [niceToHaveSkills, setNiceToHaveSkills] = useState<JobSkillAssignmentInput[]>([])

  const form = useForm<EmployerJobFormValues>({
    resolver: zodResolver(employerJobSchema) as Resolver<EmployerJobFormValues>,
    mode: "onTouched",
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

  const values = form.watch()
  const workMode = form.watch("work_mode")

  useEffect(() => {
    if (workMode !== "remote") return
    if (!form.getValues("location")) return
    form.setValue("location", "")
    form.clearErrors("location")
  }, [workMode, form])

  const catalogSkills = useMemo(
    () =>
      (skillsQuery.data?.items ?? []).map((skill) => ({
        id: skill.id,
        name: skill.name,
      })),
    [skillsQuery.data],
  )

  const addSkill = (
    setter: Dispatch<SetStateAction<JobSkillAssignmentInput[]>>,
    skill: { id: string | number },
  ) => {
    setter((current) =>
      current.some((item) => String(item.skill_id) === String(skill.id))
        ? current
        : [...current, { skill_id: skill.id, weight: 3 }],
    )
  }

  const removeSkill = (
    setter: Dispatch<SetStateAction<JobSkillAssignmentInput[]>>,
    skillId: string | number,
  ) => {
    setter((current) => current.filter((item) => String(item.skill_id) !== String(skillId)))
  }

  const changeSkillWeight = (
    setter: Dispatch<SetStateAction<JobSkillAssignmentInput[]>>,
    skillId: string | number,
    weight: number,
  ) => {
    setter((current) =>
      current.map((item) => (String(item.skill_id) === String(skillId) ? { ...item, weight } : item)),
    )
  }

  const buildInput = (raw: EmployerJobFormValues): EmployerJobInput => {
    const salaryMin = typeof raw.salary_min === "number" && Number.isFinite(raw.salary_min) ? raw.salary_min : null
    const salaryMax = typeof raw.salary_max === "number" && Number.isFinite(raw.salary_max) ? raw.salary_max : null
    return {
      title: raw.title.trim(),
      description: raw.description.trim(),
      department: raw.department?.trim() || null,
      responsibilities: raw.responsibilities?.trim() || null,
      benefits: raw.benefits?.trim() || null,
      requirements: raw.requirements.trim(),
      employment_type: raw.employment_type,
      experience_level: raw.experience_level,
      education_level: raw.education_level?.trim() || null,
      work_mode: raw.work_mode,
      location: raw.work_mode === "remote" ? null : raw.location?.trim() || null,
      application_deadline: raw.application_deadline || null,
      salary_min: salaryMin,
      salary_max: salaryMax,
    }
  }

  const buildPayload = (raw: EmployerJobFormValues, shouldPublish: boolean) => {
    // A skill may only appear in one group per request; keep the payload valid
    // even if state ever drifts out of sync.
    const requiredIds = new Set(requiredSkills.map((skill) => String(skill.skill_id)))
    const safeNiceToHave = niceToHaveSkills.filter(
      (skill) => !requiredIds.has(String(skill.skill_id)),
    )

    return {
      input: {
        ...buildInput(raw),
        ...(requiredSkills.length > 0 ? { required_skills: requiredSkills } : {}),
        ...(safeNiceToHave.length > 0 ? { nice_to_have_skills: safeNiceToHave } : {}),
      },
      shouldPublish,
    }
  }

  const goToStep = (index: number) => {
    if (createJob.isPending) return
    if (index <= currentStep) {
      setCurrentStep(index)
      return
    }
    void (async () => {
      const fields = WIZARD_STEPS.slice(currentStep, index).flatMap((step) => step.fields)
      const valid = fields.length === 0 ? true : await form.trigger(fields)
      if (valid) setCurrentStep(index)
    })()
  }

  const goNext = () => goToStep(currentStep + 1)

  const DRAFT_CORE_FIELDS: (keyof EmployerJobFormValues)[] = [
    "title",
    "description",
    "requirements",
    "location",
  ]

  const saveDraft = async () => {
    const valid = await form.trigger(DRAFT_CORE_FIELDS)
    if (!valid) return
    await createJob.mutateAsync(buildPayload(form.getValues(), false))
  }

  const publish = form.handleSubmit(async (parsed) => {
    await createJob.mutateAsync(buildPayload(parsed, true))
  })

  const publishReadiness = useMemo(() => {
    return employerJobSchema.safeParse(form.getValues()).success
  }, [form, values])

  const readinessChecks = useMemo(() => {
    const deadlineOk = (() => {
      if (!values.application_deadline) return true
      const deadline = new Date(values.application_deadline)
      const now = new Date()
      now.setHours(0, 0, 0, 0)
      deadline.setHours(0, 0, 0, 0)
      return deadline >= now
    })()
    const salaryOk =
      values.salary_min === undefined ||
      values.salary_min === null ||
      values.salary_max === undefined ||
      values.salary_max === null ||
      values.salary_max >= values.salary_min
    return [
      { key: "title", ok: values.title.trim().length > 0, required: true },
      { key: "description", ok: values.description.trim().length > 0, required: true },
      { key: "requirements", ok: values.requirements.trim().length > 0, required: true },
      {
        key: "workModeLocation",
        ok: workMode === "remote" ? true : Boolean(values.location?.trim()),
        required: true,
      },
      { key: "salaryRange", ok: salaryOk, required: false },
      { key: "deadline", ok: deadlineOk, required: false },
      { key: "requiredSkills", ok: requiredSkills.length > 0, required: false },
    ]
  }, [values, workMode, requiredSkills])

  const canPublish = publishReadiness && !createJob.isPending

  const enumLabel = (prefix: string, value?: string | null) =>
    value ? t(`${prefix}.${value}`) : t("wizard.summary.notProvided")

  const notProvided = t("wizard.summary.notProvided")

  const summarySections: {
    titleKey: string
    icon: LucideIcon
    rows: { label: string; value: string; icon: LucideIcon; multiline?: boolean }[]
  }[] = [
    {
      titleKey: "wizard.summary.sections.basic",
      icon: Briefcase,
      rows: [
        { label: t("fields.title"), value: values.title.trim() || notProvided, icon: Briefcase },
        {
          label: t("fields.department"),
          value: values.department?.trim() || notProvided,
          icon: Building2,
        },
        {
          label: t("fields.employmentType"),
          value: enumLabel("employmentTypes", values.employment_type),
          icon: Clock,
        },
        {
          label: t("fields.workMode"),
          value: enumLabel("workModes", values.work_mode),
          icon: Globe,
        },
        {
          label: t("fields.location"),
          value:
            values.work_mode === "remote"
              ? t("validation.locationOptionalForRemote")
              : values.location?.trim() || notProvided,
          icon: MapPin,
        },
      ],
    },
    {
      titleKey: "wizard.summary.sections.role",
      icon: FileText,
      rows: [
        {
          label: t("fields.description"),
          value: values.description.trim() || notProvided,
          icon: FileText,
          multiline: true,
        },
        {
          label: t("fields.requirements"),
          value: values.requirements.trim() || notProvided,
          icon: ListChecks,
          multiline: true,
        },
        {
          label: t("fields.responsibilities"),
          value: values.responsibilities?.trim() || notProvided,
          icon: ClipboardList,
          multiline: true,
        },
      ],
    },
    {
      titleKey: "wizard.summary.sections.qualifications",
      icon: GraduationCap,
      rows: [
        {
          label: t("fields.experienceLevel"),
          value: enumLabel("experienceLevels", values.experience_level),
          icon: TrendingUp,
        },
        {
          label: t("fields.educationLevel"),
          value: values.education_level
            ? enumLabel("educationLevels", values.education_level)
            : t("educationLevels.none"),
          icon: GraduationCap,
        },
        {
          label: t("skills.title"),
          value: t("wizard.summary.skillsCount", {
            count: requiredSkills.length,
            nice: niceToHaveSkills.length,
          }),
          icon: Sparkles,
        },
      ],
    },
    {
      titleKey: "wizard.summary.sections.compensation",
      icon: DollarSign,
      rows: [
        {
          label: `${t("fields.salaryMin")} – ${t("fields.salaryMax")}`,
          value:
            values.salary_min === undefined && values.salary_max === undefined
              ? notProvided
              : `${values.salary_min ?? "?"} – ${values.salary_max ?? "?"}`,
          icon: DollarSign,
        },
        {
          label: t("fields.applicationDeadline"),
          value: values.application_deadline || notProvided,
          icon: Calendar,
        },
        {
          label: t("fields.benefits"),
          value: values.benefits?.trim() || notProvided,
          icon: Gift,
          multiline: true,
        },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <nav aria-label={t("wizard.stepOf", { current: currentStep + 1, total: WIZARD_STEPS.length })}>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-3 rounded-lg border border-border bg-background-card p-4 shadow-card">
          {WIZARD_STEPS.map((step, index) => (
            <li key={step.id} className="flex items-center gap-2">
              <button
                type="button"
                disabled={index > currentStep || createJob.isPending}
                onClick={() => goToStep(index)}
                className="flex items-center gap-2 rounded-md px-1 py-0.5 disabled:cursor-not-allowed"
              >
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                    index < currentStep && "border-primary bg-primary text-white",
                    index === currentStep && "border-primary bg-background text-primary",
                    index > currentStep && "border-border bg-background text-text-muted",
                  )}
                >
                  {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
                </span>
                <span
                  className={cn(
                    "hidden text-sm sm:block",
                    index === currentStep ? "font-semibold text-text-primary" : "text-text-muted",
                  )}
                >
                  {t(step.labelKey)}
                </span>
              </button>
              {index < WIZARD_STEPS.length - 1 && <span className="hidden h-px w-8 bg-border sm:block" />}
            </li>
          ))}
        </ol>
      </nav>

      <Form {...form}>
        <form
          onSubmit={(event) => event.preventDefault()}
          className="space-y-5 rounded-lg border border-border bg-background-card p-5 shadow-card"
        >
          <p className="text-sm font-medium text-text-muted">
            {t("wizard.stepOf", { current: currentStep + 1, total: WIZARD_STEPS.length })}
          </p>

          {WIZARD_STEPS[currentStep].id === "basic" && (
            <section className="grid gap-5 md:grid-cols-2">
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
                options={employmentTypeOptions.map((opt) => ({ ...opt, label: t(opt.label) }))}
                leftIcon={Clock}
              />
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="work_mode"
                label={t("fields.workMode")}
                placeholder={t("fields.workMode")}
                options={workModeOptions.map((opt) => ({ ...opt, label: t(opt.label) }))}
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
            </section>
          )}

          {WIZARD_STEPS[currentStep].id === "description" && (
            <section className="grid gap-5">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="description"
                label={t("fields.description")}
                leftIcon={FileText}
              />
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="requirements"
                label={t("fields.requirements")}
                leftIcon={FileText}
              />
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="responsibilities"
                label={t("fields.responsibilities")}
                leftIcon={ListChecks}
              />
            </section>
          )}

          {WIZARD_STEPS[currentStep].id === "skills" && (
            <section className="space-y-4">
              <p className="text-sm text-text-muted">{t("wizard.skillsHint")}</p>
              <div className="grid gap-4 lg:grid-cols-2">
                <WizardSkillPicker
                  titleKey="wizard.sections.skillsTitle"
                  groupLabel="wizard.sections.skillsTitle"
                  choices={catalogSkills}
                  isLoading={skillsQuery.isLoading}
                  loadFailed={skillsQuery.isError}
                  selected={requiredSkills}
                  takenIds={niceToHaveSkills.map((skill) => skill.skill_id)}
                  isPending={createJob.isPending}
                  onAdd={(skill) => addSkill(setRequiredSkills, skill)}
                  onRemove={(skillId) => removeSkill(setRequiredSkills, skillId)}
                  onWeightChange={(skillId, weight) => changeSkillWeight(setRequiredSkills, skillId, weight)}
                />
                <WizardSkillPicker
                  titleKey="wizard.sections.niceToHaveTitle"
                  groupLabel="wizard.sections.niceToHaveTitle"
                  choices={catalogSkills}
                  isLoading={skillsQuery.isLoading}
                  loadFailed={skillsQuery.isError}
                  selected={niceToHaveSkills}
                  takenIds={requiredSkills.map((skill) => skill.skill_id)}
                  isPending={createJob.isPending}
                  onAdd={(skill) => addSkill(setNiceToHaveSkills, skill)}
                  onRemove={(skillId) => removeSkill(setNiceToHaveSkills, skillId)}
                  onWeightChange={(skillId, weight) => changeSkillWeight(setNiceToHaveSkills, skillId, weight)}
                />
              </div>
            </section>
          )}

          {WIZARD_STEPS[currentStep].id === "additional" && (
            <section className="grid gap-5 md:grid-cols-2">
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="experience_level"
                label={t("fields.experienceLevel")}
                placeholder={t("fields.experienceLevel")}
                options={experienceLevelOptions.map((opt) => ({ ...opt, label: t(opt.label) }))}
                leftIcon={TrendingUp}
              />
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="education_level"
                label={t("fields.educationLevel")}
                placeholder={t("fields.educationLevel")}
                options={educationLevelOptions.map((opt) => ({ value: opt.value, label: t(opt.label) }))}
                leftIcon={GraduationCap}
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
              <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="application_deadline"
                label={t("fields.applicationDeadline")}
                leftIcon={Calendar}
              />
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="benefits"
                label={t("fields.benefits")}
                leftIcon={Gift}
              />
            </section>
          )}

          {WIZARD_STEPS[currentStep].id === "review" && (
            <section className="space-y-6">
              <div className="rounded-lg border border-border p-4">
                <h3 className="mb-3 font-semibold text-text-primary">{t("wizard.readiness.title")}</h3>
                <p className="mb-3 text-sm text-text-muted">{t("wizard.readiness.subtitle")}</p>
                <ul className="space-y-2">
                  {readinessChecks.map((check) => (
                    <li key={check.key} className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 text-sm">
                        <span
                          className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                            check.ok ? "bg-green-600 text-white" : "bg-red-500 text-white",
                          )}
                        >
                          {check.ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        </span>
                        <span className="text-text-primary">{t(`wizard.readiness.items.${check.key}`)}</span>
                      </span>
                      <Badge variant="secondary" className="shrink-0 text-white">
                        {check.required
                          ? t("wizard.readiness.requiredTag")
                          : t("wizard.readiness.optionalTag")}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-border p-4">
                <h3 className="mb-4 flex items-center gap-2.5 font-semibold text-text-primary">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-4 w-4" />
                  </span>
                  {t("wizard.summary.title")}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                  {summarySections.map((section) => (
                    <div
                      key={section.titleKey}
                      className="rounded-lg border border-border bg-background p-3 shadow-sm sm:p-4"
                    >
                      <div className="mb-2.5 flex items-center gap-2 border-b border-border pb-2 sm:mb-3 sm:gap-2.5 sm:pb-2.5">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary sm:h-7 sm:w-7">
                          <section.icon className="h-3.5 w-3.5" />
                        </span>
                        <h4 className="text-xs font-semibold text-text-primary sm:text-sm">
                          {t(section.titleKey)}
                        </h4>
                      </div>
                      <dl className="space-y-2.5 sm:space-y-3">
                        {section.rows.map((row) => (
                          <div key={row.label} className="flex items-start gap-2 sm:gap-2.5">
                            <row.icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-muted" />
                            <div className="min-w-0 flex-1">
                              <dt className="text-[11px] uppercase tracking-wide text-text-muted sm:text-xs">
                                {row.label}
                              </dt>
                              <dd
                                className={cn(
                                  "break-words text-xs text-text-primary sm:text-sm",
                                  row.multiline ? "whitespace-pre-line" : "line-clamp-2 sm:line-clamp-none sm:truncate",
                                )}
                                title={row.multiline ? undefined : row.value}
                              >
                                {row.value}
                              </dd>
                            </div>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={currentStep === 0 || createJob.isPending}
              onClick={() => goToStep(currentStep - 1)}
            >
              <ChevronLeft className="rtl:rotate-180" /> {t("wizard.back")}
            </Button>
            <div className="flex flex-wrap items-center justify-end gap-2">
              {currentStep < WIZARD_STEPS.length - 1 && (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    className="text-white"
                    disabled={createJob.isPending}
                    onClick={() => void saveDraft()}
                  >
                    {createJob.isPending ? <Loader2 className="animate-spin" /> : null}
                    {createJob.isPending ? t("wizard.savingDraft") : t("wizard.saveDraft")}
                  </Button>
                  <Button type="button" disabled={createJob.isPending} onClick={goNext} className="text-white">
                    {t("wizard.next")} <ChevronRight className="rtl:rotate-180" />
                  </Button>
                </>
              )}
              {currentStep === WIZARD_STEPS.length - 1 && (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    className="text-white"
                    disabled={createJob.isPending}
                    onClick={() => void saveDraft()}
                  >
                    {createJob.isPending ? <Loader2 className="animate-spin" /> : null}
                    {createJob.isPending ? t("wizard.savingDraft") : t("wizard.saveDraft")}
                  </Button>
                  <Button type="button" disabled={!canPublish} onClick={() => void publish()} className="text-white">
                    {createJob.isPending ? <Loader2 className="animate-spin" /> : <Send className="rtl:rotate-180" />}
                    {createJob.isPending ? t("wizard.publishing") : t("wizard.publish")}
                  </Button>
                </>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
