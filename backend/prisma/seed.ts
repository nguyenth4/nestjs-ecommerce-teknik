import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaClient, RoleName } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Bắt đầu chạy Seed Data...');

  // 1. Tạo Roles
  const adminRole = await prisma.role.upsert({
    where: { name: RoleName.ADMIN },
    update: {},
    create: {
      name: RoleName.ADMIN,
      description: 'Quản trị viên hệ thống',
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: RoleName.USER },
    update: {},
    create: {
      name: RoleName.USER,
      description: 'Khách hàng',
    },
  });

  console.log('✅ Đã tạo Roles:', adminRole.name, userRole.name);

  // 2. Tạo Users (Hash password)
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { password: hashedAdminPassword }, // Cập nhật pass mới luôn nếu tồn tại
    create: {
      email: 'admin@example.com',
      password: hashedAdminPassword,
      firstName: 'Admin',
      lastName: 'System',
      roleId: adminRole.id,
    },
  });

  const hashedUserPassword = await bcrypt.hash('user123', 10);
  const normalUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: { password: hashedUserPassword },
    create: {
      email: 'user@example.com',
      password: hashedUserPassword,
      firstName: 'Nguyen',
      lastName: 'Van A',
      roleId: userRole.id,
    },
  });

  console.log('✅ Đã tạo Users:', adminUser.email, normalUser.email);

  // 3. Tạo Categories
  const electronicsCategory = await prisma.category.upsert({
    where: { slug: 'dien-tu' },
    update: {},
    create: {
      name: 'Điện tử',
      slug: 'dien-tu',
      description: 'Các sản phẩm điện tử, công nghệ',
    },
  });

  const clothingCategory = await prisma.category.upsert({
    where: { slug: 'thoi-trang' },
    update: {},
    create: {
      name: 'Thời trang',
      slug: 'thoi-trang',
      description: 'Quần áo, giày dép, phụ kiện',
    },
  });

  console.log('✅ Đã tạo Categories:', electronicsCategory.name, clothingCategory.name);

  // 4. Tạo Products
  const laptop = await prisma.product.upsert({
    where: { sku: 'LAP-MAC-M2' },
    update: {
      inventory: {
        upsert: {
          create: { quantity: 10 },
          update: { quantity: 10 },
        },
      },
    },
    create: {
      name: 'Macbook Air M2',
      sku: 'LAP-MAC-M2',
      description: 'Laptop Apple Macbook Air M2 2022',
      price: 25000000,
      categoryId: electronicsCategory.id,
      inventory: {
        create: {
          quantity: 10,
        },
      },
    },
  });

  const tshirt = await prisma.product.upsert({
    where: { sku: 'TSHIRT-01' },
    update: {
      inventory: {
        upsert: {
          create: { quantity: 50 },
          update: { quantity: 50 },
        },
      },
    },
    create: {
      name: 'Áo thun nam Basic',
      sku: 'TSHIRT-01',
      description: 'Áo thun cotton 100% thoáng mát',
      price: 150000,
      categoryId: clothingCategory.id,
      inventory: {
        create: {
          quantity: 50,
        },
      },
    },
  });

  console.log('✅ Đã tạo Products:', laptop.name, tshirt.name);
  console.log('Hoàn tất Seed Data!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
