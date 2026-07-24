import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = 'Admin@123';
  const hashed = await bcrypt.hash(password, 10);

  // Create roles
  const superAdmin = await prisma.role.upsert({
    where: { name: 'Super Admin' },
    update: {},
    create: { name: 'Super Admin', description: 'Super Administrator with full access' }
  });

  const admin = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: { name: 'Admin', description: 'Administrator' }
  });

  // Create a few permissions (example subset)
  const permissions = [
    { resource: 'Users', action: 'VIEW' },
    { resource: 'Users', action: 'CREATE' },
    { resource: 'Roles', action: 'VIEW' },
    { resource: 'Roles', action: 'CREATE' }
  ];

  for (const p of permissions) {
    await prisma.permission.upsert({
      where: { resource_action: { resource: p.resource, action: p.action as any } },
      update: {},
      create: { resource: p.resource, action: p.action as any }
    });
  }

  // Assign all permissions to super admin
  const allPermissions = await prisma.permission.findMany();
  for (const perm of allPermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: superAdmin.id, permissionId: perm.id } },
      update: {},
      create: { roleId: superAdmin.id, permissionId: perm.id }
    });
  }

  // Create super admin user
  const existing = await prisma.user.findUnique({ where: { email: 'superadmin@example.com' } });
  if (!existing) {
    await prisma.user.create({
      data: {
        firstName: 'Super',
        lastName: 'Admin',
        email: 'superadmin@example.com',
        password: hashed,
        roleId: superAdmin.id
      }
    });
  }

  console.log('Seeding complete');
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
