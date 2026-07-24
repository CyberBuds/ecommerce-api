import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import AppError from '../utils/AppError';
import HTTP_STATUS from '../constants/httpStatus';

export default function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new AppError('Authentication token missing', HTTP_STATUS.UNAUTHORIZED, 'AUTH_REQUIRED');

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') throw new AppError('Invalid authorization header', HTTP_STATUS.UNAUTHORIZED, 'INVALID_AUTH_HEADER');

  const token = parts[1];
  try {
    const payload = verifyAccessToken(token) as any;
    (req as any).user = payload;
    return next();
  } catch (err) {
    throw new AppError('Invalid or expired token', HTTP_STATUS.UNAUTHORIZED, 'INVALID_TOKEN');
  }
}
