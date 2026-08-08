"use client"

import Link from "next/link"
import { useState } from "react"

type PatientStatus = "Ativo" | "Em Tratamento" | "Aguardando" | "Inativo"

type Patient = {
    id: string
    name: string
    record: string
    avatarColor: string
    initials: string
    lastVisitDate: string
    lastVisitDoctor: string
    status: PatientStatus
    insurance: string
}

const patients: Patient[] = [
    {
        id: "1",
        name: "Arnaldo Silveira",
        record: "#88291",
        avatarColor: "from-amber-400 to-orange-500",
        initials: "AS",
        lastVisitDate: "12 Out, 2023",
        lastVisitDoctor: "Dr. Ricardo Mota",
        status: "Em Tratamento",
        insurance: "Unimed Nacional",
    },
    {
        id: "2",
        name: "Beatriz Costa",
        record: "#88304",
        avatarColor: "from-blue-400 to-indigo-500",
        initials: "BC",
        lastVisitDate: "15 Out, 2023",
        lastVisitDoctor: "Dra. Helena Souza",
        status: "Ativo",
        insurance: "Particular",
    },
    {
        id: "3",
        name: "Carlos Eduardo",
        record: "#88312",
        avatarColor: "from-green-400 to-emerald-600",
        initials: "CE",
        lastVisitDate: "Hoje, 09:30",
        lastVisitDoctor: "Dr. Ricardo Mota",
        status: "Aguardando",
        insurance: "Bradesco Saúde",
    },
    {
        id: "4",
        name: "Daniel Oliveira",
        record: "#88315",
        avatarColor: "from-sky-400 to-cyan-600",
        initials: "DO",
        lastVisitDate: "05 Out, 2023",
        lastVisitDoctor: "Dra. Fernanda Lima",
        status: "Ativo",
        insurance: "SulAmérica",
    },
    {
        id: "5",
        name: "Elisa Mendes",
        record: "#88320",
        avatarColor: "from-pink-400 to-rose-500",
        initials: "EM",
        lastVisitDate: "28 Set, 2023",
        lastVisitDoctor: "Dr. Marcus Polo",
        status: "Inativo",
        insurance: "Particular",
    },
]

function statusStyles(s: PatientStatus) {
    switch (s) {
        case "Ativo":
            return "bg-green-100/80 text-green-700 ring-1 ring-green-600/15"
        case "Em Tratamento":
            return "bg-neutral-100 text-neutral-600 ring-1 ring-neutral-300/60"
        case "Aguardando":
            return "bg-neutral-100 text-neutral-600 ring-1 ring-neutral-300/70"
        case "Inativo":
            return "bg-red-50 text-red-600 ring-1 ring-red-500/15"
    }
}

export default function PatientsPage() {
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<"all" | PatientStatus>("all")

    const totalFiltered = 1284
    const start = 1
    const end = 10
    const totalPages = 128

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Search + Unidade */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-5">
                <div className="relative flex-1 max-w-3xl">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </span>
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Pesquisar por pacientes, prontuários ou médicos..."
                        className="w-full rounded-2xl border border-neutral-200/80 bg-white/90 py-3.5 pl-12 pr-4 text-sm text-neutral-800 placeholder:text-neutral-400 shadow-[0_2px_6px_rgba(15,23,42,0.04)] focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400/60 transition"
                    />
                </div>

                <div className="hidden md:flex items-center gap-2 pl-5 border-l border-neutral-200/80 text-neutral-700">
                    <span className="h-9 w-9 inline-flex items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                    </span>
                    <div className="leading-tight">
                        <p className="text-sm font-semibold">Unidade Central</p>
                        <p className="text-[11px] text-neutral-500">São Paulo, SP</p>
                    </div>
                </div>
            </div>

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/dashboard" className="hover:text-neutral-800 transition-colors">
                    Vitalis Health
                </Link>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-300" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
                <span className="font-semibold text-brand-700">Pacientes</span>
            </nav>

            {/* Header + CTA */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl md:text-4xl font-serif font-semibold tracking-tight text-neutral-900">
                        Gestão de Pacientes
                    </h1>
                    <p className="text-sm md:text-[15px] text-neutral-600 max-w-2xl">
                        Visualize, edite e acompanhe o histórico completo de todos os pacientes da clínica.
                    </p>
                </div>

                <Link
                    href="/dashboard/pacientes/novo"
                    className="inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 px-5 py-3.5 text-sm md:text-[15px] font-semibold text-white shadow-[0_10px_24px_rgba(16,142,93,0.28)] hover:shadow-[0_14px_32px_rgba(16,142,93,0.36)] hover:brightness-[1.03] active:brightness-100 transition-all duration-200"
                >
                    <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    </span>
                    Cadastrar Novo Paciente
                </Link>
            </div>

            {/* Stats cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                <StatCard
                    label="Total de Pacientes"
                    value="1,284"
                    badge="+12%"
                    badgeType="positive"
                />
                <StatCard
                    label="Atendimentos Hoje"
                    value="42"
                    icon={
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    }
                    iconType="success"
                />
                <StatCard
                    label="Novos Este Mês"
                    value="86"
                    badge="+5%"
                    badgeType="positive"
                />
                <StatCard
                    label="Taxa de Retorno"
                    value="94%"
                    icon={
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="7" y1="17" x2="17" y2="7" />
                            <polyline points="7 7 17 7 17 17" />
                        </svg>
                    }
                    iconType="positive"
                />
            </section>

            {/* Table wrapper */}
            <section className="relative rounded-3xl border border-neutral-200/70 bg-white shadow-[0_4px_24px_-12px_rgba(15,23,42,0.12)]">
                {/* Filter bar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 md:px-7 py-5 border-b border-neutral-100">
                    <div className="relative w-full sm:max-w-xs">
                        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                            </svg>
                        </span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                            className="w-full appearance-none rounded-xl border border-neutral-200/80 bg-neutral-50/70 pl-10 pr-10 py-2.5 text-sm font-medium text-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400/60 transition"
                        >
                            <option value="all">Todos os Status</option>
                            <option value="Ativo">Ativo</option>
                            <option value="Em Tratamento">Em Tratamento</option>
                            <option value="Aguardando">Aguardando</option>
                            <option value="Inativo">Inativo</option>
                        </select>
                        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </span>
                    </div>

                    <p className="text-xs md:text-sm text-neutral-500 text-right">
                        Mostrando <span className="font-semibold text-neutral-800">{start}–{end}</span> de{" "}
                        <span className="font-semibold text-neutral-800">{totalFiltered.toLocaleString("pt-BR")}</span> pacientes
                    </p>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-neutral-100 bg-neutral-50/40">
                                <Th>Paciente</Th>
                                <Th>Última Visita</Th>
                                <Th>Status</Th>
                                <Th>Convênio</Th>
                                <Th className="text-right pr-6">Ações</Th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {patients.map((p) => (
                                <tr key={p.id} className="group hover:bg-brand-50/30 transition-colors">
                                    <td className="py-4.5 md:py-5 pl-5 md:pl-7 pr-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`relative h-11 w-11 shrink-0 rounded-full bg-gradient-to-br ${p.avatarColor} text-white text-sm font-bold shadow-sm ring-2 ring-white overflow-hidden flex items-center justify-center`}>
                                                {p.initials}
                                            </div>
                                            <div className="min-w-0 leading-tight">
                                                <p className="text-[15px] font-semibold text-neutral-900 truncate">
                                                    {p.name}
                                                </p>
                                                <p className="text-sm text-neutral-500 mt-0.5">
                                                    Prontuário: <span className="font-medium text-neutral-700">{p.record}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4.5 md:py-5 px-4">
                                        <div className="leading-tight">
                                            <p className="text-sm font-medium text-neutral-900">{p.lastVisitDate}</p>
                                            <p className="text-xs text-neutral-500 mt-0.5">{p.lastVisitDoctor}</p>
                                        </div>
                                    </td>
                                    <td className="py-4.5 md:py-5 px-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusStyles(p.status)}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="py-4.5 md:py-5 px-4">
                                        <p className="text-sm font-medium text-neutral-700 whitespace-nowrap">{p.insurance}</p>
                                    </td>
                                    <td className="py-4.5 md:py-5 pl-4 pr-5 md:pr-7">
                                        <div className="flex items-center justify-end">
                                            <Link
                                                href={`/dashboard/pacientes/${p.id}/historico`}
                                                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50 transition-colors"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                                    <path d="M3 3v5h5" />
                                                    <path d="M12 7v5l4 2" />
                                                </svg>
                                                Ver Histórico
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 md:px-7 py-5 border-t border-neutral-100">
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-500 border border-transparent hover:bg-neutral-50 hover:text-neutral-800 transition-colors disabled:opacity-40"
                        disabled
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        Anterior
                    </button>

                    <div className="flex items-center gap-2">
                        <PageButton active>1</PageButton>
                        <PageButton>2</PageButton>
                        <PageButton>3</PageButton>
                        <span className="px-1 text-neutral-400" aria-hidden="true">
                            …
                        </span>
                        <PageButton>{totalPages}</PageButton>
                    </div>

                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors"
                    >
                        Próximo
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </div>
            </section>

            {/* FAB */}
            <Link
                href="/dashboard/pacientes/novo"
                aria-label="Cadastrar novo paciente"
                className="fixed z-30 bottom-6 right-6 md:bottom-10 md:right-10 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 text-white shadow-[0_12px_32px_rgba(16,142,93,0.45)] ring-4 ring-white/70 hover:scale-105 hover:shadow-[0_16px_40px_rgba(16,142,93,0.55)] active:scale-100 transition-all duration-200"
            >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </Link>
        </div>
    )
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <th scope="col" className={`px-4 py-4 text-left text-[11px] font-semibold tracking-[0.16em] text-neutral-500 uppercase whitespace-nowrap ${className}`}>
            {children}
        </th>
    )
}

function PageButton({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
    if (active) {
        return (
            <span
                aria-current="page"
                className="inline-flex h-9 min-w-9 items-center justify-center rounded-xl px-3 text-sm font-bold text-white bg-gradient-to-br from-brand-600 to-brand-700 shadow-[0_6px_14px_rgba(16,142,93,0.35)]"
            >
                {children}
            </span>
        )
    }
    return (
        <button
            type="button"
            className="inline-flex h-9 min-w-9 items-center justify-center rounded-xl px-3 text-sm font-semibold text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
        >
            {children}
        </button>
    )
}

function StatCard({
    label,
    value,
    badge,
    badgeType,
    icon,
    iconType,
}: {
    label: string
    value: string
    badge?: string
    badgeType?: "positive"
    icon?: React.ReactNode
    iconType?: "positive" | "success"
}) {
    return (
        <div className="rounded-3xl border border-neutral-200/70 bg-white p-5 md:p-6 shadow-[0_4px_20px_-14px_rgba(15,23,42,0.15)] hover:shadow-[0_8px_28px_-14px_rgba(15,23,42,0.22)] transition-shadow">
            <div className="flex items-start justify-between gap-3">
                <p className="text-[11px] md:text-xs font-semibold tracking-[0.18em] text-neutral-400 uppercase">
                    {label}
                </p>
                {!icon && badge && badgeType === "positive" && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-green-50 text-green-700 text-[11px] font-bold ring-1 ring-green-600/10">
                        {badge}
                    </span>
                )}
                {icon && (
                    <span
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ring-1 ${
                            iconType === "success"
                                ? "bg-green-50 text-green-600 ring-green-600/10"
                                : "bg-brand-50 text-brand-700 ring-brand-600/10"
                        }`}
                    >
                        {icon}
                    </span>
                )}
            </div>

            <div className="mt-4 flex items-end justify-between gap-3">
                <p className="text-3xl md:text-[34px] font-bold tracking-tight text-neutral-900 tabular-nums">
                    {value}
                </p>
                {badge && icon && (
                    <span className="mb-1 inline-flex items-center px-2 py-0.5 rounded-lg bg-green-50 text-green-700 text-[11px] font-bold ring-1 ring-green-600/10">
                        {badge}
                    </span>
                )}
            </div>
        </div>
    )
}
