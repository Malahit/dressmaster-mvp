import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // optional seed
  console.log('Seed: nothing to seed yet.');
}
main().finally(() => prisma.$disconnect());
