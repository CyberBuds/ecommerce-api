import { Request, Response } from 'express';
import apiResponse from '../utils/apiResponse';
import MESSAGES from '../constants/messages';

export const healthCheck = (_req: Request, res: Response) => {
  const payload = {
    version: 'v1',
    timestamp: new Date().toISOString()
  };
  return apiResponse.success(res, payload, MESSAGES.API_RUNNING);
};

export default { healthCheck };
