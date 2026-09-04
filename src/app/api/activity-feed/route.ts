import { NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"

export const dynamic = "force-dynamic"

type FeedItem =
    | {
          id: string
          kind: "patient_new" | "doctor_new"
          createdAt: string
          title: string
          description: string
          href: string
      }
    | {
          id: string
          kind: "appointment_scheduled" | "appointment_confirmed" | "appointment_done"
          createdAt: string
          title: string
          description: string
          href: string
          dateTime: string
      }

function isoStartOfToday(): string {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d.toISOString()
}
function isoEndOfToday(): string {
    const d = new Date()
    d.setHours(23, 59, 59, 999)
    return d.toISOString()
}
function isoStartOfMonth(): string {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0).toISOString()
}

export async function GET() {
    try {
        const todayStart = isoStartOfToday()
        const todayEnd = isoEndOfToday()
        const monthStart = isoStartOfMonth()
        const oneWeekAgo = new Date(Date.now() - 7 * 86400000).toISOString()

        // Stats cards
        const [
            totalPatients,
            totalDoctors,
            allTodayAppointments,
            totalAppointmentsMonth,
            recentPatients,
            recentDoctors,
            recentAppointments,
        ] = await Promise.all([
            prisma.patient.count(),
            prisma.user.count({ where: { role: "DOCTOR" } }),
            prisma.appointment.findMany({
                where: { dateTime: { gte: todayStart, lte: todayEnd } },
                include: {
                    patient: { select: { id: true, fullName: true } },
                    doctor: { select: { id: true, name: true } },
                },
                orderBy: { dateTime: "asc" },
            }),
            prisma.appointment.count({
                where: { dateTime: { gte: monthStart } },
            }),
            prisma.patient.findMany({
                where: { createdAt: { gte: oneWeekAgo } },
                include: { registeredBy: { select: { id: true, name: true } } },
                orderBy: { createdAt: "desc" },
                take: 6,
            }),
            prisma.user.findMany({
                where: { role: "DOCTOR", createdAt: { gte: oneWeekAgo } },
                include: { doctorProfile: true },
                orderBy: { createdAt: "desc" },
                take: 3,
            }),
            prisma.appointment.findMany({
                where: { createdAt: { gte: oneWeekAgo } },
                include: {
                    patient: { select: { id: true, fullName: true } },
                    doctor: { select: { id: true, name: true } },
                },
                orderBy: { createdAt: "desc" },
                take: 8,
            }),
        ])

        // Stats
        const todayTotal = allTodayAppointments.length
        const doneStatuses = ["COMPLETED", "DONE", "FINISHED", "CANCELLED"]
        const scheduledStatuses = ["CONFIRMED", "SCHEDULED", "CONFIRMADO", "PENDING", "AGENDADO"]
        const todayDone = allTodayAppointments.filter((a) =>
            doneStatuses.includes((a.status || "").toUpperCase())
        ).length
        const todayInProgress = allTodayAppointments.filter(
            (a) => (a.status || "").toUpperCase() === "IN_PROGRESS" || (a.status || "").toUpperCase() === "EM ANDAMENTO"
        ).length
        const todayPending = Math.max(0, todayTotal - todayDone - todayInProgress)

        const stats = {
            todayTotal,
            todayDone,
            todayInProgress,
            todayPending,
            todayCompletedPercent: todayTotal === 0 ? 0 : Math.min(100, Math.round((todayDone / todayTotal) * 100)),
            todayPendingPercent: todayTotal === 0 ? 0 : Math.min(100, Math.round((todayPending / todayTotal) * 100)),
            totalPatients,
            totalDoctors,
            totalAppointmentsMonth,
        }

        // Feed de atividades
        const items: FeedItem[] = []

        // Patients novos
        for (const p of recentPatients) {
            const name = p.fullName || "Paciente"
            items.push({
                id: `p-${p.id}`,
                kind: "patient_new",
                createdAt: p.createdAt.toISOString(),
                title: `${name} cadastrado(a)`,
                description: p.registeredBy?.name
                    ? `Prontuário aberto por ${p.registeredBy.name}`
                    : "Novo paciente cadastrado no sistema",
                href: `/dashboard/pacientes/${p.id}/historico`,
            })
        }

        // Doctors novos
        for (const d of recentDoctors) {
            const name = d.name || "Médico(a)"
            const crm = (d.doctorProfile as any)?.crm
            items.push({
                id: `d-${d.id}`,
                kind: "doctor_new",
                createdAt: d.createdAt.toISOString(),
                title: `${name} adicionado(a) ao corpo clínico`,
                description: crm ? `CRM: ${crm} ${((d.doctorProfile as any)?.crmUf || "").toUpperCase()}` : "Novo profissional habilitado",
                href: `/dashboard/medicos/${d.id}`,
            })
        }

        // Agendamentos recentes
        for (const a of recentAppointments) {
            const patient = a.patient?.fullName || "Paciente"
            const doctor = a.doctor?.name || "Médico(a)"
            const statusUp = (a.status || "SCHEDULED").toUpperCase()
            const kind =
                doneStatuses.includes(statusUp)
                    ? ("appointment_done" as const)
                    : scheduledStatuses.includes(statusUp) && statusUp !== "PENDING"
                        ? ("appointment_confirmed" as const)
                        : ("appointment_scheduled" as const)

            let description = `Com ${doctor}`
            if (a.type) description = `${a.type} · ${description}`
            items.push({
                id: `a-${a.id}`,
                kind,
                createdAt: a.createdAt.toISOString(),
                dateTime: a.dateTime.toISOString(),
                title: `${patient}`,
                description,
                href: "/dashboard/agendamento",
            })
        }

        // Ordena por createdAt DESC (mais recentes primeiro)
        items.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))

        const maxItems = 8
        const feed = items.slice(0, maxItems)

        return NextResponse.json(
            {
                ok: true,
                stats,
                feed,
            },
            { status: 200 }
        )
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        const missing = /P2022|does not exist|ColumnNotFound/i.test(msg)
        return NextResponse.json(
            {
                ok: false,
                stats: null,
                feed: [],
                error: missing
                    ? "Tabelas Patient/Doctor/Appointment desatualizadas. Execute npx prisma migrate dev."
                    : msg,
            },
            { status: missing ? 503 : 500 }
        )
    }
}
