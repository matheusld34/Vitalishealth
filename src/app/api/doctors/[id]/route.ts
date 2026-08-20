import { NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"

export async function GET(
    _request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const doctor = await prisma.user.findUnique({
            where: {
                id: params.id,
                role: "DOCTOR",
            },
            include: {
                doctorProfile: true,
            },
        })

        if (!doctor) {
            return NextResponse.json(
                { error: "Médico não encontrado" },
                { status: 404 }
            )
        }

        return NextResponse.json({ doctor }, { status: 200 })
    } catch (error) {
        console.error("GET doctor by id error:", error)
        return NextResponse.json(
            { error: "Erro interno ao buscar médico" },
            { status: 500 }
        )
    }
}
