import { useState, useMemo } from "react"

export type FilterType = "search" | "select" | "dateRange"

export interface FilterConfig<T> {
  key: string
  type: FilterType
  getValue: (item: T) => any
}

interface UseFiltersProps<T> {
  data: T[]
  config: FilterConfig<T>[]
  initialFilters?: Record<string, any>
}

export function useFilters<T extends object>({
  data,
  config,
  initialFilters = {},
}: UseFiltersProps<T>) {
  const [filters, setFilters] = useState<Record<string, any>>(initialFilters)

  const applyFilters = (newFilters: Record<string, any>) => {
    const updatedFilters: Record<string, any> = {}
    for (const key in newFilters) {
      if (newFilters[key] !== "" && newFilters[key] !== null && newFilters[key] !== undefined) {
        if (key === "status" && newFilters[key] === "all") continue
        updatedFilters[key] = newFilters[key]
      }
    }
    setFilters(updatedFilters)
  }

  const resetFilters = () => {
    setFilters({})
  }

  const filteredData = useMemo(() => {
    if (Object.keys(filters).length === 0) {
      return data
    }
    return data.filter((item) => {
      for (const filter of config) {
        const filterValue = filters[filter.key]
        if (filterValue === undefined || filterValue === null || filterValue === "") continue

        const itemValue = filter.getValue(item)

        switch (filter.type) {
          case "search": {
            const query = String(filterValue).toLowerCase()
            const valuesToSearch = Array.isArray(itemValue) ? itemValue : [itemValue]
            if (!valuesToSearch.some((val) => String(val).toLowerCase().includes(query)))
              return false
            break
          }
          case "select":
            if (itemValue !== filterValue) return false
            break
          case "dateRange": {
            const { from, to } = filterValue
            const itemTimestamp = new Date(itemValue).getTime()
            if (from && itemTimestamp < new Date(from).getTime()) {
              return false
            }
            if (to) {
              const toDate = new Date(to)
              toDate.setHours(23, 59, 59, 999)
              if (itemTimestamp > toDate.getTime()) return false
            }
            break
          }
        }
      }
      return true
    })
  }, [data, config, filters])

  const hasActiveFilters = useMemo(() => Object.keys(filters).length > 0, [filters])

  return {
    filtersForForm: filters,
    filteredData,
    applyFilters,
    resetFilters,
    hasActiveFilters,
  }
}
