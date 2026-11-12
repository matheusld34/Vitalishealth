"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

const DURATIONS = ["30 Minutos", "45 Minutos", "60 Minutos", "90 Minutos"]
const SLOT_STEP_MINUTES = 30

type Window = { start: string; end: string }

// Janelas usadas quando o médico ainda não cadastrou horários próprios
const DEFAULT_WINDOWS: Window[] = [
    { start: "08:00", end: "12:00" },
    { start: "13:30", end: "18:00" },
]

// Chaves gravadas em doctorProfile.workDays (na ordem de Date.getDay())
const DAY_KEYS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"]
const DAY_LABELS: Record<string, string> = {
    dom: "Dom",
    seg: "Seg",
    ter: "Ter",
    qua: "Qua",
    qui: "Qui",
    sex: "Sex",
    "sáb": "Sáb",
}

type PatientOpt = { id: string; name: string; insurance: string }
type DoctorOpt = {
    id: string
    name: string
    specialty: string
    crm: string
    workDays: string[]
    windows: Window[]
}
type ToastState = { kind: "success" | "error"; message: string } | null

type ApiPatient = {
    id: string
    fullName?: string | null
    insuranceOperator?: string | null
    planType?: string | null
}

type ApiDoctor = {
    id: string
    name?: string | null
    doctorProfile?: {
        crm?: string | null
        crmUf?: string | null
        specialties?: string[] | null
        workDays?: string[] | null
        startMorning?: string | null
        endMorning?: string | null
        startAfternoon?: string | null
        endAfternoon?: string | null
    } | null
}

export default function NewAppointmentPage() {
    const router = useRouter()
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const [patientOpts, setPatientOpts] = useState<PatientOpt[]>([])
    const [doctorOpts, setDoctorOpts] = useState<DoctorOpt[]>([])
    const [loadingOptions, setLoadingOptions] = useState<boolean>(true)
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [toast, setToast] = useState<ToastState>(null)

    const [patientId, setPatientId] = useState<string>("")
    const [doctorId, setDoctorId] = useState<string>("")
    const [date, setDate] = useState<string>(toIsoDate(todayStart))
    const [time, setTime] = useState<string>("09:00")
    const [duration, setDuration] = useState<string>("45 Minutos")
    const [observations, setObservations] = useState<string>("")
    const [urgent, setUrgent] = useState<boolean>(false)
    const [sendReminder, setSendReminder] = useState<boolean>(true)

    const [viewMonth, setViewMonth] = useState<Date>(() => new Date(todayStart.getFullYear(), todayStart.getMonth(), 1))
    const [jumpDateInput, setJumpDateInput] = useState<string>(toIsoDate(todayStart))

    // Busca pacientes e médicos reais do banco
    useEffect(() => {
        let cancelled = false

        async function load() {
            try {
                const [pRes, dRes] = await Promise.all([
                    fetch("/api/patients", { cache: "no-store" }),
                    fetch("/api/doctors", { cache: "no-store" }),
                ])
                const pJson = await pRes.json().catch(() => null)
                const dJson = await dRes.json().catch(() => null)
                if (cancelled) return

                const rawPatients: ApiPatient[] = Array.isArray(pJson?.patients) ? pJson.patients : []
                const mappedPatients: PatientOpt[] = rawPatients.map((p) => ({
                    id: p.id,
                    name: p.fullName?.trim() || "Paciente",
                    insurance:
                        [p.insuranceOperator, p.planType].filter(Boolean).join(" — ") || "Particular",
                }))

                const rawDoctors: ApiDoctor[] = Array.isArray(dJson?.doctors) ? dJson.doctors : []
                const mappedDoctors: DoctorOpt[] = rawDoctors.map((d) => {
                    const specs = Array.isArray(d.doctorProfile?.specialties)
                        ? (d.doctorProfile?.specialties as string[])
                        : []
                    const crm = d.doctorProfile?.crm
                    const uf = d.doctorProfile?.crmUf
                    const days = Array.isArray(d.doctorProfile?.workDays)
                        ? (d.doctorProfile?.workDays as string[]).filter((k) => DAY_KEYS.includes(k))
                        : []
                    return {
                        id: d.id,
                        name: d.name?.trim() || "Médico(a)",
                        specialty: specs.length ? specs.join(" / ") : "Clínica Geral",
                        crm: crm ? `${crm}${uf ? `-${uf}` : ""}` : "—",
                        workDays: days,
                        windows: windowsOf(d.doctorProfile),
                    }
                })

                setPatientOpts(mappedPatients)
                setDoctorOpts(mappedDoctors)
                setPatientId((prev) => (mappedPatients.some((p) => p.id === prev) ? prev : mappedPatients[0]?.id || ""))
                setDoctorId((prev) => (mappedDoctors.some((d) => d.id === prev) ? prev : mappedDoctors[0]?.id || ""))
            } catch {
                if (cancelled) return
                setPatientOpts([])
                setDoctorOpts([])
            } finally {
                if (!cancelled) setLoadingOptions(false)
            }
        }

        load()
        return () => {
            cancelled = true
        }
    }, [])

    const patient = useMemo(() => patientOpts.find((p) => p.id === patientId), [patientOpts, patientId])
    const doctor = useMemo(() => doctorOpts.find((d) => d.id === doctorId), [doctorOpts, doctorId])

    const durationMinutes = Number(duration.split(" ")[0]) || 30

    // Disponibilidade do médico selecionado (dias de plantão + janelas de horário)
    const availability = useMemo(() => {
        const days = doctor?.workDays ?? []
        const windows = doctor?.windows ?? []
        return {
            // Só restringe quando o médico tem dias E horários cadastrados
            configured: days.length > 0 && windows.length > 0,
            days,
            windows: windows.length ? windows : DEFAULT_WINDOWS,
        }
    }, [doctor])

    const dayKey = DAY_KEYS[safeParseIso(date).getDay()]
    const dayIsAvailable = !availability.configured || availability.days.includes(dayKey)
    const timeFitsAvailability = fitsWindows(time, availability.windows, durationMinutes)

    const dayLabel = availability.days.map((d) => DAY_LABELS[d] ?? d).join(", ")
    const windowLabel = availability.windows.map((w) => `${w.start} às ${w.end}`).join(" · ")
    const availableSlots = useMemo(
        () => slotsFor(availability.windows, durationMinutes),
        [availability, durationMinutes]
    )

    // Mantém data e horário dentro da disponibilidade sempre que ela muda
    useEffect(() => {
        if (!availability.configured) return

        if (!availability.days.includes(dayKey)) {
            const next = nextAvailableDate(date, availability.days)
            if (next && next !== date) {
                setDate(next)
                setJumpDateInput(next)
                setViewMonth(monthOf(next))
            }
            return
        }

        if (!timeFitsAvailability) {
            setTime(nearestSlot(time, availableSlots))
        }
    }, [availability, dayKey, date, time, timeFitsAvailability, availableSlots])

    async function handleSubmit() {
        if (submitting) return

        if (!patientId || !doctorId) {
            setToast({ kind: "error", message: "Selecione o paciente e o médico responsável." })
            return
        }
        if (!date || !time) {
            setToast({ kind: "error", message: "Informe a data e o horário do atendimento." })
            return
        }
        if (safeParseIso(date) < todayStart) {
            setToast({ kind: "error", message: "Não é possível agendar em datas que já passaram." })
            return
        }
        if (availability.configured && !availability.days.includes(dayKey)) {
            setToast({
                kind: "error",
                message: `${doctor?.name ?? "O médico"} não atende ${DAY_LABELS[dayKey]}. Dias de atendimento: ${dayLabel}.`,
            })
            return
        }
        if (availability.configured && !timeFitsAvailability) {
            setToast({
                kind: "error",
                message: `${doctor?.name ?? "O médico"} atende ${windowLabel}. Escolha um horário que caiba nesse intervalo (${durationMinutes} min).`,
            })
            return
        }

        setSubmitting(true)
        try {
            const res = await fetch("/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    patientId,
                    doctorId,
                    date,
                    time,
                    durationMinutes,
                    observation: observations,
                    specialties: doctor?.specialty ? doctor.specialty.split(" / ") : [],
                    urgent,
                    reminder: sendReminder,
                }),
            })
            const json = await res.json().catch(() => null)

            if (!res.ok || !json?.ok) {
                setToast({
                    kind: "error",
                    message: json?.error || "Não foi possível salvar o agendamento.",
                })
                setSubmitting(false)
                return
            }

            setToast({ kind: "success", message: "Agendamento salvo com sucesso! Redirecionando..." })
            setTimeout(() => {
                router.push("/dashboard/agendamento")
                router.refresh()
            }, 900)
        } catch {
            setToast({ kind: "error", message: "Falha de conexão ao salvar o agendamento." })
            setSubmitting(false)
        }
    }


    const selectedDate = safeParseIso(date)
    const formattedDate = formatLongPt(selectedDate)
    const formattedTime = `às ${time}`
    const doctorName = doctor?.name ? doctor.name.replace(/^Dr[a]?\.\s*/i, "") : "o médico"

    return (
        <div className="space-y-6 md:space-y-7 pb-10">
            {/* Busca topo */}
            <div className="mx-auto max-w-md w-full">
                <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </span>
                    <input
                        type="search"
                        placeholder="Buscar paciente, médico ou registro..."
                        className="w-full rounded-full border border-neutral-200/80 bg-white/90 py-3 pl-11 pr-4 text-sm placeholder:text-neutral-400 shadow-[0_2px_10px_rgba(15,23,42,0.05)] focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400/60 transition dark:border-neutral-800/80 dark:bg-neutral-900/80 dark:placeholder:text-neutral-500"
                    />
                </div>
            </div>

            {/* Breadcrumb + título + botões */}
            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">
                <div className="space-y-3">
                    <nav className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                        <Link href="/dashboard/agendamento" className="hover:text-neutral-800 transition-colors dark:hover:text-neutral-200">
                            Appointments
                        </Link>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-300 dark:text-neutral-600" aria-hidden="true">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                        <span className="font-semibold text-brand-700 dark:text-brand-300">Novo Atendimento</span>
                    </nav>
                    <h1 className="text-3xl md:text-4xl font-serif font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                        Novo Atendimento
                    </h1>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <Link
                        href="/dashboard/agendamento"
                        className="inline-flex items-center justify-center rounded-2xl border-2 border-neutral-200 px-6 py-3 text-[14.5px] font-bold text-neutral-700 hover:bg-neutral-50 transition-colors dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-800/60"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting || loadingOptions}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 px-6 py-3 text-[14.5px] font-bold text-white shadow-[0_10px_24px_rgba(16,142,93,0.3)] hover:brightness-[1.03] active:brightness-100 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {submitting ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                Confirmando...
                            </>
                        ) : (
                            "Confirmar Agendamento"
                        )}
                    </button>
                </div>
            </div>

            {/* Grid principal (form + sidebar resumo) */}
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] gap-5 md:gap-6 items-start">
                {/* Coluna formulário */}
                <div className="space-y-5 md:space-y-6">
                    {/* Bloco 1: Informações Principais */}
                    <section className="rounded-3xl border border-neutral-200/70 bg-white p-5 md:p-7 shadow-[0_4px_24px_-14px_rgba(15,23,42,0.12)] dark:border-neutral-800/80 dark:bg-neutral-900">
                        <header className="flex items-center gap-2.5 mb-6">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-600/10 dark:bg-brand-500/10 dark:text-brand-300">
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <circle cx="12" cy="7" r="4" />
                                    <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
                                </svg>
                            </span>
                            <h2 className="text-lg md:text-xl font-serif font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                                Informações Principais
                            </h2>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Paciente */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-bold text-neutral-700 dark:text-neutral-200">Paciente</label>
                                    <Link
                                        href="/dashboard/pacientes/novo"
                                        className="inline-flex items-center gap-1 text-[11.5px] font-black uppercase tracking-[0.14em] text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
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
                                    placeholder={
                                        loadingOptions
                                            ? "Carregando pacientes..."
                                            : patientOpts.length
                                                ? "Selecione um paciente..."
                                                : "Nenhum paciente cadastrado"
                                    }
                                    disabled={loadingOptions || !patientOpts.length}
                                    options={patientOpts.map((p) => ({
                                        value: p.id,
                                        label: p.name,
                                        sub: p.insurance,
                                    }))}
                                />
                                {!loadingOptions && !patientOpts.length && (
                                    <p className="mt-2 text-[12.5px] font-semibold text-amber-700 dark:text-amber-300">
                                        Cadastre o paciente em{" "}
                                        <Link href="/dashboard/pacientes/novo" className="underline">
                                            Pacientes → Novo
                                        </Link>{" "}
                                        antes de agendar.
                                    </p>
                                )}
                            </div>

                            {/* Médico */}
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2 dark:text-neutral-200">
                                    Médico Responsável
                                </label>
                                <SelectWrapper
                                    icon="doctor"
                                    value={doctorId}
                                    onChange={setDoctorId}
                                    placeholder={
                                        loadingOptions
                                            ? "Carregando médicos..."
                                            : doctorOpts.length
                                                ? "Selecione o especialista..."
                                                : "Nenhum médico cadastrado"
                                    }
                                    disabled={loadingOptions || !doctorOpts.length}
                                    options={doctorOpts.map((d) => ({
                                        value: d.id,
                                        label: d.name,
                                        sub: d.specialty,
                                    }))}
                                />
                                {!loadingOptions && !doctorOpts.length && (
                                    <p className="mt-2 text-[12.5px] font-semibold text-amber-700 dark:text-amber-300">
                                        Cadastre o profissional em{" "}
                                        <Link href="/dashboard/medicos" className="underline">
                                            Médicos
                                        </Link>{" "}
                                        antes de agendar.
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Bloco 2: Data e Horário */}
                    <section className="rounded-3xl border border-neutral-200/70 bg-white p-5 md:p-7 shadow-[0_4px_24px_-14px_rgba(15,23,42,0.12)] dark:border-neutral-800/80 dark:bg-neutral-900">
                        <header className="flex items-center gap-2.5 mb-6">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-600/10 dark:bg-brand-500/10 dark:text-brand-300">
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <rect x="3" y="5" width="18" height="16" rx="2" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                    <line x1="8" y1="3" x2="8" y2="7" />
                                    <line x1="16" y1="3" x2="16" y2="7" />
                                </svg>
                            </span>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-lg md:text-xl font-serif font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                                    Data e Horário
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    const t = new Date()
                                    t.setHours(0, 0, 0, 0)
                                    const iso = toIsoDate(t)
                                    setDate(iso)
                                    setJumpDateInput(iso)
                                    setViewMonth(new Date(t.getFullYear(), t.getMonth(), 1))
                                }}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-50 text-brand-700 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] ring-1 ring-brand-600/10 hover:bg-brand-100 transition-colors dark:bg-brand-500/10 dark:text-brand-300 dark:hover:bg-brand-500/20"
                            >
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                                Hoje
                            </button>
                        </header>

                        {/* Barra busca rápida por data + mês/ano navegação */}
                        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] gap-5 mb-6">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-[0.14em] text-neutral-500 mb-2 dark:text-neutral-400">
                                    Ir para data
                                </label>
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <rect x="3" y="4" width="18" height="18" rx="2" />
                                            <line x1="16" y1="2" x2="16" y2="6" />
                                            <line x1="8" y1="2" x2="8" y2="6" />
                                            <line x1="3" y1="10" x2="21" y2="10" />
                                        </svg>
                                    </span>
                                    <input
                                        type="date"
                                        value={jumpDateInput}
                                        min={toIsoDate(todayStart)}
                                        onChange={(e) => {
                                            const v = e.target.value
                                            if (!v) {
                                                setJumpDateInput(v)
                                                return
                                            }
                                            if (safeParseIso(v) < todayStart) {
                                                setJumpDateInput(toIsoDate(todayStart))
                                                setToast({
                                                    kind: "error",
                                                    message: "Não é possível agendar em datas que já passaram.",
                                                })
                                                return
                                            }
                                            setJumpDateInput(v)
                                            setDate(v)
                                            const d = safeParseIso(v)
                                            setViewMonth(new Date(d.getFullYear(), d.getMonth(), 1))
                                        }}
                                        className="w-full rounded-2xl border-2 border-neutral-200/80 bg-white pl-12 pr-4 py-3 text-sm font-semibold text-neutral-800 tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400/60 transition dark:border-neutral-800/80 dark:bg-neutral-900 dark:text-neutral-100"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 md:gap-4 rounded-2xl border-2 border-neutral-200/80 bg-gradient-to-br from-neutral-50 to-white px-4 py-3 dark:border-neutral-800/80 dark:from-neutral-800/40 dark:to-neutral-900">
                                <button
                                    type="button"
                                    aria-label="Mês anterior"
                                    onClick={() =>
                                        setViewMonth((v) => new Date(v.getFullYear(), v.getMonth() - 1, 1))
                                    }
                                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white border border-neutral-200/80 text-neutral-600 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition-colors dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-brand-500/10 dark:hover:text-brand-300 dark:hover:border-brand-500/30"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <polyline points="15 18 9 12 15 6" />
                                    </svg>
                                </button>

                                <div className="flex-1 min-w-0 flex items-center justify-center gap-2 md:gap-3">
                                    <select
                                        aria-label="Mês"
                                        value={viewMonth.getMonth()}
                                        onChange={(e) =>
                                            setViewMonth(
                                                new Date(viewMonth.getFullYear(), Number(e.target.value), 1)
                                            )
                                        }
                                        className="bg-transparent px-2 py-1.5 rounded-xl appearance-none text-[15px] md:text-base font-black text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500/30 cursor-pointer hover:bg-white dark:text-neutral-100 dark:hover:bg-neutral-800"
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
                                            setViewMonth(
                                                new Date(Number(e.target.value), viewMonth.getMonth(), 1)
                                            )
                                        }
                                        className="bg-transparent px-2 py-1.5 rounded-xl appearance-none text-[15px] md:text-base font-black text-neutral-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500/30 cursor-pointer hover:bg-white dark:text-neutral-100 dark:hover:bg-neutral-800"
                                    >
                                        {Array.from({ length: 11 }, (_, i) => viewMonth.getFullYear() - 2 + i).map((y) => (
                                            <option key={y} value={y}>
                                                {y}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    type="button"
                                    aria-label="Próximo mês"
                                    onClick={() =>
                                        setViewMonth((v) => new Date(v.getFullYear(), v.getMonth() + 1, 1))
                                    }
                                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white border border-neutral-200/80 text-neutral-600 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition-colors dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-brand-500/10 dark:hover:text-brand-300 dark:hover:border-brand-500/30"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Grade do calendário */}
                        <div className="mb-6">
                            {/* Dias da semana */}
                            <div className="grid grid-cols-7 gap-1.5 mb-1.5 px-1">
                                {WEEK_DAYS.map((d) => (
                                    <div
                                        key={d}
                                        className="text-center text-[11px] font-black uppercase tracking-[0.16em] text-neutral-500 py-2 dark:text-neutral-400"
                                    >
                                        {d}
                                    </div>
                                ))}
                            </div>
                            {/* Células */}
                            <div className="grid grid-cols-7 gap-1.5">
                                {buildCalendarGrid(viewMonth).map((cell, idx) => {
                                    const inMonth = cell.inMonth
                                    const isoCell = cell.iso
                                    const isPast = inMonth && cell.date < todayStart
                                    const isToday = inMonth && isSameDay(cell.date, todayStart)
                                    const isSelected = inMonth && isoCell === date
                                    const cellDayKey = DAY_KEYS[cell.date.getDay()]
                                    const doctorWorks = availability.days.includes(cellDayKey)

                                    const clickable = inMonth && !isPast && (!availability.configured || doctorWorks)

                                    return (
                                        <button
                                            key={`${isoCell}-${idx}`}
                                            type="button"
                                            disabled={!clickable}
                                            title={
                                                !inMonth
                                                    ? undefined
                                                    : isPast
                                                        ? "Data passada"
                                                        : availability.configured && !doctorWorks
                                                            ? `${doctor?.name ?? "O médico"} não atende ${DAY_LABELS[cellDayKey]}`
                                                            : "Disponível"
                                            }
                                            onClick={() => {
                                                if (!clickable) return
                                                setDate(isoCell)
                                                setJumpDateInput(isoCell)
                                            }}
                                            className={[
                                                "relative aspect-square w-full rounded-2xl flex items-center justify-center text-sm md:text-[15px] font-bold transition-all select-none",
                                                inMonth ? "" : "opacity-0 pointer-events-none",
                                                !clickable
                                                    ? availability.configured && !doctorWorks && !isPast
                                                        ? "bg-neutral-100/70 text-neutral-300 cursor-not-allowed dark:bg-neutral-800/60 dark:text-neutral-600"
                                                        : "text-neutral-300 cursor-not-allowed line-through dark:text-neutral-600"
                                                    : isSelected
                                                        ? "bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 text-white shadow-[0_10px_22px_-8px_rgba(16,142,93,0.55)] ring-2 ring-brand-600/30 scale-[1.04]"
                                                        : isToday
                                                            ? "bg-brand-50 text-brand-800 ring-2 ring-brand-600/30 hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-200 dark:ring-brand-500/30 dark:hover:bg-brand-500/20"
                                                            : doctorWorks
                                                                ? "text-neutral-800 bg-brand-50/40 hover:bg-neutral-100 dark:text-neutral-100 dark:bg-brand-500/10 dark:hover:bg-neutral-800"
                                                                : "text-neutral-800 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800",
                                            ].join(" ")}
                                        >
                                            {cell.day}
                                            {isToday && isSelected && (
                                                <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-white/90" />
                                            )}
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Legenda de disponibilidade do médico */}
                            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 text-[12.5px]">
                                {availability.configured ? (
                                    <p className="text-neutral-600 dark:text-neutral-400">
                                        <span className="font-bold text-brand-800 dark:text-brand-200">
                                            {DAY_LABELS[dayKey] ?? dayKey} selecionado.
                                        </span>{" "}
                                        Dias de atendimento de {doctor?.name ?? "médico"}:{" "}
                                        <span className="font-semibold text-neutral-800 dark:text-neutral-100">{dayLabel || "—"}</span>
                                    </p>
                                ) : (
                                    <p className="text-amber-700 dark:text-amber-300">
                                        Sem disponibilidade cadastrada — qualquer dia e horário podem ser escolhidos.
                                        Defina a grade em{" "}
                                        <Link href="/dashboard/medicos" className="font-semibold underline">
                                            Médicos
                                        </Link>
                                        .
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Horário + Duração */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2 dark:text-neutral-200">Horário</label>
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400">
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
                                </div>
                                {availability.configured && !timeFitsAvailability && (
                                    <p className="mt-2 text-[12.5px] font-semibold text-rose-600 dark:text-rose-400">
                                        Fora da disponibilidade. Atendimento: {windowLabel}.
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2 dark:text-neutral-200">Duração Estimada</label>
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400">
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
                                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Sugestões de horários */}
                        <div>
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                                <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                                    Horários Disponíveis ({formatShortPt(selectedDate)})
                                </p>
                                <span className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                                    {duration} · {windowLabel}
                                </span>
                            </div>
                            {availableSlots.length ? (
                                <div className="flex flex-wrap items-center gap-2.5">
                                    {availableSlots.map((t) => {
                                        const active = time === t
                                        return (
                                            <button
                                                key={t}
                                                type="button"
                                                onClick={() => setTime(t)}
                                                className={`px-4 py-2 rounded-xl text-sm font-bold tabular-nums transition-all ${active
                                                    ? "bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 text-white shadow-[0_8px_18px_-6px_rgba(16,142,93,0.55)] ring-2 ring-brand-600/20"
                                                    : "bg-neutral-200/70 hover:bg-neutral-300/70 text-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200"
                                                    }`}
                                            >
                                                {t}
                                            </button>
                                        )
                                    })}
                                </div>
                            ) : (
                                <p className="rounded-2xl bg-amber-50 ring-1 ring-amber-500/20 px-4 py-3 text-[13px] font-semibold text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
                                    Nenhum horário comporta {duration} dentro da disponibilidade deste médico.
                                    Reduza a duração ou escolha outro profissional.
                                </p>
                            )}
                        </div>
                    </section>

                    {/* Bloco 3: Motivo da Consulta & Observações */}
                    <section className="rounded-3xl border border-neutral-200/70 bg-white p-5 md:p-7 shadow-[0_4px_24px_-14px_rgba(15,23,42,0.12)] dark:border-neutral-800/80 dark:bg-neutral-900">
                        <header className="flex items-center gap-2.5 mb-5">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-600/10 dark:bg-brand-500/10 dark:text-brand-300">
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="8" y1="13" x2="16" y2="13" />
                                    <line x1="8" y1="17" x2="14" y2="17" />
                                </svg>
                            </span>
                            <h2 className="text-lg md:text-xl font-serif font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                                Motivo da Consulta & Observações
                            </h2>
                        </header>

                        <textarea
                            value={observations}
                            onChange={(e) => setObservations(e.target.value)}
                            rows={7}
                            placeholder="Descreva os sintomas iniciais ou motivo do agendamento..."
                            className="w-full rounded-2xl border-2 border-neutral-200/80 bg-neutral-50/40 focus:bg-white p-4 md:p-5 text-[14.5px] leading-relaxed placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400/60 transition resize-none dark:border-neutral-800/80 dark:bg-neutral-900/40 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:bg-neutral-900"
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
                    <aside className="rounded-3xl bg-white border border-neutral-200/70 shadow-[0_10px_30px_-14px_rgba(15,23,42,0.18)] overflow-hidden dark:border-neutral-800/80 dark:bg-neutral-900">
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
                            <div className="rounded-2xl bg-neutral-100/70 p-4 flex items-start gap-3.5 dark:bg-neutral-800/60">
                                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700 ring-1 ring-neutral-200/80 shadow-sm dark:bg-neutral-900 dark:text-brand-300 dark:ring-neutral-800/80">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <rect x="3" y="5" width="18" height="16" rx="2" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                        <line x1="8" y1="3" x2="8" y2="7" />
                                        <line x1="16" y1="3" x2="16" y2="7" />
                                    </svg>
                                </span>
                                <div className="min-w-0">
                                    <p className="text-[11.5px] font-black uppercase tracking-[0.16em] text-neutral-500 mb-1 dark:text-neutral-400">
                                        Data e Hora
                                    </p>
                                    <p className="text-base md:text-lg font-bold text-neutral-900 leading-tight dark:text-neutral-100">
                                        {formattedDate}
                                    </p>
                                    <p className="mt-0.5 text-sm font-semibold text-brand-700 dark:text-brand-300">
                                        {formattedTime} <span className="text-neutral-500 font-medium dark:text-neutral-400">({duration})</span>
                                    </p>
                                </div>
                            </div>

                            {/* Rows informação */}
                            <dl className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                <InfoRow label="Paciente:" value={patient?.name ?? "—"} bold />
                                <InfoRow label="Convênio:" value={patient?.insurance ?? "—"} />
                                <InfoRow label="Especialidade:" value={doctor?.specialty ?? "—"} />
                                <InfoRow label="Médico:" value={doctor?.name ?? "—"} />
                            </dl>

                            {/* Caixa informativa */}
                            {availability.configured && (!dayIsAvailable || !timeFitsAvailability) ? (
                                <div className="rounded-2xl bg-amber-50 ring-1 ring-amber-500/20 p-4 dark:bg-amber-500/10">
                                    <div className="flex items-start gap-3">
                                        <span className="mt-0.5 shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-600 text-white">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                <path d="M12 9v4" />
                                                <path d="M12 17h.01" />
                                                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                            </svg>
                                        </span>
                                        <p className="text-[13px] leading-relaxed text-amber-900 dark:text-amber-200">
                                            {doctor?.name ?? "Este médico"} atende{" "}
                                            <span className="font-bold">{dayLabel || "—"}</span>, das{" "}
                                            <span className="font-bold">{windowLabel}</span>. Escolha um dia e um
                                            horário dentro dessa grade.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-2xl bg-brand-50/80 ring-1 ring-brand-600/10 p-4 dark:bg-brand-500/10">
                                    <div className="flex items-start gap-3">
                                        <span className="mt-0.5 shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-700 text-white">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                <circle cx="12" cy="12" r="10" />
                                                <line x1="12" y1="16" x2="12" y2="12" />
                                                <line x1="12" y1="8" x2="12.01" y2="8" />
                                            </svg>
                                        </span>
                                        <p className="text-[13px] leading-relaxed text-neutral-700 dark:text-neutral-200">
                                            {availability.configured
                                                ? `Horário dentro da grade de ${doctorName} (${dayLabel}, ${windowLabel}). Ao confirmar, o paciente receberá um e-mail de confirmação automaticamente.`
                                                : `${doctorName} ainda não cadastrou uma grade de atendimento, então o horário é livre. Ao confirmar, o paciente receberá um e-mail de confirmação automaticamente.`}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Botões rodapé resumo */}
                            <div className="pt-2 space-y-3">
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={submitting || loadingOptions || !patientId || !doctorId}
                                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 px-6 py-4 text-[15px] font-bold text-white shadow-[0_12px_28px_rgba(16,142,93,0.35)] hover:brightness-[1.03] active:brightness-100 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {submitting ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            Salvando...
                                        </>
                                    ) : (
                                        <>
                                            Confirmar Agendamento
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                <circle cx="12" cy="12" r="10" />
                                                <polyline points="22 4 12 14.01 9 11.01" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                                <Link
                                    href="/dashboard/agendamento"
                                    className="w-full inline-flex items-center justify-center py-2.5 text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors dark:text-neutral-400 dark:hover:text-neutral-100"
                                >
                                    Cancelar e Voltar
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* Card médico selecionado (disponível) */}
                    <aside className="rounded-3xl border-2 border-neutral-200/80 bg-white p-4 md:p-5 shadow-[0_4px_20px_-14px_rgba(15,23,42,0.12)] dark:border-neutral-800/80 dark:bg-neutral-900">
                        <div className="flex items-center gap-3.5">
                            <div className="relative shrink-0">
                                <div className="h-14 w-14 md:h-16 md:w-16 rounded-2xl bg-gradient-to-br from-slate-500 via-slate-700 to-slate-900 text-white flex items-center justify-center ring-2 ring-white shadow overflow-hidden dark:ring-neutral-800">
                                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="opacity-90 mt-2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                    <span className="absolute inset-x-0 bottom-1 text-center text-lg md:text-xl font-black tracking-wide drop-shadow">
                                        {doctor?.name
                                            ? doctor.name
                                                .replace(/^Dr[a]?\.\s*/i, "")
                                                .split(/\s+/)
                                                .filter(Boolean)
                                                .slice(0, 2)
                                                .map((n) => n[0]?.toUpperCase())
                                                .join("")
                                                .slice(0, 2) || "??"
                                            : "??"}
                                    </span>
                                </div>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[15px] md:text-base font-bold text-neutral-900 truncate dark:text-neutral-100">
                                    {doctor?.name || "Selecione um médico"}
                                </p>
                                <p className="text-[12px] text-neutral-500 mt-0.5 font-semibold dark:text-neutral-400">
                                    CRM: {doctor?.crm || "—"}
                                </p>
                                <span className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10.5px] font-black uppercase tracking-[0.16em] ring-1 ring-emerald-700/10 dark:bg-emerald-500/10 dark:text-emerald-300">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 shadow-[0_0_0_3px_rgba(16,185,129,0.18)] animate-pulse" />
                                    {doctor?.specialty || "Selecione"}
                                </span>
                            </div>
                        </div>

                        {/* Disponibilidade cadastrada do médico */}
                        <div className="mt-4 rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-3.5 dark:border-neutral-800/80 dark:bg-neutral-900/60">
                            <p className="text-[10.5px] font-black uppercase tracking-[0.16em] text-neutral-500 mb-2 dark:text-neutral-400">
                                Disponibilidade
                            </p>
                            {availability.configured ? (
                                <div className="space-y-1.5">
                                    <div className="flex items-start gap-2">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-0.5 shrink-0 text-brand-700">
                                            <rect x="3" y="4" width="18" height="18" rx="2" />
                                            <line x1="16" y1="2" x2="16" y2="6" />
                                            <line x1="8" y1="2" x2="8" y2="6" />
                                            <line x1="3" y1="10" x2="21" y2="10" />
                                        </svg>
                                        <span className="text-[12.5px] font-semibold text-neutral-800 dark:text-neutral-100">{dayLabel || "—"}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-0.5 shrink-0 text-brand-700">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                        <span className="text-[12.5px] font-semibold text-neutral-800 dark:text-neutral-100">{windowLabel}</span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-[12.5px] font-semibold text-amber-700 dark:text-amber-300">
                                    Sem grade cadastrada — horários livres.
                                </p>
                            )}
                        </div>
                    </aside>
                </div>
            </div>

            {/* Toast de feedback do agendamento */}
            {toast && (
                <div
                    className="fixed top-5 right-5 z-50 w-[min(92vw,380px)]"
                    style={{ animation: "toastSlidein 0.28s ease-out" }}
                    role="status"
                >
                    <div
                        className={`flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-[0_18px_40px_-16px_rgba(15,23,42,0.35)] dark:bg-neutral-900 ${toast.kind === "success" ? "border-brand-600/20" : "border-rose-500/20"
                            }`}
                    >
                        <span
                            className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${toast.kind === "success"
                                ? "bg-gradient-to-br from-brand-600 to-brand-800"
                                : "bg-gradient-to-br from-rose-500 to-rose-700"
                                }`}
                        >
                            {toast.kind === "success" ? (
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            ) : (
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            )}
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                {toast.kind === "success" ? "Sucesso" : "Atenção"}
                            </p>
                            <p className="mt-0.5 text-[13px] leading-relaxed text-neutral-600 dark:text-neutral-400">
                                {toast.message}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setToast(null)}
                            aria-label="Fechar aviso"
                            className="shrink-0 rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Estilos inline: inputCls padronizado */}
            <style jsx global>{`
                @keyframes toastSlidein {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
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
                .dark .inputCls {
                    border-color: rgba(38, 38, 38, 0.9);
                    background-color: rgba(23, 23, 23, 1);
                    color: #f5f5f5;
                }
                .dark .inputCls::placeholder {
                    color: #737373;
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
    disabled,
}: {
    value: string
    onChange: (v: string) => void
    placeholder: string
    options: SelectOption[]
    icon: "person" | "doctor"
    disabled?: boolean
}) {
    return (
        <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400">
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
                disabled={disabled}
                className="inputCls pl-12 pr-10 appearance-none disabled:opacity-60 disabled:cursor-not-allowed"
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
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500">
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
            <dt className="text-sm font-semibold text-neutral-600 shrink-0 dark:text-neutral-400">{label}</dt>
            <dd className={`text-right ${bold ? "font-black text-neutral-900 text-[15px] dark:text-neutral-100" : "font-bold text-neutral-800 dark:text-neutral-200"}`}>
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
                    className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all ${checked ? active : "bg-white border-neutral-300 group-hover:border-neutral-400 dark:bg-neutral-800 dark:border-neutral-600 dark:group-hover:border-neutral-500"
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
            <span className="text-sm font-semibold text-neutral-700 group-hover:text-neutral-900 transition-colors dark:text-neutral-200 dark:group-hover:text-neutral-100">
                {label}
            </span>
        </label>
    )
}

/* ---------- HELPERS DE CALENDÁRIO ---------- */

const MONTHS = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
]
const WEEK_DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]

function pad(n: number): string {
    return n.toString().padStart(2, "0")
}

function toIsoDate(d: Date): string {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function safeParseIso(iso: string): Date {
    if (!iso) {
        const t = new Date()
        t.setHours(0, 0, 0, 0)
        return t
    }
    const [y, m, d] = iso.split("-").map((v) => Number(v))
    if (!y || !m || !d) {
        const t = new Date()
        t.setHours(0, 0, 0, 0)
        return t
    }
    return new Date(y, m - 1, d, 0, 0, 0, 0)
}

function isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function formatLongPt(d: Date): string {
    try {
        return d.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        })
    } catch {
        return `${pad(d.getDate())} de ${MONTHS[d.getMonth()]}, ${d.getFullYear()}`
    }
}

function formatShortPt(d: Date): string {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (isSameDay(d, today)) return "Hoje"
    const tm = new Date(today.getTime() + 86400000)
    if (isSameDay(d, tm)) return "Amanhã"
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "")
}

type CalendarCell = {
    day: number
    date: Date
    iso: string
    inMonth: boolean
}

function buildCalendarGrid(viewMonth: Date): CalendarCell[] {
    const year = viewMonth.getFullYear()
    const month = viewMonth.getMonth()
    const firstOfMonth = new Date(year, month, 1, 0, 0, 0, 0)
    const rawDow = firstOfMonth.getDay() // 0 (dom) ... 6 (sáb)
    const startOffset = (rawDow + 6) % 7 // começa na segunda = 0
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const cells: CalendarCell[] = []

    // dias antes do mês (completar início da grade)
    const prevMonthDays = new Date(year, month, 0).getDate()
    for (let i = startOffset - 1; i >= 0; i--) {
        const day = prevMonthDays - i
        const date = new Date(year, month - 1, day, 0, 0, 0, 0)
        cells.push({ day, date, iso: toIsoDate(date), inMonth: false })
    }

    // dias do mês
    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d, 0, 0, 0, 0)
        cells.push({ day: d, date, iso: toIsoDate(date), inMonth: true })
    }

    // completar fim da grade até 42 células (6 semanas)
    while (cells.length < 42) {
        const last = cells[cells.length - 1].date
        const next = new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1, 0, 0, 0, 0)
        cells.push({
            day: next.getDate(),
            date: next,
            iso: toIsoDate(next),
            inMonth: next.getMonth() === month,
        })
    }

    return cells
}

/* ---------- HELPERS DE DISPONIBILIDADE ---------- */

function timeToMinutes(time: string): number {
    const [h, m] = time.split(":").map((v) => Number(v))
    if (Number.isNaN(h) || Number.isNaN(m)) return NaN
    return h * 60 + m
}

function minutesToTime(total: number): string {
    const clamped = Math.max(0, Math.min(total, 24 * 60))
    return `${pad(Math.floor(clamped / 60))}:${pad(clamped % 60)}`
}

// Monta as janelas de atendimento a partir dos horários cadastrados do médico
function windowsOf(profile?: ApiDoctor["doctorProfile"] | null): Window[] {
    if (!profile) return []
    const windows: Window[] = []

    const morningStart = profile.startMorning
    const morningEnd = profile.endMorning
    if (morningStart && morningEnd && timeToMinutes(morningStart) < timeToMinutes(morningEnd)) {
        windows.push({ start: morningStart, end: morningEnd })
    }

    const afternoonStart = profile.startAfternoon
    const afternoonEnd = profile.endAfternoon
    if (afternoonStart && afternoonEnd && timeToMinutes(afternoonStart) < timeToMinutes(afternoonEnd)) {
        windows.push({ start: afternoonStart, end: afternoonEnd })
    }

    return windows
}

// O horário + duração cabem inteiramente em uma das janelas?
function fitsWindows(time: string, windows: Window[], durationMinutes: number): boolean {
    if (!windows.length) return true
    const start = timeToMinutes(time)
    if (Number.isNaN(start)) return false
    const end = start + durationMinutes
    return windows.some((w) => {
        const ws = timeToMinutes(w.start)
        const we = timeToMinutes(w.end)
        return !Number.isNaN(ws) && !Number.isNaN(we) && start >= ws && end <= we
    })
}

// Gera os horários válidos (passos fixos) que cabem nas janelas informadas
function slotsFor(windows: Window[], durationMinutes: number): string[] {
    const result: string[] = []
    for (const w of windows) {
        const start = timeToMinutes(w.start)
        const end = timeToMinutes(w.end)
        if (Number.isNaN(start) || Number.isNaN(end)) continue
        for (let t = start; t + durationMinutes <= end; t += SLOT_STEP_MINUTES) {
            result.push(minutesToTime(t))
        }
    }
    return Array.from(new Set(result)).sort((a, b) => timeToMinutes(a) - timeToMinutes(b))
}

// Próxima data (ISO) cujo dia da semana esteja na grade do médico
function nextAvailableDate(iso: string, days: string[]): string {
    if (!days.length) return iso
    const cursor = safeParseIso(iso)
    for (let i = 0; i < 14; i++) {
        const key = DAY_KEYS[cursor.getDay()]
        if (days.includes(key)) return toIsoDate(cursor)
        cursor.setDate(cursor.getDate() + 1)
    }
    return iso
}

// Primeiro dia do mês da data informada
function monthOf(iso: string): Date {
    const d = safeParseIso(iso)
    return new Date(d.getFullYear(), d.getMonth(), 1)
}

// Slot mais próximo do horário desejado (para quando o horário atual não cabe)
function nearestSlot(time: string, slots: string[]): string {
    if (!slots.length) return time
    const target = timeToMinutes(time)
    if (Number.isNaN(target)) return slots[0]
    return slots.reduce((best, slot) => {
        return Math.abs(timeToMinutes(slot) - target) < Math.abs(timeToMinutes(best) - target) ? slot : best
    }, slots[0])
}
