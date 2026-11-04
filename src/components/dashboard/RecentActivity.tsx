"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

type ActivityKind =
    | "patient_new"
    | "doctor_new"
    | "appointment_scheduled"
    | "appointment_confirmed"
    | "appointment_urgent"
    | "appointment_done"
    | "appointment_canceled"

type Activity = {
    id: string
    kind: ActivityKind
    createdAt: string
    title: string
    description: string
    href: string
    dateTime?: string
}

type FeedResponse = {
    ok: boolean
    feed: Activity[]
    error?: string
}

/** Intervalo de atualização automática do painel. */
const POLL_MS = 15000

function pad(n: number) {
    return n.toString().padStart(2, "0")
}

function toIsoDate(d: Date) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function formatRelativeOrTime(isoOrTs: string): string {
    const ts = Number(isoOrTs)
    const date = isNaN(ts) ? new Date(isoOrTs) : new Date(ts)
    if (isNaN(date.getTime())) return "—"
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMin = Math.round(diffMs / 60000)
    const diffHr = Math.round(diffMs / 3600000)
    const diffDay = Math.round(diffMs / 86400000)

    const todayIso = toIsoDate(now)
    const eventIso = toIsoDate(date)
    if (todayIso === eventIso) {
        if (diffMin < 1) return "Agora"
        if (diffMin < 60) return `${diffMin} min atrás`
        return `${diffHr}h atrás`
    }
    const yesterday = new Date(now.getTime() - 86400000)
    if (toIsoDate(yesterday) === eventIso) {
        return `Ontem às ${pad(date.getHours())}:${pad(date.getMinutes())}`
    }
    if (diffDay <= 6) {
        return `${diffDay}d atrás`
    }
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).replace(".", "")
}

function iconFor(kind: ActivityKind) {
    const base = "text-white"
    const stroke = { strokeWidth: kind === "appointment_done" || kind === "appointment_canceled" ? 2.4 : 2 }
    if (kind === "patient_new") {
        return (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={base}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        )
    }
    if (kind === "doctor_new") {
        return (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={base}>
                <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5z" />
                <path d="M9 14h6M12 11v6" />
            </svg>
        )
    }
    if (kind === "appointment_done") {
        return (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={base}>
                <polyline points="20 6 9 17 4 12" />
            </svg>
        )
    }
    if (kind === "appointment_canceled") {
        return (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={base}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
        )
    }
    if (kind === "appointment_urgent") {
        return (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={base}>
                <path d="M12 3v12" />
                <circle cx="12" cy="19" r="1.4" fill="currentColor" stroke="none" />
            </svg>
        )
    }
    if (kind === "appointment_confirmed") {
        return (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={base}>
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <line x1="8" y1="3" x2="8" y2="7" />
                <line x1="16" y1="3" x2="16" y2="7" />
                <polyline points="9 15 11 17 15 13" />
            </svg>
        )
    }
    // appointment_scheduled (default)
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={base}>
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    )
}

function wrapperFor(kind: ActivityKind) {
    switch (kind) {
        case "patient_new":
            return "bg-gradient-to-br from-emerald-500 to-emerald-700"
        case "doctor_new":
            return "bg-gradient-to-br from-sky-500 to-indigo-600"
        case "appointment_confirmed":
            return "bg-gradient-to-br from-brand-400 to-brand-600"
        case "appointment_urgent":
            return "bg-gradient-to-br from-rose-500 to-red-600"
        case "appointment_done":
            return "bg-gradient-to-br from-neutral-400 to-neutral-600"
        case "appointment_canceled":
            return "bg-gradient-to-br from-red-500 to-red-700"
        case "appointment_scheduled":
        default:
            return "bg-gradient-to-br from-amber-400 to-orange-500"
    }
}

export default function RecentActivity() {
    const [feed, setFeed] = useState<Activity[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [lastSync, setLastSync] = useState<Date | null>(null)

    // Evita sobreposição de requisições quando o polling e o foco disparam juntos.
    const inFlight = useRef(false)

    const load = useCallback(async (first: boolean) => {
        if (inFlight.current) return
        inFlight.current = true
        if (!first) setRefreshing(true)
        try {
            const res = await fetch("/api/activity-feed", { cache: "no-store" })
            const data = (await res.json().catch(() => null)) as FeedResponse | null
            if (!res.ok || !data?.ok) throw new Error(data?.error || "Falha ao carregar atividades")
            setFeed(Array.isArray(data.feed) ? data.feed : [])
            setLastSync(new Date())
            setError(null)
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e))
        } finally {
            inFlight.current = false
            setLoading(false)
            setRefreshing(false)
        }
    }, [])

    useEffect(() => {
        load(true)

        const timer = setInterval(() => {
            // Não busca nada com a aba em segundo plano.
            if (document.visibilityState === "visible") load(false)
        }, POLL_MS)

        const onVisible = () => {
            if (document.visibilityState === "visible") load(false)
        }
        document.addEventListener("visibilitychange", onVisible)
        window.addEventListener("focus", onVisible)

        return () => {
            clearInterval(timer)
            document.removeEventListener("visibilitychange", onVisible)
            window.removeEventListener("focus", onVisible)
        }
    }, [load])

    const visible = useMemo(() => feed.slice(0, 6), [feed])
    const isEmpty = !loading && visible.length === 0

    return (
        <section className="bg-white rounded-2xl border border-neutral-200/70 shadow-sm p-5 md:p-6">
            <header className="flex items-center justify-between mb-5 md:mb-6">
                <div className="flex items-center gap-2">
                    <h2 className="text-base md:text-lg font-semibold text-neutral-800">
                        Atividades Recentes
                    </h2>
                    {refreshing && (
                        <span
                            className="inline-flex h-2 w-2 rounded-full bg-brand-500 animate-pulse shadow-[0_0_0_3px_rgba(16,185,129,0.2)]"
                            aria-label="Atualizando"
                        />
                    )}
                    {!refreshing && error && (
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase text-amber-700 bg-amber-50 ring-1 ring-amber-700/10">
                            offline
                        </span>
                    )}
                </div>
                <Link
                    href="/dashboard/agendamento"
                    className="text-sm font-semibold text-brand-700 hover:text-brand-800 hover:underline"
                >
                    Ver tudo
                </Link>
            </header>

            {loading ? (
                <ul className="space-y-1 md:space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <ActivitySkeleton key={i} />
                    ))}
                </ul>
            ) : isEmpty ? (
                <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 7v5l3 2" />
                        </svg>
                    </span>
                    <p className="text-sm font-semibold text-neutral-700">Nenhuma atividade registrada ainda</p>
                    <p className="max-w-xs text-xs text-neutral-500">
                        Agendamentos, pacientes e médicos aparecerão aqui automaticamente conforme o uso do sistema.
                    </p>
                    {error && <p className="max-w-xs text-xs text-amber-700">Não foi possível atualizar: {error}</p>}
                </div>
            ) : (
                <ul className="space-y-1 md:space-y-2">
                    {visible.map((activity, i) => {
                        const last = i === visible.length - 1
                        return (
                            <li
                                key={activity.id}
                                className="group rounded-xl border border-transparent hover:border-neutral-100 hover:bg-neutral-50 transition-colors"
                            >
                                <Link href={activity.href} className="block w-full">
                                    <div className="flex items-center gap-4 py-3 md:py-4 px-3 md:px-4">
                                        <span
                                            className={`h-10 w-10 md:h-11 md:w-11 shrink-0 rounded-full inline-flex items-center justify-center shadow-sm ${wrapperFor(
                                                activity.kind
                                            )}`}
                                        >
                                            {iconFor(activity.kind)}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm md:text-[15px] font-semibold text-neutral-900 truncate">
                                                {activity.title}
                                            </p>
                                            <p className="text-xs md:text-sm text-neutral-600 truncate">
                                                {activity.description}
                                            </p>
                                        </div>
                                        <span className="shrink-0 text-xs md:text-sm font-medium text-neutral-400 tabular-nums">
                                            {formatRelativeOrTime(activity.createdAt)}
                                        </span>
                                    </div>
                                    {!last && <div className="mx-4 md:mx-5 border-t border-neutral-100" />}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            )}

            {!loading && lastSync && (
                <p className="mt-4 text-[11px] text-neutral-400">
                    Atualizado às {pad(lastSync.getHours())}:{pad(lastSync.getMinutes())}
                </p>
            )}
        </section>
    )
}

function ActivitySkeleton() {
    return (
        <li className="rounded-xl animate-pulse">
            <div className="flex items-center gap-4 py-3 md:py-4 px-3 md:px-4">
                <div className="h-10 w-10 md:h-11 md:w-11 shrink-0 rounded-full bg-neutral-100" />
                <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-4 w-40 rounded-lg bg-neutral-100" />
                    <div className="h-3 w-56 rounded-lg bg-neutral-100" />
                </div>
                <div className="h-3.5 w-20 rounded-lg bg-neutral-100 shrink-0" />
            </div>
            <div className="mx-4 md:mx-5 border-t border-neutral-100" />
        </li>
    )
}
