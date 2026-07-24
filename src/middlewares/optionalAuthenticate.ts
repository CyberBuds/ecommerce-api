import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export default function optionalAuthenticate(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return next();

  const token = parts[1];
  try {
    const payload = verifyAccessToken(token) as any;
    req.user = payload;
  } catch {
    // Ignore invalid token for optional authentication.
  }

  return next();
}
