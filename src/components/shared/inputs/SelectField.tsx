  "use client"

  import React from "react"
  import { useTranslation } from "react-i18next"
  import { cn } from "@/lib/utils"
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
  import { Option } from "@/types/customFormField.types"
  import { LucideIcon } from "lucide-react"

  const EMPTY_OPTION_VALUE = "__empty_select_option__"

  interface SelectFieldProps {
    field: any
    placeholder?: string
    disabled?: boolean
    inputClassName?: string
    options?: Option[]
  }

  const OptionWithIcon: React.FC<{ icon?: LucideIcon | string; label: string; className?: string }> = ({ 
    icon: Icon, 
    label, 
    className 
  }) => {
    if (Icon && typeof Icon === 'string') {
      return (
        <div className={cn("flex items-center gap-2", className)}>
          <span className="text-base">{Icon}</span>
          <span>{label}</span>
        </div>
      )
    }
    
    if (Icon) {
      const IconComponent = Icon

      return (
        <div className={cn("flex items-center gap-2", className)}>
          <IconComponent className="h-4 w-4 text-primary" />
          <span>{label}</span>
        </div>
      )
    }
    
    // No icon
    return <span>{label}</span>
  }

  export const SelectField: React.FC<SelectFieldProps> = ({
    field,
    placeholder,
    disabled,
    inputClassName,
    options = [],
  }) => {
    const { i18n } = useTranslation()
    const fieldValue = field.value ?? ""
    const selectValue = field.value === "" ? EMPTY_OPTION_VALUE : fieldValue
    const selectedOption = field.value == null ? undefined : options.find(opt => opt.value === field.value)
    const SelectedIcon = selectedOption?.icon
    const dir = i18n.dir()
    
    return (
      <Select
        value={selectValue}
        onValueChange={(value) => field.onChange(value === EMPTY_OPTION_VALUE ? "" : value)}
        disabled={disabled}
        dir={dir}
      >
        <SelectTrigger className={cn("text-start", inputClassName)}>
          <SelectValue placeholder={placeholder}>
            {selectedOption && (
              <div className="flex items-center gap-2 text-start rtl:flex-row-reverse">
                {SelectedIcon && (
                  typeof SelectedIcon === 'string' ? (
                    <span className="text-base">{SelectedIcon}</span>
                  ) : (
                    <SelectedIcon className="h-4 w-4 text-primary" />
                  )
                )}
                <span>{selectedOption.label}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="text-start" dir={dir}>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value === "" ? EMPTY_OPTION_VALUE : option.value}
              disabled={option.disabled}
            >
              <OptionWithIcon 
                icon={option.icon} 
                label={option.label} 
                className="w-full py-1 text-start rtl:flex-row-reverse"
              />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }
