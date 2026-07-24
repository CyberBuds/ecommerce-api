import { body, param, query } from 'express-validator';
import CustomerRepository from '../repositories/customer.repository';

const customerRepo = new CustomerRepository();

export const customerIdParam = [param('id').isInt().withMessage('Invalid customer id')];
export const addressIdParam = [param('addressId').isInt().withMessage('Invalid address id')];
export const groupIdParam = [param('groupId').isInt().withMessage('Invalid customer group id')];
export const wishlistIdParam = [param('wishlistId').isInt().withMessage('Invalid wishlist item id')];
export const reviewIdParam = [param('reviewId').isInt().withMessage('Invalid review id')];
export const noteIdParam = [param('noteId').isInt().withMessage('Invalid note id')];
export const documentIdParam = [param('documentId').isInt().withMessage('Invalid document id')];

export const customerListValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('status').optional().isIn(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
  query('isEmailVerified').optional().isBoolean().toBoolean(),
  query('isMobileVerified').optional().isBoolean().toBoolean(),
  query('sortBy').optional().isString(),
  query('sortOrder').optional().isIn(['asc', 'desc'])
];

export const createCustomerValidation = [
  body('customerCode')
    .notEmpty()
    .withMessage('Customer code is required')
    .bail()
    .custom(async (value) => {
      const exists = await customerRepo.findByCustomerCode(value);
      if (exists) return Promise.reject('Customer code already exists');
      return true;
    }),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .bail()
    .custom(async (value) => {
      const exists = await customerRepo.findByEmail(value);
      if (exists) return Promise.reject('Email already exists');
      return true;
    }),
  body('mobile')
    .optional()
    .isMobilePhone('any')
    .withMessage('Valid mobile number is required')
    .bail()
    .custom(async (value) => {
      const exists = await customerRepo.findByMobile(value);
      if (exists) return Promise.reject('Mobile already exists');
      return true;
    }),
  body('gender').optional().isIn(['MALE', 'FEMALE', 'OTHER']),
  body('dateOfBirth').optional().isISO8601().toDate(),
  body('anniversaryDate').optional().isISO8601().toDate(),
  body('status').optional().isIn(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
  body('isEmailVerified').optional().isBoolean().toBoolean(),
  body('isMobileVerified').optional().isBoolean().toBoolean()
];

export const updateCustomerValidation = [
  param('id').isInt().withMessage('Invalid customer id'),
  body('customerCode')
    .optional()
    .custom(async (value, { req }) => {
      const existing = await customerRepo.findByCustomerCode(value);
      if (existing && existing.id !== Number(req.params?.id)) return Promise.reject('Customer code already exists');
      return true;
    }),
  body('firstName').optional().notEmpty().withMessage('First name is required'),
  body('lastName').optional().notEmpty().withMessage('Last name is required'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Valid email is required')
    .bail()
    .custom(async (value, { req }) => {
      const existing = await customerRepo.findByEmail(value);
      if (existing && existing.id !== Number(req.params?.id)) return Promise.reject('Email already exists');
      return true;
    }),
  body('mobile')
    .optional()
    .isMobilePhone('any')
    .withMessage('Valid mobile number is required')
    .bail()
    .custom(async (value, { req }) => {
      const existing = await customerRepo.findByMobile(value);
      if (existing && existing.id !== Number(req.params?.id)) return Promise.reject('Mobile already exists');
      return true;
    }),
  body('gender').optional().isIn(['MALE', 'FEMALE', 'OTHER']),
  body('dateOfBirth').optional().isISO8601().toDate(),
  body('anniversaryDate').optional().isISO8601().toDate(),
  body('status').optional().isIn(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
  body('isEmailVerified').optional().isBoolean().toBoolean(),
  body('isMobileVerified').optional().isBoolean().toBoolean()
];

export const customerProfileValidation = [
  body('firstName').optional().notEmpty().withMessage('First name is required'),
  body('lastName').optional().notEmpty().withMessage('Last name is required'),
  body('mobile').optional().isMobilePhone('any').withMessage('Valid mobile number is required'),
  body('gender').optional().isIn(['MALE', 'FEMALE', 'OTHER']),
  body('dateOfBirth').optional().isISO8601().toDate(),
  body('anniversaryDate').optional().isISO8601().toDate()
];

export const customerAddressValidation = [
  body('addressType').isIn(['BILLING', 'SHIPPING']).withMessage('Address type is required'),
  body('addressLine1').notEmpty().withMessage('Address Line 1 is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('state').notEmpty().withMessage('State is required'),
  body('country').notEmpty().withMessage('Country is required'),
  body('pincode').notEmpty().withMessage('Pincode is required')
];

export const createCustomerGroupValidation = [
  body('name').notEmpty().withMessage('Group name is required'),
  body('code').notEmpty().withMessage('Group code is required'),
  body('status').optional().isIn(['ACTIVE', 'INACTIVE', 'DRAFT'])
];

export const updateCustomerGroupValidation = [
  param('groupId').isInt().withMessage('Invalid customer group id'),
  body('name').optional().notEmpty().withMessage('Group name is required'),
  body('code').optional().notEmpty().withMessage('Group code is required'),
  body('status').optional().isIn(['ACTIVE', 'INACTIVE', 'DRAFT'])
];

export const wishlistValidation = [
  body('productId').isInt().withMessage('Product id is required'),
  body('variantId').optional().isInt()
];

export const customerReviewValidation = [
  body('productId').isInt().withMessage('Product id is required'),
  body('variantId').optional().isInt(),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('reviewTitle').notEmpty().withMessage('Review title is required'),
  body('review').notEmpty().withMessage('Review description is required'),
  body('images').optional().isArray()
];

export const walletTransactionValidation = [
  body('type').isIn(['CREDIT', 'DEBIT', 'REFUND', 'REWARD', 'ADJUSTMENT']).withMessage('Valid transaction type is required'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than zero')
];

export const loyaltyTransactionValidation = [
  body('type').isIn(['EARN', 'REDEEM', 'EXPIRE']).withMessage('Valid loyalty transaction type is required'),
  body('points').isInt({ gt: 0 }).withMessage('Points must be greater than zero')
];

export const notificationValidation = [
  body('channel').isIn(['EMAIL', 'SMS', 'WHATSAPP', 'PUSH']).withMessage('Notification channel is required'),
  body('title').notEmpty().withMessage('Notification title is required'),
  body('message').notEmpty().withMessage('Notification message is required')
];

export const customerNoteValidation = [
  body('note').notEmpty().withMessage('Note is required')
];

export const customerDocumentValidation = [
  body('fileName').notEmpty().withMessage('File name is required'),
  body('fileUrl').notEmpty().withMessage('File URL is required'),
  body('status').optional().isIn(['ACTIVE', 'INACTIVE', 'DRAFT'])
];

export const customerReviewListValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('status').optional().isIn(['PENDING', 'APPROVED', 'REJECTED']),
  query('sortBy').optional().isString(),
  query('sortOrder').optional().isIn(['asc', 'desc'])
];

export const generalListValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('sortBy').optional().isString(),
  query('sortOrder').optional().isIn(['asc', 'desc'])
];
