import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import apiResponse from '../utils/apiResponse';

export default function validate(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return apiResponse.badRequest(res, errors.array(), 'Validation failed');
  }
  return next();
}
