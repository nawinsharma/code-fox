/**
 * Prisma Client Instance
 *
 * This file configures and exports a singleton instance of the Prisma Client.
 * It uses the `@prisma/adapter-pg` driver for PostgreSQL serverless environments (if applicable).
 *
 * In development, the instance is attached to `globalThis` to prevent multiple connections
 * during hot-reloads.
 */

import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	max: 10,
	idleTimeoutMillis: 60_000,
	connectionTimeoutMillis: 30_000,
});

const adapter = new PrismaPg({ pool });

const prismaClientSingleton = () => {
	return new PrismaClient({
		adapter,
	});
};

declare const globalThis: {
	prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal || prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
	globalThis.prismaGlobal = prisma;
}

export default prisma;
