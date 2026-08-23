import type { TFunction } from "i18next"
import {
  Briefcase,
  Building2,
  Calendar,
  Clock,
  ClipboardList,
  DollarSign,
  FileText,
  Gift,
  Globe,
  GraduationCap,
  ListChecks,
  MapPin,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react"
import type {
  EmployerJobInput,
  EmployerJobSkillsInput,
  JobSkillAssignmentInput,
  JobWorkMode,
} from "../types/employerJobs.types"
import type { EmployerJobFormValues } from "../validation/employerJobs.validation"

export function buildEmployerJobInput(raw: EmployerJobFormValues): EmployerJobInput {
  const salaryMin =
    typeof raw.salary_min === "number" && Number.isFinite(raw.salary_min) ? raw.salary_min : null
  const salaryMax =
    typeof raw.salary_max === "number" && Number.isFinite(raw.salary_max) ? raw.salary_max : null

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

export function buildCreateEmployerJobPayload(
  raw: EmployerJobFormValues,
  requiredSkills: JobSkillAssignmentInput[],
  niceToHaveSkills: JobSkillAssignmentInput[],
  shouldPublish: boolean,
) {
  const requiredIds = new Set(requiredSkills.map((skill) => String(skill.skill_id)))
  const safeNiceToHave = niceToHaveSkills.filter(
    (skill) => !requiredIds.has(String(skill.skill_id)),
  )

  return {
    input: {
      ...buildEmployerJobInput(raw),
      ...(requiredSkills.length > 0 ? { required_skills: requiredSkills } : {}),
      ...(safeNiceToHave.length > 0 ? { nice_to_have_skills: safeNiceToHave } : {}),
    } satisfies EmployerJobInput & EmployerJobSkillsInput,
    shouldPublish,
  }
}

export function buildWizardReadinessChecks(
  values: EmployerJobFormValues,
  workMode: JobWorkMode,
  requiredSkills: JobSkillAssignmentInput[],
) {
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
}

export function buildWizardSummarySections({
  t,
  values,
  requiredSkills,
  niceToHaveSkills,
}: {
  t: TFunction<"employerJobs", undefined>
  values: EmployerJobFormValues
  requiredSkills: JobSkillAssignmentInput[]
  niceToHaveSkills: JobSkillAssignmentInput[]
}) {
  const notProvided = t("wizard.summary.notProvided")
  const enumLabel = (prefix: string, value?: string | null) =>
    value ? t(`${prefix}.${value}`) : notProvided

  return [
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
  ] satisfies {
    titleKey: string
    icon: LucideIcon
    rows: { label: string; value: string; icon: LucideIcon; multiline?: boolean }[]
  }[]
}
