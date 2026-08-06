import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/app/lib/prisma"

type CreateData = {
  name: string
  email: string
  passwordHash: string
  cpf?: string | null
  phone?: string | null
  role?: "MASTER" | "SECRETARY" | "DOCTOR"
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { fullName, cpf, phone, email, password } = body

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
            // Busca por CPF só é possível se o campo existe no schema; usamos findFirst como fallback seguro
            const existingCpf = await (prisma.user as unknown as {
                findUnique: (args: unknown) => Promise<unknown>
                findFirst: (args: unknown) => Promise<unknown>
            }).findFirst({
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

        const data: CreateData = {
            name: fullName,
            email,
            passwordHash,
            cpf: cpf || null,
            phone: phone || null,
            role: "SECRETARY",
        }

        const user = await (prisma.user as unknown as {
            create: (args: {
                data: CreateData
                select: Record<string, boolean>
            }) => Promise<{
                id: string
                name: string | null
                email: string | null
                role?: unknown
            }>
        }).create({
            data,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
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
