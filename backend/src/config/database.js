
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Load the root .env file regardless of the command's working directory.
const envPath = fileURLToPath(new URL("../../../.env", import.meta.url));
dotenv.config({ path: envPath });

if (!process.env.DATABASE_URL_APP) {
  throw new Error("DATABASE_URL_APP is missing from the root .env file.");
}

// Use the restricted application database account.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL_APP,
});

// Create one shared Prisma Client instance.
export const prisma = new PrismaClient({ adapter });
