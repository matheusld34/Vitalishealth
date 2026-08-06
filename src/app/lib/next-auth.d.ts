import type { DefaultSession, DefaultUser } from "next-auth"
import type { JWT, DefaultJWT } from "next-auth/jwt"

type Role = "MASTER" | "SECRETARY" | "DOCTOR"

declare module "next-auth" {
    interface User extends DefaultUser {
        role?: Role
    }
    interface Session {
        user: {
            id: string
            role: Role
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id?: string
        role?: Role
    }
}
