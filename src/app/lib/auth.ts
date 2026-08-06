import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"
import prisma from "./prisma"
import type { Role } from "../../generated/prisma/client"

type DbUser = {
    id: string
    name: string | null
    email: string | null
    emailVerified: Date | null
    image: string | null
    passwordHash?: string | null
    cpf?: string | null
    phone?: string | null
    role?: Role | null
    createdAt?: Date
    updatedAt?: Date
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    trustHost: true,
    session: { strategy: "jwt" },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                    scope: "openid email profile",
                },
            },
        }),
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "E-mail", type: "email" },
                password: { label: "Senha", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const rawUser = await prisma.user.findUnique({
                    where: { email: String(credentials.email) },
                })

                const user = rawUser as DbUser | null

                if (!user || !user.passwordHash) {
                    return null
                }

                const isValid = await bcrypt.compare(
                    String(credentials.password),
                    user.passwordHash
                )

                if (!isValid) {
                    return null
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: (user.role ?? "SECRETARY") as Role,
                }
            },
        }),
    ],
    pages: {
        signIn: "/",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = (user as unknown as { role: Role }).role ?? "SECRETARY"
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.role = (token.role as Role | undefined) ?? "SECRETARY"
            }
            return session
        },
    },
})
