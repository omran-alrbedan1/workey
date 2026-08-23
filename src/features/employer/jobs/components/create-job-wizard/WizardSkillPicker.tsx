import { Plus, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import EmptyState from "@/components/shared/states/EmptyState"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"
import type { JobSkillAssignmentInput } from "../../types/employerJobs.types"
import { WEIGHTS } from "./wizardConfig"

export default function WizardSkillPicker({
  titleKey,
  groupLabel,
  choices,
  isLoading,
  loadFailed,
  selected,
  takenIds,
  isPending,
  onAdd,
  onRemove,
  onWeightChange,
}: {
  titleKey: string
  groupLabel: string
  choices: { id: string | number; name?: string }[]
  isLoading: boolean
  loadFailed: boolean
  selected: JobSkillAssignmentInput[]
  takenIds?: Array<string | number>
  isPending: boolean
  onAdd: (skill: { id: string | number; name?: string }) => void
  onRemove: (skillId: string | number) => void
  onWeightChange: (skillId: string | number, weight: number) => void
}) {
  const { t } = useTranslation("employerJobs")
  const selectedIds = new Set(selected.map((item) => String(item.skill_id)))
  const takenElsewhere = new Set((takenIds ?? []).map((id) => String(id)))
  const available = choices.filter(
    (skill) => !selectedIds.has(String(skill.id)) && !takenElsewhere.has(String(skill.id)),
  )

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <h3 className="font-semibold text-text-primary">{t(titleKey)}</h3>
      <div className="overflow-hidden rounded-md border border-border">
        <Command>
          <CommandInput placeholder={t("skills.searchPlaceholder")} disabled={isLoading} />
          <CommandList>
            <CommandEmpty>
              {isLoading
                ? t("skills.loading")
                : loadFailed
                  ? t("skills.loadError")
                  : t("skills.noResults")}
            </CommandEmpty>
            <CommandGroup>
              {available.map((skill) => (
                <CommandItem
                  key={skill.id}
                  value={`${skill.name ?? ""} ${skill.id}`}
                  onSelect={() => onAdd(skill)}
                >
                  <Plus />
                  <span>{skill.name || `#${skill.id}`}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
      {selected.length === 0 ? (
        <EmptyState
          title={t("wizard.selectedEmpty", { group: t(groupLabel) })}
          description={t("wizard.selectedEmpty", { group: t(groupLabel) })}
          className="rounded-md border border-dashed border-border/60 bg-background-secondary/40 py-6"
        />
      ) : (
        <ul className="space-y-2">
          {selected.map((item) => {
            const meta = choices.find((choice) => String(choice.id) === String(item.skill_id))
            return (
              <li
                key={String(item.skill_id)}
                className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border bg-background px-3 py-2"
              >
                <span className="text-sm font-medium text-text-primary">
                  {meta?.name || `#${item.skill_id}`}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-muted">{t("wizard.weightLabel")}</span>
                  <div className="flex items-center gap-1">
                    {WEIGHTS.map((weight) => (
                      <button
                        key={weight}
                        type="button"
                        disabled={isPending}
                        aria-label={`${t("wizard.weightLabel")} ${weight}`}
                        aria-pressed={item.weight === weight}
                        onClick={() => onWeightChange(item.skill_id, weight)}
                        className={cn(
                          "h-7 w-7 rounded-md border border-border text-xs font-medium transition-colors",
                          item.weight === weight
                            ? "bg-primary text-white"
                            : "bg-background hover:bg-muted",
                          isPending && "opacity-50",
                        )}
                      >
                        {weight}
                      </button>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={isPending}
                    aria-label={t("skills.detachLabel", { name: meta?.name || item.skill_id })}
                    onClick={() => onRemove(item.skill_id)}
                    className="h-7 w-7 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
