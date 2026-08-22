import { useCallback } from "react"
import {
  Award,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  GripVertical,
  HelpCircle,
  ListChecks,
  Plus,
  Trash2,
  Type,
  Upload,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { employerTestsService } from "../services/employerTests.service"
import type { TestQuestion, TestQuestionOption } from "../types/employerTests.types"

interface QuestionsManagerProps {
  questions: TestQuestion[]
  onChange: (questions: TestQuestion[]) => void
  testId?: string | number
  namespace?: string
  validationErrors?: unknown
}

const choiceTypes: TestQuestion["question_type"][] = [
  "single_choice",
  "multiple_choice",
  "true_false",
]

function normalizeOption(option: TestQuestionOption, index: number): TestQuestionOption {
  return {
    id: option.id,
    test_question_id: option.test_question_id,
    option_text: option.option_text,
    order_index: option.order_index ?? index,
    is_correct: Boolean(option.is_correct),
  }
}

function normalizeOptions(options: TestQuestion["options"] = []): TestQuestionOption[] {
  return options.map((option, index) => normalizeOption(option, index))
}

function trueFalseOptions(correctValue: "true" | "false" = "true"): TestQuestionOption[] {
  return [
    { option_text: "True", order_index: 0, is_correct: correctValue === "true" },
    { option_text: "False", order_index: 1, is_correct: correctValue === "false" },
  ]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function errorAt(value: unknown, key: string | number): unknown {
  if (Array.isArray(value)) return value[Number(key)]
  if (isRecord(value)) return value[key]
  return undefined
}

function errorMessage(value: unknown): string | undefined {
  if (!value) return undefined
  if (isRecord(value) && typeof value.message === "string") return value.message
  if (Array.isArray(value)) {
    for (const item of value) {
      const message = errorMessage(item)
      if (message) return message
    }
  }
  if (isRecord(value)) {
    for (const item of Object.values(value)) {
      const message = errorMessage(item)
      if (message) return message
    }
  }
  return undefined
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null

  return (
    <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
      <AlertCircle className="h-3 w-3" />
      {message}
    </p>
  )
}

export default function QuestionsManager({
  questions,
  onChange,
  testId,
  namespace = "employerTests",
  validationErrors,
}: QuestionsManagerProps) {
  const { t } = useTranslation(namespace)
  const formError = errorMessage(validationErrors)

  const replaceQuestion = useCallback(
    (index: number, nextQuestion: TestQuestion) => {
      onChange(questions.map((question, i) => (i === index ? nextQuestion : question)))
    },
    [onChange, questions],
  )

  const updateQuestion = useCallback(
    (index: number, field: keyof TestQuestion, value: unknown) => {
      replaceQuestion(index, { ...questions[index], [field]: value })
    },
    [questions, replaceQuestion],
  )

  const addQuestion = useCallback(() => {
    const newQuestion: TestQuestion = {
      question_text: "",
      question_type: "short_text",
      points: 1,
      order_index: questions.length,
      is_required: true,
      options: [],
    }
    onChange([...questions, newQuestion])
  }, [onChange, questions])

  const removeQuestion = useCallback(
    (index: number) => {
      const updated = questions
        .filter((_, i) => i !== index)
        .map((question, i) => ({ ...question, order_index: i }))
      onChange(updated)
    },
    [onChange, questions],
  )

  const moveQuestion = useCallback(
    (index: number, direction: "up" | "down") => {
      const target = direction === "up" ? index - 1 : index + 1
      if (target < 0 || target >= questions.length) return

      const updated = [...questions]
      const current = updated[index]
      updated[index] = { ...updated[target], order_index: index }
      updated[target] = { ...current, order_index: target }
      onChange(updated)
    },
    [onChange, questions],
  )

  const persistOption = useCallback(
    async (
      question: TestQuestion,
      option: TestQuestionOption,
      input: Partial<TestQuestionOption>,
    ) => {
      if (!testId || !question.id || !option.id) return option

      return employerTestsService.updateQuestionOption(testId, question.id, option.id, input)
    },
    [testId],
  )

  const addOption = useCallback(
    async (questionIndex: number) => {
      const question = questions[questionIndex]
      const options = normalizeOptions(question.options)
      const draftOption: TestQuestionOption = {
        option_text: "",
        is_correct: false,
        order_index: options.length,
      }

      const option =
        testId && question.id
          ? await employerTestsService.addQuestionOption(testId, question.id, {
              option_text: draftOption.option_text,
              order_index: draftOption.order_index,
              is_correct: draftOption.is_correct,
            })
          : draftOption

      replaceQuestion(questionIndex, { ...question, options: [...options, normalizeOption(option, options.length)] })
    },
    [questions, replaceQuestion, testId],
  )

  const updateOptionText = useCallback(
    async (questionIndex: number, optionIndex: number, text: string) => {
      const question = questions[questionIndex]
      const options = normalizeOptions(question.options)
      const current = options[optionIndex]
      if (!current) return

      const localOption = { ...current, option_text: text }
      const persistedOption = await persistOption(question, current, { option_text: text })
      const nextOptions = [...options]
      nextOptions[optionIndex] = normalizeOption(
        persistedOption.id ? persistedOption : localOption,
        optionIndex,
      )

      replaceQuestion(questionIndex, { ...question, options: nextOptions })
    },
    [persistOption, questions, replaceQuestion],
  )

  const setOptionCorrect = useCallback(
    async (questionIndex: number, optionIndex: number, checked: boolean) => {
      const question = questions[questionIndex]
      const options = normalizeOptions(question.options)
      const isSingleCorrect =
        question.question_type === "single_choice" || question.question_type === "true_false"

      const nextOptions = options.map((option, index) => ({
        ...option,
        is_correct: isSingleCorrect ? index === optionIndex && checked : index === optionIndex ? checked : option.is_correct,
      }))

      if (testId && question.id) {
        const changedOptions = nextOptions.filter(
          (option, index) => option.id && option.is_correct !== options[index]?.is_correct,
        )

        await Promise.all(
          changedOptions.map((option) =>
            employerTestsService.updateQuestionOption(testId, question.id!, option.id!, {
              is_correct: option.is_correct,
            }),
          ),
        )
      }

      const selected = nextOptions[optionIndex]
      replaceQuestion(questionIndex, {
        ...question,
        options: nextOptions,
      })
    },
    [questions, replaceQuestion, testId],
  )

  const deleteOption = useCallback(
    async (questionIndex: number, optionIndex: number) => {
      const question = questions[questionIndex]
      const options = normalizeOptions(question.options)
      const option = options[optionIndex]
      if (!option) return

      if (testId && question.id && option.id) {
        await employerTestsService.deleteQuestionOption(testId, question.id, option.id)
      }

      const nextOptions = options
        .filter((_, index) => index !== optionIndex)
        .map((item, index) => ({ ...item, order_index: index }))

      replaceQuestion(questionIndex, {
        ...question,
        options: nextOptions,
      })
    },
    [questions, replaceQuestion, testId],
  )

  const moveOption = useCallback(
    async (questionIndex: number, optionIndex: number, direction: "up" | "down") => {
      const question = questions[questionIndex]
      const target = direction === "up" ? optionIndex - 1 : optionIndex + 1
      const options = normalizeOptions(question.options)
      if (target < 0 || target >= options.length) return

      const nextOptions = [...options]
      const current = nextOptions[optionIndex]
      nextOptions[optionIndex] = { ...nextOptions[target], order_index: optionIndex }
      nextOptions[target] = { ...current, order_index: target }

      const allOptionsHaveIds = nextOptions.every((option) => option.id)
      if (testId && question.id && allOptionsHaveIds) {
        const reordered = await employerTestsService.reorderQuestionOptions(testId, question.id, {
          options: nextOptions.map((option, index) => ({
            option_id: option.id!,
            order_index: index,
          })),
        })
        replaceQuestion(questionIndex, { ...question, options: normalizeOptions(reordered) })
        return
      }

      replaceQuestion(questionIndex, { ...question, options: nextOptions })
    },
    [questions, replaceQuestion, testId],
  )

  const handleQuestionTypeChange = useCallback(
    (index: number, questionType: TestQuestion["question_type"]) => {
      const question = questions[index]
      const keepsOptions = questionType === "single_choice" || questionType === "multiple_choice"

      replaceQuestion(index, {
        ...question,
        question_type: questionType,
        options: questionType === "true_false"
          ? trueFalseOptions()
          : keepsOptions
            ? normalizeOptions(question.options)
            : [],
      })
    },
    [questions, replaceQuestion],
  )

  const totalPoints = questions.reduce((sum, question) => sum + (Number(question.points) || 0), 0)

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="flex items-center gap-2 text-base font-semibold">
                <ListChecks className="h-5 w-5" />
                {t("questions.title")}
              </Label>
              {questions.length > 0 && (
                <p className="mt-1 flex items-center gap-1 text-xs text-text-muted">
                  <Award className="h-3 w-3" />
                  {t("questions.totalPoints", { count: totalPoints })}
                </p>
              )}
            </div>
            <Button type="button" size="sm" variant="outline" onClick={addQuestion}>
              <Plus className="mr-2 h-4 w-4" /> {t("questions.add")}
            </Button>
          </div>

          <FieldError message={formError} />

          {questions.length === 0 && (
            <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
              <HelpCircle className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
              <p className="text-sm text-text-muted">{t("questions.empty")}</p>
            </div>
          )}

          <div className="space-y-3">
            {questions.map((question, index) => {
              const options = normalizeOptions(question.options)
              const showsOptions = choiceTypes.includes(question.question_type)
              const questionError = errorAt(validationErrors, index)
              const questionTextError = errorMessage(errorAt(questionError, "question_text"))
              const pointsError = errorMessage(errorAt(questionError, "points"))
              const optionsError = errorMessage(errorAt(questionError, "options"))

              return (
                <div
                  key={question.id ?? index}
                  className="rounded-lg border border-border bg-background-card p-4 shadow-sm"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-text-muted" />
                      <span className="flex items-center gap-1 text-sm font-medium text-text-muted">
                        <FileText className="h-3 w-3" />
                        {t("questions.questionNumber", { n: index + 1 })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        disabled={index === 0}
                        onClick={() => moveQuestion(index, "up")}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        disabled={index === questions.length - 1}
                        onClick={() => moveQuestion(index, "down")}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => removeQuestion(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`q-text-${index}`} className="mb-2 flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {t("questions.questionText")}
                      </Label>
                      <Textarea
                        id={`q-text-${index}`}
                        value={question.question_text}
                        onChange={(event) => updateQuestion(index, "question_text", event.target.value)}
                        placeholder={t("questions.questionTextPlaceholder")}
                        rows={2}
                        className="resize-none"
                      />
                      <FieldError message={questionTextError} />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <Label htmlFor={`q-type-${index}`} className="mb-2 flex items-center gap-1">
                          <Type className="h-3 w-3" />
                          {t("questions.type")}
                        </Label>
                        <Select
                          value={question.question_type}
                          onValueChange={(value: TestQuestion["question_type"]) =>
                            handleQuestionTypeChange(index, value)
                          }
                        >
                          <SelectTrigger id={`q-type-${index}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single_choice">{t("questions.singleChoice")}</SelectItem>
                            <SelectItem value="multiple_choice">{t("questions.multipleChoice")}</SelectItem>
                            <SelectItem value="true_false">{t("questions.trueFalse")}</SelectItem>
                            <SelectItem value="short_text">{t("questions.shortText")}</SelectItem>
                            <SelectItem value="long_text">{t("questions.longText")}</SelectItem>
                            <SelectItem value="file_upload">{t("questions.fileUpload")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor={`q-points-${index}`} className="mb-2 flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          {t("questions.points")}
                        </Label>
                        <Input
                          id={`q-points-${index}`}
                          type="number"
                          min={0}
                          step={0.5}
                          value={question.points}
                          onChange={(event) => updateQuestion(index, "points", event.target.value)}
                        />
                        <FieldError message={pointsError} />
                      </div>
                    </div>

                    {showsOptions && (
                      <div className="space-y-2 rounded-md border border-border bg-background p-3">
                        <Label className="flex items-center gap-1">
                          <ListChecks className="h-3 w-3" />
                          {t("questions.options")}
                        </Label>
                        {question.question_type === "true_false" ? (
                          <div className="space-y-2">
                            {normalizeOptions(question.options?.length === 2 ? question.options : trueFalseOptions()).map((option, optionIndex) => (
                              <div key={option.option_text} className="flex items-center gap-2">
                                <Checkbox
                                  id={`tf-${option.option_text}-${index}`}
                                  checked={option.is_correct}
                                  onCheckedChange={(checked) =>
                                    setOptionCorrect(index, optionIndex, Boolean(checked))
                                  }
                                />
                                <Label htmlFor={`tf-${option.option_text}-${index}`}>
                                  {option.option_text.toLowerCase() === "true" ? t("questions.true") : t("questions.false")}
                                </Label>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <>
                            <FieldError message={optionsError} />
                            {options.length === 0 && (
                              <p className="flex items-center gap-1 text-xs text-text-muted">
                                <HelpCircle className="h-3 w-3" />
                                {t("questions.noOptions")}
                              </p>
                            )}
                            {options.map((option, optionIndex) => (
                              <div key={option.id ?? optionIndex}>
                                <div className="flex items-center gap-2">
                                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                                    {optionIndex + 1}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      type="button"
                                      size="icon"
                                      variant="ghost"
                                      className="h-6 w-6"
                                      disabled={optionIndex === 0}
                                      onClick={() => moveOption(index, optionIndex, "up")}
                                    >
                                      <ChevronUp className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      type="button"
                                      size="icon"
                                      variant="ghost"
                                      className="h-6 w-6"
                                      disabled={optionIndex === options.length - 1}
                                      onClick={() => moveOption(index, optionIndex, "down")}
                                    >
                                      <ChevronDown className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  <span className="flex items-center gap-1.5 whitespace-nowrap text-xs text-text-muted">
                                    <Switch
                                      checked={Boolean(option.is_correct)}
                                      onCheckedChange={(checked) =>
                                        setOptionCorrect(index, optionIndex, Boolean(checked))
                                      }
                                      className="h-4 w-7"
                                    />
                                    <Label className="text-xs">{t("questions.isCorrect")}</Label>
                                  </span>
                                  <Input
                                    value={option.option_text}
                                    onChange={(event) => updateOptionText(index, optionIndex, event.target.value)}
                                    placeholder={t("questions.optionPlaceholder", { n: optionIndex + 1 })}
                                  />
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 shrink-0 text-red-500 hover:bg-red-50"
                                    onClick={() => deleteOption(index, optionIndex)}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                                <FieldError
                                  message={errorMessage(
                                    errorAt(errorAt(errorAt(questionError, "options"), optionIndex), "option_text"),
                                  )}
                                />
                              </div>
                            ))}
                            <Button type="button" size="sm" variant="ghost" onClick={() => addOption(index)}>
                              <Plus className="mr-2 h-3.5 w-3.5" /> {t("questions.addOption")}
                            </Button>

                          </>
                        )}
                      </div>
                    )}

                    {question.question_type === "file_upload" && (
                      <div className="rounded-md border border-border bg-background p-3">
                        <Label className="flex items-center gap-1">
                          <Upload className="h-3 w-3" />
                          {t("questions.fileUploadInstructions")}
                        </Label>
                        <p className="text-xs text-text-muted">{t("questions.fileUploadHint")}</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
