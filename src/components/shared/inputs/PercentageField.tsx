import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface PercentageFieldProps {
  field: any
  placeholder?: string
  disabled?: boolean
  inputClassName?: string
  ariaLabel?: string
  ariaDescribedBy?: string
  min?: number
  max?: number
}

export const PercentageField: React.FC<PercentageFieldProps> = ({
  field,
  placeholder,
  disabled,
  inputClassName,
  ariaLabel,
  ariaDescribedBy,
  min,
  max,
}) => {
  const [displayValue, setDisplayValue] = useState("")

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^\d.]/g, "")
    const numValue = parseFloat(value) || 0
    setDisplayValue(value)
    field.onChange(numValue)
  }

  return (
    <div className="group relative">
      <Input
        {...field}
        type="text"
        placeholder={placeholder || "0"}
        disabled={disabled}
        className={cn(inputClassName, "px-6 py-5 text-base ltr:pr-14 rtl:pl-14")}
        value={displayValue}
        onChange={handleChange}
        min={min}
        max={max}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      />
      <div className="absolute top-1/2 -translate-y-1/2 text-sm text-muted-foreground transition-colors group-focus-within:text-primary ltr:right-4 rtl:left-4">
        %
      </div>
    </div>
  )
}
