"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

type ActivityKind =
    | "patient_new"
    | "doctor_new"
    | "appointment_scheduled"
    | "appointment_confirmed"
    | "appointment_done"
    | "checkin"

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
    stats: unknown | null
    feed: Activity[]
}

const FALLBACK: Activity[] = [
    {
        id: "a1",
        kind: "checkin",
        createdAt: Date.now() - 1000 * 60 * 45 + "",
        title: "João Silva",
        description: "Check-in realizado para Clínica Geral",
        href: "/dashboard/pacientes/1/historico",
    },
    {
        id: "a2",
        kind: "appointment_done",
        createdAt: Date.now() - 1000 * 60 * 60 + "",
        title: "Maria Oliveira",
        description: "Consulta finalizada - Dr. Arnaldo",
        href: "/dashboard/agendamento",
    },
    {
        id: "a3",
        kind: "appointment_scheduled",
        createdAt: Date.now() - 1000 * 60 * 90 + "",
        title: "Agendamento Web",
        description: "Nova marcação: Exame de Sangue",
        href: "/dashboard/agendamento/novo",
    },
    {
        id: "a4",
        kind: "patient_new",
        createdAt: Date.now() - 1000 * 60 * 60 * 3 + "",
        title: "Carlos Eduardo cadastrado(a)",
        description: "Prontuário aberto por Admin",
        href: "/dashboard/pacientes/3/historico",
    },
    {
        id: "a5",
        kind: "doctor_new",
        createdAt: Date.now() - 1000 * 60 * 60 * 20 + "",
        title: "Dra. Fernanda Lima adicionada",
        description: "CRM: 98765 SP · Neurologista",
        href: "/dashboard/medicos",
    },
    {
        id: "a6",
        kind: "appointment_confirmed",
        createdAt: Date.now() - 1000 * 60 * 60 * 26 + "",
        title: "Beatriz Costa",
        description: "Cardiologia · Com Dra. Fernanda",
        href: "/dashboard/agendamento",
    },
]

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
    const stroke = { strokeWidth: kind === "appointment_done" ? 2.4 : 2 }
    if (kind === "checkin" || kind === "patient_new") {
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
    if (kind === "appointment_confirmed") {
        return (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={base}>
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <line x1="8" y1="3" x2="8" y2="7" />
                <line x1="16" y1="3" x2="16" y2="7" />
            </svg>
        )
    }
    // scheduled default
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={base}>
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    )
}

function wrapperFor(kind: ActivityKind) {
    switch (kind) {
        case "checkin":
            return "bg-gradient-to-br from-brand-500 to-brand-700"
        case "patient_new":
            return "bg-gradient-to-br from-emerald-500 to-emerald-700"
        case "doctor_new":
            return "bg-gradient-to-br from-sky-500 to-indigo-600"
        case "appointment_confirmed":
            return "bg-gradient-to-br from-brand-400 to-brand-600"
        case "appointment_done":
            return "bg-gradient-to-br from-neutral-400 to-neutral-600"
        case "appointment_scheduled":
        default:
            return "bg-gradient-to-br from-amber-400 to-orange-500"
    }
}

export default function RecentActivity() {
    const [loading, setLoading] = useState(true)
    const [feed, setFeed] = useState<Activity[]>(FALLBACK)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false
        async function load() {
            try {
                const res = await fetch("/api/activity-feed", { cache: "no-store" })
                if (!res.ok) throw new Error("fail")
                const data = (await res.json()) as FeedResponse
                if (cancelled) return
                if (data.feed && Array.isArray(data.feed) && data.feed.length > 0) {
                    setFeed(data.feed as Activity[])
                } else {
                    setFeed(FALLBACK)
                }
            } catch (e) {
                if (!cancelled) {
                    setFeed(FALLBACK)
                    setError(e instanceof Error ? e.message : String(e))
                }
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        load()
        return () => {
            cancelled = true
        }
    }, [])

    const visible = useMemo(() => feed.slice(0, 6), [feed])

    return (
        <section className="bg-white rounded-2xl border border-neutral-200/70 shadow-sm p-5 md:p-6">
            <header className="flex items-center justify-between mb-5 md:mb-6">
                <div className="flex items-center gap-2">
                    <h2 className="text-base md:text-lg font-semibold text-neutral-800">
                        Atividades Recentes
                    </h2>
                    {loading && (
                        <span className="inline-flex h-2 w-2 rounded-full bg-brand-500 animate-pulse shadow-[0_0_0_3px_rgba(16,185,129,0.2)]" aria-hidden="true" />
                    )}
                    {!loading && error && (
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

            <ul className="space-y-1 md:space-y-2">
                {loading && visible.length === 0
                    ? Array.from({ length: 4 }).map((_, i) => <ActivitySkeleton key={i} />)
                    : visible.map((activity, i) => {
                          const last = i === visible.length - 1
                          return (
                              <li
                                  key={activity.id}
                                  className="group rounded-xl border border-transparent hover:border-neutral-100 hover:bg-neutral-50 transition-colors"
                              >
                                  <Link
                                      href={activity.href}
                                      className="block w-full"
                                  >
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
                                      {!last && (
                                          <div className="mx-4 md:mx-5 border-t border-neutral-100" />
                                      )}
                                  </Link>
                              </li>
                          )
                      })}
            </ul>
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
