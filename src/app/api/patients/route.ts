import { NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"

export async function GET() {
    try {
        const patients = await prisma.patient.findMany({
            include: {
                registeredBy: {
                    select: { id: true, name: true },
                },
                appointments: {
                    orderBy: { dateTime: "desc" },
                    take: 1,
                    include: {
                        doctor: { select: { id: true, name: true } },
                    },
                },
            },
            orderBy: [{ createdAt: "desc" }],
        })

        // Normaliza campos que antes eram salvos em `user` via migrate antiga,
        // agora em Patient.phone/email/etc. Garante retorno sem quebrar front.
        const normalized = patients.map((p) => ({
            id: p.id,
            fullName: p.fullName,
            cpf: p.cpf,
            phone: (p as any).phone ?? null,
            email: (p as any).email ?? null,
            insuranceOperator: (p as any).insuranceOperator ?? null,
            planType: (p as any).planType ?? null,
            clinicalStatus: (p as any).clinicalStatus ?? null,
            createdAt: p.createdAt,
            cep: (p as any).cep ?? null,
            city: (p as any).city ?? null,
            state: (p as any).state ?? null,
            appointments: p.appointments,
            registeredBy: p.registeredBy,
        }))

        return NextResponse.json({ patients: normalized }, { status: 200 })
    } catch (error) {
        console.error("GET patients error:", error)
        const msg = error instanceof Error ? error.message : String(error)
        const isMissing = /P2022|does not exist|ColumnNotFound/i.test(msg)
        return NextResponse.json(
            {
                patients: [],
                error: isMissing
                    ? "Tabela patient desatualizada. Execute `npx prisma migrate dev --name update-patient-schema`."
                    : "Erro interno ao listar pacientes",
            },
            { status: isMissing ? 503 : 500 }
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
            phone,
            email,
            insuranceOperator,
            planType,
            cardNumber,
            cep,
            street,
            number,
            state,
            city,
            clinicalStatus,
            notes,
            registeredById,
        } = body

        if (!fullName || !fullName.trim()) {
            return NextResponse.json(
                { error: "Nome completo é obrigatório" },
                { status: 400 }
            )
        }

        if (documentId) {
            const existingCpf = await prisma.patient.findFirst({
                where: { cpf: documentId },
            })
            if (existingCpf) {
                return NextResponse.json(
                    { error: "Já existe um paciente com este CPF" },
                    { status: 409 }
                )
            }
        }

        const fallbackRegistrar = await prisma.user.findFirst({
            take: 1,
            select: { id: true },
        })
        const registrarId = registeredById || fallbackRegistrar?.id

        if (!registrarId) {
            return NextResponse.json(
                { error: "Nenhum usuário cadastrado. Crie um usuário antes de cadastrar pacientes." },
                { status: 400 }
            )
        }

        try {
            const patient = await prisma.patient.create({
                data: {
                    fullName: fullName.trim(),
                    cpf: documentId || null,
                    phone: phone || null,
                    email: email || null,
                    birthDate: birthDate ? new Date(birthDate) : null,
                    gender: gender || null,

                    insuranceOperator: insuranceOperator || null,
                    planType: planType || null,
                    cardNumber: cardNumber || null,

                    cep: cep || null,
                    street: street || null,
                    addressNumber: number || null,
                    state: state || null,
                    city: city || null,

                    clinicalStatus: clinicalStatus || null,
                    notes: notes || null,

                    registeredById: registrarId,
                },
            })

            return NextResponse.json(
                {
                    message: "Paciente cadastrado com sucesso",
                    id: patient.id,
                },
                { status: 201 }
            )
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
    } catch (error) {
        console.error("POST patients error:", error)
        return NextResponse.json(
            { error: "Erro interno ao cadastrar paciente" },
            { status: 500 }
        )
    }
}
