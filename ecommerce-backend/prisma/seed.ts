import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // Create category
  const category = await prisma.category.upsert({
    where: { slug: 'premium-gear' },
    update: {},
    create: {
      name: 'Premium Gear',
      slug: 'premium-gear',
      isActive: true,
    },
  });

  const products = [
    {
      name: 'Neon Cyberpunk Controller',
      sku: 'SKU-001',
      price: 149.99,
      categoryId: category.id,
    },
    {
      name: 'Quantum VR Headset',
      sku: 'SKU-002',
      price: 399.00,
      categoryId: category.id,
    },
    {
      name: 'Astro Mechanical Keyboard',
      sku: 'SKU-003',
      price: 219.50,
      categoryId: category.id,
    },
    {
      name: 'Pulse Audio Over-Ear',
      sku: 'SKU-004',
      price: 289.99,
      categoryId: category.id,
    }
  ];

  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: p,
    });
    await prisma.inventory.upsert({
      where: { productId: product.id },
      update: { quantity: 50 },
      create: { productId: product.id, quantity: 50 },
    });
  }

  console.log('Seeded database with dummy products!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
