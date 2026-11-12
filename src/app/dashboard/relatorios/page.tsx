import { redirect } from "next/navigation"
import { auth } from "@/app/lib/auth"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import ReportsPage, {
    type PeriodKey,
    type ReportsData,
    type StatusDatum,
    type DoctorRow,
    type LabelCount,
} from "@/components/reports/ReportsPage"
import prisma from "@/app/lib/prisma"

const PERIOD_DAYS: Record<PeriodKey, number> = { "30": 30, "90": 90, "180": 180, "365": 365 }

const STATUS_META: { key: string; label: string; color: string }[] = [
    { key: "SCHEDULED", label: "Agendada", color: "#0ea5e9" },
    { key: "CONFIRMED", label: "Confirmado", color: "#2d9569" },
    { key: "URGENTE", label: "Urgente", color: "#f59e0b" },
    { key: "COMPLETED", label: "Concluído", color: "#6366f1" },
    { key: "CANCELED", label: "Cancelado", color: "#ef4444" },
    { key: "NO_SHOW", label: "Não Compareceu", color: "#a855f7" },
]

const MONTHS_PT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"]

function startOfDay(date: Date): Date {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d
}

function endOfDay(date: Date): Date {
    const d = new Date(date)
    d.setHours(23, 59, 59, 999)
    return d
}

function emptyReport(): ReportsData {
    return {
        kpis: {
            total: 0,
            completed: 0,
            canceled: 0,
            noShow: 0,
            pending: 0,
            completionRate: 0,
            cancelRate: 0,
            noShowRate: 0,
            avgPerDay: 0,
            patients: 0,
            newPatients: 0,
            doctors: 0,
        },
        status: STATUS_META.map((m) => ({ ...m, count: 0 })),
        monthly: [],
        doctors: [],
        specialties: [],
        insurance: [],
    }
}

async function buildReport(period: PeriodKey): Promise<ReportsData> {
    const days = PERIOD_DAYS[period]
    const now = new Date()
    const start = startOfDay(new Date(now.getTime() - (days - 1) * 86_400_000))
    const end = endOfDay(now)
    const monthlyStart = new Date(now.getFullYear(), now.getMonth() - 5, 1)
    const queryStart = start < monthlyStart ? start : monthlyStart

    try {
        const [appointments, patients, doctors, newPatients] = await Promise.all([
            prisma.appointment.findMany({
                where: { dateTime: { gte: queryStart, lte: end } },
                select: {
                    status: true,
                    dateTime: true,
                    doctorId: true,
                    specialties: true,
                    doctor: {
                        select: {
                            name: true,
                            doctorProfile: { select: { specialties: true } },
                        },
                    },
                    patient: { select: { insuranceOperator: true } },
                },
            }),
            prisma.patient.count(),
            prisma.user.count({ where: { role: "DOCTOR" } }),
            prisma.patient.count({ where: { createdAt: { gte: start, lte: end } } }),
        ])

        const inPeriod = appointments.filter((a) => a.dateTime >= start)
        const total = inPeriod.length

        const counts: Record<string, number> = {}
        for (const a of inPeriod) counts[a.status] = (counts[a.status] ?? 0) + 1

        const completed = counts["COMPLETED"] ?? 0
        const canceled = counts["CANCELED"] ?? 0
        const noShow = counts["NO_SHOW"] ?? 0
        const pending = (counts["SCHEDULED"] ?? 0) + (counts["CONFIRMED"] ?? 0) + (counts["URGENTE"] ?? 0)

        const rate = (value: number) => (total > 0 ? Math.round((value / total) * 100) : 0)

        const status: StatusDatum[] = STATUS_META.map((m) => ({ ...m, count: counts[m.key] ?? 0 }))

        // Evolução dos últimos 6 meses (independente do filtro selecionado)
        const buckets = Array.from({ length: 6 }, (_, i) => {
            const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
            return {
                y: d.getFullYear(),
                m: d.getMonth(),
                label: `${MONTHS_PT[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`,
                total: 0,
                completed: 0,
                canceled: 0,
            }
        })
        for (const a of appointments) {
            const bucket = buckets.find((b) => b.y === a.dateTime.getFullYear() && b.m === a.dateTime.getMonth())
            if (!bucket) continue
            bucket.total++
            if (a.status === "COMPLETED") bucket.completed++
            if (a.status === "CANCELED") bucket.canceled++
        }
        const monthly = buckets.map(({ label, total, completed, canceled }) => ({
            label,
            total,
            completed,
            canceled,
        }))

        // Ranking por médico
        const doctorMap = new Map<string, { name: string; specialty: string; total: number; completed: number }>()
        for (const a of inPeriod) {
            const entry = doctorMap.get(a.doctorId) ?? {
                name: a.doctor?.name ?? "—",
                specialty: a.doctor?.doctorProfile?.specialties?.slice(0, 2).join(", ") || "—",
                total: 0,
                completed: 0,
            }
            entry.total++
            if (a.status === "COMPLETED") entry.completed++
            doctorMap.set(a.doctorId, entry)
        }
        const doctorRows: DoctorRow[] = Array.from(doctorMap.entries())
            .map(([id, value]) => ({
                id,
                name: value.name,
                specialty: value.specialty,
                total: value.total,
                completed: value.completed,
                rate: value.total > 0 ? Math.round((value.completed / value.total) * 100) : 0,
            }))
            .sort((a, b) => b.total - a.total)

        // Especialidades
        const specialtyMap = new Map<string, number>()
        for (const a of inPeriod) {
            for (const s of a.specialties ?? []) specialtyMap.set(s, (specialtyMap.get(s) ?? 0) + 1)
        }
        const specialties: LabelCount[] = Array.from(specialtyMap.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 6)

        // Convênios
        const insuranceMap = new Map<string, number>()
        for (const a of inPeriod) {
            const operator = (a.patient?.insuranceOperator || "Particular").trim() || "Particular"
            insuranceMap.set(operator, (insuranceMap.get(operator) ?? 0) + 1)
        }
        const insurance: LabelCount[] = Array.from(insuranceMap.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 6)

        return {
            kpis: {
                total,
                completed,
                canceled,
                noShow,
                pending,
                completionRate: rate(completed),
                cancelRate: rate(canceled),
                noShowRate: rate(noShow),
                avgPerDay: Math.round((total / days) * 10) / 10,
                patients,
                newPatients,
                doctors,
            },
            status,
            monthly,
            doctors: doctorRows,
            specialties,
            insurance,
        }
    } catch (error) {
        console.error("buildReport error:", error)
        return emptyReport()
    }
}

export default async function RelatoriosRoute({
    searchParams,
}: {
    searchParams: Promise<{ periodo?: string }>
}) {
    const session = await auth()
    if (!session) redirect("/")
    if (session.user.role !== "MASTER") redirect("/dashboard")

    const { periodo } = await searchParams
    const period: PeriodKey = periodo === "30" || periodo === "90" || periodo === "180" || periodo === "365"
        ? periodo
        : "90"

    const data = await buildReport(period)

    return (
        <DashboardLayout session={session}>
            <ReportsPage period={period} data={data} />
        </DashboardLayout>
    )
}
