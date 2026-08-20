"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

type DoctorStatus = "DISPONÍVEL" | "EM CONSULTA" | "INDISPONÍVEL"

type Doctor = {
    id: string
    name: string
    title: string
    specialty: string
    workingDays: string
    rating: string
    reviewsCount: number
    status: DoctorStatus
    avatarGradient: string
    initials: string
    accent: string
}

type ApiDoctor = {
    id: string
    name: string | null
    email: string | null
    phone: string | null
    doctorProfile: {
        id: string
        crm: string
        crmUf: string
        specialties: string[]
        bio: string | null
        workDays: string[]
        startMorning: string | null
        endMorning: string | null
        startAfternoon: string | null
        endAfternoon: string | null
    } | null
}

const FALLBACK_DOCTORS: Doctor[] = [
    {
        id: "1",
        name: "Dr. Arnaldo Souza",
        title: "Médico",
        specialty: "Clínica Geral",
        workingDays: "Seg, Qua, Sex",
        rating: "4.9",
        reviewsCount: 120,
        status: "DISPONÍVEL",
        avatarGradient: "from-sky-400 to-blue-600",
        initials: "AS",
        accent: "bg-sky-500",
    },
    {
        id: "2",
        name: "Dra. Beatriz Costa",
        title: "Médica",
        specialty: "Cardiologia",
        workingDays: "Ter, Qui, Sáb",
        rating: "5.0",
        reviewsCount: 84,
        status: "EM CONSULTA",
        avatarGradient: "from-fuchsia-400 to-rose-500",
        initials: "BC",
        accent: "bg-rose-500",
    },
    {
        id: "3",
        name: "Dr. Ricardo Mendes",
        title: "Médico",
        specialty: "Pediatria",
        workingDays: "Diário",
        rating: "4.8",
        reviewsCount: 215,
        status: "DISPONÍVEL",
        avatarGradient: "from-amber-300 to-orange-500",
        initials: "RM",
        accent: "bg-amber-500",
    },
    {
        id: "4",
        name: "Dra. Julia Ramos",
        title: "Médica",
        specialty: "Dermatologia",
        workingDays: "Seg, Ter, Qui",
        rating: "4.9",
        reviewsCount: 56,
        status: "DISPONÍVEL",
        avatarGradient: "from-violet-400 to-purple-600",
        initials: "JR",
        accent: "bg-violet-500",
    },
    {
        id: "5",
        name: "Dr. Marcos Vinícius",
        title: "Médico",
        specialty: "Neurologia",
        workingDays: "Quarta-feira",
        rating: "5.0",
        reviewsCount: 142,
        status: "INDISPONÍVEL",
        avatarGradient: "from-slate-400 to-slate-700",
        initials: "MV",
        accent: "bg-slate-500",
    },
    {
        id: "6",
        name: "Dra. Helena Souza",
        title: "Médica",
        specialty: "Ginecologia",
        workingDays: "Seg a Sex",
        rating: "4.7",
        reviewsCount: 198,
        status: "DISPONÍVEL",
        avatarGradient: "from-teal-400 to-emerald-600",
        initials: "HS",
        accent: "bg-emerald-500",
    },
]

const GRADIENTS = [
    "from-sky-400 to-blue-600",
    "from-fuchsia-400 to-rose-500",
    "from-amber-300 to-orange-500",
    "from-violet-400 to-purple-600",
    "from-slate-400 to-slate-700",
    "from-teal-400 to-emerald-600",
    "from-indigo-400 to-indigo-600",
    "from-cyan-400 to-sky-600",
]

const ACCENTS = [
    "bg-sky-500",
    "bg-rose-500",
    "bg-amber-500",
    "bg-violet-500",
    "bg-slate-500",
    "bg-emerald-500",
    "bg-indigo-500",
    "bg-cyan-500",
]

const DAY_LABELS: Record<string, string> = {
    seg: "Seg",
    ter: "Ter",
    qua: "Qua",
    qui: "Qui",
    sex: "Sex",
    sáb: "Sáb",
    dom: "Dom",
}

function hash(str: string): number {
    let h = 0
    for (let i = 0; i < str.length; i++) {
        h = (h << 5) - h + str.charCodeAt(i)
        h |= 0
    }
    return Math.abs(h)
}

function mapApiToDoctor(ad: ApiDoctor, idx: number): Doctor {
    const name = ad.name?.trim() || "Médico(a)"
    const initials = name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase() ?? "")
        .join("") || "?"

    const paletteIdx = hash(ad.id) % GRADIENTS.length

    const workingDaysArr = ad.doctorProfile?.workDays ?? []
    const workingDays =
        workingDaysArr.length === 0
            ? "Agenda a definir"
            : workingDaysArr
                  .map((k) => DAY_LABELS[k] ?? k)
                  .filter(Boolean)
                  .join(", ")

    const specialty = (ad.doctorProfile?.specialties ?? []).slice(0, 2).join(" / ") || "Especialidade"

    return {
        id: ad.id,
        name,
        title: /(dra|sra|senhora)/i.test(name) ? "Médica" : "Médico",
        specialty,
        workingDays,
        rating: "—",
        reviewsCount: 0,
        status: "DISPONÍVEL",
        avatarGradient: GRADIENTS[paletteIdx],
        initials,
        accent: ACCENTS[paletteIdx],
    }
}

function statusStyle(s: DoctorStatus) {
    switch (s) {
        case "DISPONÍVEL":
            return "bg-brand-600 text-white shadow-[0_4px_12px_rgba(16,142,93,0.35)]"
        case "EM CONSULTA":
            return "bg-neutral-800/90 text-white shadow-[0_4px_12px_rgba(15,23,42,0.4)]"
        case "INDISPONÍVEL":
            return "bg-red-600 text-white shadow-[0_4px_12px_rgba(220,38,38,0.35)]"
    }
}

export default function DoctorsPage() {
    const [search, setSearch] = useState("")
    const [doctors, setDoctors] = useState<Doctor[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false
        async function load() {
            try {
                const res = await fetch("/api/doctors")
                if (!res.ok) throw new Error("Failed to load")
                const data = await res.json()
                if (cancelled) return
                const list: ApiDoctor[] = data.doctors ?? []
                if (list.length === 0) {
                    setDoctors(FALLBACK_DOCTORS)
                    return
                }
                const mapped = list.map((ad, i) => mapApiToDoctor(ad, i))
                setDoctors(mapped)
            } catch (e) {
                console.error(e)
                if (!cancelled) setDoctors(FALLBACK_DOCTORS)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        load()
        return () => {
            cancelled = true
        }
    }, [])

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase()
        if (!q) return doctors
        return doctors.filter((d) =>
            [d.name, d.specialty, d.workingDays, d.initials].some((x) =>
                x.toLowerCase().includes(q)
            )
        )
    }, [doctors, search])

    return (
        <div className="space-y-6 md:space-y-8 relative">
            {/* Search bar */}
            <div className="mx-auto max-w-3xl w-full">
                <div className="relative">
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
                        placeholder="Buscar médicos, especialidades..."
                        className="w-full rounded-full border border-neutral-200/80 bg-white/90 py-3.5 pl-12 pr-4 text-sm text-neutral-800 placeholder:text-neutral-400 shadow-[0_2px_10px_rgba(15,23,42,0.06)] focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400/60 transition"
                    />
                </div>
            </div>

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/dashboard" className="hover:text-neutral-800 transition-colors">
                    Médicos
                </Link>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-300" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
                <span className="font-semibold text-brand-700">Corpo Clínico</span>
            </nav>

            {/* Header + CTA */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight text-brand-700">
                        Corpo Clínico
                    </h1>
                    <p className="text-[15px] text-neutral-600 max-w-xl">
                        Gerencie a equipe de especialistas da Vitalis Health.
                    </p>
                </div>

                <Link
                    href="/dashboard/medicos/novo"
                    className="inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_24px_rgba(16,142,93,0.28)] hover:shadow-[0_14px_32px_rgba(16,142,93,0.36)] hover:brightness-[1.03] active:brightness-100 transition-all duration-200"
                >
                    <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    </span>
                    Novo Médico
                </Link>
            </div>

            {/* Doctors grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                {loading && doctors.length === 0
                    ? Array.from({ length: 4 }).map((_, i) => <DoctorCardSkeleton key={i} />)
                    : filtered.map((d) => <DoctorCard key={d.id} doctor={d} />)}

                {/* Add new card */}
                <Link
                    href="/dashboard/medicos/novo"
                    className="group relative min-h-[420px] rounded-3xl border-2 border-dashed border-neutral-300/90 bg-white/40 p-6 flex flex-col items-center justify-center text-center hover:border-brand-400/70 hover:bg-brand-50/40 transition-all duration-200"
                >
                    <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 group-hover:bg-brand-100 group-hover:text-brand-700 transition-colors">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <line x1="19" y1="8" x2="19" y2="14" />
                            <line x1="22" y1="11" x2="16" y2="11" />
                        </svg>
                    </span>
                    <p className="mt-5 text-[15px] font-semibold text-neutral-600 group-hover:text-brand-800 leading-snug max-w-[200px] transition-colors">
                        Registrar novo profissional
                        <br /> no sistema
                    </p>
                </Link>
            </section>

            {/* FABs */}
            <div className="fixed z-30 bottom-6 right-6 md:bottom-10 md:right-10 flex flex-col gap-3">
                <button
                    type="button"
                    aria-label="Abrir chat"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800 text-white shadow-[0_10px_26px_rgba(15,23,42,0.35)] ring-4 ring-white/70 hover:bg-neutral-900 hover:scale-105 transition-all"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                </button>
                <Link
                    href="/dashboard/medicos/novo"
                    aria-label="Adicionar médico"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 text-white shadow-[0_10px_26px_rgba(16,142,93,0.5)] ring-4 ring-white/70 hover:scale-105 transition-all"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                </Link>
            </div>
        </div>
    )
}

function DoctorCard({ doctor }: { doctor: Doctor }) {
    return (
        <article className="group relative rounded-3xl border border-neutral-200/80 bg-white p-5 md:p-6 shadow-[0_4px_20px_-14px_rgba(15,23,42,0.15)] hover:shadow-[0_18px_40px_-18px_rgba(16,142,93,0.25)] hover:-translate-y-0.5 transition-all duration-200">
            {/* Avatar */}
            <div className="relative mx-auto">
                <div className={`relative h-24 w-24 mx-auto rounded-2xl bg-gradient-to-br ${doctor.avatarGradient} text-white text-lg font-bold shadow-[0_10px_22px_-6px_rgba(15,23,42,0.25)] ring-2 ring-white overflow-hidden flex flex-col items-center justify-center`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="absolute top-2.5 left-1/2 -translate-x-1/2 opacity-80">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        <path d="M12 21v-4" />
                    </svg>
                    <span aria-hidden="true" className="relative mt-6 text-sm font-extrabold tracking-wide drop-shadow-[0_1px_0_rgba(0,0,0,0.2)]">
                        {doctor.initials}
                    </span>
                </div>

                {/* Status pill */}
                <span className={`absolute left-1/2 -translate-x-1/2 -bottom-3 inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold tracking-[0.14em] uppercase ring-2 ring-white ${statusStyle(doctor.status)}`}>
                    {doctor.status}
                </span>
            </div>

            {/* Info */}
            <div className="mt-8 text-center space-y-1.5">
                <h3 className="text-xl md:text-[22px] font-serif font-semibold tracking-tight text-neutral-900">
                    {doctor.name}
                </h3>
                <div className="flex items-center justify-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-[12px] font-semibold ring-1 ring-brand-600/10">
                        {doctor.specialty}
                    </span>
                </div>
            </div>

            {/* Meta */}
            <div className="mt-5 space-y-2.5 text-sm text-neutral-600">
                <div className="flex items-center gap-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                    </span>
                    <span className="font-medium">{doctor.workingDays}</span>
                </div>
                {doctor.rating !== "—" && (
                    <div className="flex items-center gap-2">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                        </span>
                        <span className="font-semibold text-neutral-800">{doctor.rating}</span>
                        <span className="text-neutral-500 text-[13px]">
                            ({doctor.reviewsCount} avaliações)
                        </span>
                    </div>
                )}
            </div>

            {/* Action */}
            <Link
                href={`/dashboard/medicos/${doctor.id}`}
                className="mt-6 group/btn inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-brand-700 bg-white px-4 py-3 text-[14px] font-bold text-brand-700 hover:bg-brand-700 hover:text-white hover:shadow-[0_8px_18px_rgba(16,142,93,0.22)] transition-all duration-200"
            >
                Ver Perfil
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform group-hover/btn:translate-x-1">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                </svg>
            </Link>
        </article>
    )
}

function DoctorCardSkeleton() {
    return (
        <article className="rounded-3xl border border-neutral-200/60 bg-white p-5 md:p-6 shadow-[0_4px_20px_-14px_rgba(15,23,42,0.1)] min-h-[420px]">
            <div className="mx-auto h-24 w-24 rounded-2xl bg-neutral-100 animate-pulse" />
            <div className="mx-auto -mt-3 h-6 w-24 rounded-full bg-white ring-2 ring-white" />
            <div className="mt-8 space-y-2 text-center">
                <div className="mx-auto h-6 w-3/4 rounded-xl bg-neutral-100 animate-pulse" />
                <div className="mx-auto mt-2 h-6 w-1/2 rounded-full bg-brand-50 animate-pulse" />
            </div>
            <div className="mt-6 space-y-3">
                <div className="h-4 w-full rounded-xl bg-neutral-100 animate-pulse" />
                <div className="h-4 w-2/3 rounded-xl bg-neutral-100 animate-pulse" />
            </div>
            <div className="mt-6 h-11 w-full rounded-2xl border-2 border-brand-700/30 bg-white animate-pulse" />
        </article>
    )
}
