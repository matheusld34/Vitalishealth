"use client"

import Link from "next/link"

export default function DoctorProfilePage({ id }: { id: string }) {
    const doctor = getDoctorById(id)

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
                        placeholder="Search for patients, reports, or data..."
                        className="w-full rounded-full border border-neutral-200/80 bg-white/90 py-3 pl-11 pr-4 text-sm placeholder:text-neutral-400 shadow-[0_2px_10px_rgba(15,23,42,0.05)] focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400/60 transition"
                    />
                </div>
            </div>

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/dashboard/medicos" className="hover:text-neutral-800 transition-colors">
                    Doctors
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
                        {/* Ponto verde disponibilidade */}
                        {doctor.status === "DISPONÍVEL" && (
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
                                            <text x="12" y="16" textAnchor="middle" fill="currentColor" fontSize="6" fontWeight="bold" fontFamily="Arial"></text>
                                        </svg>
                                        <span className="font-semibold text-neutral-800">CRM {doctor.crm}</span>
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="#f59e0b" aria-hidden="true">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                        </svg>
                                        <span className="font-semibold text-neutral-900">{doctor.rating}</span>
                                        <span className="text-neutral-500">({doctor.reviews} reviews)</span>
                                    </span>
                                </div>
                                <p className="mt-2.5 inline-flex items-center gap-2 text-sm text-neutral-600">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-neutral-500">
                                        <rect x="3" y="4" width="18" height="18" rx="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                    <span>
                                        <span className="font-semibold text-neutral-900">{doctor.experience}+ Years Exp.</span>
                                    </span>
                                </p>
                            </div>

                            {/* Botões de ação */}
                            <div className="flex flex-col sm:items-end gap-3 shrink-0 w-full sm:w-auto">
                                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-brand-700 px-4 md:px-5 py-2.5 md:py-3 text-[14px] font-bold text-brand-700 hover:bg-brand-700 hover:text-white hover:shadow-[0_10px_22px_-6px_rgba(16,142,93,0.35)] transition-all"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <path d="M12 20h9" />
                                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                        </svg>
                                        Editar Informações
                                    </button>
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

                        <dl className="space-y-4.5">
                            <InfoRow label="CRM" value={doctor.crm} />
                            <InfoRow label="E-MAIL" value={doctor.email} />
                            <InfoRow label="PHONE" value={doctor.phone} />

                            <div className="pt-1">
                                <dt className="block text-[11px] font-bold tracking-[0.16em] uppercase text-neutral-500 mb-2">
                                    WORKING DAYS
                                </dt>
                                <div className="flex flex-wrap gap-2">
                                    {["S", "T", "W", "T", "F"].map((d, i) => (
                                        <span key={i} className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white text-[12px] font-bold shadow-[0_4px_10px_-2px_rgba(16,142,93,0.3)]">
                                            {d}
                                        </span>
                                    ))}
                                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-neutral-500 text-[12px] font-bold">
                                        S
                                    </span>
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
                            {["Clínica Geral", "Medicina Interna", "Geriatria"].map((s) => (
                                <span key={s} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-brand-50 text-brand-700 text-[13px] font-semibold ring-1 ring-brand-600/10">
                                    {s}
                                    <button type="button" aria-label={`Remover especialidade ${s}`} className="h-4.5 w-4.5 inline-flex items-center justify-center rounded-full bg-brand-600/10 text-brand-700 hover:bg-brand-600 hover:text-white transition-colors">
                                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </button>
                                </span>
                            ))}
                        </div>

                        <button
                            type="button"
                            className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-neutral-100 text-neutral-500 text-sm font-semibold hover:bg-neutral-200 hover:text-neutral-800 transition-colors w-full justify-center"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Adicionar Especialidade...
                        </button>
                    </section>
                </div>

                {/* Coluna 2: Bio + Appointments + RecentActivity */}
                <div className="space-y-5 md:space-y-6">
                    {/* Bio / Descrição com watermark 99 */}
                    <section className="relative rounded-3xl border border-neutral-200/70 bg-white p-5 md:p-7 shadow-[0_4px_24px_-14px_rgba(15,23,42,0.12)] overflow-hidden">
                        <div aria-hidden="true" className="pointer-events-none absolute -top-6 right-3 md:-top-2 md:right-6 select-none text-7xl md:text-[120px] font-black text-brand-700/10 leading-none tracking-tight font-serif">
                            99
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
                            <p>
                                Dr. Arnaldo Souza é graduado pela Faculdade de Medicina da USP, com mais de 12 anos de experiência dedicados ao atendimento humanizado e preventivo. Especialista em Clínica Geral e Medicina Interna, foca sua prática no equilíbrio integral da saúde do paciente, combinando tecnologia diagnóstica avançada com uma abordagem empática.
                            </p>
                            <p>
                                Acredita que o papel do médico vai além do tratamento de doenças, atuando como um parceiro na jornada de bem-estar e longevidade de cada indivíduo atendido no Vitalis Health.
                            </p>
                        </div>
                    </section>

                    {/* Appointments This Month + Recent Activity (2 colunas) */}
                    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-5 md:gap-6">
                        {/* Appointments This Month - verde */}
                        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 text-white p-5 md:p-6 shadow-[0_16px_40px_-8px_rgba(16,142,93,0.45)]">
                            <div aria-hidden="true" className="absolute -right-10 -bottom-12 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
                            <p className="text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/75 relative">
                                APPOINTMENTS THIS MONTH
                            </p>
                            <div className="mt-3 flex items-end justify-between relative">
                                <div>
                                    <p className="text-5xl md:text-6xl font-black tracking-tight">154</p>
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/15 ring-1 ring-white/10 text-[12px] font-bold">
                                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                <polyline points="17 11 12 6 7 11" />
                                                <line x1="12" y1="18" x2="12" y2="6" />
                                            </svg>
                                            12%
                                        </span>
                                        <span className="text-[12.5px] text-white/85">vs last month</span>
                                    </div>
                                </div>
                                <span aria-hidden="true" className="h-20 w-20 md:h-24 md:w-24 rounded-3xl bg-white/10 ring-1 ring-white/10 flex items-center justify-center relative overflow-hidden">
                                    <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-white/90">
                                        <rect x="3" y="5" width="18" height="16" rx="2" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                        <line x1="8" y1="3" x2="8" y2="7" />
                                        <line x1="16" y1="3" x2="16" y2="7" />
                                        <line x1="7" y1="15" x2="8" y2="15" />
                                        <line x1="12" y1="15" x2="13" y2="15" />
                                        <line x1="7" y1="18" x2="8" y2="18" />
                                        <line x1="12" y1="18" x2="13" y2="18" />
                                        <line x1="16.5" y1="15" x2="17.5" y2="15" />
                                        <line x1="16.5" y1="18" x2="17.5" y2="18" />
                                    </svg>
                                </span>
                            </div>
                        </section>

                        {/* Recent Activity */}
                        <section className="rounded-3xl border border-neutral-200/70 bg-white p-5 md:p-6 shadow-[0_4px_24px_-14px_rgba(15,23,42,0.12)]">
                            <p className="text-[11px] md:text-xs font-bold tracking-[0.18em] uppercase text-neutral-500 mb-5">
                                RECENT ACTIVITY
                            </p>

                            <ol className="space-y-4">
                                <ActivityItem
                                    color="bg-brand-600"
                                    title="Updated patient record #4402"
                                    time="2 hours ago"
                                />
                                <ActivityItem
                                    color="bg-slate-700"
                                    title="Finished consultation with Maria Silva"
                                    time="4 hours ago"
                                    bold
                                />
                            </ol>

                            <Link
                                href={`/dashboard/medicos/${id}/atividades`}
                                className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-800 transition-colors"
                            >
                                View full activity log
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </Link>
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
                                <h3 className="text-lg md:text-xl font-serif font-semibold tracking-tight text-neutral-900">
                                    Próximos Atendimentos
                                </h3>
                            </div>
                            <Link
                                href="/dashboard/agendamento"
                                className="text-sm font-bold text-brand-700 hover:text-brand-800 transition-colors shrink-0"
                            >
                                View Schedule
                            </Link>
                        </header>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left border-b border-neutral-100">
                                        <th className="py-3 px-2 text-[11.5px] font-bold tracking-[0.16em] uppercase text-neutral-500">Patient</th>
                                        <th className="py-3 px-2 text-[11.5px] font-bold tracking-[0.16em] uppercase text-neutral-500">Time</th>
                                        <th className="py-3 px-2 text-[11.5px] font-bold tracking-[0.16em] uppercase text-neutral-500">Type</th>
                                        <th className="py-3 px-2 text-right text-[11.5px] font-bold tracking-[0.16em] uppercase text-neutral-500">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    <UpcomingRow patient="João Silva" initials="JS" color="from-sky-400 to-blue-600" time="09:30 AM" type="Regular Checkup" status="CONFIRMED" />
                                    <UpcomingRow patient="Ana Ferreira" initials="AF" color="from-emerald-400 to-green-600" time="11:00 AM" type="Follow-up" status="PENDING" />
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

type DoctorDetail = {
    id: string
    fullName: string
    specialty: string
    status: string
    crm: string
    rating: string
    reviews: number
    experience: number
    email: string
    phone: string
    avatarGradient: string
    initials: string
}

const DOCTORS_DB: Record<string, DoctorDetail> = {
    "1": {
        id: "1",
        fullName: "Dr. Arnaldo Souza",
        specialty: "General Clinic / Internal Medicine",
        status: "AVAILABLE",
        crm: "123456-SP",
        rating: "4.9",
        reviews: 124,
        experience: 12,
        email: "arnaldo.souza@vitalis.com",
        phone: "+55 (11) 98765-4321",
        avatarGradient: "from-sky-400 to-blue-600",
        initials: "AS",
    },
    "2": {
        id: "2",
        fullName: "Dra. Beatriz Costa",
        specialty: "Cardiologia",
        status: "EM CONSULTA",
        crm: "234567-SP",
        rating: "5.0",
        reviews: 84,
        experience: 9,
        email: "beatriz.costa@vitalis.com",
        phone: "+55 (11) 97654-3210",
        avatarGradient: "from-fuchsia-400 to-rose-500",
        initials: "BC",
    },
    "3": {
        id: "3",
        fullName: "Dr. Ricardo Mendes",
        specialty: "Pediatria",
        status: "AVAILABLE",
        crm: "345678-SP",
        rating: "4.8",
        reviews: 215,
        experience: 15,
        email: "ricardo.mendes@vitalis.com",
        phone: "+55 (11) 98888-1234",
        avatarGradient: "from-amber-300 to-orange-500",
        initials: "RM",
    },
    "4": {
        id: "4",
        fullName: "Dra. Julia Ramos",
        specialty: "Dermatologia",
        status: "AVAILABLE",
        crm: "456789-SP",
        rating: "4.9",
        reviews: 56,
        experience: 8,
        email: "julia.ramos@vitalis.com",
        phone: "+55 (11) 99000-2020",
        avatarGradient: "from-violet-400 to-purple-600",
        initials: "JR",
    },
    "5": {
        id: "5",
        fullName: "Dr. Marcos Vinícius",
        specialty: "Neurologia",
        status: "INDISPONÍVEL",
        crm: "567890-SP",
        rating: "5.0",
        reviews: 142,
        experience: 20,
        email: "marcos.vinicius@vitalis.com",
        phone: "+55 (11) 97000-3030",
        avatarGradient: "from-slate-400 to-slate-700",
        initials: "MV",
    },
    "6": {
        id: "6",
        fullName: "Dra. Helena Souza",
        specialty: "Ginecologia",
        status: "AVAILABLE",
        crm: "678901-SP",
        rating: "4.7",
        reviews: 198,
        experience: 11,
        email: "helena.souza@vitalis.com",
        phone: "+55 (11) 99876-5000",
        avatarGradient: "from-teal-400 to-emerald-600",
        initials: "HS",
    },
}

function getDoctorById(id: string): DoctorDetail {
    return DOCTORS_DB[id] ?? DOCTORS_DB["1"]
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <dt className="block text-[11px] font-bold tracking-[0.16em] uppercase text-neutral-500 mb-1.5">
                {label}
            </dt>
            <dd className="text-[15px] font-semibold text-neutral-900">{value}</dd>
        </div>
    )
}

function ActivityItem({ color, title, time, bold }: { color: string; title: string; time: string; bold?: boolean }) {
    return (
        <li className="flex items-start gap-3">
            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${color} shadow-sm`} />
            <div className="flex-1 min-w-0">
                <p className={`text-[14px] ${bold ? "font-semibold text-neutral-900" : "text-neutral-700"} leading-snug`}>
                    {title}
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">{time}</p>
            </div>
        </li>
    )
}

type UpcomingStatus = "CONFIRMED" | "PENDING"

function UpcomingRow({
    patient,
    initials,
    color,
    time,
    type,
    status,
}: {
    patient: string
    initials: string
    color: string
    time: string
    type: string
    status: UpcomingStatus
}) {
    const pill =
        status === "CONFIRMED"
            ? "bg-green-100 text-green-700 ring-1 ring-green-700/15"
            : "bg-amber-100 text-amber-700 ring-1 ring-amber-600/15"
    return (
        <tr className="hover:bg-neutral-50/70 transition-colors">
            <td className="py-4 px-2">
                <div className="flex items-center gap-3">
                    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${color} text-white text-[11px] font-bold ring-2 ring-white shadow-sm`}>
                        {initials}
                    </span>
                    <span className="font-semibold text-neutral-900">{patient}</span>
                </div>
            </td>
            <td className="py-4 px-2 text-neutral-700 font-medium tabular-nums">{time}</td>
            <td className="py-4 px-2 text-neutral-700">{type}</td>
            <td className="py-4 px-2 text-right">
                <span className={`inline-flex px-3 py-1 rounded-full text-[10.5px] font-extrabold tracking-wide uppercase ${pill}`}>
                    {status}
                </span>
            </td>
        </tr>
    )
}
