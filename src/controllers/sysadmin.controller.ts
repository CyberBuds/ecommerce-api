import { Request, Response, NextFunction } from 'express';
import apiResponse from '../utils/apiResponse';
import SysAdminService from '../services/sysadmin.service';

/**
 * @swagger
 * tags:
 *   name: SysAdmin
 *   description: System Administration & Configuration APIs
 */

export default function createSysAdminController(service: SysAdminService) {
  const actor = (req: Request): number | undefined => {
    const user = (req as any).user;
    return user?.sub ? Number(user.sub) : undefined;
  };

  return {

    // ──────────────────────────────────────────────────────────────────────
    // Company Profile
    // ──────────────────────────────────────────────────────────────────────

    /**
     * @swagger
     * /api/v1/admin/company-profile:
     *   get:
     *     summary: Get company profile
     *     tags: [SysAdmin]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Company profile
     */
    getCompanyProfile: async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getCompanyProfile();
        return apiResponse.success(res, data, 'Company profile fetched');
      } catch (e) { next(e); }
    },

    /**
     * @swagger
     * /api/v1/admin/company-profile:
     *   put:
     *     summary: Create or update company profile
     *     tags: [SysAdmin]
     *     security:
     *       - bearerAuth: []
     */
    upsertCompanyProfile: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.upsertCompanyProfile(req.body, actor(req));
        return apiResponse.success(res, data, 'Company profile saved');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // Store Settings
    // ──────────────────────────────────────────────────────────────────────

    /**
     * @swagger
     * /api/v1/admin/store-settings:
     *   get:
     *     summary: Get store settings
     *     tags: [SysAdmin]
     *     security:
     *       - bearerAuth: []
     */
    getStoreSettings: async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getStoreSettings();
        return apiResponse.success(res, data, 'Store settings fetched');
      } catch (e) { next(e); }
    },

    upsertStoreSettings: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.upsertStoreSettings(req.body);
        return apiResponse.success(res, data, 'Store settings saved');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // App Settings
    // ──────────────────────────────────────────────────────────────────────

    getAppSettings: async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getAppSettings();
        return apiResponse.success(res, data, 'App settings fetched');
      } catch (e) { next(e); }
    },

    upsertAppSettings: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.upsertAppSettings(req.body);
        return apiResponse.success(res, data, 'App settings saved');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // Theme Settings
    // ──────────────────────────────────────────────────────────────────────

    getThemeSettings: async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getThemeSettings();
        return apiResponse.success(res, data, 'Theme settings fetched');
      } catch (e) { next(e); }
    },

    upsertThemeSettings: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.upsertThemeSettings(req.body);
        return apiResponse.success(res, data, 'Theme settings saved');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // Currency
    // ──────────────────────────────────────────────────────────────────────

    /**
     * @swagger
     * /api/v1/admin/currencies:
     *   get:
     *     summary: List all currencies
     *     tags: [SysAdmin]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: isActive
     *         schema: { type: boolean }
     */
    listCurrencies: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const isActive = req.query.isActive !== undefined
          ? req.query.isActive === 'true'
          : undefined;
        const data = await service.listCurrencies(isActive);
        return apiResponse.success(res, data, 'Currencies fetched');
      } catch (e) { next(e); }
    },

    getCurrency: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getCurrency(Number(req.params.id));
        return apiResponse.success(res, data, 'Currency fetched');
      } catch (e) { next(e); }
    },

    createCurrency: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.createCurrency(req.body);
        return apiResponse.created(res, data, 'Currency created');
      } catch (e) { next(e); }
    },

    updateCurrency: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.updateCurrency(Number(req.params.id), req.body);
        return apiResponse.success(res, data, 'Currency updated');
      } catch (e) { next(e); }
    },

    deleteCurrency: async (req: Request, res: Response, next: NextFunction) => {
      try {
        await service.deleteCurrency(Number(req.params.id));
        return apiResponse.success(res, null, 'Currency deleted');
      } catch (e) { next(e); }
    },

    setDefaultCurrency: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.setDefaultCurrency(Number(req.params.id));
        return apiResponse.success(res, data, 'Default currency updated');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // Language
    // ──────────────────────────────────────────────────────────────────────

    listLanguages: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const isActive = req.query.isActive !== undefined
          ? req.query.isActive === 'true'
          : undefined;
        const data = await service.listLanguages(isActive);
        return apiResponse.success(res, data, 'Languages fetched');
      } catch (e) { next(e); }
    },

    getLanguage: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getLanguage(Number(req.params.id));
        return apiResponse.success(res, data, 'Language fetched');
      } catch (e) { next(e); }
    },

    createLanguage: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.createLanguage(req.body);
        return apiResponse.created(res, data, 'Language created');
      } catch (e) { next(e); }
    },

    updateLanguage: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.updateLanguage(Number(req.params.id), req.body);
        return apiResponse.success(res, data, 'Language updated');
      } catch (e) { next(e); }
    },

    deleteLanguage: async (req: Request, res: Response, next: NextFunction) => {
      try {
        await service.deleteLanguage(Number(req.params.id));
        return apiResponse.success(res, null, 'Language deleted');
      } catch (e) { next(e); }
    },

    setDefaultLanguage: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.setDefaultLanguage(Number(req.params.id));
        return apiResponse.success(res, data, 'Default language updated');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // Tax Configuration
    // ──────────────────────────────────────────────────────────────────────

    listTaxConfigs: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const isActive = req.query.isActive !== undefined
          ? req.query.isActive === 'true'
          : undefined;
        const data = await service.listTaxConfigs(isActive);
        return apiResponse.success(res, data, 'Tax configurations fetched');
      } catch (e) { next(e); }
    },

    getTaxConfig: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getTaxConfig(Number(req.params.id));
        return apiResponse.success(res, data, 'Tax configuration fetched');
      } catch (e) { next(e); }
    },

    createTaxConfig: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.createTaxConfig(req.body);
        return apiResponse.created(res, data, 'Tax configuration created');
      } catch (e) { next(e); }
    },

    updateTaxConfig: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.updateTaxConfig(Number(req.params.id), req.body);
        return apiResponse.success(res, data, 'Tax configuration updated');
      } catch (e) { next(e); }
    },

    deleteTaxConfig: async (req: Request, res: Response, next: NextFunction) => {
      try {
        await service.deleteTaxConfig(Number(req.params.id));
        return apiResponse.success(res, null, 'Tax configuration deleted');
      } catch (e) { next(e); }
    },

    setDefaultTaxConfig: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.setDefaultTaxConfig(Number(req.params.id));
        return apiResponse.success(res, data, 'Default tax configuration updated');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // Email Configuration
    // ──────────────────────────────────────────────────────────────────────

    /**
     * @swagger
     * /api/v1/admin/email-config:
     *   get:
     *     summary: Get SMTP email configuration (password masked)
     *     tags: [SysAdmin]
     *     security:
     *       - bearerAuth: []
     */
    getEmailConfig: async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getEmailConfig();
        return apiResponse.success(res, data, 'Email config fetched');
      } catch (e) { next(e); }
    },

    upsertEmailConfig: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.upsertEmailConfig(req.body);
        return apiResponse.success(res, data, 'Email config saved');
      } catch (e) { next(e); }
    },

    testEmailConfig: async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.testEmailConfig();
        return apiResponse.success(res, data, 'Email config tested');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // SMS Configuration
    // ──────────────────────────────────────────────────────────────────────

    getSmsConfig: async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getSmsConfig();
        return apiResponse.success(res, data, 'SMS config fetched');
      } catch (e) { next(e); }
    },

    upsertSmsConfig: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.upsertSmsConfig(req.body);
        return apiResponse.success(res, data, 'SMS config saved');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // WhatsApp Configuration
    // ──────────────────────────────────────────────────────────────────────

    getWhatsAppConfig: async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getWhatsAppConfig();
        return apiResponse.success(res, data, 'WhatsApp config fetched');
      } catch (e) { next(e); }
    },

    upsertWhatsAppConfig: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.upsertWhatsAppConfig(req.body);
        return apiResponse.success(res, data, 'WhatsApp config saved');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // Push Notification Configuration
    // ──────────────────────────────────────────────────────────────────────

    getPushConfig: async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getPushConfig();
        return apiResponse.success(res, data, 'Push notification config fetched');
      } catch (e) { next(e); }
    },

    upsertPushConfig: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.upsertPushConfig(req.body);
        return apiResponse.success(res, data, 'Push notification config saved');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // Notification Templates
    // ──────────────────────────────────────────────────────────────────────

    listNotificationTemplates: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.listNotificationTemplates(req.query as any);
        return apiResponse.success(res, data, 'Notification templates fetched');
      } catch (e) { next(e); }
    },

    getNotificationTemplate: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getNotificationTemplate(Number(req.params.id));
        return apiResponse.success(res, data, 'Notification template fetched');
      } catch (e) { next(e); }
    },

    createNotificationTemplate: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.createNotificationTemplate(req.body, actor(req));
        return apiResponse.created(res, data, 'Notification template created');
      } catch (e) { next(e); }
    },

    updateNotificationTemplate: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.updateNotificationTemplate(Number(req.params.id), req.body, actor(req));
        return apiResponse.success(res, data, 'Notification template updated');
      } catch (e) { next(e); }
    },

    deleteNotificationTemplate: async (req: Request, res: Response, next: NextFunction) => {
      try {
        await service.deleteNotificationTemplate(Number(req.params.id));
        return apiResponse.success(res, null, 'Notification template deleted');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // API Keys
    // ──────────────────────────────────────────────────────────────────────

    /**
     * @swagger
     * /api/v1/admin/api-keys:
     *   get:
     *     summary: List API keys (raw key and hash never returned)
     *     tags: [SysAdmin]
     *     security:
     *       - bearerAuth: []
     */
    listApiKeys: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.listApiKeys(req.query as any);
        return apiResponse.success(res, data, 'API keys fetched');
      } catch (e) { next(e); }
    },

    getApiKey: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getApiKey(Number(req.params.id));
        return apiResponse.success(res, data, 'API key fetched');
      } catch (e) { next(e); }
    },

    /**
     * @swagger
     * /api/v1/admin/api-keys:
     *   post:
     *     summary: Create a new API key. Raw key is returned ONCE — store it securely.
     *     tags: [SysAdmin]
     *     security:
     *       - bearerAuth: []
     */
    createApiKey: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.createApiKey(req.body, actor(req));
        return apiResponse.created(res, data, 'API key created — store the rawKey securely, it will not be shown again');
      } catch (e) { next(e); }
    },

    revokeApiKey: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.revokeApiKey(Number(req.params.id));
        return apiResponse.success(res, data, 'API key revoked');
      } catch (e) { next(e); }
    },

    rotateApiKey: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.rotateApiKey(Number(req.params.id), actor(req));
        return apiResponse.success(res, data, 'API key rotated — store the new rawKey securely');
      } catch (e) { next(e); }
    },

    deleteApiKey: async (req: Request, res: Response, next: NextFunction) => {
      try {
        await service.deleteApiKey(Number(req.params.id));
        return apiResponse.success(res, null, 'API key deleted');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // Third Party Integrations
    // ──────────────────────────────────────────────────────────────────────

    listIntegrations: async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.listIntegrations();
        return apiResponse.success(res, data, 'Integrations fetched');
      } catch (e) { next(e); }
    },

    getIntegration: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getIntegration(req.params.provider);
        return apiResponse.success(res, data, 'Integration fetched');
      } catch (e) { next(e); }
    },

    upsertIntegration: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.upsertIntegration(req.params.provider, req.body, actor(req));
        return apiResponse.success(res, data, 'Integration saved');
      } catch (e) { next(e); }
    },

    testIntegration: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.testIntegration(req.params.provider);
        return apiResponse.success(res, data, 'Integration test recorded');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // Feature Flags
    // ──────────────────────────────────────────────────────────────────────

    listFeatureFlags: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.listFeatureFlags(req.query as any);
        return apiResponse.success(res, data, 'Feature flags fetched');
      } catch (e) { next(e); }
    },

    getFeatureFlag: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getFeatureFlag(Number(req.params.id));
        return apiResponse.success(res, data, 'Feature flag fetched');
      } catch (e) { next(e); }
    },

    createFeatureFlag: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.createFeatureFlag(req.body, actor(req));
        return apiResponse.created(res, data, 'Feature flag created');
      } catch (e) { next(e); }
    },

    updateFeatureFlag: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.updateFeatureFlag(Number(req.params.id), req.body, actor(req));
        return apiResponse.success(res, data, 'Feature flag updated');
      } catch (e) { next(e); }
    },

    toggleFeatureFlag: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.toggleFeatureFlag(Number(req.params.id), actor(req));
        return apiResponse.success(res, data, 'Feature flag toggled');
      } catch (e) { next(e); }
    },

    deleteFeatureFlag: async (req: Request, res: Response, next: NextFunction) => {
      try {
        await service.deleteFeatureFlag(Number(req.params.id));
        return apiResponse.success(res, null, 'Feature flag deleted');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // Scheduler Jobs
    // ──────────────────────────────────────────────────────────────────────

    listSchedulerJobs: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.listSchedulerJobs(req.query as any);
        return apiResponse.success(res, data, 'Scheduler jobs fetched');
      } catch (e) { next(e); }
    },

    getSchedulerJob: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getSchedulerJob(Number(req.params.id));
        return apiResponse.success(res, data, 'Scheduler job fetched');
      } catch (e) { next(e); }
    },

    createSchedulerJob: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.createSchedulerJob(req.body, actor(req));
        return apiResponse.created(res, data, 'Scheduler job created');
      } catch (e) { next(e); }
    },

    updateSchedulerJob: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.updateSchedulerJob(Number(req.params.id), req.body, actor(req));
        return apiResponse.success(res, data, 'Scheduler job updated');
      } catch (e) { next(e); }
    },

    triggerSchedulerJob: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.triggerSchedulerJob(Number(req.params.id));
        return apiResponse.success(res, data, 'Scheduler job triggered');
      } catch (e) { next(e); }
    },

    pauseSchedulerJob: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.pauseSchedulerJob(Number(req.params.id), actor(req));
        return apiResponse.success(res, data, 'Scheduler job paused');
      } catch (e) { next(e); }
    },

    resumeSchedulerJob: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.resumeSchedulerJob(Number(req.params.id), actor(req));
        return apiResponse.success(res, data, 'Scheduler job resumed');
      } catch (e) { next(e); }
    },

    deleteSchedulerJob: async (req: Request, res: Response, next: NextFunction) => {
      try {
        await service.deleteSchedulerJob(Number(req.params.id));
        return apiResponse.success(res, null, 'Scheduler job deleted');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // Audit Logs
    // ──────────────────────────────────────────────────────────────────────

    listAuditLogs: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.listAuditLogs(req.query as any);
        return apiResponse.success(res, data, 'Audit logs fetched');
      } catch (e) { next(e); }
    },

    getAuditLog: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getAuditLog(Number(req.params.id));
        return apiResponse.success(res, data, 'Audit log fetched');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // Activity Logs
    // ──────────────────────────────────────────────────────────────────────

    listActivityLogs: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.listActivityLogs(req.query as any);
        return apiResponse.success(res, data, 'Activity logs fetched');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // Error Logs
    // ──────────────────────────────────────────────────────────────────────

    listErrorLogs: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.listErrorLogs(req.query as any);
        return apiResponse.success(res, data, 'Error logs fetched');
      } catch (e) { next(e); }
    },

    getErrorLog: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getErrorLog(Number(req.params.id));
        return apiResponse.success(res, data, 'Error log fetched');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // System Health
    // ──────────────────────────────────────────────────────────────────────

    /**
     * @swagger
     * /api/v1/admin/system-health:
     *   get:
     *     summary: Get system health status
     *     tags: [SysAdmin]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: System health report with service statuses and resource usage
     */
    getSystemHealth: async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getSystemHealth();
        return apiResponse.success(res, data, 'System health fetched');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // Security Settings
    // ──────────────────────────────────────────────────────────────────────

    getSecuritySettings: async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getSecuritySettings();
        return apiResponse.success(res, data, 'Security settings fetched');
      } catch (e) { next(e); }
    },

    upsertSecuritySettings: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.upsertSecuritySettings(req.body);
        return apiResponse.success(res, data, 'Security settings saved');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // Backup
    // ──────────────────────────────────────────────────────────────────────

    listBackups: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.listBackups(req.query as any);
        return apiResponse.success(res, data, 'Backups fetched');
      } catch (e) { next(e); }
    },

    getBackup: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getBackup(Number(req.params.id));
        return apiResponse.success(res, data, 'Backup fetched');
      } catch (e) { next(e); }
    },

    createBackup: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.createBackup(req.body, actor(req));
        return apiResponse.created(res, data, 'Backup initiated');
      } catch (e) { next(e); }
    },

    restoreBackup: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.restoreBackup(Number(req.params.id));
        return apiResponse.success(res, data, 'Backup restore initiated');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // File Storage Config
    // ──────────────────────────────────────────────────────────────────────

    getFileStorageConfig: async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getFileStorageConfig();
        return apiResponse.success(res, data, 'File storage config fetched');
      } catch (e) { next(e); }
    },

    upsertFileStorageConfig: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.upsertFileStorageConfig(req.body);
        return apiResponse.success(res, data, 'File storage config saved');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // License
    // ──────────────────────────────────────────────────────────────────────

    getLicense: async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getLicense();
        return apiResponse.success(res, data, 'License info fetched');
      } catch (e) { next(e); }
    },

    upsertLicense: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.upsertLicense(req.body);
        return apiResponse.success(res, data, 'License saved');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // System Versions
    // ──────────────────────────────────────────────────────────────────────

    listSystemVersions: async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.listSystemVersions();
        return apiResponse.success(res, data, 'System versions fetched');
      } catch (e) { next(e); }
    },

    getLatestVersion: async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getLatestVersion();
        return apiResponse.success(res, data, 'Latest version fetched');
      } catch (e) { next(e); }
    },

    createSystemVersion: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.createSystemVersion(req.body);
        return apiResponse.created(res, data, 'System version created');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // Environment Config
    // ──────────────────────────────────────────────────────────────────────

    listEnvConfigs: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.listEnvConfigs(req.query as any);
        return apiResponse.success(res, data, 'Environment configs fetched');
      } catch (e) { next(e); }
    },

    getEnvConfig: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getEnvConfig(Number(req.params.id));
        return apiResponse.success(res, data, 'Environment config fetched');
      } catch (e) { next(e); }
    },

    createEnvConfig: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.createEnvConfig(req.body, actor(req));
        return apiResponse.created(res, data, 'Environment config created');
      } catch (e) { next(e); }
    },

    updateEnvConfig: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.updateEnvConfig(Number(req.params.id), req.body, actor(req));
        return apiResponse.success(res, data, 'Environment config updated');
      } catch (e) { next(e); }
    },

    deleteEnvConfig: async (req: Request, res: Response, next: NextFunction) => {
      try {
        await service.deleteEnvConfig(Number(req.params.id));
        return apiResponse.success(res, null, 'Environment config deleted');
      } catch (e) { next(e); }
    },
  };
}
