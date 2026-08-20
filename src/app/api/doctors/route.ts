import { NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"

export async function GET() {
    try {
        const doctors = await prisma.user.findMany({
            where: { role: "DOCTOR" },
            include: {
                doctorProfile: true,
            },
            orderBy: [{ name: "asc" }],
        })

        return NextResponse.json({ doctors }, { status: 200 })
    } catch (error) {
        console.error("GET doctors error:", error)
        return NextResponse.json(
            { error: "Erro interno ao listar médicos" },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
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
        } = body

        if (!fullName || !crm || !crmUf || !specialties || !specialties.length) {
            return NextResponse.json(
                { error: "Nome, CRM, UF do CRM e pelo menos 1 especialidade são obrigatórios" },
                { status: 400 }
            )
        }

        try {
            const existingCrm = await prisma.doctorProfile.findFirst({
                where: { crm },
            })
            if (existingCrm) {
                return NextResponse.json(
                    { error: "Já existe um médico com este CRM" },
                    { status: 409 }
                )
            }
        } catch (dbErr: any) {
            const code = dbErr?.code
            if (code === "P2022" || /does not exist|ColumnNotFound/i.test(String(dbErr?.message ?? ""))) {
                return NextResponse.json(
                    { error: "Banco de dados desatualizado. Por favor, execute `npx prisma migrate dev` no terminal para aplicar as migrations pendentes." },
                    { status: 503 }
                )
            }
            throw dbErr
        }

        if (documentId) {
            const existingCpf = await prisma.user.findFirst({
                where: { cpf: documentId },
            })
            if (existingCpf) {
                return NextResponse.json(
                    { error: "Já existe um usuário com este CPF" },
                    { status: 409 }
                )
            }
        }

        if (email) {
            const existingEmail = await prisma.user.findUnique({
                where: { email },
            })
            if (existingEmail) {
                return NextResponse.json(
                    { error: "Já existe um usuário com este e-mail" },
                    { status: 409 }
                )
            }
        }

        const workDays = Object.entries(days ?? {})
            .filter(([, v]) => Boolean(v))
            .map(([k]) => k)

        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    name: fullName,
                    email: email || null,
                    cpf: documentId || null,
                    phone: phone || null,
                    birthDate: birthDate ? new Date(birthDate) : null,
                    gender: gender || null,
                    role: "DOCTOR",
                },
            })

            const profile = await tx.doctorProfile.create({
                data: {
                    userId: user.id,
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
                },
            })

            return { user, profile }
        })

        return NextResponse.json(
            {
                message: "Médico cadastrado com sucesso",
                id: result.user.id,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("POST doctors error:", error)
        return NextResponse.json(
            { error: "Erro interno ao cadastrar médico" },
            { status: 500 }
        )
    }
}
