import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    console.log('Connected.');
    const user = await prisma.user.findUnique({
      where: { email: 'nguyen@gmail.com' }
    });
    console.log('User found:', user);
  } catch (e) {
    console.error('ERROR OCCURRED:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
