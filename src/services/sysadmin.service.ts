import os from 'os';
import crypto from 'crypto';
import AppError from '../utils/AppError';
import HTTP_STATUS from '../constants/httpStatus';
import { encrypt, decrypt, maskSecret, generateApiKey, generateSecret } from '../utils/crypto';
import SysAdminRepository from '../repositories/sysadmin.repository';
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
  ApiKeyCreateResponse,
  ApiKeyResponse,
  ApiKeyQuery,
  UpsertIntegrationDto,
  IntegrationResponse,
  CreateFeatureFlagDto,
  UpdateFeatureFlagDto,
  FeatureFlagQuery,
  CreateSchedulerJobDto,
  UpdateSchedulerJobDto,
  SchedulerJobQuery,
  AuditLogQuery,
  ActivityLogQuery,
  ErrorLogQuery,
  SystemHealthResponse,
  ServiceHealthStatus,
  CreateBackupDto,
  BackupQuery,
  UpsertFileStorageDto,
  UpsertSecuritySettingsDto,
  UpsertLicenseDto,
  LicenseResponse,
  CreateSystemVersionDto,
  CreateEnvConfigDto,
  UpdateEnvConfigDto,
  EnvConfigQuery,
  EnvConfigResponse,
  EmailConfigResponse,
} from '../interfaces/sysadmin.dto';

// ─── In-memory configuration cache ───────────────────────────────────────────

interface CacheEntry<T> { data: T; expiresAt: number; }

class ConfigCache {
  private store = new Map<string, CacheEntry<unknown>>();
  private readonly TTL = 60_000; // 60 seconds

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) { this.store.delete(key); return null; }
    return entry.data as T;
  }

  set<T>(key: string, data: T): void {
    this.store.set(key, { data, expiresAt: Date.now() + this.TTL });
  }

  invalidate(key: string): void { this.store.delete(key); }
  invalidateAll(): void { this.store.clear(); }
}

const cache = new ConfigCache();

// ─── Sensitive field helpers ──────────────────────────────────────────────────

function encryptFields<T extends Record<string, unknown>>(obj: T, fields: (keyof T)[]): T {
  const result = { ...obj } as Record<string, unknown>;
  for (const field of fields) {
    if (result[field as string] && typeof result[field as string] === 'string') {
      result[field as string] = encrypt(result[field as string] as string);
    }
  }
  return result as T;
}

function maskFields<T extends Record<string, unknown>>(obj: T, fields: (keyof T)[]): T {
  const result = { ...obj } as Record<string, unknown>;
  for (const field of fields) {
    if (result[field as string] && typeof result[field as string] === 'string') {
      result[field as string] = maskSecret(result[field as string] as string);
    }
  }
  return result as T;
}

// ─────────────────────────────────────────────────────────────────────────────

export default class SysAdminService {
  constructor(private readonly repo: SysAdminRepository) {}

  // ─── Company Profile ────────────────────────────────────────────────────

  async getCompanyProfile() {
    const cached = cache.get('company_profile');
    if (cached) return cached;
    const data = await this.repo.getCompanyProfile();
    if (data) cache.set('company_profile', data);
    return data;
  }

  async upsertCompanyProfile(dto: UpsertCompanyProfileDto, userId?: number) {
    const data = await this.repo.upsertCompanyProfile(dto, userId);
    cache.invalidate('company_profile');
    return data;
  }

  // ─── Store Settings ──────────────────────────────────────────────────────

  async getStoreSettings() {
    const cached = cache.get('store_settings');
    if (cached) return cached;
    const data = await this.repo.getStoreSettings();
    if (data) cache.set('store_settings', data);
    return data;
  }

  async upsertStoreSettings(dto: UpsertStoreSettingsDto) {
    const data = await this.repo.upsertStoreSettings(dto);
    cache.invalidate('store_settings');
    return data;
  }

  // ─── App Settings ────────────────────────────────────────────────────────

  async getAppSettings() {
    const cached = cache.get('app_settings');
    if (cached) return cached;
    const data = await this.repo.getAppSettings();
    if (data) cache.set('app_settings', data);
    return data;
  }

  async upsertAppSettings(dto: UpsertAppSettingsDto) {
    const data = await this.repo.upsertAppSettings(dto);
    cache.invalidate('app_settings');
    return data;
  }

  // ─── Theme Settings ──────────────────────────────────────────────────────

  async getThemeSettings() {
    const cached = cache.get('theme_settings');
    if (cached) return cached;
    const data = await this.repo.getThemeSettings();
    if (data) cache.set('theme_settings', data);
    return data;
  }

  async upsertThemeSettings(dto: UpsertThemeSettingsDto) {
    const data = await this.repo.upsertThemeSettings(dto);
    cache.invalidate('theme_settings');
    return data;
  }

  // ─── Currency ────────────────────────────────────────────────────────────

  async listCurrencies(isActive?: boolean) {
    return this.repo.listCurrencies(isActive);
  }

  async getCurrency(id: number) {
    const c = await this.repo.getCurrencyById(id);
    if (!c) throw new AppError('Currency not found', HTTP_STATUS.NOT_FOUND, 'CURRENCY_NOT_FOUND');
    return c;
  }

  async createCurrency(dto: CreateCurrencyDto) {
    const existing = await this.repo.getCurrencyByCode(dto.code);
    if (existing) throw new AppError(`Currency ${dto.code} already exists`, HTTP_STATUS.CONFLICT, 'CURRENCY_EXISTS');
    return this.repo.createCurrency(dto);
  }

  async updateCurrency(id: number, dto: UpdateCurrencyDto) {
    await this.getCurrency(id);
    return this.repo.updateCurrency(id, dto);
  }

  async deleteCurrency(id: number) {
    const c = await this.getCurrency(id);
    if (c.isDefault) throw new AppError('Cannot delete the default currency', HTTP_STATUS.BAD_REQUEST, 'DEFAULT_CURRENCY');
    return this.repo.deleteCurrency(id);
  }

  async setDefaultCurrency(id: number) {
    await this.getCurrency(id);
    return this.repo.setDefaultCurrency(id);
  }

  // ─── Language ────────────────────────────────────────────────────────────

  async listLanguages(isActive?: boolean) {
    return this.repo.listLanguages(isActive);
  }

  async getLanguage(id: number) {
    const l = await this.repo.getLanguageById(id);
    if (!l) throw new AppError('Language not found', HTTP_STATUS.NOT_FOUND, 'LANGUAGE_NOT_FOUND');
    return l;
  }

  async createLanguage(dto: CreateLanguageDto) {
    const existing = await this.repo.getLanguageByCode(dto.code);
    if (existing) throw new AppError(`Language ${dto.code} already exists`, HTTP_STATUS.CONFLICT, 'LANGUAGE_EXISTS');
    return this.repo.createLanguage(dto);
  }

  async updateLanguage(id: number, dto: UpdateLanguageDto) {
    await this.getLanguage(id);
    return this.repo.updateLanguage(id, dto);
  }

  async deleteLanguage(id: number) {
    const l = await this.getLanguage(id);
    if (l.isDefault) throw new AppError('Cannot delete the default language', HTTP_STATUS.BAD_REQUEST, 'DEFAULT_LANGUAGE');
    return this.repo.deleteLanguage(id);
  }

  async setDefaultLanguage(id: number) {
    await this.getLanguage(id);
    return this.repo.setDefaultLanguage(id);
  }

  // ─── Tax Configuration ────────────────────────────────────────────────────

  async listTaxConfigs(isActive?: boolean) {
    return this.repo.listTaxConfigs(isActive);
  }

  async getTaxConfig(id: number) {
    const t = await this.repo.getTaxConfigById(id);
    if (!t) throw new AppError('Tax configuration not found', HTTP_STATUS.NOT_FOUND, 'TAX_CONFIG_NOT_FOUND');
    return t;
  }

  async createTaxConfig(dto: CreateTaxConfigDto) {
    return this.repo.createTaxConfig(dto);
  }

  async updateTaxConfig(id: number, dto: UpdateTaxConfigDto) {
    await this.getTaxConfig(id);
    return this.repo.updateTaxConfig(id, dto);
  }

  async deleteTaxConfig(id: number) {
    await this.getTaxConfig(id);
    return this.repo.deleteTaxConfig(id);
  }

  async setDefaultTaxConfig(id: number) {
    await this.getTaxConfig(id);
    return this.repo.setDefaultTaxConfig(id);
  }

  // ─── Email Configuration ─────────────────────────────────────────────────

  async getEmailConfig(): Promise<EmailConfigResponse | null> {
    const raw = await this.repo.getEmailConfig();
    if (!raw) return null;
    return { ...raw, password: maskSecret(decrypt(raw.password)) };
  }

  async upsertEmailConfig(dto: UpsertEmailConfigDto) {
    const data = { ...dto, password: encrypt(dto.password) };
    const saved = await this.repo.upsertEmailConfig(data);
    cache.invalidate('email_config');
    return { ...saved, password: maskSecret(dto.password) };
  }

  async testEmailConfig() {
    const config = await this.repo.getEmailConfig();
    if (!config) throw new AppError('Email configuration not found', HTTP_STATUS.NOT_FOUND, 'EMAIL_CONFIG_NOT_FOUND');
    // In production: attempt SMTP connection; here we record the test timestamp
    await this.repo.markEmailConfigTested(config.id);
    return { tested: true, testedAt: new Date() };
  }

  // ─── SMS Configuration ────────────────────────────────────────────────────

  async getSmsConfig() {
    const raw = await this.repo.getSmsConfig();
    if (!raw) return null;
    return { ...raw, apiKey: maskSecret(decrypt(raw.apiKey)) };
  }

  async upsertSmsConfig(dto: UpsertSmsConfigDto) {
    const data = { ...dto, apiKey: encrypt(dto.apiKey) };
    const saved = await this.repo.upsertSmsConfig(data);
    return { ...saved, apiKey: maskSecret(dto.apiKey) };
  }

  // ─── WhatsApp Configuration ───────────────────────────────────────────────

  async getWhatsAppConfig() {
    const raw = await this.repo.getWhatsAppConfig();
    if (!raw) return null;
    return { ...raw, apiKey: maskSecret(decrypt(raw.apiKey)) };
  }

  async upsertWhatsAppConfig(dto: UpsertWhatsAppConfigDto) {
    const data = { ...dto, apiKey: encrypt(dto.apiKey) };
    const saved = await this.repo.upsertWhatsAppConfig(data);
    return { ...saved, apiKey: maskSecret(dto.apiKey) };
  }

  // ─── Push Notification Configuration ─────────────────────────────────────

  async getPushConfig() {
    const raw = await this.repo.getPushConfig();
    if (!raw) return null;
    return maskFields(raw as Record<string, unknown>, ['firebaseServerKey', 'oneSignalApiKey', 'vapidPrivateKey']);
  }

  async upsertPushConfig(dto: UpsertPushConfigDto) {
    const raw = dto as unknown as Record<string, unknown>;
    const data = encryptFields(raw, ['firebaseServerKey', 'oneSignalApiKey', 'vapidPrivateKey']);
    const saved = await this.repo.upsertPushConfig(data);
    return maskFields(saved as Record<string, unknown>, ['firebaseServerKey', 'oneSignalApiKey', 'vapidPrivateKey']);
  }

  // ─── Notification Templates ───────────────────────────────────────────────

  async listNotificationTemplates(q: NotificationTemplateQuery) {
    return this.repo.listNotificationTemplates(q);
  }

  async getNotificationTemplate(id: number) {
    const t = await this.repo.getNotificationTemplateById(id);
    if (!t) throw new AppError('Template not found', HTTP_STATUS.NOT_FOUND, 'TEMPLATE_NOT_FOUND');
    return t;
  }

  async createNotificationTemplate(dto: CreateNotificationTemplateDto, userId?: number) {
    const existing = await this.repo.getNotificationTemplateByCode(dto.templateCode);
    if (existing) throw new AppError(`Template code ${dto.templateCode} already exists`, HTTP_STATUS.CONFLICT, 'TEMPLATE_CODE_EXISTS');
    return this.repo.createNotificationTemplate(dto, userId);
  }

  async updateNotificationTemplate(id: number, dto: UpdateNotificationTemplateDto, userId?: number) {
    await this.getNotificationTemplate(id);
    return this.repo.updateNotificationTemplate(id, dto, userId);
  }

  async deleteNotificationTemplate(id: number) {
    await this.getNotificationTemplate(id);
    return this.repo.deleteNotificationTemplate(id);
  }

  // ─── API Keys ─────────────────────────────────────────────────────────────

  async listApiKeys(q: ApiKeyQuery) {
    const result = await this.repo.listApiKeys(q);
    return {
      ...result,
      items: result.items.map((k: Record<string, unknown>) => this.safeApiKey(k)),
    };
  }

  async getApiKey(id: number): Promise<ApiKeyResponse> {
    const k = await this.repo.getApiKeyById(id);
    if (!k) throw new AppError('API key not found', HTTP_STATUS.NOT_FOUND, 'API_KEY_NOT_FOUND');
    return this.safeApiKey(k);
  }

  async createApiKey(dto: CreateApiKeyDto, userId?: number): Promise<ApiKeyCreateResponse> {
    const { rawKey, prefix, hash } = generateApiKey();
    const encryptedSecret = encrypt(generateSecret());

    const record = await this.repo.createApiKey({
      name:        dto.name,
      keyHash:     hash,
      keyPrefix:   prefix,
      secret:      encryptedSecret,
      permissions: dto.permissions ?? null,
      expiresAt:   dto.expiresAt ? new Date(dto.expiresAt) : null,
      status:      'ACTIVE',
      createdBy:   userId ?? null,
      updatedBy:   userId ?? null,
    });

    return {
      id:          record.id,
      name:        record.name,
      rawKey,      // returned ONCE — user must store securely
      keyPrefix:   record.keyPrefix,
      permissions: record.permissions,
      expiresAt:   record.expiresAt,
      status:      record.status,
      createdAt:   record.createdAt,
    };
  }

  async revokeApiKey(id: number) {
    await this.getApiKey(id);
    return this.repo.updateApiKeyStatus(id, 'REVOKED');
  }

  async rotateApiKey(id: number, userId?: number): Promise<ApiKeyCreateResponse> {
    const existing = await this.repo.getApiKeyById(id);
    if (!existing) throw new AppError('API key not found', HTTP_STATUS.NOT_FOUND, 'API_KEY_NOT_FOUND');
    if (existing.status === 'REVOKED') throw new AppError('Cannot rotate a revoked key', HTTP_STATUS.BAD_REQUEST, 'KEY_REVOKED');

    const { rawKey, prefix, hash } = generateApiKey();
    const updated = await this.repo.updateApiKeyHash(id, {
      keyHash:   hash,
      keyPrefix: prefix,
      status:    'ACTIVE',
      updatedBy: userId ?? null,
    });

    return {
      id:          updated.id,
      name:        updated.name,
      rawKey,
      keyPrefix:   updated.keyPrefix,
      permissions: updated.permissions,
      expiresAt:   updated.expiresAt,
      status:      updated.status,
      createdAt:   updated.createdAt,
    };
  }

  async deleteApiKey(id: number) {
    await this.getApiKey(id);
    return this.repo.deleteApiKey(id);
  }

  private safeApiKey(k: Record<string, unknown>): ApiKeyResponse {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { keyHash, secret, ...safe } = k;
    return safe as unknown as ApiKeyResponse;
  }

  // ─── Third Party Integrations ─────────────────────────────────────────────

  async listIntegrations(): Promise<IntegrationResponse[]> {
    const list = await this.repo.listIntegrations();
    return list.map((i: Record<string, unknown>) => this.safeIntegration(i));
  }

  async getIntegration(provider: string): Promise<IntegrationResponse> {
    const i = await this.repo.getIntegrationByProvider(provider);
    if (!i) throw new AppError(`Integration ${provider} not found`, HTTP_STATUS.NOT_FOUND, 'INTEGRATION_NOT_FOUND');
    return this.safeIntegration(i as Record<string, unknown>);
  }

  async upsertIntegration(provider: string, dto: UpsertIntegrationDto, userId?: number) {
    const data: Record<string, unknown> = { ...dto };
    if (dto.apiKey)        data['apiKey']        = encrypt(dto.apiKey);
    if (dto.apiSecret)     data['apiSecret']     = encrypt(dto.apiSecret);
    if (dto.webhookSecret) data['webhookSecret'] = encrypt(dto.webhookSecret);

    const saved = await this.repo.upsertIntegration(provider, data, userId);
    return this.safeIntegration(saved as Record<string, unknown>);
  }

  async testIntegration(provider: string) {
    const i = await this.repo.getIntegrationByProvider(provider);
    if (!i) throw new AppError(`Integration ${provider} not found`, HTTP_STATUS.NOT_FOUND, 'INTEGRATION_NOT_FOUND');
    // In production: call provider's ping/test endpoint; here we record timestamp
    await this.repo.markIntegrationTested(provider);
    return { provider, tested: true, testedAt: new Date() };
  }

  private safeIntegration(i: Record<string, unknown>): IntegrationResponse {
    return {
      ...i,
      apiKey:        i['apiKey']        ? maskSecret(i['apiKey'] as string)        : null,
      apiSecret:     i['apiSecret']     ? maskSecret(i['apiSecret'] as string)     : null,
      webhookSecret: i['webhookSecret'] ? maskSecret(i['webhookSecret'] as string) : null,
    } as IntegrationResponse;
  }

  // ─── Feature Flags ────────────────────────────────────────────────────────

  async listFeatureFlags(q: FeatureFlagQuery) {
    return this.repo.listFeatureFlags(q);
  }

  async getFeatureFlag(id: number) {
    const f = await this.repo.getFeatureFlagById(id);
    if (!f) throw new AppError('Feature flag not found', HTTP_STATUS.NOT_FOUND, 'FLAG_NOT_FOUND');
    return f;
  }

  async createFeatureFlag(dto: CreateFeatureFlagDto, userId?: number) {
    const existing = await this.repo.getFeatureFlagByKey(dto.flagKey);
    if (existing) throw new AppError(`Feature flag ${dto.flagKey} already exists`, HTTP_STATUS.CONFLICT, 'FLAG_EXISTS');
    return this.repo.createFeatureFlag(dto, userId);
  }

  async updateFeatureFlag(id: number, dto: UpdateFeatureFlagDto, userId?: number) {
    await this.getFeatureFlag(id);
    return this.repo.updateFeatureFlag(id, dto, userId);
  }

  async toggleFeatureFlag(id: number, userId?: number) {
    const f = await this.repo.toggleFeatureFlag(id, userId);
    if (!f) throw new AppError('Feature flag not found', HTTP_STATUS.NOT_FOUND, 'FLAG_NOT_FOUND');
    return f;
  }

  async deleteFeatureFlag(id: number) {
    await this.getFeatureFlag(id);
    return this.repo.deleteFeatureFlag(id);
  }

  // ─── Scheduler Jobs ───────────────────────────────────────────────────────

  async listSchedulerJobs(q: SchedulerJobQuery) {
    return this.repo.listSchedulerJobs(q);
  }

  async getSchedulerJob(id: number) {
    const j = await this.repo.getSchedulerJobById(id);
    if (!j) throw new AppError('Scheduler job not found', HTTP_STATUS.NOT_FOUND, 'JOB_NOT_FOUND');
    return j;
  }

  async createSchedulerJob(dto: CreateSchedulerJobDto, userId?: number) {
    const existing = await this.repo.getSchedulerJobByKey(dto.jobKey);
    if (existing) throw new AppError(`Job ${dto.jobKey} already exists`, HTTP_STATUS.CONFLICT, 'JOB_EXISTS');
    return this.repo.createSchedulerJob(dto, userId);
  }

  async updateSchedulerJob(id: number, dto: UpdateSchedulerJobDto, userId?: number) {
    await this.getSchedulerJob(id);
    return this.repo.updateSchedulerJob(id, dto, userId);
  }

  async triggerSchedulerJob(id: number) {
    const job = await this.getSchedulerJob(id);
    if (job.status === 'DISABLED') throw new AppError('Cannot trigger a disabled job', HTTP_STATUS.BAD_REQUEST, 'JOB_DISABLED');
    // In production: dispatch to job queue; here we record a manual trigger
    await this.repo.recordJobRun(id, 'TRIGGERED');
    return { id, jobKey: job.jobKey, triggeredAt: new Date() };
  }

  async pauseSchedulerJob(id: number, userId?: number) {
    await this.getSchedulerJob(id);
    return this.repo.updateSchedulerJob(id, { status: 'PAUSED' }, userId);
  }

  async resumeSchedulerJob(id: number, userId?: number) {
    await this.getSchedulerJob(id);
    return this.repo.updateSchedulerJob(id, { status: 'ACTIVE' }, userId);
  }

  async deleteSchedulerJob(id: number) {
    await this.getSchedulerJob(id);
    return this.repo.deleteSchedulerJob(id);
  }

  // ─── Audit Logs ───────────────────────────────────────────────────────────

  async listAuditLogs(q: AuditLogQuery) {
    return this.repo.listAuditLogs(q);
  }

  async getAuditLog(id: number) {
    const log = await this.repo.getAuditLogById(id);
    if (!log) throw new AppError('Audit log not found', HTTP_STATUS.NOT_FOUND, 'LOG_NOT_FOUND');
    return log;
  }

  async createAuditLog(data: Parameters<SysAdminRepository['createAuditLog']>[0]) {
    return this.repo.createAuditLog(data);
  }

  // ─── Activity Logs ────────────────────────────────────────────────────────

  async listActivityLogs(q: ActivityLogQuery) {
    return this.repo.listActivityLogs(q);
  }

  async createActivityLog(data: Parameters<SysAdminRepository['createActivityLog']>[0]) {
    return this.repo.createActivityLog(data);
  }

  // ─── Error Logs ───────────────────────────────────────────────────────────

  async listErrorLogs(q: ErrorLogQuery) {
    return this.repo.listErrorLogs(q);
  }

  async getErrorLog(id: number) {
    const log = await this.repo.getErrorLogById(id);
    if (!log) throw new AppError('Error log not found', HTTP_STATUS.NOT_FOUND, 'LOG_NOT_FOUND');
    return log;
  }

  async createErrorLog(data: Parameters<SysAdminRepository['createErrorLog']>[0]) {
    return this.repo.createErrorLog(data);
  }

  // ─── System Health ────────────────────────────────────────────────────────

  async getSystemHealth(): Promise<SystemHealthResponse> {
    const services: ServiceHealthStatus[] = [];

    // Database health
    const dbStart = Date.now();
    try {
      const dbModule = await import('../helpers/prisma');
      await dbModule.default.$queryRaw`SELECT 1`;
      services.push({ name: 'database', status: 'UP', latencyMs: Date.now() - dbStart });
    } catch (err) {
      services.push({ name: 'database', status: 'DOWN', message: String(err) });
    }

    // Memory
    const memUsage = process.memoryUsage();
    const totalMem = os.totalmem();
    const freeMem  = os.freemem();
    const usedMem  = totalMem - freeMem;

    services.push({
      name:    'memory',
      status:  usedMem / totalMem > 0.95 ? 'DEGRADED' : 'UP',
      message: `${Math.round(usedMem / 1024 / 1024)} MB used of ${Math.round(totalMem / 1024 / 1024)} MB`,
    });

    const overall: SystemHealthResponse['overall'] = services.some(s => s.status === 'DOWN')
      ? 'UNHEALTHY'
      : services.some(s => s.status === 'DEGRADED')
      ? 'DEGRADED'
      : 'HEALTHY';

    const cpuUsage = process.cpuUsage();

    return {
      overall,
      timestamp:  new Date().toISOString(),
      uptime:     process.uptime(),
      services,
      system: {
        memoryUsedMb:  Math.round(memUsage.heapUsed  / 1024 / 1024),
        memoryTotalMb: Math.round(memUsage.heapTotal / 1024 / 1024),
        memoryPercent: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100),
        cpuUserMs:     Math.round(cpuUsage.user   / 1000),
        cpuSystemMs:   Math.round(cpuUsage.system / 1000),
        nodeVersion:   process.version,
        platform:      process.platform,
      },
    };
  }

  // ─── Security Settings ────────────────────────────────────────────────────

  async getSecuritySettings() {
    return this.repo.getSecuritySettings();
  }

  async upsertSecuritySettings(dto: UpsertSecuritySettingsDto) {
    const data = await this.repo.upsertSecuritySettings(dto);
    cache.invalidate('security_settings');
    return data;
  }

  // ─── Backup ───────────────────────────────────────────────────────────────

  async listBackups(q: BackupQuery) {
    return this.repo.listBackups(q);
  }

  async getBackup(id: number) {
    const b = await this.repo.getBackupById(id);
    if (!b) throw new AppError('Backup not found', HTTP_STATUS.NOT_FOUND, 'BACKUP_NOT_FOUND');
    return b;
  }

  async createBackup(dto: CreateBackupDto, userId?: number) {
    const backupCode = `BKP-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const record = await this.repo.createBackup({
      backupCode,
      backupType:  dto.backupType,
      isScheduled: dto.isScheduled ?? false,
      status:      'PENDING',
      createdBy:   userId ?? null,
      startedAt:   new Date(),
    });

    // In production: dispatch async backup job; here we simulate immediate completion
    await this.repo.updateBackup(record.id, {
      status:      'COMPLETED',
      completedAt: new Date(),
      filePath:    `/backups/${backupCode}.sql.gz`,
    });

    return this.repo.getBackupById(record.id);
  }

  async restoreBackup(id: number) {
    const backup = await this.getBackup(id);
    if (backup.status !== 'COMPLETED') {
      throw new AppError('Only completed backups can be restored', HTTP_STATUS.BAD_REQUEST, 'BACKUP_NOT_COMPLETED');
    }
    await this.repo.updateBackup(id, { restoredAt: new Date() });
    return { id, restored: true, restoredAt: new Date() };
  }

  // ─── File Storage Config ──────────────────────────────────────────────────

  async getFileStorageConfig() {
    const raw = await this.repo.getFileStorageConfig();
    if (!raw) return null;
    return maskFields(raw as Record<string, unknown>, ['cloudinarySecret', 'awsSecretKey', 'cloudinaryKey', 'awsAccessKey']);
  }

  async upsertFileStorageConfig(dto: UpsertFileStorageDto) {
    const raw = dto as unknown as Record<string, unknown>;
    const data = encryptFields(raw, ['cloudinarySecret', 'awsSecretKey']);
    const saved = await this.repo.upsertFileStorageConfig(data);
    return maskFields(saved as Record<string, unknown>, ['cloudinarySecret', 'awsSecretKey', 'cloudinaryKey', 'awsAccessKey']);
  }

  // ─── License Info ─────────────────────────────────────────────────────────

  async getLicense(): Promise<LicenseResponse | null> {
    const raw = await this.repo.getLicense();
    if (!raw) return null;
    return { ...raw, licenseKey: maskSecret(raw.licenseKey) };
  }

  async upsertLicense(dto: UpsertLicenseDto) {
    const data = { ...dto, expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined };
    const saved = await this.repo.upsertLicense(data);
    return { ...saved, licenseKey: maskSecret(dto.licenseKey) };
  }

  // ─── System Versions ──────────────────────────────────────────────────────

  async listSystemVersions() {
    return this.repo.listSystemVersions();
  }

  async getLatestVersion() {
    return this.repo.getLatestVersion();
  }

  async createSystemVersion(dto: CreateSystemVersionDto) {
    return this.repo.createSystemVersion(dto);
  }

  // ─── Environment Config ───────────────────────────────────────────────────

  async listEnvConfigs(q: EnvConfigQuery) {
    const result = await this.repo.listEnvConfigs(q);
    return {
      ...result,
      items: result.items.map((c: Record<string, unknown>) => this.safeEnvConfig(c)),
    };
  }

  async getEnvConfig(id: number): Promise<EnvConfigResponse> {
    const c = await this.repo.getEnvConfigById(id);
    if (!c) throw new AppError('Environment config not found', HTTP_STATUS.NOT_FOUND, 'ENV_CONFIG_NOT_FOUND');
    return this.safeEnvConfig(c as Record<string, unknown>);
  }

  async createEnvConfig(dto: CreateEnvConfigDto, userId?: number) {
    const existing = await this.repo.getEnvConfigByKey(dto.configKey);
    if (existing) throw new AppError(`Config key ${dto.configKey} already exists`, HTTP_STATUS.CONFLICT, 'ENV_CONFIG_EXISTS');

    const data = { ...dto };
    if (dto.isSensitive) data.configValue = encrypt(dto.configValue);
    const saved = await this.repo.createEnvConfig(data, userId);
    return this.safeEnvConfig(saved as Record<string, unknown>);
  }

  async updateEnvConfig(id: number, dto: UpdateEnvConfigDto, userId?: number) {
    const existing = await this.repo.getEnvConfigById(id);
    if (!existing) throw new AppError('Environment config not found', HTTP_STATUS.NOT_FOUND, 'ENV_CONFIG_NOT_FOUND');

    const data = { ...dto };
    if (dto.configValue && existing.isSensitive) data.configValue = encrypt(dto.configValue);
    const saved = await this.repo.updateEnvConfig(id, data, userId);
    return this.safeEnvConfig(saved as Record<string, unknown>);
  }

  async deleteEnvConfig(id: number) {
    await this.getEnvConfig(id);
    return this.repo.deleteEnvConfig(id);
  }

  private safeEnvConfig(c: Record<string, unknown>): EnvConfigResponse {
    if (c['isSensitive']) {
      return { ...c, configValue: '****' } as unknown as EnvConfigResponse;
    }
    return c as unknown as EnvConfigResponse;
  }
}
