"use client"

import Link from "next/link"

type PatientDetail = {
    id: string
    name: string
    record: string
    status: "Em Tratamento" | "Ativo" | "Aguardando" | "Inativo"
    insurance: string
    birth: string
    age: number
    documentId: string
    phone: string
    email: string
    avatarGradient: string
    initials: string
}

type HistoryItem = {
    id: string
    date: string
    dayRef: string
    kind: string
    doctor: string
    doctorAvatar: string
    room: string
    observations: string
    status: "Concluído" | "Confirmado" | "Cancelado" | "Em Andamento"
}

const PATIENTS_DB: Record<string, PatientDetail> = {
    "1": {
        id: "1",
        name: "Arnaldo Silveira",
        record: "#88291",
        status: "Em Tratamento",
        insurance: "Unimed Nacional",
        birth: "12 Out 1965",
        age: 60,
        documentId: "123.456.789-10",
        phone: "(11) 99123-4567",
        email: "arnaldo.silveira@mail.com",
        avatarGradient: "from-sky-400 to-blue-600",
        initials: "AS",
    },
    "2": {
        id: "2",
        name: "Beatriz Costa",
        record: "#88304",
        status: "Ativo",
        insurance: "Particular",
        birth: "28 Mar 1992",
        age: 33,
        documentId: "987.654.321-00",
        phone: "(11) 98111-7777",
        email: "beatriz.costa@mail.com",
        avatarGradient: "from-rose-400 to-pink-600",
        initials: "BC",
    },
    "3": {
        id: "3",
        name: "Carlos Eduardo",
        record: "#88312",
        status: "Aguardando",
        insurance: "Bradesco Saúde",
        birth: "03 Jan 2018",
        age: 8,
        documentId: "456.789.012-34",
        phone: "(11) 97777-0001",
        email: "mae.carlos@mail.com",
        avatarGradient: "from-amber-300 to-orange-500",
        initials: "CE",
    },
    "4": {
        id: "4",
        name: "Daniel Oliveira",
        record: "#88315",
        status: "Ativo",
        insurance: "SulAmérica",
        birth: "05 Fev 1974",
        age: 52,
        documentId: "111.222.333-44",
        phone: "(11) 96000-4400",
        email: "daniel.oliveira@mail.com",
        avatarGradient: "from-violet-400 to-purple-600",
        initials: "DO",
    },
    "5": {
        id: "5",
        name: "Elisa Mendes",
        record: "#88320",
        status: "Inativo",
        insurance: "Particular",
        birth: "15 Jul 1950",
        age: 76,
        documentId: "222.333.444-55",
        phone: "(11) 95222-9000",
        email: "elisa.mendes@mail.com",
        avatarGradient: "from-teal-400 to-emerald-600",
        initials: "EM",
    },
}

const HISTORY: HistoryItem[] = [
    {
        id: "h1",
        date: "2026-08-05",
        dayRef: "05 Ago, Qua · 14:30",
        kind: "Consulta de Retorno · Clínica Geral",
        doctor: "Dr. Ricardo Mendes",
        doctorAvatar: "from-amber-300 to-orange-500",
        room: "Sala 03",
        observations:
            "Paciente retornou com queixa de dor torácica intermitente. Solicitado ECG de repouso e Holter 24h. Mantida medicação atual com ajuste de dosagem. Retorno em 30 dias.",
        status: "Concluído",
    },
    {
        id: "h2",
        date: "2026-07-21",
        dayRef: "21 Jul, Ter · 09:00",
        kind: "Check-up Anual",
        doctor: "Dra. Julia Ramos",
        doctorAvatar: "from-violet-400 to-purple-600",
        room: "Sala 01",
        observations:
            "Exames físicos e laboratoriais dentro da normalidade. Glicemia 92 mg/dL, colesterol total 187. Aconselhamento nutricional e atividade física regular.",
        status: "Concluído",
    },
    {
        id: "h3",
        date: "2026-07-10",
        dayRef: "10 Jul, Sex · 16:00",
        kind: "Sessão de Fisioterapia",
        doctor: "Dra. Helena Souza",
        doctorAvatar: "from-teal-400 to-emerald-600",
        room: "Fisio 02",
        observations:
            "Terapia manual na coluna lombar, exercícios de fortalecimento do CORE e liberação miofascial. Melhora da dor de 6/10 para 3/10.",
        status: "Concluído",
    },
    {
        id: "h4",
        date: "2026-06-28",
        dayRef: "28 Jun, Dom · 11:15",
        kind: "Atendimento de Urgência",
        doctor: "Dr. Arnaldo Souza",
        doctorAvatar: "from-sky-400 to-blue-600",
        room: "Sala Vermelha",
        observations:
            "Cefaleia intensa com início há 4h associada a náuseas e fotofobia. Sem sinais de alarme neurológico. Tratado como crise de enxaqueca. Liberado com retorno se evolução desfavorável.",
        status: "Cancelado",
    },
    {
        id: "h5",
        date: "2026-06-14",
        dayRef: "14 Jun, Sex · 08:00",
        kind: "Consulta de Avaliação Cardiológica",
        doctor: "Dra. Beatriz Costa",
        doctorAvatar: "from-fuchsia-400 to-rose-500",
        room: "Cardio 01",
        observations:
            "ECG sinusal, sem alterações isquêmicas. Ecocardiograma normal. PA média 128/82. Prescrito controle ambulatorial trimestral.",
        status: "Confirmado",
    },
    {
        id: "h6",
        date: "2026-05-23",
        dayRef: "23 Mai, Sáb · 10:45",
        kind: "Retorno Neurológico",
        doctor: "Dr. Marcos Vinícius",
        doctorAvatar: "from-slate-400 to-slate-700",
        room: "Neuro 02",
        observations:
            "Paciente sem queixas cefálicas há 45 dias. Exame neurológico normal. Suspensão gradual de medicamento preventivo. Retorno em 90 dias.",
        status: "Concluído",
    },
]

export default function PatientHistoryPage({ id }: { id: string }) {
    const patient = PATIENTS_DB[id] ?? PATIENTS_DB["1"]
    const totalAppointments = HISTORY.length
    const completed = HISTORY.filter((h) => h.status === "Concluído").length
    const returnRate = 94 // %
    const nextAppointment = HISTORY[4] // Confirmado

    return (
        <div className="space-y-6 md:space-y-8 pb-10">
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
                        placeholder="Buscar prontuário, exames ou atendimentos..."
                        className="w-full rounded-full border border-neutral-200/80 bg-white/90 py-3 pl-11 pr-4 text-sm placeholder:text-neutral-400 shadow-[0_2px_10px_rgba(15,23,42,0.05)] focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400/60 transition"
                    />
                </div>
            </div>

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/dashboard/pacientes" className="hover:text-neutral-800 transition-colors">
                    Pacientes
                </Link>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-300" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
                <Link href={`/dashboard/pacientes/${id}`} className="hover:text-neutral-800 transition-colors">
                    {patient.name}
                </Link>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-300" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
                <span className="font-semibold text-brand-700">Histórico Clínico</span>
            </nav>

            {/* Header perfil paciente */}
            <section className="rounded-3xl border border-neutral-200/70 bg-white p-5 md:p-7 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.25)] overflow-hidden relative">
                <div aria-hidden="true" className="absolute -top-24 -right-10 h-72 w-72 rounded-full bg-brand-600/5 blur-3xl" />
                <div className="flex flex-col lg:flex-row items-start gap-6 md:gap-8 relative">
                    {/* Avatar grande */}
                    <div className="relative shrink-0">
                        <div className={`h-28 w-28 md:h-36 md:w-36 rounded-3xl bg-gradient-to-br ${patient.avatarGradient} text-white flex flex-col items-center justify-center shadow-[0_18px_40px_-14px_rgba(15,23,42,0.3)] ring-2 ring-white overflow-hidden`}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-6 opacity-80">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            <span className="relative mt-2 text-4xl md:text-5xl font-black tracking-wider drop-shadow-[0_1px_0_rgba(0,0,0,0.2)]">
                                {patient.initials}
                            </span>
                        </div>
                        <StatusBadgePill status={patient.status} floating />
                    </div>

                    {/* Dados */}
                    <div className="flex-1 min-w-0 w-full">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 w-full">
                            <div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className="text-3xl md:text-5xl font-serif font-semibold tracking-tight text-neutral-900">
                                        {patient.name}
                                    </h1>
                                    <StatusBadge status={patient.status} />
                                </div>
                                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-neutral-600">
                                    <BadgePill
                                        icon="note"
                                        label="Prontuário"
                                        value={patient.record}
                                        valueClass="font-bold text-brand-700"
                                    />
                                    <BadgePill
                                        icon="insurance"
                                        label="Convênio"
                                        value={patient.insurance}
                                    />
                                    <BadgePill
                                        icon="cake"
                                        label={`Nascimento · ${patient.age} anos`}
                                        value={patient.birth}
                                    />
                                </div>

                                <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                                    <InfoChip icon="document" label="CPF / ID" value={patient.documentId} />
                                    <InfoChip icon="phone" label="Contato" value={patient.phone} />
                                    <InfoChip icon="email" label="E-mail" value={patient.email} />
                                </div>
                            </div>

                            <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto shrink-0">
                                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-brand-700 px-4 md:px-5 py-2.5 md:py-3 text-[14px] font-bold text-brand-700 hover:bg-brand-700 hover:text-white hover:shadow-[0_10px_22px_-6px_rgba(16,142,93,0.35)] transition-all"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <path d="M12 20h9" />
                                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                        </svg>
                                        Editar Dados
                                    </button>
                                    <Link
                                        href="/dashboard/agendamento"
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 px-4 md:px-5 py-2.5 md:py-3 text-[14px] font-bold text-white shadow-[0_10px_22px_-6px_rgba(16,142,93,0.35)] hover:brightness-[1.04] transition-all"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <line x1="12" y1="5" x2="12" y2="19" />
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                        </svg>
                                        Nova Consulta
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Grid stats + timeline */}
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-5 md:gap-6">
                {/* Cards estatísticas + próximas */}
                <div className="space-y-5 md:space-y-6">
                    {/* Stats grid */}
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <MiniCard
                            icon="stethoscope"
                            label="Total de Atendimentos"
                            value={String(totalAppointments)}
                            accent="from-brand-500 to-brand-700"
                        />
                        <MiniCard
                            icon="check"
                            label="Consultas Concluídas"
                            value={String(completed)}
                            accent="from-emerald-500 to-green-700"
                        />
                        <MiniCard
                            icon="trending"
                            label="Taxa de Retorno"
                            value={`${returnRate}%`}
                            accent="from-sky-500 to-indigo-600"
                            suffix={<BadgeSmallTrend />}
                        />
                        <MiniCard
                            icon="calendar"
                            label="Próxima Consulta"
                            value={nextAppointment.dayRef.split(",")[0].trim()}
                            accent="from-fuchsia-500 to-rose-600"
                            hint={nextAppointment.kind.split(" · ")[0]}
                        />
                    </div>

                    {/* Próximas consultas */}
                    <section className="rounded-3xl border border-neutral-200/70 bg-white p-5 md:p-6 shadow-[0_4px_24px_-14px_rgba(15,23,42,0.12)]">
                        <header className="flex items-center justify-between gap-3 mb-4">
                            <div className="flex items-center gap-2.5">
                                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10">
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                </span>
                                <h3 className="text-lg md:text-xl font-serif font-semibold tracking-tight text-neutral-900">
                                    Próximas Consultas
                                </h3>
                            </div>
                            <Link
                                href="/dashboard/agendamento"
                                className="text-sm font-bold text-brand-700 hover:text-brand-800 transition-colors"
                            >
                                Ver tudo
                            </Link>
                        </header>
                        <div className="space-y-3">
                            {HISTORY.filter((h) => h.status === "Confirmado")
                                .slice(0, 2)
                                .map((h) => (
                                    <UpcomingRow key={h.id} item={h} />
                                ))}
                        </div>
                    </section>

                    {/* Documentos Anexados */}
                    <section className="rounded-3xl border-2 border-dashed border-neutral-300/90 bg-white/40 p-5 md:p-6">
                        <header className="flex items-center justify-between gap-3 mb-4">
                            <div className="flex items-center gap-2.5">
                                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-700 text-white ring-1 ring-brand-700/50">
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                    </svg>
                                </span>
                                <h3 className="text-lg md:text-xl font-serif font-semibold tracking-tight text-neutral-900">
                                    Documentos e Exames
                                </h3>
                            </div>
                            <button
                                type="button"
                                className="text-xs font-bold text-brand-700 hover:text-brand-800"
                            >
                                Upload +
                            </button>
                        </header>
                        <p className="text-sm text-neutral-600 leading-relaxed max-w-md mb-4">
                            Arraste arquivos aqui para anexar laudos, radiografias ou históricos externos.
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <ThumbDoc label="Sangue.pdf" kind="LAB" date="05 Ago" />
                            <ThumbDoc label="Torax.png" kind="IMG" date="21 Jul" image />
                            <AddDoc />
                        </div>
                    </section>
                </div>

                {/* Timeline Histórico */}
                <section className="rounded-3xl border border-neutral-200/70 bg-white p-5 md:p-7 shadow-[0_4px_24px_-14px_rgba(15,23,42,0.12)]">
                    <header className="flex items-center justify-between gap-3 mb-6">
                        <div className="flex items-center gap-2.5">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-600/10">
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="16" x2="12" y2="12" />
                                    <line x1="12" y1="8" x2="12.01" y2="8" />
                                </svg>
                            </span>
                            <div>
                                <h2 className="text-lg md:text-xl font-serif font-semibold tracking-tight text-neutral-900">
                                    Linha do Tempo Clínica
                                </h2>
                                <p className="text-sm text-neutral-500 mt-0.5">
                                    {HISTORY.length} atendimentos registrados
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700 text-xs font-bold transition-colors"
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                            </svg>
                            Filtrar
                        </button>
                    </header>

                    <Timeline items={HISTORY} />
                </section>
            </div>

            {/* Rodapé ações */}
            <div className="h-px w-full bg-neutral-200/70" />
            <footer className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
                <Link
                    href="/dashboard/pacientes"
                    className="inline-flex items-center justify-center sm:justify-start text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors px-3 py-2.5 -mx-3"
                >
                    ← Voltar para listagem de pacientes
                </Link>
                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-neutral-200 px-5 py-3.5 text-[14px] font-bold text-neutral-600 hover:bg-neutral-50 transition-colors"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Exportar Prontuário PDF
                    </button>
                    <Link
                        href="/dashboard/agendamento"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 px-7 py-3.5 text-[15px] font-bold text-white shadow-[0_12px_28px_rgba(16,142,93,0.32)] hover:brightness-[1.04] active:brightness-100 transition-all"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <rect x="3" y="5" width="18" height="16" rx="2" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                            <line x1="8" y1="3" x2="8" y2="7" />
                            <line x1="16" y1="3" x2="16" y2="7" />
                        </svg>
                        Agendar Nova Consulta
                    </Link>
                </div>
            </footer>
        </div>
    )
}

/* ---------- COMPONENTES ---------- */

function StatusBadge({ status }: { status: PatientDetail["status"] }) {
    const [cls, label] = statusStyles(status)
    return (
        <span className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-[11px] md:text-xs font-extrabold tracking-[0.14em] uppercase ring-1 ${cls}`}>
            {label}
        </span>
    )
}

function StatusBadgePill({ status, floating }: { status: PatientDetail["status"]; floating?: boolean }) {
    const [cls] = statusStyles(status)
    const dot = cls.split(" ")[2].split("ring-")[0] + "-700/30"
    return (
        <span className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9.5px] font-extrabold tracking-[0.14em] uppercase ring-2 ring-white shadow-lg whitespace-nowrap ${cls} ${floating ? dot : ""}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-75" />
            {status}
        </span>
    )
}

function statusStyles(s: PatientDetail["status"]) {
    switch (s) {
        case "Em Tratamento":
            return ["bg-neutral-100 text-neutral-700 ring-neutral-200", "Em Tratamento"]
        case "Ativo":
            return ["bg-green-100 text-green-700 ring-green-700/15", "Ativo"]
        case "Aguardando":
            return ["bg-neutral-200 text-neutral-700 ring-neutral-300", "Aguardando"]
        case "Inativo":
            return ["bg-red-100 text-red-700 ring-red-700/15", "Inativo"]
    }
}

function BadgePill({
    icon,
    label,
    value,
    valueClass,
}: {
    icon: "note" | "insurance" | "cake"
    label: string
    value: string
    valueClass?: string
}) {
    return (
        <span className="inline-flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
                {icon === "note" && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                    </svg>
                )}
                {icon === "insurance" && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                )}
                {icon === "cake" && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
                        <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
                        <line x1="2" y1="21" x2="22" y2="21" />
                        <path d="M7 8v3M12 8v3M17 8v3" />
                    </svg>
                )}
            </span>
            <span className="text-xs text-neutral-500 font-semibold">{label}:</span>
            <span className={`text-sm font-semibold text-neutral-900 ${valueClass ?? ""}`}>{value}</span>
        </span>
    )
}

function InfoChip({ icon, label, value }: { icon: "document" | "phone" | "email"; label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/70 px-3.5 py-3">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500 mb-1.5">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-white ring-1 ring-neutral-200/90 text-neutral-500">
                    {icon === "document" && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <line x1="8" y1="10" x2="16" y2="10" />
                            <line x1="8" y1="14" x2="13" y2="14" />
                        </svg>
                    )}
                    {icon === "phone" && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                    )}
                    {icon === "email" && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                        </svg>
                    )}
                </span>
                <span className="text-[13.5px] font-semibold text-neutral-900 truncate block">{value}</span>
                <span className="block text-xs text-neutral-500 font-medium">{label}</span>
            </div>
        </div>
    )
}

function MiniCard({
    icon,
    label,
    value,
    accent,
    hint,
    suffix,
}: {
    icon: "stethoscope" | "check" | "trending" | "calendar"
    label: string
    value: string
    accent: string
    hint?: string
    suffix?: React.ReactNode
}) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-3.5 md:p-4 shadow-[0_4px_20px_-16px_rgba(15,23,42,0.15)]">
            <div className="flex items-start justify-between mb-3">
                <span className={`relative inline-flex h-8 w-8 items-center justify-center rounded-xl text-white bg-gradient-to-br ${accent} shadow-sm`}>
                    {icon === "stethoscope" && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
                            <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
                            <circle cx="20" cy="10" r="2" />
                        </svg>
                    )}
                    {icon === "check" && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    )}
                    {icon === "trending" && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                            <polyline points="17 6 23 6 23 12" />
                        </svg>
                    )}
                    {icon === "calendar" && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <rect x="3" y="5" width="18" height="16" rx="2" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                            <line x1="8" y1="3" x2="8" y2="7" />
                            <line x1="16" y1="3" x2="16" y2="7" />
                        </svg>
                    )}
                </span>
                {suffix}
            </div>
            <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">{label}</p>
            <p className="mt-1 text-2xl md:text-3xl font-black text-neutral-900 tracking-tight leading-none">{value}</p>
            {hint && <p className="mt-1 text-[11.5px] text-neutral-500 truncate">{hint}</p>}
        </div>
    )
}

function BadgeSmallTrend() {
    return (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-black tracking-wide">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="17 11 12 6 7 11" />
                <line x1="12" y1="18" x2="12" y2="6" />
            </svg>
            5%
        </span>
    )
}

function UpcomingRow({ item }: { item: HistoryItem }) {
    return (
        <div className="flex items-start gap-3 p-3 rounded-2xl hover:bg-neutral-50 transition-colors">
            <div className={`h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br ${item.doctorAvatar} text-white flex items-center justify-center text-[11px] font-bold ring-2 ring-white shadow-sm`}>
                {item.doctor.split(" ").slice(-1).map((p) => p[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-sm font-bold text-neutral-900 truncate">{item.doctor}</p>
                        <p className="text-xs text-neutral-500 mt-0.5 truncate">{item.kind}</p>
                    </div>
                    <span className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-black tracking-wide ring-1 ring-green-700/10">
                        {item.status.toUpperCase()}
                    </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-600">
                    <span className="inline-flex items-center gap-1">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-neutral-400">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {item.dayRef.split("·")[0].trim()}
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-neutral-400">
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {item.room}
                    </span>
                </div>
            </div>
        </div>
    )
}

function ThumbDoc({ label, kind, date, image }: { label: string; kind: "LAB" | "IMG"; date: string; image?: boolean }) {
    return (
        <div className="aspect-[3/4] relative rounded-2xl bg-white border border-neutral-200/80 shadow-[0_4px_14px_-12px_rgba(15,23,42,0.2)] overflow-hidden group hover:-translate-y-0.5 transition-transform">
            <div className={`absolute inset-0 flex items-center justify-center ${image ? "bg-gradient-to-br from-slate-200 via-neutral-100 to-slate-300" : "bg-gradient-to-br from-emerald-50 via-white to-brand-50"}`}>
                {image ? (
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="rgba(15,23,42,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                    </svg>
                ) : (
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="rgba(16,142,93,0.6)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                )}
            </div>
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/55 text-white text-[9.5px] font-black tracking-wider backdrop-blur-sm">
                {kind}
            </div>
            <button
                type="button"
                aria-label="Baixar documento"
                className="absolute top-2 right-2 h-6 w-6 rounded-full bg-white/90 hover:bg-white text-neutral-700 inline-flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
            >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
            </button>
            <div className="absolute inset-x-0 bottom-0 px-2.5 py-2 bg-gradient-to-t from-black/65 via-black/10 to-transparent">
                <p className="truncate text-[11.5px] font-semibold text-white leading-tight">{label}</p>
                <p className="text-[10px] text-white/75 mt-0.5">{date}</p>
            </div>
        </div>
    )
}

function AddDoc() {
    return (
        <button
            type="button"
            className="aspect-[3/4] rounded-2xl border-2 border-dashed border-neutral-300/90 hover:border-brand-400/70 hover:bg-brand-50/50 transition-colors p-3 flex flex-col items-center justify-center gap-1.5 text-neutral-500 hover:text-brand-700"
        >
            <span className="relative inline-flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-xl bg-white ring-1 ring-neutral-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </span>
            <span className="text-[11px] md:text-xs font-bold text-center">Anexar novo</span>
        </button>
    )
}

/* ---------- TIMELINE ---------- */

function Timeline({ items }: { items: HistoryItem[] }) {
    return (
        <ol className="relative border-l-2 border-neutral-200/80 ml-2">
            {items.map((it, idx) => {
                const isLast = idx === items.length - 1
                return (
                    <li key={it.id} className={`relative pl-6 ${isLast ? "" : "pb-6"}`}>
                        <span className={`absolute -left-[11px] top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-white ${it.status === "Cancelado"
                                ? "bg-red-500"
                                : it.status === "Em Andamento"
                                    ? "bg-brand-500 animate-pulse"
                                    : it.status === "Confirmado"
                                        ? "bg-amber-400"
                                        : "bg-brand-600"
                            } shadow`}>
                            <span className="sr-only">{it.status}</span>
                        </span>

                        <div className="rounded-2xl border border-neutral-200/70 bg-neutral-50/60 hover:bg-white hover:shadow-[0_10px_26px_-16px_rgba(15,23,42,0.15)] transition-all p-3.5 md:p-4">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-2.5">
                                <span className="text-[11.5px] font-black uppercase tracking-[0.16em] text-neutral-500 flex items-center gap-1">
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    {it.dayRef}
                                </span>
                                <span className="h-1 w-1 rounded-full bg-neutral-300" />
                                <span className="text-[11.5px] font-bold text-neutral-600">{it.room}</span>
                                <span className={`ml-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-black tracking-wide ring-1 ${timelineStatusStyle(it.status)}`}>
                                    {it.status.toUpperCase()}
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
                                <div>
                                    <h4 className="text-sm md:text-[15px] font-bold text-neutral-900">
                                        {it.kind}
                                    </h4>
                                    <div className="mt-1.5 inline-flex items-center gap-2">
                                        <span className={`h-7 w-7 rounded-xl bg-gradient-to-br ${it.doctorAvatar} text-white text-[10.5px] font-bold flex items-center justify-center shadow-sm ring-2 ring-white shrink-0`}>
                                            {it.doctor.split(" ").slice(-1).map((p) => p[0]).join("")}
                                        </span>
                                        <span className="text-sm text-neutral-700 font-medium">{it.doctor}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 sm:justify-end text-[11.5px] text-neutral-500">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                    </svg>
                                    <span className="font-semibold text-neutral-600">Anotações clínicas</span>
                                </div>
                            </div>

                            <p className="text-[13.5px] leading-relaxed text-neutral-700 bg-white rounded-xl p-3 md:p-3.5 ring-1 ring-neutral-200/70">
                                {it.observations}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white ring-1 ring-neutral-200 hover:ring-brand-300 hover:text-brand-700 text-neutral-600 text-xs font-bold transition-colors"
                                >
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                    </svg>
                                    Ver anexos
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 ring-1 ring-brand-600/10 hover:ring-brand-500 text-brand-700 text-xs font-bold transition-colors"
                                >
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M12 20h9" />
                                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                    </svg>
                                    Editar observações
                                </button>
                            </div>
                        </div>
                    </li>
                )
            })}
        </ol>
    )
}

function timelineStatusStyle(s: HistoryItem["status"]) {
    switch (s) {
        case "Concluído":
            return "bg-green-100 text-green-700 ring-green-700/15"
        case "Confirmado":
            return "bg-amber-100 text-amber-700 ring-amber-600/15"
        case "Cancelado":
            return "bg-red-100 text-red-700 ring-red-700/15"
        case "Em Andamento":
            return "bg-brand-50 text-brand-700 ring-brand-600/15"
    }
}
