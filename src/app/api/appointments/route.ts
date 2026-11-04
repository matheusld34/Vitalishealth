import { NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const doctorId = searchParams.get("doctorId") || undefined
        const patientId = searchParams.get("patientId") || undefined
        const limitRaw = searchParams.get("limit")
        const limit = limitRaw && /^\d+$/.test(limitRaw) ? Number(limitRaw) : undefined

        const where: Record<string, unknown> = {}
        if (doctorId) where["doctorId"] = doctorId
        if (patientId) where["patientId"] = patientId

        const appointments = await prisma.appointment.findMany({
            where: Object.keys(where).length ? where : undefined,
            orderBy: [{ dateTime: "asc" }],
            take: limit,
            include: {
                patient: { select: { id: true, fullName: true } },
                doctor: {
                    select: {
                        id: true,
                        name: true,
                        doctorProfile: {
                            select: { specialties: true, crm: true, crmUf: true },
                        },
                    },
                },
                secretary: { select: { id: true, name: true } },
            },
        })

        return NextResponse.json({
            ok: true,
            total: appointments.length,
            filter: { doctorId: doctorId ?? null, patientId: patientId ?? null },
            appointments,
        }, { status: 200 })
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        const isMissingTable = /does not exist|P2022|ColumnNotFound/i.test(msg)
        return NextResponse.json(
            {
                ok: false,
                appointments: [],
                total: 0,
                filter: null,
                error: isMissingTable
                    ? "Tabela appointments desatualizada. Execute `npx prisma migrate dev`."
                    : msg,
            },
            { status: isMissingTable ? 503 : 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const {
            patientId,
            doctorId,
            date,
            time,
            durationMinutes,
            observation,
            specialties,
            urgent,
            reminder,
        } = body ?? {}

        if (!patientId || !doctorId || !date || !time) {
            return NextResponse.json(
                { ok: false, error: "Paciente, médico, data e horário são obrigatórios." },
                { status: 400 }
            )
        }

        // Monta o DateTime local (evita deslocamento de fuso do construtor ISO)
        const [y, m, d] = String(date).split("-").map(Number)
        const [hh, mm] = String(time).split(":").map(Number)
        if (!y || !m || !d || Number.isNaN(hh) || Number.isNaN(mm)) {
            return NextResponse.json(
                { ok: false, error: "Data ou horário inválidos." },
                { status: 400 }
            )
        }
        const dateTime = new Date(y, m - 1, d, hh, mm, 0, 0)

        const [patient, doctor] = await Promise.all([
            prisma.patient.findUnique({ where: { id: patientId }, select: { id: true } }),
            prisma.user.findUnique({ where: { id: doctorId }, select: { id: true } }),
        ])

        if (!patient) {
            return NextResponse.json({ ok: false, error: "Paciente não encontrado." }, { status: 404 })
        }
        if (!doctor) {
            return NextResponse.json({ ok: false, error: "Médico não encontrado." }, { status: 404 })
        }

        // Responsável pelo agendamento (coluna opcional no banco)
        const secretary = await prisma.user.findFirst({
            where: { role: { in: ["SECRETARY", "MASTER"] } },
            select: { id: true },
        })

        const specialtyArr = Array.isArray(specialties)
            ? (specialties as unknown[]).filter((s): s is string => typeof s === "string" && s.length > 0)
            : []

        const duration = Number(durationMinutes)
        const created = await prisma.appointment.create({
            data: {
                patientId,
                doctorId,
                secretaryId: secretary?.id ?? null,
                dateTime,
                durationMinutes: Number.isFinite(duration) && duration > 0 ? duration : 30,
                status: urgent ? "URGENTE" : "SCHEDULED",
                specialties: specialtyArr,
                reminder: reminder !== false,
                observation: observation || null,
            },
            include: {
                patient: { select: { id: true, fullName: true } },
                doctor: { select: { id: true, name: true } },
            },
        })

        return NextResponse.json(
            { ok: true, message: "Agendamento realizado com sucesso.", appointment: created },
            { status: 201 }
        )
    } catch (e) {
        console.error("POST appointments error:", e)
        const msg = e instanceof Error ? e.message : String(e)
        const isMissingTable = /does not exist|P2022|ColumnNotFound/i.test(msg)
        return NextResponse.json(
            {
                ok: false,
                error: isMissingTable
                    ? "Tabela appointments desatualizada. Execute `npx prisma migrate dev`."
                    : "Não foi possível salvar o agendamento.",
                details: msg,
            },
            { status: isMissingTable ? 503 : 500 }
        )
    }
}
