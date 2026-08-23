import { useState, useMemo, useCallback, useEffect } from "react"
import { useSearchParams, useNavigate, useLocation } from "react-router-dom"

type RangeFilterValue = {
  from?: Date
  to?: Date
}

export type FilterValue = string | string[] | number | RangeFilterValue | undefined
type FilterMap = Record<string, FilterValue>

export interface FilterConfig<T extends object = object> {
  key: string
  label: string
  type: "search" | "select" | "multi-select" | "date" | "range"
  options?: Array<{ value: string; label: string }>
  getValue?: (item: T) => string | string[] | number | null | undefined
}

export interface UseFiltersOptions<
  TData extends object,
  TFilters extends object = Record<string, FilterValue>,
> {
  data: TData[]
  config: FilterConfig<TData>[]
  initialFilters?: Partial<TFilters>
  syncWithURL?: boolean
}

function isRangeFilterValue(value: FilterValue): value is RangeFilterValue {
  return Boolean(value && typeof value === "object" && ("from" in value || "to" in value))
}

function getFallbackValue(item: object, key: string): string | number {
  const value = (item as Record<string, unknown>)[key]
  return value == null ? "" : (value as string | number)
}

function parseURLFilters<TData extends object>(
  searchParams: URLSearchParams,
  config: FilterConfig<TData>[],
): FilterMap {
  const result: FilterMap = {}
  config.forEach((cfg) => {
    const urlValue = searchParams.get(cfg.key)
    if (urlValue !== null) {
      if (cfg.type === "range") {
        const [from, to] = urlValue.split("|")
        result[cfg.key] = {
          from: from ? new Date(parseInt(from)) : undefined,
          to: to ? new Date(parseInt(to)) : undefined,
        }
      } else if (cfg.type === "multi-select") {
        result[cfg.key] = urlValue.split(",")
      } else {
        result[cfg.key] = urlValue
      }
    } else {
      result[cfg.key] = cfg.type === "range" ? undefined : ""
    }
  })
  return result
}

function serializeFiltersToParams(filters: FilterMap): URLSearchParams {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (!value || value === "" || value === "all") return
    if (Array.isArray(value) && value.length === 0) return

    if (isRangeFilterValue(value)) {
      const from = value.from ? value.from.getTime() : ""
      const to = value.to ? value.to.getTime() : ""
      params.set(key, `${from}|${to}`)
    } else if (Array.isArray(value)) {
      params.set(key, value.join(","))
    } else {
      params.set(key, String(value))
    }
  })
  return params
}

export function useFilters<
  TData extends object,
  TFilters extends object = Record<string, FilterValue>,
>({
  data,
  config,
  initialFilters = {},
  syncWithURL = true,
}: UseFiltersOptions<TData, TFilters>) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [filters, setFilters] = useState<FilterMap>(() => {
    if (syncWithURL) {
      return parseURLFilters(searchParams, config)
    }
    const initial: FilterMap = {}
    const initialFilterMap = initialFilters as FilterMap
    config.forEach((cfg) => {
      initial[cfg.key] = initialFilterMap[cfg.key] ?? (cfg.type === "range" ? undefined : "")
    })
    return initial
  })

  // Sync URL -> state on back/forward navigation.
  useEffect(() => {
    if (!syncWithURL) return
    const handlePop = () => {
      const params = new URLSearchParams(window.location.search)
      setFilters(parseURLFilters(params, config))
    }
    window.addEventListener("popstate", handlePop)
    return () => window.removeEventListener("popstate", handlePop)
  }, [config, syncWithURL])

  const applyFilters = useCallback(
    (newFilters: TFilters) => {
      const newFilterMap = newFilters as FilterMap
      const normalized: FilterMap = {}
      config.forEach((cfg) => {
        const val = newFilterMap[cfg.key]
        if (cfg.type === "range") {
          normalized[cfg.key] = val ?? undefined
        } else {
          normalized[cfg.key] = !val || val === "all" ? "" : val
        }
      })

      setFilters(normalized)

      if (syncWithURL) {
        const params = serializeFiltersToParams(normalized)
        const qs = params.toString()
        navigate(qs ? `${location.pathname}?${qs}` : location.pathname, { replace: true })
      }
    },
    [config, syncWithURL, location.pathname, navigate],
  )

  const resetFilters = useCallback(() => {
    const reset: FilterMap = {}
    config.forEach((cfg) => {
      reset[cfg.key] = cfg.type === "range" ? undefined : ""
    })
    setFilters(reset)
    if (syncWithURL) {
      navigate(location.pathname, { replace: true })
    }
  }, [config, syncWithURL, location.pathname, navigate])

  const hasActiveFilters = useMemo(
    () =>
      Object.entries(filters).some(([, value]) => {
        if (!value || value === "" || value === "all") return false
        if (Array.isArray(value)) return value.length > 0
        if (isRangeFilterValue(value)) return Boolean(value.from || value.to)
        return true
      }),
    [filters],
  )

  const activeFiltersCount = useMemo(
    () =>
      Object.values(filters).filter((value) => {
        if (!value || value === "" || value === "all") return false
        if (Array.isArray(value)) return value.length > 0
        if (isRangeFilterValue(value)) return Boolean(value.from || value.to)
        return true
      }).length,
    [filters],
  )

  const filteredData = useMemo(() => {
    let result = [...data]

    config.forEach((cfg) => {
      const filterValue = filters[cfg.key]
      if (!filterValue || filterValue === "" || filterValue === "all") return

      switch (cfg.type) {
        case "search":
          result = result.filter((item) => {
            const value = cfg.getValue ? cfg.getValue(item) : getFallbackValue(item, cfg.key)
            if (Array.isArray(value)) {
              return value.some((v) => v.toLowerCase().includes(String(filterValue).toLowerCase()))
            }
            return String(value).toLowerCase().includes(String(filterValue).toLowerCase())
          })
          break

        case "select":
          result = result.filter((item) => {
            const value = cfg.getValue ? cfg.getValue(item) : getFallbackValue(item, cfg.key)
            return value === filterValue
          })
          break

        case "multi-select":
          if (Array.isArray(filterValue) && filterValue.length > 0) {
            result = result.filter((item) => {
              const value = cfg.getValue ? cfg.getValue(item) : getFallbackValue(item, cfg.key)
              return filterValue.includes(String(value))
            })
          }
          break

        case "date":
          result = result.filter((item) => {
            const value = cfg.getValue ? cfg.getValue(item) : getFallbackValue(item, cfg.key)
            return value === filterValue
          })
          break

        case "range":
          if (isRangeFilterValue(filterValue)) {
            result = result.filter((item) => {
              const rawValue = cfg.getValue ? cfg.getValue(item) : getFallbackValue(item, cfg.key)
              const value = Number(rawValue)
              if (filterValue.from && value < filterValue.from.getTime()) return false
              if (filterValue.to && value > filterValue.to.getTime()) return false
              return true
            })
          }
          break
      }
    })

    return result
  }, [data, filters, config])

  const getFilterOptions = useCallback(
    (key: string) => {
      const cfg = config.find((c) => c.key === key)
      if (!cfg) return []
      if (cfg.options) return cfg.options
      const values = new Set<string>()
      data.forEach((item) => {
        const value = cfg.getValue ? cfg.getValue(item) : getFallbackValue(item, cfg.key)
        if (Array.isArray(value)) value.forEach((v) => values.add(String(v)))
        else values.add(String(value))
      })
      return Array.from(values)
        .sort()
        .map((value) => ({ value, label: value }))
    },
    [data, config],
  )

  const filtersForForm = useMemo(() => {
    const form: Partial<TFilters> = {}
    config.forEach((cfg) => {
      ;(form as FilterMap)[cfg.key] = filters[cfg.key] ?? (cfg.type === "range" ? undefined : "")
    })
    return form
  }, [filters, config])

  return {
    filters,
    filtersForForm,
    filteredData,
    hasActiveFilters,
    activeFiltersCount,
    applyFilters,
    resetFilters,
    getFilterOptions,
  }
}
