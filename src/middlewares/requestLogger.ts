import { NextFunction, Request, Response } from 'express';
import logger from '../config/logger';

export default function requestLogger(req: Request, _res: Response, next: NextFunction) {
  const { method, originalUrl } = req;
  const id = (req as any).id || 'no-req-id';
  logger.info(`${method} ${originalUrl} - reqId=${id}`);
  next();
}
