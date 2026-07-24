import { body, param, query } from 'express-validator';

// ─── Reusable helpers ─────────────────────────────────────────────────────────

const idParam = param('id').isInt({ min: 1 }).withMessage('Valid id is required');

const paginationRules = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be ≥ 1'),
  query('pageSize').optional().isInt({ min: 1, max: 200 }).withMessage('pageSize must be 1–200'),
];

// ─── Company Profile ──────────────────────────────────────────────────────────

export const upsertCompanyProfileRules = [
  body('companyName').notEmpty().isLength({ max: 200 }).withMessage('companyName is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().isLength({ max: 20 }).withMessage('phone is required'),
  body('gstNumber').optional().isLength({ max: 20 }),
  body('panNumber').optional().isLength({ max: 20 }),
  body('website').optional().isURL().withMessage('website must be a valid URL'),
  body('currency').optional().isLength({ min: 3, max: 3 }).withMessage('currency must be 3-char ISO code'),
  body('timezone').optional().isString(),
  body('invoicePrefix').optional().isLength({ max: 10 }),
];

// ─── Store Settings ───────────────────────────────────────────────────────────

export const upsertStoreSettingsRules = [
  body('storeName').notEmpty().isLength({ max: 200 }).withMessage('storeName is required'),
  body('storeUrl').optional().isURL().withMessage('storeUrl must be a valid URL'),
  body('supportEmail').optional().isEmail().normalizeEmail(),
  body('supportMobile').optional().isLength({ max: 20 }),
  body('currency').optional().isLength({ min: 3, max: 3 }),
  body('maintenanceMode').optional().isBoolean(),
];

// ─── App Settings ─────────────────────────────────────────────────────────────

export const upsertAppSettingsRules = [
  body('registrationEnabled').optional().isBoolean(),
  body('guestCheckout').optional().isBoolean(),
  body('wishlistEnabled').optional().isBoolean(),
  body('reviewsEnabled').optional().isBoolean(),
  body('codEnabled').optional().isBoolean(),
  body('inventoryTracking').optional().isBoolean(),
  body('lowStockAlert').optional().isBoolean(),
  body('lowStockThreshold').optional().isInt({ min: 0 }),
  body('autoInvoice').optional().isBoolean(),
  body('autoShipment').optional().isBoolean(),
  body('autoRefund').optional().isBoolean(),
];

// ─── Theme Settings ───────────────────────────────────────────────────────────

export const upsertThemeSettingsRules = [
  body('primaryColor').optional().matches(/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/).withMessage('primaryColor must be a hex color'),
  body('secondaryColor').optional().matches(/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/),
  body('accentColor').optional().matches(/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/),
  body('darkMode').optional().isBoolean(),
  body('layout').optional().isString().isLength({ max: 50 }),
  body('typography').optional().isString().isLength({ max: 50 }),
];

// ─── Currency ─────────────────────────────────────────────────────────────────

export const createCurrencyRules = [
  body('code').notEmpty().isLength({ min: 3, max: 3 }).toUpperCase().withMessage('code must be 3-char ISO currency code'),
  body('name').notEmpty().isLength({ max: 100 }).withMessage('name is required'),
  body('symbol').notEmpty().isLength({ max: 10 }).withMessage('symbol is required'),
  body('exchangeRate').optional().isFloat({ min: 0 }),
  body('isDefault').optional().isBoolean(),
];

export const updateCurrencyRules = [
  idParam,
  body('name').optional().isLength({ max: 100 }),
  body('symbol').optional().isLength({ max: 10 }),
  body('exchangeRate').optional().isFloat({ min: 0 }),
  body('isActive').optional().isBoolean(),
];

export const currencyIdRules = [idParam];

// ─── Language ─────────────────────────────────────────────────────────────────

export const createLanguageRules = [
  body('code').notEmpty().isLength({ min: 2, max: 10 }).toLowerCase().withMessage('code is required'),
  body('name').notEmpty().isLength({ max: 100 }).withMessage('name is required'),
  body('nativeName').optional().isLength({ max: 100 }),
  body('isRtl').optional().isBoolean(),
  body('isDefault').optional().isBoolean(),
];

export const updateLanguageRules = [
  idParam,
  body('name').optional().isLength({ max: 100 }),
  body('nativeName').optional().isLength({ max: 100 }),
  body('isRtl').optional().isBoolean(),
  body('isActive').optional().isBoolean(),
];

export const languageIdRules = [idParam];

// ─── Tax Configuration ────────────────────────────────────────────────────────

export const createTaxConfigRules = [
  body('name').notEmpty().isLength({ max: 100 }).withMessage('name is required'),
  body('taxType').notEmpty().isLength({ max: 50 }).withMessage('taxType is required'),
  body('cgstRate').optional().isFloat({ min: 0, max: 100 }),
  body('sgstRate').optional().isFloat({ min: 0, max: 100 }),
  body('igstRate').optional().isFloat({ min: 0, max: 100 }),
  body('cessRate').optional().isFloat({ min: 0, max: 100 }),
  body('isDefault').optional().isBoolean(),
];

export const updateTaxConfigRules = [
  idParam,
  body('name').optional().isLength({ max: 100 }),
  body('taxType').optional().isLength({ max: 50 }),
  body('cgstRate').optional().isFloat({ min: 0, max: 100 }),
  body('sgstRate').optional().isFloat({ min: 0, max: 100 }),
  body('igstRate').optional().isFloat({ min: 0, max: 100 }),
  body('cessRate').optional().isFloat({ min: 0, max: 100 }),
  body('isActive').optional().isBoolean(),
];

export const taxConfigIdRules = [idParam];

// ─── Email Configuration ──────────────────────────────────────────────────────

export const upsertEmailConfigRules = [
  body('smtpHost').notEmpty().isLength({ max: 255 }).withMessage('smtpHost is required'),
  body('smtpPort').optional().isInt({ min: 1, max: 65535 }),
  body('username').notEmpty().withMessage('username is required'),
  body('password').notEmpty().withMessage('password is required'),
  body('encryption').optional().isIn(['TLS', 'SSL', 'NONE']).withMessage('encryption must be TLS, SSL, or NONE'),
  body('fromEmail').isEmail().normalizeEmail().withMessage('Valid fromEmail is required'),
  body('fromName').notEmpty().isLength({ max: 100 }).withMessage('fromName is required'),
  body('isActive').optional().isBoolean(),
];

// ─── SMS Configuration ────────────────────────────────────────────────────────

export const upsertSmsConfigRules = [
  body('provider').notEmpty().isLength({ max: 100 }).withMessage('provider is required'),
  body('apiKey').notEmpty().withMessage('apiKey is required'),
  body('senderId').notEmpty().isLength({ max: 20 }).withMessage('senderId is required'),
  body('isActive').optional().isBoolean(),
];

// ─── WhatsApp Configuration ───────────────────────────────────────────────────

export const upsertWhatsAppConfigRules = [
  body('provider').notEmpty().isLength({ max: 100 }).withMessage('provider is required'),
  body('apiKey').notEmpty().withMessage('apiKey is required'),
  body('phoneNumber').optional().isLength({ max: 20 }),
  body('templateIds').optional().isObject(),
  body('isActive').optional().isBoolean(),
];

// ─── Push Notification Configuration ─────────────────────────────────────────

export const upsertPushConfigRules = [
  body('provider')
    .notEmpty()
    .isIn(['FIREBASE', 'ONESIGNAL', 'WEBPUSH'])
    .withMessage('provider must be FIREBASE, ONESIGNAL, or WEBPUSH'),
  body('firebaseServerKey').optional().isString(),
  body('oneSignalAppId').optional().isString(),
  body('oneSignalApiKey').optional().isString(),
  body('vapidPublicKey').optional().isString(),
  body('vapidPrivateKey').optional().isString(),
  body('isActive').optional().isBoolean(),
];

// ─── Notification Template ────────────────────────────────────────────────────

export const createNotificationTemplateRules = [
  body('templateCode').notEmpty().matches(/^[A-Z0-9_]+$/).withMessage('templateCode must be uppercase alphanumeric with underscores'),
  body('templateName').notEmpty().isLength({ max: 200 }).withMessage('templateName is required'),
  body('channel').isIn(['EMAIL', 'SMS', 'WHATSAPP', 'PUSH']).withMessage('channel must be EMAIL, SMS, WHATSAPP, or PUSH'),
  body('event').notEmpty().isLength({ max: 100 }).withMessage('event is required'),
  body('subject').optional().isLength({ max: 500 }),
  body('body').notEmpty().withMessage('body is required'),
  body('variables').optional().isObject(),
  body('isActive').optional().isBoolean(),
];

export const updateNotificationTemplateRules = [
  idParam,
  body('templateName').optional().isLength({ max: 200 }),
  body('channel').optional().isIn(['EMAIL', 'SMS', 'WHATSAPP', 'PUSH']),
  body('event').optional().isLength({ max: 100 }),
  body('subject').optional().isLength({ max: 500 }),
  body('body').optional().isString(),
  body('variables').optional().isObject(),
  body('isActive').optional().isBoolean(),
];

export const notificationTemplateIdRules = [idParam];
export const notificationTemplateQueryRules = [
  ...paginationRules,
  query('channel').optional().isIn(['EMAIL', 'SMS', 'WHATSAPP', 'PUSH']),
  query('event').optional().isString(),
  query('isActive').optional().isIn(['true', 'false']),
];

// ─── API Key ──────────────────────────────────────────────────────────────────

export const createApiKeyRules = [
  body('name').notEmpty().isLength({ max: 100 }).withMessage('name is required'),
  body('permissions').optional().isArray(),
  body('expiresAt').optional().isISO8601().withMessage('expiresAt must be a valid date'),
];

export const apiKeyIdRules = [idParam];
export const apiKeyQueryRules = [
  ...paginationRules,
  query('status').optional().isIn(['ACTIVE', 'REVOKED', 'EXPIRED']),
];

// ─── Third Party Integration ──────────────────────────────────────────────────

export const upsertIntegrationRules = [
  param('provider')
    .isIn(['RAZORPAY','STRIPE','PAYPAL','CASHFREE','PHONEPE','PAYTM','SHIPROCKET','DELHIVERY','GOOGLE_MAPS','GOOGLE_ANALYTICS','GOOGLE_TAG_MANAGER','FACEBOOK_PIXEL','CLOUDINARY','AWS_S3'])
    .withMessage('Invalid integration provider'),
  body('displayName').optional().isLength({ max: 100 }),
  body('apiKey').optional().isString(),
  body('apiSecret').optional().isString(),
  body('webhookSecret').optional().isString(),
  body('webhookUrl').optional().isURL(),
  body('extraConfig').optional().isObject(),
  body('status').optional().isIn(['ACTIVE', 'INACTIVE', 'TESTING']),
];

export const integrationProviderRules = [
  param('provider')
    .isIn(['RAZORPAY','STRIPE','PAYPAL','CASHFREE','PHONEPE','PAYTM','SHIPROCKET','DELHIVERY','GOOGLE_MAPS','GOOGLE_ANALYTICS','GOOGLE_TAG_MANAGER','FACEBOOK_PIXEL','CLOUDINARY','AWS_S3'])
    .withMessage('Invalid integration provider'),
];

// ─── Feature Flag ─────────────────────────────────────────────────────────────

export const createFeatureFlagRules = [
  body('flagKey')
    .notEmpty()
    .matches(/^[a-z0-9_.-]+$/)
    .withMessage('flagKey must be lowercase alphanumeric with dots, dashes, or underscores'),
  body('flagName').notEmpty().isLength({ max: 200 }).withMessage('flagName is required'),
  body('description').optional().isString(),
  body('isEnabled').optional().isBoolean(),
  body('rolloutPercent').optional().isInt({ min: 0, max: 100 }),
  body('environment').optional().isLength({ max: 50 }),
  body('conditions').optional().isObject(),
];

export const updateFeatureFlagRules = [
  idParam,
  body('flagName').optional().isLength({ max: 200 }),
  body('description').optional().isString(),
  body('isEnabled').optional().isBoolean(),
  body('rolloutPercent').optional().isInt({ min: 0, max: 100 }),
  body('environment').optional().isLength({ max: 50 }),
  body('conditions').optional().isObject(),
];

export const featureFlagIdRules = [idParam];
export const featureFlagQueryRules = [
  ...paginationRules,
  query('environment').optional().isString(),
  query('isEnabled').optional().isIn(['true', 'false']),
];

// ─── Scheduler Job ────────────────────────────────────────────────────────────

export const createSchedulerJobRules = [
  body('jobKey')
    .notEmpty()
    .matches(/^[a-z0-9_.-]+$/)
    .withMessage('jobKey must be lowercase alphanumeric with dots, dashes, or underscores'),
  body('jobName').notEmpty().isLength({ max: 200 }).withMessage('jobName is required'),
  body('cronExpression').notEmpty().isString().withMessage('cronExpression is required'),
  body('handler').notEmpty().isString().withMessage('handler is required'),
  body('params').optional().isObject(),
  body('status').optional().isIn(['ACTIVE', 'PAUSED', 'DISABLED']),
];

export const updateSchedulerJobRules = [
  idParam,
  body('jobName').optional().isLength({ max: 200 }),
  body('cronExpression').optional().isString(),
  body('handler').optional().isString(),
  body('params').optional().isObject(),
  body('status').optional().isIn(['ACTIVE', 'PAUSED', 'DISABLED']),
];

export const schedulerJobIdRules = [idParam];
export const schedulerJobQueryRules = [
  ...paginationRules,
  query('status').optional().isIn(['ACTIVE', 'PAUSED', 'DISABLED']),
];

// ─── Audit Logs ───────────────────────────────────────────────────────────────

export const auditLogQueryRules = [
  ...paginationRules,
  query('userId').optional().isInt({ min: 1 }),
  query('module').optional().isString(),
  query('action').optional().isString(),
  query('entityType').optional().isString(),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
];

export const auditLogIdRules = [idParam];

// ─── Activity Logs ────────────────────────────────────────────────────────────

export const activityLogQueryRules = [
  ...paginationRules,
  query('userId').optional().isInt({ min: 1 }),
  query('activityType').optional().isString(),
  query('status').optional().isString(),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
];

// ─── Error Logs ───────────────────────────────────────────────────────────────

export const errorLogQueryRules = [
  ...paginationRules,
  query('errorType').optional().isString(),
  query('module').optional().isString(),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
];

export const errorLogIdRules = [idParam];

// ─── Backup ───────────────────────────────────────────────────────────────────

export const createBackupRules = [
  body('backupType')
    .isIn(['DATABASE', 'MEDIA', 'CONFIGURATION', 'FULL'])
    .withMessage('backupType must be DATABASE, MEDIA, CONFIGURATION, or FULL'),
  body('isScheduled').optional().isBoolean(),
];

export const backupIdRules = [idParam];
export const backupQueryRules = [
  ...paginationRules,
  query('backupType').optional().isIn(['DATABASE', 'MEDIA', 'CONFIGURATION', 'FULL']),
  query('status').optional().isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED']),
];

// ─── File Storage Config ──────────────────────────────────────────────────────

export const upsertFileStorageRules = [
  body('provider')
    .isIn(['LOCAL', 'CLOUDINARY', 'AWS_S3'])
    .withMessage('provider must be LOCAL, CLOUDINARY, or AWS_S3'),
  body('localUploadPath').optional().isString(),
  body('cloudinaryCloud').optional().isString(),
  body('cloudinaryKey').optional().isString(),
  body('cloudinarySecret').optional().isString(),
  body('awsBucket').optional().isString(),
  body('awsRegion').optional().isString(),
  body('awsAccessKey').optional().isString(),
  body('awsSecretKey').optional().isString(),
  body('maxFileSizeMb').optional().isInt({ min: 1, max: 1000 }),
  body('allowedTypes').optional().isArray(),
  body('isActive').optional().isBoolean(),
];

// ─── Security Settings ────────────────────────────────────────────────────────

export const upsertSecuritySettingsRules = [
  body('minPasswordLength').optional().isInt({ min: 4, max: 128 }),
  body('requireUppercase').optional().isBoolean(),
  body('requireLowercase').optional().isBoolean(),
  body('requireNumbers').optional().isBoolean(),
  body('requireSpecialChars').optional().isBoolean(),
  body('sessionTimeoutMinutes').optional().isInt({ min: 1, max: 10080 }),
  body('jwtExpiryMinutes').optional().isInt({ min: 1, max: 1440 }),
  body('refreshTokenExpiryDays').optional().isInt({ min: 1, max: 365 }),
  body('maxLoginAttempts').optional().isInt({ min: 1, max: 100 }),
  body('lockoutDurationMinutes').optional().isInt({ min: 1, max: 1440 }),
  body('ipWhitelist').optional().isArray(),
  body('ipBlacklist').optional().isArray(),
  body('corsOrigins').optional().isArray(),
  body('twoFactorEnabled').optional().isBoolean(),
];

// ─── License ──────────────────────────────────────────────────────────────────

export const upsertLicenseRules = [
  body('licenseKey').notEmpty().withMessage('licenseKey is required'),
  body('productName').notEmpty().isLength({ max: 200 }),
  body('licensedTo').notEmpty().isLength({ max: 200 }),
  body('email').isEmail().normalizeEmail(),
  body('plan').notEmpty().isLength({ max: 100 }),
  body('maxUsers').optional().isInt({ min: 1 }),
  body('expiresAt').optional().isISO8601(),
];

// ─── System Version ───────────────────────────────────────────────────────────

export const createSystemVersionRules = [
  body('version').notEmpty().matches(/^\d+\.\d+\.\d+/).withMessage('version must follow semver format'),
  body('buildNumber').optional().isString(),
  body('releaseDate').isISO8601().withMessage('releaseDate must be a valid date'),
  body('changelog').optional().isString(),
  body('isLatest').optional().isBoolean(),
];

// ─── Environment Config ───────────────────────────────────────────────────────

export const createEnvConfigRules = [
  body('configKey')
    .notEmpty()
    .matches(/^[A-Z0-9_]+$/)
    .withMessage('configKey must be uppercase alphanumeric with underscores'),
  body('configValue').notEmpty().withMessage('configValue is required'),
  body('isSensitive').optional().isBoolean(),
  body('description').optional().isString(),
  body('environment').optional().isIn(['all', 'production', 'staging', 'development']),
  body('isActive').optional().isBoolean(),
];

export const updateEnvConfigRules = [
  idParam,
  body('configValue').optional().isString(),
  body('isSensitive').optional().isBoolean(),
  body('description').optional().isString(),
  body('environment').optional().isIn(['all', 'production', 'staging', 'development']),
  body('isActive').optional().isBoolean(),
];

export const envConfigIdRules = [idParam];
export const envConfigQueryRules = [
  ...paginationRules,
  query('environment').optional().isIn(['all', 'production', 'staging', 'development']),
  query('isActive').optional().isIn(['true', 'false']),
];
