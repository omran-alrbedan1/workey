import { useState } from "react"
import { Check, Plus, X } from "lucide-react"
import { useTranslation } from "react-i18next"
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
import type { EmployerJobSkill } from "../types/employerJobs.types"

export default function EmployerJobSkills({
  skills,
  availableSkills,
  isLoadingSkills,
  skillsError,
  isPending,
  onAttach,
  onDetach,
}: {
  skills: EmployerJobSkill[]
  availableSkills: EmployerJobSkill[]
  isLoadingSkills: boolean
  skillsError: boolean
  isPending: boolean
  onAttach: (skillIds: Array<string | number>) => Promise<unknown>
  onDetach: (skillId: string | number) => void
}) {
  const { t } = useTranslation("employerJobs")
  const [selected, setSelected] = useState<Array<string | number>>([])
  const attachedIds = new Set(skills.map((skill) => String(skill.id)))
  const choices = availableSkills.filter((skill) => !attachedIds.has(String(skill.id)))

  const attach = async () => {
    if (!selected.length) return
    await onAttach(selected)
    setSelected([])
  }

  return (
    <section className="space-y-4 rounded-lg relative overflow-visible border border-border bg-background-card p-5 shadow-card">
      <div>
        <h2 className="font-semibold text-text-primary">{t("skills.title")}</h2>
        <p className="text-sm text-text-muted">{t("skills.description")}</p>
      </div>
      <div className="overflow-hidden rounded-md border border-border">
        <Command>
          <CommandInput placeholder={t("skills.searchPlaceholder")} disabled={isLoadingSkills} />
          <CommandList>
            <CommandEmpty>
              {isLoadingSkills
                ? t("skills.loading")
                : skillsError
                  ? t("skills.loadError")
                  : t("skills.noResults")}
            </CommandEmpty>
            <CommandGroup>
              {choices.map((skill) => {
                const isSelected = selected.some((id) => String(id) === String(skill.id))
                return (
                  <CommandItem
                    key={skill.id}
                    value={`${skill.name ?? ""} ${skill.id}`}
                    disabled={isPending}
                    onSelect={() =>
                      setSelected((current) =>
                        isSelected
                          ? current.filter((id) => String(id) !== String(skill.id))
                          : [...current, skill.id],
                      )
                    }
                  >
                    <Check className={cn(isSelected ? "opacity-100" : "opacity-0")} />
                    <span>{skill.name || `#${skill.id}`}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-text-muted">
          {selected.length
            ? t("skills.selectedCount", { count: selected.length })
            : t("skills.selectHint")}
        </p>
        <Button
          type="button"
          disabled={isPending || selected.length === 0}
          onClick={() => void attach()}
          className="text-white"
        >
          <Plus /> {t("skills.attach")}
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.length === 0 && <p className="text-sm text-text-muted">{t("skills.empty")}</p>}
        {skills.map((skill) => (
          <Badge key={skill.id} variant="secondary" className="gap-1.5 py-1.5 text-white">
            {skill.name || `#${skill.id}`}
            <button
              type="button"
              disabled={isPending}
              className="rounded-full hover:text-red-600 text-white disabled:opacity-50"
              aria-label={t("skills.detachLabel", { name: skill.name || skill.id })}
              onClick={() => onDetach(skill.id)}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </Badge>
        ))}
      </div>
    </section>
  )
}
