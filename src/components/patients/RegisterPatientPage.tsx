"use client"

import Link from "next/link"
import { useState } from "react"

type FormState = {
    fullName: string
    birthDate: string
    gender: string
    documentId: string
    phone: string
    email: string
    insuranceOperator: string
    planType: string
    cardNumber: string
    cep: string
    street: string
    number: string
    state: string
    city: string
    clinicalStatus: string
}

const initialState: FormState = {
    fullName: "",
    birthDate: "",
    gender: "",
    documentId: "",
    phone: "",
    email: "",
    insuranceOperator: "",
    planType: "",
    cardNumber: "",
    cep: "",
    street: "",
    number: "",
    state: "",
    city: "",
    clinicalStatus: "",
}

export default function RegisterPatientPage() {
    const [form, setForm] = useState<FormState>(initialState)

    const update = (field: keyof FormState, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }))
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
                        placeholder="Buscar paciente ou prontuário..."
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
                <span className="font-semibold text-brand-700">Registro de Paciente</span>
            </nav>

            {/* Header */}
            <div className="space-y-2 md:space-y-3 max-w-3xl">
                <h1 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight text-neutral-900">
                    Registro de Paciente
                </h1>
                <p className="text-[15px] md:text-base text-neutral-600 leading-relaxed">
                    Insira as informações detalhadas para cadastrar um novo paciente no sistema da Vitalis Health. Certifique-se de validar os documentos e o convênio.
                </p>
            </div>

            {/* Bloco 1: Info Pessoais + Convênio (grid 2 + 1 sidebar) */}
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-5 md:gap-7">
                {/* Informações Pessoais */}
                <section className="rounded-3xl border border-neutral-200/70 bg-white p-5 md:p-7 shadow-[0_4px_24px_-14px_rgba(15,23,42,0.12)]">
                    <header className="flex items-center gap-2.5 mb-6">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-600/10">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </span>
                        <h2 className="text-xl md:text-[22px] font-serif font-semibold tracking-tight text-neutral-900">
                            Informações Pessoais
                        </h2>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                        <Field label="Nome Completo" hint="Ex.: João Silva Santos">
                            <input
                                type="text"
                                value={form.fullName}
                                onChange={(e) => update("fullName", e.target.value)}
                                placeholder="Ex.: João Silva Santos"
                                className={inputCls}
                            />
                        </Field>

                        <Field label="Data de Nascimento" hint="dd/mm/aaaa">
                            <div className="relative">
                                <input
                                    type="date"
                                    value={form.birthDate}
                                    onChange={(e) => update("birthDate", e.target.value)}
                                    placeholder="dd/mm/aaaa"
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
                                <option value="nao_informar">Prefiro não informar</option>
                            </select>
                        </Field>

                        <Field label="CPF / ID" hint="000.000.000-00">
                            <input
                                type="text"
                                value={form.documentId}
                                onChange={(e) => update("documentId", e.target.value)}
                                placeholder="000.000.000-00"
                                className={inputCls}
                            />
                        </Field>

                        <Field label="Telefone de Contato" hint="(11) 99999-9999">
                            <input
                                type="tel"
                                value={form.phone}
                                onChange={(e) => update("phone", e.target.value)}
                                placeholder="(11) 99999-9999"
                                className={inputCls}
                            />
                        </Field>

                        <Field label="E-mail" hint="joao.silva@email.com">
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => update("email", e.target.value)}
                                placeholder="joao.silva@email.com"
                                className={inputCls}
                            />
                        </Field>
                    </div>
                </section>

                {/* Convênio Médico - card VERDE destaque */}
                <aside className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-100/90 via-brand-50 to-emerald-50 border border-brand-300/60 p-5 md:p-6 shadow-[0_10px_32px_-18px_rgba(16,142,93,0.35)]">
                    <div aria-hidden="true" className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-emerald-200/40 blur-3xl" />

                    <header className="flex items-start gap-2.5 relative">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-brand-700 ring-1 ring-brand-600/15 shadow-sm">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.51 4.04 3 5.5l7 7Z" />
                                <path d="M9 12h.01M15 12h.01M12 14v-1" />
                            </svg>
                        </span>
                        <h2 className="text-xl md:text-[22px] font-serif font-semibold tracking-tight text-brand-800">
                            Convênio
                            <br /> Médico
                        </h2>
                    </header>

                    <div className="mt-6 space-y-4 relative">
                        <Field label="Operadora" hint="Ex.: Unimed, Bradesco">
                            <input
                                type="text"
                                value={form.insuranceOperator}
                                onChange={(e) => update("insuranceOperator", e.target.value)}
                                placeholder="Ex.: Unimed, Bradesco"
                                className={`${inputCls} !bg-white`}
                            />
                        </Field>

                        <Field label="Tipo de Plano" hint="Ex.: Ouro Nacional">
                            <input
                                type="text"
                                value={form.planType}
                                onChange={(e) => update("planType", e.target.value)}
                                placeholder="Ex.: Ouro Nacional"
                                className={`${inputCls} !bg-white`}
                            />
                        </Field>

                        <Field label="Número da Carteirinha" hint="0000 0000 0000">
                            <input
                                type="text"
                                value={form.cardNumber}
                                onChange={(e) => update("cardNumber", e.target.value)}
                                placeholder="0000 0000 0000"
                                className={`${inputCls} !bg-white`}
                            />
                        </Field>
                    </div>

                    <blockquote className="relative mt-6 rounded-2xl bg-white/70 ring-1 ring-brand-600/10 px-4 py-3.5">
                        <p className="text-[12.5px] leading-relaxed text-brand-900/85 italic">
                            “Sempre verifique a validade do plano antes do atendimento presencial.”
                        </p>
                    </blockquote>
                </aside>
            </div>

            {/* Bloco 2: Endereço + Status Clínico (grid 1fr 1fr) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-7">
                {/* Endereço */}
                <section className="rounded-3xl border border-neutral-200/70 bg-white p-5 md:p-7 shadow-[0_4px_24px_-14px_rgba(15,23,42,0.12)]">
                    <header className="flex items-center gap-2.5 mb-6">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                        </span>
                        <h2 className="text-xl md:text-[22px] font-serif font-semibold tracking-tight text-neutral-900">
                            Endereço
                        </h2>
                    </header>

                    <div className="space-y-4 md:space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] items-end gap-3 md:gap-3.5">
                            <Field label="CEP" hint="00000-000">
                                <input
                                    type="text"
                                    value={form.cep}
                                    onChange={(e) => update("cep", e.target.value)}
                                    placeholder="00000-000"
                                    className={inputCls}
                                />
                            </Field>
                            <div className="h-[50px] md:h-[50px]">
                                <button
                                    type="button"
                                    className="h-full inline-flex items-center justify-center rounded-xl bg-brand-100 hover:bg-brand-200/80 text-brand-800 font-semibold px-5 py-3 ring-1 ring-brand-600/10 transition-colors"
                                >
                                    Buscar
                                </button>
                            </div>
                        </div>

                        <Field label="Rua / Logradouro" hint="Rua das Acácias">
                            <input
                                type="text"
                                value={form.street}
                                onChange={(e) => update("street", e.target.value)}
                                placeholder="Rua das Acácias"
                                className={inputCls}
                            />
                        </Field>

                        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4 md:gap-5">
                            <Field label="Número" hint="123">
                                <input
                                    type="text"
                                    value={form.number}
                                    onChange={(e) => update("number", e.target.value)}
                                    placeholder="123"
                                    className={inputCls}
                                />
                            </Field>

                            <Field label="Estado" hint="SP">
                                <select
                                    value={form.state}
                                    onChange={(e) => update("state", e.target.value)}
                                    className={`${inputCls} appearance-none cursor-pointer pr-10`}
                                >
                                    <option value="">Selecione</option>
                                    {["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"].map((uf) => (
                                        <option key={uf} value={uf}>{uf}</option>
                                    ))}
                                </select>
                            </Field>
                        </div>

                        <Field label="Cidade" hint="São Paulo">
                            <input
                                type="text"
                                value={form.city}
                                onChange={(e) => update("city", e.target.value)}
                                placeholder="São Paulo"
                                className={inputCls}
                            />
                        </Field>
                    </div>
                </section>

                {/* Status Clínico */}
                <section className="rounded-3xl border border-neutral-200/70 bg-white p-5 md:p-7 shadow-[0_4px_24px_-14px_rgba(15,23,42,0.12)]">
                    <header className="flex items-center gap-2.5 mb-6">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-700 ring-1 ring-green-600/10">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <polyline points="10 9 9 9 8 9" />
                            </svg>
                        </span>
                        <h2 className="text-xl md:text-[22px] font-serif font-semibold tracking-tight text-neutral-900">
                            Status Clínico
                        </h2>
                    </header>

                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                            Breve relatório da situação atual
                        </label>
                        <textarea
                            value={form.clinicalStatus}
                            onChange={(e) => update("clinicalStatus", e.target.value)}
                            rows={9}
                            placeholder="Descreva os principais sintomas, histórico recente ou observações relevantes do paciente..."
                            className="w-full resize-none rounded-2xl border border-neutral-200/80 bg-neutral-50/80 px-4 py-3.5 text-[14.5px] text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400/70 transition min-h-[220px]"
                        />
                        <p className="mt-2 text-right text-[11.5px] text-neutral-400">
                            Mínimo de 50 caracteres recomendado para a primeira triagem.
                        </p>
                    </div>
                </section>
            </div>

            {/* Bloco 3: Anexos de Exames (full width dropzone) */}
            <section className="rounded-3xl border-2 border-dashed border-neutral-300/90 bg-white/40 p-5 md:p-7">
                <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
                    <div className="max-w-md">
                        <header className="flex items-center gap-2.5 mb-3">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-700 text-white ring-1 ring-brand-700/50">
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                </svg>
                            </span>
                            <h2 className="text-xl md:text-[22px] font-serif font-semibold tracking-tight text-neutral-900">
                                Anexos de Exames
                            </h2>
                        </header>
                        <p className="text-[14.5px] text-neutral-600 leading-relaxed">
                            Arraste e solte arquivos aqui para anexar resultados laboratoriais, Raios-X ou históricos médicos anteriores.
                        </p>
                    </div>

                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                        <Thumb title="Resultado.pdf" subtitle="PDF" />
                        <Thumb title="Rx-Torax.png" subtitle="PNG" image />
                        <button
                            type="button"
                            className="aspect-square rounded-2xl border-2 border-dashed border-neutral-300/90 hover:border-brand-400/80 hover:bg-brand-50/50 transition-colors p-3 md:p-4 flex flex-col items-center justify-center gap-2 text-neutral-500 hover:text-brand-700"
                        >
                            <span className="relative inline-flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-xl bg-white ring-1 ring-neutral-200/90">
                                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                    <circle cx="12" cy="13" r="4" />
                                    <line x1="12" y1="10" x2="12" y2="16" />
                                    <line x1="9" y1="13" x2="15" y2="13" />
                                </svg>
                            </span>
                            <span className="text-xs md:text-sm font-semibold text-center">
                                Adicionar
                            </span>
                        </button>
                        <button
                            type="button"
                            className="aspect-square rounded-2xl border-2 border-dashed border-neutral-300/90 hover:border-brand-400/80 hover:bg-brand-50/50 transition-colors p-3 md:p-4 flex flex-col items-center justify-center gap-2 text-neutral-500 hover:text-brand-700"
                        >
                            <span className="relative inline-flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-xl bg-white ring-1 ring-neutral-200/90">
                                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                            </span>
                            <span className="text-xs md:text-sm font-semibold text-center">
                                Upload
                            </span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Divisória fina + rodapé com ações */}
            <div className="h-px w-full bg-neutral-200/70 mt-4" />

            <footer className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                <Link
                    href="/dashboard/pacientes"
                    className="inline-flex items-center justify-center sm:justify-start text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors px-3 py-2.5 -mx-3"
                >
                    Cancelar Registro
                </Link>
                <button
                    type="button"
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 px-7 py-4 text-[15px] font-bold text-white shadow-[0_12px_28px_rgba(16,142,93,0.32)] hover:brightness-[1.04] active:brightness-100 transition-all"
                >
                    <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                            <polyline points="17 21 17 13 7 13 7 21" />
                            <polyline points="7 3 7 8 15 8" />
                        </svg>
                    </span>
                    Salvar Paciente
                </button>
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

function Thumb({ title, subtitle, image }: { title: string; subtitle: string; image?: boolean }) {
    return (
        <div className="aspect-square relative rounded-2xl bg-white border border-neutral-200/80 shadow-[0_4px_16px_-14px_rgba(15,23,42,0.2)] overflow-hidden">
            <div className={`absolute inset-0 flex items-center justify-center text-2xl ${image ? "bg-gradient-to-br from-slate-200 via-neutral-100 to-slate-300" : "bg-gradient-to-br from-emerald-50 to-neutral-100"}`}>
                {image ? (
                    <div className="relative w-full h-full opacity-70">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="rgba(15,23,42,0.35)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                <circle cx="12" cy="13" r="4" />
                            </svg>
                        </div>
                        {/* Simulação de ossos no Rx */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-60 text-neutral-500/60 tracking-[0.2em] text-xs rotate-90 font-mono">
                            |||  &nbsp;&nbsp;  |||
                        </div>
                    </div>
                ) : (
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="rgba(16,142,93,0.55)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                )}
            </div>
            <div className="absolute left-0 right-0 bottom-0 px-2.5 py-2 bg-gradient-to-t from-black/65 via-black/20 to-transparent text-[11px]">
                <p className="truncate text-white font-semibold leading-tight">{title}</p>
                <p className="text-white/70 leading-none mt-0.5">{subtitle}</p>
            </div>
            <button
                type="button"
                aria-label="Remover arquivo"
                className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/55 hover:bg-black/70 text-white/90 hover:text-white inline-flex items-center justify-center transition-colors"
            >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
        </div>
    )
}
