import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useTheme } from "./theme-provider"
import { useCallback, useRef } from "react"
import { flushSync } from "react-dom"

interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number
}

export function ModeToggle({
  duration = 700,
  className = "",
  ...props
}: AnimatedThemeTogglerProps) {
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation("common")
  const buttonRef = useRef<HTMLButtonElement>(null)

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current) return

    const newTheme = theme === "dark" ? "light" : "dark"

    if (document.startViewTransition) {
      const transition = document.startViewTransition(() => {
        flushSync(() => {
          setTheme(newTheme)
        })
      })

      await transition.ready

      const { top, left, width, height } = buttonRef.current.getBoundingClientRect()
      const x = left + width / 2
      const y = top + height / 2

      const maxRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      )

      document.documentElement.animate(
        {
          clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRadius}px at ${x}px ${y}px)`],
        },
        {
          duration,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      )

      document.documentElement.animate(
        {
          opacity: [1, 0.8, 1],
        },
        {
          duration: duration / 2,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-old(root)",
        },
      )
    } else {
      setTheme(newTheme)
    }
  }, [theme, setTheme, duration])

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className={`relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background-card text-text-secondary transition hover:bg-background-secondary ${className}`}
      {...props}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-12 scale-0 transition-all dark:scale-100" />
      <span className="sr-only">{t("aria.toggleTheme")}</span>
    </button>
  )
}
