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
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      role: true,
      _count: { select: { projects: true, messagesSent: true } }
    }
  });
  console.log('=== USERS ===');
  console.log(JSON.stringify(users, null, 2));

  const projects = await prisma.project.findMany({
    select: { id: true, title: true, tags: true, createdAt: true, user: { select: { name: true } } }
  });
  console.log('\n=== PROJECTS ===');
  console.log(JSON.stringify(projects, null, 2));

  const messages = await prisma.message.findMany({
    select: {
      id: true,
      content: true,
      createdAt: true,
      sender: { select: { name: true } },
      conversation: { select: { seekerId: true, talentId: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  });
  console.log('\n=== MESSAGES (last 10) ===');
  console.log(JSON.stringify(messages, null, 2));

  await prisma.$disconnect();
  await pool.end();
}

main().catch(e => { console.error(e.message); process.exit(1); });
