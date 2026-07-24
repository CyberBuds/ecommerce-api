import { body, param, query } from 'express-validator';

const PAYMENT_METHODS = ['CASH_ON_DELIVERY', 'UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'WALLET', 'GIFT_CARD'];
const PAYMENT_GATEWAYS = ['RAZORPAY', 'STRIPE', 'PAYPAL', 'CASHFREE', 'PHONEPE', 'PAYTM', 'OFFLINE'];
const PAYMENT_STATUSES = ['PENDING', 'AUTHORIZED', 'CAPTURED', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED', 'PARTIALLY_REFUNDED', 'CHARGEBACK', 'EXPIRED'];
const SETTLEMENT_STATUSES = ['PENDING', 'SETTLED', 'FAILED', 'PROCESSING'];
const RECONCILIATION_STATUSES = ['MATCHED', 'MISMATCHED', 'PENDING', 'FAILED'];

export const createPaymentValidation = [
  body('orderId').isInt({ gt: 0 }).withMessage('Order id is required'),
  body('gateway').isIn(PAYMENT_GATEWAYS).withMessage('Invalid payment gateway'),
  body('paymentMethod').isIn(PAYMENT_METHODS).withMessage('Invalid payment method'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than zero'),
  body('currency').optional().isString().trim()
];

export const verifyPaymentValidation = [
  body('paymentId').isInt({ gt: 0 }).withMessage('Payment id is required'),
  body('gatewayPaymentId').trim().notEmpty().withMessage('Gateway payment id is required'),
  body('gatewaySignature').trim().notEmpty().withMessage('Gateway signature is required'),
  body('transactionReference').trim().notEmpty().withMessage('Transaction reference is required'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than zero')
];

export const capturePaymentValidation = [
  body('paymentId').isInt({ gt: 0 }).withMessage('Payment id is required'),
  body('amount').optional().isFloat({ gt: 0 }).withMessage('Amount must be greater than zero')
];

export const refundPaymentValidation = [
  body('paymentId').isInt({ gt: 0 }).withMessage('Payment id is required'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than zero'),
  body('transactionReference').optional().trim()
];

export const retryPaymentValidation = [
  body('paymentId').isInt({ gt: 0 }).withMessage('Payment id is required'),
  body('reason').optional().trim()
];

export const paymentIdParam = [param('id').isInt({ gt: 0 }).withMessage('Invalid payment id')];
export const orderIdParam = [param('orderId').isInt({ gt: 0 }).withMessage('Invalid order id')];
export const webhookProviderParam = [param('provider').isIn(PAYMENT_GATEWAYS).withMessage('Unsupported webhook provider')];

export const listPaymentsValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('status').optional().isIn(PAYMENT_STATUSES),
  query('gateway').optional().isIn(PAYMENT_GATEWAYS),
  query('paymentMethod').optional().isIn(PAYMENT_METHODS),
  query('sortOrder').optional().isIn(['asc', 'desc'])
];

export const settlementListValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('gateway').optional().isIn(PAYMENT_GATEWAYS),
  query('status').optional().isIn(SETTLEMENT_STATUSES),
  query('sortOrder').optional().isIn(['asc', 'desc'])
];

export const reconciliationListValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('status').optional().isIn(RECONCILIATION_STATUSES),
  query('sortOrder').optional().isIn(['asc', 'desc'])
];
