import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save, FileText, Clock, Target, ToggleRight, Info, ListChecks, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import QuestionsManager from "./QuestionsManager"
import { employerTestsService } from "../services/employerTests.service"
import type {
  EmployerTest,
  EmployerTestInput,
  TestQuestion,
  TestQuestionInput,
  TestQuestionOption,
  TestQuestionResponse,
} from "../types/employerTests.types"
import {
  createEmployerTestSchema,
  type EmployerTestFormValues,
} from "../validations/employerTests.validation"

const getDefaults = (): EmployerTestFormValues => ({
  title: "",
  description: "",
  instructions: "",
  duration_minutes: 60,
  passing_score: 0,
  is_active: true,
  questions: [],
})

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
  const [currentStep, setCurrentStep] = useState(1)
  const [createdTestId, setCreatedTestId] = useState<string | number | undefined>(test?.id)
  const totalSteps = 3

  const employerTestSchema = createEmployerTestSchema(t)
  const form = useForm<EmployerTestFormValues>({
    resolver: zodResolver(employerTestSchema) as any,
    defaultValues: getDefaults(),
  })

  const questions = form.watch("questions") ?? []

  // Calculate max_score from questions
  const calculatedMaxScore = questions.reduce((sum: number, q: { points?: number }) => sum + (Number(q.points) || 0), 0)

  // Auto-adjust passing score if it exceeds calculated max_score
  useEffect(() => {
    if (calculatedMaxScore > 0) {
      const currentPassingScore = form.getValues("passing_score")
      if (currentPassingScore !== undefined && currentPassingScore > calculatedMaxScore) {
        form.setValue("passing_score", calculatedMaxScore)
      }
    }
  }, [calculatedMaxScore, form])

  useEffect(() => {
    form.reset(
      test
        ? {
            title: test.title,
            description: test.description ?? "",
            instructions: test.instructions ?? "",
            duration_minutes: test.duration_minutes,
            passing_score: test.passing_score ?? 0,
            is_active: test.is_active,
            questions: (test.questions ?? []).map((q) => toQuestionFormValue(q)) as EmployerTestFormValues["questions"],
          }
        : getDefaults(),
    )
  }, [form, test])

  const toQuestionFormValue = (question: TestQuestionResponse): TestQuestion => ({
    id: question.id,
    test_id: question.test_id,
    question_text: question.question_text,
    question_type: question.question_type.key,
    order_index: question.order_index,
    points: Number(question.points),
    is_required: question.is_required ?? true,
    image_url: question.image_url,
    options: (question.options ?? []).map((option) => ({
      id: option.id,
      test_question_id: option.test_question_id,
      option_text: option.option_text,
      order_index: option.order_index,
      is_correct: Boolean(option.is_correct),
    })),
  })

  const toQuestionPayload = (question: TestQuestion, index: number): TestQuestionInput => {
    const payload: TestQuestionInput = {
      question_text: question.question_text,
      question_type: question.question_type,
      order_index: question.order_index ?? index,
      points: Number(question.points),
      is_required: question.is_required ?? true,
    }

    if (["single_choice", "multiple_choice", "true_false"].includes(question.question_type)) {
      payload.options =
        question.options?.map((option: TestQuestionOption, optionIndex: number) => {
          return {
            option_text: option.option_text,
            order_index: option.order_index ?? optionIndex,
            is_correct: Boolean(option.is_correct),
          }
        }) ?? []
    }

    return payload
  }

  const saveQuestions = async (testId: string | number, nextQuestions: TestQuestion[]) => {
    const savedQuestions: TestQuestion[] = []

    for (let i = 0; i < nextQuestions.length; i++) {
      const question = nextQuestions[i]

      if (question.id) {
        const savedQuestion = await employerTestsService.updateQuestion(
          testId,
          question.id,
          toQuestionPayload(question, i),
        )
        savedQuestions.push({ ...question, ...toQuestionFormValue(savedQuestion as TestQuestionResponse) })
      } else {
        const savedQuestion = await employerTestsService.createQuestion(
          testId,
          toQuestionPayload(question, i),
        )
        savedQuestions.push(toQuestionFormValue(savedQuestion as TestQuestionResponse))
      }
    }

    if (savedQuestions.length > 1 && savedQuestions.every((question) => question.id)) {
      const reordered = await employerTestsService.reorderQuestions(testId, {
        questions: savedQuestions.map((question, index) => ({
          question_id: question.id!,
          order_index: index,
        })),
      })
      form.setValue("questions", reordered.map((q) => toQuestionFormValue(q as TestQuestionResponse)) as EmployerTestFormValues["questions"], { shouldValidate: false })
      return
    }

    form.setValue("questions", savedQuestions.map((q) => ({ ...q, is_required: q.is_required ?? true })) as EmployerTestFormValues["questions"], { shouldValidate: false })
  }

  const handleNext = async () => {
    const fieldsToValidate = currentStep === 1 
      ? ["title", "description", "instructions", "duration_minutes"]
      : currentStep === 2
      ? ["questions"]
      : ["passing_score", "is_active"]
    
    const isValid = await form.trigger(fieldsToValidate as any)
    if (!isValid) return

    const values = form.getValues()

    try {
      if (currentStep === 1 && !createdTestId) {
        const stage1Payload = {
          title: values.title,
          description: values.description,
          instructions: values.instructions,
          duration_minutes: values.duration_minutes,
          is_active: false,
        }
        const createdTest = await onSubmit(stage1Payload) as EmployerTest
        if (createdTest?.id) {
          setCreatedTestId(createdTest.id)
        }
      } else if (currentStep === 2 && createdTestId && values.questions && values.questions.length > 0) {
        await saveQuestions(createdTestId, values.questions as TestQuestion[])
      }
      
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    } catch (error) {
      console.error("=== STEP ERROR ===")
      console.error("Error:", error)
      console.error("Error details:", JSON.stringify(error, null, 2))
      throw error
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (values: EmployerTestFormValues) => {
    try {
      if (test?.id) {
        const payload = {
          title: values.title,
          description: values.description,
          instructions: values.instructions,
          duration_minutes: values.duration_minutes,
          passing_score: values.passing_score,
          is_active: values.is_active,
        }
        await onSubmit(payload)
      } else if (createdTestId) {
        const stage3Payload = {
          passing_score: values.passing_score,
          is_active: values.is_active,
        }
        await employerTestsService.patch(createdTestId, stage3Payload)
        onComplete?.()
      }
    } catch (error) {
      throw error
    }
  }

  const handleFinalSubmit = async () => {
    // Only validate step 3 fields
    const isValid = await form.trigger(["passing_score", "is_active"] as any)
    if (!isValid) return

    const values = form.getValues()
    await handleSubmit(values)
  }

  return (
    <div className="space-y-6">
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
            <form
              className="grid gap-6 sm:grid-cols-2 relative overflow-visible"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              {/* Step Indicator */}
              <div className="sm:col-span-2 mb-4">
                <div className="flex items-center justify-between mx-auto max-w-md">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <div key={i} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                            i + 1 === currentStep
                              ? "bg-primary text-white"
                              : i + 1 < currentStep
                              ? "bg-primary/70 text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {i + 1}
                        </div>
                      </div>
                      {i < totalSteps - 1 && (
                        <div
                          className={`flex-1 h-0.5 mx-2 transition-all ${
                            i + 1 < currentStep ? "bg-primary" : "bg-muted"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <>
                  <div className="sm:col-span-2">
                    <CustomFormField 
                      fieldType={FormFieldType.INPUT} 
                      control={form.control as any} 
                      name="title" 
                      label={t("form.title")}
                      leftIcon={FileText}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <CustomFormField 
                      fieldType={FormFieldType.TEXTAREA} 
                      control={form.control as any} 
                      name="description" 
                      label={t("form.description")}
                      leftIcon={Info}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <CustomFormField 
                      fieldType={FormFieldType.TEXTAREA} 
                      control={form.control as any} 
                      name="instructions" 
                      label={t("form.instructions")}
                      leftIcon={ListChecks}
                    />
                  </div>
                  <CustomFormField 
                    fieldType={FormFieldType.NUMBER} 
                    control={form.control as any} 
                    name="duration_minutes" 
                    label={t("form.duration")}
                    leftIcon={Clock}
                  />
                </>
              )}

              {/* Step 2: Questions */}
              {currentStep === 2 && (
                <div className="sm:col-span-2">
                  <QuestionsManager
                    questions={questions}
                    onChange={(updated) => form.setValue("questions", updated.map((q) => ({ ...q, is_required: q.is_required ?? true })) as EmployerTestFormValues["questions"], { shouldValidate: false })}
                    testId={createdTestId}
                  />
                </div>
              )}

              {/* Step 3: Final Settings */}
              {currentStep === 3 && (
                <>
                  <CustomFormField 
                    fieldType={FormFieldType.NUMBER} 
                    control={form.control as any} 
                    name="passing_score" 
                    label={t("form.passingScore")}
                    leftIcon={Target}
                    description={calculatedMaxScore > 0 ? `Max: ${calculatedMaxScore} pts` : undefined}
                  />
                  <CustomFormField 
                    fieldType={FormFieldType.SWITCH} 
                    control={form.control as any} 
                    name="is_active" 
                    label={t("form.active")}
                    leftIcon={ToggleRight}
                  />
                </>
              )}

              {/* Navigation Buttons */}
              <div className="sm:col-span-2 flex items-center justify-between gap-4">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={isPending}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    {t("actions.back")}
                  </Button>
                )}
                <div className="flex-1" />
                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isPending}
                  >
                    {t("actions.next")}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {t("actions.saving")}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
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
    </div>
  )
}
