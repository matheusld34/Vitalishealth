"use client"

import Link from "next/link"
import { useState } from "react"

type FormState = {
    fullName: string
    crm: string
    crmUf: string
    email: string
    phone: string
    birthDate: string
    gender: string
    documentId: string
    specialties: string[]
    newSpecialty: string
    days: Record<string, boolean>
    startMorning: string
    endMorning: string
    startAfternoon: string
    endAfternoon: string
    bio: string
    notes: string
}

const initialState: FormState = {
    fullName: "",
    crm: "",
    crmUf: "SP",
    email: "",
    phone: "",
    birthDate: "",
    gender: "",
    documentId: "",
    specialties: ["Clínica Geral"],
    newSpecialty: "",
    days: { seg: true, ter: true, qua: true, qui: true, sex: true, sáb: false, dom: false },
    startMorning: "08:00",
    endMorning: "12:00",
    startAfternoon: "13:30",
    endAfternoon: "18:00",
    bio: "",
    notes: "",
}

const DAYS: Array<{ key: string; label: string }> = [
    { key: "seg", label: "Seg" },
    { key: "ter", label: "Ter" },
    { key: "qua", label: "Qua" },
    { key: "qui", label: "Qui" },
    { key: "sex", label: "Sex" },
    { key: "sáb", label: "Sáb" },
    { key: "dom", label: "Dom" },
]

export default function RegisterDoctorPage() {
    const [form, setForm] = useState<FormState>(initialState)

    const update = (field: keyof FormState, value: string | string[] | Record<string, boolean>) => {
        setForm((prev) => ({ ...prev, [field]: value as never }))
    }

    const toggleDay = (key: string) => {
        update("days", { ...form.days, [key]: !form.days[key] })
    }

    const addSpecialty = () => {
        const v = form.newSpecialty.trim()
        if (!v) return
        if (form.specialties.some((s) => s.localeCompare(v, "pt-BR", { sensitivity: "base" }) === 0)) return
        update("specialties", [...form.specialties, v])
        update("newSpecialty", "")
    }

    const removeSpecialty = (s: string) => {
        update("specialties", form.specialties.filter((x) => x !== s))
    }

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
                        placeholder="Buscar por médicos, CRM ou especialidades..."
                        className="w-full rounded-full border border-neutral-200/80 bg-white/90 py-3 pl-11 pr-4 text-sm placeholder:text-neutral-400 shadow-[0_2px_10px_rgba(15,23,42,0.05)] focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400/60 transition"
                    />
                </div>
            </div>

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/dashboard/medicos" className="hover:text-neutral-800 transition-colors">
                    Corpo Clínico
                </Link>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-300" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
                <span className="font-semibold text-brand-700">Novo Médico</span>
            </nav>

            {/* Header */}
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-5 md:gap-7 items-start">
                <div className="space-y-2 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 text-[11.5px] font-bold tracking-[0.16em] uppercase ring-1 ring-brand-600/10">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        Cadastro Autorizado
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight text-neutral-900">
                        Cadastrar Novo Médico
                    </h1>
                    <p className="text-[15px] md:text-base text-neutral-600 leading-relaxed">
                        Preencha as informações do profissional para integrá-lo ao corpo clínico. Os campos de CRM, especialidades e horários de atendimento serão exibidos publicamente no perfil do médico dentro do sistema.
                    </p>
                </div>

                {/* Card lateral destaque */}
                <aside className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 text-white p-5 md:p-6 shadow-[0_16px_40px_-10px_rgba(16,142,93,0.45)]">
                    <div aria-hidden="true" className="absolute -right-12 -bottom-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
                    <div aria-hidden="true" className="absolute -left-10 -top-14 h-48 w-48 rounded-full bg-emerald-300/20 blur-3xl" />
                    <div className="relative">
                        <div className="flex items-start gap-3">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </span>
                            <div>
                                <h3 className="text-lg md:text-xl font-serif font-semibold tracking-tight">
                                    Corpo Clínico Vitalis
                                </h3>
                                <p className="text-[13px] md:text-sm text-white/80 leading-relaxed mt-1.5">
                                    Assim que salvo, o médico aparece na listagem e pode ser selecionado para agendamento de consultas.
                                </p>
                            </div>
                        </div>
                        <div className="mt-5 grid grid-cols-2 gap-3">
                            <StatMini label="Médicos ativos" value="24" />
                            <StatMini label="Especialidades" value="12" />
                        </div>
                        <p className="mt-5 rounded-2xl bg-white/10 ring-1 ring-white/15 px-4 py-3 text-[12.5px] leading-relaxed text-white/90 italic">
                            “Certifique-se de validar o número do CRM junto ao conselho regional antes da ativação.”
                        </p>
                    </div>
                </aside>
            </div>

            {/* Dados Pessoais */}
            <section className="rounded-3xl border border-neutral-200/70 bg-white p-5 md:p-7 shadow-[0_4px_24px_-14px_rgba(15,23,42,0.12)]">
                <header className="flex items-center gap-2.5 mb-6">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-600/10">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </span>
                    <h2 className="text-xl md:text-[22px] font-serif font-semibold tracking-tight text-neutral-900">
                        Dados Pessoais e Credenciais
                    </h2>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                    <Field label="Nome Completo" hint="Nome do médico (CRM aparecerá junto)">
                        <input
                            type="text"
                            value={form.fullName}
                            onChange={(e) => update("fullName", e.target.value)}
                            placeholder="Ex.: Dr. Arnaldo Souza"
                            className={inputCls}
                        />
                    </Field>

                    <Field label="Data de Nascimento" hint="dd/mm/aaaa">
                        <div className="relative">
                            <input
                                type="date"
                                value={form.birthDate}
                                onChange={(e) => update("birthDate", e.target.value)}
                                className={`${inputCls} pr-10`}
                            />
                            <CalendarIcon />
                        </div>
                    </Field>

                    <Field label="Gênero">
                        <select
                            value={form.gender}
                            onChange={(e) => update("gender", e.target.value)}
                            className={`${inputCls} appearance-none cursor-pointer pr-10`}
                        >
                            <option value="">Selecione</option>
                            <option value="masculino">Masculino</option>
                            <option value="feminino">Feminino</option>
                            <option value="outro">Outro</option>
                        </select>
                    </Field>

                    <Field label="CPF" hint="000.000.000-00">
                        <input
                            type="text"
                            value={form.documentId}
                            onChange={(e) => update("documentId", e.target.value)}
                            placeholder="000.000.000-00"
                            className={inputCls}
                        />
                    </Field>

                    <Field label="E-mail" hint="Profissional">
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => update("email", e.target.value)}
                            placeholder="arnaldo.souza@vitalis.com"
                            className={inputCls}
                        />
                    </Field>

                    <Field label="Telefone / Celular" hint="(11) 98765-4321">
                        <input
                            type="tel"
                            value={form.phone}
                            onChange={(e) => update("phone", e.target.value)}
                            placeholder="(11) 98765-4321"
                            className={inputCls}
                        />
                    </Field>
                </div>

                {/* CRM composto */}
                <div className="mt-4 md:mt-5 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_180px] gap-4 md:gap-5">
                    <Field label="Número do CRM" hint="Apenas números">
                        <div className="relative">
                            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-600 font-black text-xs tracking-widest">
                                CRM
                            </span>
                            <input
                                type="text"
                                value={form.crm}
                                onChange={(e) => update("crm", e.target.value)}
                                placeholder="123456"
                                className={`${inputCls} pl-16 tabular-nums font-semibold tracking-wide`}
                            />
                        </div>
                    </Field>
                    <Field label="UF do CRM" hint="SP, RJ, MG...">
                        <select
                            value={form.crmUf}
                            onChange={(e) => update("crmUf", e.target.value)}
                            className={`${inputCls} appearance-none cursor-pointer pr-10 uppercase font-bold tracking-wider text-neutral-800`}
                        >
                            {["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"].map((uf) => (
                                <option key={uf} value={uf}>{uf}</option>
                            ))}
                        </select>
                    </Field>
                </div>
            </section>

            {/* Especialidades + Horários */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-7">
                {/* Especialidades */}
                <section className="rounded-3xl border border-neutral-200/70 bg-white p-5 md:p-7 shadow-[0_4px_24px_-14px_rgba(15,23,42,0.12)]">
                    <header className="flex items-center gap-2.5 mb-6">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                        </span>
                        <h2 className="text-xl md:text-[22px] font-serif font-semibold tracking-tight text-neutral-900">
                            Especialidades
                        </h2>
                    </header>

                    <div className="flex flex-wrap gap-2.5 mb-4">
                        {form.specialties.length === 0 && (
                            <p className="text-sm text-neutral-500 italic">Nenhuma especialidade adicionada.</p>
                        )}
                        {form.specialties.map((s) => (
                            <span key={s} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-brand-50 text-brand-700 text-[13px] font-semibold ring-1 ring-brand-600/10">
                                {s}
                                <button
                                    type="button"
                                    onClick={() => removeSpecialty(s)}
                                    aria-label={`Remover ${s}`}
                                    className="h-4.5 w-4.5 inline-flex items-center justify-center rounded-full bg-brand-600/10 text-brand-700 hover:bg-brand-600 hover:text-white transition-colors"
                                >
                                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </span>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] gap-3">
                        <input
                            type="text"
                            value={form.newSpecialty}
                            onChange={(e) => update("newSpecialty", e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSpecialty() } }}
                            placeholder="Ex.: Cardiologia, Pediatria, Ortopedia..."
                            className={inputCls}
                        />
                        <button
                            type="button"
                            onClick={addSpecialty}
                            className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-brand-100 hover:bg-brand-200/80 text-brand-800 font-bold px-5 py-3 ring-1 ring-brand-600/10 transition-colors whitespace-nowrap"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Adicionar
                        </button>
                    </div>

                    {/* Sugestões rápidas */}
                    <div className="mt-5">
                        <p className="text-xs font-bold tracking-[0.16em] uppercase text-neutral-500 mb-2.5">
                            Sugestões
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {["Cardiologia", "Pediatria", "Ginecologia", "Ortopedia", "Dermatologia", "Neurologia", "Psiquiatria"].map((s) => {
                                const exists = form.specialties.some((x) => x.localeCompare(s, "pt-BR", { sensitivity: "base" }) === 0)
                                return (
                                    <button
                                        key={s}
                                        type="button"
                                        disabled={exists}
                                        onClick={() => update("specialties", [...form.specialties, s])}
                                        className={`px-3 py-1.5 rounded-full text-[11.5px] font-semibold transition-all ${
                                            exists
                                                ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                                                : "bg-neutral-100 text-neutral-600 hover:bg-brand-50 hover:text-brand-700 ring-1 ring-transparent hover:ring-brand-600/10"
                                        }`}
                                    >
                                        + {s}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* Horários de Atendimento */}
                <section className="rounded-3xl border border-neutral-200/70 bg-white p-5 md:p-7 shadow-[0_4px_24px_-14px_rgba(15,23,42,0.12)]">
                    <header className="flex items-center gap-2.5 mb-6">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-700 ring-1 ring-green-600/10">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                        </span>
                        <h2 className="text-xl md:text-[22px] font-serif font-semibold tracking-tight text-neutral-900">
                            Horários de Atendimento
                        </h2>
                    </header>

                    <div>
                        <p className="text-[11.5px] font-bold tracking-[0.16em] uppercase text-neutral-500 mb-2.5">
                            Dias de plantão
                        </p>
                        <div className="grid grid-cols-7 gap-1.5 md:gap-2">
                            {DAYS.map(({ key, label }) => {
                                const active = form.days[key]
                                return (
                                    <button
                                        type="button"
                                        key={key}
                                        onClick={() => toggleDay(key)}
                                        className={`relative h-12 md:h-14 rounded-2xl text-[12px] md:text-[13px] font-bold transition-all ${
                                            active
                                                ? "bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-[0_8px_16px_-4px_rgba(16,142,93,0.35)] ring-1 ring-white/20"
                                                : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200/80 hover:text-neutral-700"
                                        }`}
                                    >
                                        {label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 mt-6">
                        <Field label="Manhã (início)" hint="08:00">
                            <input
                                type="time"
                                value={form.startMorning}
                                onChange={(e) => update("startMorning", e.target.value)}
                                className={`${inputCls} tabular-nums font-semibold`}
                            />
                        </Field>
                        <Field label="Manhã (fim)" hint="12:00">
                            <input
                                type="time"
                                value={form.endMorning}
                                onChange={(e) => update("endMorning", e.target.value)}
                                className={`${inputCls} tabular-nums font-semibold`}
                            />
                        </Field>
                        <Field label="Tarde (início)" hint="13:30">
                            <input
                                type="time"
                                value={form.startAfternoon}
                                onChange={(e) => update("startAfternoon", e.target.value)}
                                className={`${inputCls} tabular-nums font-semibold`}
                            />
                        </Field>
                        <Field label="Tarde (fim)" hint="18:00">
                            <input
                                type="time"
                                value={form.endAfternoon}
                                onChange={(e) => update("endAfternoon", e.target.value)}
                                className={`${inputCls} tabular-nums font-semibold`}
                            />
                        </Field>
                    </div>
                </section>
            </div>

            {/* Biografia + Observações */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-7">
                <section className="rounded-3xl border border-neutral-200/70 bg-white p-5 md:p-7 shadow-[0_4px_24px_-14px_rgba(15,23,42,0.12)]">
                    <header className="flex items-center gap-2.5 mb-5">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-700 ring-1 ring-green-600/10">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                        </span>
                        <h2 className="text-xl md:text-[22px] font-serif font-semibold tracking-tight text-neutral-900">
                            Biografia
                        </h2>
                    </header>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        Apresentação do médico
                    </label>
                    <textarea
                        rows={8}
                        value={form.bio}
                        onChange={(e) => update("bio", e.target.value)}
                        placeholder="Formação acadêmica, experiência, abordagem clínica, diferenciais do atendimento... Este texto aparecerá no perfil público do médico."
                        className={`${inputCls} !py-3.5 resize-none min-h-[220px] leading-relaxed`}
                    />
                    <p className="mt-2 text-right text-[11.5px] text-neutral-400">
                        Recomendado: entre 200 e 600 caracteres.
                    </p>
                </section>

                <section className="rounded-3xl border border-neutral-200/70 bg-white p-5 md:p-7 shadow-[0_4px_24px_-14px_rgba(15,23,42,0.12)]">
                    <header className="flex items-center gap-2.5 mb-5">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700 ring-1 ring-amber-600/10">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M9 11l3 3L22 4" />
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                            </svg>
                        </span>
                        <h2 className="text-xl md:text-[22px] font-serif font-semibold tracking-tight text-neutral-900">
                            Observações Internas
                        </h2>
                    </header>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        Dados administrativos (não público)
                    </label>
                    <textarea
                        rows={8}
                        value={form.notes}
                        onChange={(e) => update("notes", e.target.value)}
                        placeholder="Data de admissão, remuneração, convênios aceitos, restrições, informações para equipe da secretaria, dados bancários... Apenas usuários internos verão."
                        className={`${inputCls} !py-3.5 resize-none min-h-[220px] leading-relaxed`}
                    />
                    <p className="mt-2 text-right text-[11.5px] text-neutral-400">
                        Uso interno do sistema.
                    </p>
                </section>
            </div>

            {/* Divisória e botões */}
            <div className="h-px w-full bg-neutral-200/70" />

            <footer className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
                <Link
                    href="/dashboard/medicos"
                    className="inline-flex items-center justify-center sm:justify-start text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors px-3 py-2.5 -mx-3"
                >
                    Cancelar e voltar para listagem
                </Link>
                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-neutral-200 px-5 py-3.5 text-[14px] font-bold text-neutral-600 hover:bg-neutral-50 transition-colors"
                    >
                        Salvar como Rascunho
                    </button>
                    <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 px-7 py-3.5 text-[15px] font-bold text-white shadow-[0_12px_28px_rgba(16,142,93,0.32)] hover:brightness-[1.04] active:brightness-100 transition-all"
                    >
                        <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                <polyline points="17 21 17 13 7 13 7 21" />
                                <polyline points="7 3 7 8 15 8" />
                            </svg>
                        </span>
                        Salvar e Ativar Médico
                    </button>
                </div>
            </footer>
        </div>
    )
}

const inputCls =
    "w-full rounded-2xl border border-neutral-200/80 bg-neutral-50/80 px-4 py-3 text-[14.5px] text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400/70 focus:bg-white transition"

function Field({
    label,
    hint,
    children,
}: {
    label: string
    hint?: string
    children: React.ReactNode
}) {
    return (
        <label className="block relative">
            <span className="block text-sm font-semibold text-neutral-700 mb-1.5 flex items-baseline justify-between gap-2">
                <span>{label}</span>
                {hint ? (
                    <span className="font-normal text-[11.5px] text-neutral-400">{hint}</span>
                ) : null}
            </span>
            {children}
        </label>
    )
}

function CalendarIcon() {
    return (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
        </span>
    )
}

function StatMini({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl bg-white/10 ring-1 ring-white/15 px-4 py-3">
            <p className="text-[10.5px] md:text-[11px] uppercase font-bold tracking-[0.18em] text-white/70">
                {label}
            </p>
            <p className="text-2xl font-black text-white mt-0.5">{value}</p>
        </div>
    )
}
