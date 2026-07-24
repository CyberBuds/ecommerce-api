// ─── Company Profile ──────────────────────────────────────────────────────────

export interface UpsertCompanyProfileDto {
  companyName: string;
  legalName?: string;
  gstNumber?: string;
  panNumber?: string;
  logoId?: number;
  faviconId?: number;
  email: string;
  phone: string;
  whatsapp?: string;
  website?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  pincode?: string;
  invoicePrefix?: string;
  currency?: string;
  timezone?: string;
}

export interface CompanyProfileResponse {
  id: number;
  companyName: string;
  legalName: string | null;
  gstNumber: string | null;
  panNumber: string | null;
  logoId: number | null;
  faviconId: number | null;
  email: string;
  phone: string;
  whatsapp: string | null;
  website: string | null;
  address: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  pincode: string | null;
  invoicePrefix: string;
  currency: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Store Settings ───────────────────────────────────────────────────────────

export interface UpsertStoreSettingsDto {
  storeName: string;
  storeUrl?: string;
  supportEmail?: string;
  supportMobile?: string;
  orderPrefix?: string;
  invoicePrefix?: string;
  shipmentPrefix?: string;
  returnPrefix?: string;
  currency?: string;
  language?: string;
  timezone?: string;
  maintenanceMode?: boolean;
  maintenanceMsg?: string;
}

// ─── App Settings ─────────────────────────────────────────────────────────────

export interface UpsertAppSettingsDto {
  registrationEnabled?: boolean;
  guestCheckout?: boolean;
  wishlistEnabled?: boolean;
  reviewsEnabled?: boolean;
  codEnabled?: boolean;
  inventoryTracking?: boolean;
  lowStockAlert?: boolean;
  lowStockThreshold?: number;
  autoInvoice?: boolean;
  autoShipment?: boolean;
  autoRefund?: boolean;
}

// ─── Theme Settings ───────────────────────────────────────────────────────────

export interface UpsertThemeSettingsDto {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  logoId?: number;
  darkMode?: boolean;
  layout?: string;
  typography?: string;
  customCss?: string;
}

// ─── Currency ─────────────────────────────────────────────────────────────────

export interface CreateCurrencyDto {
  code: string;
  name: string;
  symbol: string;
  exchangeRate?: number;
  isDefault?: boolean;
  isActive?: boolean;
}

export interface UpdateCurrencyDto {
  name?: string;
  symbol?: string;
  exchangeRate?: number;
  isActive?: boolean;
}

// ─── Language ─────────────────────────────────────────────────────────────────

export interface CreateLanguageDto {
  code: string;
  name: string;
  nativeName?: string;
  isRtl?: boolean;
  isDefault?: boolean;
  isActive?: boolean;
}

export interface UpdateLanguageDto {
  name?: string;
  nativeName?: string;
  isRtl?: boolean;
  isActive?: boolean;
}

// ─── Tax Configuration ────────────────────────────────────────────────────────

export interface CreateTaxConfigDto {
  name: string;
  taxType: string;
  cgstRate?: number;
  sgstRate?: number;
  igstRate?: number;
  cessRate?: number;
  hsnCodes?: unknown;
  isDefault?: boolean;
  isActive?: boolean;
}

export interface UpdateTaxConfigDto {
  name?: string;
  taxType?: string;
  cgstRate?: number;
  sgstRate?: number;
  igstRate?: number;
  cessRate?: number;
  hsnCodes?: unknown;
  isDefault?: boolean;
  isActive?: boolean;
}

// ─── Email Configuration ──────────────────────────────────────────────────────

export interface UpsertEmailConfigDto {
  smtpHost: string;
  smtpPort?: number;
  username: string;
  password: string;
  encryption?: string;
  fromEmail: string;
  fromName: string;
  isActive?: boolean;
}

export interface EmailConfigResponse {
  id: number;
  smtpHost: string;
  smtpPort: number;
  username: string;
  password: string; // masked
  encryption: string;
  fromEmail: string;
  fromName: string;
  isActive: boolean;
  lastTestedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─── SMS Configuration ────────────────────────────────────────────────────────

export interface UpsertSmsConfigDto {
  provider: string;
  apiKey: string;
  senderId: string;
  isActive?: boolean;
}

// ─── WhatsApp Configuration ───────────────────────────────────────────────────

export interface UpsertWhatsAppConfigDto {
  provider: string;
  apiKey: string;
  phoneNumber?: string;
  templateIds?: Record<string, string>;
  isActive?: boolean;
}

// ─── Push Notification Configuration ─────────────────────────────────────────

export interface UpsertPushConfigDto {
  provider: string;
  firebaseServerKey?: string;
  oneSignalAppId?: string;
  oneSignalApiKey?: string;
  vapidPublicKey?: string;
  vapidPrivateKey?: string;
  isActive?: boolean;
}

// ─── Notification Template ────────────────────────────────────────────────────

export interface CreateNotificationTemplateDto {
  templateCode: string;
  templateName: string;
  channel: 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH';
  event: string;
  subject?: string;
  body: string;
  variables?: Record<string, string>;
  isActive?: boolean;
}

export interface UpdateNotificationTemplateDto {
  templateName?: string;
  channel?: 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH';
  event?: string;
  subject?: string;
  body?: string;
  variables?: Record<string, string>;
  isActive?: boolean;
}

export interface NotificationTemplateQuery {
  channel?: string;
  event?: string;
  isActive?: string;
  page?: number;
  pageSize?: number;
}

// ─── API Key ──────────────────────────────────────────────────────────────────

export interface CreateApiKeyDto {
  name: string;
  permissions?: string[];
  expiresAt?: string;
}

export interface ApiKeyCreateResponse {
  id: number;
  name: string;
  rawKey: string; // returned ONCE on creation
  keyPrefix: string;
  permissions: unknown;
  expiresAt: Date | null;
  status: string;
  createdAt: Date;
}

export interface ApiKeyResponse {
  id: number;
  name: string;
  keyPrefix: string;
  permissions: unknown;
  expiresAt: Date | null;
  lastUsedAt: Date | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiKeyQuery {
  status?: string;
  page?: number;
  pageSize?: number;
}

// ─── Third Party Integration ──────────────────────────────────────────────────

export interface UpsertIntegrationDto {
  displayName?: string;
  apiKey?: string;
  apiSecret?: string;
  webhookSecret?: string;
  webhookUrl?: string;
  extraConfig?: Record<string, unknown>;
  status?: 'ACTIVE' | 'INACTIVE' | 'TESTING';
}

export interface IntegrationResponse {
  id: number;
  provider: string;
  displayName: string;
  apiKey: string | null;  // masked
  apiSecret: string | null; // masked
  webhookSecret: string | null; // masked
  webhookUrl: string | null;
  extraConfig: unknown;
  status: string;
  lastTestedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Feature Flag ─────────────────────────────────────────────────────────────

export interface CreateFeatureFlagDto {
  flagKey: string;
  flagName: string;
  description?: string;
  isEnabled?: boolean;
  rolloutPercent?: number;
  environment?: string;
  conditions?: Record<string, unknown>;
}

export interface UpdateFeatureFlagDto {
  flagName?: string;
  description?: string;
  isEnabled?: boolean;
  rolloutPercent?: number;
  environment?: string;
  conditions?: Record<string, unknown>;
}

export interface FeatureFlagQuery {
  environment?: string;
  isEnabled?: string;
  page?: number;
  pageSize?: number;
}

// ─── Scheduler Job ────────────────────────────────────────────────────────────

export interface CreateSchedulerJobDto {
  jobKey: string;
  jobName: string;
  description?: string;
  cronExpression: string;
  handler: string;
  params?: Record<string, unknown>;
  status?: 'ACTIVE' | 'PAUSED' | 'DISABLED';
}

export interface UpdateSchedulerJobDto {
  jobName?: string;
  description?: string;
  cronExpression?: string;
  handler?: string;
  params?: Record<string, unknown>;
  status?: 'ACTIVE' | 'PAUSED' | 'DISABLED';
}

export interface SchedulerJobQuery {
  status?: string;
  page?: number;
  pageSize?: number;
}

// ─── Audit Log ────────────────────────────────────────────────────────────────

export interface AuditLogQuery {
  userId?: number;
  module?: string;
  action?: string;
  entityType?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

// ─── Activity Log ─────────────────────────────────────────────────────────────

export interface ActivityLogQuery {
  userId?: number;
  activityType?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

// ─── Error Log ────────────────────────────────────────────────────────────────

export interface ErrorLogQuery {
  errorType?: string;
  module?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

// ─── System Health ────────────────────────────────────────────────────────────

export interface ServiceHealthStatus {
  name: string;
  status: 'UP' | 'DOWN' | 'DEGRADED' | 'UNKNOWN';
  latencyMs?: number;
  message?: string;
}

export interface SystemHealthResponse {
  overall: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  timestamp: string;
  uptime: number;
  services: ServiceHealthStatus[];
  system: {
    memoryUsedMb: number;
    memoryTotalMb: number;
    memoryPercent: number;
    cpuUserMs: number;
    cpuSystemMs: number;
    nodeVersion: string;
    platform: string;
  };
}

// ─── Backup ───────────────────────────────────────────────────────────────────

export interface CreateBackupDto {
  backupType: 'DATABASE' | 'MEDIA' | 'CONFIGURATION' | 'FULL';
  isScheduled?: boolean;
}

export interface BackupQuery {
  backupType?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

// ─── File Storage ─────────────────────────────────────────────────────────────

export interface UpsertFileStorageDto {
  provider: 'LOCAL' | 'CLOUDINARY' | 'AWS_S3';
  localUploadPath?: string;
  cloudinaryCloud?: string;
  cloudinaryKey?: string;
  cloudinarySecret?: string;
  awsBucket?: string;
  awsRegion?: string;
  awsAccessKey?: string;
  awsSecretKey?: string;
  maxFileSizeMb?: number;
  allowedTypes?: string[];
  isActive?: boolean;
}

// ─── Security Settings ────────────────────────────────────────────────────────

export interface UpsertSecuritySettingsDto {
  minPasswordLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
  sessionTimeoutMinutes?: number;
  jwtExpiryMinutes?: number;
  refreshTokenExpiryDays?: number;
  maxLoginAttempts?: number;
  lockoutDurationMinutes?: number;
  ipWhitelist?: string[];
  ipBlacklist?: string[];
  corsOrigins?: string[];
  twoFactorEnabled?: boolean;
}

// ─── License ──────────────────────────────────────────────────────────────────

export interface UpsertLicenseDto {
  licenseKey: string;
  productName: string;
  licensedTo: string;
  email: string;
  plan: string;
  maxUsers?: number;
  expiresAt?: string;
}

export interface LicenseResponse {
  id: number;
  licenseKey: string; // masked
  productName: string;
  licensedTo: string;
  email: string;
  plan: string;
  maxUsers: number | null;
  expiresAt: Date | null;
  isValid: boolean;
  lastCheckedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─── System Version ───────────────────────────────────────────────────────────

export interface CreateSystemVersionDto {
  version: string;
  buildNumber?: string;
  releaseDate: string;
  changelog?: string;
  isLatest?: boolean;
}

// ─── Environment Config ───────────────────────────────────────────────────────

export interface CreateEnvConfigDto {
  configKey: string;
  configValue: string;
  isSensitive?: boolean;
  description?: string;
  environment?: string;
  isActive?: boolean;
}

export interface UpdateEnvConfigDto {
  configValue?: string;
  isSensitive?: boolean;
  description?: string;
  environment?: string;
  isActive?: boolean;
}

export interface EnvConfigResponse {
  id: number;
  configKey: string;
  configValue: string; // masked if isSensitive
  isSensitive: boolean;
  description: string | null;
  environment: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EnvConfigQuery {
  environment?: string;
  isActive?: string;
  page?: number;
  pageSize?: number;
}
