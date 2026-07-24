import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { Prisma } from '@prisma/client';
import apiResponse from '../utils/apiResponse';
import logger from '../config/logger';
import AppError from '../utils/AppError';

function isPrismaError(error: any): error is Prisma.PrismaClientKnownRequestError {
  return error && error instanceof Prisma.PrismaClientKnownRequestError;
}

export default function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  logger.error(err);

  // Custom AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ success: false, data: null, meta: null, message: err.message, errors: [{ code: err.errorCode || null }] });
  }

  // JWT errors
  if (err instanceof TokenExpiredError) {
    return apiResponse.unauthorized(res, [{ message: 'Token expired' }], 'Token expired');
  }

  if (err instanceof JsonWebTokenError) {
    return apiResponse.unauthorized(res, [{ message: err.message }], 'Invalid token');
  }

  // Prisma known error
  if (isPrismaError(err)) {
    return apiResponse.badRequest(res, [{ code: err.code, message: err.message }], 'Database error');
  }

  // ValidationError from express-validator or other libraries
  if (err && err.name === 'ValidationError') {
    return apiResponse.badRequest(res, err.errors || [{ message: err.message }], 'Validation error');
  }

  // Fallback
  return apiResponse.error(res, 'Internal server error', [{ message: err.message || 'Unknown error' }]);
}
