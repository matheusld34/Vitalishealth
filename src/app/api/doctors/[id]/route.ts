import { NextResponse } from "next/server"
import { auth } from "@/app/lib/auth"
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

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Não autenticado." }, { status: 401 })
        }

        const { id } = await params
        const body = await request.json().catch(() => ({}))
        const {
            fullName,
            birthDate,
            gender,
            documentId,
            email,
            phone,
            crm,
            crmUf,
            specialties,
            bio,
            days,
            startMorning,
            endMorning,
            startAfternoon,
            endAfternoon,
            notes,
        } = body ?? {}

        if (!fullName || !crm || !crmUf || !Array.isArray(specialties) || !specialties.length) {
            return NextResponse.json(
                { error: "Nome, CRM, UF do CRM e pelo menos 1 especialidade são obrigatórios" },
                { status: 400 }
            )
        }

        const existing = await prisma.user.findUnique({
            where: { id },
            select: { id: true, role: true },
        })
        if (!existing || existing.role !== "DOCTOR") {
            return NextResponse.json({ error: "Médico não encontrado" }, { status: 404 })
        }

        const role = session.user.role
        const isOwner = id === session.user.id
        if (role !== "MASTER" && role !== "SECRETARY" && !(role === "DOCTOR" && isOwner)) {
            return NextResponse.json(
                { error: "Você não tem permissão para editar este médico." },
                { status: 403 }
            )
        }

        const crmOwner = await prisma.doctorProfile.findFirst({
            where: { crm, NOT: { userId: id } },
            select: { id: true },
        })
        if (crmOwner) {
            return NextResponse.json(
                { error: "Já existe um médico com este CRM" },
                { status: 409 }
            )
        }

        if (documentId) {
            const cpfOwner = await prisma.user.findFirst({
                where: { cpf: documentId, NOT: { id } },
                select: { id: true },
            })
            if (cpfOwner) {
                return NextResponse.json(
                    { error: "Já existe um usuário com este CPF" },
                    { status: 409 }
                )
            }
        }

        if (email) {
            const emailOwner = await prisma.user.findFirst({
                where: { email, NOT: { id } },
                select: { id: true },
            })
            if (emailOwner) {
                return NextResponse.json(
                    { error: "Já existe um usuário com este e-mail" },
                    { status: 409 }
                )
            }
        }

        const workDays = Object.entries(days ?? {})
            .filter(([, v]) => Boolean(v))
            .map(([k]) => k)

        await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id },
                data: {
                    name: fullName,
                    email: email || null,
                    cpf: documentId || null,
                    phone: phone || null,
                    birthDate: birthDate ? new Date(birthDate) : null,
                    gender: gender || null,
                },
            })

            const profileData = {
                crm,
                crmUf,
                specialties,
                bio: bio || null,
                workDays,
                startMorning: startMorning || null,
                endMorning: endMorning || null,
                startAfternoon: startAfternoon || null,
                endAfternoon: endAfternoon || null,
                notes: notes || null,
            }

            await tx.doctorProfile.upsert({
                where: { userId: id },
                update: profileData,
                create: { userId: id, ...profileData },
            })
        })

        return NextResponse.json(
            { message: "Informações do médico atualizadas com sucesso", id },
            { status: 200 }
        )
    } catch (error: any) {
        console.error("PATCH doctor error:", error)
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
            { error: "Erro interno ao atualizar médico" },
            { status: 500 }
        )
    }
}
