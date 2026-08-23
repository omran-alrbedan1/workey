import { useEffect, useState } from "react"
import { StickyNote } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { showErrorToast } from "@/lib/toast"
import PanelCard from "./PanelCard"

interface PrivateNotesCardProps {
  savedNote?: string | null
  canEdit: boolean
  isSaving: boolean
  onSave: (value: string) => Promise<unknown>
}

export default function PrivateNotesCard({
  savedNote,
  canEdit,
  isSaving,
  onSave,
}: PrivateNotesCardProps) {
  const { t } = useTranslation("employerInterviews")
  const [draft, setDraft] = useState(savedNote ?? "")

  useEffect(() => {
    setDraft(savedNote ?? "")
  }, [savedNote])

  const dirty = draft !== (savedNote ?? "")

  return (
    <PanelCard
      icon={StickyNote}
      title={t("hrAssistance.privateNotes.title")}
      hint={t("hrAssistance.privateNotes.hint")}
    >
      <Textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={t("hrAssistance.privateNotes.placeholder")}
        rows={6}
        disabled={isSaving || !canEdit}
        className="resize-none"
      />
      <div className="flex justify-end">
        <Button
          size="sm"
          disabled={!dirty || isSaving || !canEdit}
          onClick={() => {
            void onSave(draft).catch((error) => showErrorToast(error))
          }}
        >
          {isSaving ? t("hrAssistance.privateNotes.saving") : t("hrAssistance.privateNotes.save")}
        </Button>
      </div>
    </PanelCard>
  )
}
