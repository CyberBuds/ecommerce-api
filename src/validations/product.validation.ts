import { body, param, query } from 'express-validator';

const slugValidator = body('slug').optional().trim().matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).withMessage('Slug must be lowercase kebab-case');
const priceFields = ['costPrice', 'sellingPrice', 'mrp', 'discountValue', 'taxAmount', 'netAmount'];

export const createProductValidation = [
  body('productCode').trim().notEmpty().withMessage('Product code is required'),
  body('sku').trim().notEmpty().withMessage('SKU is required'),
  body('productName').trim().notEmpty().withMessage('Product name is required'),
  slugValidator,
  body('status').optional().isIn(['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'PUBLISHED', 'ACTIVE', 'INACTIVE', 'ARCHIVED']),
  body('discountType').optional().isIn(['NONE', 'PERCENTAGE', 'FIXED']),
  body('variants').optional().isArray(),
  body('variants.*.sku').optional().trim().notEmpty().withMessage('Variant SKU is required'),
  body('variants.*.variantCode').optional().trim().notEmpty().withMessage('Variant code cannot be empty'),
  body('variants.*.status').optional().isIn(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK']),
  body('attributes').optional().isArray(),
  body('attributes.*.attributeKey').trim().notEmpty().withMessage('Attribute key is required'),
  body('attributes.*.attributeValue').trim().notEmpty().withMessage('Attribute value is required'),
  body('relations').optional().isArray(),
  body('relations.*.relatedProductId').optional().isInt().withMessage('Related product id must be an integer'),
  body('relations.*.relationType').optional().isIn(['RELATED', 'FREQUENTLY_BOUGHT_TOGETHER', 'CROSS_SELL', 'UP_SELL']),
  body('images').optional().isArray(),
  body('tags').optional().isArray(),
  body('categories').optional().isArray()
];

export const updateProductValidation = [
  param('id').isInt().withMessage('Invalid product id'),
  body('productCode').optional().trim().notEmpty().withMessage('Product code cannot be empty'),
  body('sku').optional().trim().notEmpty().withMessage('SKU cannot be empty'),
  body('productName').optional().trim().notEmpty().withMessage('Product name cannot be empty'),
  slugValidator,
  body('status').optional().isIn(['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'PUBLISHED', 'ACTIVE', 'INACTIVE', 'ARCHIVED']),
  body('discountType').optional().isIn(['NONE', 'PERCENTAGE', 'FIXED']),
  body('variants').optional().isArray(),
  body('images').optional().isArray(),
  body('attributes').optional().isArray(),
  body('tags').optional().isArray(),
  body('categories').optional().isArray()
];

export const productListValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('sortBy').optional().isString(),
  query('sortOrder').optional().isIn(['asc', 'desc']),
  query('status').optional().isString(),
  query('minPrice').optional().isFloat({ min: 0 }).toFloat(),
  query('maxPrice').optional().isFloat({ min: 0 }).toFloat(),
  query('isFeatured').optional().isBoolean().toBoolean(),
  query('isTrending').optional().isBoolean().toBoolean(),
  query('isBestSeller').optional().isBoolean().toBoolean(),
  query('isNewArrival').optional().isBoolean().toBoolean(),
  query('availability').optional().isIn(['in_stock', 'out_of_stock'])
];

export const productIdParam = [param('id').isInt().withMessage('Invalid product id')];

export const variantIdParam = [param('variantId').isInt().withMessage('Invalid variant id')];

export const attributeIdParam = [param('attributeId').isInt().withMessage('Invalid attribute id')];

export const relationIdParam = [param('relationId').isInt().withMessage('Invalid relation id')];

export const workflowValidation = [
  param('id').isInt().withMessage('Invalid product id'),
  body('status').isIn(['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'PUBLISHED', 'ACTIVE', 'INACTIVE', 'ARCHIVED']).withMessage('Invalid workflow status')
];

export const duplicateProductValidation = [param('id').isInt().withMessage('Invalid product id')];

export const variantValidation = [
  body('sku').trim().notEmpty().withMessage('Variant SKU is required'),
  body('variantCode').optional().trim().notEmpty().withMessage('Variant code cannot be empty'),
  body('status').optional().isIn(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK'])
];

export const attributeValidation = [
  body('*.attributeKey').trim().notEmpty().withMessage('Attribute key is required'),
  body('*.attributeValue').trim().notEmpty().withMessage('Attribute value is required')
];

export const relationValidation = [
  body('*.relatedProductId').isInt().withMessage('Related product id is required'),
  body('*.relationType').isIn(['RELATED', 'FREQUENTLY_BOUGHT_TOGETHER', 'CROSS_SELL', 'UP_SELL']).withMessage('Invalid relation type')
];

export const bulkImportValidation = [
  query('format').optional().isIn(['csv', 'xlsx']).withMessage('Unsupported import format')
];

export const exportValidation = [
  query('format').optional().isIn(['csv', 'xlsx', 'pdf']).withMessage('Unsupported export format')
];
