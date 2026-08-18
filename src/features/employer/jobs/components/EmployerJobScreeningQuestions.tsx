import { useEffect, useState } from "react"
import {
  AlignLeft,
  Asterisk,
  CheckCircle2,
  Edit,
  HelpCircle,
  ListChecks,
  ListTodo,
  Plus,
  Trash2,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { CancelButton, SubmitButton } from "@/components/shared/buttons"
import { DeleteModal } from "@/components/shared/modals"
import { Skeleton } from "@/components/ui/skeleton"
import { keyOf } from "@/lib/keyValue"
import type {
  JobScreeningQuestion,
  JobScreeningQuestionInput,
  ScreeningQuestionType,
} from "../types/employerJobs.types"

interface EmployerJobScreeningQuestionsProps {
  questions: JobScreeningQuestion[]
  isLoading: boolean
  isPending: boolean
  onCreate: (input: JobScreeningQuestionInput) => Promise<unknown>
  onUpdate: (questionId: string | number, input: Partial<JobScreeningQuestionInput>) => Promise<unknown>
  onDelete: (questionId: string | number) => Promise<unknown>
}

interface FormOption {
  option_text: string
  sort_order: number
}

interface FormState {
  question_text: string
  question_type: ScreeningQuestionType
  is_required: boolean
  options: FormOption[]
}

const TYPES: ScreeningQuestionType[] = [
  "short_text",
  "long_text",
  "number",
  "boolean",
  "single_choice",
  "multiple_choice",
]

const TYPE_ICONS: Record<ScreeningQuestionType, typeof HelpCircle> = {
  short_text: AlignLeft,
  long_text: AlignLeft,
  number: Asterisk,
  boolean: CheckCircle2,
  single_choice: ListChecks,
  multiple_choice: ListTodo,
}

const INITIAL_FORM: FormState = {
  question_text: "",
  question_type: "short_text",
  is_required: true,
  options: [],
}

const getKey = (v: unknown): string => {
  return keyOf(v)
}

export default function EmployerJobScreeningQuestions({
  questions,
  isLoading,
  isPending,
  onCreate,
  onUpdate,
  onDelete,
}: EmployerJobScreeningQuestionsProps) {
  const { t } = useTranslation("employerJobs")
  const [showDialog, setShowDialog] = useState(false)
  const [editingId, setEditingId] = useState<string | number | null>(null)
  const [deletingId, setDeletingId] = useState<string | number | null>(null)
  const [form, setForm] = useState<FormState>(INITIAL_FORM)

  const isChoiceType = form.question_type === "single_choice" || form.question_type === "multiple_choice"
  const deletingQuestion = questions.find((q) => String(q.id) === String(deletingId))

  const resetForm = () => {
    setForm(INITIAL_FORM)
    setEditingId(null)
  }

  const openAdd = () => {
    resetForm()
    setShowDialog(true)
  }

  const openEdit = (q: JobScreeningQuestion) => {
    const rawType = getKey(q.question_type) as ScreeningQuestionType
    setEditingId(q.id)
    setForm({
      question_text: q.question_text,
      question_type: rawType,
      is_required: q.is_required,
      options: (q.options ?? []).map((o, idx) => ({
        option_text: typeof o === "string" ? o : o.option_text,
        sort_order: typeof o === "string" ? idx : (o.sort_order ?? idx),
      })),
    })
    setShowDialog(true)
  }

  const handleSave = async () => {
    if (!form.question_text.trim()) return
    const input: JobScreeningQuestionInput = {
      question_text: form.question_text.trim(),
      question_type: form.question_type,
      is_required: form.is_required,
      options: isChoiceType
        ? form.options
            .filter((o) => o.option_text.trim())
            .map((o, idx) => ({
              option_text: o.option_text.trim(),
              sort_order: idx,
            }))
        : undefined,
    }
    if (editingId !== null) {
      await onUpdate(editingId, input)
    } else {
      await onCreate(input)
    }
    setShowDialog(false)
    resetForm()
  }

  const handleDelete = async () => {
    if (deletingId === null) return
    await onDelete(deletingId)
    setDeletingId(null)
  }

  useEffect(() => {
    if (!showDialog) resetForm()
  }, [showDialog])

  const questionTypeLabel = (type: unknown) => {
    const key = getKey(type) as ScreeningQuestionType
    return t(`screeningQuestions.types.${key}`)
  }

  const optionLabel = (opts: Array<{ option_text: string } | string> | undefined) => {
    if (!opts || opts.length === 0) return ""
    return opts
      .map((o) => (typeof o === "string" ? o : o.option_text))
      .filter(Boolean)
      .join(", ")
  }

  return (
    <>
      <section className="space-y-4 rounded-lg border border-border bg-background-card p-5 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <HelpCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-text-primary">{t("screeningQuestions.title")}</h2>
              <p className="text-sm text-text-muted">{t("screeningQuestions.description")}</p>
            </div>
          </div>
          <Button type="button" onClick={openAdd} disabled={isPending} className="shrink-0 text-white">
            <Plus /> {t("screeningQuestions.addButton")}
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        ) : questions.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <HelpCircle className="h-6 w-6 text-text-muted" />
            </div>
            <p className="text-sm text-text-muted">{t("screeningQuestions.empty")}</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {questions.map((q) => {
              const rawType = getKey(q.question_type) as ScreeningQuestionType
              const TypeIcon = TYPE_ICONS[rawType] ?? HelpCircle
              return (
                <li
                  key={q.id}
                  className="group flex items-start gap-3 rounded-lg border border-border bg-background p-4 transition-colors hover:border-primary/30"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/5">
                    <TypeIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary">{q.question_text}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <Badge variant="outline" className="gap-1 text-xs">
                        <TypeIcon className="h-3 w-3" />
                        {questionTypeLabel(q.question_type)}
                      </Badge>
                      {q.is_required ? (
                        <Badge variant="outline" className="gap-1 text-xs border-primary/30 bg-primary/10 text-primary">
                          <CheckCircle2 className="h-3 w-3" />
                          {t("screeningQuestions.required")}
                        </Badge>
                      ) : (
                        <span className="text-xs text-text-muted">{t("screeningQuestions.optional")}</span>
                      )}
                      {q.options && q.options.length > 0 && (
                        <span
                          className="max-w-[200px] truncate text-xs text-text-muted"
                          title={optionLabel(q.options)}
                        >
                          {optionLabel(q.options)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      disabled={isPending}
                      onClick={() => openEdit(q)}
                      aria-label={t("screeningQuestions.edit")}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                      disabled={isPending}
                      onClick={() => setDeletingId(q.id)}
                      aria-label={t("screeningQuestions.delete")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                {editingId !== null ? (
                  <Edit className="h-5 w-5 text-primary" />
                ) : (
                  <Plus className="h-5 w-5 text-primary" />
                )}
              </div>
              <div>
                <DialogTitle>
                  {editingId !== null ? t("screeningQuestions.edit") : t("screeningQuestions.addButton")}
                </DialogTitle>
                <DialogDescription>{t("screeningQuestions.description")}</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label htmlFor="sq-question-text" className="text-sm font-medium">
                {t("screeningQuestions.fields.questionText")}
              </Label>
              <div className="relative">
                <AlignLeft className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <Input
                  id="sq-question-text"
                  value={form.question_text}
                  onChange={(e) => setForm({ ...form, question_text: e.target.value })}
                  placeholder={t("screeningQuestions.fields.questionText")}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sq-question-type" className="text-sm font-medium">
                {t("screeningQuestions.fields.questionType")}
              </Label>
              <Select
                value={form.question_type}
                onValueChange={(v: ScreeningQuestionType) =>
                  setForm({ ...form, question_type: v, options: [] })
                }
              >
                <SelectTrigger id="sq-question-type" className="pl-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((type) => {
                    const Icon = TYPE_ICONS[type]
                    return (
                      <SelectItem key={type} value={type} className="gap-2">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-text-muted" />
                          <span>{questionTypeLabel(type)}</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-text-muted" />
                <Label htmlFor="sq-is-required" className="text-sm font-medium">
                  {t("screeningQuestions.fields.isRequired")}
                </Label>
              </div>
              <Switch
                id="sq-is-required"
                checked={form.is_required}
                onCheckedChange={(checked) => setForm({ ...form, is_required: checked })}
              />
            </div>

            {isChoiceType && (
              <div className="space-y-3 rounded-lg border border-border bg-background p-4">
                <div className="flex items-center gap-2">
                  <ListTodo className="h-4 w-4 text-text-muted" />
                  <Label className="text-sm font-medium">{t("screeningQuestions.fields.options")}</Label>
                </div>
                {form.options.length === 0 && (
                  <p className="text-xs text-text-muted">{t("screeningQuestions.fields.optionPlaceholder")}</p>
                )}
                <div className="space-y-2">
                  {form.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {idx + 1}
                      </span>
                      <Input
                        value={opt.option_text}
                        onChange={(e) => {
                          const next = [...form.options]
                          next[idx] = { ...next[idx], option_text: e.target.value }
                          setForm({ ...form, options: next })
                        }}
                        placeholder={`${t("screeningQuestions.fields.optionPlaceholder")} ${idx + 1}`}
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 shrink-0 text-red-500 hover:text-red-600"
                        onClick={() =>
                          setForm({
                            ...form,
                            options: form.options.filter((_, i) => i !== idx),
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full gap-1"
                  onClick={() =>
                    setForm({ ...form, options: [...form.options, { option_text: "", sort_order: form.options.length }] })
                  }
                >
                  <Plus className="h-4 w-4" /> {t("screeningQuestions.fields.addOption")}
                </Button>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 border-t border-border pt-4">
            <CancelButton
              onClick={() => setShowDialog(false)}
              disabled={isPending}
              text={t("screeningQuestions.cancel")}
            />
            <SubmitButton
              onClick={() => void handleSave()}
              isLoading={isPending}
              text={t("screeningQuestions.save")}
              disabled={!form.question_text.trim()}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteModal
        open={deletingId !== null}
        name={deletingQuestion?.question_text ?? ""}
        loading={isPending}
        onClose={() => setDeletingId(null)}
        onConfirm={() => void handleDelete()}
      />
    </>
  )
}
