import { NextResponse } from "next/server"
import { auth } from "@/app/lib/auth"
import prisma from "@/app/lib/prisma"

const LEAD_OPTIONS = [2, 6, 24, 48]

const DEFAULTS = {
    appointmentReminder: true,
    emailConfirm: true,
    whatsappConfirm: false,
    newAppointment: true,
    dailyDigest: false,
    reminderLeadHours: 24,
}

type Prefs = typeof DEFAULTS

function serialize(p: Prefs): Prefs {
    return {
        appointmentReminder: p.appointmentReminder,
        emailConfirm: p.emailConfirm,
        whatsappConfirm: p.whatsappConfirm,
        newAppointment: p.newAppointment,
        dailyDigest: p.dailyDigest,
        reminderLeadHours: p.reminderLeadHours,
    }
}

function normalize(body: any, base: Prefs): Prefs {
    const bool = (value: unknown, fallback: boolean) =>
        typeof value === "boolean" ? value : fallback
    const lead = Number(body?.reminderLeadHours)
    return {
        appointmentReminder: bool(body?.appointmentReminder, base.appointmentReminder),
        emailConfirm: bool(body?.emailConfirm, base.emailConfirm),
        whatsappConfirm: bool(body?.whatsappConfirm, base.whatsappConfirm),
        newAppointment: bool(body?.newAppointment, base.newAppointment),
        dailyDigest: bool(body?.dailyDigest, base.dailyDigest),
        reminderLeadHours: LEAD_OPTIONS.includes(lead) ? lead : base.reminderLeadHours,
    }
}

function isStaleDb(error: any): boolean {
    const msg = String(error?.message ?? "")
    return (
        error?.code === "P2021" ||
        error?.code === "P2022" ||
        msg.includes("does not exist in current database") ||
        (msg.includes("relation") && msg.includes("does not exist"))
    )
}

export async function GET() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 })
        }

        const row = await prisma.notificationPreference.findUnique({
            where: { userId: session.user.id },
        })

        const preferences: Prefs = row ? serialize(row) : { ...DEFAULTS }
        return NextResponse.json({ ok: true, preferences }, { status: 200 })
    } catch (error: any) {
        console.error("GET notification preferences error:", error)
        if (isStaleDb(error)) {
            return NextResponse.json(
                { ok: false, error: "Banco de dados desatualizado. A tabela de notificações ainda não foi criada." },
                { status: 503 }
            )
        }
        return NextResponse.json(
            { ok: false, error: "Erro interno ao carregar as preferências." },
            { status: 500 }
        )
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 })
        }

        const body = await request.json().catch(() => ({}))

        const existing = await prisma.notificationPreference.findUnique({
            where: { userId: session.user.id },
        })
        const base: Prefs = existing ? serialize(existing) : { ...DEFAULTS }
        const data = normalize(body, base)

        const row = await prisma.notificationPreference.upsert({
            where: { userId: session.user.id },
            update: data,
            create: { userId: session.user.id, ...data },
        })

        return NextResponse.json({ ok: true, preferences: serialize(row) }, { status: 200 })
    } catch (error: any) {
        console.error("PATCH notification preferences error:", error)
        if (isStaleDb(error)) {
            return NextResponse.json(
                { ok: false, error: "Banco de dados desatualizado. A tabela de notificações ainda não foi criada." },
                { status: 503 }
            )
        }
        return NextResponse.json(
            { ok: false, error: "Erro interno ao salvar as preferências." },
            { status: 500 }
        )
    }
}
