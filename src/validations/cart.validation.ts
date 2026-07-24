import { body, param, query } from 'express-validator';

export const createCartItemValidation = [
  body('productId').isInt({ gt: 0 }).withMessage('Product id is required'),
  body('variantId').optional().isInt({ gt: 0 }).withMessage('Variant id must be an integer'),
  body('quantity').isInt({ gt: 0 }).withMessage('Quantity must be greater than zero')
];

export const updateCartItemValidation = [
  param('id').isInt().withMessage('Invalid cart item id'),
  body('quantity').isInt({ gt: 0 }).withMessage('Quantity must be greater than zero')
];

export const saveCartValidation = [
  body('name').optional().isString().trim()
];

export const restoreCartValidation = [
  body('savedCartId').isInt({ gt: 0 }).withMessage('Saved cart id is required')
];

export const applyCouponValidation = [
  body('couponCode').trim().notEmpty().withMessage('Coupon code is required')
];

export const checkoutValidation = [
  body('shippingMethodId').optional().isInt({ gt: 0 }).withMessage('Shipping method id must be a valid integer'),
  body('deliverySlotId').optional().isInt({ gt: 0 }).withMessage('Delivery slot id must be a valid integer'),
  body('billingAddressId').optional().isInt({ gt: 0 }).withMessage('Billing address id must be a valid integer'),
  body('shippingAddressId').optional().isInt({ gt: 0 }).withMessage('Shipping address id must be a valid integer'),
  body('couponCode').optional().trim().notEmpty(),
  body('paymentMethod').trim().notEmpty().withMessage('Payment method is required')
];

export const cartQueryValidation = [
  query('customerId').optional().isInt({ gt: 0 }).toInt(),
  query('sessionId').optional().isString().trim()
];
