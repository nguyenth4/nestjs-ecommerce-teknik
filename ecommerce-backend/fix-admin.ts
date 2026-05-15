import { PrismaClient } from './src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.findUnique({ where: { name: 'admin' } });
  if (!adminRole) {
    console.log('Admin role not found!');
    return;
  }
  
  const user = await prisma.user.findUnique({ where: { email: 'admin@teknik.com' } });
  if (user) {
    await prisma.user.update({
      where: { email: 'admin@teknik.com' },
      data: { roleId: adminRole.id }
    });
    console.log('Successfully granted admin role to admin@teknik.com');
  } else {
    console.log('User admin@teknik.com not found. Please run seed first.');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
