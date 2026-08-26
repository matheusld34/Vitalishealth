import { NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"

export async function GET(
    _request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const patient = await prisma.patient.findUnique({
            where: { id: params.id },
            include: {
                registeredBy: {
                    select: { id: true, name: true },
                },
                appointments: {
                    orderBy: { dateTime: "desc" },
                    include: {
                        doctor: {
                            select: {
                                id: true,
                                name: true,
                                doctorProfile: { select: { specialties: true, crm: true, crmUf: true } },
                            },
                        },
                        secretary: { select: { id: true, name: true } },
                    },
                },
                attachments: true,
            },
        })

        if (!patient) {
            return NextResponse.json(
                { error: "Paciente não encontrado" },
                { status: 404 }
            )
        }

        return NextResponse.json({ patient }, { status: 200 })
    } catch (error) {
        console.error("GET patient by id error:", error)
        return NextResponse.json(
            { error: "Erro interno ao buscar paciente" },
            { status: 500 }
        )
    }
}
