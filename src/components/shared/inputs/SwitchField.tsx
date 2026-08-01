import React from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface SwitchFieldProps {
  field: any
  name: string
  label?: string
  disabled?: boolean
}

export const SwitchField: React.FC<SwitchFieldProps> = ({
  field,
  name,
  label,
  disabled,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Switch
        id={name}
        checked={field.value}
        onCheckedChange={field.onChange}
        disabled={disabled}
        dir="ltr"
      />
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>
    </div>
  )
}