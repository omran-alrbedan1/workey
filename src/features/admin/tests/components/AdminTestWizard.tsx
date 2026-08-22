import { Fragment, useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Building2,
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
  ScrollText,
  Target,
  ToggleRight,
} from "lucide-react"
import { useForm, type Resolver } from "react-hook-form"
import { useTranslation } from "react-i18next"
import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import type { AdminCompanyRecord } from "@/features/admin/companies/types/adminCompanies.types"
import { showErrorToast } from "@/lib/toast"
import { cn } from "@/lib/utils"
import QuestionsManager from "@/features/employer/tests/components/QuestionsManager"
import type {
  TestQuestion,
  TestQuestionInput,
  TestQuestionOption,
  TestQuestionResponse,
} from "@/features/employer/tests/types/employerTests.types"
import { adminTestsService } from "../services/adminTests.service"
import type { AdminTestInput, AdminTestUpdateInput } from "../types/adminTests.types"
import {
  createAdminTestWizardSchema,
  type AdminTestWizardFormValues,
} from "../validations/adminTests.validation"

const STEPS = [
  { labelKey: "wizard.stepInformation", icon: FileText },
  { labelKey: "wizard.stepQuestions", icon: ListChecks },
  { labelKey: "wizard.stepSettings", icon: Target },
  { labelKey: "wizard.stepReview", icon: ClipboardCheck },
] as const

const TOTAL_STEPS = STEPS.length

const questionTypeLabelKeys: Record<TestQuestion["question_type"], string> = {
  single_choice: "questions.singleChoice",
  multiple_choice: "questions.multipleChoice",
  true_false: "questions.trueFalse",
  short_text: "questions.shortText",
  long_text: "questions.longText",
  file_upload: "questions.fileUpload",
}

const getDefaults = (): AdminTestWizardFormValues => ({
  company_id: "",
  title: "",
  description: "",
  duration_minutes: 60,
  passing_score: 0,
  is_active: true,
  questions: [],
})

function toQuestionFormValue(question: TestQuestionResponse): TestQuestion {
  return {
    id: question.id,
    test_id: question.test_id,
    question_text: question.question_text,
    question_type:
      typeof question.question_type === "string"
        ? (question.question_type as TestQuestion["question_type"])
        : question.question_type.key,
    order_index: question.order_index,
    points: Number(question.points),
    is_required: question.is_required ?? true,
    options: (question.options ?? []).map((option) => ({
      id: option.id,
      test_question_id: option.test_question_id,
      option_text: option.option_text,
      order_index: option.order_index,
      is_correct: Boolean(option.is_correct),
    })),
  }
}

function toQuestionPayload(question: TestQuestion, index: number): TestQuestionInput {
  const payload: TestQuestionInput = {
    question_text: question.question_text,
    question_type: question.question_type,
    order_index: question.order_index ?? index,
    points: Number(question.points),
    is_required: question.is_required ?? true,
  }

  if (["single_choice", "multiple_choice", "true_false"].includes(question.question_type)) {
    payload.options =
      question.options?.map((option: TestQuestionOption, optionIndex: number) => ({
        option_text: option.option_text,
        order_index: option.order_index ?? optionIndex,
        is_correct: Boolean(option.is_correct),
      })) ?? []
  }

  return payload
}

interface AdminTestWizardProps {
  companies: AdminCompanyRecord[]
  isLoadingCompanies?: boolean
  onCreate: (input: AdminTestInput) => Promise<unknown>
  onUpdate: (input: AdminTestUpdateInput) => Promise<unknown>
  onComplete?: () => void
  isPending: boolean
}

export default function AdminTestWizard({
  companies,
  isLoadingCompanies = false,
  onCreate,
  onUpdate,
  onComplete,
  isPending,
}: AdminTestWizardProps) {
  const { t } = useTranslation("adminTests")
  const [currentStep, setCurrentStep] = useState(1)
  const [createdTestId, setCreatedTestId] = useState<string | number | undefined>()

  const wizardSchema = createAdminTestWizardSchema(t)
  const form = useForm<AdminTestWizardFormValues>({
    resolver: zodResolver(wizardSchema) as Resolver<AdminTestWizardFormValues>,
    defaultValues: getDefaults(),
  })

  const questions = (form.watch("questions") ?? []) as unknown as TestQuestion[]

  // Total points across all questions (used for max score + passing score cap).
  const calculatedMaxScore = questions.reduce(
    (sum, q) => sum + (Number(q.points) || 0),
    0,
  )

  useEffect(() => {
    if (calculatedMaxScore > 0) {
      const currentPassingScore = form.getValues("passing_score")
      if (currentPassingScore !== undefined && currentPassingScore > calculatedMaxScore) {
        form.setValue("passing_score", calculatedMaxScore)
      }
    }
  }, [calculatedMaxScore, form])

  const saveQuestions = async (testId: string | number, nextQuestions: TestQuestion[]) => {
    const savedQuestions: TestQuestion[] = []

    for (let i = 0; i < nextQuestions.length; i++) {
      const question = nextQuestions[i]

      if (question.id) {
        const savedQuestion = await adminTestsService.updateQuestion(
          testId,
          question.id,
          toQuestionPayload(question, i),
        )
        savedQuestions.push({
          ...question,
          ...toQuestionFormValue(savedQuestion),
        })
      } else {
        const savedQuestion = await adminTestsService.createQuestion(
          testId,
          toQuestionPayload(question, i),
        )
        savedQuestions.push(toQuestionFormValue(savedQuestion))
      }
    }

    if (savedQuestions.length > 1 && savedQuestions.every((question) => question.id)) {
      await adminTestsService.reorderQuestions(
        testId,
        savedQuestions.map((question, index) => ({
          question_id: question.id!,
          order_index: index,
        })),
      )
    }

    form.setValue("questions", savedQuestions as never, { shouldValidate: false })
  }

  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = await form.trigger(["company_id", "title", "description"] as never)
      if (!isValid) return

      const values = form.getValues()
      try {
        if (!createdTestId) {
          // Create the catalog draft first so questions can be attached in step 2.
          // Passing score and duration are intentionally not collected here;
          // they are configured in step 3 once questions exist.
          const createdTest = (await onCreate({
            company_id: values.company_id,
            title: values.title,
            description: values.description || undefined,
            duration_minutes: 60,
            passing_score: 0,
          })) as Awaited<ReturnType<typeof adminTestsService.create>>
          if (createdTest?.id) setCreatedTestId(createdTest.id)
        }
        setCurrentStep(2)
      } catch (error) {
        showErrorToast(error)
      }
      return
    }

    if (currentStep === 2) {
      const isValid = await form.trigger("questions" as never)
      if (!isValid) return

      if (createdTestId && questions.length > 0) {
        try {
          await saveQuestions(createdTestId, questions)
        } catch (error) {
          showErrorToast(error)
          return
        }
      }
      setCurrentStep(3)
      return
    }

    if (currentStep === 3) {
      const isValid = await form.trigger([
        "duration_minutes",
        "passing_score",
        "is_active",
      ] as never)
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

    if (!createdTestId) return

    try {
      await onUpdate({
        id: createdTestId,
        duration_minutes: values.duration_minutes,
        passing_score: values.passing_score ?? 0,
        is_active: values.is_active,
      })
      onComplete?.()
    } catch (error) {
      showErrorToast(error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {t("create.title")}
        </CardTitle>
        <CardDescription>{t("create.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="grid gap-6 sm:grid-cols-2"
            onSubmit={(event) => event.preventDefault()}
          >
            {/* Step indicator */}
            <div className="mb-2 sm:col-span-2">
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

            {/* Step 1: Basic information */}
            {currentStep === 1 && (
              <>
                <div className="sm:col-span-2">
                  <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="company_id"
                    label={t("form.company")}
                    placeholder={
                      isLoadingCompanies
                        ? t("form.loadingCompanies")
                        : t("form.companyPlaceholder")
                    }
                    leftIcon={Building2}
                    iconPosition="left"
                    disabled={isPending || isLoadingCompanies}
                    options={companies.map((company) => ({
                      value: String(company.id),
                      label: company.name,
                    }))}
                  />
                </div>
                <div className="sm:col-span-2">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="title"
                    label={t("form.title")}
                    placeholder={t("form.titlePlaceholder")}
                    leftIcon={ScrollText}
                    iconPosition="left"
                    disabled={isPending}
                  />
                </div>
                <div className="sm:col-span-2">
                  <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="description"
                    label={t("form.description")}
                    placeholder={t("form.descriptionPlaceholder")}
                    disabled={isPending}
                  />
                </div>
              </>
            )}

            {/* Step 2: Questions */}
            {currentStep === 2 && (
              <div className="sm:col-span-2">
                <QuestionsManager
                  questions={questions}
                  onChange={(updated) =>
                    form.setValue(
                      "questions",
                      updated.map((q) => ({ ...q, is_required: q.is_required ?? true })) as never,
                      { shouldValidate: false },
                    )
                  }
                  testId={createdTestId}
                  namespace="adminTests"
                />
              </div>
            )}

            {/* Step 3: Configuration */}
            {currentStep === 3 && (
              <>
                <CustomFormField
                  fieldType={FormFieldType.NUMBER}
                  control={form.control}
                  name="duration_minutes"
                  label={t("form.duration")}
                  leftIcon={Clock}
                  iconPosition="left"
                  disabled={isPending}
                />
                <CustomFormField
                  fieldType={FormFieldType.NUMBER}
                  control={form.control}
                  name="passing_score"
                  label={t("form.passingScore")}
                  leftIcon={Target}
                  iconPosition="left"
                  disabled={isPending}
                  description={
                    calculatedMaxScore > 0
                      ? `${t("review.totalPoints")}: ${calculatedMaxScore}`
                      : undefined
                  }
                />
                <p className="text-xs text-text-muted sm:col-span-2">
                  {t("form.maxScoreManaged")}
                </p>
                <div className="sm:col-span-2">
                  <CustomFormField
                    fieldType={FormFieldType.SWITCH}
                    control={form.control}
                    name="is_active"
                    label={t("form.active")}
                    leftIcon={ToggleRight}
                    disabled={isPending}
                  />
                </div>
              </>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <ReviewStep
                values={form.watch()}
                maxScore={calculatedMaxScore}
                companyName={
                  companies.find(
                    (company) => String(company.id) === String(form.getValues("company_id")),
                  )?.name
                }
              />
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4 sm:col-span-2">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={handleBack} disabled={isPending}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  {t("wizard.back")}
                </Button>
              )}
              <div className="flex-1" />
              {currentStep < TOTAL_STEPS ? (
                <Button type="button" onClick={() => void handleNext()} disabled={isPending}>
                  {t("wizard.next")}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => void handleFinalSubmit()}
                  disabled={isPending}
                  className="text-white"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("wizard.saving")}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {t("create.submit")}
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

function ReviewStep({
  values,
  maxScore,
  companyName,
}: {
  values: AdminTestWizardFormValues
  maxScore: number
  companyName?: string
}) {
  const { t } = useTranslation("adminTests")
  const reviewQuestions = (values.questions ?? []) as unknown as TestQuestion[]

  return (
    <div className="space-y-6 sm:col-span-2">
      <section className="rounded-lg border border-border p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-primary">
          <FileText className="h-4 w-4 text-primary" />
          {t("review.infoSection")}
        </h3>
        <dl className="grid gap-3 sm:grid-cols-2">
          <ReviewItem label={t("form.company")} value={companyName || "-"} />
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
          <p className="text-sm text-text-muted">{t("review.empty")}</p>
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
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <dt className="text-xs font-medium text-text-muted">{label}</dt>
      <dd className="mt-0.5 whitespace-pre-line text-sm text-text-primary">{value}</dd>
    </div>
  )
}
