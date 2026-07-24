import { Request, Response, NextFunction } from 'express';
import prisma from '../helpers/prisma';
import AppError from '../utils/AppError';
import HTTP_STATUS from '../constants/httpStatus';

// authorize by role names or permission ({ resource, action })
export default function authorize(options: { roles?: string[]; permission?: { resource: string; action: string } }) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) throw new AppError('Not authenticated', HTTP_STATUS.UNAUTHORIZED, 'AUTH_REQUIRED');

    // role-based
    if (options.roles && options.roles.length > 0) {
      const role = await prisma.role.findUnique({ where: { id: user.roleId } });
      if (!role || !options.roles.includes(role.name)) {
        throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN, 'FORBIDDEN');
      }
      return next();
    }

    // permission-based
    if (options.permission) {
      const rolePermissions = await prisma.rolePermission.findMany({ where: { roleId: user.roleId }, include: { permission: true } });
      const has = rolePermissions.some((rp: { permission: { resource: string; action: string } }) => rp.permission.resource === options.permission!.resource && rp.permission.action === options.permission!.action);
      if (!has) throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN, 'FORBIDDEN');
      return next();
    }

    return next();
  };
}
