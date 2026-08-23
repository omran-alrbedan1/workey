import { ChevronLeft, ChevronRight, Clock, FileText, Info, ListChecks, Loader2, Save, Target, ToggleRight } from "lucide-react"
import { useTranslation } from "react-i18next"
import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import QuestionsManager from "./QuestionsManager"
import EmployerTestReviewStep from "./test-form/EmployerTestReviewStep"
import EmployerTestStepIndicator from "./test-form/EmployerTestStepIndicator"
import { useEmployerTestForm } from "../hooks/useEmployerTestForm"
import type { EmployerTest, EmployerTestInput } from "../types/employerTests.types"
import { TEST_FORM_TOTAL_STEPS } from "../utils/employerTestForm"

export default function EmployerTestForm({
  test,
  onSubmit,
  onComplete,
  isPending,
}: {
  test?: EmployerTest | null
  onSubmit: (input: EmployerTestInput) => Promise<unknown>
  onComplete?: () => void
  isPending: boolean
}) {
  const { t } = useTranslation("employerTests")
  const {
    form,
    questions,
    currentStep,
    createdTestId,
    calculatedMaxScore,
    setQuestions,
    handleNext,
    handleBack,
    goToStep,
    handleFinalSubmit,
  } = useEmployerTestForm({ test, onSubmit, onComplete })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {test ? t("editTitle") : t("createTitle")}
        </CardTitle>
        <CardDescription>{test ? t("editDescription") : t("createDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="grid gap-6 sm:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
            <EmployerTestStepIndicator currentStep={currentStep} onStepSelect={goToStep} />

            {currentStep === 1 && (
              <>
                <div className="sm:col-span-2">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="title"
                    label={t("form.title")}
                    leftIcon={FileText}
                  />
                </div>
                <div className="sm:col-span-2">
                  <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="description"
                    label={t("form.description")}
                    leftIcon={Info}
                  />
                </div>
              </>
            )}

            {currentStep === 2 && (
              <div className="sm:col-span-2">
                <QuestionsManager
                  questions={questions}
                  onChange={setQuestions}
                  testId={createdTestId}
                  validationErrors={form.formState.errors.questions}
                />
              </div>
            )}

            {currentStep === 3 && (
              <>
                <div className="sm:col-span-2">
                  <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="instructions"
                    label={t("form.instructions")}
                    leftIcon={ListChecks}
                  />
                </div>
                <CustomFormField
                  fieldType={FormFieldType.NUMBER}
                  control={form.control}
                  name="duration_minutes"
                  label={t("form.duration")}
                  leftIcon={Clock}
                />
                <CustomFormField
                  fieldType={FormFieldType.NUMBER}
                  control={form.control}
                  name="passing_score"
                  label={t("form.passingScore")}
                  leftIcon={Target}
                  description={calculatedMaxScore > 0 ? `Max: ${calculatedMaxScore} pts` : undefined}
                />
                <div className="sm:col-span-2">
                  <CustomFormField
                    fieldType={FormFieldType.SWITCH}
                    control={form.control}
                    name="is_active"
                    label={t("form.active")}
                    leftIcon={ToggleRight}
                  />
                </div>
              </>
            )}

            {currentStep === 4 && (
              <EmployerTestReviewStep values={form.watch()} maxScore={calculatedMaxScore} />
            )}

            <div className="sm:col-span-2 flex items-center justify-between gap-4">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={handleBack} disabled={isPending}>
                  <ChevronLeft className="me-2 h-4 w-4 rtl:rotate-180" />
                  {t("actions.back")}
                </Button>
              )}
              <div className="flex-1" />
              {currentStep < TEST_FORM_TOTAL_STEPS ? (
                <Button type="button" onClick={() => void handleNext()} disabled={isPending}>
                  {t("actions.next")}
                  <ChevronRight className="ms-2 h-4 w-4 rtl:rotate-180" />
                </Button>
              ) : (
                <Button type="button" onClick={() => void handleFinalSubmit()} disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="me-2 h-4 w-4 animate-spin" />
                      {t("actions.saving")}
                    </>
                  ) : (
                    <>
                      <Save className="me-2 h-4 w-4" />
                      {test ? t("actions.save") : t("actions.create")}
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
