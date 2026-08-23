import { useState } from "react"
import { HelpCircle, Plus, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import EmptyState from "@/components/shared/states/EmptyState"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import PanelCard from "./PanelCard"

interface PreparedQuestionsCardProps {
  isRtl: boolean
}

export default function PreparedQuestionsCard({ isRtl }: PreparedQuestionsCardProps) {
  const { t } = useTranslation("employerInterviews")
  const [questions, setQuestions] = useState<string[]>([])
  const [draft, setDraft] = useState("")

  const addQuestion = () => {
    const value = draft.trim()
    if (!value) return
    setQuestions((current) => [...current, value])
    setDraft("")
  }

  const removeQuestion = (index: number) => {
    setQuestions((current) => current.filter((_, i) => i !== index))
  }

  return (
    <PanelCard icon={HelpCircle} title={t("hrAssistance.preparedQuestions.title")}>
      <div className={cn("flex gap-2", isRtl && "flex-row-reverse")}>
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              addQuestion()
            }
          }}
          placeholder={t("hrAssistance.preparedQuestions.placeholder")}
        />
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="shrink-0"
          onClick={addQuestion}
          aria-label={t("hrAssistance.preparedQuestions.add")}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {questions.length === 0 ? (
        <EmptyState
          title={t("hrAssistance.preparedQuestions.empty")}
          description={t("hrAssistance.preparedQuestions.empty")}
          icon={HelpCircle}
          className="rounded-lg border border-dashed border-border/60 bg-background-secondary/40 py-8"
        />
      ) : (
        <ul className="space-y-2">
          {questions.map((question, index) => (
            <li
              key={`${question}-${index}`}
              className={cn(
                "flex items-start justify-between gap-2 rounded-md border border-border p-2",
                isRtl && "flex-row-reverse text-end",
              )}
            >
              <span className="text-sm text-text-primary">{question}</span>
              <button
                type="button"
                onClick={() => removeQuestion(index)}
                className="mt-0.5 shrink-0 text-text-muted transition-colors hover:text-destructive"
                aria-label={t("common:remove")}
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </PanelCard>
  )
}
