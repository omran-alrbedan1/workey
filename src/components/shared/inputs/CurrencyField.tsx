import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import type { SharedFieldController } from "./fieldTypes"

interface CurrencyFieldProps {
  field: SharedFieldController
  placeholder?: string
  disabled?: boolean
  inputClassName?: string
  ariaLabel?: string
  ariaDescribedBy?: string
  currency?: string
  locale?: string
}

const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "EUR",
  GBP: "GBP",
}

export const CurrencyField: React.FC<CurrencyFieldProps> = ({
  field,
  placeholder,
  disabled,
  inputClassName,
  ariaLabel,
  ariaDescribedBy,
  currency = "USD",
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
        placeholder={placeholder || "0.00"}
        disabled={disabled}
        className={cn(inputClassName, "px-6 py-5 text-base ltr:pl-14 rtl:pr-14")}
        value={displayValue}
        onChange={handleChange}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      />
      <div className="absolute top-1/2 -translate-y-1/2 text-sm text-muted-foreground transition-colors group-focus-within:text-primary ltr:left-4 rtl:right-4">
        {currencySymbols[currency] ?? currency}
      </div>
    </div>
  )
}
