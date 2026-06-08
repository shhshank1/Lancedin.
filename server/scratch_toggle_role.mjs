import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config({ override: true });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.findUnique({
    where: { id: "a3bc27c9-ad28-4a40-9312-0595fc31907b" }
  });

  if (!user) {
    console.log("User Zoro not found");
    return;
  }

  const newRole = user.role === "TALENT" ? "SEEKER" : "TALENT";
  
  await prisma.user.update({
    where: { id: user.id },
    data: { role: newRole }
  });

  console.log(`Successfully toggled Zoro's role from ${user.role} to ${newRole}`);
  
  await prisma.$disconnect();
  await pool.end();
}

main().catch(e => { console.error(e.message); process.exit(1); });
