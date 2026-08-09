"use client"

import Link from "next/link"
import { useState } from "react"

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
}

const appointments: Appointment[] = [
    {
        id: "1",
        patientName: "Marcus Thompson",
        procedure: "General Checkup",
        time: "09:00 AM - 09:45 AM",
        doctor: "Dr. Smith",
        status: "CONFIRMED",
        avatarColor: "from-emerald-400 to-green-600",
        initials: "MT",
    },
    {
        id: "2",
        patientName: "Elena Rodriguez",
        procedure: "Lab Results Review",
        time: "11:30 AM - 12:00 PM",
        doctor: "Dr. Miller",
        status: "PENDING",
        avatarColor: "from-rose-400 to-rose-600",
        initials: "ER",
    },
    {
        id: "3",
        patientName: "Arthur Pendragon",
        procedure: "Physiotherapy Follow-up",
        time: "02:15 PM - 03:00 PM",
        doctor: "Dr. Smith",
        status: "CONFIRMED",
        avatarColor: "from-slate-400 to-slate-600",
        initials: "AP",
    },
]

type DayCell = {
    day: number | null
    muted?: boolean
    badge?: string
    badgeType?: "ok" | "warning"
    dots?: Array<"brand" | "neutral">
    selected?: boolean
    isToday?: boolean
}

const weeks: DayCell[][] = [
    [
        { day: 25, muted: true }, { day: 26, muted: true }, { day: 27, muted: true }, { day: 28, muted: true }, { day: 29, muted: true }, { day: 30, muted: true }, { day: 1, dots: ["brand"] },
    ],
    [
        { day: 2 }, { day: 3, badge: "3 Appts", badgeType: "ok" }, { day: 4 }, { day: 5 }, { day: 6, dots: ["brand"] }, { day: 7 }, { day: 8 },
    ],
    [
        { day: 9 }, { day: 10 }, { day: 11, badge: "5 Appts", badgeType: "ok" }, { day: 12, selected: true, dots: ["brand", "neutral"] }, { day: 13 }, { day: 14 }, { day: 15 },
    ],
]

export default function AppointmentsPage() {
    const [selectedDay] = useState(12)
    const appointmentsToday = 5

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
                        placeholder="Search appointments, patients..."
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
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6 md:mb-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-serif font-semibold tracking-tight text-neutral-900">
                                October 2023
                            </h2>
                            <p className="text-sm text-neutral-500 mt-1">
                                Monthly Schedule View
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <NavButton direction="prev" />
                            <NavButton direction="next" />
                            <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-xl bg-neutral-100 text-neutral-700 px-4 py-2.5 text-sm font-semibold hover:bg-neutral-200/80 transition-colors"
                            >
                                Today
                            </button>
                        </div>
                    </div>

                    {/* Dias da semana */}
                    <div className="grid grid-cols-7 gap-2 md:gap-3 mb-2">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                            <div key={d} className="text-center text-[11px] md:text-xs font-semibold tracking-wider uppercase text-neutral-500 py-2">
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Células dos dias */}
                    <div className="space-y-2 md:space-y-3">
                        {weeks.map((week, wi) => (
                            <div key={wi} className="grid grid-cols-7 gap-2 md:gap-3">
                                {week.map((cell, di) => (
                                    <DayCell key={`${wi}-${di}-${cell.day}`} cell={cell} />
                                ))}
                            </div>
                        ))}
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
                                Selected Date
                            </p>
                            <h3 className="mt-2 text-2xl md:text-[28px] font-serif font-semibold tracking-tight">
                                Thursday, Oct {selectedDay}
                            </h3>

                            <div className="mt-5 flex items-center gap-3">
                                <div className="flex -space-x-3">
                                    <AvatarPill gradient="from-sky-400 to-blue-600" initials="MT" />
                                    <AvatarPill gradient="from-rose-400 to-pink-600" initials="ER" ring="ring-brand-700" />
                                    <span className="relative inline-flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-emerald-300/90 text-brand-900 text-[11px] font-bold ring-2 ring-brand-700 shadow">
                                        +3
                                    </span>
                                </div>
                                <p className="text-sm md:text-[15px] font-medium text-white/90">
                                    <span className="font-semibold text-white">{appointmentsToday}</span> Appointments Today
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Daily schedule */}
                    <section className="rounded-3xl border border-neutral-200/70 bg-white shadow-[0_4px_24px_-14px_rgba(15,23,42,0.12)] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between px-5 md:px-6 py-4 md:py-5 border-b border-neutral-100">
                            <h3 className="text-lg md:text-xl font-serif font-semibold text-neutral-900">
                                Daily Schedule
                            </h3>
                            <button type="button" aria-label="More opções" className="h-9 w-9 inline-flex items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 transition-colors">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <circle cx="12" cy="12" r="1.7" />
                                    <circle cx="5" cy="12" r="1.7" />
                                    <circle cx="19" cy="12" r="1.7" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 px-3 md:px-5 py-4 space-y-3 md:space-y-4 max-h-[480px] overflow-y-auto">
                            {appointments.map((a) => (
                                <AppointmentCard key={a.id} appointment={a} />
                            ))}

                            {/* Empty state */}
                            <div className="mt-6 md:mt-8 text-center py-8">
                                <div className="relative mx-auto h-12 w-12 inline-flex items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                        <line x1="12" y1="6" x2="12" y2="12" />
                                        <line x1="16" y1="12" x2="10" y2="16" />
                                    </svg>
                                </div>
                                <p className="mt-4 text-sm text-neutral-500 max-w-xs mx-auto leading-relaxed">
                                    No more appointments scheduled for this afternoon.
                                </p>
                            </div>
                        </div>

                        <div className="px-5 md:px-6 py-4 md:py-5 border-t border-neutral-100">
                            <Link
                                href="/dashboard/agendamento/todos"
                                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-brand-700/70 px-4 py-3 text-[14px] font-bold text-brand-700 hover:bg-brand-700 hover:text-white hover:shadow-[0_8px_18px_rgba(16,142,93,0.22)] transition-all"
                            >
                                View All Appointments
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

function NavButton({ direction }: { direction: "prev" | "next" }) {
    const isPrev = direction === "prev"
    return (
        <button
            type="button"
            aria-label={isPrev ? "Mês anterior" : "Próximo mês"}
            className="inline-flex h-11 w-11 md:h-10 md:w-10 items-center justify-center rounded-xl border border-neutral-200/80 bg-white text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-colors"
        >
            {isPrev ? (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="15 18 9 12 15 6" />
                </svg>
            ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            )}
        </button>
    )
}

function DayCell({ cell }: { cell: DayCell }) {
    const base =
        "group relative aspect-square min-h-[64px] md:min-h-[76px] rounded-2xl p-1.5 md:p-2 text-sm transition-all duration-200 select-none"
    let styles = ""
    if (cell.selected) {
        styles += " bg-gradient-to-br from-brand-50/60 via-brand-50/80 to-brand-50 ring-2 ring-brand-500 shadow-[0_8px_18px_-6px_rgba(16,142,93,0.25)]"
    } else if (cell.muted) {
        styles += " text-neutral-300 cursor-default"
    } else {
        styles += " hover:bg-neutral-50 text-neutral-700 cursor-pointer"
    }

    const badgeStyle =
        cell.badgeType === "warning"
            ? "bg-amber-100 text-amber-800 ring-1 ring-amber-700/20"
            : "bg-brand-50 text-brand-700 ring-1 ring-brand-600/20"

    return (
        <div className={`${base} ${styles}`}>
            {cell.day !== null && (
                <>
                    <div className="flex items-start justify-between">
                        <span className={`text-[13px] md:text-sm font-semibold ${cell.selected ? "text-brand-800" : ""}`}>
                            {cell.day}
                        </span>
                    </div>

                    <div className="mt-1 flex flex-col items-center gap-1 md:gap-1.5 justify-end min-h-[calc(100%-20px)]">
                        {cell.badge && (
                            <span className={`inline-flex px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-lg text-[9.5px] md:text-[10.5px] font-bold ${badgeStyle}`}>
                                {cell.badge}
                            </span>
                        )}
                        {cell.dots && (
                            <div className="flex items-center gap-1 mt-auto pb-0.5">
                                {cell.dots.map((type, i) => (
                                    <span
                                        key={i}
                                        className={`h-1.5 w-1.5 rounded-full ${type === "brand" ? "bg-brand-600" : "bg-neutral-400"
                                            }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

function AppointmentCard({ appointment }: { appointment: Appointment }) {
    const statusPill =
        appointment.status === "CONFIRMED"
            ? "bg-green-100 text-green-700 ring-1 ring-green-700/15"
            : "bg-amber-100 text-amber-700 ring-1 ring-amber-600/15"

    return (
        <article className="group rounded-2xl bg-neutral-50/60 hover:bg-neutral-100/80 transition-colors p-3 md:p-4">
            <div className="flex items-start gap-3 md:gap-4">
                <div className={`mt-0.5 relative h-11 w-11 shrink-0 rounded-2xl bg-gradient-to-br ${appointment.avatarColor} text-white text-xs font-bold ring-2 ring-white shadow-sm flex items-center justify-center overflow-hidden`}>
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
                        <span className={`shrink-0 inline-flex px-3 py-1 rounded-full text-[10.5px] md:text-[11px] font-extrabold tracking-wide uppercase ${statusPill}`}>
                            {appointment.status}
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

function AvatarPill({ gradient, initials, ring = "ring-brand-700" }: { gradient: string; initials: string; ring?: string }) {
    return (
        <span className={`relative inline-flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-white text-[11px] md:text-xs font-bold ring-2 ${ring} shadow-sm overflow-hidden`}>
            {initials}
        </span>
    )
}
