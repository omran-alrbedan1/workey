import type { EmploymentType, ExperienceLevel, JobWorkMode } from "../../types/employerJobs.types"
import type { EmployerJobFormValues } from "../../validation/employerJobs.validation"

export type WizardStepId = "basic" | "description" | "skills" | "additional" | "review"

export const employmentTypeOptions: { value: EmploymentType; label: string }[] = [
  { value: "full_time", label: "employmentTypes.full_time" },
  { value: "part_time", label: "employmentTypes.part_time" },
  { value: "contract", label: "employmentTypes.contract" },
  { value: "internship", label: "employmentTypes.internship" },
]

export const experienceLevelOptions: { value: ExperienceLevel; label: string }[] = [
  { value: "entry_level", label: "experienceLevels.entry_level" },
  { value: "junior", label: "experienceLevels.junior" },
  { value: "mid_level", label: "experienceLevels.mid_level" },
  { value: "senior", label: "experienceLevels.senior" },
]

export const workModeOptions: { value: JobWorkMode; label: string }[] = [
  { value: "remote", label: "workModes.remote" },
  { value: "on_site", label: "workModes.on_site" },
  { value: "hybrid", label: "workModes.hybrid" },
]

export const educationLevelOptions: { value: string; label: string }[] = [
  { value: "", label: "educationLevels.none" },
  { value: "high_school", label: "educationLevels.high_school" },
  { value: "diploma", label: "educationLevels.diploma" },
  { value: "bachelor", label: "educationLevels.bachelor" },
  { value: "master", label: "educationLevels.master" },
  { value: "doctorate", label: "educationLevels.doctorate" },
]

export const WIZARD_STEPS: {
  id: WizardStepId
  labelKey: string
  fields: (keyof EmployerJobFormValues)[]
}[] = [
  {
    id: "basic",
    labelKey: "wizard.steps.basic",
    fields: ["title", "employment_type", "work_mode", "location"],
  },
  {
    id: "description",
    labelKey: "wizard.steps.description",
    fields: ["description", "requirements"],
  },
  { id: "skills", labelKey: "wizard.steps.skills", fields: [] },
  { id: "additional", labelKey: "wizard.steps.additional", fields: [] },
  { id: "review", labelKey: "wizard.steps.review", fields: [] },
]

export const DRAFT_CORE_FIELDS: (keyof EmployerJobFormValues)[] = [
  "title",
  "description",
  "requirements",
  "location",
]

export const WEIGHTS = [1, 2, 3, 4, 5]
