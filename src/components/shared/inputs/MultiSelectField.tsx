import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { ChevronDown, Check } from "lucide-react"
import { Option } from "@/types/customFormField.types"
interface MultiSelectFieldProps {
  field: any
  placeholder?: string
  disabled?: boolean
  inputClassName?: string
  options?: Option[]
}

export const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  field,
  placeholder,
  disabled,
  inputClassName,
  options = [],
}) => {
  const { t } = useTranslation("common")
  const [open, setOpen] = useState(false)

  const handleToggle = (value: string) => {
    const currentValues = field.value || []
    if (currentValues.includes(value)) {
      field.onChange(currentValues.filter((v: string) => v !== value))
    } else {
      field.onChange([...currentValues, value])
    }
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        className={cn(
          "w-full justify-start text-start font-normal",
          !field.value?.length && "text-muted-foreground",
          inputClassName,
        )}
        disabled={disabled}
        onClick={() => setOpen(!open)}
      >
        <ChevronDown className="me-2 h-4 w-4" />
        {field.value?.length ? (
          <div className="flex gap-1 flex-wrap">
            {field.value.map((value: string) => (
              <Badge key={value} variant="secondary" className="text-xs">
                {options.find((opt) => opt.value === value)?.label || value}
              </Badge>
            ))}
          </div>
        ) : (
          placeholder || t("inputs.selectOptions")
        )}
      </Button>
      {open && (
        <div className="absolute top-full z-50 mt-1 bg-white border rounded-md shadow-lg w-full">
          <Command>
            <CommandInput placeholder={t("inputs.searchOptions")} />
            <CommandList>
              <CommandEmpty>{t("inputs.noOptionsFound")}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleToggle(option.value)}
                    disabled={option.disabled}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        field.value?.includes(option.value) ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  )
}
