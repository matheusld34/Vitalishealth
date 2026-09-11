
import "dotenv/config"
import { PrismaClient } from "../../generated/prisma/client";

//
// Driver Adapter Neon (WebSocket/HTTPS porta 443) - recomendado para redes restritivas
//
// Estratégia com require() dinâmico + try/catch em 3 camadas:
//   1. Tenta driver Neon   (porta 443 WebSocket - passa por 99% dos firewalls)
//   2. Fallback PrismaPg   (TCP porta 5432)
//   3. Fallback "sem adapter" (driver TCP built-in do Prisma Client Postgres)
//
// Nunca quebra o build, mesmo que um dos pacotes não esteja instalado ainda.
//
type PrismaOptions = ConstructorParameters<typeof PrismaClient>[0];

function buildOptions(): PrismaOptions {
    // ---- 1. Tenta driver Neon ----
    try {
        // Usando require dinâmico para não dar erro de build se faltar pacote
        const adapterNeon = require("@prisma/adapter-neon");
        const serverless = require("@neondatabase/serverless");
        const PrismaNeon = adapterNeon.PrismaNeon as any;
        const Pool = serverless.Pool as any;
        const connectionString = process.env.DATABASE_URL;
        if (connectionString && PrismaNeon && Pool) {
            const pool = new Pool({ connectionString });
            const adapter = new PrismaNeon(pool);
            return { adapter } as PrismaOptions;
        }
    } catch (e: any) {
        console.warn("[prisma] Driver Neon não disponível, tentando PrismaPg...", e?.message || String(e));
    }

    // ---- 2. Fallback PrismaPg (TCP 5432) ----
    try {
        const adapterPg = require("@prisma/adapter-pg");
        const PrismaPg = adapterPg.PrismaPg as any;
        const connectionString = process.env.DATABASE_URL;
        if (connectionString && PrismaPg) {
            const adapter = new PrismaPg({ connectionString });
            return { adapter } as PrismaOptions;
        }
    } catch (e: any) {
        console.warn("[prisma] Driver PrismaPg também não disponível, seguindo sem adapter...", e?.message || String(e));
    }

    // ---- 3. Fallback: sem adapter (driver interno) ----
    return {} as PrismaOptions;
}

const options = buildOptions();

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient(options);
} else {
    let globalWithPrisma = global as typeof globalThis & {
        prisma: PrismaClient;
    };
    if (!globalWithPrisma.prisma) {
        globalWithPrisma.prisma = new PrismaClient(options);
    }
    prisma = globalWithPrisma.prisma;
}
export default prisma;
