const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = 'Admin@123';
  const hashed = await bcrypt.hash(password, 10);

  // Create roles
  const superAdmin = await prisma.role.upsert({
    where: { name: 'Super Admin' },
    update: {},
    create: { name: 'Super Admin', description: 'Super Administrator with full access' },
  });

  await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: { name: 'Admin', description: 'Administrator' },
  });

  const permissions = [
    'Dashboard', 'Catalog', 'Inventory', 'Customers', 'Orders',
    'Payments', 'Marketing', 'Reports', 'CMS', 'System', 'Administration',
    'Users', 'Roles',
  ].flatMap((resource) => [
    { resource, action: 'VIEW' },
    { resource, action: 'CREATE' },
    { resource, action: 'UPDATE' },
    { resource, action: 'DELETE' },
    { resource, action: 'EXPORT' },
  ]);

  for (const p of permissions) {
    await prisma.permission.upsert({
      where: { resource_action: { resource: p.resource, action: p.action } },
      update: {},
      create: { resource: p.resource, action: p.action },
    });
  }

  // Assign all permissions to super admin
  const allPermissions = await prisma.permission.findMany();
  for (const perm of allPermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: superAdmin.id, permissionId: perm.id } },
      update: {},
      create: { roleId: superAdmin.id, permissionId: perm.id },
    });
  }

  // Create or refresh super admin credentials
  const existing = await prisma.user.findUnique({ where: { email: 'superadmin@example.com' } });
  if (!existing) {
    await prisma.user.create({
      data: {
        firstName: 'Super',
        lastName: 'Admin',
        email: 'superadmin@example.com',
        password: hashed,
        roleId: superAdmin.id,
      },
    });
  } else {
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        password: hashed,
        roleId: superAdmin.id,
        status: 'ACTIVE',
        isActive: true,
        isLocked: false,
      },
    });
  }

  console.log('Seeding complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
