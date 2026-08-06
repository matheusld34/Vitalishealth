import { redirect } from "next/navigation"
import { auth } from "@/app/lib/auth"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import StatCard from "@/components/dashboard/StatCard"
import RecentActivity from "@/components/dashboard/RecentActivity"

export default async function DashboardPage() {
    const session = await auth()
    if (!session) redirect("/")

    const greetingName = session.user.name ?? "Administrador"

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
                    percent={65}
                    percentLabel="CONCLUÍDO"
                    ringColor="stroke-brand-700"
                    metrics={[
                        { label: "TOTAL PREVISTO", value: 42 },
                        { label: "FINALIZADOS", value: 27, valueClassName: "text-brand-600" },
                    ]}
                />
                <StatCard
                    title="Atendimentos Pendentes (Hoje)"
                    titleClassName="text-neutral-600"
                    percent={35}
                    percentLabel="AGUARDANDO"
                    ringColor="stroke-neutral-600"
                    metrics={[
                        { label: "NA FILA", value: 15 },
                        { label: "EM ATENDIMENTO", value: 8, valueClassName: "text-brand-600" },
                    ]}
                />
            </div>

            <RecentActivity />
        </DashboardLayout>
    )
}
