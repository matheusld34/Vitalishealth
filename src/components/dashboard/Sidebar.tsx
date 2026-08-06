"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { Role } from "@/generated/prisma/client"

type Props = {
    userRole: Role
    onNavigate?: () => void
}

type Item = {
    href: string
    label: string
    icon: JSX.Element
    roles: Role[]
}

const items: Item[] = [
    {
        href: "/dashboard",
        label: "Dashboard",
        roles: ["MASTER", "SECRETARY", "DOCTOR"],
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
            </svg>
        ),
    },
    {
        href: "/dashboard/agendamento",
        label: "Agendamento",
        roles: ["MASTER", "SECRETARY", "DOCTOR"],
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
        ),
    },
    {
        href: "/dashboard/pacientes",
        label: "Pacientes",
        roles: ["MASTER", "SECRETARY", "DOCTOR"],
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
    },
    {
        href: "/dashboard/medicos",
        label: "Médicos",
        roles: ["MASTER", "SECRETARY"],
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M12 11v6" />
                <path d="M9 14h6" />
            </svg>
        ),
    },
    {
        href: "/dashboard/relatorios",
        label: "Relatórios",
        roles: ["MASTER", "DOCTOR"],
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
        ),
    },
    {
        href: "/dashboard/configuracoes",
        label: "Configurações",
        roles: ["MASTER"],
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09A1.65 1.65 0 0 0 19.4 15z" />
            </svg>
        ),
    },
]

export default function Sidebar({ userRole, onNavigate }: Props) {
    const pathname = usePathname()
    const visible = items.filter((i) => i.roles.includes(userRole))
    const canCreateAppointment = userRole === "MASTER" || userRole === "SECRETARY"

    return (
        <div className="h-full flex flex-col">
            <div className="px-4 md:px-6 pt-6 pb-3">
                <p className="text-[11px] font-semibold tracking-[0.18em] text-neutral-400 uppercase">
                    Sistema
                </p>
            </div>

            <nav className="px-3 md:px-4 flex-1 space-y-1">
                {visible.map((item) => {
                    const isActive =
                        item.href === "/dashboard"
                            ? pathname === "/dashboard"
                            : pathname?.startsWith(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onNavigate}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                isActive
                                    ? "bg-brand-500 text-white shadow-sm"
                                    : "text-neutral-700 hover:bg-neutral-100"
                            }`}
                        >
                            <span
                                className={`${
                                    isActive ? "text-white" : "text-neutral-500"
                                }`}
                            >
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 md:p-6">
                {canCreateAppointment ? (
                    <Link
                        href="/dashboard/agendamento/novo"
                        onClick={onNavigate}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-700 text-white py-3 px-4 font-semibold shadow-md hover:bg-brand-800 active:bg-brand-900 transition-colors"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Novo Atendimento
                    </Link>
                ) : (
                    <Link
                        href="/dashboard/agenda"
                        onClick={onNavigate}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-700 text-white py-3 px-4 font-semibold shadow-md hover:bg-brand-800 active:bg-brand-900 transition-colors"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        Minha Agenda
                    </Link>
                )}
            </div>
        </div>
    )
}
