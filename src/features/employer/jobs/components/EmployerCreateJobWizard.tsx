import {
  Briefcase,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  FileText,
  Gift,
  GraduationCap,
  ListChecks,
  Loader2,
  MapPin,
  Send,
  TrendingUp,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useEmployerCreateJobWizard } from "../hooks/useEmployerCreateJobWizard"
import WizardReviewStep from "./create-job-wizard/WizardReviewStep"
import WizardSkillPicker from "./create-job-wizard/WizardSkillPicker"
import WizardStepIndicator from "./create-job-wizard/WizardStepIndicator"
import {
  educationLevelOptions,
  employmentTypeOptions,
  experienceLevelOptions,
  WIZARD_STEPS,
  workModeOptions,
} from "./create-job-wizard/wizardConfig"

export default function EmployerCreateJobWizard() {
  const { t } = useTranslation("employerJobs")
  const wizard = useEmployerCreateJobWizard()

  return (
    <div className="space-y-6">
      <WizardStepIndicator
        currentStep={wizard.currentStep}
        isPending={wizard.createJob.isPending}
        onGoToStep={wizard.goToStep}
      />

      <Form {...wizard.form}>
        <form
          onSubmit={(event) => event.preventDefault()}
          className="space-y-5 rounded-lg border border-border bg-background-card p-5 shadow-card"
        >
          <p className="text-sm font-medium text-text-muted">
            {t("wizard.stepOf", {
              current: wizard.currentStep + 1,
              total: WIZARD_STEPS.length,
            })}
          </p>

          {WIZARD_STEPS[wizard.currentStep].id === "basic" && (
            <section className="grid gap-5 md:grid-cols-2">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={wizard.form.control}
                name="title"
                label={t("fields.title")}
                leftIcon={Briefcase}
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={wizard.form.control}
                name="department"
                label={t("fields.department")}
                leftIcon={Building2}
              />
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={wizard.form.control}
                name="employment_type"
                label={t("fields.employmentType")}
                placeholder={t("fields.employmentType")}
                options={employmentTypeOptions.map((opt) => ({ ...opt, label: t(opt.label) }))}
                leftIcon={Clock}
              />
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={wizard.form.control}
                name="work_mode"
                label={t("fields.workMode")}
                placeholder={t("fields.workMode")}
                options={workModeOptions.map((opt) => ({ ...opt, label: t(opt.label) }))}
                leftIcon={MapPin}
              />
              {wizard.workMode !== "remote" && (
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={wizard.form.control}
                  name="location"
                  label={t("fields.location")}
                  leftIcon={MapPin}
                />
              )}
            </section>
          )}

          {WIZARD_STEPS[wizard.currentStep].id === "description" && (
            <section className="grid gap-5">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={wizard.form.control}
                name="description"
                label={t("fields.description")}
                leftIcon={FileText}
              />
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={wizard.form.control}
                name="requirements"
                label={t("fields.requirements")}
                leftIcon={FileText}
              />
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={wizard.form.control}
                name="responsibilities"
                label={t("fields.responsibilities")}
                leftIcon={ListChecks}
              />
            </section>
          )}

          {WIZARD_STEPS[wizard.currentStep].id === "skills" && (
            <section className="space-y-4">
              <p className="text-sm text-text-muted">{t("wizard.skillsHint")}</p>
              <div className="grid gap-4 lg:grid-cols-2">
                <WizardSkillPicker
                  titleKey="wizard.sections.skillsTitle"
                  groupLabel="wizard.sections.skillsTitle"
                  choices={wizard.catalogSkills}
                  isLoading={wizard.skillsQuery.isLoading}
                  loadFailed={wizard.skillsQuery.isError}
                  selected={wizard.requiredSkills}
                  takenIds={wizard.niceToHaveSkills.map((skill) => skill.skill_id)}
                  isPending={wizard.createJob.isPending}
                  onAdd={wizard.addRequiredSkill}
                  onRemove={wizard.removeRequiredSkill}
                  onWeightChange={wizard.changeRequiredSkillWeight}
                />
                <WizardSkillPicker
                  titleKey="wizard.sections.niceToHaveTitle"
                  groupLabel="wizard.sections.niceToHaveTitle"
                  choices={wizard.catalogSkills}
                  isLoading={wizard.skillsQuery.isLoading}
                  loadFailed={wizard.skillsQuery.isError}
                  selected={wizard.niceToHaveSkills}
                  takenIds={wizard.requiredSkills.map((skill) => skill.skill_id)}
                  isPending={wizard.createJob.isPending}
                  onAdd={wizard.addNiceToHaveSkill}
                  onRemove={wizard.removeNiceToHaveSkill}
                  onWeightChange={wizard.changeNiceToHaveSkillWeight}
                />
              </div>
            </section>
          )}

          {WIZARD_STEPS[wizard.currentStep].id === "additional" && (
            <section className="grid gap-5 md:grid-cols-2">
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={wizard.form.control}
                name="experience_level"
                label={t("fields.experienceLevel")}
                placeholder={t("fields.experienceLevel")}
                options={experienceLevelOptions.map((opt) => ({ ...opt, label: t(opt.label) }))}
                leftIcon={TrendingUp}
              />
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={wizard.form.control}
                name="education_level"
                label={t("fields.educationLevel")}
                placeholder={t("fields.educationLevel")}
                options={educationLevelOptions.map((opt) => ({
                  value: opt.value,
                  label: t(opt.label),
                }))}
                leftIcon={GraduationCap}
              />
              <CustomFormField
                fieldType={FormFieldType.NUMBER}
                control={wizard.form.control}
                name="salary_min"
                label={t("fields.salaryMin")}
                leftIcon={DollarSign}
              />
              <CustomFormField
                fieldType={FormFieldType.NUMBER}
                control={wizard.form.control}
                name="salary_max"
                label={t("fields.salaryMax")}
                leftIcon={DollarSign}
              />
              <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={wizard.form.control}
                name="application_deadline"
                label={t("fields.applicationDeadline")}
                leftIcon={Calendar}
              />
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={wizard.form.control}
                name="benefits"
                label={t("fields.benefits")}
                leftIcon={Gift}
              />
            </section>
          )}

          {WIZARD_STEPS[wizard.currentStep].id === "review" && (
            <WizardReviewStep
              t={t}
              readinessChecks={wizard.readinessChecks}
              summarySections={wizard.summarySections}
            />
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={wizard.currentStep === 0 || wizard.createJob.isPending}
              onClick={() => wizard.goToStep(wizard.currentStep - 1)}
            >
              <ChevronLeft className="rtl:rotate-180" /> {t("wizard.back")}
            </Button>
            <div className="flex flex-wrap items-center justify-end gap-2">
              {wizard.currentStep < WIZARD_STEPS.length - 1 && (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    className="text-white"
                    disabled={wizard.createJob.isPending}
                    onClick={() => void wizard.saveDraft()}
                  >
                    {wizard.createJob.isPending ? <Loader2 className="animate-spin" /> : null}
                    {wizard.createJob.isPending ? t("wizard.savingDraft") : t("wizard.saveDraft")}
                  </Button>
                  <Button
                    type="button"
                    disabled={wizard.createJob.isPending}
                    onClick={wizard.goNext}
                    className="text-white"
                  >
                    {t("wizard.next")} <ChevronRight className="rtl:rotate-180" />
                  </Button>
                </>
              )}
              {wizard.currentStep === WIZARD_STEPS.length - 1 && (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    className="text-white"
                    disabled={wizard.createJob.isPending}
                    onClick={() => void wizard.saveDraft()}
                  >
                    {wizard.createJob.isPending ? <Loader2 className="animate-spin" /> : null}
                    {wizard.createJob.isPending ? t("wizard.savingDraft") : t("wizard.saveDraft")}
                  </Button>
                  <Button
                    type="button"
                    disabled={!wizard.canPublish}
                    onClick={() => void wizard.publish()}
                    className="text-white"
                  >
                    {wizard.createJob.isPending ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Send className="rtl:rotate-180" />
                    )}
                    {wizard.createJob.isPending ? t("wizard.publishing") : t("wizard.publish")}
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
