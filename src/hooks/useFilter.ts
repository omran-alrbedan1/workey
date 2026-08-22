import { useState, useMemo, useCallback, useEffect } from "react"
import { useSearchParams, useNavigate, useLocation } from "react-router-dom"

export interface FilterConfig<T = any> {
  key: string
  label: string
  type: "search" | "select" | "multi-select" | "date" | "range"
  options?: Array<{ value: string; label: string }>
  getValue?: (item: T) => string | string[] | number
}

export interface UseFiltersOptions<T> {
  data: T[]
  config: FilterConfig<T>[]
  initialFilters?: Record<string, any>
  syncWithURL?: boolean
}

function parseURLFilters(
  searchParams: URLSearchParams,
  config: FilterConfig<any>[],
): Record<string, any> {
  const result: Record<string, any> = {}
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

function serializeFiltersToParams(filters: Record<string, any>): URLSearchParams {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (!value || value === "" || value === "all") return
    if (Array.isArray(value) && value.length === 0) return

    if (value?.from !== undefined || value?.to !== undefined) {
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

export function useFilters<T extends Record<string, any>>({
  data,
  config,
  initialFilters = {},
  syncWithURL = true,
}: UseFiltersOptions<T>) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [filters, setFilters] = useState<Record<string, any>>(() => {
    if (syncWithURL) {
      return parseURLFilters(searchParams, config)
    }
    const initial: Record<string, any> = {}
    config.forEach((cfg) => {
      initial[cfg.key] = initialFilters[cfg.key] ?? (cfg.type === "range" ? undefined : "")
    })
    return initial
  })

  // Sync URL → state on back/forward navigation
  useEffect(() => {
    if (!syncWithURL) return
    const handlePop = () => {
      const params = new URLSearchParams(window.location.search)
      setFilters(parseURLFilters(params, config))
    }
    window.addEventListener("popstate", handlePop)
    return () => window.removeEventListener("popstate", handlePop)
  }, [config, syncWithURL])

  /**
   * The single source of truth for applying filters.
   * Accepts new filter values, updates state, and syncs URL.
   */
  const applyFilters = useCallback(
    (newFilters: Record<string, any>) => {
      // Normalize: replace 'all' / undefined with ""
      const normalized: Record<string, any> = {}
      config.forEach((cfg) => {
        const val = newFilters[cfg.key]
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
    const reset: Record<string, any> = {}
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
        if (typeof value === "object") return value.from || value.to
        return true
      }),
    [filters],
  )

  const activeFiltersCount = useMemo(
    () =>
      Object.values(filters).filter((value) => {
        if (!value || value === "" || value === "all") return false
        if (Array.isArray(value)) return value.length > 0
        if (typeof value === "object") return value.from || value.to
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
            const value = cfg.getValue!(item)
            if (Array.isArray(value)) {
              return value.some((v) => v.toLowerCase().includes(filterValue.toLowerCase()))
            }
            return String(value).toLowerCase().includes(filterValue.toLowerCase())
          })
          break

        case "select":
          result = result.filter((item) => {
            const value = cfg.getValue ? cfg.getValue(item) : String(item[cfg.key])
            return value === filterValue
          })
          break

        case "multi-select":
          if (Array.isArray(filterValue) && filterValue.length > 0) {
            result = result.filter((item) => {
              const value = cfg.getValue ? cfg.getValue(item) : String(item[cfg.key])
              return filterValue.includes(value)
            })
          }
          break

        case "date":
          result = result.filter((item) => {
            const value = cfg.getValue ? cfg.getValue(item) : String(item[cfg.key])
            return value === filterValue
          })
          break

        case "range":
          if (filterValue?.from !== undefined || filterValue?.to !== undefined) {
            result = result.filter((item) => {
              const value = cfg.getValue
                ? (cfg.getValue(item) as number)
                : new Date(item[cfg.key]).getTime()
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
        const value = cfg.getValue ? cfg.getValue(item) : String(item[cfg.key])
        if (Array.isArray(value)) value.forEach((v) => values.add(v))
        else values.add(String(value))
      })
      return Array.from(values)
        .sort()
        .map((value) => ({ value, label: value }))
    },
    [data, config],
  )

  // Form-compatible shape: range stays as-is, others default to ""
  const filtersForForm = useMemo(() => {
    const form: Record<string, any> = {}
    config.forEach((cfg) => {
      form[cfg.key] = filters[cfg.key] ?? (cfg.type === "range" ? undefined : "")
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
