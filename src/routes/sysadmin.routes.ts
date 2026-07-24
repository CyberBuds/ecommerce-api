import { Router } from 'express';
import authenticate from '../middlewares/authenticate';
import roleGuard from '../middlewares/roleGuard';
import validate from '../middlewares/validation.middleware';
import SysAdminRepository from '../repositories/sysadmin.repository';
import SysAdminService from '../services/sysadmin.service';
import createSysAdminController from '../controllers/sysadmin.controller';
import {
  upsertCompanyProfileRules,
  upsertStoreSettingsRules,
  upsertAppSettingsRules,
  upsertThemeSettingsRules,
  createCurrencyRules,
  updateCurrencyRules,
  currencyIdRules,
  createLanguageRules,
  updateLanguageRules,
  languageIdRules,
  createTaxConfigRules,
  updateTaxConfigRules,
  taxConfigIdRules,
  upsertEmailConfigRules,
  upsertSmsConfigRules,
  upsertWhatsAppConfigRules,
  upsertPushConfigRules,
  createNotificationTemplateRules,
  updateNotificationTemplateRules,
  notificationTemplateIdRules,
  notificationTemplateQueryRules,
  createApiKeyRules,
  apiKeyIdRules,
  apiKeyQueryRules,
  upsertIntegrationRules,
  integrationProviderRules,
  createFeatureFlagRules,
  updateFeatureFlagRules,
  featureFlagIdRules,
  featureFlagQueryRules,
  createSchedulerJobRules,
  updateSchedulerJobRules,
  schedulerJobIdRules,
  schedulerJobQueryRules,
  auditLogQueryRules,
  auditLogIdRules,
  activityLogQueryRules,
  errorLogQueryRules,
  errorLogIdRules,
  createBackupRules,
  backupIdRules,
  backupQueryRules,
  upsertFileStorageRules,
  upsertSecuritySettingsRules,
  upsertLicenseRules,
  createSystemVersionRules,
  createEnvConfigRules,
  updateEnvConfigRules,
  envConfigIdRules,
  envConfigQueryRules,
} from '../validations/sysadmin.validation';

// ─── DI ───────────────────────────────────────────────────────────────────────

const repo    = new SysAdminRepository();
const service = new SysAdminService(repo);
const ctrl    = createSysAdminController(service);

// ─── Role Groups ──────────────────────────────────────────────────────────────

const SUPER_ADMIN     = ['Super Admin'];
const ADMIN_ROLES     = ['Super Admin', 'Admin', 'System Administrator'];
const READ_ADMIN      = ['Super Admin', 'Admin', 'System Administrator', 'Read Only Admin'];
const CONTENT_ADMIN   = ['Super Admin', 'Admin', 'System Administrator'];
const FINANCE_ROLES   = ['Super Admin', 'Admin', 'Finance Manager'];

const router = Router();

// ─── Company Profile ─────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/admin/company-profile:
 *   get:
 *     tags:
 *       - SysAdmin - Company Profile
 *     summary: Get company profile
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Company profile retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.get(
  '/company-profile',
  authenticate, roleGuard(READ_ADMIN),
  ctrl.getCompanyProfile,
);

/**
 * @openapi
 * /api/v1/admin/company-profile:
 *   put:
 *     tags:
 *       - SysAdmin - Company Profile
 *     summary: Create or update company profile
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               legalName:
 *                 type: string
 *               displayName:
 *                 type: string
 *               address:
 *                 type: object
 *               contactEmail:
 *                 type: string
 *                 format: email
 *               contactPhone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Company profile saved successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.put(
  '/company-profile',
  authenticate, roleGuard(ADMIN_ROLES),
  upsertCompanyProfileRules, validate,
  ctrl.upsertCompanyProfile,
);

// ─── Store Settings ───────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/admin/store-settings:
 *   get:
 *     tags:
 *       - SysAdmin - Store Settings
 *     summary: Get store settings
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Store settings retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.get(
  '/store-settings',
  authenticate, roleGuard(READ_ADMIN),
  ctrl.getStoreSettings,
);

/**
 * @openapi
 * /api/v1/admin/store-settings:
 *   put:
 *     tags:
 *       - SysAdmin - Store Settings
 *     summary: Create or update store settings
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Store settings saved successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.put(
  '/store-settings',
  authenticate, roleGuard(ADMIN_ROLES),
  upsertStoreSettingsRules, validate,
  ctrl.upsertStoreSettings,
);

// ─── App Settings ─────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/admin/app-settings:
 *   get:
 *     tags:
 *       - SysAdmin - App Settings
 *     summary: Get app settings
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: App settings retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.get(
  '/app-settings',
  authenticate, roleGuard(READ_ADMIN),
  ctrl.getAppSettings,
);

/**
 * @openapi
 * /api/v1/admin/app-settings:
 *   put:
 *     tags:
 *       - SysAdmin - App Settings
 *     summary: Create or update app settings
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: App settings saved successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.put(
  '/app-settings',
  authenticate, roleGuard(ADMIN_ROLES),
  upsertAppSettingsRules, validate,
  ctrl.upsertAppSettings,
);

// ─── Theme Settings ───────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/admin/theme-settings:
 *   get:
 *     tags:
 *       - SysAdmin - Theme Settings
 *     summary: Get theme settings
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Theme settings retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.get(
  '/theme-settings',
  authenticate, roleGuard(READ_ADMIN),
  ctrl.getThemeSettings,
);

/**
 * @openapi
 * /api/v1/admin/theme-settings:
 *   put:
 *     tags:
 *       - SysAdmin - Theme Settings
 *     summary: Create or update theme settings
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Theme settings saved successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.put(
  '/theme-settings',
  authenticate, roleGuard(ADMIN_ROLES),
  upsertThemeSettingsRules, validate,
  ctrl.upsertThemeSettings,
);

// ─── Currencies ───────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/admin/currencies:
 *   get:
 *     tags:
 *       - SysAdmin - Currencies
 *     summary: List currencies
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of currencies retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.get(
  '/currencies',
  authenticate, roleGuard(READ_ADMIN),
  ctrl.listCurrencies,
);

/**
 * @openapi
 * /api/v1/admin/currencies/{id}:
 *   get:
 *     tags:
 *       - SysAdmin - Currencies
 *     summary: Get a currency by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Currency retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Currency not found
 */
router.get(
  '/currencies/:id',
  authenticate, roleGuard(READ_ADMIN),
  currencyIdRules, validate,
  ctrl.getCurrency,
);

/**
 * @openapi
 * /api/v1/admin/currencies:
 *   post:
 *     tags:
 *       - SysAdmin - Currencies
 *     summary: Create a currency
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - name
 *             properties:
 *               code:
 *                 type: string
 *                 description: ISO 4217 currency code (e.g. USD, INR)
 *               name:
 *                 type: string
 *               symbol:
 *                 type: string
 *               exchangeRate:
 *                 type: number
 *     responses:
 *       201:
 *         description: Currency created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.post(
  '/currencies',
  authenticate, roleGuard(FINANCE_ROLES),
  createCurrencyRules, validate,
  ctrl.createCurrency,
);

/**
 * @openapi
 * /api/v1/admin/currencies/{id}:
 *   put:
 *     tags:
 *       - SysAdmin - Currencies
 *     summary: Update a currency
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               symbol:
 *                 type: string
 *               exchangeRate:
 *                 type: number
 *     responses:
 *       200:
 *         description: Currency updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Currency not found
 */
router.put(
  '/currencies/:id',
  authenticate, roleGuard(FINANCE_ROLES),
  updateCurrencyRules, validate,
  ctrl.updateCurrency,
);

/**
 * @openapi
 * /api/v1/admin/currencies/{id}:
 *   delete:
 *     tags:
 *       - SysAdmin - Currencies
 *     summary: Delete a currency
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Currency deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Currency not found
 */
router.delete(
  '/currencies/:id',
  authenticate, roleGuard(SUPER_ADMIN),
  currencyIdRules, validate,
  ctrl.deleteCurrency,
);

/**
 * @openapi
 * /api/v1/admin/currencies/{id}/set-default:
 *   post:
 *     tags:
 *       - SysAdmin - Currencies
 *     summary: Set a currency as the default
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Default currency set successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Currency not found
 */
router.post(
  '/currencies/:id/set-default',
  authenticate, roleGuard(FINANCE_ROLES),
  currencyIdRules, validate,
  ctrl.setDefaultCurrency,
);

// ─── Languages ────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/admin/languages:
 *   get:
 *     tags:
 *       - SysAdmin - Languages
 *     summary: List languages
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of languages retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.get(
  '/languages',
  authenticate, roleGuard(READ_ADMIN),
  ctrl.listLanguages,
);

/**
 * @openapi
 * /api/v1/admin/languages/{id}:
 *   get:
 *     tags:
 *       - SysAdmin - Languages
 *     summary: Get a language by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Language retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Language not found
 */
router.get(
  '/languages/:id',
  authenticate, roleGuard(READ_ADMIN),
  languageIdRules, validate,
  ctrl.getLanguage,
);

/**
 * @openapi
 * /api/v1/admin/languages:
 *   post:
 *     tags:
 *       - SysAdmin - Languages
 *     summary: Create a language
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - name
 *             properties:
 *               code:
 *                 type: string
 *                 description: ISO 639-1 language code (e.g. en, fr)
 *               name:
 *                 type: string
 *               direction:
 *                 type: string
 *                 enum: [ltr, rtl]
 *     responses:
 *       201:
 *         description: Language created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.post(
  '/languages',
  authenticate, roleGuard(ADMIN_ROLES),
  createLanguageRules, validate,
  ctrl.createLanguage,
);

/**
 * @openapi
 * /api/v1/admin/languages/{id}:
 *   put:
 *     tags:
 *       - SysAdmin - Languages
 *     summary: Update a language
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               direction:
 *                 type: string
 *                 enum: [ltr, rtl]
 *     responses:
 *       200:
 *         description: Language updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Language not found
 */
router.put(
  '/languages/:id',
  authenticate, roleGuard(ADMIN_ROLES),
  updateLanguageRules, validate,
  ctrl.updateLanguage,
);

/**
 * @openapi
 * /api/v1/admin/languages/{id}:
 *   delete:
 *     tags:
 *       - SysAdmin - Languages
 *     summary: Delete a language
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Language deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Language not found
 */
router.delete(
  '/languages/:id',
  authenticate, roleGuard(SUPER_ADMIN),
  languageIdRules, validate,
  ctrl.deleteLanguage,
);

/**
 * @openapi
 * /api/v1/admin/languages/{id}/set-default:
 *   post:
 *     tags:
 *       - SysAdmin - Languages
 *     summary: Set a language as the default
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Default language set successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Language not found
 */
router.post(
  '/languages/:id/set-default',
  authenticate, roleGuard(ADMIN_ROLES),
  languageIdRules, validate,
  ctrl.setDefaultLanguage,
);

// ─── Tax Configuration ────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/admin/tax-configurations:
 *   get:
 *     tags:
 *       - SysAdmin - Tax Configuration
 *     summary: List tax configurations
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of tax configurations retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.get(
  '/tax-configurations',
  authenticate, roleGuard(READ_ADMIN),
  ctrl.listTaxConfigs,
);

/**
 * @openapi
 * /api/v1/admin/tax-configurations/{id}:
 *   get:
 *     tags:
 *       - SysAdmin - Tax Configuration
 *     summary: Get a tax configuration by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tax configuration retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Tax configuration not found
 */
router.get(
  '/tax-configurations/:id',
  authenticate, roleGuard(READ_ADMIN),
  taxConfigIdRules, validate,
  ctrl.getTaxConfig,
);

/**
 * @openapi
 * /api/v1/admin/tax-configurations:
 *   post:
 *     tags:
 *       - SysAdmin - Tax Configuration
 *     summary: Create a tax configuration
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - rate
 *             properties:
 *               name:
 *                 type: string
 *               rate:
 *                 type: number
 *               region:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tax configuration created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.post(
  '/tax-configurations',
  authenticate, roleGuard(FINANCE_ROLES),
  createTaxConfigRules, validate,
  ctrl.createTaxConfig,
);

/**
 * @openapi
 * /api/v1/admin/tax-configurations/{id}:
 *   put:
 *     tags:
 *       - SysAdmin - Tax Configuration
 *     summary: Update a tax configuration
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               rate:
 *                 type: number
 *               region:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tax configuration updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Tax configuration not found
 */
router.put(
  '/tax-configurations/:id',
  authenticate, roleGuard(FINANCE_ROLES),
  updateTaxConfigRules, validate,
  ctrl.updateTaxConfig,
);

/**
 * @openapi
 * /api/v1/admin/tax-configurations/{id}:
 *   delete:
 *     tags:
 *       - SysAdmin - Tax Configuration
 *     summary: Delete a tax configuration
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tax configuration deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Tax configuration not found
 */
router.delete(
  '/tax-configurations/:id',
  authenticate, roleGuard(SUPER_ADMIN),
  taxConfigIdRules, validate,
  ctrl.deleteTaxConfig,
);

/**
 * @openapi
 * /api/v1/admin/tax-configurations/{id}/set-default:
 *   post:
 *     tags:
 *       - SysAdmin - Tax Configuration
 *     summary: Set a tax configuration as the default
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Default tax configuration set successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Tax configuration not found
 */
router.post(
  '/tax-configurations/:id/set-default',
  authenticate, roleGuard(FINANCE_ROLES),
  taxConfigIdRules, validate,
  ctrl.setDefaultTaxConfig,
);

// ─── Email Configuration ──────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/admin/email-config:
 *   get:
 *     tags:
 *       - SysAdmin - Notifications
 *     summary: Get email configuration
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Email configuration retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.get(
  '/email-config',
  authenticate, roleGuard(ADMIN_ROLES),
  ctrl.getEmailConfig,
);

/**
 * @openapi
 * /api/v1/admin/email-config:
 *   put:
 *     tags:
 *       - SysAdmin - Notifications
 *     summary: Create or update email configuration
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               provider:
 *                 type: string
 *               host:
 *                 type: string
 *               port:
 *                 type: integer
 *               username:
 *                 type: string
 *               senderEmail:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Email configuration saved successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.put(
  '/email-config',
  authenticate, roleGuard(ADMIN_ROLES),
  upsertEmailConfigRules, validate,
  ctrl.upsertEmailConfig,
);

/**
 * @openapi
 * /api/v1/admin/email-config/test:
 *   post:
 *     tags:
 *       - SysAdmin - Notifications
 *     summary: Send a test email using the current configuration
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipientEmail:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Test email sent successfully
 *       400:
 *         description: Test email failed to send
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.post(
  '/email-config/test',
  authenticate, roleGuard(ADMIN_ROLES),
  ctrl.testEmailConfig,
);

// ─── SMS Configuration ────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/admin/sms-config:
 *   get:
 *     tags:
 *       - SysAdmin - Notifications
 *     summary: Get SMS configuration
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: SMS configuration retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.get(
  '/sms-config',
  authenticate, roleGuard(ADMIN_ROLES),
  ctrl.getSmsConfig,
);

/**
 * @openapi
 * /api/v1/admin/sms-config:
 *   put:
 *     tags:
 *       - SysAdmin - Notifications
 *     summary: Create or update SMS configuration
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               provider:
 *                 type: string
 *               apiKey:
 *                 type: string
 *               senderId:
 *                 type: string
 *     responses:
 *       200:
 *         description: SMS configuration saved successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.put(
  '/sms-config',
  authenticate, roleGuard(ADMIN_ROLES),
  upsertSmsConfigRules, validate,
  ctrl.upsertSmsConfig,
);

// ─── WhatsApp Configuration ───────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/admin/whatsapp-config:
 *   get:
 *     tags:
 *       - SysAdmin - Notifications
 *     summary: Get WhatsApp configuration
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: WhatsApp configuration retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.get(
  '/whatsapp-config',
  authenticate, roleGuard(ADMIN_ROLES),
  ctrl.getWhatsAppConfig,
);

/**
 * @openapi
 * /api/v1/admin/whatsapp-config:
 *   put:
 *     tags:
 *       - SysAdmin - Notifications
 *     summary: Create or update WhatsApp configuration
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               provider:
 *                 type: string
 *               apiKey:
 *                 type: string
 *               businessNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: WhatsApp configuration saved successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.put(
  '/whatsapp-config',
  authenticate, roleGuard(ADMIN_ROLES),
  upsertWhatsAppConfigRules, validate,
  ctrl.upsertWhatsAppConfig,
);

// ─── Push Notification Configuration ─────────────────────────────────────────

/**
 * @openapi
 * /api/v1/admin/push-config:
 *   get:
 *     tags:
 *       - SysAdmin - Notifications
 *     summary: Get push notification configuration
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Push configuration retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.get(
  '/push-config',
  authenticate, roleGuard(ADMIN_ROLES),
  ctrl.getPushConfig,
);

/**
 * @openapi
 * /api/v1/admin/push-config:
 *   put:
 *     tags:
 *       - SysAdmin - Notifications
 *     summary: Create or update push notification configuration
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               provider:
 *                 type: string
 *               serverKey:
 *                 type: string
 *     responses:
 *       200:
 *         description: Push configuration saved successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.put(
  '/push-config',
  authenticate, roleGuard(ADMIN_ROLES),
  upsertPushConfigRules, validate,
  ctrl.upsertPushConfig,
);

// ─── Notification Templates ───────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/admin/notification-templates:
 *   get:
 *     tags:
 *       - SysAdmin - Notification Templates
 *     summary: List notification templates
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: channel
 *         schema:
 *           type: string
 *           enum: [email, sms, whatsapp, push]
 *     responses:
 *       200:
 *         description: List of notification templates retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.get(
  '/notification-templates',
  authenticate, roleGuard(READ_ADMIN),
  notificationTemplateQueryRules, validate,
  ctrl.listNotificationTemplates,
);

/**
 * @openapi
 * /api/v1/admin/notification-templates/{id}:
 *   get:
 *     tags:
 *       - SysAdmin - Notification Templates
 *     summary: Get a notification template by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification template retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Notification template not found
 */
router.get(
  '/notification-templates/:id',
  authenticate, roleGuard(READ_ADMIN),
  notificationTemplateIdRules, validate,
  ctrl.getNotificationTemplate,
);

/**
 * @openapi
 * /api/v1/admin/notification-templates:
 *   post:
 *     tags:
 *       - SysAdmin - Notification Templates
 *     summary: Create a notification template
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - channel
 *               - content
 *             properties:
 *               name:
 *                 type: string
 *               channel:
 *                 type: string
 *                 enum: [email, sms, whatsapp, push]
 *               subject:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Notification template created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.post(
  '/notification-templates',
  authenticate, roleGuard(CONTENT_ADMIN),
  createNotificationTemplateRules, validate,
  ctrl.createNotificationTemplate,
);

/**
 * @openapi
 * /api/v1/admin/notification-templates/{id}:
 *   put:
 *     tags:
 *       - SysAdmin - Notification Templates
 *     summary: Update a notification template
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               subject:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notification template updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Notification template not found
 */
router.put(
  '/notification-templates/:id',
  authenticate, roleGuard(CONTENT_ADMIN),
  updateNotificationTemplateRules, validate,
  ctrl.updateNotificationTemplate,
);

/**
 * @openapi
 * /api/v1/admin/notification-templates/{id}:
 *   delete:
 *     tags:
 *       - SysAdmin - Notification Templates
 *     summary: Delete a notification template
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification template deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Notification template not found
 */
router.delete(
  '/notification-templates/:id',
  authenticate, roleGuard(SUPER_ADMIN),
  notificationTemplateIdRules, validate,
  ctrl.deleteNotificationTemplate,
);

// ─── API Keys ─────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/admin/api-keys:
 *   get:
 *     tags:
 *       - SysAdmin - API Keys
 *     summary: List API keys
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of API keys retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.get(
  '/api-keys',
  authenticate, roleGuard(ADMIN_ROLES),
  apiKeyQueryRules, validate,
  ctrl.listApiKeys,
);

/**
 * @openapi
 * /api/v1/admin/api-keys/{id}:
 *   get:
 *     tags:
 *       - SysAdmin - API Keys
 *     summary: Get an API key by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: API key retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: API key not found
 */
router.get(
  '/api-keys/:id',
  authenticate, roleGuard(ADMIN_ROLES),
  apiKeyIdRules, validate,
  ctrl.getApiKey,
);

/**
 * @openapi
 * /api/v1/admin/api-keys:
 *   post:
 *     tags:
 *       - SysAdmin - API Keys
 *     summary: Create an API key
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               scopes:
 *                 type: array
 *                 items:
 *                   type: string
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: API key created successfully. The raw secret is returned only once.
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.post(
  '/api-keys',
  authenticate, roleGuard(ADMIN_ROLES),
  createApiKeyRules, validate,
  ctrl.createApiKey,
);

/**
 * @openapi
 * /api/v1/admin/api-keys/{id}/revoke:
 *   post:
 *     tags:
 *       - SysAdmin - API Keys
 *     summary: Revoke an API key
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: API key revoked successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: API key not found
 */
router.post(
  '/api-keys/:id/revoke',
  authenticate, roleGuard(ADMIN_ROLES),
  apiKeyIdRules, validate,
  ctrl.revokeApiKey,
);

/**
 * @openapi
 * /api/v1/admin/api-keys/{id}/rotate:
 *   post:
 *     tags:
 *       - SysAdmin - API Keys
 *     summary: Rotate an API key
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: API key rotated successfully. The new raw secret is returned only once.
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: API key not found
 */
router.post(
  '/api-keys/:id/rotate',
  authenticate, roleGuard(ADMIN_ROLES),
  apiKeyIdRules, validate,
  ctrl.rotateApiKey,
);

/**
 * @openapi
 * /api/v1/admin/api-keys/{id}:
 *   delete:
 *     tags:
 *       - SysAdmin - API Keys
 *     summary: Delete an API key
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: API key deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: API key not found
 */
router.delete(
  '/api-keys/:id',
  authenticate, roleGuard(SUPER_ADMIN),
  apiKeyIdRules, validate,
  ctrl.deleteApiKey,
);

// ─── Third Party Integrations ─────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/admin/integrations:
 *   get:
 *     tags:
 *       - SysAdmin - Integrations
 *     summary: List third-party integrations
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of integrations retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.get(
  '/integrations',
  authenticate, roleGuard(ADMIN_ROLES),
  ctrl.listIntegrations,
);

/**
 * @openapi
 * /api/v1/admin/integrations/{provider}:
 *   get:
 *     tags:
 *       - SysAdmin - Integrations
 *     summary: Get an integration by provider
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: provider
 *         required: true
 *         schema:
 *           type: string
 *         description: Integration provider identifier (e.g. razorpay, shiprocket)
 *     responses:
 *       200:
 *         description: Integration retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Integration not found
 */
router.get(
  '/integrations/:provider',
  authenticate, roleGuard(ADMIN_ROLES),
  integrationProviderRules, validate,
  ctrl.getIntegration,
);

/**
 * @openapi
 * /api/v1/admin/integrations/{provider}:
 *   put:
 *     tags:
 *       - SysAdmin - Integrations
 *     summary: Create or update an integration
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: provider
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               apiKey:
 *                 type: string
 *               apiSecret:
 *                 type: string
 *               enabled:
 *                 type: boolean
 *               config:
 *                 type: object
 *     responses:
 *       200:
 *         description: Integration saved successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.put(
  '/integrations/:provider',
  authenticate, roleGuard(ADMIN_ROLES),
  upsertIntegrationRules, validate,
  ctrl.upsertIntegration,
);

/**
 * @openapi
 * /api/v1/admin/integrations/{provider}/test:
 *   post:
 *     tags:
 *       - SysAdmin - Integrations
 *     summary: Test an integration's connection
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: provider
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Integration test succeeded
 *       400:
 *         description: Integration test failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Integration not found
 */
router.post(
  '/integrations/:provider/test',
  authenticate, roleGuard(ADMIN_ROLES),
  integrationProviderRules, validate,
  ctrl.testIntegration,
);

// ─── Feature Flags ────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/admin/feature-flags:
 *   get:
 *     tags:
 *       - SysAdmin - Feature Flags
 *     summary: List feature flags
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of feature flags retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.get(
  '/feature-flags',
  authenticate, roleGuard(READ_ADMIN),
  featureFlagQueryRules, validate,
  ctrl.listFeatureFlags,
);

/**
 * @openapi
 * /api/v1/admin/feature-flags/{id}:
 *   get:
 *     tags:
 *       - SysAdmin - Feature Flags
 *     summary: Get a feature flag by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feature flag retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Feature flag not found
 */
router.get(
  '/feature-flags/:id',
  authenticate, roleGuard(READ_ADMIN),
  featureFlagIdRules, validate,
  ctrl.getFeatureFlag,
);

/**
 * @openapi
 * /api/v1/admin/feature-flags:
 *   post:
 *     tags:
 *       - SysAdmin - Feature Flags
 *     summary: Create a feature flag
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - key
 *             properties:
 *               key:
 *                 type: string
 *               description:
 *                 type: string
 *               enabled:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Feature flag created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.post(
  '/feature-flags',
  authenticate, roleGuard(ADMIN_ROLES),
  createFeatureFlagRules, validate,
  ctrl.createFeatureFlag,
);

/**
 * @openapi
 * /api/v1/admin/feature-flags/{id}:
 *   put:
 *     tags:
 *       - SysAdmin - Feature Flags
 *     summary: Update a feature flag
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               enabled:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Feature flag updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Feature flag not found
 */
router.put(
  '/feature-flags/:id',
  authenticate, roleGuard(ADMIN_ROLES),
  updateFeatureFlagRules, validate,
  ctrl.updateFeatureFlag,
);

/**
 * @openapi
 * /api/v1/admin/feature-flags/{id}/toggle:
 *   post:
 *     tags:
 *       - SysAdmin - Feature Flags
 *     summary: Toggle a feature flag on or off
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feature flag toggled successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Feature flag not found
 */
router.post(
  '/feature-flags/:id/toggle',
  authenticate, roleGuard(ADMIN_ROLES),
  featureFlagIdRules, validate,
  ctrl.toggleFeatureFlag,
);

/**
 * @openapi
 * /api/v1/admin/feature-flags/{id}:
 *   delete:
 *     tags:
 *       - SysAdmin - Feature Flags
 *     summary: Delete a feature flag
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feature flag deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Feature flag not found
 */
router.delete(
  '/feature-flags/:id',
  authenticate, roleGuard(SUPER_ADMIN),
  featureFlagIdRules, validate,
  ctrl.deleteFeatureFlag,
);

// ─── Scheduler Jobs ───────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/admin/scheduler-jobs:
 *   get:
 *     tags:
 *       - SysAdmin - Scheduler Jobs
 *     summary: List scheduler jobs
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of scheduler jobs retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.get(
  '/scheduler-jobs',
  authenticate, roleGuard(READ_ADMIN),
  schedulerJobQueryRules, validate,
  ctrl.listSchedulerJobs,
);

/**
 * @openapi
 * /api/v1/admin/scheduler-jobs/{id}:
 *   get:
 *     tags:
 *       - SysAdmin - Scheduler Jobs
 *     summary: Get a scheduler job by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Scheduler job retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Scheduler job not found
 */
router.get(
  '/scheduler-jobs/:id',
  authenticate, roleGuard(READ_ADMIN),
  schedulerJobIdRules, validate,
  ctrl.getSchedulerJob,
);

/**
 * @openapi
 * /api/v1/admin/scheduler-jobs:
 *   post:
 *     tags:
 *       - SysAdmin - Scheduler Jobs
 *     summary: Create a scheduler job
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - cronExpression
 *             properties:
 *               name:
 *                 type: string
 *               cronExpression:
 *                 type: string
 *               jobType:
 *                 type: string
 *               enabled:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Scheduler job created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.post(
  '/scheduler-jobs',
  authenticate, roleGuard(ADMIN_ROLES),
  createSchedulerJobRules, validate,
  ctrl.createSchedulerJob,
);

/**
 * @openapi
 * /api/v1/admin/scheduler-jobs/{id}:
 *   put:
 *     tags:
 *       - SysAdmin - Scheduler Jobs
 *     summary: Update a scheduler job
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               cronExpression:
 *                 type: string
 *               enabled:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Scheduler job updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Scheduler job not found
 */
router.put(
  '/scheduler-jobs/:id',
  authenticate, roleGuard(ADMIN_ROLES),
  updateSchedulerJobRules, validate,
  ctrl.updateSchedulerJob,
);

/**
 * @openapi
 * /api/v1/admin/scheduler-jobs/{id}/trigger:
 *   post:
 *     tags:
 *       - SysAdmin - Scheduler Jobs
 *     summary: Manually trigger a scheduler job
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Scheduler job triggered successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Scheduler job not found
 */
router.post(
  '/scheduler-jobs/:id/trigger',
  authenticate, roleGuard(ADMIN_ROLES),
  schedulerJobIdRules, validate,
  ctrl.triggerSchedulerJob,
);

/**
 * @openapi
 * /api/v1/admin/scheduler-jobs/{id}/pause:
 *   post:
 *     tags:
 *       - SysAdmin - Scheduler Jobs
 *     summary: Pause a scheduler job
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Scheduler job paused successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Scheduler job not found
 */
router.post(
  '/scheduler-jobs/:id/pause',
  authenticate, roleGuard(ADMIN_ROLES),
  schedulerJobIdRules, validate,
  ctrl.pauseSchedulerJob,
);

/**
 * @openapi
 * /api/v1/admin/scheduler-jobs/{id}/resume:
 *   post:
 *     tags:
 *       - SysAdmin - Scheduler Jobs
 *     summary: Resume a paused scheduler job
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Scheduler job resumed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Scheduler job not found
 */
router.post(
  '/scheduler-jobs/:id/resume',
  authenticate, roleGuard(ADMIN_ROLES),
  schedulerJobIdRules, validate,
  ctrl.resumeSchedulerJob,
);

/**
 * @openapi
 * /api/v1/admin/scheduler-jobs/{id}:
 *   delete:
 *     tags:
 *       - SysAdmin - Scheduler Jobs
 *     summary: Delete a scheduler job
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Scheduler job deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Scheduler job not found
 */
router.delete(
  '/scheduler-jobs/:id',
  authenticate, roleGuard(SUPER_ADMIN),
  schedulerJobIdRules, validate,
  ctrl.deleteSchedulerJob,
);

// ─── Audit Logs ───────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/admin/audit-logs:
 *   get:
 *     tags:
 *       - SysAdmin - Logs
 *     summary: List audit logs
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of audit logs retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.get(
  '/audit-logs',
  authenticate, roleGuard(READ_ADMIN),
  auditLogQueryRules, validate,
  ctrl.listAuditLogs,
);

/**
 * @openapi
 * /api/v1/admin/audit-logs/{id}:
 *   get:
 *     tags:
 *       - SysAdmin - Logs
 *     summary: Get an audit log entry by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Audit log entry retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Audit log entry not found
 */
router.get(
  '/audit-logs/:id',
  authenticate, roleGuard(READ_ADMIN),
  auditLogIdRules, validate,
  ctrl.getAuditLog,
);

// ─── Activity Logs ────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/admin/activity-logs:
 *   get:
 *     tags:
 *       - SysAdmin - Logs
 *     summary: List activity logs
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of activity logs retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.get(
  '/activity-logs',
  authenticate, roleGuard(READ_ADMIN),
  activityLogQueryRules, validate,
  ctrl.listActivityLogs,
);

// ─── Error Logs ───────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/admin/error-logs:
 *   get:
 *     tags:
 *       - SysAdmin - Logs
 *     summary: List error logs
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: severity
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of error logs retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.get(
  '/error-logs',
  authenticate, roleGuard(ADMIN_ROLES),
  errorLogQueryRules, validate,
  ctrl.listErrorLogs,
);

/**
 * @openapi
 * /api/v1/admin/error-logs/{id}:
 *   get:
 *     tags:
 *       - SysAdmin - Logs
 *     summary: Get an error log entry by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Error log entry retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Error log entry not found
 */
router.get(
  '/error-logs/:id',
  authenticate, roleGuard(ADMIN_ROLES),
  errorLogIdRules, validate,
  ctrl.getErrorLog,
);

// ─── System Health ────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/admin/system-health:
 *   get:
 *     tags:
 *       - SysAdmin - System
 *     summary: Get system health status
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: System health status retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.get(
  '/system-health',
  authenticate, roleGuard(READ_ADMIN),
  ctrl.getSystemHealth,
);

// ─── Security Settings ────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/admin/security-settings:
 *   get:
 *     tags:
 *       - SysAdmin - Security
 *     summary: Get security settings
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Security settings retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.get(
  '/security-settings',
  authenticate, roleGuard(ADMIN_ROLES),
  ctrl.getSecuritySettings,
);

/**
 * @openapi
 * /api/v1/admin/security-settings:
 *   put:
 *     tags:
 *       - SysAdmin - Security
 *     summary: Create or update security settings
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               passwordPolicy:
 *                 type: object
 *               sessionTimeoutMinutes:
 *                 type: integer
 *               mfaRequired:
 *                 type: boolean
 *               ipWhitelist:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Security settings saved successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.put(
  '/security-settings',
  authenticate, roleGuard(SUPER_ADMIN),
  upsertSecuritySettingsRules, validate,
  ctrl.upsertSecuritySettings,
);

// ─── Backup ───────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/admin/backups:
 *   get:
 *     tags:
 *       - SysAdmin - Backups
 *     summary: List backups
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of backups retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.get(
  '/backups',
  authenticate, roleGuard(ADMIN_ROLES),
  backupQueryRules, validate,
  ctrl.listBackups,
);

/**
 * @openapi
 * /api/v1/admin/backups/{id}:
 *   get:
 *     tags:
 *       - SysAdmin - Backups
 *     summary: Get a backup by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Backup retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Backup not found
 */
router.get(
  '/backups/:id',
  authenticate, roleGuard(ADMIN_ROLES),
  backupIdRules, validate,
  ctrl.getBackup,
);

/**
 * @openapi
 * /api/v1/admin/backups:
 *   post:
 *     tags:
 *       - SysAdmin - Backups
 *     summary: Create a new backup
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [full, incremental]
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Backup created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.post(
  '/backups',
  authenticate, roleGuard(SUPER_ADMIN),
  createBackupRules, validate,
  ctrl.createBackup,
);

/**
 * @openapi
 * /api/v1/admin/backups/{id}/restore:
 *   post:
 *     tags:
 *       - SysAdmin - Backups
 *     summary: Restore from a backup
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Backup restore initiated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Backup not found
 */
router.post(
  '/backups/:id/restore',
  authenticate, roleGuard(SUPER_ADMIN),
  backupIdRules, validate,
  ctrl.restoreBackup,
);

// ─── File Storage Config ──────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/admin/file-storage:
 *   get:
 *     tags:
 *       - SysAdmin - System
 *     summary: Get file storage configuration
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: File storage configuration retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.get(
  '/file-storage',
  authenticate, roleGuard(ADMIN_ROLES),
  ctrl.getFileStorageConfig,
);

/**
 * @openapi
 * /api/v1/admin/file-storage:
 *   put:
 *     tags:
 *       - SysAdmin - System
 *     summary: Create or update file storage configuration
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               provider:
 *                 type: string
 *                 description: Storage provider (e.g. s3, local, gcs)
 *               bucket:
 *                 type: string
 *               region:
 *                 type: string
 *               maxFileSizeMb:
 *                 type: integer
 *     responses:
 *       200:
 *         description: File storage configuration saved successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.put(
  '/file-storage',
  authenticate, roleGuard(SUPER_ADMIN),
  upsertFileStorageRules, validate,
  ctrl.upsertFileStorageConfig,
);

// ─── License ──────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/admin/license:
 *   get:
 *     tags:
 *       - SysAdmin - System
 *     summary: Get license information
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: License information retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.get(
  '/license',
  authenticate, roleGuard(READ_ADMIN),
  ctrl.getLicense,
);

/**
 * @openapi
 * /api/v1/admin/license:
 *   put:
 *     tags:
 *       - SysAdmin - System
 *     summary: Create or update license information
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               licenseKey:
 *                 type: string
 *               validUntil:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: License saved successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.put(
  '/license',
  authenticate, roleGuard(SUPER_ADMIN),
  upsertLicenseRules, validate,
  ctrl.upsertLicense,
);

// ─── System Versions ─────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/admin/versions:
 *   get:
 *     tags:
 *       - SysAdmin - System
 *     summary: List system versions
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of system versions retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.get(
  '/versions',
  authenticate, roleGuard(READ_ADMIN),
  ctrl.listSystemVersions,
);

/**
 * @openapi
 * /api/v1/admin/versions/latest:
 *   get:
 *     tags:
 *       - SysAdmin - System
 *     summary: Get the latest system version
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Latest system version retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.get(
  '/versions/latest',
  authenticate, roleGuard(READ_ADMIN),
  ctrl.getLatestVersion,
);

/**
 * @openapi
 * /api/v1/admin/versions:
 *   post:
 *     tags:
 *       - SysAdmin - System
 *     summary: Record a new system version
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - version
 *             properties:
 *               version:
 *                 type: string
 *               releaseNotes:
 *                 type: string
 *     responses:
 *       201:
 *         description: System version created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.post(
  '/versions',
  authenticate, roleGuard(SUPER_ADMIN),
  createSystemVersionRules, validate,
  ctrl.createSystemVersion,
);

// ─── Environment Config ───────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/admin/env-configs:
 *   get:
 *     tags:
 *       - SysAdmin - Environment Config
 *     summary: List environment configurations
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of environment configurations retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.get(
  '/env-configs',
  authenticate, roleGuard(ADMIN_ROLES),
  envConfigQueryRules, validate,
  ctrl.listEnvConfigs,
);

/**
 * @openapi
 * /api/v1/admin/env-configs/{id}:
 *   get:
 *     tags:
 *       - SysAdmin - Environment Config
 *     summary: Get an environment configuration by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Environment configuration retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Environment configuration not found
 */
router.get(
  '/env-configs/:id',
  authenticate, roleGuard(ADMIN_ROLES),
  envConfigIdRules, validate,
  ctrl.getEnvConfig,
);

/**
 * @openapi
 * /api/v1/admin/env-configs:
 *   post:
 *     tags:
 *       - SysAdmin - Environment Config
 *     summary: Create an environment configuration
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - key
 *               - value
 *             properties:
 *               key:
 *                 type: string
 *               value:
 *                 type: string
 *               isSecret:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Environment configuration created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.post(
  '/env-configs',
  authenticate, roleGuard(SUPER_ADMIN),
  createEnvConfigRules, validate,
  ctrl.createEnvConfig,
);

/**
 * @openapi
 * /api/v1/admin/env-configs/{id}:
 *   put:
 *     tags:
 *       - SysAdmin - Environment Config
 *     summary: Update an environment configuration
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: string
 *               isSecret:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Environment configuration updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Environment configuration not found
 */
router.put(
  '/env-configs/:id',
  authenticate, roleGuard(SUPER_ADMIN),
  updateEnvConfigRules, validate,
  ctrl.updateEnvConfig,
);

/**
 * @openapi
 * /api/v1/admin/env-configs/{id}:
 *   delete:
 *     tags:
 *       - SysAdmin - Environment Config
 *     summary: Delete an environment configuration
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Environment configuration deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Environment configuration not found
 */
router.delete(
  '/env-configs/:id',
  authenticate, roleGuard(SUPER_ADMIN),
  envConfigIdRules, validate,
  ctrl.deleteEnvConfig,
);

export default router;