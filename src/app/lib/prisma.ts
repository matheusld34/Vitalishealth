import "dotenv/config"
import { PrismaClient } from "../../generated/prisma/client"

//
// Conexão com o banco Neon.
//
// IMPORTANTE: o adaptador `PrismaNeon` recebe um `PoolConfig` do
// `@neondatabase/serverless` — ou seja, um OBJETO `{ connectionString }`
// e NÃO uma instância de `Pool`. Passar uma instância faz o adaptador
// resolver a connection string como `undefined` e o driver cai no
// erro "No database host or connection string was set".
//
// Estratégia em camadas (nunca quebra o build se faltar um pacote):
//   1. Neon WebSocket (porta 443) — passa na maioria dos firewalls
//   2. PrismaPg (TCP 5432)
//
type PrismaOptions = ConstructorParameters<typeof PrismaClient>[0]

function buildOptions(): PrismaOptions {
    const connectionString = process.env.DATABASE_URL

    // ---- 1. Driver Neon (WebSocket / porta 443) ----
    if (connectionString) {
        try {
            const { PrismaNeon } = require("@prisma/adapter-neon")
            if (PrismaNeon) {
                // PrismaNeon espera o PoolConfig (objeto), não um Pool instanciado
                const adapter = new PrismaNeon({ connectionString })
                return { adapter } as PrismaOptions
            }
        } catch (e: any) {
            console.warn("[prisma] Driver Neon indisponível, tentando PrismaPg...", e?.message || String(e))
        }

        // ---- 2. Fallback PrismaPg (TCP 5432) ----
        try {
            const { PrismaPg } = require("@prisma/adapter-pg")
            if (PrismaPg) {
                const adapter = new PrismaPg({ connectionString })
                return { adapter } as PrismaOptions
            }
        } catch (e: any) {
            console.warn("[prisma] Driver PrismaPg indisponível, seguindo sem adapter...", e?.message || String(e))
        }
    } else {
        console.warn("[prisma] DATABASE_URL não definida no ambiente.")
    }

    return {} as PrismaOptions
}

const options = buildOptions()

let prisma: PrismaClient

if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient(options)
} else {
    const globalWithPrisma = global as typeof globalThis & { prisma?: PrismaClient }
    if (!globalWithPrisma.prisma) {
        globalWithPrisma.prisma = new PrismaClient(options)
    }
    prisma = globalWithPrisma.prisma
}

export default prisma
