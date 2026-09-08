import { Router } from 'express';
import prisma from '../helpers/prisma';
import authenticate from '../middlewares/authenticate';
import authorize from '../middlewares/authorize';
import apiResponse from '../utils/apiResponse';

const router = Router();
const adminRoles = ['Super Admin', 'Admin'];

router.use(authenticate, authorize({ roles: adminRoles }));

router.get('/', async (_req, res, next) => {
  try {
    const roles = await prisma.role.findMany({
      include: {
        permissions: { include: { permission: true } },
        _count: { select: { users: true } },
      },
      orderBy: { id: 'asc' },
    });

    return apiResponse.success(res, roles.map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description || '',
      roleCode: role.name.toUpperCase().replace(/[^A-Z0-9]+/g, '_'),
      isSystem: role.name === 'Super Admin' || role.name === 'Admin',
      userCount: role._count.users,
      permissions: role.permissions.map(({ permission }) => ({
        resource: permission.resource,
        action: permission.action,
      })),
      updatedAt: role.updatedAt,
    })), 'Roles fetched');
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, description, permissions = [] } = req.body;
    const role = await prisma.role.create({ data: { name, description } });
    await syncPermissions(role.id, permissions);
    return apiResponse.created(res, role, 'Role created');
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { name, description, permissions } = req.body;
    const role = await prisma.role.update({ where: { id }, data: { name, description } });
    if (Array.isArray(permissions)) await syncPermissions(id, permissions);
    return apiResponse.success(res, role, 'Role updated');
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await prisma.rolePermission.deleteMany({ where: { roleId: id } });
    await prisma.role.delete({ where: { id } });
    return apiResponse.success(res, null, 'Role deleted');
  } catch (error) {
    next(error);
  }
});

async function syncPermissions(roleId: number, permissions: string[]) {
  await prisma.rolePermission.deleteMany({ where: { roleId } });
  for (const value of permissions) {
    const [actionValue, resourceValue] = String(value).split(':');
    if (!actionValue || !resourceValue) continue;
    const action = actionValue.toUpperCase() === 'EDIT' ? 'UPDATE' : actionValue.toUpperCase();
    const permission = await prisma.permission.findUnique({
      where: { resource_action: { resource: resourceValue, action: action as any } },
    });
    if (permission) {
      await prisma.rolePermission.create({ data: { roleId, permissionId: permission.id } });
    }
  }
}

export default router;
