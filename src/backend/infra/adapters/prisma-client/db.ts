import { PrismaClient } from "@prisma/client";

const globalPrisma = global as unknown as { prismaClient: PrismaClient };

const db = globalPrisma.prismaClient || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalPrisma.prismaClient = db;
}

export { db };
