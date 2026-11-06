import { NextResponse } from "next/server"
import { auth } from "@/app/lib/auth"
import prisma from "@/app/lib/prisma"

export const dynamic = "force-dynamic"

const ALLOWED_STATUS = new Set(["COMPLETED", "NO_SHOW"])

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json(
                { ok: false, error: "Não autenticado." },
                { status: 401 }
            )
        }

        const { id } = await params
        const body = await request.json().catch(() => ({}))
        const status = typeof body?.status === "string" ? body.status : ""

        if (!ALLOWED_STATUS.has(status)) {
            return NextResponse.json(
                { ok: false, error: "Status inválido. Use COMPLETED ou NO_SHOW." },
                { status: 400 }
            )
        }

        const appointment = await prisma.appointment.findUnique({
            where: { id },
            select: { id: true, doctorId: true },
        })

        if (!appointment) {
            return NextResponse.json(
                { ok: false, error: "Consulta não encontrada." },
                { status: 404 }
            )
        }

        const role = session.user.role
        const isOwner = appointment.doctorId === session.user.id

        if (role !== "MASTER" && !(role === "DOCTOR" && isOwner)) {
            return NextResponse.json(
                { ok: false, error: "Você não tem permissão para atualizar esta consulta." },
                { status: 403 }
            )
        }

        const updated = await prisma.appointment.update({
            where: { id },
            data: { status: status as "COMPLETED" | "NO_SHOW" },
            include: {
                patient: { select: { id: true, fullName: true, insuranceOperator: true } },
                doctor: { select: { id: true, name: true } },
            },
        })

        return NextResponse.json(
            { ok: true, message: "Status da consulta atualizado.", appointment: updated },
            { status: 200 }
        )
    } catch (e) {
        console.error("PATCH appointment error:", e)
        const msg = e instanceof Error ? e.message : String(e)
        const isMissingTable = /does not exist|P2022|ColumnNotFound/i.test(msg)
        return NextResponse.json(
            {
                ok: false,
                error: isMissingTable
                    ? "Tabela appointments desatualizada. Execute `npx prisma migrate dev`."
                    : "Não foi possível atualizar a consulta.",
                details: msg,
            },
            { status: isMissingTable ? 503 : 500 }
        )
    }
}
