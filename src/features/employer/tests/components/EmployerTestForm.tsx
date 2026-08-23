import { Fragment, useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock,
  FileText,
  Info,
  ListChecks,
  Loader2,
  Save,
  Target,
  ToggleRight,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import EmptyState from "@/components/shared/states/EmptyState"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { showErrorToast } from "@/lib/toast"
import { cn } from "@/lib/utils"
import QuestionsManager from "./QuestionsManager"
import { employerTestsService } from "../services/employerTests.service"
import type {
  EmployerTest,
  EmployerTestInput,
  TestQuestion,
  TestQuestionInput,
  TestQuestionOption,
  TestQuestionResponse,
  TestQuestionType,
} from "../types/employerTests.types"
import {
  createEmployerTestSchema,
  type EmployerTestFormValues,
} from "../validation/employerTests.validation"

const STEPS = [
  { labelKey: "wizard.stepInformation", icon: FileText },
  { labelKey: "wizard.stepQuestions", icon: ListChecks },
  { labelKey: "wizard.stepSettings", icon: Target },
  { labelKey: "wizard.stepReview", icon: ClipboardCheck },
] as const

const TOTAL_STEPS = STEPS.length

const questionTypeLabelKeys: Record<TestQuestionType, string> = {
  single_choice: "questions.singleChoice",
  multiple_choice: "questions.multipleChoice",
  true_false: "questions.trueFalse",
  short_text: "questions.shortText",
  long_text: "questions.longText",
  file_upload: "questions.fileUpload",
}

const getDefaults = (): EmployerTestFormValues => ({
  title: "",
  description: "",
  instructions: "",
  duration_minutes: 60,
  passing_score: 0,
  is_active: true,
  questions: [],
})

function normalizedQuestions(questions: TestQuestion[]): TestQuestion[] {
  return questions.map((question, index) => ({
    ...question,
    question_text: question.question_text ?? "",
    order_index: index,
    points: Number(question.points),
    is_required: question.is_required ?? true,
    options: (question.options ?? []).map((option, optionIndex) => ({
      ...option,
      option_text: option.option_text ?? "",
      order_index: optionIndex,
      is_correct: Boolean(option.is_correct),
    })),
  }))
}

function byOrderIndex(a: TestQuestionResponse, b: TestQuestionResponse): number {
  return Number(a.order_index) - Number(b.order_index)
}

function needsReorder(questions: TestQuestion[]): boolean {
  return questions.some((question, index) => Number(question.order_index) !== index)
}

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

  const employerTestSchema = createEmployerTestSchema(t)
  const form = useForm<EmployerTestFormValues>({
    resolver: zodResolver(employerTestSchema) as any,
    defaultValues: getDefaults(),
  })

  const questions = form.watch("questions") ?? []

  // Total points across all questions (used for max score + passing score cap).
  const calculatedMaxScore = questions.reduce(
    (sum: number, q: { points?: number }) => sum + (Number(q.points) || 0),
    0,
  )

  // Keep the passing score within the achievable total.
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
            questions: (test.questions ?? []).map((q) =>
              toQuestionFormValue(q),
            ) as EmployerTestFormValues["questions"],
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

  const toQuestionPayload = (
    question: TestQuestion,
    index: number,
    orderIndex = question.order_index ?? index,
  ): TestQuestionInput => {
    const payload: TestQuestionInput = {
      question_text: question.question_text,
      question_type: question.question_type,
      order_index: orderIndex,
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
    const orderedQuestions = normalizedQuestions(nextQuestions)
    const serverQuestions = (await employerTestsService.getQuestions(testId)).sort(byOrderIndex)
    const serverQuestionById = new Map(
      serverQuestions.map((question) => [String(question.id), question]),
    )
    const usedServerQuestionIds = new Set<string>()
    const highestServerOrder = serverQuestions.reduce(
      (highest, question) => Math.max(highest, Number(question.order_index) || 0),
      -1,
    )
    let createdCount = 0

    for (let i = 0; i < orderedQuestions.length; i++) {
      const question = orderedQuestions[i]
      const matchedQuestion =
        question.id != null
          ? serverQuestionById.get(String(question.id))
          : serverQuestions.find((serverQuestion, serverIndex) => {
              const id = String(serverQuestion.id)
              return serverIndex === i && !usedServerQuestionIds.has(id)
            })

      if (matchedQuestion?.id) {
        usedServerQuestionIds.add(String(matchedQuestion.id))
        const savedQuestion = await employerTestsService.updateQuestion(
          testId,
          matchedQuestion.id,
          toQuestionPayload(question, i, matchedQuestion.order_index),
        )
        savedQuestions.push({
          ...question,
          ...toQuestionFormValue(savedQuestion as TestQuestionResponse),
        })
      } else {
        const orderIndex = highestServerOrder + createdCount + 1
        const savedQuestion = await employerTestsService.createQuestion(
          testId,
          toQuestionPayload(question, i, orderIndex),
        )
        createdCount += 1
        savedQuestions.push(toQuestionFormValue(savedQuestion as TestQuestionResponse))
      }

      form.setValue(
        "questions",
        [
          ...savedQuestions,
          ...orderedQuestions.slice(i + 1),
        ] as EmployerTestFormValues["questions"],
        { shouldValidate: false },
      )
    }

    if (
      savedQuestions.length > 1 &&
      savedQuestions.every((question) => question.id) &&
      needsReorder(savedQuestions)
    ) {
      try {
        await employerTestsService.reorderQuestions(testId, {
          questions: savedQuestions.map((question, index) => ({
            question_id: question.id!,
            order_index: index,
          })),
        })
      } catch (error) {
        console.warn("Question reorder failed after questions were saved.", error)
      }
    }

    form.setValue(
      "questions",
      savedQuestions.map((q) => ({
        ...q,
        is_required: q.is_required ?? true,
      })) as EmployerTestFormValues["questions"],
      { shouldValidate: false },
    )
  }

  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = await form.trigger(["title", "description"] as any)
      if (!isValid) return

      const values = form.getValues()
      try {
        if (!createdTestId) {
          // Create the draft first so questions can be attached in step 2.
          const createdTest = (await onSubmit({
            title: values.title,
            description: values.description || undefined,
            instructions: values.instructions || undefined,
            duration_minutes: values.duration_minutes,
            is_active: false,
          })) as EmployerTest
          if (createdTest?.id) setCreatedTestId(createdTest.id)
        }
        setCurrentStep(2)
      } catch (error) {
        showErrorToast(error)
      }
      return
    }

    if (currentStep === 2) {
      const currentQuestions = normalizedQuestions(form.getValues("questions") as TestQuestion[])
      form.setValue("questions", currentQuestions as EmployerTestFormValues["questions"], {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: false,
      })
      const isValid = await form.trigger("questions")
      if (!isValid) {
        showErrorToast(t("validation.questionsInvalid"))
        return
      }

      try {
        if (createdTestId && currentQuestions.length > 0) {
          await saveQuestions(createdTestId, currentQuestions)
        }
        setCurrentStep(3)
      } catch (error) {
        showErrorToast(error)
      }
      return
    }

    if (currentStep === 3) {
      const isValid = await form.trigger([
        "instructions",
        "duration_minutes",
        "passing_score",
        "is_active",
      ] as any)
      if (!isValid) return
      setCurrentStep(4)
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const goToStep = (step: number) => {
    if (step < currentStep) setCurrentStep(step)
  }

  const handleFinalSubmit = async () => {
    const values = form.getValues()

    try {
      if (test?.id) {
        await onSubmit({
          title: values.title,
          description: values.description || undefined,
          instructions: values.instructions || undefined,
          duration_minutes: values.duration_minutes,
          passing_score: values.passing_score,
          is_active: values.is_active,
        })
        return
      }

      if (createdTestId) {
        await employerTestsService.patch(createdTestId, {
          title: values.title,
          description: values.description || undefined,
          instructions: values.instructions || undefined,
          duration_minutes: values.duration_minutes,
          passing_score: values.passing_score,
          is_active: values.is_active,
        })
        onComplete?.()
      }
    } catch (error) {
      showErrorToast(error)
    }
  }

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
            {/* Step indicator */}
            <div className="sm:col-span-2 mb-2">
              <div className="mx-auto flex max-w-2xl items-start justify-between gap-1">
                {STEPS.map((step, index) => {
                  const number = index + 1
                  const isDone = number < currentStep
                  const isActive = number === currentStep

                  return (
                    <Fragment key={step.labelKey}>
                      <button
                        type="button"
                        onClick={() => goToStep(number)}
                        disabled={number >= currentStep}
                        className="flex flex-col items-center gap-1.5 focus-visible:outline-none disabled:cursor-default"
                      >
                        <span
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full font-medium transition-all",
                            isActive && "bg-primary text-white",
                            isDone && "bg-primary/70 text-white",
                            !isActive && !isDone && "bg-muted text-muted-foreground",
                          )}
                        >
                          {isDone ? <Check className="h-5 w-5" /> : number}
                        </span>
                        <span
                          className={cn(
                            "text-xs font-medium sm:text-sm",
                            isActive ? "text-primary" : "text-muted-foreground",
                          )}
                        >
                          {t(step.labelKey)}
                        </span>
                      </button>
                      {index < TOTAL_STEPS - 1 && (
                        <div
                          className={cn(
                            "mt-5 h-0.5 flex-1 transition-all",
                            number < currentStep ? "bg-primary" : "bg-muted",
                          )}
                        />
                      )}
                    </Fragment>
                  )
                })}
              </div>
            </div>

            {/* Step 1: Information */}
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
              </>
            )}

            {/* Step 2: Questions */}
            {currentStep === 2 && (
              <div className="sm:col-span-2">
                <QuestionsManager
                  questions={questions}
                  onChange={(updated) => {
                    form.clearErrors("questions")
                    form.setValue(
                      "questions",
                      normalizedQuestions(updated) as EmployerTestFormValues["questions"],
                      { shouldDirty: true, shouldTouch: true, shouldValidate: false },
                    )
                  }}
                  testId={createdTestId}
                  validationErrors={form.formState.errors.questions}
                />
              </div>
            )}

            {/* Step 3: Settings */}
            {currentStep === 3 && (
              <>
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
                <CustomFormField
                  fieldType={FormFieldType.NUMBER}
                  control={form.control as any}
                  name="passing_score"
                  label={t("form.passingScore")}
                  leftIcon={Target}
                  description={
                    calculatedMaxScore > 0 ? `Max: ${calculatedMaxScore} pts` : undefined
                  }
                />
                <div className="sm:col-span-2">
                  <CustomFormField
                    fieldType={FormFieldType.SWITCH}
                    control={form.control as any}
                    name="is_active"
                    label={t("form.active")}
                    leftIcon={ToggleRight}
                  />
                </div>
              </>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <ReviewStep values={form.watch()} maxScore={calculatedMaxScore} />
            )}

            {/* Navigation */}
            <div className="sm:col-span-2 flex items-center justify-between gap-4">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={handleBack} disabled={isPending}>
                  <ChevronLeft className="me-2 h-4 w-4 rtl:rotate-180" />
                  {t("actions.back")}
                </Button>
              )}
              <div className="flex-1" />
              {currentStep < TOTAL_STEPS ? (
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

function ReviewStep({ values, maxScore }: { values: EmployerTestFormValues; maxScore: number }) {
  const { t } = useTranslation("employerTests")
  const reviewQuestions = values.questions ?? []

  return (
    <div className="space-y-6 sm:col-span-2">
      <section className="rounded-lg border border-border p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-primary">
          <FileText className="h-4 w-4 text-primary" />
          {t("review.infoSection")}
        </h3>
        <dl className="grid gap-3 sm:grid-cols-2">
          <ReviewItem label={t("form.title")} value={values.title || "-"} />
          <ReviewItem
            label={t("form.description")}
            value={values.description || t("noDescription")}
          />
        </dl>
      </section>

      <section className="rounded-lg border border-border p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-primary">
          <Target className="h-4 w-4 text-primary" />
          {t("review.settingsSection")}
        </h3>
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ReviewItem label={t("review.totalPoints")} value={`${maxScore}`} />
          <ReviewItem label={t("form.passingScore")} value={`${values.passing_score ?? 0}`} />
          <ReviewItem
            label={t("form.duration")}
            value={t("minutes", { count: values.duration_minutes ?? 0 })}
          />
          <ReviewItem
            label={t("form.active")}
            value={values.is_active ? t("review.active") : t("review.inactive")}
          />
        </dl>
        {values.instructions && (
          <div className="mt-3">
            <ReviewItem label={t("form.instructions")} value={values.instructions} multiline />
          </div>
        )}
      </section>

      <section className="rounded-lg border border-border p-4">
        <h3 className="mb-3 flex items-center justify-between gap-2 text-sm font-semibold text-text-primary">
          <span className="flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-primary" />
            {t("review.questionsSection")}
          </span>
          <span className="text-xs font-normal text-text-muted">
            {t("review.questionCount", { count: reviewQuestions.length })}
          </span>
        </h3>
        {reviewQuestions.length === 0 ? (
          <EmptyState
            title={t("review.empty")}
            description={t("review.questionsSection")}
            icon={ListChecks}
            className="rounded-md border border-dashed border-border/60 bg-background-secondary/40 py-8"
          />
        ) : (
          <ol className="space-y-2">
            {reviewQuestions.map((question, index) => {
              const options = question.options ?? []
              const correctCount = options.filter((option) => option.is_correct).length

              return (
                <li key={question.id ?? index} className="rounded-md border border-border p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="text-sm font-medium text-text-primary">
                      {index + 1}. {question.question_text}
                    </p>
                    <span className="text-xs font-medium text-primary">
                      {Number(question.points)} pts
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-text-muted">
                    {t(questionTypeLabelKeys[question.question_type])}
                    {options.length > 0 &&
                      ` · ${t("review.optionsCount", { count: options.length })}${
                        correctCount > 0 ? ` · ${correctCount} ✓` : ""
                      }`}
                  </p>
                </li>
              )
            })}
          </ol>
        )}
      </section>
    </div>
  )
}

function ReviewItem({
  label,
  value,
  multiline,
}: {
  label: string
  value: string
  multiline?: boolean
}) {
  return (
    <div>
      <dt className="text-xs font-medium text-text-muted">{label}</dt>
      <dd
        className={cn(
          "mt-0.5 whitespace-pre-line text-sm text-text-primary",
          !multiline && "truncate",
        )}
        title={!multiline ? value : undefined}
      >
        {value}
      </dd>
    </div>
  )
}
