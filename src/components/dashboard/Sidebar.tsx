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
    description?: string
    icon: JSX.Element
    roles: Role[]
}

const items: Item[] = [
    {
        href: "/dashboard",
        label: "Dashboard",
        description: "Visão geral da clínica",
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
        description: "Consultas e horários",
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
        description: "Cadastro e prontuários",
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
        description: "Corpo clínico",
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
        description: "Indicadores e métricas",
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
        description: "Sistema e preferências",
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
        <div className="h-full flex flex-col px-3 md:px-4 py-4 md:py-5">
            <div className="px-3 pb-2 pt-1">
                <p className="text-[10.5px] font-semibold tracking-[0.22em] text-neutral-400 uppercase">
                    Navegação
                </p>
            </div>

            <nav className="space-y-1 overflow-y-auto pr-1 -mr-1">
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
                            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                                isActive
                                    ? "bg-gradient-to-r from-brand-500/10 via-brand-500/8 to-brand-500/0 text-brand-800 shadow-[inset_2px_0_0_rgba(16,142,93,0.65)]"
                                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                            }`}
                        >
                            <span
                                className={`relative h-8 w-8 shrink-0 inline-flex items-center justify-center rounded-lg transition-all duration-200 ${
                                    isActive
                                        ? "bg-brand-500 text-white shadow-[0_4px_10px_rgba(16,142,93,0.22)]"
                                        : "bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200 group-hover:text-neutral-700"
                                }`}
                            >
                                {item.icon}
                            </span>
                            <div className="flex-1 min-w-0 leading-tight">
                                <span className={`block font-medium truncate ${isActive ? "text-brand-800" : ""}`}>
                                    {item.label}
                                </span>
                                {item.description && (
                                    <span className={`block truncate text-[11px] mt-0.5 ${isActive ? "text-brand-700/70" : "text-neutral-400 group-hover:text-neutral-500"}`}>
                                        {item.description}
                                    </span>
                                )}
                            </div>
                            {isActive && (
                                <span className="h-1.5 w-1.5 rounded-full bg-brand-500 shadow-[0_0_0_3px_rgba(16,142,93,0.15)]" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            <div className="mt-7 px-1">
                <div className="rounded-2xl border border-neutral-200/70 bg-gradient-to-br from-brand-50/60 via-white to-white p-3 md:p-3.5 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                    {canCreateAppointment ? (
                        <Link
                            href="/dashboard/agendamento/novo"
                            onClick={onNavigate}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 text-white py-2.5 px-4 font-semibold text-sm shadow-[0_6px_16px_rgba(16,142,93,0.22)] hover:shadow-[0_8px_22px_rgba(16,142,93,0.3)] hover:brightness-[1.02] active:brightness-100 transition-all duration-200"
                        >
                            <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                            </span>
                            Novo Atendimento
                        </Link>
                    ) : (
                        <Link
                            href="/dashboard/agenda"
                            onClick={onNavigate}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 text-white py-2.5 px-4 font-semibold text-sm shadow-[0_6px_16px_rgba(16,142,93,0.22)] hover:shadow-[0_8px_22px_rgba(16,142,93,0.3)] hover:brightness-[1.02] active:brightness-100 transition-all duration-200"
                        >
                            <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <rect x="3" y="4" width="18" height="18" rx="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                            </span>
                            Minha Agenda
                        </Link>
                    )}
                    <p className="mt-2.5 px-1 text-[11px] leading-relaxed text-neutral-500">
                        {canCreateAppointment
                            ? "Marque consultas, exames e procedimentos para qualquer médico."
                            : "Visualize sua agenda diária, confirme consultas e acesse prontuários."}
                    </p>
                </div>
            </div>
        </div>
    )
}
