import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

function getDbUrl(): string {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) {
    return `file://${path.resolve(process.cwd(), "dev.db")}`;
  }
  if (rawUrl.startsWith("file:./") || rawUrl.startsWith("file:../")) {
    const rel = rawUrl.replace("file:", "");
    return `file://${path.resolve(process.cwd(), rel)}`;
  }
  if (rawUrl.startsWith("file:/data/") || rawUrl.startsWith("file:///")) {
    return rawUrl;
  }
  return `file://${rawUrl.replace("file:", "")}`;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaLibSql({ url: getDbUrl() });
  return new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./dev.db" }),
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error"] : [],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
