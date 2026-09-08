import { NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolved = await params
        const doctor = await prisma.user.findUnique({
            where: {
                id: resolved.id,
                role: "DOCTOR",
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                birthDate: true,
                gender: true,
                cpf: true,
                doctorProfile: {
                    select: {
                        id: true,
                        crm: true,
                        crmUf: true,
                        specialties: true,
                        bio: true,
                        workDays: true,
                        startMorning: true,
                        endMorning: true,
                        startAfternoon: true,
                        endAfternoon: true,
                        notes: true,
                        createdAt: true,
                    },
                },
            },
        })

        if (!doctor) {
            return NextResponse.json(
                { error: "Médico não encontrado" },
                { status: 404 }
            )
        }

        return NextResponse.json({ doctor }, { status: 200 })
    } catch (error: any) {
        console.error("GET doctor by id error:", error)
        const msg = error?.message ?? ""
        if (
            error?.code === "P2022" ||
            msg.includes("ColumnNotFound") ||
            msg.includes("does not exist in current database")
        ) {
            return NextResponse.json(
                {
                    error:
                        "Banco de dados desatualizado. Execute npx prisma migrate dev para aplicar migrations do DoctorProfile.",
                },
                { status: 503 }
            )
        }
        return NextResponse.json(
            { error: "Erro interno ao buscar médico" },
            { status: 500 }
        )
    }
}
