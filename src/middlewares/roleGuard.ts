import { Request, Response, NextFunction } from 'express';
import prisma from '../helpers/prisma';
import AppError from '../utils/AppError';
import HTTP_STATUS from '../constants/httpStatus';

export default function roleGuard(roles: string[]) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) throw new AppError('Not authenticated', HTTP_STATUS.UNAUTHORIZED, 'AUTH_REQUIRED');

    const allowedRoles = roles || [];
    const roleName = user.roleName || user.role?.name || user.role;

    if (typeof roleName === 'string' && allowedRoles.includes(roleName)) {
      return next();
    }

    if (user.roleId != null) {
      const resolvedRole = await prisma.role.findUnique({ where: { id: Number(user.roleId) } });
      if (resolvedRole && allowedRoles.includes(resolvedRole.name)) {
        return next();
      }
    }

    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN, 'FORBIDDEN');
  };
}
