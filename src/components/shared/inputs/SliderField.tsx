import React from "react"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import type { SharedFieldController } from "./fieldTypes"

interface SliderFieldProps {
  field: SharedFieldController
  disabled?: boolean
  inputClassName?: string
  min?: number
  max?: number
  step?: number
  sliderMarks?: Array<{ value: number; label: string }>
}

export const SliderField: React.FC<SliderFieldProps> = ({
  field,
  disabled,
  inputClassName,
  min = 0,
  max = 100,
  step = 1,
  sliderMarks,
}) => {
  return (
    <div className="space-y-2">
      <Slider
        value={[field.value]}
        onValueChange={(value) => field.onChange(Array.isArray(value) ? value[0] : value)}
        max={max}
        min={min}
        step={step}
        disabled={disabled}
        className={cn(inputClassName)}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min}</span>
        <span className="font-medium text-foreground">{field.value}</span>
        <span>{max}</span>
      </div>
      {sliderMarks && (
        <div className="flex justify-between text-xs text-muted-foreground">
          {sliderMarks.map((mark) => (
            <span key={mark.value}>{mark.label}</span>
          ))}
        </div>
      )}
    </div>
  )
}
