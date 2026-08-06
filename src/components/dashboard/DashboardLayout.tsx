"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import type { Session } from "next-auth"
import Sidebar from "@/components/dashboard/Sidebar"
import Header from "@/components/dashboard/Header"

export default function DashboardLayout({
    children,
    session,
}: {
    children: ReactNode
    session: Session
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900">
            <Header
                session={session}
                onToggleSidebar={() => setSidebarOpen((open) => !open)}
            />

            <div className="flex">
                <aside
                    className={`${
                        sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-neutral-200 pt-20 transition-transform duration-200 md:translate-x-0 md:static md:pt-0 md:shrink-0`}
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
                        className="fixed inset-0 z-30 bg-black/30 md:hidden"
                    />
                )}

                <main className="flex-1 min-w-0 px-4 py-6 md:px-8 md:py-8">
                    <div className="mx-auto max-w-6xl w-full">{children}</div>
                </main>
            </div>
        </div>
    )
}
