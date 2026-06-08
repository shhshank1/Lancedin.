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
    const projects = await prisma.project.findMany({
      include: {
        tags: true,
        user: true,
      }
    });
    console.log("Success! Projects in database:", JSON.stringify(projects, null, 2));
  } catch (e: any) {
    console.error("Failed to query projects", e.message);
  }
}
test();
