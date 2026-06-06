import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";
import path from "path";

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;
  const isEdge = process.env.NEXT_RUNTIME === "edge";
  if (isEdge && connectionString && connectionString.includes("neon.tech")) {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool as any);
    return new PrismaClient({ adapter });
  }
  
  // Resolve relative SQLite connection strings to absolute path from project root
  if (connectionString && connectionString.startsWith("file:")) {
    const dbPath = path.join(process.cwd(), "prisma", "dev.db");
    return new PrismaClient({
      datasources: {
        db: {
          url: `file:${dbPath}`,
        },
      },
    });
  }

  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const db = globalThis.prismaGlobal ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = db;
}
