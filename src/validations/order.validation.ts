import { body, param, query } from 'express-validator';

export const createOrderValidation = [
  body('billingAddressId').isInt({ gt: 0 }).withMessage('Billing address is required'),
  body('shippingAddressId').isInt({ gt: 0 }).withMessage('Shipping address is required'),
  body('paymentMethod').trim().notEmpty().withMessage('Payment method is required'),
  body('cartId').optional().isInt({ gt: 0 }).withMessage('Cart id must be a valid integer'),
  body('shippingMethodId').optional().isInt({ gt: 0 }).withMessage('Shipping method id must be a valid integer'),
  body('deliverySlotId').optional().isInt({ gt: 0 }).withMessage('Delivery slot id must be a valid integer'),
  body('couponId').optional().isInt({ gt: 0 }).withMessage('Coupon id must be a valid integer')
];

export const listOrdersValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('orderStatus').optional().isIn(['PENDING', 'CONFIRMED', 'PROCESSING', 'PACKED', 'READY_TO_SHIP', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED', 'FAILED']),
  query('paymentStatus').optional().isIn(['PENDING', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED', 'CANCELLED']),
  query('fulfillmentStatus').optional().isIn(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
];

export const orderIdParam = [param('id').isInt({ gt: 0 }).withMessage('Invalid order id')];

export const updateOrderValidation = [
  param('id').isInt({ gt: 0 }).withMessage('Invalid order id'),
  body('billingAddressId').optional().isInt({ gt: 0 }).withMessage('Billing address id must be a valid integer'),
  body('shippingAddressId').optional().isInt({ gt: 0 }).withMessage('Shipping address id must be a valid integer'),
  body('shippingMethodId').optional().isInt({ gt: 0 }).withMessage('Shipping method id must be a valid integer'),
  body('deliverySlotId').optional().isInt({ gt: 0 }).withMessage('Delivery slot id must be a valid integer'),
  body('currency').optional().trim().notEmpty(),
  body('exchangeRate').optional().isFloat({ gt: 0 }).toFloat()
];

export const orderStatusValidation = [
  param('id').isInt({ gt: 0 }).withMessage('Invalid order id'),
  body('status').isIn(['PENDING', 'CONFIRMED', 'PROCESSING', 'PACKED', 'READY_TO_SHIP', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED', 'FAILED']).withMessage('Invalid order status'),
  body('remark').optional().trim()
];

export const returnRequestValidation = [
  param('id').isInt({ gt: 0 }).withMessage('Invalid order id'),
  body('items').isArray({ min: 1 }).withMessage('Return items are required'),
  body('items.*.orderItemId').isInt({ gt: 0 }).withMessage('Order item id is required'),
  body('items.*.quantity').isInt({ gt: 1 }).withMessage('Return quantity must be greater than zero')
];

export const refundValidation = [
  param('id').isInt({ gt: 0 }).withMessage('Invalid order id'),
  body('refundMode').isIn(['BANK_TRANSFER', 'WALLET', 'CREDIT_NOTE', 'OTHER']).withMessage('Invalid refund mode'),
  body('refundAmount').isFloat({ gt: 0 }).withMessage('Refund amount must be greater than zero'),
  body('transactionReference').optional().trim()
];
