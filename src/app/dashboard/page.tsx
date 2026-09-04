import { redirect } from "next/navigation"
import { auth } from "@/app/lib/auth"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import StatCard from "@/components/dashboard/StatCard"
import RecentActivity from "@/components/dashboard/RecentActivity"
import prisma from "@/app/lib/prisma"

async function buildTodayStats() {
    try {
        const start = new Date()
        start.setHours(0, 0, 0, 0)
        const end = new Date()
        end.setHours(23, 59, 59, 999)
        const today = await prisma.appointment.findMany({
            where: { dateTime: { gte: start, lte: end } },
        })
        const todayTotal = today.length
        const doneStatuses = ["COMPLETED", "DONE", "FINISHED", "CANCELLED"]
        const done = today.filter((a) => doneStatuses.includes((a.status || "").toUpperCase())).length
        const inProgress = today.filter(
            (a) =>
                (a.status || "").toUpperCase() === "IN_PROGRESS" ||
                (a.status || "").toUpperCase() === "EM ANDAMENTO"
        ).length
        const pending = Math.max(0, todayTotal - done - inProgress)
        return {
            total: todayTotal,
            done,
            pending,
            inProgress,
            completedPct: todayTotal === 0 ? 0 : Math.min(100, Math.round((done / todayTotal) * 100)),
            pendingPct: todayTotal === 0 ? 0 : Math.min(100, Math.round((pending / todayTotal) * 100)),
        }
    } catch (e) {
        return { total: 0, done: 0, pending: 0, inProgress: 0, completedPct: 0, pendingPct: 0 }
    }
}

export default async function DashboardPage() {
    const session = await auth()
    if (!session) redirect("/")

    const greetingName = session.user.name ?? "Administrador"
    const s = await buildTodayStats()

    const metricsTotal = [
        { label: "TOTAL PREVISTO", value: s.total },
        { label: "FINALIZADOS", value: s.done, valueClassName: "text-brand-600" },
    ]
    const metricsPending = [
        { label: "NA FILA", value: s.pending },
        { label: "EM ATENDIMENTO", value: s.inProgress, valueClassName: "text-brand-600" },
    ]
    const finalPct = s.total === 0 ? 0 : s.completedPct
    const pendingPct = s.total === 0 ? 0 : s.pendingPct
    const totalValue = metricsTotal[1].value as number
    const pendingValue = metricsPending[0].value as number
    const inProgressValue = metricsPending[1].value as number

    return (
        <DashboardLayout session={session}>
            <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-serif font-semibold text-brand-800">
                    Painel de Controle - Visão Geral
                </h1>
                <p className="mt-2 text-sm md:text-base text-neutral-600">
                    Bem-vindo de volta, {greetingName}. Aqui está o resumo do dia.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                <StatCard
                    title="Atendimentos Realizados (Hoje)"
                    titleClassName="text-brand-700"
                    percent={totalValue > 0 ? (finalPct >= 10 ? finalPct : 8) : 8}
                    percentLabel={finalPct >= 10 ? `${finalPct}% CONCLUÍDO` : "CONCLUÍDO"}
                    ringColor="stroke-brand-700"
                    metrics={metricsTotal}
                />
                <StatCard
                    title="Atendimentos Pendentes (Hoje)"
                    titleClassName="text-neutral-600"
                    percent={pendingValue + inProgressValue > 0 ? (pendingPct >= 10 ? pendingPct : 6) : 6}
                    percentLabel={pendingPct >= 10 ? `${pendingPct}% AGUARDANDO` : "AGUARDANDO"}
                    ringColor="stroke-neutral-600"
                    metrics={metricsPending}
                />
            </div>

            <RecentActivity />
        </DashboardLayout>
    )
}
