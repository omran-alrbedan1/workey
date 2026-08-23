import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Star } from "lucide-react"
import type { SharedFieldController } from "./fieldTypes"

interface RatingFieldProps {
  field: SharedFieldController
  disabled?: boolean
  inputClassName?: string
  maxRating?: number
}

export const RatingField: React.FC<RatingFieldProps> = ({
  field,
  disabled,
  inputClassName,
  maxRating = 5,
}) => {
  const [hoveredRating, setHoveredRating] = useState(0)

  return (
    <div className={cn("flex gap-1", inputClassName)}>
      {Array.from({ length: maxRating }, (_, i) => i + 1).map((rating) => (
        <button
          key={rating}
          type="button"
          className="transition-colors"
          onClick={() => field.onChange(rating)}
          onMouseEnter={() => setHoveredRating(rating)}
          onMouseLeave={() => setHoveredRating(0)}
          disabled={disabled}
        >
          <Star
            className={cn(
              "h-6 w-6",
              rating <= (hoveredRating || field.value || 0)
                ? "fill-primary text-primary"
                : "text-muted-foreground",
            )}
          />
        </button>
      ))}
    </div>
  )
}
