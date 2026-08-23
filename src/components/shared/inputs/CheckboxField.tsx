import React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { SharedFieldController } from "./fieldTypes"

interface CheckboxFieldProps {
  field: SharedFieldController
  name: string
  label?: string
  disabled?: boolean
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({ field, name, label, disabled }) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={name}
        checked={field.value}
        onCheckedChange={field.onChange}
        disabled={disabled}
      />
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>
    </div>
  )
}
