const { PrismaClient } = require('../apps/api/src/prisma');
const crypto = require('crypto');

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

async function main() {
  const password = 'Admin@123';
  const hashed = hashPassword(password);

  // Create roles
  const superAdmin = await prisma.role.upsert({
    where: { name: 'Super Admin' },
    update: {},
    create: { name: 'Super Admin', description: 'Super Administrator with full access' },
  });

  const admin = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: { name: 'Admin', description: 'Administrator' },
  });

  // Create a few permissions (example subset)
  const permissions = [
    { resource: 'Users', action: 'VIEW' },
    { resource: 'Users', action: 'CREATE' },
    { resource: 'Roles', action: 'VIEW' },
    { resource: 'Roles', action: 'CREATE' },
  ];

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

  // Create super admin user
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
