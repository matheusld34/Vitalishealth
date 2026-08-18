"use client"

import Link from "next/link"
import { useState } from "react"

type AptStatus = "Confirmado" | "Pendente" | "Em Andamento" | "Concluído" | "Cancelado" | "Reagendado"

type AppointmentRow = {
    id: string
    patientName: string
    patientInitials: string
    patientGradient: string
    doctorName: string
    doctorInitials: string
    doctorGradient: string
    specialty: string
    kind: string
    date: string
    weekdayShort: string
    time: string
    duration: string
    room: string
    insurance: string
    status: AptStatus
}

const rows: AppointmentRow[] = [
    {
        id: "A-0001",
        patientName: "João Silva Pereira",
        patientInitials: "JS",
        patientGradient: "from-sky-400 to-blue-600",
        doctorName: "Dr. Marcos Vinícius",
        doctorInitials: "MV",
        doctorGradient: "from-slate-500 to-slate-800",
        specialty: "Neurologia",
        kind: "Consulta Neurológica",
        date: "12 Out, 2023",
        weekdayShort: "Qui",
        time: "08:30",
        duration: "45 min",
        room: "Neuro 01",
        insurance: "Unimed",
        status: "Confirmado",
    },
    {
        id: "A-0002",
        patientName: "Ana Ferreira Costa",
        patientInitials: "AF",
        patientGradient: "from-rose-400 to-pink-600",
        doctorName: "Dra. Julia Ramos",
        doctorInitials: "JR",
        doctorGradient: "from-violet-400 to-purple-700",
        specialty: "Clínica Geral",
        kind: "Check-up Anual",
        date: "12 Out, 2023",
        weekdayShort: "Qui",
        time: "09:15",
        duration: "30 min",
        room: "Sala 01",
        insurance: "Particular",
        status: "Pendente",
    },
    {
        id: "A-0003",
        patientName: "Mariana Lima Ferreira",
        patientInitials: "ML",
        patientGradient: "from-fuchsia-400 to-rose-600",
        doctorName: "Dra. Beatriz Costa",
        doctorInitials: "BC",
        doctorGradient: "from-fuchsia-500 to-rose-600",
        specialty: "Cardiologia",
        kind: "Avaliação Cardiológica",
        date: "12 Out, 2023",
        weekdayShort: "Qui",
        time: "10:00",
        duration: "60 min",
        room: "Cardio 01",
        insurance: "Amil",
        status: "Em Andamento",
    },
    {
        id: "A-0004",
        patientName: "Carlos Eduardo Lima",
        patientInitials: "CE",
        patientGradient: "from-amber-300 to-orange-500",
        doctorName: "Dr. Ricardo Mendes",
        doctorInitials: "RM",
        doctorGradient: "from-amber-400 to-orange-600",
        specialty: "Pediatria",
        kind: "Consulta Pediátrica",
        date: "12 Out, 2023",
        weekdayShort: "Qui",
        time: "11:00",
        duration: "30 min",
        room: "Pedi 02",
        insurance: "Bradesco Saúde",
        status: "Confirmado",
    },
    {
        id: "A-0005",
        patientName: "Rafael Monteiro",
        patientInitials: "RM",
        patientGradient: "from-emerald-400 to-green-600",
        doctorName: "Dr. Arnaldo Souza",
        doctorInitials: "AS",
        doctorGradient: "from-sky-400 to-blue-600",
        specialty: "Clínica Geral",
        kind: "Retorno Clínico",
        date: "12 Out, 2023",
        weekdayShort: "Qui",
        time: "12:30",
        duration: "30 min",
        room: "Sala 03",
        insurance: "SulAmérica",
        status: "Pendente",
    },
    {
        id: "A-0006",
        patientName: "Larissa Mendes",
        patientInitials: "LM",
        patientGradient: "from-purple-400 to-indigo-600",
        doctorName: "Dra. Helena Souza",
        doctorInitials: "HS",
        doctorGradient: "from-teal-400 to-emerald-600",
        specialty: "Fisioterapia",
        kind: "Fisioterapia Lombar",
        date: "12 Out, 2023",
        weekdayShort: "Qui",
        time: "13:45",
        duration: "45 min",
        room: "Fisio 02",
        insurance: "Unimed",
        status: "Confirmado",
    },
    {
        id: "A-0007",
        patientName: "Daniel Oliveira",
        patientInitials: "DO",
        patientGradient: "from-sky-400 to-cyan-600",
        doctorName: "Dr. Marcos Vinícius",
        doctorInitials: "MV",
        doctorGradient: "from-slate-500 to-slate-800",
        specialty: "Neurologia",
        kind: "Sessão de Acompanhamento",
        date: "12 Out, 2023",
        weekdayShort: "Qui",
        time: "14:30",
        duration: "45 min",
        room: "Neuro 02",
        insurance: "SulAmérica",
        status: "Confirmado",
    },
    {
        id: "A-0008",
        patientName: "Beatriz Costa",
        patientInitials: "BC",
        patientGradient: "from-rose-400 to-fuchsia-600",
        doctorName: "Dra. Beatriz Costa",
        doctorInitials: "BC",
        doctorGradient: "from-fuchsia-500 to-rose-600",
        specialty: "Cardiologia",
        kind: "Retorno Cardiológico",
        date: "12 Out, 2023",
        weekdayShort: "Qui",
        time: "15:30",
        duration: "45 min",
        room: "Cardio 01",
        insurance: "Particular",
        status: "Pendente",
    },
    {
        id: "A-0009",
        patientName: "Gabriel Rocha",
        patientInitials: "GR",
        patientGradient: "from-indigo-400 to-sky-600",
        doctorName: "Dra. Julia Ramos",
        doctorInitials: "JR",
        doctorGradient: "from-violet-400 to-purple-700",
        specialty: "Clínica Geral",
        kind: "Consulta Geral",
        date: "12 Out, 2023",
        weekdayShort: "Qui",
        time: "16:15",
        duration: "30 min",
        room: "Sala 02",
        insurance: "Bradesco Saúde",
        status: "Confirmado",
    },
    {
        id: "A-0010",
        patientName: "Isabela Nogueira",
        patientInitials: "IN",
        patientGradient: "from-pink-400 to-rose-500",
        doctorName: "Dr. Ricardo Mendes",
        doctorInitials: "RM",
        doctorGradient: "from-amber-400 to-orange-600",
        specialty: "Pediatria",
        kind: "Consulta Pediátrica",
        date: "12 Out, 2023",
        weekdayShort: "Qui",
        time: "17:00",
        duration: "30 min",
        room: "Pedi 01",
        insurance: "Amil",
        status: "Pendente",
    },
    {
        id: "A-0011",
        patientName: "Felipe Andrade",
        patientInitials: "FA",
        patientGradient: "from-lime-400 to-emerald-600",
        doctorName: "Dr. Arnaldo Souza",
        doctorInitials: "AS",
        doctorGradient: "from-sky-400 to-blue-600",
        specialty: "Clínica Geral",
        kind: "Urgência Leve",
        date: "13 Out, 2023",
        weekdayShort: "Sex",
        time: "08:00",
        duration: "45 min",
        room: "Sala 03",
        insurance: "Unimed",
        status: "Confirmado",
    },
    {
        id: "A-0012",
        patientName: "Juliana Vieira",
        patientInitials: "JV",
        patientGradient: "from-red-400 to-rose-600",
        doctorName: "Dra. Helena Souza",
        doctorInitials: "HS",
        doctorGradient: "from-teal-400 to-emerald-600",
        specialty: "Fisioterapia",
        kind: "Fisioterapia Cervical",
        date: "13 Out, 2023",
        weekdayShort: "Sex",
        time: "09:30",
        duration: "45 min",
        room: "Fisio 01",
        insurance: "Particular",
        status: "Reagendado",
    },
    {
        id: "A-0013",
        patientName: "Rodrigo Prado",
        patientInitials: "RP",
        patientGradient: "from-blue-400 to-indigo-700",
        doctorName: "Dra. Beatriz Costa",
        doctorInitials: "BC",
        doctorGradient: "from-fuchsia-500 to-rose-600",
        specialty: "Cardiologia",
        kind: "Consulta Cardiológica",
        date: "13 Out, 2023",
        weekdayShort: "Sex",
        time: "11:00",
        duration: "45 min",
        room: "Cardio 02",
        insurance: "SulAmérica",
        status: "Confirmado",
    },
    {
        id: "A-0014",
        patientName: "Fernanda Teixeira",
        patientInitials: "FT",
        patientGradient: "from-violet-400 to-fuchsia-600",
        doctorName: "Dra. Julia Ramos",
        doctorInitials: "JR",
        doctorGradient: "from-violet-400 to-purple-700",
        specialty: "Clínica Geral",
        kind: "Retorno Hipertensão",
        date: "13 Out, 2023",
        weekdayShort: "Sex",
        time: "13:00",
        duration: "30 min",
        room: "Sala 01",
        insurance: "Unimed",
        status: "Pendente",
    },
    {
        id: "A-0015",
        patientName: "Henrique Barros",
        patientInitials: "HB",
        patientGradient: "from-amber-500 to-red-600",
        doctorName: "Dr. Marcos Vinícius",
        doctorInitials: "MV",
        doctorGradient: "from-slate-500 to-slate-800",
        specialty: "Neurologia",
        kind: "Primeira Consulta",
        date: "13 Out, 2023",
        weekdayShort: "Sex",
        time: "14:45",
        duration: "60 min",
        room: "Neuro 01",
        insurance: "Bradesco Saúde",
        status: "Confirmado",
    },
    {
        id: "A-0016",
        patientName: "Camila Duarte",
        patientInitials: "CD",
        patientGradient: "from-teal-400 to-cyan-600",
        doctorName: "Dr. Ricardo Mendes",
        doctorInitials: "RM",
        doctorGradient: "from-amber-400 to-orange-600",
        specialty: "Pediatria",
        kind: "Acompanhamento Pediátrico",
        date: "13 Out, 2023",
        weekdayShort: "Sex",
        time: "16:00",
        duration: "30 min",
        room: "Pedi 02",
        insurance: "Amil",
        status: "Confirmado",
    },
    {
        id: "A-0017",
        patientName: "Thiago Correia",
        patientInitials: "TC",
        patientGradient: "from-slate-400 to-slate-700",
        doctorName: "Dr. Arnaldo Souza",
        doctorInitials: "AS",
        doctorGradient: "from-sky-400 to-blue-600",
        specialty: "Clínica Geral",
        kind: "Consulta Geral",
        date: "11 Out, 2023",
        weekdayShort: "Qua",
        time: "09:00",
        duration: "30 min",
        room: "Sala 01",
        insurance: "Particular",
        status: "Concluído",
    },
    {
        id: "A-0018",
        patientName: "Elisa Mendes",
        patientInitials: "EM",
        patientGradient: "from-teal-400 to-emerald-600",
        doctorName: "Dra. Beatriz Costa",
        doctorInitials: "BC",
        doctorGradient: "from-fuchsia-500 to-rose-600",
        specialty: "Cardiologia",
        kind: "Retorno",
        date: "11 Out, 2023",
        weekdayShort: "Qua",
        time: "10:30",
        duration: "45 min",
        room: "Cardio 01",
        insurance: "Particular",
        status: "Concluído",
    },
    {
        id: "A-0019",
        patientName: "André Nascimento",
        patientInitials: "AN",
        patientGradient: "from-orange-400 to-red-500",
        doctorName: "Dra. Julia Ramos",
        doctorInitials: "JR",
        doctorGradient: "from-violet-400 to-purple-700",
        specialty: "Clínica Geral",
        kind: "Check-up",
        date: "11 Out, 2023",
        weekdayShort: "Qua",
        time: "14:00",
        duration: "60 min",
        room: "Sala 02",
        insurance: "SulAmérica",
        status: "Cancelado",
    },
    {
        id: "A-0020",
        patientName: "Paula Ribeiro",
        patientInitials: "PR",
        patientGradient: "from-rose-300 to-pink-500",
        doctorName: "Dr. Ricardo Mendes",
        doctorInitials: "RM",
        doctorGradient: "from-amber-400 to-orange-600",
        specialty: "Pediatria",
        kind: "Vacinação",
        date: "11 Out, 2023",
        weekdayShort: "Qua",
        time: "16:30",
        duration: "30 min",
        room: "Pedi 01",
        insurance: "Unimed",
        status: "Concluído",
    },
]

const SPECIALTY_CHIPS = ["Todas", "Cardiologia", "Neurologia", "Pediatria", "Fisioterapia", "Clínica Geral"]
const STATUS_CHIPS = ["Todos", "Confirmado", "Pendente", "Em Andamento", "Concluído", "Cancelado", "Reagendado"] as const

export default function AllAppointmentsPage() {
    const [search, setSearch] = useState("")
    const [specialty, setSpecialty] = useState("Todas")
    const [status, setStatus] = useState<(typeof STATUS_CHIPS)[number]>("Todos")
    const [dateRange, setDateRange] = useState("este-mes")

    const total = 147
    const confirmed = 62
    const pending = 41
    const concluded = 38
    const page = 1
    const pages = 15
    const start = 1
    const end = rows.length

    return (
        <div className="space-y-6 md:space-y-8 pb-10">
            {/* Busca */}
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
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por paciente, médico ou sala..."
                        className="w-full rounded-full border border-neutral-200/80 bg-white/90 py-3 pl-11 pr-4 text-sm placeholder:text-neutral-400 shadow-[0_2px_10px_rgba(15,23,42,0.05)] focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400/60 transition"
                    />
                </div>
            </div>

            {/* Breadcrumb + header + CTA */}
            <div className="space-y-4">
                <nav className="flex items-center gap-2 text-sm text-neutral-500">
                    <Link href="/dashboard/agendamento" className="hover:text-neutral-800 transition-colors">
                        Appointments
                    </Link>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-300" aria-hidden="true">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                    <span className="font-semibold text-brand-700">Todos os Agendamentos</span>
                </nav>

                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-serif font-semibold tracking-tight text-neutral-900">
                            Todos os Agendamentos
                        </h1>
                        <p className="mt-1.5 text-sm md:text-[15px] text-neutral-600 max-w-2xl">
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
                    value={total.toLocaleString("pt-BR")}
                    badge="Out 2023"
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
                    value={String(confirmed)}
                    badge="+4 hoje"
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
                    value={String(pending)}
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
                    value={String(concluded)}
                    badge="98% satisfação"
                    icon={
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M20 6 9 17l-5-5" />
                        </svg>
                    }
                    iconType="info"
                />
            </section>

            {/* Filtros */}
            <section className="rounded-3xl border border-neutral-200/70 bg-white p-4 md:p-5 shadow-[0_4px_20px_-14px_rgba(15,23,42,0.15)] space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                    {/* Período */}
                    <FilterField label="Período">
                        <div className="relative">
                            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
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
                                className="w-full appearance-none rounded-xl border border-neutral-200/80 bg-neutral-50/70 pl-10 pr-10 py-2.5 text-sm font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400/60 transition"
                            >
                                <option value="hoje">Hoje</option>
                                <option value="esta-semana">Esta Semana</option>
                                <option value="este-mes">Este Mês (Out 2023)</option>
                                <option value="proximo-mes">Próximo Mês</option>
                                <option value="todos">Todos os Períodos</option>
                            </select>
                            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </span>
                        </div>
                    </FilterField>

                    {/* Médico */}
                    <FilterField label="Médico">
                        <div className="relative">
                            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </span>
                            <select
                                defaultValue="todos"
                                className="w-full appearance-none rounded-xl border border-neutral-200/80 bg-neutral-50/70 pl-10 pr-10 py-2.5 text-sm font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400/60 transition"
                            >
                                <option value="todos">Todos os Especialistas</option>
                                <option value="marcos">Dr. Marcos Vinícius</option>
                                <option value="julia">Dra. Julia Ramos</option>
                                <option value="beatriz">Dra. Beatriz Costa</option>
                                <option value="ricardo">Dr. Ricardo Mendes</option>
                                <option value="arnaldo">Dr. Arnaldo Souza</option>
                                <option value="helena">Dra. Helena Souza</option>
                            </select>
                            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </span>
                        </div>
                    </FilterField>

                    {/* Especialidade chips + status */}
                    <div className="space-y-3">
                        <FilterField label="Especialidade">
                            <div className="flex flex-wrap gap-2">
                                {SPECIALTY_CHIPS.map((s) => (
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
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-neutral-400 mb-2">
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
            <section className="relative rounded-3xl border border-neutral-200/70 bg-white shadow-[0_4px_24px_-12px_rgba(15,23,42,0.12)] overflow-hidden">
                <div className="flex items-center justify-between gap-3 px-5 md:px-7 py-5 border-b border-neutral-100 bg-neutral-50/40">
                    <p className="text-xs md:text-sm text-neutral-500">
                        Mostrando <span className="font-semibold text-neutral-800">{start}–{end}</span> de{" "}
                        <span className="font-semibold text-neutral-800">{total.toLocaleString("pt-BR")}</span>{" "}
                        agendamentos
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-neutral-200/80 hover:bg-neutral-50 text-xs font-bold text-neutral-600 transition-colors"
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <line x1="8" y1="6" x2="21" y2="6" />
                                <line x1="8" y1="12" x2="21" y2="12" />
                                <line x1="8" y1="18" x2="21" y2="18" />
                                <line x1="3" y1="6" x2="3.01" y2="6" />
                                <line x1="3" y1="12" x2="3.01" y2="12" />
                                <line x1="3" y1="18" x2="3.01" y2="18" />
                            </svg>
                            Colunas
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-neutral-100 bg-neutral-50/60">
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
                        <tbody className="divide-y divide-neutral-100">
                            {rows.map((r) => (
                                <tr key={r.id} className="group hover:bg-brand-50/30 transition-colors">
                                    <td className="py-4 md:py-5 pl-5 md:pl-7 pr-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`relative h-11 w-11 shrink-0 rounded-full bg-gradient-to-br ${r.patientGradient} text-white text-sm font-bold shadow-sm ring-2 ring-white overflow-hidden flex items-center justify-center`}>
                                                {r.patientInitials}
                                            </div>
                                            <div className="min-w-0 leading-tight">
                                                <p className="text-[15px] font-semibold text-neutral-900 truncate">
                                                    {r.patientName}
                                                </p>
                                                <p className="text-xs text-neutral-500 mt-0.5 truncate">
                                                    {r.kind} · {r.room}
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
                                                <p className="text-sm font-semibold text-neutral-900 truncate">
                                                    {r.doctorName}
                                                </p>
                                                <p className="text-[11px] text-neutral-500 truncate">
                                                    CRM · {r.specialty}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 md:py-5 px-4">
                                        <div className="leading-tight">
                                            <p className="text-sm font-bold text-neutral-900">{r.date}</p>
                                            <p className="text-[11.5px] uppercase tracking-wider font-bold text-neutral-500">
                                                {r.weekdayShort}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="py-4 md:py-5 px-4">
                                        <div className="leading-tight">
                                            <p className="text-sm font-black text-neutral-900 tabular-nums">{r.time}</p>
                                            <p className="text-[11.5px] font-semibold text-neutral-500 tabular-nums">
                                                {r.duration}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="py-4 md:py-5 px-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-semibold ring-1 ring-neutral-200/80 whitespace-nowrap">
                                            {r.specialty}
                                        </span>
                                    </td>
                                    <td className="py-4 md:py-5 px-4">
                                        <p className="text-sm font-medium text-neutral-700 whitespace-nowrap">
                                            {r.insurance}
                                        </p>
                                    </td>
                                    <td className="py-4 md:py-5 px-4">
                                        <StatusBadge status={r.status} />
                                    </td>
                                    <td className="py-4 md:py-5 pl-4 pr-5 md:pr-7">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <Link
                                                href="/dashboard/agendamento"
                                                aria-label="Ver detalhes do agendamento"
                                                className="inline-flex items-center justify-center h-9 w-9 rounded-xl text-brand-700 bg-brand-50 ring-1 ring-brand-600/10 hover:bg-brand-100 transition-colors"
                                            >
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            </Link>
                                            <Link
                                                href="/dashboard/agendamento/novo"
                                                aria-label="Reagendar consulta"
                                                className="inline-flex items-center justify-center h-9 w-9 rounded-xl text-amber-700 bg-amber-50 ring-1 ring-amber-600/10 hover:bg-amber-100 transition-colors"
                                            >
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                    <polyline points="23 4 23 10 17 10" />
                                                    <polyline points="1 20 1 14 7 14" />
                                                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                                                </svg>
                                            </Link>
                                            <button
                                                type="button"
                                                aria-label="Cancelar agendamento"
                                                className="inline-flex items-center justify-center h-9 w-9 rounded-xl text-red-600 bg-red-50 ring-1 ring-red-600/10 hover:bg-red-100 transition-colors"
                                            >
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                    <polyline points="3 6 5 6 21 6" />
                                                    <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
                                                    <path d="M10 11v6M14 11v6" />
                                                    <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Paginação */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 md:px-7 py-5 border-t border-neutral-100 bg-white">
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-neutral-500 border border-transparent hover:bg-neutral-50 hover:text-neutral-800 transition-colors disabled:opacity-40"
                        disabled={page === 1}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        Anterior
                    </button>
                    <div className="flex items-center gap-1.5">
                        <PageButton active>1</PageButton>
                        <PageButton>2</PageButton>
                        <PageButton>3</PageButton>
                        <PageButton>4</PageButton>
                        <span className="px-1 text-neutral-400" aria-hidden="true">
                            …
                        </span>
                        <PageButton>{pages}</PageButton>
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

            {/* Rodapé ações */}
            <div className="h-px w-full bg-neutral-200/70" />
            <footer className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-sm text-neutral-500 px-1">
                    Dados atualizados em <span className="font-semibold text-neutral-800">12 Out, 08:42</span>
                </p>
                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-neutral-200 px-5 py-3.5 text-[14.5px] font-bold text-neutral-700 hover:bg-neutral-50 transition-colors"
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
        <th scope="col" className={`px-4 py-4 text-left text-[11px] font-semibold tracking-[0.16em] text-neutral-500 uppercase whitespace-nowrap ${className}`}>
            {children}
        </th>
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
            ? "bg-brand-50 text-brand-700 ring-brand-600/10"
            : iconType === "success"
            ? "bg-green-50 text-green-700 ring-green-600/10"
            : iconType === "warning"
            ? "bg-amber-50 text-amber-700 ring-amber-600/10"
            : "bg-sky-50 text-sky-700 ring-sky-600/10"
    return (
        <div className="rounded-3xl border border-neutral-200/70 bg-white p-5 md:p-6 shadow-[0_4px_20px_-14px_rgba(15,23,42,0.15)] hover:shadow-[0_8px_28px_-14px_rgba(15,23,42,0.22)] transition-shadow">
            <div className="flex items-start justify-between gap-3">
                <p className="text-[11px] md:text-xs font-semibold tracking-[0.18em] text-neutral-400 uppercase">
                    {label}
                </p>
                {icon && (
                    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ring-1 ${iconCls}`}>
                        {icon}
                    </span>
                )}
            </div>
            <div className="mt-4 flex items-end justify-between gap-3">
                <p className="text-3xl md:text-[34px] font-black tracking-tight text-neutral-900 tabular-nums">
                    {value}
                </p>
                {badge && (
                    <span className="mb-1 inline-flex items-center px-2.5 py-0.5 rounded-lg bg-neutral-100 text-neutral-700 text-[11px] font-black ring-1 ring-neutral-200/80">
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
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-neutral-400 mb-2">{label}</p>
            {children}
        </div>
    )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                active
                    ? "bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-[0_6px_16px_-6px_rgba(16,142,93,0.55)] ring-2 ring-brand-500/20"
                    : "bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700"
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
    label: (typeof STATUS_CHIPS)[number]
    active: boolean
    onClick: () => void
}) {
    const [base] = statusStyles(label)
    const activeCls = active
        ? base
        : "bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700 ring-transparent"
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
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-black uppercase tracking-[0.14em] ring-1 ${cls}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
            {status}
        </span>
    )
}

function statusStyles(s: (typeof STATUS_CHIPS)[number] | AptStatus) {
    switch (s) {
        case "Confirmado":
            return ["bg-green-100 text-green-700 ring-green-700/15"]
        case "Pendente":
            return ["bg-amber-100 text-amber-700 ring-amber-600/15"]
        case "Em Andamento":
            return ["bg-brand-50 text-brand-700 ring-brand-600/15"]
        case "Concluído":
            return ["bg-sky-100 text-sky-700 ring-sky-700/15"]
        case "Cancelado":
            return ["bg-red-100 text-red-700 ring-red-700/15"]
        case "Reagendado":
            return ["bg-violet-100 text-violet-700 ring-violet-700/15"]
        default:
            return ["bg-neutral-100 text-neutral-700 ring-neutral-200/80"]
    }
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
