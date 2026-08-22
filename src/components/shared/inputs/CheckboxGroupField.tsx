import React from "react"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Option } from "@/types/customFormField.types"
interface CheckboxGroupFieldProps {
  field: any
  disabled?: boolean
  inputClassName?: string
  options?: Option[]
}

export const CheckboxGroupField: React.FC<CheckboxGroupFieldProps> = ({
  field,
  disabled,
  inputClassName,
  options = [],
}) => {
  const handleToggle = (value: string) => {
    const currentValues = field.value || []
    if (currentValues.includes(value)) {
      field.onChange(currentValues.filter((v: string) => v !== value))
    } else {
      field.onChange([...currentValues, value])
    }
  }

  return (
    <div className={cn("space-y-2", inputClassName)}>
      {options.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <Checkbox
            id={option.value}
            checked={field.value?.includes(option.value)}
            onCheckedChange={() => handleToggle(option.value)}
            disabled={option.disabled || disabled}
          />
          <Label htmlFor={option.value} className="text-sm font-medium">
            {option.label}
          </Label>
        </div>
      ))}
    </div>
  )
}
