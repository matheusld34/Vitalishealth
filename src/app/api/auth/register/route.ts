import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/app/lib/prisma"

type AccountType = "SECRETARY" | "DOCTOR"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const {
            fullName,
            cpf,
            phone,
            email,
            password,
            role,
            crm,
            crmUf,
            specialties,
        } = body

        if (!fullName || !email || !password) {
            return NextResponse.json(
                { error: "Nome, e-mail e senha são obrigatórios" },
                { status: 400 }
            )
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "Senha deve ter no mínimo 8 caracteres" },
                { status: 400 }
            )
        }

        const accountType: AccountType = role === "DOCTOR" ? "DOCTOR" : "SECRETARY"

        const specialtyList: string[] = Array.isArray(specialties)
            ? specialties
                .filter((s: unknown): s is string => typeof s === "string")
                .map((s) => s.trim())
                .filter(Boolean)
            : []

        const cleanCrm = typeof crm === "string" ? crm.trim() : ""
        const cleanCrmUf = typeof crmUf === "string" ? crmUf.trim().toUpperCase() : ""

        if (accountType === "DOCTOR") {
            if (!cleanCrm || !cleanCrmUf || specialtyList.length === 0) {
                return NextResponse.json(
                    { error: "CRM, UF do CRM e pelo menos 1 especialidade são obrigatórios para médicos" },
                    { status: 400 }
                )
            }

            const existingCrm = await prisma.doctorProfile.findFirst({
                where: { crm: cleanCrm },
            })
            if (existingCrm) {
                return NextResponse.json(
                    { error: "Já existe um médico cadastrado com este CRM" },
                    { status: 409 }
                )
            }
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: "Já existe uma conta com este e-mail" },
                { status: 409 }
            )
        }

        if (cpf) {
            const existingCpf = await prisma.user.findFirst({
                where: { cpf },
            })
            if (existingCpf) {
                return NextResponse.json(
                    { error: "Já existe uma conta com este CPF" },
                    { status: 409 }
                )
            }
        }

        const passwordHash = await bcrypt.hash(password, 12)

        if (accountType === "DOCTOR") {
            const user = await prisma.$transaction(async (tx) => {
                const created = await tx.user.create({
                    data: {
                        name: fullName,
                        email,
                        passwordHash,
                        cpf: cpf || null,
                        phone: phone || null,
                        role: "DOCTOR",
                    },
                    select: { id: true, name: true, email: true, role: true },
                })

                await tx.doctorProfile.create({
                    data: {
                        userId: created.id,
                        crm: cleanCrm,
                        crmUf: cleanCrmUf,
                        specialties: specialtyList,
                    },
                })

                return created
            })

            return NextResponse.json(
                { message: "Conta médica criada com sucesso", user },
                { status: 201 }
            )
        }

        const user = await prisma.user.create({
            data: {
                name: fullName,
                email,
                passwordHash,
                cpf: cpf || null,
                phone: phone || null,
                role: "SECRETARY",
            },
            select: { id: true, name: true, email: true, role: true },
        })

        return NextResponse.json(
            { message: "Conta criada com sucesso", user },
            { status: 201 }
        )
    } catch (error) {
        console.error("Register error:", error)
        return NextResponse.json(
            { error: "Erro interno no servidor" },
            { status: 500 }
        )
    }
}
