import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Roles
  const adminRole = await prisma.role.upsert({
    where: { code: 'ADMIN' },
    update: {},
    create: { code: 'ADMIN', name: 'Administrator', isActive: true },
  });

  const managerRole = await prisma.role.upsert({
    where: { code: 'MANAGER' },
    update: {},
    create: { code: 'MANAGER', name: 'Manager', isActive: true },
  });

  const userRole = await prisma.role.upsert({
    where: { code: 'USER' },
    update: {},
    create: { code: 'USER', name: 'User', isActive: true },
  });

  // Admin user (default user — id matches DEFAULT_USER_ID in docker-compose)
  const adminPasswordHash = await bcrypt.hash('Admin123!', 12);
  await prisma.user.upsert({
    where: { id: '11111111-1111-1111-1111-111111111111' },
    update: { email: 'admin@erp.local', passwordHash: adminPasswordHash, isActive: true },
    create: {
      id: '11111111-1111-1111-1111-111111111111',
      roleId: adminRole.id,
      fullName: 'Administrator',
      email: 'admin@erp.local',
      passwordHash: adminPasswordHash,
      isActive: true,
    },
  });

  // Item Categories
  const catGoods = await prisma.itemCategory.upsert({
    where: { code: 'GOODS' },
    update: {},
    create: { code: 'GOODS', name: 'Goods' },
  });

  const catServices = await prisma.itemCategory.upsert({
    where: { code: 'SERVICES' },
    update: {},
    create: { code: 'SERVICES', name: 'Services' },
  });

  const catRawMat = await prisma.itemCategory.upsert({
    where: { code: 'RAW_MAT' },
    update: {},
    create: { code: 'RAW_MAT', name: 'Raw Materials', parentId: catGoods.id },
  });

  // Units
  const unitPcs = await prisma.unit.upsert({
    where: { code: 'PCS' },
    update: {},
    create: { code: 'PCS', name: 'Pieces' },
  });

  const unitKg = await prisma.unit.upsert({
    where: { code: 'KG' },
    update: {},
    create: { code: 'KG', name: 'Kilogram' },
  });

  const unitLt = await prisma.unit.upsert({
    where: { code: 'LT' },
    update: {},
    create: { code: 'LT', name: 'Liter' },
  });

  // Tax Rates (Kosovo VAT: 18% standard, 8% reduced, 0% exempt)
  const tax18 = await prisma.taxRate.upsert({
    where: { code: 'VAT18' },
    update: {},
    create: { code: 'VAT18', name: 'VAT 18%', ratePercent: 18, isActive: true },
  });

  const tax8 = await prisma.taxRate.upsert({
    where: { code: 'VAT8' },
    update: {},
    create: { code: 'VAT8', name: 'VAT 8%', ratePercent: 8, isActive: true },
  });

  const tax0 = await prisma.taxRate.upsert({
    where: { code: 'VAT0' },
    update: {},
    create: { code: 'VAT0', name: 'VAT 0% (Exempt)', ratePercent: 0, isActive: true },
  });

  // Warehouses
  const warehouseMain = await prisma.warehouse.upsert({
    where: { code: 'MAIN' },
    update: {},
    create: { code: 'MAIN', name: 'Main Warehouse', address: 'Prishtina, Kosovo', isActive: true },
  });

  const warehouseSecondary = await prisma.warehouse.upsert({
    where: { code: 'SECONDARY' },
    update: {},
    create: { code: 'SECONDARY', name: 'Secondary Warehouse', address: 'Prizren, Kosovo', isActive: true },
  });

  // Payment Methods
  await prisma.paymentMethod.upsert({
    where: { code: 'CASH' },
    update: {},
    create: { code: 'CASH', name: 'Cash', isActive: true },
  });

  await prisma.paymentMethod.upsert({
    where: { code: 'BANK' },
    update: {},
    create: { code: 'BANK', name: 'Bank Transfer', isActive: true },
  });

  await prisma.paymentMethod.upsert({
    where: { code: 'CARD' },
    update: {},
    create: { code: 'CARD', name: 'Card', isActive: true },
  });

  // Document Series
  await prisma.documentSeries.upsert({
    where: { code: 'PI-2025' },
    update: {},
    create: {
      code: 'PI-2025',
      documentType: 'PURCHASE_INVOICE',
      prefix: 'PI-2025-',
      nextNumber: 1,
      isActive: true,
    },
  });

  await prisma.documentSeries.upsert({
    where: { code: 'SI-2025' },
    update: {},
    create: {
      code: 'SI-2025',
      documentType: 'SALES_INVOICE',
      prefix: 'SI-2025-',
      nextNumber: 1,
      isActive: true,
    },
  });

  await prisma.documentSeries.upsert({
    where: { code: 'SR-2025' },
    update: {},
    create: {
      code: 'SR-2025',
      documentType: 'SALES_RETURN',
      prefix: 'SR-2025-',
      nextNumber: 1,
      isActive: true,
    },
  });

  // Items
  const item1 = await prisma.item.upsert({
    where: { code: 'LAPTOP-001' },
    update: {},
    create: {
      code: 'LAPTOP-001',
      name: 'Laptop Pro 15"',
      description: 'High-performance business laptop',
      categoryId: catGoods.id,
      unitId: unitPcs.id,
      taxRateId: tax18.id,
      standardPurchasePrice: 800,
      standardSalesPrice: 1100,
      minSalesPrice: 900,
      isActive: true,
    },
  });

  const item2 = await prisma.item.upsert({
    where: { code: 'MONITOR-001' },
    update: {},
    create: {
      code: 'MONITOR-001',
      name: 'Monitor 24" Full HD',
      categoryId: catGoods.id,
      unitId: unitPcs.id,
      taxRateId: tax18.id,
      standardPurchasePrice: 200,
      standardSalesPrice: 280,
      isActive: true,
    },
  });

  const item3 = await prisma.item.upsert({
    where: { code: 'CABLE-USB' },
    update: {},
    create: {
      code: 'CABLE-USB',
      name: 'USB-C Cable 2m',
      categoryId: catGoods.id,
      unitId: unitPcs.id,
      taxRateId: tax18.id,
      standardPurchasePrice: 5,
      standardSalesPrice: 12,
      isActive: true,
    },
  });

  // Suppliers
  await prisma.supplier.upsert({
    where: { code: 'SUP-001' },
    update: {},
    create: {
      code: 'SUP-001',
      name: 'Tech Distributors Sh.p.k.',
      fiscalNo: '70012345',
      vatNo: '331012345',
      address: 'Rruga Nënë Tereza 10',
      city: 'Prishtinë',
      phone: '+383 44 123 456',
      email: 'info@techdist.ks',
      paymentTermsDays: 30,
      isActive: true,
    },
  });

  await prisma.supplier.upsert({
    where: { code: 'SUP-002' },
    update: {},
    create: {
      code: 'SUP-002',
      name: 'Euro Imports Sh.p.k.',
      fiscalNo: '70098765',
      city: 'Prizren',
      paymentTermsDays: 15,
      isActive: true,
    },
  });

  // Customers
  await prisma.customer.upsert({
    where: { code: 'CUS-001' },
    update: {},
    create: {
      code: 'CUS-001',
      name: 'Kompania ABC Sh.p.k.',
      fiscalNo: '70055555',
      vatNo: '331055555',
      address: 'Bulevardi Bill Clinton 5',
      city: 'Prishtinë',
      phone: '+383 44 555 666',
      email: 'contact@abc.ks',
      creditLimit: 5000,
      defaultDiscountPercent: 2,
      isActive: true,
    },
  });

  await prisma.customer.upsert({
    where: { code: 'CUS-002' },
    update: {},
    create: {
      code: 'CUS-002',
      name: 'Biznesi XYZ',
      city: 'Ferizaj',
      isActive: true,
    },
  });

  console.log('Seed completed successfully.');
  console.log('');
  console.log('Default login:');
  console.log('  Email: admin@erp.local');
  console.log('  Password: Admin123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
