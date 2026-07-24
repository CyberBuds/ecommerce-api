import { Response } from 'express';
import HTTP_STATUS from '../constants/httpStatus';

function success(res: Response, data: any = null, message = 'Success', meta: any = null) {
  return res.status(HTTP_STATUS.OK).json({ success: true, data, meta, message, errors: null });
}

function created(res: Response, data: any = null, message = 'Created') {
  return res.status(HTTP_STATUS.CREATED).json({ success: true, data, meta: null, message, errors: null });
}

function badRequest(res: Response, errors: any = null, message = 'Bad Request') {
  return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, data: null, meta: null, message, errors });
}

function unauthorized(res: Response, errors: any = null, message = 'Unauthorized') {
  return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, data: null, meta: null, message, errors });
}

function forbidden(res: Response, errors: any = null, message = 'Forbidden') {
  return res.status(HTTP_STATUS.FORBIDDEN).json({ success: false, data: null, meta: null, message, errors });
}

function notFound(res: Response, errors: any = null, message = 'Not Found') {
  return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, data: null, meta: null, message, errors });
}

function error(res: Response, message = 'Internal Server Error', errors: any = null) {
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, data: null, meta: null, message, errors });
}

export default {
  success,
  created,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  error
};
