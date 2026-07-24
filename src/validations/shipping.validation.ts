import { query, param, body } from 'express-validator';

export const shippingMethodListValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('sortOrder').optional().isIn(['asc', 'desc'])
];

export const deliverySlotListValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('date').optional().isISO8601(),
  query('sortOrder').optional().isIn(['asc', 'desc'])
];

export const shippingMethodIdParam = [param('id').isInt({ gt: 0 }).withMessage('Invalid shipping method id')];
export const deliverySlotIdParam = [param('id').isInt({ gt: 0 }).withMessage('Invalid delivery slot id')];

export const createShippingMethodValidation = [
  body('name').trim().notEmpty().withMessage('Shipping method name is required'),
  body('code').trim().notEmpty().withMessage('Shipping method code is required')
];

export const createDeliverySlotValidation = [
  body('date').isISO8601().withMessage('Delivery slot date is required'),
  body('startTime').trim().notEmpty().withMessage('Start time is required'),
  body('endTime').trim().notEmpty().withMessage('End time is required'),
  body('capacity').optional().isInt({ min: 0 })
];
