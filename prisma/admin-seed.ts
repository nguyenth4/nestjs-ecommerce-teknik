import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Administrator',
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@teknik.com' },
    update: {
      passwordHash: hashedPassword,
      roleId: adminRole.id
    },
    create: {
      email: 'admin@teknik.com',
      passwordHash: hashedPassword,
      fullName: 'Super Admin',
      roleId: adminRole.id,
    },
  });

  console.log('Admin user created successfully!');
  console.log('Email: admin@teknik.com');
  console.log('Password: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
