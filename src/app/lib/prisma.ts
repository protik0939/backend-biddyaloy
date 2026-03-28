import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import { PrismaClient } from "../../generated/prisma/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
	path: path.resolve(__dirname, "../../../.env"),
	override: false,
});

const normalizeEnv = (value?: string) => value?.trim().replace(/^"(.*)"$/, "$1");

const connectionString =
	normalizeEnv(process.env.DATABASE_URL) ||
	normalizeEnv(process.env.POSTGRES_PRISMA_URL) ||
	normalizeEnv(process.env.POSTGRES_URL);

const safeConnectionString =
	connectionString ?? "postgresql://invalid:invalid@127.0.0.1:5432/invalid";

if (!connectionString) {
	console.error(
		"Database connection string is not set. Provide DATABASE_URL, POSTGRES_PRISMA_URL, or POSTGRES_URL in your deployment environment.",
	);
}

const adapter = new PrismaPg({ connectionString: safeConnectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };