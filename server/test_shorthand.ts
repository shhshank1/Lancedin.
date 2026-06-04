import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
dotenv.config();

async function test() {
  try {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
    const prisma = new PrismaClient({ adapter });
    const users = await prisma.user.findMany();
    console.log("Success with shorthand adapter! Users:", users);
  } catch (e: any) {
    console.error("Failed with shorthand adapter", e.message);
  }
}
test();
