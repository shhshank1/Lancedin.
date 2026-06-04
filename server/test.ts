import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();

async function test() {
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });
    const users = await prisma.user.findMany();
    console.log("Success with PrismaPg adapter! Users:", users);
  } catch (e: any) {
    console.error("Failed with PrismaPg adapter", e.message);
  }
}
test();
