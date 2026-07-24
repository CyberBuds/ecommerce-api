import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import HTTP_STATUS from '../constants/httpStatus';

export default function roleGuard(roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) throw new AppError('Not authenticated', HTTP_STATUS.UNAUTHORIZED, 'AUTH_REQUIRED');
    const userRoles = roles || [];
    if (!userRoles.includes(user.roleName || user.role)) {
      throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN, 'FORBIDDEN');
    }
    return next();
  };
}
