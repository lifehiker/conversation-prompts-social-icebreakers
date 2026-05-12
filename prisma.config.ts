import "dotenv/config";
import { defineConfig } from "prisma/config";
import path from "path";

// Parse sqlite file path from DATABASE_URL
function getSqliteUrl(): string {
  const rawUrl = process.env["DATABASE_URL"];
  if (!rawUrl) {
    // Default for dev
    return `file://${path.resolve(process.cwd(), "dev.db")}`;
  }
  // Convert "file:./dev.db" -> absolute path
  if (rawUrl.startsWith("file:./") || rawUrl.startsWith("file:../")) {
    const rel = rawUrl.replace("file:", "");
    return `file://${path.resolve(process.cwd(), rel)}`;
  }
  return rawUrl;
}

const datasourceUrl = getSqliteUrl();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: datasourceUrl,
  },
});
