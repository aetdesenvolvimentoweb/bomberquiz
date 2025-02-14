import { PrismaClient } from "@prisma/client";

/**
 * Interface global para o cliente Prisma
 */
interface GlobalPrisma {
  prismaClient: PrismaClient;
}

/**
 * Cliente Prisma global para reutilização de conexão
 */
const globalPrisma = global as unknown as GlobalPrisma;

/**
 * Instância do cliente Prisma
 * Reutiliza a conexão existente em desenvolvimento
 */
const prismaClient = globalPrisma.prismaClient || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalPrisma.prismaClient = prismaClient;
}

export { prismaClient };
