"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

/* ---------- TIPOS ---------- */

type AptStatus = "Confirmado" | "Pendente" | "Urgente" | "Concluído" | "Cancelado" | "Não Compareceu"

type AppointmentRow = {
    id: string
    patientId: string
    patientName: string
    patientInitials: string
    patientGradient: string
    doctorId: string
    doctorName: string
    doctorInitials: string
    doctorGradient: string
    crm: string
    specialty: string
    procedure: string
    iso: string
    dateLabel: string
    weekdayShort: string
    time: string
    duration: string
    insurance: string
    status: AptStatus
}

type ApiAppointment = {
    id: string
    dateTime: string
    durationMinutes?: number | null
    status?: string | null
    specialties?: string[] | null
    observation?: string | null
    patient?: { id: string; fullName: string | null; insuranceOperator?: string | null } | null
    doctor?: {
        id: string
        name: string | null
        doctorProfile?: {
            specialties?: string[] | null
            crm?: string | null
            crmUf?: string | null
        } | null
    } | null
}

const STATUS_CHIPS = [
    "Todos",
    "Confirmado",
    "Pendente",
    "Urgente",
    "Concluído",
    "Cancelado",
    "Não Compareceu",
] as const

type StatusChipValue = (typeof STATUS_CHIPS)[number]

const POLL_MS = 15000
const PAGE_SIZE = 8

const API_STATUS: Record<string, AptStatus> = {
    SCHEDULED: "Pendente",
    CONFIRMED: "Confirmado",
    URGENTE: "Urgente",
    COMPLETED: "Concluído",
    CANCELED: "Cancelado",
    NO_SHOW: "Não Compareceu",
}

const AVATAR_PALETTE = [
    "from-emerald-400 to-green-600",
    "from-rose-400 to-rose-600",
    "from-slate-400 to-slate-600",
    "from-sky-400 to-blue-600",
    "from-amber-300 to-orange-500",
    "from-violet-400 to-purple-600",
    "from-teal-400 to-emerald-600",
    "from-fuchsia-400 to-rose-500",
]

const MONTHS_SHORT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
const WEEKDAYS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

/* ---------- HELPERS ---------- */

function pad(n: number): string {
    return String(n).padStart(2, "0")
}

function startOfToday(): Date {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
}

function toIso(d: Date): string {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function hash(s: string): number {
    let h = 0
    for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i) | 0
    return Math.abs(h)
}

function initialsFromName(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (parts.length === 0) return "?"
    return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase()
}

function paletteFor(seed: string): string {
    return AVATAR_PALETTE[hash(seed) % AVATAR_PALETTE.length]
}

function mapRow(a: ApiAppointment): AppointmentRow {
    const patientName = a.patient?.fullName?.trim() || "Paciente não identificado"
    const doctorName = a.doctor?.name?.trim() || "Médico(a) não atribuído(a)"
    const dt = new Date(a.dateTime)
    const valid = !isNaN(dt.getTime())

    const doctorSpecialties = a.doctor?.doctorProfile?.specialties ?? []
    const appointmentSpecialties = a.specialties ?? []
    const specialty =
        appointmentSpecialties[0]?.trim() ||
        doctorSpecialties[0]?.trim() ||
        "Clínica Geral"

    const procedure =
        appointmentSpecialties.length > 1
            ? appointmentSpecialties.join(" · ")
            : a.observation?.trim() || appointmentSpecialties[0]?.trim() || "Consulta"

    const durationMin =
        typeof a.durationMinutes === "number" && a.durationMinutes > 0 ? a.durationMinutes : 30

    const crmDigits = a.doctor?.doctorProfile?.crm?.trim()
    const crmUf = a.doctor?.doctorProfile?.crmUf?.trim()
    const crm = crmDigits ? `CRM ${crmDigits}${crmUf ? `/${crmUf}` : ""}` : ""

    return {
        id: a.id,
        patientId: a.patient?.id ?? "",
        patientName,
        patientInitials: initialsFromName(patientName),
        patientGradient: paletteFor(a.patient?.id || patientName),
        doctorId: a.doctor?.id ?? "",
        doctorName,
        doctorInitials: initialsFromName(doctorName),
        doctorGradient: paletteFor(a.doctor?.id || doctorName),
        crm,
        specialty,
        procedure,
        iso: valid ? toIso(dt) : "",
        dateLabel: valid ? `${pad(dt.getDate())} ${MONTHS_SHORT[dt.getMonth()]}, ${dt.getFullYear()}` : "—",
        weekdayShort: valid ? WEEKDAYS_SHORT[dt.getDay()] : "—",
        time: valid ? `${pad(dt.getHours())}:${pad(dt.getMinutes())}` : "—",
        duration: `${durationMin} min`,
        insurance: a.patient?.insuranceOperator?.trim() || "Particular",
        status: API_STATUS[String(a.status ?? "").toUpperCase()] ?? "Pendente",
    }
}

function inDateRange(iso: string, range: string): boolean {
    if (!iso) return range === "todos"
    if (range === "todos") return true
    const [y, m, d] = iso.split("-").map(Number)
    const target = new Date(y, m - 1, d, 0, 0, 0, 0)
    const today = startOfToday()

    if (range === "hoje") return iso === toIso(today)
    if (range === "este-mes") {
        return target.getMonth() === today.getMonth() && target.getFullYear() === today.getFullYear()
    }
    if (range === "proximo-mes") {
        const next = new Date(today.getFullYear(), today.getMonth() + 1, 1)
        return target.getMonth() === next.getMonth() && target.getFullYear() === next.getFullYear()
    }
    if (range === "esta-semana") {
        const dow = (today.getDay() + 6) % 7 // 0 = segunda
        const monday = new Date(today)
        monday.setDate(today.getDate() - dow)
        const sunday = new Date(monday)
        sunday.setDate(monday.getDate() + 6)
        sunday.setHours(23, 59, 59, 999)
        return target >= monday && target <= sunday
    }
    return true
}

function pageNumbers(current: number, total: number): (number | "…")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
    const out: (number | "…")[] = [1]
    const from = Math.max(2, current - 1)
    const to = Math.min(total - 1, current + 1)
    if (from > 2) out.push("…")
    for (let p = from; p <= to; p++) out.push(p)
    if (to < total - 1) out.push("…")
    out.push(total)
    return out
}

/* ---------- COMPONENTE ---------- */

export default function AllAppointmentsPage() {
    const [all, setAll] = useState<AppointmentRow[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [offline, setOffline] = useState(false)
    const [lastSync, setLastSync] = useState<Date | null>(null)

    const [search, setSearch] = useState("")
    const [specialty, setSpecialty] = useState("Todas")
    const [status, setStatus] = useState<StatusChipValue>("Todos")
    const [doctorFilter, setDoctorFilter] = useState("todos")
    const [dateRange, setDateRange] = useState("todos")
    const [page, setPage] = useState(1)

    const inFlight = useRef(false)

    const load = useCallback(async (first = false) => {
        if (inFlight.current) return
        inFlight.current = true
        if (first) setLoading(true)
        else setRefreshing(true)
        try {
            const res = await fetch("/api/appointments", { cache: "no-store" })
            if (!res.ok) throw new Error("network")
            const data = await res.json()
            const list: ApiAppointment[] = Array.isArray(data.appointments) ? data.appointments : []
            setAll(list.map(mapRow))
            setOffline(false)
            setLastSync(new Date())
        } catch {
            setOffline(true)
        } finally {
            inFlight.current = false
            setLoading(false)
            setRefreshing(false)
        }
    }, [])

    useEffect(() => {
        load(true)
        const id = setInterval(() => load(), POLL_MS)
        const onWake = () => {
            if (document.visibilityState === "visible") load()
        }
        window.addEventListener("focus", onWake)
        document.addEventListener("visibilitychange", onWake)
        return () => {
            clearInterval(id)
            window.removeEventListener("focus", onWake)
            document.removeEventListener("visibilitychange", onWake)
        }
    }, [load])

    // Sempre que um filtro muda, volta para a primeira página
    useEffect(() => {
        setPage(1)
    }, [search, specialty, status, doctorFilter, dateRange])

    const specialtyOptions = useMemo(() => {
        const set = new Set<string>()
        for (const r of all) if (r.specialty) set.add(r.specialty)
        return ["Todas", ...Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"))]
    }, [all])

    const doctorOptions = useMemo(() => {
        const map = new Map<string, string>()
        for (const r of all) if (r.doctorId) map.set(r.doctorId, r.doctorName)
        return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1], "pt-BR"))
    }, [all])

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase()
        return all.filter((r) => {
            if (specialty !== "Todas" && r.specialty !== specialty) return false
            if (status !== "Todos" && r.status !== status) return false
            if (doctorFilter !== "todos" && r.doctorId !== doctorFilter) return false
            if (!inDateRange(r.iso, dateRange)) return false
            if (q) {
                const haystack = `${r.patientName} ${r.doctorName} ${r.specialty} ${r.procedure} ${r.insurance}`.toLowerCase()
                if (!haystack.includes(q)) return false
            }
            return true
        })
    }, [all, search, specialty, status, doctorFilter, dateRange])

    const stats = useMemo(() => {
        let confirmed = 0
        let pending = 0
        let concluded = 0
        for (const r of filtered) {
            if (r.status === "Confirmado") confirmed += 1
            else if (r.status === "Pendente") pending += 1
            else if (r.status === "Concluído") concluded += 1
        }
        return { total: filtered.length, confirmed, pending, concluded }
    }, [filtered])

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const currentPage = Math.min(page, totalPages)
    const startIdx = (currentPage - 1) * PAGE_SIZE
    const visible = filtered.slice(startIdx, startIdx + PAGE_SIZE)
    const start = filtered.length === 0 ? 0 : startIdx + 1
    const end = startIdx + visible.length

    const currentMonthLabel = `${MONTHS_SHORT[new Date().getMonth()]} ${new Date().getFullYear()}`

    function exportCsv() {
        const header = ["Paciente", "Médico", "Especialidade", "Data", "Dia", "Horário", "Duração", "Convênio", "Status"]
        const lines = filtered.map((r) => [
            r.patientName,
            r.doctorName,
            r.specialty,
            r.dateLabel,
            r.weekdayShort,
            r.time,
            r.duration,
            r.insurance,
            r.status,
        ])
        const csv = [header, ...lines]
            .map((cols) => cols.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
            .join("\r\n")
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `agendamentos-${toIso(new Date())}.csv`
        a.click()
        URL.revokeObjectURL(url)
    }

    const showEmpty = !loading && filtered.length === 0

    return (
        <div className="space-y-6 md:space-y-8 pb-10">
            {/* Busca */}
            <div className="mx-auto max-w-md w-full">
                <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </span>
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por paciente, médico ou especialidade..."
                        className="w-full rounded-full border border-neutral-200/80 bg-white/90 py-3 pl-11 pr-4 text-sm placeholder:text-neutral-400 shadow-[0_2px_10px_rgba(15,23,42,0.05)] focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400/60 transition dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500"
                    />
                </div>
            </div>

            {/* Breadcrumb + header + CTA */}
            <div className="space-y-4">
                <nav className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                    <Link href="/dashboard/agendamento" className="hover:text-neutral-800 transition-colors dark:hover:text-neutral-100">
                        Agendamento
                    </Link>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-300 dark:text-neutral-600" aria-hidden="true">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                    <span className="font-semibold text-brand-700 dark:text-brand-300">Todos os Agendamentos</span>
                </nav>

                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-serif font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                            Todos os Agendamentos
                        </h1>
                        <p className="mt-1.5 text-sm md:text-[15px] text-neutral-600 max-w-2xl dark:text-neutral-400">
                            Visualize, filtre e gerencie todas as consultas e atendimentos da clínica em um único lugar.
                        </p>
                    </div>
                    <Link
                        href="/dashboard/agendamento/novo"
                        className="inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 px-5 py-3.5 text-[15px] font-bold text-white shadow-[0_10px_24px_rgba(16,142,93,0.3)] hover:brightness-[1.03] active:brightness-100 transition-all"
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Novo Atendimento
                    </Link>
                </div>
            </div>

            {/* Stats cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                <StatCard
                    label="Total Geral"
                    value={stats.total.toLocaleString("pt-BR")}
                    badge={currentMonthLabel}
                    icon={
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                    }
                    iconType="brand"
                />
                <StatCard
                    label="Confirmados"
                    value={String(stats.confirmed)}
                    icon={
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    }
                    iconType="success"
                />
                <StatCard
                    label="Pendentes"
                    value={String(stats.pending)}
                    icon={
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                    }
                    iconType="warning"
                />
                <StatCard
                    label="Concluídos"
                    value={String(stats.concluded)}
                    icon={
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M20 6 9 17l-5-5" />
                        </svg>
                    }
                    iconType="info"
                />
            </section>

            {/* Filtros */}
            <section className="rounded-3xl border border-neutral-200/70 bg-white p-4 md:p-5 shadow-[0_4px_20px_-14px_rgba(15,23,42,0.15)] space-y-4 dark:border-neutral-800/80 dark:bg-neutral-900">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                    {/* Período */}
                    <FilterField label="Período">
                        <div className="relative">
                            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <rect x="3" y="4" width="18" height="18" rx="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                            </span>
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="w-full appearance-none rounded-xl border border-neutral-200/80 bg-neutral-50/70 pl-10 pr-10 py-2.5 text-sm font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400/60 transition dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                            >
                                <option value="hoje">Hoje</option>
                                <option value="esta-semana">Esta Semana</option>
                                <option value="este-mes">Este Mês</option>
                                <option value="proximo-mes">Próximo Mês</option>
                                <option value="todos">Todos os Períodos</option>
                            </select>
                            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </span>
                        </div>
                    </FilterField>

                    {/* Médico */}
                    <FilterField label="Médico">
                        <div className="relative">
                            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </span>
                            <select
                                value={doctorFilter}
                                onChange={(e) => setDoctorFilter(e.target.value)}
                                className="w-full appearance-none rounded-xl border border-neutral-200/80 bg-neutral-50/70 pl-10 pr-10 py-2.5 text-sm font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400/60 transition dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                            >
                                <option value="todos">Todos os Especialistas</option>
                                {doctorOptions.map(([id, name]) => (
                                    <option key={id} value={id}>
                                        {name}
                                    </option>
                                ))}
                            </select>
                            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </span>
                        </div>
                    </FilterField>

                    {/* Especialidade chips */}
                    <div className="space-y-3">
                        <FilterField label="Especialidade">
                            <div className="flex flex-wrap gap-2">
                                {specialtyOptions.map((s) => (
                                    <Chip key={s} active={specialty === s} onClick={() => setSpecialty(s)}>
                                        {s}
                                    </Chip>
                                ))}
                            </div>
                        </FilterField>
                    </div>
                </div>

                {/* Status chips */}
                <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-neutral-400 mb-2 dark:text-neutral-500">
                        Status
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {STATUS_CHIPS.map((s) => (
                            <StatusChip key={s} label={s} active={status === s} onClick={() => setStatus(s)} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Tabela */}
            <section className="relative rounded-3xl border border-neutral-200/70 bg-white shadow-[0_4px_24px_-12px_rgba(15,23,42,0.12)] overflow-hidden dark:border-neutral-800/80 dark:bg-neutral-900">
                <div className="flex items-center justify-between gap-3 px-5 md:px-7 py-5 border-b border-neutral-100 bg-neutral-50/40 dark:border-neutral-800 dark:bg-neutral-800/40">
                    <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400">
                        Mostrando <span className="font-semibold text-neutral-800 dark:text-neutral-100">{start}–{end}</span> de{" "}
                        <span className="font-semibold text-neutral-800 dark:text-neutral-100">{filtered.length.toLocaleString("pt-BR")}</span>{" "}
                        agendamentos
                    </p>
                    <div className="flex items-center gap-2">
                        {refreshing && (
                            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-brand-600 animate-pulse" />
                                Sincronizando
                            </span>
                        )}
                        {offline && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-red-700 ring-1 ring-red-600/15 dark:bg-red-500/10 dark:text-red-300">
                                offline
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={() => load()}
                            aria-label="Atualizar lista"
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-neutral-200/80 hover:bg-neutral-50 text-xs font-bold text-neutral-600 transition-colors dark:bg-neutral-900 dark:border-neutral-800 dark:hover:bg-neutral-800 dark:text-neutral-300"
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <polyline points="23 4 23 10 17 10" />
                                <polyline points="1 20 1 14 7 14" />
                                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                            </svg>
                            Atualizar
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-neutral-100 bg-neutral-50/60 dark:border-neutral-800 dark:bg-neutral-800/50">
                                <Th className="pl-5 md:pl-7">Paciente</Th>
                                <Th>Médico</Th>
                                <Th>Data</Th>
                                <Th>Horário</Th>
                                <Th>Especialidade</Th>
                                <Th>Convênio</Th>
                                <Th>Status</Th>
                                <Th className="text-right pr-5 md:pr-7">Ações</Th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                            {loading && all.length === 0
                                ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
                                : visible.map((r) => (
                                    <tr key={r.id} className="group hover:bg-brand-50/30 transition-colors dark:hover:bg-brand-500/10">
                                        <td className="py-4 md:py-5 pl-5 md:pl-7 pr-4">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={`relative h-11 w-11 shrink-0 rounded-full bg-gradient-to-br ${r.patientGradient} text-white text-sm font-bold shadow-sm ring-2 ring-white overflow-hidden flex items-center justify-center`}>
                                                    {r.patientInitials}
                                                </div>
                                                <div className="min-w-0 leading-tight">
                                                    <p className="text-[15px] font-semibold text-neutral-900 truncate dark:text-neutral-100">
                                                        {r.patientName}
                                                    </p>
                                                    <p className="text-xs text-neutral-500 mt-0.5 truncate dark:text-neutral-400">
                                                        {r.procedure}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 md:py-5 px-4">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className={`relative h-9 w-9 shrink-0 rounded-full bg-gradient-to-br ${r.doctorGradient} text-white text-[11px] font-bold shadow-sm ring-2 ring-white overflow-hidden flex items-center justify-center`}>
                                                    {r.doctorInitials}
                                                </div>
                                                <div className="min-w-0 leading-tight">
                                                    <p className="text-sm font-semibold text-neutral-900 truncate dark:text-neutral-100">
                                                        {r.doctorName}
                                                    </p>
                                                    <p className="text-[11px] text-neutral-500 truncate dark:text-neutral-400">
                                                        {r.crm || r.specialty}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 md:py-5 px-4">
                                            <div className="leading-tight">
                                                <p className="text-sm font-bold text-neutral-900 whitespace-nowrap dark:text-neutral-100">{r.dateLabel}</p>
                                                <p className="text-[11.5px] uppercase tracking-wider font-bold text-neutral-500 dark:text-neutral-400">
                                                    {r.weekdayShort}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-4 md:py-5 px-4">
                                            <div className="leading-tight">
                                                <p className="text-sm font-black text-neutral-900 tabular-nums dark:text-neutral-100">{r.time}</p>
                                                <p className="text-[11.5px] font-semibold text-neutral-500 tabular-nums dark:text-neutral-400">
                                                    {r.duration}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-4 md:py-5 px-4">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-semibold ring-1 ring-neutral-200/80 whitespace-nowrap dark:bg-neutral-800 dark:text-neutral-300 dark:ring-neutral-700/60">
                                                {r.specialty}
                                            </span>
                                        </td>
                                        <td className="py-4 md:py-5 px-4">
                                            <p className="text-sm font-medium text-neutral-700 whitespace-nowrap dark:text-neutral-200">
                                                {r.insurance}
                                            </p>
                                        </td>
                                        <td className="py-4 md:py-5 px-4">
                                            <StatusBadge status={r.status} />
                                        </td>
                                        <td className="py-4 md:py-5 pl-4 pr-5 md:pr-7">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {r.patientId ? (
                                                    <Link
                                                        href={`/dashboard/pacientes/${r.patientId}/historico`}
                                                        aria-label={`Ver histórico de ${r.patientName}`}
                                                        className="inline-flex items-center justify-center h-9 w-9 rounded-xl text-brand-700 bg-brand-50 ring-1 ring-brand-600/10 hover:bg-brand-100 transition-colors dark:text-brand-300 dark:bg-brand-500/10 dark:hover:bg-brand-500/20"
                                                    >
                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                            <circle cx="12" cy="12" r="3" />
                                                        </svg>
                                                    </Link>
                                                ) : (
                                                    <span className="inline-flex items-center justify-center h-9 w-9 rounded-xl text-neutral-300 bg-neutral-50 cursor-not-allowed dark:text-neutral-600 dark:bg-neutral-800">
                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                            <circle cx="12" cy="12" r="3" />
                                                        </svg>
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {showEmpty && (
                    <div className="px-6 py-14 text-center">
                        <div className="mx-auto h-14 w-14 inline-flex items-center justify-center rounded-full bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <rect x="3" y="4" width="18" height="18" rx="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                        </div>
                        <p className="mt-4 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                            Nenhum agendamento encontrado
                        </p>
                        <p className="mt-1 text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed dark:text-neutral-400">
                            Ajuste os filtros ou crie um novo agendamento para começar.
                        </p>
                        <Link
                            href="/dashboard/agendamento/novo"
                            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 px-5 py-3 text-sm font-bold text-white shadow-[0_10px_22px_-6px_rgba(16,142,93,0.45)] hover:brightness-[1.03] transition-all"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Novo Atendimento
                        </Link>
                    </div>
                )}

                {/* Paginação */}
                {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 md:px-7 py-5 border-t border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                        <button
                            type="button"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-neutral-500 border border-transparent hover:bg-neutral-50 hover:text-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed dark:text-neutral-400 dark:hover:bg-neutral-800/60 dark:hover:text-neutral-100"
                            disabled={currentPage === 1}
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                            Anterior
                        </button>
                        <div className="flex items-center gap-1.5">
                            {pageNumbers(currentPage, totalPages).map((p, i) =>
                                p === "…" ? (
                                    <span key={`ellipsis-${i}`} className="px-1 text-neutral-400 dark:text-neutral-500" aria-hidden="true">
                                        …
                                    </span>
                                ) : (
                                    <PageButton key={p} active={p === currentPage} onClick={() => setPage(p)}>
                                        {p}
                                    </PageButton>
                                )
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed dark:text-neutral-100 dark:hover:bg-neutral-800/60"
                            disabled={currentPage === totalPages}
                        >
                            Próximo
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    </div>
                )}
            </section>

            {/* Rodapé ações */}
            <div className="h-px w-full bg-neutral-200/70 dark:bg-neutral-800/60" />
            <footer className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-sm text-neutral-500 px-1 dark:text-neutral-400">
                    {lastSync ? (
                        <>
                            Dados atualizados em{" "}
                            <span className="font-semibold text-neutral-800 dark:text-neutral-100">
                                {lastSync.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })},{" "}
                                {pad(lastSync.getHours())}:{pad(lastSync.getMinutes())}
                            </span>
                        </>
                    ) : (
                        "Aguardando dados do sistema..."
                    )}
                </p>
                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                        type="button"
                        onClick={exportCsv}
                        disabled={filtered.length === 0}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-neutral-200 px-5 py-3.5 text-[14.5px] font-bold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-800/60"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Exportar CSV
                    </button>
                    <Link
                        href="/dashboard/agendamento/novo"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 px-7 py-3.5 text-[15px] font-bold text-white shadow-[0_12px_28px_rgba(16,142,93,0.32)] hover:brightness-[1.04] active:brightness-100 transition-all"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Novo Atendimento
                    </Link>
                </div>
            </footer>
        </div>
    )
}

/* ---------- SUBCOMPONENTES ---------- */

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <th scope="col" className={`px-4 py-4 text-left text-[11px] font-semibold tracking-[0.16em] text-neutral-500 uppercase whitespace-nowrap dark:text-neutral-400 ${className}`}>
            {children}
        </th>
    )
}

function SkeletonRow() {
    return (
        <tr className="animate-pulse">
            <td className="py-4 md:py-5 pl-5 md:pl-7 pr-4">
                <div className="flex items-center gap-3">
                    <div className="h-11 w-11 shrink-0 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                    <div className="space-y-2">
                        <div className="h-4 w-36 rounded-lg bg-neutral-200 dark:bg-neutral-700" />
                        <div className="h-3 w-24 rounded-lg bg-neutral-200 dark:bg-neutral-700" />
                    </div>
                </div>
            </td>
            <td className="py-4 md:py-5 px-4">
                <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 shrink-0 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                    <div className="space-y-2">
                        <div className="h-3.5 w-28 rounded-lg bg-neutral-200 dark:bg-neutral-700" />
                        <div className="h-2.5 w-20 rounded-lg bg-neutral-200 dark:bg-neutral-700" />
                    </div>
                </div>
            </td>
            <td className="py-4 md:py-5 px-4">
                <div className="h-4 w-24 rounded-lg bg-neutral-200 dark:bg-neutral-700" />
            </td>
            <td className="py-4 md:py-5 px-4">
                <div className="h-4 w-14 rounded-lg bg-neutral-200 dark:bg-neutral-700" />
            </td>
            <td className="py-4 md:py-5 px-4">
                <div className="h-6 w-24 rounded-full bg-neutral-200 dark:bg-neutral-700" />
            </td>
            <td className="py-4 md:py-5 px-4">
                <div className="h-4 w-20 rounded-lg bg-neutral-200 dark:bg-neutral-700" />
            </td>
            <td className="py-4 md:py-5 px-4">
                <div className="h-6 w-24 rounded-full bg-neutral-200 dark:bg-neutral-700" />
            </td>
            <td className="py-4 md:py-5 pl-4 pr-5 md:pr-7">
                <div className="flex justify-end">
                    <div className="h-9 w-9 rounded-xl bg-neutral-200 dark:bg-neutral-700" />
                </div>
            </td>
        </tr>
    )
}

function StatCard({
    label,
    value,
    badge,
    icon,
    iconType,
}: {
    label: string
    value: string
    badge?: string
    icon?: React.ReactNode
    iconType?: "brand" | "success" | "warning" | "info"
}) {
    const iconCls =
        iconType === "brand"
            ? "bg-brand-50 text-brand-700 ring-brand-600/10 dark:bg-brand-500/10 dark:text-brand-300"
            : iconType === "success"
                ? "bg-green-50 text-green-700 ring-green-600/10 dark:bg-green-500/10 dark:text-green-300"
                : iconType === "warning"
                    ? "bg-amber-50 text-amber-700 ring-amber-600/10 dark:bg-amber-500/10 dark:text-amber-300"
                    : "bg-sky-50 text-sky-700 ring-sky-600/10 dark:bg-sky-500/10 dark:text-sky-300"
    return (
        <div className="rounded-3xl border border-neutral-200/70 bg-white p-5 md:p-6 shadow-[0_4px_20px_-14px_rgba(15,23,42,0.15)] hover:shadow-[0_8px_28px_-14px_rgba(15,23,42,0.22)] transition-shadow dark:border-neutral-800/80 dark:bg-neutral-900">
            <div className="flex items-start justify-between gap-3">
                <p className="text-[11px] md:text-xs font-semibold tracking-[0.18em] text-neutral-400 uppercase dark:text-neutral-500">
                    {label}
                </p>
                {icon && (
                    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ring-1 ${iconCls}`}>
                        {icon}
                    </span>
                )}
            </div>
            <div className="mt-4 flex items-end justify-between gap-3">
                <p className="text-3xl md:text-[34px] font-black tracking-tight text-neutral-900 tabular-nums dark:text-neutral-100">
                    {value}
                </p>
                {badge && (
                    <span className="mb-1 inline-flex items-center px-2.5 py-0.5 rounded-lg bg-neutral-100 text-neutral-700 text-[11px] font-black ring-1 ring-neutral-200/80 dark:bg-neutral-800 dark:text-neutral-300 dark:ring-neutral-700/60">
                        {badge}
                    </span>
                )}
            </div>
        </div>
    )
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-neutral-400 mb-2 dark:text-neutral-500">{label}</p>
            {children}
        </div>
    )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${active
                ? "bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-[0_6px_16px_-6px_rgba(16,142,93,0.55)] ring-2 ring-brand-500/20"
                : "bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700/60 dark:text-neutral-300"
                }`}
        >
            {children}
        </button>
    )
}

function StatusChip({
    label,
    active,
    onClick,
}: {
    label: StatusChipValue
    active: boolean
    onClick: () => void
}) {
    const [base] = statusStyles(label)
    const activeCls = active
        ? base
        : "bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700 ring-transparent dark:bg-neutral-800 dark:hover:bg-neutral-700/60 dark:text-neutral-300"
    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-3.5 py-1.5 rounded-full text-[11.5px] font-black uppercase tracking-[0.14em] ring-1 transition-all ${activeCls}`}
        >
            {label}
        </button>
    )
}

function StatusBadge({ status }: { status: AptStatus }) {
    const [cls] = statusStyles(status)
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-black uppercase tracking-[0.14em] ring-1 whitespace-nowrap ${cls}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
            {status}
        </span>
    )
}

function statusStyles(s: string): [string] {
    switch (s) {
        case "Confirmado":
            return ["bg-green-100 text-green-700 ring-green-700/15 dark:bg-green-500/10 dark:text-green-300"]
        case "Pendente":
            return ["bg-amber-100 text-amber-700 ring-amber-600/15 dark:bg-amber-500/10 dark:text-amber-300"]
        case "Urgente":
            return ["bg-orange-100 text-orange-700 ring-orange-600/15 dark:bg-orange-500/10 dark:text-orange-300"]
        case "Concluído":
            return ["bg-sky-100 text-sky-700 ring-sky-700/15 dark:bg-sky-500/10 dark:text-sky-300"]
        case "Cancelado":
            return ["bg-red-100 text-red-700 ring-red-700/15 dark:bg-red-500/10 dark:text-red-300"]
        case "Não Compareceu":
            return ["bg-violet-100 text-violet-700 ring-violet-700/15 dark:bg-violet-500/10 dark:text-violet-300"]
        default:
            return ["bg-neutral-100 text-neutral-700 ring-neutral-200/80 dark:bg-neutral-800 dark:text-neutral-300 dark:ring-neutral-700/60"]
    }
}

function PageButton({
    children,
    active = false,
    onClick,
}: {
    children: React.ReactNode
    active?: boolean
    onClick?: () => void
}) {
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
            onClick={onClick}
            className="inline-flex h-9 min-w-9 items-center justify-center rounded-xl px-3 text-sm font-semibold text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
        >
            {children}
        </button>
    )
}
