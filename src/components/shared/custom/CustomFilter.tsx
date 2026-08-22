// @ts-nocheck
import { useForm, FieldValues, Path, PathValue } from "react-hook-form"
import type { DateRange } from "react-day-picker"
import { FilterX, SlidersHorizontal, XCircle, LucideIcon } from "lucide-react"
import { useEffect, useMemo, ReactNode } from "react"
import { format } from "date-fns"
import { useTranslation } from "react-i18next"

import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Option } from "@/types/customFormField.types"

export interface FilterField<T extends FieldValues> {
  name: Path<T>
  label: string
  type: "text" | "select" | "date" | "date-range"
  placeholder?: string
  icon: LucideIcon
  minWidth?: string
  options?: Option[]
  emptyValue?: PathValue<T, Path<T>>
  getDisplayValue?: (value: PathValue<T, Path<T>>) => ReactNode
  renderBadge?: (value: PathValue<T, Path<T>>, clear: () => void) => ReactNode
}

interface CustomFilterProps<T extends FieldValues> {
  filters: FilterField<T>[]
  onApplyFilters: (values: T) => void
  onResetFilters: () => void
  defaultValues: T
  isLoading?: boolean
  initialFilters?: Partial<T>
  title?: string
  className?: string
}

function isFieldActive<T extends FieldValues>(
  filter: FilterField<T>,
  value: PathValue<T, Path<T>>,
  defaultValue: PathValue<T, Path<T>>,
): boolean {
  const empty = filter.emptyValue !== undefined ? filter.emptyValue : defaultValue

  switch (filter.type) {
    case "date-range": {
      const dr = value as DateRange | undefined
      return !!(dr?.from || dr?.to)
    }
    case "text":
      return typeof value === "string" && value.trim() !== ""
    case "date":
      return value instanceof Date || (typeof value === "string" && value.trim() !== "")
    case "select":
      return value !== empty && value !== undefined && value !== null && value !== ""
    default:
      return false
  }
}

function defaultBadgeLabel<T extends FieldValues>(
  filter: FilterField<T>,
  value: PathValue<T, Path<T>>,
): ReactNode {
  if (filter.getDisplayValue) return filter.getDisplayValue(value)

  if (filter.type === "select") {
    return filter.options?.find((o) => o.value === value)?.label ?? String(value)
  }

  if (filter.type === "date-range") {
    const dr = value as DateRange | undefined
    if (!dr?.from) return null
    const from = format(dr.from, "MMM d, yyyy")
    const to = dr.to ? format(dr.to, "MMM d, yyyy") : "…"
    return `${from} – ${to}`
  }

  if (value instanceof Date) return format(value, "MMM d, yyyy")
  const str = String(value)
  return str.length > 24 ? `${str.slice(0, 24)}…` : str
}

export function CustomFilter<T extends FieldValues>({
  filters,
  onApplyFilters,
  onResetFilters,
  defaultValues,
  isLoading = false,
  initialFilters,
  title = "Filters",
  className = "",
}: CustomFilterProps<T>) {
  const { t } = useTranslation("common")
  const form = useForm<T>({
    defaultValues: defaultValues as T,
  })
  const { control, reset, handleSubmit, watch, setValue } = form
  const currentValues = watch()

  useEffect(() => {
    if (initialFilters && Object.keys(initialFilters).length > 0) {
      reset({ ...defaultValues, ...initialFilters } as T)
    }
  }, [initialFilters, reset])

  const activeFilters = useMemo(
    () =>
      filters.filter((f) =>
        isFieldActive(
          f,
          currentValues[f.name] as PathValue<T, Path<T>>,
          defaultValues[f.name] as PathValue<T, Path<T>>,
        ),
      ),
    [currentValues, filters, defaultValues],
  )

  const hasActive = activeFilters.length > 0

  const onSubmit = (data: T) => {
    onApplyFilters(data)
  }

  const handleReset = () => {
    reset(defaultValues as T)
    onResetFilters()
  }

  const clearField = (name: Path<T>) => {
    setValue(name, defaultValues[name] as PathValue<T, Path<T>>, {
      shouldDirty: true,
      shouldValidate: true,
    })
    setTimeout(() => {
      const currentFormValues = watch()
      onSubmit(currentFormValues)
    }, 0)
  }

  const fieldTypeMap: Record<FilterField<T>["type"], FormFieldType> = {
    text: FormFieldType.INPUT,
    select: FormFieldType.SELECT,
    date: FormFieldType.DATE_PICKER,
    "date-range": FormFieldType.DATE_RANGE,
  }

  return (
    <div
      className={
        "rounded-lg border bg-card p-3 sm:p-4 shadow-sm transition-shadow duration-200 hover:shadow-md " +
        className
      }
    >
      {/* Header */}
      <div className="mb-3 sm:mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-1.5">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
          </div>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-text">
            {title}
            {hasActive && (
              <Badge
                variant="secondary"
                className="h-5 bg-primary/10 px-1.5 py-0 text-xs text-primary"
              >
                {activeFilters.length} {t("active")?.toLowerCase() || "active"}
              </Badge>
            )}
          </h2>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          disabled={!hasActive}
          className="group/btn h-8 px-3 text-xs transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <FilterX className="mr-1.5 h-3.5 w-3.5 transition-transform group-hover/btn:rotate-12" />
          <span className="hidden sm:inline">{t("reset") || "Reset Filters"}</span>
          <span className="sm:hidden">{t("reset") || "Reset"}</span>
          {hasActive && (
            <span className="ml-1.5 rounded-full bg-primary px-1.5 py-0 text-xs text-white transition-all group-hover/btn:bg-red-500">
              {activeFilters.length}
            </span>
          )}
        </Button>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Mobile: Vertical layout */}
          <div className="block sm:hidden space-y-3">
            {filters.map((filter) => {
              const Icon = filter.icon
              return (
                <div key={String(filter.name)}>
                  <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                    <Icon className="mr-1 inline-block h-3.5 w-3.5 text-primary" />
                    {filter.label}
                  </label>
                  <CustomFormField
                    fieldType={fieldTypeMap[filter.type]}
                    control={control}
                    name={filter.name}
                    placeholder={filter.placeholder ?? filter.label}
                    inputClassName="h-8 md:h-10  text-sm"
                    leftIcon={filter.type === "text" ? Icon : undefined}
                    iconPosition="left"
                    options={filter.options}
                  />
                </div>
              )
            })}
            <Button
              type="submit"
              disabled={isLoading}
              size="sm"
              className="w-full h-8 text-sm text-white"
            >
              {isLoading ? t("processing") || "Applying..." : t("filter") || "Apply Filters"}
            </Button>
          </div>

          {/* Desktop: Horizontal layout */}
          <div className="hidden sm:flex sm:flex-wrap sm:items-end sm:gap-2">
            {filters.map((filter) => {
              const Icon = filter.icon
              return (
                <div
                  key={String(filter.name)}
                  className="flex-1"
                  style={{ minWidth: filter.minWidth ?? "150px" }}
                >
                  <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                    <Icon className="mr-1 inline-block h-3.5 w-3.5 text-primary" />
                    {filter.label}
                  </label>
                  <CustomFormField
                    fieldType={fieldTypeMap[filter.type]}
                    control={control}
                    name={filter.name}
                    placeholder={filter.placeholder ?? filter.label}
                    inputClassName="h-10 text-sm p-2"
                    leftIcon={filter.type === "text" ? Icon : undefined}
                    iconPosition="left"
                    options={filter.options}
                  />
                </div>
              )
            })}

            <Button
              type="submit"
              disabled={isLoading}
              size="sm"
              className="h-9 mb-0.5 px-4 text-sm text-white"
            >
              {isLoading ? t("apply") : t("apply") || "Apply"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Active filter badges */}
      {hasActive && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-border pt-3">
          <span className="text-xs text-text-secondary hidden sm:inline">
            {t("activeFilters") || "Active filters:"}
          </span>

          {activeFilters.map((filter) => {
            const value = currentValues[filter.name] as PathValue<T, Path<T>>

            if (filter.renderBadge) {
              return (
                <span key={String(filter.name)}>
                  {filter.renderBadge(value, () => clearField(filter.name))}
                </span>
              )
            }

            const label = defaultBadgeLabel(filter, value)
            if (!label) return null

            return (
              <Badge
                key={String(filter.name)}
                variant="secondary"
                className="h-5 gap-1 bg-primary/10 py-0 text-xs text-primary hover:bg-primary/20"
              >
                <filter.icon className="h-3 w-3 hidden sm:inline-block" />
                <span className="sm:hidden">{filter.label}: </span>
                {label}
                <XCircle
                  className="ml-1 h-3 w-3 cursor-pointer transition-colors hover:text-red-500"
                  onClick={() => clearField(filter.name)}
                />
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}
