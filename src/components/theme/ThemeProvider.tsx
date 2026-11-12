"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"

export type Theme = "light" | "dark"

type ThemeContextValue = {
    theme: Theme
    isDark: boolean
    toggle: () => void
    setTheme: (theme: Theme) => void
}

const STORAGE_KEY = "vitalis-theme"

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("light")

    useEffect(() => {
        try {
            const stored = window.localStorage.getItem(STORAGE_KEY)
            if (stored === "dark" || stored === "light") setThemeState(stored)
        } catch {
            /* localStorage indisponível */
        }
    }, [])

    const setTheme = useCallback((next: Theme) => {
        setThemeState(next)
        try {
            window.localStorage.setItem(STORAGE_KEY, next)
        } catch {
            /* localStorage indisponível */
        }
    }, [])

    const toggle = useCallback(() => {
        setThemeState((prev) => {
            const next: Theme = prev === "dark" ? "light" : "dark"
            try {
                window.localStorage.setItem(STORAGE_KEY, next)
            } catch {
                /* localStorage indisponível */
            }
            return next
        })
    }, [])

    const value = useMemo<ThemeContextValue>(
        () => ({ theme, isDark: theme === "dark", toggle, setTheme }),
        [theme, toggle, setTheme]
    )

    return (
        <ThemeContext.Provider value={value}>
            <div className={theme === "dark" ? "dark" : undefined} data-theme={theme}>
                {children}
            </div>
        </ThemeContext.Provider>
    )
}

export function useTheme(): ThemeContextValue {
    const ctx = useContext(ThemeContext)
    if (!ctx) {
        throw new Error("useTheme deve ser usado dentro de <ThemeProvider>")
    }
    return ctx
}
