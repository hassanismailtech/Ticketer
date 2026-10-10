import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pgPool?: Pool;
};

const connectionString = process.env.DATABASE_URL;

function createPrismaClient(): PrismaClient {
  if (connectionString) {
    const isNeonOrRemote = connectionString.includes("neon.tech") || connectionString.includes("sslmode=require");
    
    const pool = globalForPrisma.pgPool ?? new Pool({
      connectionString,
      max: process.env.NODE_ENV === "production" ? 10 : 3,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      ssl: isNeonOrRemote ? { rejectUnauthorized: false } : undefined,
    });

    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.pgPool = pool;
    }

    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  }

  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}