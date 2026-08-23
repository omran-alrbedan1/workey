import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useCreateEmployerJob } from "./useCreateEmployerJob"
import { useEmployerSkills } from "./useEmployerSkills"
import type { EmploymentType, ExperienceLevel, JobSkillAssignmentInput, JobWorkMode } from "../types/employerJobs.types"
import { employerJobSchema, type EmployerJobFormValues } from "../validation/employerJobs.validation"
import {
  buildCreateEmployerJobPayload,
  buildWizardReadinessChecks,
  buildWizardSummarySections,
} from "../utils/createJobWizard"
import { DRAFT_CORE_FIELDS, WIZARD_STEPS } from "../components/create-job-wizard/wizardConfig"

export function useEmployerCreateJobWizard() {
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
      education_level: "",
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
  }, [form, workMode])

  const catalogSkills = useMemo(
    () =>
      (skillsQuery.data?.items ?? []).map((skill) => ({
        id: skill.id,
        name: skill.name,
      })),
    [skillsQuery.data],
  )

  const mutateSkillGroup = (
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
      current.map((item) =>
        String(item.skill_id) === String(skillId) ? { ...item, weight } : item,
      ),
    )
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

  const saveDraft = async () => {
    const valid = await form.trigger(DRAFT_CORE_FIELDS)
    if (!valid) return
    await createJob.mutateAsync(
      buildCreateEmployerJobPayload(form.getValues(), requiredSkills, niceToHaveSkills, false),
    )
  }

  const publish = form.handleSubmit(async (parsed) => {
    await createJob.mutateAsync(
      buildCreateEmployerJobPayload(parsed, requiredSkills, niceToHaveSkills, true),
    )
  })

  const publishReadiness = useMemo(() => employerJobSchema.safeParse(form.getValues()).success, [form, values])

  const readinessChecks = useMemo(
    () => buildWizardReadinessChecks(values, workMode, requiredSkills),
    [requiredSkills, values, workMode],
  )

  const summarySections = useMemo(
    () =>
      buildWizardSummarySections({
        t,
        values,
        requiredSkills,
        niceToHaveSkills,
      }),
    [niceToHaveSkills, requiredSkills, t, values],
  )

  return {
    form,
    values,
    workMode,
    currentStep,
    requiredSkills,
    niceToHaveSkills,
    catalogSkills,
    createJob,
    skillsQuery,
    readinessChecks,
    summarySections,
    canPublish: publishReadiness && !createJob.isPending,
    setCurrentStep,
    setRequiredSkills,
    setNiceToHaveSkills,
    goToStep,
    goNext: () => goToStep(currentStep + 1),
    saveDraft,
    publish,
    addRequiredSkill: (skill: { id: string | number }) => mutateSkillGroup(setRequiredSkills, skill),
    addNiceToHaveSkill: (skill: { id: string | number }) =>
      mutateSkillGroup(setNiceToHaveSkills, skill),
    removeRequiredSkill: (skillId: string | number) => removeSkill(setRequiredSkills, skillId),
    removeNiceToHaveSkill: (skillId: string | number) =>
      removeSkill(setNiceToHaveSkills, skillId),
    changeRequiredSkillWeight: (skillId: string | number, weight: number) =>
      changeSkillWeight(setRequiredSkills, skillId, weight),
    changeNiceToHaveSkillWeight: (skillId: string | number, weight: number) =>
      changeSkillWeight(setNiceToHaveSkills, skillId, weight),
  }
}
