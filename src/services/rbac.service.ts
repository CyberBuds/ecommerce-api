import prisma from '../helpers/prisma';

export default class RBACService {
  async userHasRole(userId: number, roleName: string): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { role: true } });
    return !!user && !!user.role && user.role.name === roleName;
  }

  async userHasPermission(userId: number, resource: string, action: string): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { role: true } });
    if (!user || !user.role || user.roleId === null) return false;
    const rolePerms = await prisma.rolePermission.findMany({ where: { roleId: user.roleId }, include: { permission: true } });
    return rolePerms.some((rp: { permission: { resource: string; action: string } }) => rp.permission.resource === resource && rp.permission.action === action);
  }
}
