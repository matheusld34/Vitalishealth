"use client"

import { useEffect, useState } from "react"
import RegisterDoctorPage from "./RegisterDoctorPage"

type Role = "MASTER" | "SECRETARY" | "DOCTOR"

type ApiDoctor = {
    id: string
    name: string | null
    doctorProfile: {
        crm: string
        crmUf: string
        specialties: string[]
    } | null
}

type Props = {
    userId: string
    userRole: Role
    userName: string
}

export default function DoctorSettingsPage({ userId, userRole, userName }: Props) {
    const isMaster = userRole === "MASTER"
    const [doctors, setDoctors] = useState<ApiDoctor[]>([])
    const [selected, setSelected] = useState<string | null>(null)
    const [loading, setLoading] = useState(isMaster)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!isMaster) return

        let cancelled = false
        setLoading(true)
        setError(null)

        async function load() {
            try {
                const res = await fetch("/api/doctors", { cache: "no-store" })
                const data = await res.json().catch(() => ({}))
                if (!res.ok) throw new Error(data.error || "Erro ao carregar médicos")
                if (cancelled) return
                const list: ApiDoctor[] = data.doctors ?? []
                setDoctors(list)
                setSelected(list[0]?.id ?? null)
            } catch (err: any) {
                console.error(err)
                if (!cancelled) setError(err?.message || "Erro ao carregar médicos")
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        load()
        return () => {
            cancelled = true
        }
    }, [isMaster])

    return (
        <div className="space-y-6 md:space-y-7 pb-10">
            {/* Banner de contexto */}
            <section className="relative overflow-hidden rounded-3xl border border-neutral-200/70 bg-white p-5 md:p-7 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.25)] dark:border-neutral-800/80 dark:bg-neutral-900">
                <div aria-hidden="true" className="absolute -top-24 -right-16 h-64 w-64 rounded-full bg-brand-600/5 blur-3xl" />
                <div aria-hidden="true" className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />

                <div
                    className={`relative grid gap-5 md:gap-7 items-end ${isMaster ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]" : ""
                        }`}
                >
                    <div className="flex items-start gap-4">
                        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 text-white shadow-[0_10px_22px_-8px_rgba(16,142,93,0.55)] ring-1 ring-white/20">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M8 2v4" />
                                <path d="M16 2v4" />
                                <rect x="3" y="4" width="18" height="18" rx="2" />
                                <path d="M12 11v6" />
                                <path d="M9 14h6" />
                            </svg>
                        </span>
                        <div className="min-w-0">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-[11px] font-bold tracking-[0.16em] uppercase ring-1 ring-brand-600/10 dark:bg-brand-500/10 dark:text-brand-300">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <rect x="3" y="11" width="18" height="11" rx="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                Acesso restrito · Médico e Master
                            </div>
                            <h1 className="mt-2.5 text-3xl md:text-4xl font-serif font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                                {isMaster ? "Perfis Médicos" : "Meu Perfil Profissional"}
                            </h1>
                            <p className="mt-2 max-w-2xl text-[14.5px] md:text-[15px] text-neutral-600 leading-relaxed dark:text-neutral-400">
                                {isMaster
                                    ? "Selecione um médico do corpo clínico e atualize suas credenciais, especialidades, horários e informações complementares."
                                    : `Mantenha seus dados de atuação atualizados, ${userName.split(" ")[0] || "doutor(a)"}. As informações de CRM, especialidades e horários são exibidas no seu perfil dentro do sistema.`}
                            </p>
                        </div>
                    </div>

                    {isMaster && (
                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-1.5 dark:text-neutral-300">
                                Médico
                                <span className="font-normal text-[11.5px] text-neutral-400 ml-2 dark:text-neutral-500">
                                    {doctors.length} cadastrado(s)
                                </span>
                            </label>
                            <div className="relative">
                                <select
                                    value={selected ?? ""}
                                    onChange={(e) => setSelected(e.target.value)}
                                    disabled={loading || doctors.length === 0}
                                    className="w-full appearance-none cursor-pointer rounded-2xl border border-neutral-200/80 bg-neutral-50/80 px-4 py-3 pr-10 text-[14.5px] text-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400/70 focus:bg-white transition disabled:opacity-60 disabled:cursor-not-allowed dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:bg-neutral-900"
                                >
                                    {doctors.length === 0 && (
                                        <option value="">{loading ? "Carregando médicos..." : "Nenhum médico cadastrado"}</option>
                                    )}
                                    {doctors.map((d) => (
                                        <option key={d.id} value={d.id}>
                                            {d.name ?? "Médico sem nome"}
                                            {d.doctorProfile ? ` — CRM ${d.doctorProfile.crm}/${d.doctorProfile.crmUf}` : " — sem CRM"}
                                        </option>
                                    ))}
                                </select>
                                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] font-semibold text-red-700 ring-1 ring-red-500/10 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                    {error}
                </div>
            )}

            {loading && isMaster ? (
                <div className="space-y-5">
                    <div className="h-72 rounded-3xl bg-white shadow animate-pulse dark:bg-neutral-900" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div className="h-96 rounded-3xl bg-white shadow animate-pulse dark:bg-neutral-900" />
                        <div className="h-96 rounded-3xl bg-white shadow animate-pulse dark:bg-neutral-900" />
                    </div>
                </div>
            ) : isMaster && !selected ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-neutral-200/80 bg-white/60 py-16 text-center dark:border-neutral-800 dark:bg-neutral-900/60">
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </span>
                    <div>
                        <p className="text-[15px] font-semibold text-neutral-800 dark:text-neutral-100">
                            Nenhum médico para editar
                        </p>
                        <p className="mt-1 text-[13px] text-neutral-500 dark:text-neutral-400">
                            Cadastre um profissional na tela de Médicos para gerenciar suas informações aqui.
                        </p>
                    </div>
                </div>
            ) : (
                <RegisterDoctorPage doctorId={isMaster ? selected : userId} stayOnSave />
            )}
        </div>
    )
}
