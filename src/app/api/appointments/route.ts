import { NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
    try {
        const appointments = await prisma.appointment.findMany({
            orderBy: [{ dateTime: "asc" }],
            include: {
                patient: { select: { id: true, fullName: true } },
                doctor: { select: { id: true, name: true } },
                secretary: { select: { id: true, name: true } },
            },
        })

        return NextResponse.json({
            ok: true,
            total: appointments.length,
            appointments,
        }, { status: 200 })
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        const isMissingTable = /does not exist|P2022/i.test(msg)
        return NextResponse.json(
            {
                ok: false,
                appointments: [],
                total: 0,
                error: isMissingTable
                    ? "Tabela appointments não encontrada. Execute `npx prisma migrate dev`."
                    : msg,
            },
            { status: isMissingTable ? 503 : 500 }
        )
    }
}
