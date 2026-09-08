"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

type DoctorDetail = {
    id: string
    fullName: string
    specialty: string
    specialties: string[]
    status: string
    crm: string
    rating: string
    reviews: number
    experience: number
    email: string
    phone: string
    avatarGradient: string
    initials: string
    workDays: string[]
    startMorning: string | null
    endMorning: string | null
    startAfternoon: string | null
    endAfternoon: string | null
    bio: string | null
}

type ApiDoctor = {
    id: string
    name: string | null
    email: string | null
    phone: string | null
    birthDate: string | null
    gender: string | null
    cpf: string | null
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
        notes: string | null
        createdAt: string | null
    } | null
}

type ApiAppointment = {
    id: string
    dateTime: string
    status: string | null
    observation: string | null
    specialties: string[]
    patient: { id: string; fullName: string | null } | null
    doctor: { id: string; name: string | null } | null
}

type UpcomingRow = {
    id: string
    dateLabel: string
    timeLabel: string
    patient: string
    patientId: string | null
    type: string
    status: string
    isPast: boolean
}

type ActivityItem = {
    id: string
    label: string
    time: string
    tone: "brand" | "emerald" | "amber" | "neutral"
}

const DAY_INITIALS: Record<string, string> = {
    seg: "S",
    ter: "T",
    qua: "W",
    qui: "T",
    sex: "F",
    sáb: "S",
    dom: "D",
}

const GRADIENTS = [
    "from-sky-400 to-blue-600",
    "from-fuchsia-400 to-rose-500",
    "from-amber-300 to-orange-500",
    "from-violet-400 to-purple-600",
    "from-slate-400 to-slate-700",
    "from-teal-400 to-emerald-600",
]

const WEEKDAY_LABELS = [
    { key: "dom", label: "Dom" },
    { key: "seg", label: "Seg" },
    { key: "ter", label: "Ter" },
    { key: "qua", label: "Qua" },
    { key: "qui", label: "Qui" },
    { key: "sex", label: "Sex" },
    { key: "sáb", label: "Sáb" },
]

const MONTH_NAMES = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez",
]

const FALLBACK_DB: Record<string, DoctorDetail> = {
    "1": {
        id: "1",
        fullName: "Dr. Arnaldo Souza",
        specialty: "Clínica Geral / Medicina Interna",
        specialties: ["Clínica Geral", "Medicina Interna", "Geriatria"],
        status: "DISPONÍVEL",
        crm: "123456/SP",
        rating: "4.9",
        reviews: 124,
        experience: 12,
        email: "arnaldo.souza@vitalis.com",
        phone: "+55 (11) 98765-4321",
        avatarGradient: "from-sky-400 to-blue-600",
        initials: "AS",
        workDays: ["seg", "ter", "qua", "qui", "sex"],
        startMorning: "08:00",
        endMorning: "12:00",
        startAfternoon: "13:30",
        endAfternoon: "18:00",
        bio: "Dr. Arnaldo Souza é graduado pela Faculdade de Medicina da USP, com mais de 12 anos de experiência dedicados ao atendimento humanizado e preventivo. Especialista em Clínica Geral e Medicina Interna, foca sua prática no equilíbrio integral da saúde do paciente, combinando tecnologia diagnóstica avançada com uma abordagem empática.\n\nAcredita que o papel do médico vai além do tratamento de doenças, atuando como um parceiro na jornada de bem-estar e longevidade de cada indivíduo atendido no Vitalis Health.",
    },
    "2": {
        id: "2",
        fullName: "Dra. Beatriz Costa",
        specialty: "Cardiologia",
        specialties: ["Cardiologia", "Cardiologia Pediátrica", "Ecocardiografia"],
        status: "DISPONÍVEL",
        crm: "654321/RJ",
        rating: "5.0",
        reviews: 84,
        experience: 8,
        email: "beatriz.costa@vitalis.com",
        phone: "+55 (21) 99988-0000",
        avatarGradient: "from-fuchsia-400 to-rose-500",
        initials: "BC",
        workDays: ["ter", "qui", "sáb"],
        startMorning: "07:30",
        endMorning: "12:30",
        startAfternoon: null,
        endAfternoon: null,
        bio: "Cardiologista experiente com foco em prevenção de doenças cardiovasculares e reabilitação cardíaca.",
    },
    "3": {
        id: "3",
        fullName: "Dr. Ricardo Mendes",
        specialty: "Pediatria",
        specialties: ["Pediatria", "Alergia e Imunologia Pediátrica"],
        status: "DISPONÍVEL",
        crm: "112233/MG",
        rating: "4.8",
        reviews: 215,
        experience: 15,
        email: "ricardo.mendes@vitalis.com",
        phone: "+55 (31) 98123-4567",
        avatarGradient: "from-amber-300 to-orange-500",
        initials: "RM",
        workDays: ["seg", "ter", "qua", "qui", "sex"],
        startMorning: "09:00",
        endMorning: "12:00",
        startAfternoon: "14:00",
        endAfternoon: "19:00",
        bio: "Pediatra dedicado a cuidar do desenvolvimento saudável de crianças e adolescentes, com atendimento humanizado.",
    },
    "4": {
        id: "4",
        fullName: "Dra. Julia Ramos",
        specialty: "Dermatologia",
        specialties: ["Dermatologia Clínica", "Dermatologia Estética"],
        status: "DISPONÍVEL",
        crm: "998877/RS",
        rating: "4.9",
        reviews: 56,
        experience: 6,
        email: "julia.ramos@vitalis.com",
        phone: "+55 (51) 98765-1234",
        avatarGradient: "from-violet-400 to-purple-600",
        initials: "JR",
        workDays: ["seg", "ter", "qui"],
        startMorning: null,
        endMorning: null,
        startAfternoon: "13:00",
        endAfternoon: "18:30",
        bio: "Dermatologista especializada em saúde da pele, tratamentos rejuvenescedores e terapia capilar.",
    },
    "5": {
        id: "5",
        fullName: "Dr. Marcos Vinícius",
        specialty: "Neurologia",
        specialties: ["Neurologia", "Neurologia do Sono"],
        status: "INDISPONÍVEL",
        crm: "556677/PR",
        rating: "5.0",
        reviews: 142,
        experience: 20,
        email: "marcos.vinicius@vitalis.com",
        phone: "+55 (41) 91234-5678",
        avatarGradient: "from-slate-400 to-slate-700",
        initials: "MV",
        workDays: ["qua"],
        startMorning: "08:00",
        endMorning: "12:00",
        startAfternoon: "14:00",
        endAfternoon: "18:00",
        bio: "Neurologista referência em distúrbios do sono, com larga experiência em Medicina do Sono e polissonografia.",
    },
    "6": {
        id: "6",
        fullName: "Dra. Helena Souza",
        specialty: "Ginecologia",
        specialties: ["Ginecologia", "Obstetrícia", "Reprodução Humana"],
        status: "DISPONÍVEL",
        crm: "778899/BA",
        rating: "4.7",
        reviews: 198,
        experience: 10,
        email: "helena.souza@vitalis.com",
        phone: "+55 (71) 98877-6655",
        avatarGradient: "from-teal-400 to-emerald-600",
        initials: "HS",
        workDays: ["seg", "ter", "qua", "qui", "sex"],
        startMorning: "08:30",
        endMorning: "12:30",
        startAfternoon: "14:30",
        endAfternoon: "18:30",
        bio: "Ginecologista e obstetra com foco em saúde da mulher e medicina fetal de alta complexidade.",
    },
}

const FALLBACK_UPCOMING_BY_DOCTOR: Record<string, UpcomingRow[]> = {
    "1": [
        { id: "u1", dateLabel: "08 Set, Seg", timeLabel: "08:00", patient: "João Antunes", patientId: "1", type: "Consulta · Medicina Interna", status: "CONFIRMADO", isPast: false },
        { id: "u2", dateLabel: "08 Set, Seg", timeLabel: "09:30", patient: "Helena Mendes", patientId: "2", type: "Check-up anual", status: "AGENDADO", isPast: false },
        { id: "u3", dateLabel: "09 Set, Ter", timeLabel: "14:00", patient: "Ana Beatriz", patientId: "3", type: "Retorno · Geriatria", status: "CONFIRMADO", isPast: false },
    ],
    "2": [
        { id: "u4", dateLabel: "09 Set, Ter", timeLabel: "08:30", patient: "Carlos Eduardo", patientId: "4", type: "Ecocardiograma", status: "CONFIRMADO", isPast: false },
    ],
    "3": [],
    "4": [],
    "5": [],
    "6": [
        { id: "u5", dateLabel: "08 Set, Seg", timeLabel: "15:00", patient: "Mariana Lopes", patientId: "5", type: "Consulta de Pré-Natal", status: "CONFIRMADO", isPast: false },
    ],
}

function hash(str: string): number {
    let h = 0
    for (let i = 0; i < str.length; i++) {
        h = (h << 5) - h + str.charCodeAt(i)
        h |= 0
    }
    return Math.abs(h)
}

function calcExperience(birthDate: string | null, createdAtProfile: string | null): number {
    const b = birthDate ? new Date(birthDate) : null
    const bOk = b && !isNaN(b.getTime())
    if (!bOk) {
        const c = createdAtProfile ? new Date(createdAtProfile) : null
        if (c && !isNaN(c.getTime())) {
            const years = (Date.now() - c.getTime()) / (365.25 * 86400 * 1000)
            return Math.max(0, Math.round(years))
        }
        return 0
    }
    const now = new Date()
    let years = now.getFullYear() - (b as Date).getFullYear()
    const m = now.getMonth() - (b as Date).getMonth()
    if (m < 0 || (m === 0 && now.getDate() < (b as Date).getDate())) years--
    return Math.max(0, Math.round(Math.max(0, years - 26)))
}

function pad2(n: number): string {
    return n < 10 ? `0${n}` : `${n}`
}

function formatShortDatePt(date: Date): string {
    const wd = date.getDay()
    const weekday = WEEKDAY_LABELS[wd].label
    return `${pad2(date.getDate())} ${MONTH_NAMES[date.getMonth()]}, ${weekday}`
}

function formatTimePt(date: Date): string {
    return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`
}

function isSameDay(d1: Date, d2: Date): boolean {
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    )
}

function normalizeAppointmentStatus(raw: string | null | undefined): string {
    const r = (raw || "SCHEDULED").toUpperCase().replace(/[\s_]+/g, "_")
    switch (r) {
        case "COMPLETED":
        case "DONE":
        case "FINISHED":
        case "CONCLUÍDO":
        case "CONCLUIDO":
            return "CONCLUÍDO"
        case "CANCELLED":
        case "CANCELED":
        case "CANCELADO":
            return "CANCELADO"
        case "IN_PROGRESS":
        case "INPROGRESS":
        case "EM_ANDAMENTO":
        case "EM ANDAMENTO":
            return "EM ANDAMENTO"
        case "CONFIRMED":
        case "CONFIRMADO":
            return "CONFIRMADO"
        case "PENDING":
        case "PENDENTE":
            return "PENDENTE"
        case "SCHEDULED":
        case "AGENDADO":
        default:
            return "AGENDADO"
    }
}

function mapApiToDetail(ad: ApiDoctor): DoctorDetail {
    const fullName = ad.name?.trim() || "Médico(a)"
    const initials =
        fullName
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((n) => n[0]?.toUpperCase() ?? "")
            .join("") || "?"

    const paletteIdx = hash(ad.id) % GRADIENTS.length

    const specialties = ad.doctorProfile?.specialties ?? []
    const specialty = specialties.slice(0, 2).join(" / ") || "Especialidade"

    const crm = ad.doctorProfile
        ? `${ad.doctorProfile.crm}/${ad.doctorProfile.crmUf}`
        : "—"

    return {
        id: ad.id,
        fullName,
        specialty,
        specialties: specialties.length ? specialties : ["Especialidade"],
        status: "DISPONÍVEL",
        crm,
        rating: "—",
        reviews: 0,
        experience: calcExperience(ad.birthDate, ad.doctorProfile?.createdAt ?? null),
        email: ad.email || "Não informado",
        phone: ad.phone || "Não informado",
        avatarGradient: GRADIENTS[paletteIdx],
        initials,
        workDays: ad.doctorProfile?.workDays ?? [],
        startMorning: ad.doctorProfile?.startMorning ?? null,
        endMorning: ad.doctorProfile?.endMorning ?? null,
        startAfternoon: ad.doctorProfile?.startAfternoon ?? null,
        endAfternoon: ad.doctorProfile?.endAfternoon ?? null,
        bio: ad.doctorProfile?.bio ?? null,
    }
}

function statusPill(s: string) {
    const key = s.toUpperCase().replace(/\s+/g, "")
    switch (key) {
        case "CONCLUÍDO":
        case "CONCLUIDO":
            return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/15"
        case "CONFIRMADO":
            return "bg-brand-50 text-brand-700 ring-1 ring-brand-600/15"
        case "AGENDADO":
            return "bg-sky-50 text-sky-700 ring-1 ring-sky-600/15"
        case "PENDENTE":
            return "bg-amber-50 text-amber-700 ring-1 ring-amber-600/15"
        case "EMANDAMENTO":
            return "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/15"
        case "CANCELADO":
            return "bg-neutral-100 text-neutral-600 ring-1 ring-neutral-600/15"
        default:
            return "bg-neutral-50 text-neutral-700 ring-1 ring-neutral-600/10"
    }
}

function activityToneByStatus(status: string): "brand" | "emerald" | "amber" | "neutral" {
    const k = status.toUpperCase().replace(/\s+/g, "")
    if (k === "CONCLUÍDO" || k === "CONCLUIDO" || k === "CONFIRMADO") return "emerald"
    if (k === "CANCELADO") return "neutral"
    if (k === "PENDENTE" || k === "AGENDADO") return "amber"
    return "brand"
}

function activityTime(date: Date): string {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMin = Math.round(diffMs / 60000)
    const absMin = Math.abs(diffMin)
    if (isSameDay(date, now)) {
        if (absMin < 1) return diffMs >= 0 ? "Agora" : "Em instantes"
        if (absMin < 60) return diffMs >= 0 ? `Há ${absMin} min` : `Em ${absMin} min`
        const h = Math.round(absMin / 60)
        return diffMs >= 0 ? `Há ${h}h` : `Em ${h}h`
    }
    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    if (isSameDay(date, yesterday)) return `Ontem às ${formatTimePt(date)}`
    return formatShortDatePt(date)
}

export default function DoctorProfilePage({ id }: { id: string }) {
    const [doctor, setDoctor] = useState<DoctorDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [appointments, setAppointments] = useState<ApiAppointment[]>([])
    const [appointmentsLoading, setAppointmentsLoading] = useState(true)

    useEffect(() => {
        let cancelled = false
        async function load() {
            try {
                const res = await fetch(`/api/doctors/${id}`, { cache: "no-store" })
                if (!res.ok) {
                    const data = await res.json().catch(() => ({}))
                    if (data.error) throw new Error(data.error)
                    throw new Error("Falha ao carregar dados")
                }
                const data = await res.json()
                if (cancelled) return
                const ad: ApiDoctor = data.doctor
                setDoctor(mapApiToDetail(ad))
            } catch (e: any) {
                console.error(e)
                if (!cancelled) {
                    const fallback = FALLBACK_DB[id] ?? FALLBACK_DB["1"]
                    if (fallback) {
                        setDoctor(fallback)
                    } else {
                        setError(e?.message || "Médico não encontrado")
                    }
                }
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        load()
        return () => {
            cancelled = true
        }
    }, [id])

    useEffect(() => {
        let cancelled = false
        async function loadAppts() {
            try {
                const isFakeId = /^\d+$/.test(id) && FALLBACK_DB[id]
                const url = isFakeId
                    ? `/api/appointments?limit=50`
                    : `/api/appointments?doctorId=${encodeURIComponent(id)}&limit=200`
                const res = await fetch(url, { cache: "no-store" })
                const data = await res.json().catch(() => ({ appointments: [] }))
                if (cancelled) return
                const all: ApiAppointment[] = data.appointments ?? []
                const filtered = isFakeId
                    ? all.slice(0, 6)
                    : all.filter((a) => a.doctor?.id === id)
                setAppointments(filtered.length ? filtered : [])
            } catch (e) {
                console.error(e)
                if (!cancelled) setAppointments([])
            } finally {
                if (!cancelled) setAppointmentsLoading(false)
            }
        }
        loadAppts()
        return () => {
            cancelled = true
        }
    }, [id])

    const scheduleRanges = useMemo(() => {
        if (!doctor) return []
        const ranges: string[] = []
        if (doctor.startMorning && doctor.endMorning) {
            ranges.push(`${doctor.startMorning} – ${doctor.endMorning}`)
        }
        if (doctor.startAfternoon && doctor.endAfternoon) {
            ranges.push(`${doctor.startAfternoon} – ${doctor.endAfternoon}`)
        }
        return ranges
    }, [doctor])

    const { upcoming, past, totalMonth, completedMonth, activity } = useMemo(() => {
        const now = new Date()
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

        let rows: UpcomingRow[] = appointments.map((a): UpcomingRow | null => {
            const d = new Date(a.dateTime)
            if (isNaN(d.getTime())) return null
            const isPast = d.getTime() < now.getTime() - 5 * 60 * 1000
            const status = normalizeAppointmentStatus(a.status)
            const patient = a.patient?.fullName?.trim() || "Paciente"
            const type = (a.specialties?.slice(0, 1)[0]) || "Consulta"
            return {
                id: a.id,
                dateLabel: formatShortDatePt(d),
                timeLabel: formatTimePt(d),
                patient,
                patientId: a.patient?.id ?? null,
                type,
                status,
                isPast,
            }
        }).filter((x): x is UpcomingRow => x !== null)

        if (rows.length === 0 && FALLBACK_UPCOMING_BY_DOCTOR[id]) {
            rows = FALLBACK_UPCOMING_BY_DOCTOR[id].slice()
        }

        const upcoming = rows.filter((r) => !r.isPast).slice(0, 8)
        const past = rows.filter((r) => r.isPast).sort((a, b) => {
            return (b.dateLabel + b.timeLabel).localeCompare(a.dateLabel + a.timeLabel)
        })

        let tMonth = 0
        let cMonth = 0
        for (const a of appointments) {
            const d = new Date(a.dateTime)
            if (isNaN(d.getTime())) continue
            if (d.getTime() >= monthStart.getTime() && d.getTime() <= monthEnd.getTime()) {
                tMonth += 1
            }
            const s = normalizeAppointmentStatus(a.status).toUpperCase().replace(/\s+/g, "")
            if (
                (d.getTime() >= monthStart.getTime() && d.getTime() <= monthEnd.getTime()) &&
                (s === "CONCLUÍDO" || s === "CONCLUIDO" || s === "CONFIRMADO")
            ) {
                cMonth += 1
            }
        }
        if (tMonth === 0 && FALLBACK_DB[id]) {
            tMonth = FALLBACK_UPCOMING_BY_DOCTOR[id]?.length ?? 0
            cMonth = Math.max(0, tMonth - 1)
        }

        const activity: ActivityItem[] = past.slice(0, 6).map((p) => {
            const tone = activityToneByStatus(p.status)
            const label =
                p.status === "CANCELADO"
                    ? `Consulta de ${p.patient} foi cancelada`
                    : p.status === "CONCLUÍDO"
                        ? `${p.patient} · Atendimento concluído`
                        : `${p.patient} · ${p.status.toLowerCase()}`
            const isoRef = new Date()
            try {
                const parts = p.dateLabel.split(/[,\/\- ]+/g).filter(Boolean)
                const day = Number(parts[0] || 1)
                const mon = MONTH_NAMES.indexOf(parts[1] || "Set")
                const iso = new Date(isoRef.getFullYear(), mon >= 0 ? mon : 0, day)
                return { id: p.id, label, time: activityTime(iso), tone }
            } catch {
                return { id: p.id, label, time: "Há 2d", tone }
            }
        })

        return { upcoming, past, totalMonth: tMonth, completedMonth: cMonth, activity }
    }, [appointments, id])

    if (loading && !doctor) {
        return (
            <div className="space-y-6 pb-10">
                <div className="mx-auto max-w-md h-12 rounded-full bg-white shadow animate-pulse" />
                <div className="h-8 w-48 rounded-xl bg-neutral-100 animate-pulse" />
                <div className="h-64 rounded-3xl bg-white shadow animate-pulse" />
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.45fr)] gap-5 md:gap-6">
                    <div className="space-y-5 md:space-y-6">
                        <div className="h-64 rounded-3xl bg-white shadow animate-pulse" />
                        <div className="h-40 rounded-3xl bg-white shadow animate-pulse" />
                    </div>
                    <div className="space-y-5 md:space-y-6">
                        <div className="h-48 rounded-3xl bg-white shadow animate-pulse" />
                        <div className="h-64 rounded-3xl bg-white shadow animate-pulse" />
                        <div className="h-80 rounded-3xl bg-white shadow animate-pulse" />
                    </div>
                </div>
            </div>
        )
    }

    if (error || !doctor) {
        return (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center">
                <p className="text-lg font-semibold text-red-700">
                    {error || "Médico não encontrado"}
                </p>
                <Link
                    href="/dashboard/medicos"
                    className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-brand-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-800 transition-colors"
                >
                    Voltar para listagem
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-6 md:space-y-7 pb-10">
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
                        placeholder="Buscar no perfil..."
                        className="w-full rounded-full border border-neutral-200/80 bg-white/90 py-3 pl-11 pr-4 text-sm placeholder:text-neutral-400 shadow-[0_2px_10px_rgba(15,23,42,0.05)] focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400/60 transition"
                    />
                </div>
            </div>

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/dashboard/medicos" className="hover:text-neutral-800 transition-colors">
                    Médicos
                </Link>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-300" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
                <span className="font-semibold text-brand-700">{doctor.fullName}</span>
            </nav>

            {/* Header do Perfil */}
            <section className="rounded-3xl border border-neutral-200/70 bg-white p-5 md:p-7 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.25)] overflow-hidden relative">
                <div aria-hidden="true" className="absolute -top-20 right-0 h-64 w-64 rounded-full bg-brand-600/5 blur-3xl" />
                <div className="flex flex-col lg:flex-row gap-5 md:gap-8 items-start relative">
                    {/* Foto */}
                    <div className="relative shrink-0">
                        <div className={`h-36 w-36 md:h-44 md:w-44 rounded-3xl bg-gradient-to-br ${doctor.avatarGradient} text-white flex items-center justify-center shadow-[0_18px_40px_-14px_rgba(15,23,42,0.3)] ring-2 ring-white overflow-hidden`}>
                            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="absolute top-10 left-1/2 -translate-x-1/2 opacity-80">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                <path d="M12 21v-4" />
                            </svg>
                            <span className="relative mt-10 text-3xl md:text-4xl font-black tracking-wider drop-shadow-[0_1px_0_rgba(0,0,0,0.2)]">
                                {doctor.initials}
                            </span>
                        </div>
                        {String(doctor.status).toUpperCase().includes("DISP") && (
                            <span className="absolute -bottom-1 right-1 md:-bottom-0.5 md:right-2 h-6 w-6 md:h-7 md:w-7 rounded-full bg-brand-500 border-4 border-white shadow-[0_4px_14px_rgba(16,142,93,0.5)]">
                                <span className="sr-only">Disponível</span>
                            </span>
                        )}
                    </div>

                    {/* Info central */}
                    <div className="flex-1 min-w-0 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className="text-3xl md:text-5xl font-serif font-semibold tracking-tight text-neutral-900 leading-[1.05]">
                                        {doctor.fullName}
                                    </h1>
                                    <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-brand-100 text-brand-700 text-[11px] md:text-xs font-bold tracking-[0.14em] uppercase ring-1 ring-brand-600/10">
                                        {doctor.status}
                                    </span>
                                </div>
                                <p className="mt-3 text-xl md:text-2xl md:leading-snug text-brand-700 font-medium">
                                    {doctor.specialty}
                                </p>
                                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm md:text-[15px] text-neutral-600">
                                    <span className="inline-flex items-center gap-1.5">
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-brand-600">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                        </svg>
                                        <span className="font-semibold text-neutral-800">CRM {doctor.crm}</span>
                                    </span>
                                    {doctor.rating !== "—" && (
                                        <span className="inline-flex items-center gap-1.5">
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="#f59e0b" aria-hidden="true">
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                            </svg>
                                            <span className="font-semibold text-neutral-900">{doctor.rating}</span>
                                            <span className="text-neutral-500">({doctor.reviews} avaliações)</span>
                                        </span>
                                    )}
                                </div>
                                <p className="mt-2.5 inline-flex items-center gap-2 text-sm text-neutral-600">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-neutral-500">
                                        <rect x="3" y="4" width="18" height="18" rx="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                    <span>
                                        <span className="font-semibold text-neutral-900">{doctor.experience || "—"} anos de experiência</span>
                                    </span>
                                </p>
                            </div>

                            {/* Botões de ação */}
                            <div className="flex flex-col sm:items-end gap-3 shrink-0 w-full sm:w-auto">
                                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                                    <Link
                                        href="/dashboard/agendamento/novo"
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-brand-700 px-4 md:px-5 py-2.5 md:py-3 text-[14px] font-bold text-brand-700 hover:bg-brand-700 hover:text-white hover:shadow-[0_10px_22px_-6px_rgba(16,142,93,0.35)] transition-all"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <path d="M12 20h9" />
                                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                        </svg>
                                        Novo Atendimento
                                    </Link>
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 md:py-3 text-[14px] font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <rect x="3" y="3" width="18" height="18" rx="2" />
                                            <path d="M8 12h8" />
                                        </svg>
                                        Excluir Méd
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Grid Info + Bio + Especialidades + Appointments + Recent */}
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.45fr)] gap-5 md:gap-6">
                {/* Coluna 1: Info Pessoais + Especialidades */}
                <div className="space-y-5 md:space-y-6">
                    {/* Informações Pessoais */}
                    <section className="rounded-3xl border border-neutral-200/70 bg-white p-5 md:p-6 shadow-[0_4px_24px_-14px_rgba(15,23,42,0.12)]">
                        <header className="flex items-center gap-2.5 mb-5">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-600/10">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </span>
                            <h2 className="text-lg md:text-xl font-serif font-semibold tracking-tight text-neutral-900">
                                Informações Pessoais
                            </h2>
                        </header>

                        <dl className="space-y-4">
                            <InfoRow label="CRM" value={doctor.crm} />
                            <InfoRow label="E-MAIL" value={doctor.email} />
                            <InfoRow label="PHONE" value={doctor.phone} />
                            {scheduleRanges.length > 0 && (
                                <InfoRow label="HORÁRIOS" value={scheduleRanges.join("  |  ")} />
                            )}

                            <div className="pt-1">
                                <dt className="block text-[11px] font-bold tracking-[0.16em] uppercase text-neutral-500 mb-2">
                                    DIAS DE ATENDIMENTO
                                </dt>
                                <div className="flex flex-wrap gap-2">
                                    {WEEKDAY_LABELS.map((w) => {
                                        const active = doctor.workDays.includes(w.key)
                                        return (
                                            <span
                                                key={w.key}
                                                className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-bold ${active
                                                        ? "bg-brand-600 text-white shadow-[0_4px_10px_-2px_rgba(16,142,93,0.3)] ring-2 ring-white"
                                                        : "bg-neutral-100 text-neutral-500 ring-1 ring-neutral-200/70"
                                                    }`}
                                                title={w.label}
                                            >
                                                {DAY_INITIALS[w.key] ?? w.key.charAt(0).toUpperCase()}
                                            </span>
                                        )
                                    })}
                                </div>
                            </div>
                        </dl>
                    </section>

                    {/* Especialidades */}
                    <section className="rounded-3xl border border-neutral-200/70 bg-white p-5 md:p-6 shadow-[0_4px_24px_-14px_rgba(15,23,42,0.12)]">
                        <header className="flex items-center gap-2.5 mb-5">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    <path d="M9.5 8.5 8 10l4 4 2.5-2.5" />
                                </svg>
                            </span>
                            <h2 className="text-lg md:text-xl font-serif font-semibold tracking-tight text-neutral-900">
                                Especialidades
                            </h2>
                        </header>

                        <div className="flex flex-wrap gap-2.5">
                            {doctor.specialties.map((s) => (
                                <span key={s} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-brand-50 text-brand-700 text-[13px] font-semibold ring-1 ring-brand-600/10">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Coluna 2: Bio + Appointments + RecentActivity */}
                <div className="space-y-5 md:space-y-6">
                    {/* Bio / Descrição */}
                    <section className="relative rounded-3xl border border-neutral-200/70 bg-white p-5 md:p-7 shadow-[0_4px_24px_-14px_rgba(15,23,42,0.12)] overflow-hidden">
                        <div aria-hidden="true" className="pointer-events-none absolute -top-6 right-3 md:-top-2 md:right-6 select-none text-7xl md:text-[120px] font-black text-brand-700/10 leading-none tracking-tight font-serif">
                            {completedMonth || "0"}
                        </div>
                        <header className="flex items-center gap-2.5 mb-5 relative">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-700 ring-1 ring-green-600/10">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                </svg>
                            </span>
                            <h2 className="text-lg md:text-xl font-serif font-semibold tracking-tight text-neutral-900">
                                Bio / Descrição
                            </h2>
                        </header>

                        <div className="space-y-5 text-[14.5px] md:text-[15.5px] leading-[1.75] text-neutral-700 relative">
                            {doctor.bio ? (
                                doctor.bio.split(/\n+/).filter(Boolean).map((p, i) => (
                                    <p key={i}>{p}</p>
                                ))
                            ) : (
                                <p className="italic text-neutral-500">
                                    Nenhuma biografia cadastrada para este médico. Você pode editar as informações para adicionar uma descrição profissional.
                                </p>
                            )}
                        </div>
                    </section>

                    {/* Appointments This Month + Recent Activity */}
                    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-5 md:gap-6">
                        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 text-white p-5 md:p-6 shadow-[0_16px_40px_-8px_rgba(16,142,93,0.45)]">
                            <div aria-hidden="true" className="absolute -right-10 -bottom-12 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
                            <p className="text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/75 relative">
                                ATENDIMENTOS NO MÊS
                            </p>
                            <div className="mt-3 flex items-end justify-between relative">
                                <div>
                                    {appointmentsLoading && appointments.length === 0 ? (
                                        <div className="space-y-3">
                                            <div className="h-14 w-28 rounded-2xl bg-white/15 animate-pulse" />
                                            <div className="h-4 w-60 rounded-xl bg-white/10 animate-pulse" />
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-5xl md:text-6xl font-black tracking-tight">
                                                {totalMonth || "—"}
                                            </p>
                                            <div className="mt-4 flex flex-col gap-1">
                                                <p className="text-[12.5px] text-white/85">
                                                    {completedMonth > 0 ? `${completedMonth} realizados · ${Math.max(0, (totalMonth || 0) - completedMonth)} agendados` : totalMonth ? `No total ${totalMonth} agendados para este mês` : "Ainda sem agendamentos para este mês"}
                                                </p>
                                                {completedMonth > 0 && totalMonth > 0 && (
                                                    <p className="text-[12px] text-white/70">
                                                        {Math.round((completedMonth / totalMonth) * 100)}% realizados até agora
                                                    </p>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                                <span aria-hidden="true" className="h-20 w-20 md:h-24 md:w-24 rounded-3xl bg-white/10 ring-1 ring-white/10 flex items-center justify-center relative overflow-hidden">
                                    <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-white/90">
                                        <rect x="3" y="5" width="18" height="16" rx="2" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                        <line x1="8" y1="3" x2="8" y2="7" />
                                        <line x1="16" y1="3" x2="16" y2="7" />
                                    </svg>
                                </span>
                            </div>
                        </section>

                        <section className="rounded-3xl border border-neutral-200/70 bg-white p-5 md:p-6 shadow-[0_4px_24px_-14px_rgba(15,23,42,0.12)]">
                            <div className="flex items-center justify-between mb-5">
                                <p className="text-[11px] md:text-xs font-bold tracking-[0.18em] uppercase text-neutral-500">
                                    ATIVIDADES RECENTES
                                </p>
                                {appointmentsLoading && <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />}
                            </div>

                            <ol className="space-y-4">
                                {activity.length === 0 ? (
                                    <li className="text-sm text-neutral-500 italic">
                                        {appointmentsLoading ? "Carregando atividades..." : "Sem atividades registradas ainda."}
                                    </li>
                                ) : (
                                    activity.map((a) => (
                                        <li key={a.id} className="flex items-start gap-3">
                                            <span
                                                className={`mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full ring-1 ${a.tone === "emerald"
                                                        ? "bg-emerald-50 text-emerald-600 ring-emerald-500/15"
                                                        : a.tone === "amber"
                                                            ? "bg-amber-50 text-amber-600 ring-amber-500/15"
                                                            : a.tone === "neutral"
                                                                ? "bg-neutral-100 text-neutral-500 ring-neutral-400/15"
                                                                : "bg-brand-50 text-brand-700 ring-brand-600/15"
                                                    }`}
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[13.5px] text-neutral-800 leading-snug">
                                                    {a.label}
                                                </p>
                                                <p className="mt-0.5 text-[11.5px] text-neutral-500">
                                                    {a.time}
                                                </p>
                                            </div>
                                        </li>
                                    ))
                                )}
                            </ol>
                        </section>
                    </div>

                    {/* Próximos Atendimentos tabela */}
                    <section className="rounded-3xl border border-neutral-200/70 bg-white p-5 md:p-6 shadow-[0_4px_24px_-14px_rgba(15,23,42,0.12)]">
                        <header className="flex items-center justify-between gap-3 mb-4">
                            <div className="flex items-center gap-2.5">
                                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                </span>
                                <div>
                                    <h3 className="text-lg md:text-xl font-serif font-semibold tracking-tight text-neutral-900">
                                        Próximos Atendimentos
                                    </h3>
                                    {upcoming.length > 0 && (
                                        <p className="text-[12px] text-neutral-500">
                                            {upcoming.length} próximo(s) agendado(s)
                                        </p>
                                    )}
                                </div>
                            </div>
                            <Link
                                href="/dashboard/agendamento"
                                className="text-sm font-bold text-brand-700 hover:text-brand-800 transition-colors shrink-0"
                            >
                                Ver Agenda
                            </Link>
                        </header>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left border-b border-neutral-100">
                                        <th className="py-3 px-2 text-[11.5px] font-bold tracking-[0.16em] uppercase text-neutral-500">Paciente</th>
                                        <th className="py-3 px-2 text-[11.5px] font-bold tracking-[0.16em] uppercase text-neutral-500">Data · Horário</th>
                                        <th className="py-3 px-2 text-[11.5px] font-bold tracking-[0.16em] uppercase text-neutral-500">Tipo</th>
                                        <th className="py-3 px-2 text-right text-[11.5px] font-bold tracking-[0.16em] uppercase text-neutral-500">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {appointmentsLoading && upcoming.length === 0 ? (
                                        Array.from({ length: 3 }).map((_, i) => (
                                            <tr key={i}>
                                                <td className="py-4 px-2">
                                                    <div className="h-4 w-40 rounded-xl bg-neutral-100 animate-pulse" />
                                                </td>
                                                <td className="py-4 px-2">
                                                    <div className="h-4 w-36 rounded-xl bg-neutral-100 animate-pulse" />
                                                </td>
                                                <td className="py-4 px-2">
                                                    <div className="h-4 w-28 rounded-xl bg-neutral-100 animate-pulse" />
                                                </td>
                                                <td className="py-4 px-2">
                                                    <div className="h-5 w-24 rounded-full bg-neutral-100 animate-pulse ml-auto" />
                                                </td>
                                            </tr>
                                        ))
                                    ) : upcoming.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="py-10 px-2">
                                                <div className="flex flex-col items-center justify-center gap-3 text-center py-4 rounded-2xl border-2 border-dashed border-neutral-200/80 bg-neutral-50/40">
                                                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-neutral-400 ring-1 ring-neutral-200/80">
                                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                            <rect x="3" y="4" width="18" height="18" rx="2" />
                                                            <line x1="16" y1="2" x2="16" y2="6" />
                                                            <line x1="8" y1="2" x2="8" y2="6" />
                                                            <line x1="3" y1="10" x2="21" y2="10" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-[14.5px] font-semibold text-neutral-800">
                                                            Nenhum atendimento agendado
                                                        </p>
                                                        <p className="text-[12.5px] text-neutral-500 mt-0.5">
                                                            Agende consultas para este médico na tela de agendamentos.
                                                        </p>
                                                    </div>
                                                    <Link
                                                        href="/dashboard/agendamento/novo"
                                                        className="mt-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 px-4 py-2.5 text-[13px] font-bold text-white shadow-[0_8px_20px_rgba(16,142,93,0.26)] hover:brightness-[1.03] transition-all"
                                                    >
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                            <line x1="12" y1="5" x2="12" y2="19" />
                                                            <line x1="5" y1="12" x2="19" y2="12" />
                                                        </svg>
                                                        Criar Agendamento
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        upcoming.map((row) => (
                                            <tr key={row.id} className="hover:bg-neutral-50/60 transition-colors">
                                                <td className="py-3.5 px-2">
                                                    {row.patientId ? (
                                                        <Link
                                                            href={`/dashboard/pacientes/${row.patientId}/historico`}
                                                            className="inline-flex items-center gap-2 font-semibold text-neutral-900 hover:text-brand-700 transition-colors"
                                                        >
                                                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-600/10 text-[11px] font-bold">
                                                                {(row.patient || "P").charAt(0).toUpperCase()}
                                                            </span>
                                                            <span className="truncate max-w-[240px]">{row.patient}</span>
                                                        </Link>
                                                    ) : (
                                                        <span className="font-semibold text-neutral-800">
                                                            {row.patient}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3.5 px-2 text-neutral-700">
                                                    <span className="font-medium">{row.dateLabel}</span>
                                                    <span className="mx-1.5 text-neutral-400">·</span>
                                                    <span className="font-semibold text-neutral-900">{row.timeLabel}</span>
                                                </td>
                                                <td className="py-3.5 px-2">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-neutral-50 text-neutral-700 text-[12.5px] font-medium ring-1 ring-neutral-200/80">
                                                        {row.type}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-2 text-right">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11.5px] font-bold tracking-wide ${statusPill(row.status)}`}>
                                                        {row.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <dt className="block text-[11px] font-bold tracking-[0.16em] uppercase text-neutral-500 mb-1.5">
                {label}
            </dt>
            <dd className="text-[15px] font-semibold text-neutral-900 break-words">{value}</dd>
        </div>
    )
}
