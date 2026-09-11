"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

type AppointmentStatus = "CONFIRMED" | "PENDING"

type Appointment = {
    id: string
    patientName: string
    procedure: string
    time: string
    doctor: string
    status: AppointmentStatus
    avatarColor: string
    initials: string
    dateIso: string // YYYY-MM-DD
}

type ApiAppointment = {
    id: string
    dateTime: string
    status?: AppointmentStatus | string
    notes?: string | null
    type?: string | null
    room?: string | null
    patient?: { id: string; fullName: string | null } | null
    doctor?: { id: string; name: string | null } | null
}

type CalendarCell = {
    day: number
    date: Date
    iso: string
    inMonth: boolean
}

type DayMeta = {
    count: number
    confirmed: number
    pending: number
    badgeLabel?: string
    badgeType?: "ok" | "warning"
}

const WEEK_DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
const MONTHS = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
]

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

const FALLBACK_APPT: Appointment[] = [
    {
        id: "1",
        patientName: "Marcus Thompson",
        procedure: "Consulta Geral",
        time: "09:00 - 09:45",
        doctor: "Dr. Ricardo Mendes",
        status: "CONFIRMED",
        avatarColor: "from-emerald-400 to-green-600",
        initials: "MT",
        dateIso: toIsoDate(getTodayStart()),
    },
    {
        id: "2",
        patientName: "Elena Rodriguez",
        procedure: "Revisão de Exames",
        time: "11:30 - 12:00",
        doctor: "Dra. Julia Ramos",
        status: "PENDING",
        avatarColor: "from-rose-400 to-rose-600",
        initials: "ER",
        dateIso: toIsoDate(getTodayStart()),
    },
    {
        id: "3",
        patientName: "Arthur Pendragon",
        procedure: "Fisioterapia",
        time: "14:15 - 15:00",
        doctor: "Dra. Helena Souza",
        status: "CONFIRMED",
        avatarColor: "from-slate-400 to-slate-600",
        initials: "AP",
        dateIso: toIsoDate(getTodayStart()),
    },
    {
        id: "4",
        patientName: "Ana Clara",
        procedure: "Cardiologia",
        time: "16:00 - 16:45",
        doctor: "Dra. Beatriz Costa",
        status: "CONFIRMED",
        avatarColor: "from-sky-400 to-blue-600",
        initials: "AC",
        dateIso: plusDaysIso(2),
    },
    {
        id: "5",
        patientName: "Rafael Lima",
        procedure: "Neurologia",
        time: "10:00 - 11:00",
        doctor: "Dr. Marcos Vinícius",
        status: "PENDING",
        avatarColor: "from-violet-400 to-purple-600",
        initials: "RL",
        dateIso: plusDaysIso(2),
    },
    {
        id: "6",
        patientName: "Julia Mendes",
        procedure: "Check-up Anual",
        time: "08:30 - 09:15",
        doctor: "Dr. Ricardo Mendes",
        status: "CONFIRMED",
        avatarColor: "from-amber-300 to-orange-500",
        initials: "JM",
        dateIso: plusDaysIso(5),
    },
]

function getTodayStart(): Date {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
}

function pad(n: number): string {
    return n.toString().padStart(2, "0")
}

function toIsoDate(d: Date): string {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function plusDaysIso(days: number): string {
    const d = getTodayStart()
    d.setDate(d.getDate() + days)
    return toIsoDate(d)
}

function safeParseIso(iso: string): Date {
    const [y, m, d] = iso.split("-").map((v) => Number(v))
    if (!y || !m || !d) return getTodayStart()
    return new Date(y, m - 1, d, 0, 0, 0, 0)
}

function isSameDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    )
}

function formatLongPt(d: Date): string {
    try {
        return d.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "short",
        }).replace(/(^\w{1})|(\s+\w{1})/g, (l) => l.toUpperCase())
    } catch {
        return `${WEEK_DAYS[(d.getDay() + 6) % 7]}, ${pad(d.getDate())} ${MONTHS[d.getMonth()].slice(0, 3)}`
    }
}

function formatMonthYearTitle(d: Date): string {
    return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

function formatShortHeader(iso: string): string {
    const d = safeParseIso(iso)
    const today = getTodayStart()
    const tm = new Date(today.getTime() + 86400000)
    if (isSameDay(d, today)) return "Hoje"
    if (isSameDay(d, tm)) return "Amanhã"
    return formatLongPt(d)
}

function buildCalendarGrid(viewMonth: Date): CalendarCell[] {
    const y = viewMonth.getFullYear()
    const m = viewMonth.getMonth()
    const first = new Date(y, m, 1, 0, 0, 0, 0)
    const rawDow = first.getDay() // 0=dom...6=sab
    const startOffset = (rawDow + 6) % 7
    const daysInMonth = new Date(y, m + 1, 0).getDate()
    const prevDays = new Date(y, m, 0).getDate()

    const cells: CalendarCell[] = []
    for (let i = startOffset - 1; i >= 0; i--) {
        const day = prevDays - i
        const date = new Date(y, m - 1, day, 0, 0, 0, 0)
        cells.push({ day, date, iso: toIsoDate(date), inMonth: false })
    }
    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(y, m, d, 0, 0, 0, 0)
        cells.push({ day: d, date, iso: toIsoDate(date), inMonth: true })
    }
    while (cells.length < 42) {
        const last = cells[cells.length - 1].date
        const n = new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1, 0, 0, 0, 0)
        cells.push({ day: n.getDate(), date: n, iso: toIsoDate(n), inMonth: n.getMonth() === m })
    }
    return cells
}

function hash(s: string): number {
    let h = 0
    for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i) | 0
    return Math.abs(h)
}

function initalsFromName(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (parts.length === 0) return "?"
    return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase()
}

function mapApiAppointments(list: ApiAppointment[]): Appointment[] {
    return list.map((a) => {
        const patientName = a.patient?.fullName?.trim() || "Paciente"
        const doctor = a.doctor?.name?.trim() || "Médico(a)"
        const dt = new Date(a.dateTime)
        const dateIso = toIsoDate(dt)
        let time = "—"
        if (!isNaN(dt.getTime())) {
            const start = `${pad(dt.getHours())}:${pad(dt.getMinutes())}`
            const endDt = new Date(dt.getTime() + 45 * 60000)
            const end = `${pad(endDt.getHours())}:${pad(endDt.getMinutes())}`
            time = `${start} - ${end}`
        }
        const status: AppointmentStatus =
            typeof a.status === "string" && a.status.toUpperCase() === "PENDING" ? "PENDING" : "CONFIRMED"
        const procedure = a.type || "Consulta"
        const avIdx = a.patient?.id ? hash(a.patient.id) % AVATAR_PALETTE.length : hash(patientName) % AVATAR_PALETTE.length
        return {
            id: a.id,
            patientName,
            procedure,
            time,
            doctor,
            status,
            avatarColor: AVATAR_PALETTE[avIdx],
            initials: initalsFromName(patientName),
            dateIso,
        }
    })
}

export default function AppointmentsPage() {
    const today = getTodayStart()
    const todayIso = toIsoDate(today)

    const [viewMonth, setViewMonth] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), 1))
    const [selectedDate, setSelectedDate] = useState<string>(todayIso)
    const [jumpDateInput, setJumpDateInput] = useState<string>(todayIso)
    const [loading, setLoading] = useState(true)
    const [allAppointments, setAllAppointments] = useState<Appointment[]>(FALLBACK_APPT)

    useEffect(() => {
        let cancelled = false
        async function load() {
            try {
                const res = await fetch("/api/appointments")
                if (!res.ok) throw new Error("fail")
                const data = await res.json()
                if (cancelled) return
                const list: ApiAppointment[] = data.appointments ?? []
                if (list.length > 0) {
                    setAllAppointments(mapApiAppointments(list))
                    return
                }
                setAllAppointments(FALLBACK_APPT)
            } catch (e) {
                if (!cancelled) setAllAppointments(FALLBACK_APPT)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        load()
        return () => {
            cancelled = true
        }
    }, [])

    // Pré-computa estatísticas por data (para os badges do calendário)
    const dayMetaMap = useMemo(() => {
        const map = new Map<string, DayMeta>()
        for (const a of allAppointments) {
            const existing = map.get(a.dateIso) || { count: 0, confirmed: 0, pending: 0 }
            existing.count += 1
            if (a.status === "CONFIRMED") existing.confirmed += 1
            else existing.pending += 1
            map.set(a.dateIso, existing)
        }
        for (const [k, v] of map) {
            if (v.count >= 4) v.badgeType = "ok"
            else if (v.pending >= 2) v.badgeType = "warning"
            else v.badgeType = v.count ? "ok" : undefined
            v.badgeLabel = v.count ? `${v.count} Atend.` : undefined
            map.set(k, v)
        }
        return map
    }, [allAppointments])

    const appointmentsForSelected = useMemo(() => {
        return allAppointments.filter((a) => a.dateIso === selectedDate)
    }, [allAppointments, selectedDate])

    const appointmentsToday = appointmentsForSelected.length
    const selectedLabel = formatShortHeader(selectedDate)

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Search bar */}
            <div className="mx-auto max-w-md w-full">
                <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </span>
                    <input
                        type="search"
                        placeholder="Pesquisar agendamentos, pacientes..."
                        className="w-full rounded-full border border-neutral-200/80 bg-white/90 py-3 pl-11 pr-4 text-sm placeholder:text-neutral-400 shadow-[0_2px_10px_rgba(15,23,42,0.05)] focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400/60 transition"
                    />
                </div>
            </div>

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/dashboard" className="hover:text-neutral-800 transition-colors">
                    Dashboard
                </Link>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-300" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
                <span className="font-semibold text-brand-700">Agendamento</span>
            </nav>

            {/* 2 colunas: calendário + painel lateral */}
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-5 md:gap-7">
                {/* Calendário */}
                <section className="rounded-3xl border border-neutral-200/70 bg-white p-5 md:p-7 shadow-[0_4px_24px_-14px_rgba(15,23,42,0.12)]">
                    {/* Header calendar */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-serif font-semibold tracking-tight text-neutral-900">
                                {formatMonthYearTitle(viewMonth)}
                            </h2>
                            <p className="text-sm text-neutral-500 mt-1">
                                Visão Mensal de Agenda
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <NavButton
                                direction="prev"
                                onClick={() =>
                                    setViewMonth((v) => new Date(v.getFullYear(), v.getMonth() - 1, 1))
                                }
                            />
                            <NavButton
                                direction="next"
                                onClick={() =>
                                    setViewMonth((v) => new Date(v.getFullYear(), v.getMonth() + 1, 1))
                                }
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const t = getTodayStart()
                                    setSelectedDate(toIsoDate(t))
                                    setJumpDateInput(toIsoDate(t))
                                    setViewMonth(new Date(t.getFullYear(), t.getMonth(), 1))
                                }}
                                className="inline-flex items-center justify-center rounded-xl bg-brand-50 text-brand-700 px-4 py-2.5 text-sm font-bold ring-1 ring-brand-600/10 hover:bg-brand-100 transition-colors"
                            >
                                Hoje
                            </button>
                        </div>
                    </div>

                    {/* Barra adicional: seletores de mês/ano + busca data */}
                    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-4 mb-5">
                        <div>
                            <label className="block text-[11px] font-black uppercase tracking-[0.16em] text-neutral-500 mb-1.5">
                                Ir para data
                            </label>
                            <div className="relative">
                                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <rect x="3" y="4" width="18" height="18" rx="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                </span>
                                <input
                                    type="date"
                                    value={jumpDateInput}
                                    onChange={(e) => {
                                        const v = e.target.value
                                        setJumpDateInput(v)
                                        if (v) {
                                            setSelectedDate(v)
                                            const d = safeParseIso(v)
                                            setViewMonth(new Date(d.getFullYear(), d.getMonth(), 1))
                                        }
                                    }}
                                    className="w-full rounded-2xl border-2 border-neutral-200/80 bg-white pl-11 pr-4 py-2.5 text-sm font-semibold text-neutral-800 tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400/60 transition"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-2xl border-2 border-neutral-200/80 bg-gradient-to-br from-neutral-50 to-white px-3 py-2.5">
                            <select
                                aria-label="Mês"
                                value={viewMonth.getMonth()}
                                onChange={(e) =>
                                    setViewMonth(new Date(viewMonth.getFullYear(), Number(e.target.value), 1))
                                }
                                className="flex-1 bg-transparent px-2 py-1.5 rounded-xl appearance-none text-[14px] font-black text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500/30 cursor-pointer hover:bg-white"
                            >
                                {MONTHS.map((m, i) => (
                                    <option key={m} value={i}>
                                        {m}
                                    </option>
                                ))}
                            </select>
                            <select
                                aria-label="Ano"
                                value={viewMonth.getFullYear()}
                                onChange={(e) =>
                                    setViewMonth(new Date(Number(e.target.value), viewMonth.getMonth(), 1))
                                }
                                className="bg-transparent px-2 py-1.5 rounded-xl appearance-none text-[14px] font-black text-neutral-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500/30 cursor-pointer hover:bg-white"
                            >
                                {Array.from({ length: 11 }, (_, i) => viewMonth.getFullYear() - 2 + i).map((y) => (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Dias da semana */}
                    <div className="grid grid-cols-7 gap-2 md:gap-3 mb-2">
                        {WEEK_DAYS.map((d) => (
                            <div
                                key={d}
                                className="text-center text-[11px] md:text-xs font-black tracking-[0.16em] uppercase text-neutral-500 py-2"
                            >
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Grade do calendário (6 semanas) */}
                    <div className="grid grid-cols-7 gap-2 md:gap-3">
                        {buildCalendarGrid(viewMonth).map((cell, i) => {
                            const meta = dayMetaMap.get(cell.iso)
                            const isPast = cell.inMonth && cell.date < today
                            const isToday = cell.inMonth && isSameDay(cell.date, today)
                            const isSelected = cell.inMonth && cell.iso === selectedDate
                            const clickable = cell.inMonth && !isPast

                            return (
                                <button
                                    type="button"
                                    key={`${cell.iso}-${i}`}
                                    disabled={!clickable}
                                    onClick={() => {
                                        if (!clickable) return
                                        setSelectedDate(cell.iso)
                                        setJumpDateInput(cell.iso)
                                    }}
                                    className={[
                                        "group relative aspect-square min-h-[64px] md:min-h-[76px] rounded-2xl p-1.5 md:p-2 text-sm transition-all duration-200 select-none",
                                        !cell.inMonth ? "pointer-events-none opacity-0" : "",
                                        !clickable
                                            ? "text-neutral-300 cursor-not-allowed line-through"
                                            : isSelected
                                                ? "bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 text-white shadow-[0_12px_26px_-10px_rgba(16,142,93,0.55)] ring-2 ring-brand-600/25 scale-[1.03]"
                                                : isToday
                                                    ? "bg-brand-50 text-brand-800 ring-2 ring-brand-600/30 hover:bg-brand-100"
                                                    : "hover:bg-neutral-50 text-neutral-800",
                                    ].join(" ")}
                                >
                                    <div className="flex items-start justify-between gap-1">
                                        <span
                                            className={`text-[13px] md:text-sm font-bold ${
                                                isSelected ? "text-white" : ""
                                            }`}
                                        >
                                            {cell.day}
                                        </span>
                                        {isToday && !isSelected && (
                                            <span className="h-1.5 w-1.5 rounded-full bg-brand-600 shadow-[0_0_0_3px_rgba(16,185,129,0.15)]" />
                                        )}
                                    </div>

                                    <div className="mt-1 flex flex-col items-center gap-1 md:gap-1.5 justify-end min-h-[calc(100%-20px)]">
                                        {meta?.badgeLabel && (
                                            <span
                                                className={`inline-flex px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-lg text-[9.5px] md:text-[10.5px] font-extrabold tracking-wide ${
                                                    meta.badgeType === "warning"
                                                        ? isSelected
                                                            ? "bg-white/25 text-white ring-1 ring-white/20"
                                                            : "bg-amber-100 text-amber-800 ring-1 ring-amber-700/20"
                                                        : isSelected
                                                            ? "bg-white/25 text-white ring-1 ring-white/20"
                                                            : "bg-brand-50 text-brand-700 ring-1 ring-brand-600/20"
                                                }`}
                                            >
                                                {meta.badgeLabel}
                                            </span>
                                        )}
                                        {meta?.count ? (
                                            <div className="flex items-center gap-1 mt-auto pb-0.5">
                                                {meta.confirmed > 0 && (
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${
                                                            isSelected ? "bg-white/90" : "bg-brand-600"
                                                        }`}
                                                        aria-hidden="true"
                                                    />
                                                )}
                                                {meta.pending > 0 && (
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${
                                                            isSelected ? "bg-amber-200" : "bg-amber-500"
                                                        }`}
                                                        aria-hidden="true"
                                                    />
                                                )}
                                            </div>
                                        ) : null}
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </section>

                {/* Painel direito */}
                <section className="space-y-5 md:space-y-6">
                    {/* Selected Date Card */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 text-white p-6 md:p-7 shadow-[0_14px_34px_-8px_rgba(16,142,93,0.45)]">
                        <div aria-hidden="true" className="absolute -right-16 -bottom-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                        <div aria-hidden="true" className="absolute -left-14 -top-20 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl" />

                        <div className="relative">
                            <p className="text-[11px] md:text-xs font-bold tracking-[0.22em] uppercase text-white/70">
                                Data Selecionada
                            </p>
                            <h3 className="mt-2 text-2xl md:text-[28px] font-serif font-semibold tracking-tight leading-tight">
                                {selectedLabel}
                            </h3>

                            <div className="mt-5 flex items-center gap-3">
                                <div className="flex -space-x-3">
                                    {appointmentsForSelected.slice(0, 2).map((a) => (
                                        <AvatarPill
                                            key={a.id}
                                            gradient={a.avatarColor}
                                            initials={a.initials}
                                        />
                                    ))}
                                    {appointmentsForSelected.length > 2 && (
                                        <span className="relative inline-flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-emerald-300/90 text-brand-900 text-[11px] font-bold ring-2 ring-brand-700 shadow">
                                            +{appointmentsForSelected.length - 2}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm md:text-[15px] font-medium text-white/90">
                                    <span className="font-semibold text-white">{appointmentsToday}</span>{" "}
                                    {appointmentsToday === 1 ? "Agendamento" : "Agendamentos"} {selectedLabel === "Hoje" ? "Hoje" : ""}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Daily schedule */}
                    <section className="rounded-3xl border border-neutral-200/70 bg-white shadow-[0_4px_24px_-14px_rgba(15,23,42,0.12)] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between px-5 md:px-6 py-4 md:py-5 border-b border-neutral-100">
                            <div>
                                <h3 className="text-lg md:text-xl font-serif font-semibold text-neutral-900">
                                    Agenda do Dia
                                </h3>
                                <p className="text-xs text-neutral-500 mt-0.5">
                                    {formatShortHeader(selectedDate)} — {appointmentsForSelected.length} total
                                </p>
                            </div>
                            <Link
                                href="/dashboard/agendamento/novo"
                                aria-label="Novo agendamento"
                                className="h-9 w-9 inline-flex items-center justify-center rounded-xl bg-brand-600 text-white hover:bg-brand-700 shadow-[0_6px_14px_-4px_rgba(16,142,93,0.5)] transition-colors"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                            </Link>
                        </div>

                        <div className="flex-1 px-3 md:px-5 py-4 space-y-3 md:space-y-4 max-h-[480px] overflow-y-auto">
                            {loading && appointmentsForSelected.length === 0
                                ? Array.from({ length: 3 }).map((_, i) => (
                                      <AppointmentCardSkeleton key={i} />
                                  ))
                                : appointmentsForSelected.map((a) => (
                                      <AppointmentCard key={a.id} appointment={a} />
                                  ))}

                            {!loading && appointmentsForSelected.length === 0 ? (
                                <div className="mt-6 md:mt-8 text-center py-8">
                                    <div className="relative mx-auto h-12 w-12 inline-flex items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                            <polyline points="22 4 12 14.01 9 11.01" />
                                            <line x1="12" y1="6" x2="12" y2="12" />
                                            <line x1="16" y1="12" x2="10" y2="16" />
                                        </svg>
                                    </div>
                                    <p className="mt-4 text-sm font-semibold text-neutral-700">
                                        Nenhum agendamento para {formatShortHeader(selectedDate)}
                                    </p>
                                    <p className="mt-1 text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
                                        Clique em <span className="font-semibold text-brand-700">+ Novo Agendamento</span> no topo para começar.
                                    </p>
                                    <Link
                                        href="/dashboard/agendamento/novo"
                                        className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 px-5 py-3 text-sm font-bold text-white shadow-[0_10px_22px_-6px_rgba(16,142,93,0.45)] hover:brightness-[1.03] transition-all"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <line x1="12" y1="5" x2="12" y2="19" />
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                        </svg>
                                        Criar Agendamento
                                    </Link>
                                </div>
                            ) : null}
                        </div>

                        <div className="px-5 md:px-6 py-4 md:py-5 border-t border-neutral-100">
                            <Link
                                href="/dashboard/agendamento/todos"
                                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-brand-700/70 px-4 py-3 text-[14px] font-bold text-brand-700 hover:bg-brand-700 hover:text-white hover:shadow-[0_8px_18px_rgba(16,142,93,0.22)] transition-all"
                            >
                                Ver Todos os Agendamentos
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </Link>
                        </div>
                    </section>
                </section>
            </div>
        </div>
    )
}

function NavButton({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
    const isPrev = direction === "prev"
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={isPrev ? "Mês anterior" : "Próximo mês"}
            className="inline-flex h-11 w-11 md:h-10 md:w-10 items-center justify-center rounded-xl border border-neutral-200/80 bg-white text-neutral-700 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition-colors"
        >
            {isPrev ? (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="15 18 9 12 15 6" />
                </svg>
            ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            )}
        </button>
    )
}

function AppointmentCard({ appointment }: { appointment: Appointment }) {
    const statusPill =
        appointment.status === "CONFIRMED"
            ? "bg-green-100 text-green-700 ring-1 ring-green-700/15"
            : "bg-amber-100 text-amber-700 ring-1 ring-amber-600/15"
    const statusLabel = appointment.status === "CONFIRMED" ? "Confirmado" : "Pendente"

    return (
        <article className="group rounded-2xl bg-neutral-50/60 hover:bg-neutral-100/80 transition-colors p-3 md:p-4">
            <div className="flex items-start gap-3 md:gap-4">
                <div
                    className={`mt-0.5 relative h-11 w-11 shrink-0 rounded-2xl bg-gradient-to-br ${appointment.avatarColor} text-white text-xs font-bold ring-2 ring-white shadow-sm flex items-center justify-center overflow-hidden`}
                >
                    <span className="relative drop-shadow-[0_1px_0_rgba(0,0,0,0.15)]">
                        {appointment.initials}
                    </span>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="min-w-0">
                            <p className="text-[15px] font-semibold text-neutral-900 truncate">
                                {appointment.patientName}
                            </p>
                            <p className="text-sm text-neutral-500 mt-0.5 truncate">
                                {appointment.procedure}
                            </p>
                        </div>
                        <span className={`shrink-0 self-start inline-flex px-3 py-1 rounded-full text-[10.5px] md:text-[11px] font-extrabold tracking-wide uppercase ${statusPill}`}>
                            {statusLabel}
                        </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs md:text-sm text-neutral-600">
                        <span className="inline-flex items-center gap-1.5">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-neutral-400">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            {appointment.time}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-neutral-400">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            {appointment.doctor}
                        </span>
                    </div>
                </div>
            </div>
        </article>
    )
}

function AppointmentCardSkeleton() {
    return (
        <div className="rounded-2xl bg-neutral-50/60 p-3 md:p-4 animate-pulse">
            <div className="flex items-start gap-3 md:gap-4">
                <div className="h-11 w-11 shrink-0 rounded-2xl bg-neutral-200" />
                <div className="flex-1 min-w-0 space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                        <div className="space-y-2 flex-1">
                            <div className="h-4 w-40 rounded-lg bg-neutral-200" />
                            <div className="h-3 w-28 rounded-lg bg-neutral-200" />
                        </div>
                        <div className="h-6 w-20 rounded-full bg-neutral-200 shrink-0" />
                    </div>
                    <div className="flex flex-wrap gap-5 pt-1">
                        <div className="h-3 w-24 rounded-lg bg-neutral-200" />
                        <div className="h-3 w-32 rounded-lg bg-neutral-200" />
                    </div>
                </div>
            </div>
        </div>
    )
}

function AvatarPill({ gradient, initials, ring = "ring-brand-700" }: { gradient: string; initials: string; ring?: string }) {
    return (
        <span
            className={`relative inline-flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-white text-[11px] md:text-xs font-bold ring-2 ${ring} shadow-sm overflow-hidden`}
        >
            {initials}
        </span>
    )
}
