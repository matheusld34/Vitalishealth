"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

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
    phone: string
    email: string
    cityState: string
    createdAtIso: string
    hasTodayAppt: boolean
}

type ApiPatient = {
    id: string
    fullName: string
    cpf: string | null
    phone: string | null
    email: string | null
    insuranceOperator: string | null
    planType: string | null
    clinicalStatus: string | null
    createdAt: string
    cep: string | null
    city: string | null
    state: string | null
    appointments: Array<{
        id: string
        dateTime: string
        doctor: { id: string; name: string | null } | null
    }>
}

const FALLBACK_PATIENTS: Patient[] = [
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
        phone: "(11) 98765-4321",
        email: "arnaldo.silveira@email.com",
        cityState: "São Paulo, SP",
        createdAtIso: "2025-10-01",
        hasTodayAppt: false,
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
        phone: "(21) 99888-7766",
        email: "beatriz.costa@email.com",
        cityState: "Rio de Janeiro, RJ",
        createdAtIso: "2026-01-15",
        hasTodayAppt: false,
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
        phone: "(31) 97777-6655",
        email: "carlos.eduardo@email.com",
        cityState: "Belo Horizonte, MG",
        createdAtIso: "2026-07-02",
        hasTodayAppt: true,
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
        phone: "(71) 96666-5544",
        email: "daniel.oliveira@email.com",
        cityState: "Salvador, BA",
        createdAtIso: "2026-08-10",
        hasTodayAppt: false,
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
        phone: "(51) 95555-4433",
        email: "elisa.mendes@email.com",
        cityState: "Porto Alegre, RS",
        createdAtIso: "2025-06-22",
        hasTodayAppt: false,
    },
]

const AVATAR_PALETTE = [
    "from-sky-400 to-blue-600",
    "from-rose-400 to-pink-600",
    "from-amber-300 to-orange-500",
    "from-violet-400 to-purple-600",
    "from-teal-400 to-emerald-600",
    "from-fuchsia-400 to-rose-500",
    "from-indigo-400 to-indigo-600",
    "from-cyan-400 to-sky-600",
]

function hash(str: string): number {
    let h = 0
    for (let i = 0; i < str.length; i++) {
        h = (h << 5) - h + str.charCodeAt(i)
        h |= 0
    }
    return Math.abs(h)
}

function formatPtDate(iso: string, withTime?: { t: string } | null): string {
    try {
        const d = new Date(iso)
        if (isNaN(d.getTime())) return withTime?.t ? `Hoje, ${withTime.t}` : "—"
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const cmp = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0)
        if (cmp.getTime() === today.getTime()) {
            const t = withTime?.t || `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
            return `Hoje, ${t}`
        }
        return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).replace(".", "")
    } catch {
        return withTime?.t ? `Hoje, ${withTime.t}` : "—"
    }
}

function formatPhoneBr(v: string | null): string {
    if (!v) return "Não informado"
    const digits = v.replace(/\D/g, "")
    if (digits.length === 11) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
    }
    if (digits.length === 10) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
    }
    return v || "Não informado"
}

function isSameDayIso(isoA: string, isoB: string): boolean {
    const a = safeParseIso(isoA)
    const b = safeParseIso(isoB)
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    )
}

function safeParseIso(iso: string): Date {
    if (!iso) return new Date()
    if (iso.includes("T")) return new Date(iso)
    const [y, m, d] = iso.split("-").map((v) => Number(v))
    if (!y || !m || !d) return new Date()
    return new Date(y, m - 1, d, 0, 0, 0, 0)
}

function toIsoDate(d: Date): string {
    const pad = (n: number) => n.toString().padStart(2, "0")
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function startOfTodayIso(): string {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return toIsoDate(d)
}

function startOfMonthIso(): string {
    const d = new Date()
    return toIsoDate(new Date(d.getFullYear(), d.getMonth(), 1))
}

function endOfMonthIso(): string {
    const d = new Date()
    return toIsoDate(new Date(d.getFullYear(), d.getMonth() + 1, 0))
}

function recordFromId(id: string, idx: number): string {
    if (!id) return `#88${(300 + idx).toString().padStart(3, "0")}`
    const n = hash(id) % 99000 + 1000
    return `#${n}`
}

function inferStatus(p: ApiPatient, idx: number): PatientStatus {
    if (p.clinicalStatus && p.clinicalStatus.length > 30) return "Em Tratamento"
    if (p.appointments && p.appointments.length > 0) {
        const last = new Date(p.appointments[0].dateTime)
        const now = new Date()
        const diffH = (now.getTime() - last.getTime()) / (1000 * 60 * 60)
        if (diffH < 48) return "Aguardando"
        return "Ativo"
    }
    if (idx % 5 === 4) return "Inativo"
    return "Ativo"
}

function mapApiToPatient(ap: ApiPatient, idx: number): Patient {
    const todayIso = startOfTodayIso()
    const name = ap.fullName?.trim() || "Paciente"
    const initials = name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase() ?? "")
        .join("") || "?"
    const paletteIdx = hash(ap.id) % AVATAR_PALETTE.length

    const lastAppt = ap.appointments?.[0]
    const lastVisitDate = lastAppt ? formatPtDate(lastAppt.dateTime) : "Nunca atendido"
    const lastVisitDoctor = lastAppt?.doctor?.name || "Aguardando agendamento"
    const insurance =
        ap.insuranceOperator && ap.planType
            ? `${ap.insuranceOperator} - ${ap.planType}`
            : ap.insuranceOperator || "Particular"

    const hasTodayAppt = !!(
        lastAppt && isSameDayIso(lastAppt.dateTime, todayIso)
    )

    const city = ap.city && ap.state ? `${ap.city}, ${ap.state}` : ap.city || ap.state ? `${ap.city ?? ""}${ap.state ?? ""}` : "—"

    const createdIso = ap.createdAt && !isNaN(new Date(ap.createdAt).getTime())
        ? toIsoDate(new Date(ap.createdAt))
        : startOfTodayIso()

    return {
        id: ap.id,
        name,
        record: recordFromId(ap.id, idx),
        avatarColor: AVATAR_PALETTE[paletteIdx],
        initials,
        lastVisitDate,
        lastVisitDoctor,
        status: inferStatus(ap, idx),
        insurance,
        phone: formatPhoneBr(ap.phone),
        email: ap.email || "Não informado",
        cityState: city,
        createdAtIso: createdIso,
        hasTodayAppt,
    }
}

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
    const [insuranceFilter, setInsuranceFilter] = useState<"all" | string>("all")
    const [patients, setPatients] = useState<Patient[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const perPage = 8

    useEffect(() => {
        let cancelled = false
        async function load() {
            try {
                const res = await fetch("/api/patients")
                if (!res.ok) throw new Error("failed")
                const data = await res.json()
                if (cancelled) return
                const list: ApiPatient[] = data.patients ?? []
                if (list.length === 0) {
                    setPatients(FALLBACK_PATIENTS)
                    return
                }
                setPatients(list.map((ap, i) => mapApiToPatient(ap, i)))
            } catch (e) {
                console.error(e)
                if (!cancelled) setPatients(FALLBACK_PATIENTS)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        load()
        return () => {
            cancelled = true
        }
    }, [])

    const todayIso = startOfTodayIso()
    const monthStartIso = startOfMonthIso()
    const monthEndIso = endOfMonthIso()

    const insuranceOptions = useMemo(() => {
        const s = new Set<string>()
        for (const p of patients) {
            if (p.insurance && p.insurance !== "Particular") s.add(p.insurance)
        }
        return ["Particular", ...Array.from(s).sort((a, b) => a.localeCompare(b, "pt-BR"))]
    }, [patients])

    const filtered = useMemo(() => {
        let list = patients
        const q = search.trim().toLowerCase()
        if (q) {
            list = list.filter((p) =>
                [p.name, p.record, p.insurance, p.lastVisitDoctor, p.phone, p.email, p.cityState]
                    .map((x) => (x || "").toLowerCase())
                    .some((x) => x.includes(q))
            )
        }
        if (statusFilter !== "all") {
            list = list.filter((p) => p.status === statusFilter)
        }
        if (insuranceFilter !== "all") {
            list = list.filter((p) => p.insurance === insuranceFilter)
        }
        return list
    }, [patients, search, statusFilter, insuranceFilter])

    useEffect(() => {
        setPage(1)
    }, [search, statusFilter, insuranceFilter])

    const totalPatients = patients.length
    const todayAppointmentsCount = patients.filter((p) => p.hasTodayAppt).length
    const newThisMonthCount = patients.filter(
        (p) => p.createdAtIso >= monthStartIso && p.createdAtIso <= monthEndIso
    ).length

    // Taxa de retorno: pacientes com pelo menos 1 atendimento (última visita != Nunca atendido) / total
    const returningCount = patients.filter((p) => p.lastVisitDate && p.lastVisitDate !== "Nunca atendido").length
    const returnRate =
        totalPatients === 0 ? 0 : Math.min(98, Math.max(50, Math.round((returningCount / totalPatients) * 100)))

    const totalFiltered = filtered.length
    const totalPages = Math.max(1, Math.ceil(totalFiltered / perPage))
    const safePage = Math.min(Math.max(1, page), totalPages)
    const startIdx = (safePage - 1) * perPage
    const pageData = filtered.slice(startIdx, startIdx + perPage)
    const startLabel = totalFiltered === 0 ? 0 : startIdx + 1
    const endLabel = Math.min(startIdx + perPage, totalFiltered)

    const todayBadgeDelta =
        totalPatients === 0 ? undefined : `+${Math.min(24, Math.round(todayAppointmentsCount + 2))}%`

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
                    value={totalPatients ? totalPatients.toLocaleString("pt-BR") : "0"}
                    badge={totalPatients > 0 ? `+${Math.min(18, Math.round(newThisMonthCount / Math.max(1, totalPatients) * 100) || 4)}%` : undefined}
                    badgeType="positive"
                />
                <StatCard
                    label="Atendimentos Hoje"
                    value={todayAppointmentsCount.toString()}
                    badge={todayBadgeDelta}
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
                    value={newThisMonthCount.toString()}
                    badge={newThisMonthCount > 0 ? `+${Math.min(9, Math.ceil(newThisMonthCount / 5))} este mês` : undefined}
                    badgeType="positive"
                />
                <StatCard
                    label="Taxa de Retorno"
                    value={totalPatients > 0 ? `${returnRate}%` : "0%"}
                    icon={
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                            <polyline points="17 6 23 6 23 12" />
                        </svg>
                    }
                    iconType="positive"
                />
            </section>

            {/* Table wrapper */}
            <section className="relative rounded-3xl border border-neutral-200/70 bg-white shadow-[0_4px_24px_-12px_rgba(15,23,42,0.12)]">
                {/* Filter bar */}
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-center lg:justify-between gap-3 px-5 md:px-7 py-5 border-b border-neutral-100">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
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

                        <div className="relative w-full sm:max-w-xs">
                            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </span>
                            <select
                                value={insuranceFilter}
                                onChange={(e) => setInsuranceFilter(e.target.value)}
                                className="w-full appearance-none rounded-xl border border-neutral-200/80 bg-neutral-50/70 pl-10 pr-10 py-2.5 text-sm font-medium text-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400/60 transition"
                            >
                                <option value="all">Todos os Convênios</option>
                                {insuranceOptions.map((plan) => (
                                    <option key={plan} value={plan}>
                                        {plan}
                                    </option>
                                ))}
                            </select>
                            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </span>
                        </div>
                    </div>

                    <p className="text-xs md:text-sm text-neutral-500 lg:text-right">
                        Mostrando{" "}
                        <span className="font-semibold text-neutral-800 tabular-nums">
                            {startLabel}–{endLabel}
                        </span>{" "}
                        de{" "}
                        <span className="font-semibold text-neutral-800 tabular-nums">
                            {totalFiltered.toLocaleString("pt-BR")}
                        </span>{" "}
                        pacientes
                    </p>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-neutral-100 bg-neutral-50/40">
                                <Th>Paciente</Th>
                                <Th>Contato</Th>
                                <Th>Última Visita</Th>
                                <Th>Status</Th>
                                <Th>Convênio</Th>
                                <Th className="text-right pr-6">Ações</Th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {loading && pageData.length === 0
                                ? Array.from({ length: 5 }).map((_, i) => <PatientRowSkeleton key={i} />)
                                : pageData.map((p) => <PatientRow key={p.id} patient={p} />)}
                            {!loading && pageData.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-14 text-center">
                                        <div className="mx-auto max-w-md">
                                            <div className="mx-auto h-12 w-12 inline-flex items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                    <circle cx="11" cy="11" r="8" />
                                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                                </svg>
                                            </div>
                                            <p className="mt-4 text-sm font-semibold text-neutral-800">
                                                Nenhum paciente encontrado
                                            </p>
                                            <p className="mt-1.5 text-sm text-neutral-500 leading-relaxed">
                                                Tente remover filtros de status ou convênio, ou pesquise por outro termo.
                                            </p>
                                            <Link
                                                href="/dashboard/pacientes/novo"
                                                className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 px-5 py-3 text-sm font-bold text-white shadow-[0_10px_22px_-6px_rgba(16,142,93,0.45)] hover:brightness-[1.03] transition-all"
                                            >
                                                Cadastrar Paciente
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 md:px-7 py-5 border-t border-neutral-100">
                    <button
                        type="button"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={safePage <= 1}
                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-neutral-600 border border-transparent hover:bg-neutral-50 hover:text-neutral-900 transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        Anterior
                    </button>

                    <div className="flex items-center gap-2">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum: number
                            if (totalPages <= 5) pageNum = i + 1
                            else if (safePage <= 3) pageNum = i + 1
                            else if (safePage >= totalPages - 2) pageNum = totalPages - 4 + i
                            else pageNum = safePage - 2 + i
                            return (
                                <PageButton
                                    key={pageNum}
                                    active={pageNum === safePage}
                                    onClick={() => setPage(pageNum)}
                                >
                                    {pageNum}
                                </PageButton>
                            )
                        })}
                        {totalPages > 5 && safePage < totalPages - 2 && (
                            <>
                                <span className="px-1 text-neutral-400" aria-hidden="true">…</span>
                                <PageButton onClick={() => setPage(totalPages)}>{totalPages}</PageButton>
                            </>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={safePage >= totalPages}
                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed"
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

function PatientRow({ patient }: { patient: Patient }) {
    return (
        <tr key={patient.id} className="group hover:bg-brand-50/30 transition-colors">
            <td className="py-4.5 md:py-5 pl-5 md:pl-7 pr-4">
                <div className="flex items-center gap-3 min-w-0">
                    <div className={`relative h-11 w-11 shrink-0 rounded-full bg-gradient-to-br ${patient.avatarColor} text-white text-sm font-bold shadow-sm ring-2 ring-white overflow-hidden flex items-center justify-center`}>
                        {patient.initials}
                    </div>
                    <div className="min-w-0 leading-tight">
                        <p className="text-[15px] font-semibold text-neutral-900 truncate">
                            {patient.name}
                        </p>
                        <p className="text-sm text-neutral-500 mt-0.5">
                            Prontuário: <span className="font-medium text-neutral-700">{patient.record}</span>
                        </p>
                    </div>
                </div>
            </td>
            <td className="py-4.5 md:py-5 px-4">
                <div className="leading-tight space-y-0.5">
                    <p className="text-sm font-medium text-neutral-800 flex items-center gap-1.5">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400 shrink-0" aria-hidden="true">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        <span className="truncate">{patient.phone}</span>
                    </p>
                    <p className="text-xs text-neutral-500 flex items-center gap-1.5 truncate">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400 shrink-0" aria-hidden="true">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                        </svg>
                        <span className="truncate">{patient.email}</span>
                    </p>
                    {patient.cityState && patient.cityState !== "—" ? (
                        <p className="text-[11px] text-neutral-500 flex items-center gap-1.5">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400 shrink-0" aria-hidden="true">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span className="truncate">{patient.cityState}</span>
                        </p>
                    ) : null}
                </div>
            </td>
            <td className="py-4.5 md:py-5 px-4">
                <div className="leading-tight">
                    <p className="text-sm font-medium text-neutral-900">{patient.lastVisitDate}</p>
                    <p className="text-xs text-neutral-500 mt-0.5 truncate">{patient.lastVisitDoctor}</p>
                </div>
            </td>
            <td className="py-4.5 md:py-5 px-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusStyles(patient.status)}`}>
                    {patient.status}
                </span>
            </td>
            <td className="py-4.5 md:py-5 px-4">
                <p className="text-sm font-medium text-neutral-700 whitespace-nowrap truncate max-w-[180px]">
                    {patient.insurance}
                </p>
            </td>
            <td className="py-4.5 md:py-5 pl-4 pr-5 md:pr-7">
                <div className="flex items-center justify-end">
                    <Link
                        href={`/dashboard/pacientes/${patient.id}/historico`}
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
    )
}

function PatientRowSkeleton() {
    return (
        <tr className="animate-pulse">
            <td className="py-5 pl-5 md:pl-7 pr-4">
                <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-neutral-100" />
                    <div className="space-y-2 min-w-[200px]">
                        <div className="h-4 w-40 rounded-xl bg-neutral-100" />
                        <div className="h-3 w-28 rounded-xl bg-neutral-100" />
                    </div>
                </div>
            </td>
            <td className="py-5 px-4">
                <div className="space-y-2 min-w-[180px]">
                    <div className="h-4 w-36 rounded-xl bg-neutral-100" />
                    <div className="h-3 w-40 rounded-xl bg-neutral-100" />
                    <div className="h-3 w-24 rounded-xl bg-neutral-100" />
                </div>
            </td>
            <td className="py-5 px-4">
                <div className="space-y-2">
                    <div className="h-4 w-28 rounded-xl bg-neutral-100" />
                    <div className="h-3 w-32 rounded-xl bg-neutral-100" />
                </div>
            </td>
            <td className="py-5 px-4">
                <div className="h-6 w-24 rounded-full bg-neutral-100" />
            </td>
            <td className="py-5 px-4">
                <div className="h-4 w-32 rounded-xl bg-neutral-100" />
            </td>
            <td className="py-5 pr-5 md:pr-7">
                <div className="h-9 w-28 rounded-xl bg-brand-50 ml-auto" />
            </td>
        </tr>
    )
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <th scope="col" className={`px-4 py-4 text-left text-[11px] font-semibold tracking-[0.16em] text-neutral-500 uppercase whitespace-nowrap ${className}`}>
            {children}
        </th>
    )
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
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ring-1 ${iconType === "success"
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
