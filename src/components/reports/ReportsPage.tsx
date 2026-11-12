"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTransition, type ReactNode } from "react"

export type PeriodKey = "30" | "90" | "180" | "365"

export type StatusDatum = {
    key: string
    label: string
    count: number
    color: string
}

export type MonthlyDatum = {
    label: string
    total: number
    completed: number
    canceled: number
}

export type DoctorRow = {
    id: string
    name: string
    specialty: string
    total: number
    completed: number
    rate: number
}

export type LabelCount = {
    name: string
    count: number
}

export type ReportsKpis = {
    total: number
    completed: number
    canceled: number
    noShow: number
    pending: number
    completionRate: number
    cancelRate: number
    noShowRate: number
    avgPerDay: number
    patients: number
    newPatients: number
    doctors: number
}

export type ReportsData = {
    kpis: ReportsKpis
    status: StatusDatum[]
    monthly: MonthlyDatum[]
    doctors: DoctorRow[]
    specialties: LabelCount[]
    insurance: LabelCount[]
}

const PERIODS: { key: PeriodKey; label: string }[] = [
    { key: "30", label: "30 dias" },
    { key: "90", label: "90 dias" },
    { key: "180", label: "6 meses" },
    { key: "365", label: "12 meses" },
]

const COMPLETED_COLOR = "#6366f1"
const CANCELED_COLOR = "#ef4444"

const CARD = "rounded-2xl border border-neutral-200/70 bg-white shadow-sm dark:border-neutral-800/80 dark:bg-neutral-900"
const CARD_HEAD = "flex items-center justify-between gap-3 px-5 pt-5 md:px-6 md:pt-6"
const CARD_TITLE = "text-sm font-semibold tracking-tight text-neutral-800 dark:text-neutral-100"
const CARD_SUB = "text-xs text-neutral-500 dark:text-neutral-400"
const EMPTY_TEXT = "text-sm text-neutral-400 dark:text-neutral-500"

function formatNumber(value: number): string {
    return new Intl.NumberFormat("pt-BR").format(value)
}

function percent(part: number, whole: number): number {
    return whole > 0 ? Math.round((part / whole) * 100) : 0
}

/* ------------------------------- Ícones ---------------------------------- */

function Icon({ children }: { children: ReactNode }) {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {children}
        </svg>
    )
}

const ICONS = {
    calendar: (
        <Icon>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </Icon>
    ),
    check: (
        <Icon>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="m9 11 3 3L22 4" />
        </Icon>
    ),
    cancel: (
        <Icon>
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
        </Icon>
    ),
    noShow: (
        <Icon>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="17" y1="8" x2="22" y2="13" />
            <line x1="22" y1="8" x2="17" y2="13" />
        </Icon>
    ),
    patients: (
        <Icon>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </Icon>
    ),
    doctors: (
        <Icon>
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M12 11v6" />
            <path d="M9 14h6" />
        </Icon>
    ),
    refresh: (
        <Icon>
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
            <path d="M3 21v-5h5" />
        </Icon>
    ),
}

/* ------------------------------ Painéis ---------------------------------- */

function KpiCard({
    icon,
    label,
    value,
    hint,
    tone,
}: {
    icon: ReactNode
    label: string
    value: string
    hint: string
    tone: string
}) {
    return (
        <div className={`${CARD} p-5 transition-colors duration-300`}>
            <div className="flex items-start justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400 dark:text-neutral-500">
                    {label}
                </p>
                <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tone}`}>
                    {icon}
                </span>
            </div>
            <p className="mt-3 text-2xl font-semibold tabular-nums text-neutral-900 md:text-3xl dark:text-neutral-50">
                {value}
            </p>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{hint}</p>
        </div>
    )
}

function Panel({
    title,
    subtitle,
    aside,
    className = "",
    children,
}: {
    title: string
    subtitle?: string
    aside?: ReactNode
    className?: string
    children: ReactNode
}) {
    return (
        <section className={`${CARD} ${className}`}>
            <div className={CARD_HEAD}>
                <div>
                    <h2 className={CARD_TITLE}>{title}</h2>
                    {subtitle && <p className={`mt-0.5 ${CARD_SUB}`}>{subtitle}</p>}
                </div>
                {aside}
            </div>
            <div className="px-5 pb-5 pt-4 md:px-6 md:pb-6">{children}</div>
        </section>
    )
}

function BarList({ items, color }: { items: LabelCount[]; color: string }) {
    if (!items.length) return <p className={EMPTY_TEXT}>Sem dados no período.</p>
    const max = Math.max(1, ...items.map((i) => i.count))
    return (
        <ul className="space-y-3.5">
            {items.map((item) => (
                <li key={item.name}>
                    <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="truncate font-medium text-neutral-700 dark:text-neutral-200">{item.name}</span>
                        <span className="shrink-0 tabular-nums text-neutral-500 dark:text-neutral-400">
                            {formatNumber(item.count)}
                        </span>
                    </div>
                    <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.round((item.count / max) * 100)}%`, background: color }}
                        />
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default function ReportsPage({
    period,
    data,
}: {
    period: PeriodKey
    data: ReportsData
}) {
    const router = useRouter()
    const [pending, startTransition] = useTransition()
    const { kpis, status, monthly, doctors, specialties, insurance } = data

    const maxMonthly = Math.max(1, ...monthly.map((m) => m.total))

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Cabeçalho */}
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h1 className="bg-gradient-to-r from-brand-700 via-brand-500 to-brand-400 bg-clip-text text-2xl font-serif font-semibold text-transparent md:text-3xl dark:from-brand-200 dark:via-brand-300 dark:to-brand-400">
                        Relatórios &amp; Indicadores
                    </h1>
                    <p className="mt-2 text-sm text-neutral-600 md:text-base dark:text-neutral-400">
                        Análise consolidada de atendimentos, desempenho clínico e perfil de pacientes.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-neutral-200/70 bg-white/70 p-1 dark:border-neutral-800/80 dark:bg-neutral-900/70">
                        {PERIODS.map((p) => {
                            const active = p.key === period
                            return (
                                <Link
                                    key={p.key}
                                    href={`/dashboard/relatorios?periodo=${p.key}`}
                                    scroll={false}
                                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors duration-200 ${active
                                        ? "bg-brand-500 text-white shadow-[0_4px_10px_rgba(45,149,105,0.25)]"
                                        : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                        }`}
                                >
                                    {p.label}
                                </Link>
                            )
                        })}
                    </div>
                    <button
                        type="button"
                        onClick={() => startTransition(() => router.refresh())}
                        disabled={pending}
                        className="inline-flex items-center gap-2 rounded-xl border border-neutral-200/70 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-700 shadow-sm transition-colors duration-200 hover:bg-neutral-50 disabled:opacity-60 dark:border-neutral-800/80 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    >
                        <span className={pending ? "animate-spin" : ""}>{ICONS.refresh}</span>
                        {pending ? "Atualizando…" : "Atualizar"}
                    </button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <KpiCard
                    icon={ICONS.calendar}
                    label="Consultas no período"
                    value={formatNumber(kpis.total)}
                    hint={`Média de ${kpis.avgPerDay} por dia · ${kpis.pending} pendentes`}
                    tone="bg-brand-500/10 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300"
                />
                <KpiCard
                    icon={ICONS.check}
                    label="Taxa de conclusão"
                    value={`${kpis.completionRate}%`}
                    hint={`${formatNumber(kpis.completed)} consultas concluídas`}
                    tone="bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300"
                />
                <KpiCard
                    icon={ICONS.cancel}
                    label="Taxa de cancelamento"
                    value={`${kpis.cancelRate}%`}
                    hint={`${formatNumber(kpis.canceled)} consultas canceladas`}
                    tone="bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-300"
                />
                <KpiCard
                    icon={ICONS.noShow}
                    label="Não comparecimento"
                    value={`${kpis.noShowRate}%`}
                    hint={`${formatNumber(kpis.noShow)} faltas registradas`}
                    tone="bg-violet-500/10 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300"
                />
                <KpiCard
                    icon={ICONS.patients}
                    label="Pacientes cadastrados"
                    value={formatNumber(kpis.patients)}
                    hint={`+${formatNumber(kpis.newPatients)} no período`}
                    tone="bg-sky-500/10 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300"
                />
                <KpiCard
                    icon={ICONS.doctors}
                    label="Médicos ativos"
                    value={formatNumber(kpis.doctors)}
                    hint="Profissionais no corpo clínico"
                    tone="bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300"
                />
            </div>

            {/* Evolução + Distribuição */}
            <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
                <Panel
                    title="Evolução mensal"
                    subtitle="Volume de consultas nos últimos 6 meses"
                    className="lg:col-span-2"
                    aside={
                        <div className="hidden items-center gap-3 sm:flex">
                            <LegendDot color={COMPLETED_COLOR} label="Concluídas" />
                            <LegendDot color={CANCELED_COLOR} label="Canceladas" />
                            <LegendDot color="#e5e7eb" label="Outras" />
                        </div>
                    }
                >
                    {monthly.length === 0 ? (
                        <p className={EMPTY_TEXT}>Sem dados de evolução.</p>
                    ) : (
                        <div className="flex h-56 items-end gap-2.5 md:gap-4">
                            {monthly.map((m) => {
                                const height = m.total > 0 ? Math.max(6, (m.total / maxMonthly) * 100) : 2
                                const completedH = m.total > 0 ? (m.completed / m.total) * 100 : 0
                                const canceledH = m.total > 0 ? (m.canceled / m.total) * 100 : 0
                                return (
                                    <div key={m.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                                        <span className="text-[11px] font-semibold tabular-nums text-neutral-500 dark:text-neutral-400">
                                            {m.total > 0 ? formatNumber(m.total) : ""}
                                        </span>
                                        <div className="flex h-full w-full items-end justify-center">
                                            <div
                                                className="relative w-full max-w-[46px] overflow-hidden rounded-t-lg bg-neutral-100 dark:bg-neutral-800"
                                                style={{ height: `${height}%` }}
                                                title={`${m.label} · ${m.total} consultas`}
                                            >
                                                <div className="absolute inset-x-0 bottom-0 flex h-full flex-col-reverse">
                                                    <div style={{ height: `${completedH}%`, background: COMPLETED_COLOR }} />
                                                    <div style={{ height: `${canceledH}%`, background: CANCELED_COLOR }} />
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[11px] font-medium uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                                            {m.label}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </Panel>

                <Panel title="Status das consultas" subtitle="Distribuição no período">
                    {kpis.total === 0 ? (
                        <p className={EMPTY_TEXT}>Sem consultas no período.</p>
                    ) : (
                        <ul className="space-y-4">
                            {status.map((s) => {
                                const pct = percent(s.count, kpis.total)
                                return (
                                    <li key={s.key}>
                                        <div className="flex items-center justify-between gap-3 text-sm">
                                            <span className="flex items-center gap-2 font-medium text-neutral-700 dark:text-neutral-200">
                                                <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                                                {s.label}
                                            </span>
                                            <span className="shrink-0 tabular-nums text-neutral-500 dark:text-neutral-400">
                                                {formatNumber(s.count)} · {pct}%
                                            </span>
                                        </div>
                                        <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{ width: `${pct}%`, background: s.color }}
                                            />
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </Panel>
            </div>

            {/* Desempenho por médico + Especialidades/Convênios */}
            <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
                <Panel title="Desempenho por médico" subtitle="Ranking por volume de atendimentos no período">
                    {doctors.length === 0 ? (
                        <p className={EMPTY_TEXT}>Sem atendimentos no período.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[520px] border-collapse text-sm">
                                <thead>
                                    <tr className="text-[11px] uppercase tracking-[0.14em] text-neutral-400 dark:text-neutral-500">
                                        <th className="pb-3 pr-3 text-left font-semibold">#</th>
                                        <th className="pb-3 pr-3 text-left font-semibold">Médico</th>
                                        <th className="pb-3 pr-3 text-right font-semibold">Atend.</th>
                                        <th className="pb-3 pr-3 text-right font-semibold">Concl.</th>
                                        <th className="pb-3 text-right font-semibold">Taxa</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {doctors.map((d, index) => (
                                        <tr key={d.id} className="border-t border-neutral-100 dark:border-neutral-800">
                                            <td className="py-3 pr-3 tabular-nums text-neutral-400 dark:text-neutral-500">
                                                {index + 1}
                                            </td>
                                            <td className="py-3 pr-3">
                                                <p className="truncate font-medium text-neutral-800 dark:text-neutral-100">
                                                    {d.name}
                                                </p>
                                                <p className="truncate text-xs text-neutral-400 dark:text-neutral-500">
                                                    {d.specialty}
                                                </p>
                                            </td>
                                            <td className="py-3 pr-3 text-right tabular-nums text-neutral-700 dark:text-neutral-200">
                                                {formatNumber(d.total)}
                                            </td>
                                            <td className="py-3 pr-3 text-right tabular-nums text-neutral-700 dark:text-neutral-200">
                                                {formatNumber(d.completed)}
                                            </td>
                                            <td className="py-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <div className="h-2 w-16 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                                                        <div
                                                            className="h-full rounded-full bg-brand-500"
                                                            style={{ width: `${d.rate}%` }}
                                                        />
                                                    </div>
                                                    <span className="w-9 text-right tabular-nums text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                                                        {d.rate}%
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Panel>

                <div className="grid grid-cols-1 gap-4 md:gap-6">
                    <Panel title="Especialidades mais atendidas" subtitle="Top especialidades no período">
                        <BarList items={specialties} color="#2d9569" />
                    </Panel>
                    <Panel title="Convênios" subtitle="Origem dos atendimentos no período">
                        <BarList items={insurance} color="#0ea5e9" />
                    </Panel>
                </div>
            </div>
        </div>
    )
}

function LegendDot({ color, label }: { color: string; label: string }) {
    return (
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
            {label}
        </span>
    )
}
