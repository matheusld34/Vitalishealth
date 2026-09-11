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
