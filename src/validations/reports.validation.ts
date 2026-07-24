import { body, query, param } from 'express-validator';

// ─── Shared ───────────────────────────────────────────────────────────────────

const EXPORT_FORMATS = ['EXCEL', 'CSV', 'PDF', 'JSON'] as const;
const EXPORT_REPORT_TYPES = [
  'dashboard', 'sales', 'orders', 'products', 'customers',
  'inventory', 'payments', 'finance', 'tax', 'marketing',
  'returns', 'kpi', 'warehouse', 'supplier',
] as const;
const SCHEDULE_FREQUENCIES = ['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'] as const;
const SCHEDULE_STATUSES = ['ACTIVE', 'PAUSED', 'COMPLETED'] as const;
const ORDER_STATUSES = [
  'PENDING', 'CONFIRMED', 'PROCESSING', 'PACKED', 'READY_TO_SHIP',
  'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED', 'FAILED',
] as const;

/** Common date-range query rules applied to GET report endpoints */
export const commonReportQueryRules = [
  query('startDate').optional().isISO8601().withMessage('startDate must be a valid ISO 8601 date'),
  query('endDate').optional().isISO8601().withMessage('endDate must be a valid ISO 8601 date'),
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer').toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 500 }).withMessage('pageSize must be 1–500').toInt(),
  query('limit').optional().isInt({ min: 1, max: 1000 }).withMessage('limit must be 1–1000').toInt(),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('sortOrder must be asc or desc'),
];

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const dashboardQueryRules = [
  ...commonReportQueryRules,
];

// ─── Sales ────────────────────────────────────────────────────────────────────

export const salesReportQueryRules = [
  ...commonReportQueryRules,
  query('groupBy')
    .optional()
    .isIn(['day', 'week', 'month', 'quarter', 'year'])
    .withMessage('groupBy must be day, week, month, quarter, or year'),
  query('categoryId').optional().isInt({ min: 1 }).toInt(),
  query('brandId').optional().isInt({ min: 1 }).toInt(),
  query('productId').optional().isInt({ min: 1 }).toInt(),
  query('state').optional().trim().notEmpty(),
  query('city').optional().trim().notEmpty(),
];

// ─── Orders ───────────────────────────────────────────────────────────────────

export const orderReportQueryRules = [
  ...commonReportQueryRules,
  query('orderStatus').optional().isIn(ORDER_STATUSES).withMessage('Invalid order status'),
  query('paymentMethod').optional().trim().notEmpty(),
  query('state').optional().trim().notEmpty(),
  query('city').optional().trim().notEmpty(),
];

// ─── Products ─────────────────────────────────────────────────────────────────

export const productReportQueryRules = [
  ...commonReportQueryRules,
  query('categoryId').optional().isInt({ min: 1 }).toInt(),
  query('brandId').optional().isInt({ min: 1 }).toInt(),
  query('sortBy')
    .optional()
    .isIn(['revenue', 'quantity', 'margin', 'stock'])
    .withMessage('sortBy must be revenue, quantity, margin, or stock'),
];

// ─── Inventory ────────────────────────────────────────────────────────────────

export const inventoryReportQueryRules = [
  ...commonReportQueryRules,
  query('warehouseId').optional().isInt({ min: 1 }).toInt(),
  query('productId').optional().isInt({ min: 1 }).toInt(),
];

// ─── Customers ────────────────────────────────────────────────────────────────

export const customerReportQueryRules = [
  ...commonReportQueryRules,
  query('customerGroupId').optional().isInt({ min: 1 }).toInt(),
  query('sortBy')
    .optional()
    .isIn(['totalSpend', 'totalOrders', 'registeredAt', 'lastOrderDate'])
    .withMessage('Invalid sortBy value'),
];

// ─── Finance ──────────────────────────────────────────────────────────────────

export const financeReportQueryRules = [
  ...commonReportQueryRules,
  query('groupBy')
    .optional()
    .isIn(['day', 'week', 'month', 'quarter', 'year'])
    .withMessage('groupBy must be day, week, month, quarter, or year'),
];

// ─── Tax / GST ────────────────────────────────────────────────────────────────

export const taxReportQueryRules = [
  ...commonReportQueryRules,
  query('groupBy')
    .optional()
    .isIn(['day', 'month', 'quarter', 'year'])
    .withMessage('groupBy must be day, month, quarter, or year'),
];

// ─── Marketing ────────────────────────────────────────────────────────────────

export const marketingReportQueryRules = [
  ...commonReportQueryRules,
  query('campaignId').optional().isInt({ min: 1 }).toInt(),
];

// ─── Payments ─────────────────────────────────────────────────────────────────

export const paymentReportQueryRules = [
  ...commonReportQueryRules,
  query('gateway').optional().trim().notEmpty(),
  query('paymentMethod').optional().trim().notEmpty(),
];

// ─── Returns ──────────────────────────────────────────────────────────────────

export const returnReportQueryRules = [
  ...commonReportQueryRules,
  query('status')
    .optional()
    .isIn(['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'])
    .withMessage('Invalid return status'),
];

// ─── Business Intelligence ────────────────────────────────────────────────────

export const biQueryRules = [
  ...commonReportQueryRules,
  query('periods').optional().isInt({ min: 3, max: 24 }).withMessage('periods must be 3–24').toInt(),
];

// ─── Export ───────────────────────────────────────────────────────────────────

export const exportReportRules = [
  body('reportType')
    .notEmpty()
    .isIn(EXPORT_REPORT_TYPES)
    .withMessage(`reportType must be one of: ${EXPORT_REPORT_TYPES.join(', ')}`),
  body('format')
    .notEmpty()
    .isIn(EXPORT_FORMATS)
    .withMessage(`format must be one of: ${EXPORT_FORMATS.join(', ')}`),
  body('filters').optional().isObject().withMessage('filters must be an object'),
  body('filters.startDate').optional().isISO8601().withMessage('startDate must be a valid date'),
  body('filters.endDate').optional().isISO8601().withMessage('endDate must be a valid date'),
];

// ─── Scheduled Reports ───────────────────────────────────────────────────────

export const createScheduledReportRules = [
  body('reportCode')
    .trim()
    .notEmpty()
    .withMessage('reportCode is required')
    .isLength({ max: 50 })
    .withMessage('reportCode must not exceed 50 characters'),
  body('reportName')
    .trim()
    .notEmpty()
    .withMessage('reportName is required')
    .isLength({ max: 150 })
    .withMessage('reportName must not exceed 150 characters'),
  body('reportType')
    .trim()
    .notEmpty()
    .isIn(EXPORT_REPORT_TYPES)
    .withMessage(`reportType must be one of: ${EXPORT_REPORT_TYPES.join(', ')}`),
  body('frequency')
    .notEmpty()
    .isIn(SCHEDULE_FREQUENCIES)
    .withMessage(`frequency must be one of: ${SCHEDULE_FREQUENCIES.join(', ')}`),
  body('nextRunAt')
    .notEmpty()
    .isISO8601()
    .withMessage('nextRunAt must be a valid ISO 8601 date'),
  body('recipients')
    .optional()
    .isArray()
    .withMessage('recipients must be an array'),
  body('recipients.*')
    .optional()
    .isEmail()
    .withMessage('Each recipient must be a valid email address'),
  body('filters').optional().isObject(),
];

export const updateScheduledReportRules = [
  param('id').isInt({ min: 1 }).withMessage('id must be a positive integer'),
  body('reportName').optional().trim().notEmpty().isLength({ max: 150 }),
  body('frequency').optional().isIn(SCHEDULE_FREQUENCIES),
  body('nextRunAt').optional().isISO8601(),
  body('status').optional().isIn(SCHEDULE_STATUSES).withMessage(`status must be one of: ${SCHEDULE_STATUSES.join(', ')}`),
  body('recipients').optional().isArray(),
  body('recipients.*').optional().isEmail(),
  body('filters').optional().isObject(),
];

export const scheduledReportIdRules = [
  param('id').isInt({ min: 1 }).withMessage('id must be a positive integer').toInt(),
];

export const scheduledReportQueryRules = [
  query('status').optional().isIn(SCHEDULE_STATUSES),
  query('frequency').optional().isIn(SCHEDULE_FREQUENCIES),
  query('reportType').optional().trim(),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
];
