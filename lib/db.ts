import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// For Prisma dev server (prisma+postgres://), use accelerateUrl
const connectionString = process.env.DATABASE_URL!;
const isPrismaDevServer = connectionString?.startsWith("prisma+postgres://");

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(isPrismaDevServer ? { accelerateUrl: connectionString } : {}),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
