import { NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"

export const dynamic = "force-dynamic"

type FeedKind =
    | "patient_new"
    | "doctor_new"
    | "appointment_scheduled"
    | "appointment_confirmed"
    | "appointment_urgent"
    | "appointment_done"
    | "appointment_canceled"

type FeedItem = {
    id: string
    kind: FeedKind
    /** Momento da atividade (usado também na ordenação e no "x atrás" da UI). */
    createdAt: string
    title: string
    description: string
    href: string
    dateTime?: string
}

/** Como cada status do enum AppointmentStatus aparece no feed. */
const STATUS_META: Record<string, { kind: FeedKind; label: string }> = {
    SCHEDULED: { kind: "appointment_scheduled", label: "Agendamento criado" },
    CONFIRMED: { kind: "appointment_confirmed", label: "Consulta confirmada" },
    URGENTE: { kind: "appointment_urgent", label: "Atendimento urgente" },
    COMPLETED: { kind: "appointment_done", label: "Consulta finalizada" },
    CANCELED: { kind: "appointment_canceled", label: "Consulta cancelada" },
    NO_SHOW: { kind: "appointment_canceled", label: "Paciente não compareceu" },
}

const MAX_ITEMS = 8

export async function GET() {
    try {
        // Sem janela fixa de datas: o feed sempre mostra as atividades mais
        // recentes do sistema, sejam de hoje ou de meses atrás.
        const [recentPatients, recentDoctors, recentAppointments] = await Promise.all([
            prisma.patient.findMany({
                select: {
                    id: true,
                    fullName: true,
                    createdAt: true,
                    registeredBy: { select: { id: true, name: true } },
                },
                orderBy: { createdAt: "desc" },
                take: MAX_ITEMS,
            }),
            prisma.user.findMany({
                where: { role: "DOCTOR" },
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
                    doctorProfile: { select: { crm: true, crmUf: true, specialties: true } },
                },
                orderBy: { createdAt: "desc" },
                take: MAX_ITEMS,
            }),
            prisma.appointment.findMany({
                select: {
                    id: true,
                    status: true,
                    dateTime: true,
                    createdAt: true,
                    updatedAt: true,
                    specialties: true,
                    patient: { select: { id: true, fullName: true } },
                    doctor: { select: { id: true, name: true } },
                },
                // updatedAt: uma mudança de status (confirmar, finalizar, cancelar)
                // sobe o item no feed, refletindo a atualização real do sistema.
                orderBy: { updatedAt: "desc" },
                take: MAX_ITEMS,
            }),
        ])

        const items: FeedItem[] = []

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

        for (const d of recentDoctors) {
            const name = d.name || "Médico(a)"
            const profile = d.doctorProfile
            const specialties = profile?.specialties?.length ? profile.specialties.join(" / ") : null
            const crm = profile?.crm ? `CRM ${profile.crm}${profile.crmUf ? `-${profile.crmUf}` : ""}` : null
            items.push({
                id: `d-${d.id}`,
                kind: "doctor_new",
                createdAt: d.createdAt.toISOString(),
                title: `${name} adicionado(a) ao corpo clínico`,
                description: [specialties, crm].filter(Boolean).join(" · ") || "Novo profissional habilitado",
                href: `/dashboard/medicos/${d.id}`,
            })
        }

        for (const a of recentAppointments) {
            const patient = a.patient?.fullName || "Paciente"
            const doctor = a.doctor?.name || "Médico(a)"
            const meta = STATUS_META[a.status] ?? STATUS_META.SCHEDULED
            const specialty = a.specialties?.[0]
            items.push({
                id: `a-${a.id}`,
                kind: meta.kind,
                createdAt: a.updatedAt.toISOString(),
                title: patient,
                description: [meta.label, specialty, `Com ${doctor}`].filter(Boolean).join(" · "),
                href: "/dashboard/agendamento",
                dateTime: a.dateTime.toISOString(),
            })
        }

        items.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))

        return NextResponse.json({ ok: true, feed: items.slice(0, MAX_ITEMS) }, { status: 200 })
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        const missing = /P2022|does not exist|ColumnNotFound/i.test(msg)
        return NextResponse.json(
            {
                ok: false,
                feed: [],
                error: missing
                    ? "Tabelas Patient/Doctor/Appointment desatualizadas. Execute npx prisma migrate dev."
                    : msg,
            },
            { status: missing ? 503 : 500 }
        )
    }
}
