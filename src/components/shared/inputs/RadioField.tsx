import React from "react"
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Option } from "@/types/customFormField.types"
import type { SharedFieldController } from "./fieldTypes"
interface RadioFieldProps {
  field: SharedFieldController
  disabled?: boolean
  inputClassName?: string
  options?: Option[]
}

export const RadioField: React.FC<RadioFieldProps> = ({
  field,
  disabled,
  inputClassName,
  options = [],
}) => {
  return (
    <RadioGroup
      value={field.value}
      onValueChange={field.onChange}
      disabled={disabled}
      className={cn(inputClassName)}
    >
      {options.map((option) => (
        <div key={option.value} className="flex items-center rtl:flex-row-reverse gap-2  space-x-2">
          <RadioGroupItem value={option.value} id={option.value} disabled={option.disabled} />
          <Label htmlFor={option.value}>{option.label}</Label>
        </div>
      ))}
    </RadioGroup>
  )
}
