"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import type { Session } from "next-auth"
import Sidebar from "@/components/dashboard/Sidebar"
import Header from "@/components/dashboard/Header"
import { ThemeProvider, useTheme } from "@/components/theme/ThemeProvider"

export default function DashboardLayout({
    children,
    session,
}: {
    children: ReactNode
    session: Session
}) {
    return (
        <ThemeProvider>
            <DashboardShell session={session}>{children}</DashboardShell>
        </ThemeProvider>
    )
}

function DashboardShell({
    children,
    session,
}: {
    children: ReactNode
    session: Session
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { isDark } = useTheme()

    return (
        <div
            className={`min-h-screen text-neutral-900 dark:text-neutral-100 transition-colors duration-300 ${isDark
                    ? "bg-[radial-gradient(ellipse_at_top,rgba(45,149,105,0.14),transparent_60%),linear-gradient(to_bottom,#0b100e,#070a09)]"
                    : "bg-[radial-gradient(ellipse_at_top,rgba(16,142,93,0.06),transparent_60%),linear-gradient(to_bottom,#fafafa,#f5f7f8)]"
                }`}
        >
            <Header
                session={session}
                onToggleSidebar={() => setSidebarOpen((open) => !open)}
            />

            <div className="flex">
                <aside
                    className={`${sidebarOpen ? "translate-x-0 shadow-[20px_0_60px_-20px_rgba(15,23,42,0.25)]" : "-translate-x-full shadow-none"
                        } fixed inset-y-0 left-0 z-40 w-72 bg-white/85 dark:bg-neutral-950/85 backdrop-blur-xl supports-[backdrop-filter]:bg-white/75 supports-[backdrop-filter]:dark:bg-neutral-950/75 border-r border-neutral-200/70 dark:border-neutral-800/80 pt-20 md:pt-0 transition-[transform,box-shadow,background-color,border-color] duration-300 ease-out md:translate-x-0 md:static md:shrink-0 md:shadow-none`}
                    aria-hidden={!sidebarOpen}
                >
                    <Sidebar
                        userRole={session.user.role}
                        onNavigate={() => setSidebarOpen(false)}
                    />
                </aside>

                {sidebarOpen && (
                    <button
                        type="button"
                        aria-label="Fechar menu"
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 z-30 bg-neutral-900/30 dark:bg-black/50 backdrop-blur-[1.5px] md:hidden animate-[fadeIn_0.15s_ease-out]"
                    />
                )}

                <main className="flex-1 min-w-0 px-4 py-6 md:px-8 md:py-10">
                    <div className="mx-auto max-w-7xl w-full">{children}</div>
                </main>
            </div>
        </div>
    )
}
