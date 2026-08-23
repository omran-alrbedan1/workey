import { AlertCircle, Award, ChevronDown, ChevronUp, FileText, GripVertical, HelpCircle, ListChecks, Plus, Trash2, Type, Upload } from "lucide-react"
import { useTranslation } from "react-i18next"
import EmptyState from "@/components/shared/states/EmptyState"
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
import { useQuestionsManager } from "../hooks/useQuestionsManager"
import type { TestQuestion } from "../types/employerTests.types"
import {
  choiceTypes,
  errorAt,
  errorMessage,
  normalizeOptions,
  type QuestionService,
  trueFalseOptions,
} from "../utils/questionsManager"

interface QuestionsManagerProps {
  questions: TestQuestion[]
  onChange: (questions: TestQuestion[]) => void
  testId?: string | number
  namespace?: string
  validationErrors?: unknown
  testService?: QuestionService
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
  testService,
}: QuestionsManagerProps) {
  const { t } = useTranslation(namespace)
  const formError = errorMessage(validationErrors)
  const {
    totalPoints,
    addQuestion,
    removeQuestion,
    moveQuestion,
    updateQuestion,
    addOption,
    updateOptionText,
    setOptionCorrect,
    deleteOption,
    moveOption,
    handleQuestionTypeChange,
  } = useQuestionsManager({
    questions,
    onChange,
    testId,
    testService,
  })

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
            <EmptyState
              title={t("questions.empty")}
              description={t("questions.empty")}
              icon={HelpCircle}
              className="rounded-lg border border-dashed border-border/60 bg-background-secondary/40 py-8"
            />
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
                        onChange={(event) =>
                          updateQuestion(index, "question_text", event.target.value)
                        }
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
                            <SelectItem value="single_choice">
                              {t("questions.singleChoice")}
                            </SelectItem>
                            <SelectItem value="multiple_choice">
                              {t("questions.multipleChoice")}
                            </SelectItem>
                            <SelectItem value="true_false">{t("questions.trueFalse")}</SelectItem>
                            <SelectItem value="short_text">{t("questions.shortText")}</SelectItem>
                            <SelectItem value="long_text">{t("questions.longText")}</SelectItem>
                            <SelectItem value="file_upload">{t("questions.fileUpload")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label
                          htmlFor={`q-points-${index}`}
                          className="mb-2 flex items-center gap-1"
                        >
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
                            {normalizeOptions(
                              question.options?.length === 2
                                ? question.options
                                : trueFalseOptions(),
                            ).map((option, optionIndex) => (
                              <div key={option.option_text} className="flex items-center gap-2">
                                <Checkbox
                                  id={`tf-${option.option_text}-${index}`}
                                  checked={option.is_correct}
                                  onCheckedChange={(checked) =>
                                    setOptionCorrect(index, optionIndex, Boolean(checked))
                                  }
                                />
                                <Label htmlFor={`tf-${option.option_text}-${index}`}>
                                  {option.option_text.toLowerCase() === "true"
                                    ? t("questions.true")
                                    : t("questions.false")}
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
                                    onChange={(event) =>
                                      updateOptionText(index, optionIndex, event.target.value)
                                    }
                                    placeholder={t("questions.optionPlaceholder", {
                                      n: optionIndex + 1,
                                    })}
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
                                    errorAt(
                                      errorAt(errorAt(questionError, "options"), optionIndex),
                                      "option_text",
                                    ),
                                  )}
                                />
                              </div>
                            ))}
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => addOption(index)}
                            >
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
