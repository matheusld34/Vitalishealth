"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { Role } from "@/generated/prisma/client"

type Props = {
    userId: string
    userRole: Role
    userName: string
}

type ApiAppointment = {
    id: string
    dateTime: string
    durationMinutes?: number | null
    status?: string | null
    specialties?: string[] | null
    observation?: string | null
    patient?: {
        id: string
        fullName: string | null
        insuranceOperator?: string | null
    } | null
    doctor?: { id: string; name: string | null } | null
}

type AgendaItem = {
    id: string
    patientId: string
    patientName: string
    patientInitials: string
    patientGradient: string
    doctorName: string
    specialty: string
    insurance: string
    date: Date
    time: string
    dayLabel: string
    duration: number
    rawStatus: string
    isToday: boolean
    isPast: boolean
    isActionable: boolean
}

type TabKey = "today" | "upcoming" | "past"
type FinalStatus = "COMPLETED" | "NO_SHOW"

const POLL_MS = 15000

const STATUS_META: Record<string, { label: string; className: string; dot: string }> = {
    SCHEDULED: {
        label: "Pendente",
        className: "bg-amber-50 text-amber-700 border-amber-200/70",
        dot: "bg-amber-500",
    },
    CONFIRMED: {
        label: "Confirmado",
        className: "bg-sky-50 text-sky-700 border-sky-200/70",
        dot: "bg-sky-500",
    },
    URGENTE: {
        label: "Urgente",
        className: "bg-rose-50 text-rose-700 border-rose-200/70",
        dot: "bg-rose-500",
    },
    COMPLETED: {
        label: "Realizada",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
        dot: "bg-emerald-500",
    },
    CANCELED: {
        label: "Cancelada",
        className: "bg-neutral-100 text-neutral-600 border-neutral-200",
        dot: "bg-neutral-400",
    },
    NO_SHOW: {
        label: "Paciente faltou",
        className: "bg-orange-50 text-orange-700 border-orange-200/70",
        dot: "bg-orange-500",
    },
}

const FALLBACK_STATUS = {
    label: "Agendada",
    className: "bg-neutral-100 text-neutral-600 border-neutral-200",
    dot: "bg-neutral-400",
}

const ACTIONABLE_STATUS = ["SCHEDULED", "CONFIRMED", "URGENTE"]

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

function startOfDay(base: Date): Date {
    const d = new Date(base)
    d.setHours(0, 0, 0, 0)
    return d
}

function addDays(base: Date, days: number): Date {
    const d = new Date(base)
    d.setDate(d.getDate() + days)
    return d
}

function hash(value: string): number {
    let h = 0
    for (let i = 0; i < value.length; i++) h = ((h << 5) - h + value.charCodeAt(i)) | 0
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

function timeLabel(date: Date): string {
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function dayLabel(date: Date, now: Date): string {
    const today = startOfDay(now)
    const tomorrow = addDays(today, 1)
    const afterTomorrow = addDays(today, 2)

    if (date >= today && date < tomorrow) return "Hoje"
    if (date >= tomorrow && date < afterTomorrow) return "Amanhã"
    return `${WEEKDAYS_SHORT[date.getDay()]}, ${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`
}

function buildItem(raw: ApiAppointment, now: Date): AgendaItem {
    const parsed = new Date(raw.dateTime)
    const date = Number.isNaN(parsed.getTime()) ? new Date(now) : parsed
    const today = startOfDay(now)
    const endOfToday = new Date(today)
    endOfToday.setHours(23, 59, 59, 999)

    const isToday = date >= today && date <= endOfToday
    const isPast = date < today
    const patientName = raw.patient?.fullName?.trim() || "Paciente não identificado"
    const rawStatus = (raw.status || "SCHEDULED").toUpperCase()
    const specialty =
        (raw.specialties ?? [])[0]?.trim() ||
        raw.observation?.trim() ||
        "Atendimento clínico"

    return {
        id: raw.id,
        patientId: raw.patient?.id ?? "",
        patientName,
        patientInitials: initialsFromName(patientName),
        patientGradient: paletteFor(patientName + raw.id),
        doctorName: raw.doctor?.name?.trim() || "Médico(a) não atribuído(a)",
        specialty,
        insurance: raw.patient?.insuranceOperator?.trim() || "Particular",
        date,
        time: timeLabel(date),
        dayLabel: dayLabel(date, now),
        duration: typeof raw.durationMinutes === "number" && raw.durationMinutes > 0 ? raw.durationMinutes : 30,
        rawStatus,
        isToday,
        isPast,
        isActionable: ACTIONABLE_STATUS.includes(rawStatus) && (isToday || isPast),
    }
}

/* ---------- COMPONENTE ---------- */

export default function MyAgendaPage({ userId, userRole, userName }: Props) {
    const isMaster = userRole === "MASTER"

    const [items, setItems] = useState<AgendaItem[]>([])
    const [now, setNow] = useState(() => new Date())
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [offline, setOffline] = useState(false)
    const [lastSync, setLastSync] = useState<Date | null>(null)
    const [tab, setTab] = useState<TabKey>("today")
    const [updatingId, setUpdatingId] = useState<string | null>(null)
    const [actionError, setActionError] = useState<string | null>(null)
    const [doctors, setDoctors] = useState<{ id: string; name: string }[]>([])
    const [doctorFilter, setDoctorFilter] = useState("")

    const inFlight = useRef(false)

    const load = useCallback(
        async (options?: { silent?: boolean }) => {
            if (inFlight.current) return
            inFlight.current = true

            if (options?.silent) setRefreshing(true)
            else setLoading(true)

            try {
                const query = isMaster
                    ? doctorFilter
                        ? `?doctorId=${encodeURIComponent(doctorFilter)}`
                        : ""
                    : `?doctorId=${encodeURIComponent(userId)}`

                const res = await fetch(`/api/appointments${query}`, { cache: "no-store" })
                if (!res.ok) throw new Error(`HTTP ${res.status}`)

                const json = await res.json()
                const list: ApiAppointment[] = Array.isArray(json?.appointments) ? json.appointments : []
                const reference = new Date()

                setItems(list.map((item) => buildItem(item, reference)))
                setNow(reference)
                setOffline(false)
                setLastSync(reference)
            } catch {
                setOffline(true)
            } finally {
                inFlight.current = false
                setLoading(false)
                setRefreshing(false)
            }
        },
        [doctorFilter, isMaster, userId]
    )

    useEffect(() => {
        void load()
    }, [load])

    useEffect(() => {
        const interval = setInterval(() => void load({ silent: true }), POLL_MS)
        const onFocus = () => void load({ silent: true })
        const onVisibility = () => {
            if (document.visibilityState === "visible") void load({ silent: true })
        }

        window.addEventListener("focus", onFocus)
        document.addEventListener("visibilitychange", onVisibility)

        return () => {
            clearInterval(interval)
            window.removeEventListener("focus", onFocus)
            document.removeEventListener("visibilitychange", onVisibility)
        }
    }, [load])

    useEffect(() => {
        if (!isMaster) return
        let alive = true

        fetch("/api/doctors", { cache: "no-store" })
            .then((res) => (res.ok ? res.json() : null))
            .then((json) => {
                if (!alive || !json || !Array.isArray(json.doctors)) return
                setDoctors(
                    json.doctors.map((doc: { id: string; name?: string | null }) => ({
                        id: doc.id,
                        name: doc.name?.trim() || "Médico(a)",
                    }))
                )
            })
            .catch(() => undefined)

        return () => {
            alive = false
        }
    }, [isMaster])

    const mark = useCallback(
        async (id: string, status: FinalStatus) => {
            setUpdatingId(id)
            setActionError(null)

            try {
                const res = await fetch(`/api/appointments/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status }),
                })
                const json = await res.json().catch(() => ({} as { error?: string }))

                if (!res.ok) {
                    setActionError(json?.error || "Não foi possível atualizar a consulta.")
                    return
                }

                setItems((prev) =>
                    prev.map((item) =>
                        item.id === id
                            ? { ...item, rawStatus: status, isActionable: false }
                            : item
                    )
                )
                setLastSync(new Date())
                void load({ silent: true })
            } catch {
                setActionError("Falha de conexão ao atualizar a consulta.")
            } finally {
                setUpdatingId(null)
            }
        },
        [load]
    )

    const stats = useMemo(() => {
        const today = items.filter((item) => item.isToday)
        return {
            total: today.length,
            done: today.filter((item) => item.rawStatus === "COMPLETED").length,
            missed: today.filter((item) => item.rawStatus === "NO_SHOW").length,
            pending: today.filter((item) => item.isActionable).length,
        }
    }, [items])

    const buckets = useMemo(() => {
        const byTimeAsc = (a: AgendaItem, b: AgendaItem) => a.date.getTime() - b.date.getTime()
        const byTimeDesc = (a: AgendaItem, b: AgendaItem) => b.date.getTime() - a.date.getTime()

        return {
            today: items.filter((item) => item.isToday).sort(byTimeAsc),
            upcoming: items.filter((item) => !item.isToday && !item.isPast).sort(byTimeAsc),
            past: items.filter((item) => item.isPast).sort(byTimeDesc),
        }
    }, [items])

    const tabs: { key: TabKey; label: string; count: number }[] = [
        { key: "today", label: "Hoje", count: buckets.today.length },
        { key: "upcoming", label: "Próximas", count: buckets.upcoming.length },
        { key: "past", label: "Anteriores", count: buckets.past.length },
    ]

    const visible = buckets[tab]

    const syncLabel = lastSync
        ? `Atualizado às ${timeLabel(lastSync)}`
        : "Aguardando sincronização"

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Cabeçalho */}
            <section className="relative overflow-hidden rounded-3xl border border-brand-700/30 bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 p-6 md:p-8 text-white shadow-[0_24px_60px_-28px_rgba(16,142,93,0.65)]">
                <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-emerald-300/15 blur-3xl" />

                <div className="relative flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ring-1 ring-white/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                            Agenda clínica
                        </span>
                        <h1 className="mt-3 text-2xl md:text-[30px] font-semibold tracking-tight">
                            Minha Agenda
                        </h1>
                        <p className="mt-1.5 max-w-xl text-sm md:text-[15px] leading-relaxed text-white/85">
                            {isMaster
                                ? "Acompanhe as consultas do dia e as marcadas de todo o corpo clínico."
                                : `Olá, ${userName.split(" ")[0]}. Confira suas consultas do dia e os próximos atendimentos marcados.`}
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold ring-1 ${
                                offline
                                    ? "bg-rose-400/20 ring-rose-200/40 text-rose-50"
                                    : "bg-white/12 ring-white/20 text-white/90"
                            }`}
                        >
                            <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                    offline ? "bg-rose-300" : "bg-emerald-300 animate-pulse"
                                }`}
                            />
                            {offline ? "Sem conexão" : "Sincronizado"}
                        </span>
                        <span className="text-[11px] text-white/70">{syncLabel}</span>
                        <button
                            type="button"
                            onClick={() => void load({ silent: true })}
                            disabled={refreshing}
                            className="inline-flex items-center gap-2 rounded-xl bg-white/12 px-3.5 py-2 text-xs font-semibold ring-1 ring-white/20 transition-all hover:bg-white/20 disabled:opacity-60"
                        >
                            <svg
                                className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                                <path d="M21 3v6h-6" />
                            </svg>
                            Atualizar
                        </button>
                    </div>
                </div>

                {/* Indicadores do dia */}
                <div className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <HeroStat label="Consultas hoje" value={stats.total} />
                    <HeroStat label="Aguardando" value={stats.pending} highlight />
                    <HeroStat label="Realizadas" value={stats.done} />
                    <HeroStat label="Faltas" value={stats.missed} />
                </div>
            </section>

            {/* Abas + filtro */}
            <section className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex rounded-2xl border border-neutral-200/80 bg-white p-1 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
                    {tabs.map((entry) => {
                        const active = entry.key === tab
                        return (
                            <button
                                key={entry.key}
                                type="button"
                                onClick={() => setTab(entry.key)}
                                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                                    active
                                        ? "bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-[0_6px_16px_rgba(16,142,93,0.22)]"
                                        : "text-neutral-600 hover:text-neutral-900"
                                }`}
                            >
                                {entry.label}
                                <span
                                    className={`rounded-full px-1.5 py-0.5 text-[10.5px] font-bold ${
                                        active ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-500"
                                    }`}
                                >
                                    {entry.count}
                                </span>
                            </button>
                        )
                    })}
                </div>

                {isMaster && doctors.length > 0 && (
                    <div className="flex items-center gap-2">
                        <label htmlFor="doctorFilter" className="text-xs font-semibold text-neutral-500">
                            Médico
                        </label>
                        <select
                            id="doctorFilter"
                            value={doctorFilter}
                            onChange={(event) => setDoctorFilter(event.target.value)}
                            className="rounded-xl border border-neutral-200/80 bg-white px-3.5 py-2.5 text-sm text-neutral-700 shadow-[0_2px_10px_rgba(15,23,42,0.04)] focus:border-brand-400/60 focus:outline-none focus:ring-2 focus:ring-brand-500/25"
                        >
                            <option value="">Todos os médicos</option>
                            {doctors.map((doc) => (
                                <option key={doc.id} value={doc.id}>
                                    {doc.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </section>

            {actionError && (
                <div className="flex items-start justify-between gap-3 rounded-2xl border border-rose-200/70 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    <span>{actionError}</span>
                    <button
                        type="button"
                        onClick={() => setActionError(null)}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-800"
                    >
                        Fechar
                    </button>
                </div>
            )}

            {/* Lista */}
            <section className="space-y-3">
                {loading ? (
                    <>
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </>
                ) : visible.length === 0 ? (
                    <EmptyState tab={tab} isMaster={isMaster} />
                ) : (
                    visible.map((item) => {
                        const meta = STATUS_META[item.rawStatus] ?? FALLBACK_STATUS
                        const isUpdating = updatingId === item.id

                        return (
                            <article
                                key={item.id}
                                className="group relative overflow-hidden rounded-2xl border border-neutral-200/70 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition-all duration-200 hover:border-brand-200 hover:shadow-[0_12px_32px_-16px_rgba(15,23,42,0.22)] md:p-5"
                            >
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                                    {/* Horário */}
                                    <div className="flex items-center gap-3 lg:w-28 lg:shrink-0 lg:flex-col lg:items-start lg:gap-1">
                                        <span className="text-2xl font-bold tabular-nums text-neutral-900">
                                            {item.time}
                                        </span>
                                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-500">
                                            {item.duration} min
                                        </span>
                                    </div>

                                    <span className={`hidden h-14 w-1 shrink-0 rounded-full lg:block ${meta.dot}`} />

                                    {/* Paciente */}
                                    <div className="flex min-w-0 flex-1 items-center gap-3">
                                        <span
                                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-bold text-white shadow-[0_6px_16px_-8px_rgba(15,23,42,0.5)] ${item.patientGradient}`}
                                        >
                                            {item.patientInitials}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate text-[15px] font-semibold text-neutral-900">
                                                {item.patientName}
                                            </p>
                                            <p className="truncate text-xs text-neutral-500">
                                                {item.specialty} · {item.insurance}
                                            </p>
                                            {isMaster && (
                                                <p className="truncate text-xs text-neutral-400">
                                                    Dr(a). {item.doctorName}
                                                </p>
                                            )}
                                            <p className="mt-0.5 text-[11px] font-medium text-neutral-400 lg:hidden">
                                                {item.dayLabel}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Data (desktop) */}
                                    <div className="hidden w-24 shrink-0 lg:block">
                                        <p className="text-xs font-semibold text-neutral-600">{item.dayLabel}</p>
                                        <p className="text-[11px] text-neutral-400">
                                            {item.isToday ? "Consulta do dia" : "Agendada"}
                                        </p>
                                    </div>

                                    {/* Status */}
                                    <div className="flex shrink-0 items-center gap-2">
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${meta.className}`}
                                        >
                                            <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                                            {meta.label}
                                        </span>
                                    </div>

                                    {/* Ações */}
                                    <div className="flex shrink-0 flex-wrap items-center gap-2 lg:w-[268px] lg:justify-end">
                                        {item.isActionable ? (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => void mark(item.id, "COMPLETED")}
                                                    disabled={isUpdating}
                                                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 px-3.5 py-2.5 text-xs font-semibold text-white shadow-[0_6px_16px_-8px_rgba(16,142,93,0.75)] transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {isUpdating ? <Spinner /> : <CheckIcon />}
                                                    Consulta realizada
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => void mark(item.id, "NO_SHOW")}
                                                    disabled={isUpdating}
                                                    className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-neutral-600 transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {isUpdating ? <Spinner /> : <AbsentIcon />}
                                                    Paciente faltou
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-[11px] font-medium text-neutral-400">
                                                {item.rawStatus === "COMPLETED"
                                                    ? "Atendimento finalizado"
                                                    : item.rawStatus === "NO_SHOW"
                                                        ? "Falta registrada"
                                                        : item.rawStatus === "CANCELED"
                                                            ? "Consulta cancelada"
                                                            : "Aguardando o dia do atendimento"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </article>
                        )
                    })
                )}
            </section>

            <p className="pb-2 text-center text-[11px] text-neutral-400">
                A lista é atualizada automaticamente a cada 15 segundos.
            </p>
        </div>
    )
}

/* ---------- SUBCOMPONENTES ---------- */

function HeroStat({ label, value, highlight = false }: { label: string; value: number; highlight?: boolean }) {
    return (
        <div
            className={`rounded-2xl px-4 py-3 ring-1 backdrop-blur-sm ${
                highlight ? "bg-white/18 ring-white/25" : "bg-white/10 ring-white/15"
            }`}
        >
            <p className="text-[11px] font-medium uppercase tracking-wide text-white/75">{label}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-white">{value}</p>
        </div>
    )
}

function Spinner() {
    return (
        <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    )
}

function CheckIcon() {
    return (
        <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 6 9 17l-5-5" />
        </svg>
    )
}

function AbsentIcon() {
    return (
        <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="17" y1="8" x2="23" y2="14" />
            <line x1="23" y1="8" x2="17" y2="14" />
        </svg>
    )
}

function SkeletonCard() {
    return (
        <div className="animate-pulse rounded-2xl border border-neutral-200/70 bg-white p-4 md:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <div className="h-8 w-20 rounded-lg bg-neutral-100" />
                <div className="flex flex-1 items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-neutral-100" />
                    <div className="flex-1 space-y-2">
                        <div className="h-3.5 w-40 rounded bg-neutral-100" />
                        <div className="h-3 w-56 rounded bg-neutral-100" />
                    </div>
                </div>
                <div className="h-6 w-24 rounded-full bg-neutral-100" />
                <div className="h-9 w-56 rounded-xl bg-neutral-100" />
            </div>
        </div>
    )
}

function EmptyState({ tab, isMaster }: { tab: TabKey; isMaster: boolean }) {
    const messages: Record<TabKey, { title: string; description: string }> = {
        today: {
            title: "Nenhuma consulta para hoje",
            description: isMaster
                ? "Assim que houver agendamentos para o dia, eles aparecerão aqui automaticamente."
                : "Sua agenda de hoje está livre. As consultas do dia aparecem aqui automaticamente.",
        },
        upcoming: {
            title: "Nenhuma consulta futura marcada",
            description: "Os próximos atendimentos agendados aparecerão nesta aba.",
        },
        past: {
            title: "Nenhum atendimento anterior",
            description: "Consultas de dias anteriores ficam registradas nesta aba.",
        },
    }

    const { title, description } = messages[tab]

    return (
        <div className="rounded-3xl border border-dashed border-neutral-200/90 bg-white/70 px-6 py-14 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
            </span>
            <h3 className="mt-4 text-base font-semibold text-neutral-800">{title}</h3>
            <p className="mx-auto mt-1.5 max-w-md text-sm text-neutral-500">{description}</p>
        </div>
    )
}
