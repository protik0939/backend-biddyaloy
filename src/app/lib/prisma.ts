import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import { PrismaClient } from "../../generated/prisma/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
	path: path.resolve(__dirname, "../../../.env"),
	override: true,
});

const connectionString = process.env.DATABASE_URL?.trim().replace(/^"(.*)"$/, "$1");

if (!connectionString) {
	throw new Error("DATABASE_URL is not set. Check backend-biddyaloy/.env");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };