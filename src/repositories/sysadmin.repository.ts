import prisma from '../helpers/prisma';
import { buildPagination } from '../utils/pagination';
import {
  UpsertCompanyProfileDto,
  UpsertStoreSettingsDto,
  UpsertAppSettingsDto,
  UpsertThemeSettingsDto,
  CreateCurrencyDto,
  UpdateCurrencyDto,
  CreateLanguageDto,
  UpdateLanguageDto,
  CreateTaxConfigDto,
  UpdateTaxConfigDto,
  UpsertEmailConfigDto,
  UpsertSmsConfigDto,
  UpsertWhatsAppConfigDto,
  UpsertPushConfigDto,
  CreateNotificationTemplateDto,
  UpdateNotificationTemplateDto,
  NotificationTemplateQuery,
  CreateApiKeyDto,
  ApiKeyQuery,
  UpsertIntegrationDto,
  CreateFeatureFlagDto,
  UpdateFeatureFlagDto,
  FeatureFlagQuery,
  CreateSchedulerJobDto,
  UpdateSchedulerJobDto,
  SchedulerJobQuery,
  AuditLogQuery,
  ActivityLogQuery,
  ErrorLogQuery,
  CreateBackupDto,
  BackupQuery,
  UpsertFileStorageDto,
  UpsertSecuritySettingsDto,
  UpsertLicenseDto,
  CreateSystemVersionDto,
  CreateEnvConfigDto,
  UpdateEnvConfigDto,
  EnvConfigQuery,
} from '../interfaces/sysadmin.dto';

const db = prisma as any;

function paged(q: { page?: number; pageSize?: number }) {
  const page = q.page && q.page > 0 ? q.page : 1;
  const pageSize = q.pageSize && q.pageSize > 0 ? q.pageSize : 20;
  return { page, pageSize, skip: (page - 1) * pageSize };
}

function dateRange(startDate?: string, endDate?: string) {
  const range: { gte?: Date; lte?: Date } = {};
  if (startDate) range.gte = new Date(startDate);
  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    range.lte = end;
  }
  return Object.keys(range).length ? range : undefined;
}

// ─────────────────────────────────────────────────────────────────────────────
// Company Profile (singleton)
// ─────────────────────────────────────────────────────────────────────────────

export default class SysAdminRepository {

  async getCompanyProfile() {
    return db.companyProfile.findFirst({ orderBy: { id: 'asc' } });
  }

  async upsertCompanyProfile(dto: UpsertCompanyProfileDto, userId?: number) {
    const existing = await db.companyProfile.findFirst();
    if (existing) {
      return db.companyProfile.update({ where: { id: existing.id }, data: { ...dto } });
    }
    return db.companyProfile.create({ data: { ...dto } });
  }

  // ─── Store Settings (singleton) ───────────────────────────────────────────

  async getStoreSettings() {
    return db.storeSettings.findFirst({ orderBy: { id: 'asc' } });
  }

  async upsertStoreSettings(dto: UpsertStoreSettingsDto) {
    const existing = await db.storeSettings.findFirst();
    if (existing) {
      return db.storeSettings.update({ where: { id: existing.id }, data: { ...dto } });
    }
    return db.storeSettings.create({ data: { ...dto } });
  }

  // ─── App Settings (singleton) ─────────────────────────────────────────────

  async getAppSettings() {
    return db.appSettings.findFirst({ orderBy: { id: 'asc' } });
  }

  async upsertAppSettings(dto: UpsertAppSettingsDto) {
    const existing = await db.appSettings.findFirst();
    if (existing) {
      return db.appSettings.update({ where: { id: existing.id }, data: { ...dto } });
    }
    return db.appSettings.create({ data: { ...dto } });
  }

  // ─── Theme Settings (singleton) ───────────────────────────────────────────

  async getThemeSettings() {
    return db.themeSettings.findFirst({ orderBy: { id: 'asc' } });
  }

  async upsertThemeSettings(dto: UpsertThemeSettingsDto) {
    const existing = await db.themeSettings.findFirst();
    if (existing) {
      return db.themeSettings.update({ where: { id: existing.id }, data: { ...dto } });
    }
    return db.themeSettings.create({ data: { ...dto } });
  }

  // ─── Currency ─────────────────────────────────────────────────────────────

  async listCurrencies(isActive?: boolean) {
    const where = isActive !== undefined ? { isActive } : {};
    return db.sysCurrency.findMany({ where, orderBy: [{ isDefault: 'desc' }, { code: 'asc' }] });
  }

  async getCurrencyById(id: number) {
    return db.sysCurrency.findUnique({ where: { id } });
  }

  async getCurrencyByCode(code: string) {
    return db.sysCurrency.findUnique({ where: { code: code.toUpperCase() } });
  }

  async createCurrency(dto: CreateCurrencyDto) {
    return db.sysCurrency.create({ data: { ...dto, code: dto.code.toUpperCase() } });
  }

  async updateCurrency(id: number, dto: UpdateCurrencyDto) {
    return db.sysCurrency.update({ where: { id }, data: dto });
  }

  async deleteCurrency(id: number) {
    return db.sysCurrency.delete({ where: { id } });
  }

  async setDefaultCurrency(id: number) {
    await db.sysCurrency.updateMany({ data: { isDefault: false } });
    return db.sysCurrency.update({ where: { id }, data: { isDefault: true } });
  }

  // ─── Language ─────────────────────────────────────────────────────────────

  async listLanguages(isActive?: boolean) {
    const where = isActive !== undefined ? { isActive } : {};
    return db.sysLanguage.findMany({ where, orderBy: [{ isDefault: 'desc' }, { name: 'asc' }] });
  }

  async getLanguageById(id: number) {
    return db.sysLanguage.findUnique({ where: { id } });
  }

  async getLanguageByCode(code: string) {
    return db.sysLanguage.findUnique({ where: { code: code.toLowerCase() } });
  }

  async createLanguage(dto: CreateLanguageDto) {
    return db.sysLanguage.create({ data: { ...dto, code: dto.code.toLowerCase() } });
  }

  async updateLanguage(id: number, dto: UpdateLanguageDto) {
    return db.sysLanguage.update({ where: { id }, data: dto });
  }

  async deleteLanguage(id: number) {
    return db.sysLanguage.delete({ where: { id } });
  }

  async setDefaultLanguage(id: number) {
    await db.sysLanguage.updateMany({ data: { isDefault: false } });
    return db.sysLanguage.update({ where: { id }, data: { isDefault: true } });
  }

  // ─── Tax Configuration ────────────────────────────────────────────────────

  async listTaxConfigs(isActive?: boolean) {
    const where = isActive !== undefined ? { isActive } : {};
    return db.taxConfiguration.findMany({ where, orderBy: [{ isDefault: 'desc' }, { name: 'asc' }] });
  }

  async getTaxConfigById(id: number) {
    return db.taxConfiguration.findUnique({ where: { id } });
  }

  async createTaxConfig(dto: CreateTaxConfigDto) {
    return db.taxConfiguration.create({ data: dto });
  }

  async updateTaxConfig(id: number, dto: UpdateTaxConfigDto) {
    return db.taxConfiguration.update({ where: { id }, data: dto });
  }

  async deleteTaxConfig(id: number) {
    return db.taxConfiguration.delete({ where: { id } });
  }

  async setDefaultTaxConfig(id: number) {
    await db.taxConfiguration.updateMany({ data: { isDefault: false } });
    return db.taxConfiguration.update({ where: { id }, data: { isDefault: true } });
  }

  // ─── Email Configuration (singleton, stored encrypted) ────────────────────

  async getEmailConfig() {
    return db.emailConfiguration.findFirst({ orderBy: { id: 'asc' } });
  }

  async upsertEmailConfig(data: Record<string, unknown>) {
    const existing = await db.emailConfiguration.findFirst();
    if (existing) {
      return db.emailConfiguration.update({ where: { id: existing.id }, data });
    }
    return db.emailConfiguration.create({ data });
  }

  async markEmailConfigTested(id: number) {
    return db.emailConfiguration.update({ where: { id }, data: { lastTestedAt: new Date() } });
  }

  // ─── SMS Configuration (singleton, stored encrypted) ─────────────────────

  async getSmsConfig() {
    return db.smsConfiguration.findFirst({ orderBy: { id: 'asc' } });
  }

  async upsertSmsConfig(data: Record<string, unknown>) {
    const existing = await db.smsConfiguration.findFirst();
    if (existing) {
      return db.smsConfiguration.update({ where: { id: existing.id }, data });
    }
    return db.smsConfiguration.create({ data });
  }

  // ─── WhatsApp Configuration (singleton) ──────────────────────────────────

  async getWhatsAppConfig() {
    return db.whatsAppConfiguration.findFirst({ orderBy: { id: 'asc' } });
  }

  async upsertWhatsAppConfig(data: Record<string, unknown>) {
    const existing = await db.whatsAppConfiguration.findFirst();
    if (existing) {
      return db.whatsAppConfiguration.update({ where: { id: existing.id }, data });
    }
    return db.whatsAppConfiguration.create({ data });
  }

  // ─── Push Notification Configuration (singleton) ─────────────────────────

  async getPushConfig() {
    return db.pushNotificationConfig.findFirst({ orderBy: { id: 'asc' } });
  }

  async upsertPushConfig(data: Record<string, unknown>) {
    const existing = await db.pushNotificationConfig.findFirst();
    if (existing) {
      return db.pushNotificationConfig.update({ where: { id: existing.id }, data });
    }
    return db.pushNotificationConfig.create({ data });
  }

  // ─── Notification Templates ───────────────────────────────────────────────

  async listNotificationTemplates(q: NotificationTemplateQuery) {
    const { page, pageSize, skip } = paged(q);
    const where: Record<string, unknown> = {};
    if (q.channel) where['channel'] = q.channel;
    if (q.event)   where['event']   = { contains: q.event };
    if (q.isActive !== undefined) where['isActive'] = q.isActive === 'true';

    const [items, total] = await Promise.all([
      db.notificationTemplate.findMany({ where, skip, take: pageSize, orderBy: { templateName: 'asc' } }),
      db.notificationTemplate.count({ where }),
    ]);
    return { items, ...buildPagination(page, pageSize, total) };
  }

  async getNotificationTemplateById(id: number) {
    return db.notificationTemplate.findUnique({ where: { id } });
  }

  async getNotificationTemplateByCode(code: string) {
    return db.notificationTemplate.findUnique({ where: { templateCode: code } });
  }

  async createNotificationTemplate(dto: CreateNotificationTemplateDto, userId?: number) {
    return db.notificationTemplate.create({ data: { ...dto, createdBy: userId, updatedBy: userId } });
  }

  async updateNotificationTemplate(id: number, dto: UpdateNotificationTemplateDto, userId?: number) {
    return db.notificationTemplate.update({ where: { id }, data: { ...dto, updatedBy: userId } });
  }

  async deleteNotificationTemplate(id: number) {
    return db.notificationTemplate.delete({ where: { id } });
  }

  // ─── API Keys ─────────────────────────────────────────────────────────────

  async listApiKeys(q: ApiKeyQuery) {
    const { page, pageSize, skip } = paged(q);
    const where: Record<string, unknown> = {};
    if (q.status) where['status'] = q.status;

    const [items, total] = await Promise.all([
      db.apiKey.findMany({ where, skip, take: pageSize, orderBy: { createdAt: 'desc' } }),
      db.apiKey.count({ where }),
    ]);
    return { items, ...buildPagination(page, pageSize, total) };
  }

  async getApiKeyById(id: number) {
    return db.apiKey.findUnique({ where: { id } });
  }

  async getApiKeyByHash(hash: string) {
    return db.apiKey.findUnique({ where: { keyHash: hash } });
  }

  async createApiKey(data: Record<string, unknown>) {
    return db.apiKey.create({ data });
  }

  async updateApiKeyStatus(id: number, status: string) {
    return db.apiKey.update({ where: { id }, data: { status } });
  }

  async updateApiKeyHash(id: number, data: Record<string, unknown>) {
    return db.apiKey.update({ where: { id }, data });
  }

  async touchApiKey(id: number) {
    return db.apiKey.update({ where: { id }, data: { lastUsedAt: new Date() } });
  }

  async deleteApiKey(id: number) {
    return db.apiKey.delete({ where: { id } });
  }

  // ─── Third Party Integrations ─────────────────────────────────────────────

  async listIntegrations() {
    return db.thirdPartyIntegration.findMany({ orderBy: { provider: 'asc' } });
  }

  async getIntegrationByProvider(provider: string) {
    return db.thirdPartyIntegration.findUnique({ where: { provider } });
  }

  async upsertIntegration(provider: string, data: Record<string, unknown>, userId?: number) {
    return db.thirdPartyIntegration.upsert({
      where: { provider },
      create: { provider, ...data, createdBy: userId, updatedBy: userId },
      update: { ...data, updatedBy: userId },
    });
  }

  async markIntegrationTested(provider: string) {
    return db.thirdPartyIntegration.update({ where: { provider }, data: { lastTestedAt: new Date() } });
  }

  // ─── Feature Flags ────────────────────────────────────────────────────────

  async listFeatureFlags(q: FeatureFlagQuery) {
    const { page, pageSize, skip } = paged(q);
    const where: Record<string, unknown> = {};
    if (q.environment) where['environment'] = q.environment;
    if (q.isEnabled !== undefined) where['isEnabled'] = q.isEnabled === 'true';

    const [items, total] = await Promise.all([
      db.featureFlag.findMany({ where, skip, take: pageSize, orderBy: { flagKey: 'asc' } }),
      db.featureFlag.count({ where }),
    ]);
    return { items, ...buildPagination(page, pageSize, total) };
  }

  async getFeatureFlagById(id: number) {
    return db.featureFlag.findUnique({ where: { id } });
  }

  async getFeatureFlagByKey(key: string) {
    return db.featureFlag.findUnique({ where: { flagKey: key } });
  }

  async createFeatureFlag(dto: CreateFeatureFlagDto, userId?: number) {
    return db.featureFlag.create({ data: { ...dto, createdBy: userId, updatedBy: userId } });
  }

  async updateFeatureFlag(id: number, dto: UpdateFeatureFlagDto, userId?: number) {
    return db.featureFlag.update({ where: { id }, data: { ...dto, updatedBy: userId } });
  }

  async toggleFeatureFlag(id: number, userId?: number) {
    const flag = await db.featureFlag.findUnique({ where: { id } });
    if (!flag) return null;
    return db.featureFlag.update({ where: { id }, data: { isEnabled: !flag.isEnabled, updatedBy: userId } });
  }

  async deleteFeatureFlag(id: number) {
    return db.featureFlag.delete({ where: { id } });
  }

  // ─── Scheduler Jobs ───────────────────────────────────────────────────────

  async listSchedulerJobs(q: SchedulerJobQuery) {
    const { page, pageSize, skip } = paged(q);
    const where: Record<string, unknown> = {};
    if (q.status) where['status'] = q.status;

    const [items, total] = await Promise.all([
      db.schedulerJob.findMany({ where, skip, take: pageSize, orderBy: { jobKey: 'asc' } }),
      db.schedulerJob.count({ where }),
    ]);
    return { items, ...buildPagination(page, pageSize, total) };
  }

  async getSchedulerJobById(id: number) {
    return db.schedulerJob.findUnique({ where: { id } });
  }

  async getSchedulerJobByKey(key: string) {
    return db.schedulerJob.findUnique({ where: { jobKey: key } });
  }

  async createSchedulerJob(dto: CreateSchedulerJobDto, userId?: number) {
    return db.schedulerJob.create({ data: { ...dto, createdBy: userId, updatedBy: userId } });
  }

  async updateSchedulerJob(id: number, dto: UpdateSchedulerJobDto, userId?: number) {
    return db.schedulerJob.update({ where: { id }, data: { ...dto, updatedBy: userId } });
  }

  async recordJobRun(id: number, status: string, error?: string) {
    return db.schedulerJob.update({
      where: { id },
      data: {
        lastRunAt: new Date(),
        lastRunStatus: status,
        lastRunError: error ?? null,
        runCount: { increment: 1 },
      },
    });
  }

  async deleteSchedulerJob(id: number) {
    return db.schedulerJob.delete({ where: { id } });
  }

  // ─── Audit Logs ───────────────────────────────────────────────────────────

  async listAuditLogs(q: AuditLogQuery) {
    const { page, pageSize, skip } = paged(q);
    const where: Record<string, unknown> = {};
    if (q.userId)     where['userId']     = q.userId;
    if (q.module)     where['module']     = { contains: q.module };
    if (q.action)     where['action']     = { contains: q.action };
    if (q.entityType) where['entityType'] = q.entityType;
    const dr = dateRange(q.startDate, q.endDate);
    if (dr) where['createdAt'] = dr;

    const [items, total] = await Promise.all([
      db.auditLog.findMany({ where, skip, take: pageSize, orderBy: { createdAt: 'desc' } }),
      db.auditLog.count({ where }),
    ]);
    return { items, ...buildPagination(page, pageSize, total) };
  }

  async getAuditLogById(id: number) {
    return db.auditLog.findUnique({ where: { id } });
  }

  async createAuditLog(data: {
    userId?: number;
    userEmail?: string;
    action: string;
    module: string;
    entityType?: string;
    entityId?: number;
    oldValue?: unknown;
    newValue?: unknown;
    ipAddress?: string;
    userAgent?: string;
    device?: string;
  }) {
    return db.auditLog.create({ data });
  }

  // ─── Activity Logs ────────────────────────────────────────────────────────

  async listActivityLogs(q: ActivityLogQuery) {
    const { page, pageSize, skip } = paged(q);
    const where: Record<string, unknown> = {};
    if (q.userId)       where['userId']       = q.userId;
    if (q.activityType) where['activityType'] = q.activityType;
    if (q.status)       where['status']       = q.status;
    const dr = dateRange(q.startDate, q.endDate);
    if (dr) where['createdAt'] = dr;

    const [items, total] = await Promise.all([
      db.activityLog.findMany({ where, skip, take: pageSize, orderBy: { createdAt: 'desc' } }),
      db.activityLog.count({ where }),
    ]);
    return { items, ...buildPagination(page, pageSize, total) };
  }

  async createActivityLog(data: {
    userId?: number;
    userEmail?: string;
    activityType: string;
    description?: string;
    ipAddress?: string;
    userAgent?: string;
    device?: string;
    status?: string;
  }) {
    return db.activityLog.create({ data });
  }

  // ─── Error Logs ───────────────────────────────────────────────────────────

  async listErrorLogs(q: ErrorLogQuery) {
    const { page, pageSize, skip } = paged(q);
    const where: Record<string, unknown> = {};
    if (q.errorType) where['errorType'] = q.errorType;
    if (q.module)    where['module']    = { contains: q.module };
    const dr = dateRange(q.startDate, q.endDate);
    if (dr) where['createdAt'] = dr;

    const [items, total] = await Promise.all([
      db.errorLog.findMany({ where, skip, take: pageSize, orderBy: { createdAt: 'desc' } }),
      db.errorLog.count({ where }),
    ]);
    return { items, ...buildPagination(page, pageSize, total) };
  }

  async getErrorLogById(id: number) {
    return db.errorLog.findUnique({ where: { id } });
  }

  async createErrorLog(data: {
    errorCode?: string;
    message: string;
    stack?: string;
    errorType?: string;
    module?: string;
    requestUrl?: string;
    requestMethod?: string;
    userId?: number;
    ipAddress?: string;
    environment?: string;
  }) {
    return db.errorLog.create({ data });
  }

  // ─── Security Settings (singleton) ───────────────────────────────────────

  async getSecuritySettings() {
    return db.securitySettings.findFirst({ orderBy: { id: 'asc' } });
  }

  async upsertSecuritySettings(dto: UpsertSecuritySettingsDto) {
    const existing = await db.securitySettings.findFirst();
    if (existing) {
      return db.securitySettings.update({ where: { id: existing.id }, data: dto });
    }
    return db.securitySettings.create({ data: dto });
  }

  // ─── Backup Records ───────────────────────────────────────────────────────

  async listBackups(q: BackupQuery) {
    const { page, pageSize, skip } = paged(q);
    const where: Record<string, unknown> = {};
    if (q.backupType) where['backupType'] = q.backupType;
    if (q.status)     where['status']     = q.status;

    const [items, total] = await Promise.all([
      db.backupRecord.findMany({ where, skip, take: pageSize, orderBy: { createdAt: 'desc' } }),
      db.backupRecord.count({ where }),
    ]);
    return { items, ...buildPagination(page, pageSize, total) };
  }

  async getBackupById(id: number) {
    return db.backupRecord.findUnique({ where: { id } });
  }

  async createBackup(data: Record<string, unknown>) {
    return db.backupRecord.create({ data });
  }

  async updateBackup(id: number, data: Record<string, unknown>) {
    return db.backupRecord.update({ where: { id }, data });
  }

  // ─── File Storage Config (singleton) ─────────────────────────────────────

  async getFileStorageConfig() {
    return db.fileStorageConfig.findFirst({ orderBy: { id: 'asc' } });
  }

  async upsertFileStorageConfig(data: Record<string, unknown>) {
    const existing = await db.fileStorageConfig.findFirst();
    if (existing) {
      return db.fileStorageConfig.update({ where: { id: existing.id }, data });
    }
    return db.fileStorageConfig.create({ data });
  }

  // ─── License Info (singleton) ─────────────────────────────────────────────

  async getLicense() {
    return db.licenseInfo.findFirst({ orderBy: { id: 'asc' } });
  }

  async upsertLicense(data: Record<string, unknown>) {
    const existing = await db.licenseInfo.findFirst();
    if (existing) {
      return db.licenseInfo.update({ where: { id: existing.id }, data });
    }
    return db.licenseInfo.create({ data });
  }

  // ─── System Versions ─────────────────────────────────────────────────────

  async listSystemVersions() {
    return db.systemVersion.findMany({ orderBy: { releaseDate: 'desc' } });
  }

  async getLatestVersion() {
    return db.systemVersion.findFirst({ where: { isLatest: true }, orderBy: { createdAt: 'desc' } });
  }

  async createSystemVersion(dto: CreateSystemVersionDto) {
    if (dto.isLatest) {
      await db.systemVersion.updateMany({ data: { isLatest: false } });
    }
    return db.systemVersion.create({
      data: { ...dto, releaseDate: new Date(dto.releaseDate) },
    });
  }

  // ─── Environment Configs ──────────────────────────────────────────────────

  async listEnvConfigs(q: EnvConfigQuery) {
    const { page, pageSize, skip } = paged(q);
    const where: Record<string, unknown> = {};
    if (q.environment) where['environment'] = q.environment;
    if (q.isActive !== undefined) where['isActive'] = q.isActive === 'true';

    const [items, total] = await Promise.all([
      db.environmentConfig.findMany({ where, skip, take: pageSize, orderBy: { configKey: 'asc' } }),
      db.environmentConfig.count({ where }),
    ]);
    return { items, ...buildPagination(page, pageSize, total) };
  }

  async getEnvConfigById(id: number) {
    return db.environmentConfig.findUnique({ where: { id } });
  }

  async getEnvConfigByKey(key: string) {
    return db.environmentConfig.findUnique({ where: { configKey: key } });
  }

  async createEnvConfig(dto: CreateEnvConfigDto, userId?: number) {
    return db.environmentConfig.create({ data: { ...dto, createdBy: userId, updatedBy: userId } });
  }

  async updateEnvConfig(id: number, dto: UpdateEnvConfigDto, userId?: number) {
    return db.environmentConfig.update({ where: { id }, data: { ...dto, updatedBy: userId } });
  }

  async deleteEnvConfig(id: number) {
    return db.environmentConfig.delete({ where: { id } });
  }
}
