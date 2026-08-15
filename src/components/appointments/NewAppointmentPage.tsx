"use client"

import Link from "next/link"
import { useState } from "react"

const SUGGESTED_TIMES = ["09:00", "10:30", "14:00", "15:15", "16:45"]
const DURATIONS = ["30 Minutos", "45 Minutos", "60 Minutos", "90 Minutos"]

type PatientOpt = { id: string; name: string; insurance: string }
type DoctorOpt = { id: string; name: string; specialty: string; crm: string }

const PATIENTS_OPT: PatientOpt[] = [
    { id: "1", name: "Arnaldo Silveira", insurance: "Unimed Nacional" },
    { id: "2", name: "Beatriz Costa", insurance: "Particular" },
    { id: "3", name: "Carlos Eduardo", insurance: "Bradesco Saúde" },
    { id: "4", name: "Daniel Oliveira", insurance: "SulAmérica" },
    { id: "5", name: "Elisa Mendes", insurance: "Particular" },
    { id: "6", name: "Mariana Lima Ferreira", insurance: "Amil" },
]

const DOCTORS_OPT: DoctorOpt[] = [
    { id: "1", name: "Dr. Ricardo Mendes", specialty: "Clínica Geral", crm: "123456-SP" },
    { id: "2", name: "Dra. Julia Ramos", specialty: "Clínica Geral", crm: "234567-SP" },
    { id: "3", name: "Dra. Helena Souza", specialty: "Fisioterapia", crm: "345678-SP" },
    { id: "4", name: "Dr. Arnaldo Souza", specialty: "Clínica Geral", crm: "456789-SP" },
    { id: "5", name: "Dra. Beatriz Costa", specialty: "Cardiologia", crm: "567890-SP" },
    { id: "6", name: "Dr. Marcos Vinícius Oliveira", specialty: "Neurologia", crm: "123456-SP" },
]

export default function NewAppointmentPage() {
    const [patientId, setPatientId] = useState<string>("6")
    const [doctorId, setDoctorId] = useState<string>("6")
    const [date, setDate] = useState<string>("2023-10-24")
    const [time, setTime] = useState<string>("14:30")
    const [duration, setDuration] = useState<string>("45 Minutos")
    const [observations, setObservations] = useState<string>("")
    const [urgent, setUrgent] = useState<boolean>(false)
    const [sendReminder, setSendReminder] = useState<boolean>(true)

    const patient = PATIENTS_OPT.find((p) => p.id === patientId)
    const doctor = DOCTORS_OPT.find((d) => d.id === doctorId)

    const formattedDate = "24 de Outubro, 2023"
    const formattedTime = "às 14:30"

    return (
        <div className="space-y-6 md:space-y-7 pb-10">
            {/* Busca topo */}
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
                        placeholder="Buscar paciente, médico ou registro..."
                        className="w-full rounded-full border border-neutral-200/80 bg-white/90 py-3 pl-11 pr-4 text-sm placeholder:text-neutral-400 shadow-[0_2px_10px_rgba(15,23,42,0.05)] focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400/60 transition"
                    />
                </div>
            </div>

            {/* Breadcrumb + título + botões */}
            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">
                <div className="space-y-3">
                    <nav className="flex items-center gap-2 text-sm text-neutral-500">
                        <Link href="/dashboard/agendamento" className="hover:text-neutral-800 transition-colors">
                            Appointments
                        </Link>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-300" aria-hidden="true">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                        <span className="font-semibold text-brand-700">Novo Atendimento</span>
                    </nav>
                    <h1 className="text-3xl md:text-4xl font-serif font-semibold tracking-tight text-neutral-900">
                        Novo Atendimento
                    </h1>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <Link
                        href="/dashboard/agendamento"
                        className="inline-flex items-center justify-center rounded-2xl border-2 border-neutral-200 px-6 py-3 text-[14.5px] font-bold text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 px-6 py-3 text-[14.5px] font-bold text-white shadow-[0_10px_24px_rgba(16,142,93,0.3)] hover:brightness-[1.03] active:brightness-100 transition-all"
                    >
                        Confirmar Agendamento
                    </button>
                </div>
            </div>

            {/* Grid principal (form + sidebar resumo) */}
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] gap-5 md:gap-6 items-start">
                {/* Coluna formulário */}
                <div className="space-y-5 md:space-y-6">
                    {/* Bloco 1: Informações Principais */}
                    <section className="rounded-3xl border border-neutral-200/70 bg-white p-5 md:p-7 shadow-[0_4px_24px_-14px_rgba(15,23,42,0.12)]">
                        <header className="flex items-center gap-2.5 mb-6">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-600/10">
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <circle cx="12" cy="7" r="4" />
                                    <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
                                </svg>
                            </span>
                            <h2 className="text-lg md:text-xl font-serif font-semibold tracking-tight text-neutral-900">
                                Informações Principais
                            </h2>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Paciente */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-bold text-neutral-700">Paciente</label>
                                    <Link
                                        href="/dashboard/pacientes/novo"
                                        className="inline-flex items-center gap-1 text-[11.5px] font-black uppercase tracking-[0.14em] text-brand-700 hover:text-brand-800"
                                    >
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <line x1="12" y1="5" x2="12" y2="19" />
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                        </svg>
                                        Novo
                                    </Link>
                                </div>
                                <SelectWrapper
                                    icon="person"
                                    value={patientId}
                                    onChange={setPatientId}
                                    placeholder="Selecione um paciente..."
                                    options={PATIENTS_OPT.map((p) => ({
                                        value: p.id,
                                        label: p.name,
                                        sub: p.insurance,
                                    }))}
                                />
                            </div>

                            {/* Médico */}
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">
                                    Médico Responsável
                                </label>
                                <SelectWrapper
                                    icon="doctor"
                                    value={doctorId}
                                    onChange={setDoctorId}
                                    placeholder="Selecione o especialista..."
                                    options={DOCTORS_OPT.map((d) => ({
                                        value: d.id,
                                        label: d.name,
                                        sub: d.specialty,
                                    }))}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Bloco 2: Data e Horário */}
                    <section className="rounded-3xl border border-neutral-200/70 bg-white p-5 md:p-7 shadow-[0_4px_24px_-14px_rgba(15,23,42,0.12)]">
                        <header className="flex items-center gap-2.5 mb-6">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-600/10">
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <rect x="3" y="5" width="18" height="16" rx="2" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                    <line x1="8" y1="3" x2="8" y2="7" />
                                    <line x1="16" y1="3" x2="16" y2="7" />
                                </svg>
                            </span>
                            <h2 className="text-lg md:text-xl font-serif font-semibold tracking-tight text-neutral-900">
                                Data e Horário
                            </h2>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                            {/* Data */}
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">Data</label>
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <rect x="3" y="4" width="18" height="18" rx="2" />
                                            <line x1="16" y1="2" x2="16" y2="6" />
                                            <line x1="8" y1="2" x2="8" y2="6" />
                                            <line x1="3" y1="10" x2="21" y2="10" />
                                        </svg>
                                    </span>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="inputCls pl-12 pr-12"
                                    />
                                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <rect x="3" y="4" width="18" height="18" rx="2" />
                                            <line x1="16" y1="2" x2="16" y2="6" />
                                            <line x1="8" y1="2" x2="8" y2="6" />
                                            <line x1="3" y1="10" x2="21" y2="10" />
                                        </svg>
                                    </span>
                                </div>
                            </div>

                            {/* Horário */}
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">Horário</label>
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                    </span>
                                    <input
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="inputCls pl-12 pr-12 tabular-nums font-semibold"
                                    />
                                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                    </span>
                                </div>
                            </div>

                            {/* Duração */}
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">Duração Estimada</label>
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                    </span>
                                    <select
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        className="inputCls pl-12 pr-10 appearance-none"
                                    >
                                        {DURATIONS.map((d) => (
                                            <option key={d} value={d}>
                                                {d}
                                            </option>
                                        ))}
                                    </select>
                                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Sugestões de horários */}
                        <div>
                            <p className="text-sm font-semibold text-neutral-700 mb-2.5">
                                Sugestões de Horários Disponíveis (Hoje)
                            </p>
                            <div className="flex flex-wrap items-center gap-2.5">
                                {SUGGESTED_TIMES.map((t) => {
                                    const active = time === t
                                    return (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setTime(t)}
                                            className={`px-4 py-2 rounded-xl text-sm font-bold tabular-nums transition-all ${
                                                active
                                                    ? "bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 text-white shadow-[0_8px_18px_-6px_rgba(16,142,93,0.55)] ring-2 ring-brand-600/20"
                                                    : "bg-neutral-200/70 hover:bg-neutral-300/70 text-neutral-700"
                                            }`}
                                        >
                                            {t}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Bloco 3: Motivo da Consulta & Observações */}
                    <section className="rounded-3xl border border-neutral-200/70 bg-white p-5 md:p-7 shadow-[0_4px_24px_-14px_rgba(15,23,42,0.12)]">
                        <header className="flex items-center gap-2.5 mb-5">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-600/10">
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="8" y1="13" x2="16" y2="13" />
                                    <line x1="8" y1="17" x2="14" y2="17" />
                                </svg>
                            </span>
                            <h2 className="text-lg md:text-xl font-serif font-semibold tracking-tight text-neutral-900">
                                Motivo da Consulta & Observações
                            </h2>
                        </header>

                        <textarea
                            value={observations}
                            onChange={(e) => setObservations(e.target.value)}
                            rows={7}
                            placeholder="Descreva os sintomas iniciais ou motivo do agendamento..."
                            className="w-full rounded-2xl border-2 border-neutral-200/80 bg-neutral-50/40 focus:bg-white p-4 md:p-5 text-[14.5px] leading-relaxed placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400/60 transition resize-none"
                        />

                        <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-3">
                            <Check
                                checked={urgent}
                                onChange={setUrgent}
                                label="Marcar como urgência"
                                accent="amber"
                            />
                            <Check
                                checked={sendReminder}
                                onChange={setSendReminder}
                                label="Enviar lembrete por SMS/WhatsApp"
                                accent="brand"
                            />
                        </div>
                    </section>
                </div>

                {/* Coluna direita: Resumo + Card médico */}
                <div className="space-y-5 md:space-y-6 xl:sticky xl:top-6">
                    {/* Resumo do Agendamento */}
                    <aside className="rounded-3xl bg-white border border-neutral-200/70 shadow-[0_10px_30px_-14px_rgba(15,23,42,0.18)] overflow-hidden">
                        {/* Header verde */}
                        <div className="bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 px-5 md:px-6 py-5 md:py-6 text-white">
                            <h2 className="text-xl md:text-[22px] font-serif font-semibold tracking-tight">
                                Resumo do Agendamento
                            </h2>
                            <p className="mt-1.5 text-[11.5px] md:text-xs font-black uppercase tracking-[0.18em] text-white/85">
                                Verifique os dados antes de confirmar
                            </p>
                        </div>

                        <div className="p-5 md:p-6 space-y-5">
                            {/* Data e Hora (card) */}
                            <div className="rounded-2xl bg-neutral-100/70 p-4 flex items-start gap-3.5">
                                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700 ring-1 ring-neutral-200/80 shadow-sm">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <rect x="3" y="5" width="18" height="16" rx="2" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                        <line x1="8" y1="3" x2="8" y2="7" />
                                        <line x1="16" y1="3" x2="16" y2="7" />
                                    </svg>
                                </span>
                                <div className="min-w-0">
                                    <p className="text-[11.5px] font-black uppercase tracking-[0.16em] text-neutral-500 mb-1">
                                        Data e Hora
                                    </p>
                                    <p className="text-base md:text-lg font-bold text-neutral-900 leading-tight">
                                        {formattedDate}
                                    </p>
                                    <p className="mt-0.5 text-sm font-semibold text-brand-700">
                                        {formattedTime} <span className="text-neutral-500 font-medium">({duration})</span>
                                    </p>
                                </div>
                            </div>

                            {/* Rows informação */}
                            <dl className="divide-y divide-neutral-100">
                                <InfoRow label="Paciente:" value={patient?.name ?? "—"} bold />
                                <InfoRow label="Especialidade:" value={doctor?.specialty ?? "—"} />
                                <InfoRow label="Médico:" value={doctor?.name ?? "—"} />
                                <div className="flex items-center justify-between pt-3.5 pb-1">
                                    <dt className="text-sm font-semibold text-neutral-600">Tipo:</dt>
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-neutral-200/70 text-neutral-700 text-[10.5px] font-black uppercase tracking-[0.16em]">
                                        Particular
                                    </span>
                                </div>
                            </dl>

                            {/* Caixa informativa */}
                            <div className="rounded-2xl bg-brand-50/80 ring-1 ring-brand-600/10 p-4">
                                <div className="flex items-start gap-3">
                                    <span className="mt-0.5 shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-700 text-white">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="12" y1="16" x2="12" y2="12" />
                                            <line x1="12" y1="8" x2="12.01" y2="8" />
                                        </svg>
                                    </span>
                                    <p className="text-[13px] leading-relaxed text-neutral-700">
                                        Este horário está disponível na agenda do Dr. Marcos. Ao confirmar, o
                                        paciente receberá um e-mail de confirmação automaticamente.
                                    </p>
                                </div>
                            </div>

                            {/* Botões rodapé resumo */}
                            <div className="pt-2 space-y-3">
                                <button
                                    type="button"
                                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 px-6 py-4 text-[15px] font-bold text-white shadow-[0_12px_28px_rgba(16,142,93,0.35)] hover:brightness-[1.03] active:brightness-100 transition-all"
                                >
                                    Confirmar Agendamento
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                </button>
                                <Link
                                    href="/dashboard/agendamento"
                                    className="w-full inline-flex items-center justify-center py-2.5 text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
                                >
                                    Cancelar e Voltar
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* Card médico disponível agora */}
                    <aside className="rounded-3xl border-2 border-neutral-200/80 bg-white p-4 md:p-5 shadow-[0_4px_20px_-14px_rgba(15,23,42,0.12)]">
                        <div className="flex items-center gap-3.5">
                            <div className="relative shrink-0">
                                <div className="h-14 w-14 md:h-16 md:w-16 rounded-2xl bg-gradient-to-br from-slate-500 via-slate-700 to-slate-900 text-white flex items-center justify-center ring-2 ring-white shadow overflow-hidden">
                                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="opacity-90 mt-2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                    <span className="absolute inset-x-0 bottom-1 text-center text-lg md:text-xl font-black tracking-wide drop-shadow">
                                        MO
                                    </span>
                                </div>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[15px] md:text-base font-bold text-neutral-900 truncate">
                                    Dr. Marcos Oliveira
                                </p>
                                <p className="text-[12px] text-neutral-500 mt-0.5 font-semibold">
                                    CRM: 123456 - SP
                                </p>
                                <span className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10.5px] font-black uppercase tracking-[0.16em] ring-1 ring-emerald-700/10">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 shadow-[0_0_0_3px_rgba(16,185,129,0.18)] animate-pulse" />
                                    Disponível agora
                                </span>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Estilos inline: inputCls padronizado */}
            <style jsx global>{`
                .inputCls {
                    width: 100%;
                    border-radius: 1rem;
                    border: 2px solid rgba(226, 232, 240, 0.9);
                    background-color: rgba(255, 255, 255, 1);
                    padding-top: 0.85rem;
                    padding-bottom: 0.85rem;
                    padding-left: 3rem;
                    padding-right: 1.5rem;
                    font-size: 0.875rem;
                    color: #0f172a;
                    transition: all 0.2s ease;
                }
                .inputCls::placeholder {
                    color: #94a3b8;
                }
                .inputCls:focus {
                    outline: none;
                    border-color: rgba(16, 185, 129, 0.45);
                    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.12);
                }
            `}</style>
        </div>
    )
}

/* ---------- SUBCOMPONENTES ---------- */

type SelectOption = { value: string; label: string; sub?: string }

function SelectWrapper({
    value,
    onChange,
    placeholder,
    options,
    icon,
}: {
    value: string
    onChange: (v: string) => void
    placeholder: string
    options: SelectOption[]
    icon: "person" | "doctor"
}) {
    return (
        <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                {icon === "person" && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="7" r="4" />
                        <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
                    </svg>
                )}
                {icon === "doctor" && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                )}
            </span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="inputCls pl-12 pr-10 appearance-none"
            >
                <option value="" disabled>
                    {placeholder}
                </option>
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                        {o.sub ? ` — ${o.sub}` : ""}
                    </option>
                ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </span>
        </div>
    )
}

function InfoRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
    return (
        <div className="flex items-center justify-between gap-4 py-3.5">
            <dt className="text-sm font-semibold text-neutral-600 shrink-0">{label}</dt>
            <dd className={`text-right ${bold ? "font-black text-neutral-900 text-[15px]" : "font-bold text-neutral-800"}`}>
                {value}
            </dd>
        </div>
    )
}

function Check({
    checked,
    onChange,
    label,
    accent,
}: {
    checked: boolean
    onChange: (v: boolean) => void
    label: string
    accent: "amber" | "brand"
}) {
    const active =
        accent === "amber"
            ? "bg-amber-500 border-amber-600 text-white shadow-[0_6px_14px_-4px_rgba(245,158,11,0.55)]"
            : "bg-brand-600 border-brand-700 text-white shadow-[0_6px_14px_-4px_rgba(16,142,93,0.55)]"
    return (
        <label className="inline-flex items-center gap-2.5 cursor-pointer select-none group">
            <span className="relative">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="peer sr-only"
                />
                <span
                    className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all ${
                        checked ? active : "bg-white border-neutral-300 group-hover:border-neutral-400"
                    }`}
                >
                    <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className={`transition-opacity ${checked ? "opacity-100" : "opacity-0"}`}
                    >
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </span>
            </span>
            <span className="text-sm font-semibold text-neutral-700 group-hover:text-neutral-900 transition-colors">
                {label}
            </span>
        </label>
    )
}
