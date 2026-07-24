-- ============================================================
-- Migration: System Administration & Configuration Module
-- Created: 2026-07-20T19:00:00
-- ============================================================

-- ─── Enums (represented via VARCHAR in MySQL) are handled by Prisma ──────────
-- MySQL does not support standalone enum types; Prisma generates ENUM columns inline.
-- The migration below creates all tables with ENUM columns as needed.

-- ─── Company Profile (singleton) ─────────────────────────────────────────────

CREATE TABLE `company_profile` (
    `id`            INT          NOT NULL AUTO_INCREMENT,
    `companyName`   VARCHAR(200) NOT NULL,
    `legalName`     VARCHAR(200) NULL,
    `gstNumber`     VARCHAR(30)  NULL,
    `panNumber`     VARCHAR(20)  NULL,
    `logoId`        INT          NULL,
    `faviconId`     INT          NULL,
    `email`         VARCHAR(255) NOT NULL,
    `phone`         VARCHAR(30)  NOT NULL,
    `whatsapp`      VARCHAR(30)  NULL,
    `website`       VARCHAR(500) NULL,
    `address`       VARCHAR(500) NULL,
    `country`       VARCHAR(100) NULL,
    `state`         VARCHAR(100) NULL,
    `city`          VARCHAR(100) NULL,
    `pincode`       VARCHAR(20)  NULL,
    `invoicePrefix` VARCHAR(10)  NOT NULL DEFAULT 'INV',
    `currency`      VARCHAR(10)  NOT NULL DEFAULT 'INR',
    `timezone`      VARCHAR(100) NOT NULL DEFAULT 'Asia/Kolkata',
    `createdAt`     DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`     DATETIME(3)  NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ─── Store Settings (singleton) ──────────────────────────────────────────────

CREATE TABLE `store_settings` (
    `id`              INT          NOT NULL AUTO_INCREMENT,
    `storeName`       VARCHAR(200) NOT NULL,
    `storeUrl`        VARCHAR(500) NULL,
    `supportEmail`    VARCHAR(255) NULL,
    `supportMobile`   VARCHAR(30)  NULL,
    `orderPrefix`     VARCHAR(10)  NOT NULL DEFAULT 'ORD',
    `invoicePrefix`   VARCHAR(10)  NOT NULL DEFAULT 'INV',
    `shipmentPrefix`  VARCHAR(10)  NOT NULL DEFAULT 'SHP',
    `returnPrefix`    VARCHAR(10)  NOT NULL DEFAULT 'RET',
    `currency`        VARCHAR(10)  NOT NULL DEFAULT 'INR',
    `language`        VARCHAR(10)  NOT NULL DEFAULT 'en',
    `timezone`        VARCHAR(100) NOT NULL DEFAULT 'Asia/Kolkata',
    `maintenanceMode` BOOLEAN      NOT NULL DEFAULT false,
    `maintenanceMsg`  VARCHAR(500) NULL,
    `createdAt`       DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`       DATETIME(3)  NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ─── App Settings (singleton) ────────────────────────────────────────────────

CREATE TABLE `app_settings` (
    `id`                  INT         NOT NULL AUTO_INCREMENT,
    `registrationEnabled` BOOLEAN     NOT NULL DEFAULT true,
    `guestCheckout`       BOOLEAN     NOT NULL DEFAULT true,
    `wishlistEnabled`     BOOLEAN     NOT NULL DEFAULT true,
    `reviewsEnabled`      BOOLEAN     NOT NULL DEFAULT true,
    `codEnabled`          BOOLEAN     NOT NULL DEFAULT true,
    `inventoryTracking`   BOOLEAN     NOT NULL DEFAULT true,
    `lowStockAlert`       BOOLEAN     NOT NULL DEFAULT true,
    `lowStockThreshold`   INT         NOT NULL DEFAULT 10,
    `autoInvoice`         BOOLEAN     NOT NULL DEFAULT true,
    `autoShipment`        BOOLEAN     NOT NULL DEFAULT false,
    `autoRefund`          BOOLEAN     NOT NULL DEFAULT false,
    `createdAt`           DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`           DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ─── Theme Settings (singleton) ──────────────────────────────────────────────

CREATE TABLE `theme_settings` (
    `id`             INT          NOT NULL AUTO_INCREMENT,
    `primaryColor`   VARCHAR(20)  NOT NULL DEFAULT '#007bff',
    `secondaryColor` VARCHAR(20)  NOT NULL DEFAULT '#6c757d',
    `accentColor`    VARCHAR(20)  NULL,
    `logoId`         INT          NULL,
    `darkMode`       BOOLEAN      NOT NULL DEFAULT false,
    `layout`         VARCHAR(50)  NOT NULL DEFAULT 'default',
    `typography`     VARCHAR(50)  NOT NULL DEFAULT 'default',
    `customCss`      LONGTEXT     NULL,
    `createdAt`      DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`      DATETIME(3)  NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ─── Currency ─────────────────────────────────────────────────────────────────

CREATE TABLE `sys_currency` (
    `id`           INT            NOT NULL AUTO_INCREMENT,
    `code`         VARCHAR(3)     NOT NULL,
    `name`         VARCHAR(100)   NOT NULL,
    `symbol`       VARCHAR(10)    NOT NULL,
    `exchangeRate` DECIMAL(15, 6) NOT NULL DEFAULT 1,
    `isDefault`    BOOLEAN        NOT NULL DEFAULT false,
    `isActive`     BOOLEAN        NOT NULL DEFAULT true,
    `createdAt`    DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`    DATETIME(3)    NOT NULL,

    UNIQUE INDEX `sys_currency_code_key` (`code`),
    INDEX `sys_currency_isDefault_idx` (`isDefault`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ─── Language ─────────────────────────────────────────────────────────────────

CREATE TABLE `sys_language` (
    `id`         INT          NOT NULL AUTO_INCREMENT,
    `code`       VARCHAR(10)  NOT NULL,
    `name`       VARCHAR(100) NOT NULL,
    `nativeName` VARCHAR(100) NULL,
    `isRtl`      BOOLEAN      NOT NULL DEFAULT false,
    `isDefault`  BOOLEAN      NOT NULL DEFAULT false,
    `isActive`   BOOLEAN      NOT NULL DEFAULT true,
    `createdAt`  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`  DATETIME(3)  NOT NULL,

    UNIQUE INDEX `sys_language_code_key` (`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ─── Email Configuration (singleton) ─────────────────────────────────────────

CREATE TABLE `email_configuration` (
    `id`           INT          NOT NULL AUTO_INCREMENT,
    `smtpHost`     VARCHAR(255) NOT NULL,
    `smtpPort`     INT          NOT NULL DEFAULT 587,
    `username`     VARCHAR(255) NOT NULL,
    `password`     VARCHAR(500) NOT NULL,
    `encryption`   VARCHAR(10)  NOT NULL DEFAULT 'TLS',
    `fromEmail`    VARCHAR(255) NOT NULL,
    `fromName`     VARCHAR(100) NOT NULL,
    `isActive`     BOOLEAN      NOT NULL DEFAULT true,
    `lastTestedAt` DATETIME(3)  NULL,
    `createdAt`    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`    DATETIME(3)  NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ─── SMS Configuration (singleton) ───────────────────────────────────────────

CREATE TABLE `sms_configuration` (
    `id`        INT          NOT NULL AUTO_INCREMENT,
    `provider`  VARCHAR(100) NOT NULL,
    `apiKey`    VARCHAR(500) NOT NULL,
    `senderId`  VARCHAR(30)  NOT NULL,
    `isActive`  BOOLEAN      NOT NULL DEFAULT true,
    `createdAt` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3)  NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ─── WhatsApp Configuration (singleton) ──────────────────────────────────────

CREATE TABLE `whats_app_configuration` (
    `id`          INT          NOT NULL AUTO_INCREMENT,
    `provider`    VARCHAR(100) NOT NULL,
    `apiKey`      VARCHAR(500) NOT NULL,
    `phoneNumber` VARCHAR(30)  NULL,
    `templateIds` JSON         NULL,
    `isActive`    BOOLEAN      NOT NULL DEFAULT true,
    `createdAt`   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`   DATETIME(3)  NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ─── Push Notification Configuration (singleton) ─────────────────────────────

CREATE TABLE `push_notification_config` (
    `id`                INT          NOT NULL AUTO_INCREMENT,
    `provider`          VARCHAR(50)  NOT NULL,
    `firebaseServerKey` VARCHAR(500) NULL,
    `oneSignalAppId`    VARCHAR(200) NULL,
    `oneSignalApiKey`   VARCHAR(500) NULL,
    `vapidPublicKey`    VARCHAR(500) NULL,
    `vapidPrivateKey`   VARCHAR(500) NULL,
    `isActive`          BOOLEAN      NOT NULL DEFAULT true,
    `createdAt`         DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`         DATETIME(3)  NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ─── Notification Template ────────────────────────────────────────────────────

CREATE TABLE `notification_template` (
    `id`           INT          NOT NULL AUTO_INCREMENT,
    `templateCode` VARCHAR(100) NOT NULL,
    `templateName` VARCHAR(200) NOT NULL,
    `channel`      ENUM('EMAIL','SMS','WHATSAPP','PUSH') NOT NULL,
    `event`        VARCHAR(100) NOT NULL,
    `subject`      VARCHAR(500) NULL,
    `body`         LONGTEXT     NOT NULL,
    `variables`    JSON         NULL,
    `isActive`     BOOLEAN      NOT NULL DEFAULT true,
    `createdBy`    INT          NULL,
    `updatedBy`    INT          NULL,
    `createdAt`    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`    DATETIME(3)  NOT NULL,

    UNIQUE INDEX `notification_template_templateCode_key` (`templateCode`),
    INDEX `notification_template_channel_idx` (`channel`),
    INDEX `notification_template_event_idx`   (`event`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ─── API Key ──────────────────────────────────────────────────────────────────

CREATE TABLE `api_key` (
    `id`          INT          NOT NULL AUTO_INCREMENT,
    `name`        VARCHAR(100) NOT NULL,
    `keyHash`     VARCHAR(64)  NOT NULL,
    `keyPrefix`   VARCHAR(20)  NOT NULL,
    `secret`      VARCHAR(500) NOT NULL,
    `permissions` JSON         NULL,
    `expiresAt`   DATETIME(3)  NULL,
    `lastUsedAt`  DATETIME(3)  NULL,
    `status`      ENUM('ACTIVE','REVOKED','EXPIRED') NOT NULL DEFAULT 'ACTIVE',
    `createdBy`   INT          NULL,
    `updatedBy`   INT          NULL,
    `createdAt`   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`   DATETIME(3)  NOT NULL,

    UNIQUE INDEX `api_key_keyHash_key` (`keyHash`),
    INDEX `api_key_status_idx`    (`status`),
    INDEX `api_key_expiresAt_idx` (`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ─── Third Party Integration ──────────────────────────────────────────────────

CREATE TABLE `third_party_integration` (
    `id`            INT         NOT NULL AUTO_INCREMENT,
    `provider`      ENUM('RAZORPAY','STRIPE','PAYPAL','CASHFREE','PHONEPE','PAYTM','SHIPROCKET','DELHIVERY','GOOGLE_MAPS','GOOGLE_ANALYTICS','GOOGLE_TAG_MANAGER','FACEBOOK_PIXEL','CLOUDINARY','AWS_S3') NOT NULL,
    `displayName`   VARCHAR(100) NOT NULL,
    `apiKey`        VARCHAR(500) NULL,
    `apiSecret`     VARCHAR(500) NULL,
    `webhookSecret` VARCHAR(500) NULL,
    `webhookUrl`    VARCHAR(500) NULL,
    `extraConfig`   JSON         NULL,
    `status`        ENUM('ACTIVE','INACTIVE','TESTING') NOT NULL DEFAULT 'INACTIVE',
    `lastTestedAt`  DATETIME(3)  NULL,
    `createdBy`     INT          NULL,
    `updatedBy`     INT          NULL,
    `createdAt`     DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`     DATETIME(3)  NOT NULL,

    UNIQUE INDEX `third_party_integration_provider_key` (`provider`),
    INDEX `third_party_integration_status_idx` (`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ─── Feature Flag ─────────────────────────────────────────────────────────────

CREATE TABLE `feature_flag` (
    `id`             INT          NOT NULL AUTO_INCREMENT,
    `flagKey`        VARCHAR(200) NOT NULL,
    `flagName`       VARCHAR(200) NOT NULL,
    `description`    VARCHAR(500) NULL,
    `isEnabled`      BOOLEAN      NOT NULL DEFAULT false,
    `rolloutPercent` INT          NOT NULL DEFAULT 0,
    `environment`    VARCHAR(50)  NOT NULL DEFAULT 'all',
    `conditions`     JSON         NULL,
    `createdBy`      INT          NULL,
    `updatedBy`      INT          NULL,
    `createdAt`      DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`      DATETIME(3)  NOT NULL,

    UNIQUE INDEX `feature_flag_flagKey_key` (`flagKey`),
    INDEX `feature_flag_environment_idx` (`environment`),
    INDEX `feature_flag_isEnabled_idx`   (`isEnabled`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ─── Scheduler Job ────────────────────────────────────────────────────────────

CREATE TABLE `scheduler_job` (
    `id`             INT          NOT NULL AUTO_INCREMENT,
    `jobKey`         VARCHAR(200) NOT NULL,
    `jobName`        VARCHAR(200) NOT NULL,
    `description`    VARCHAR(500) NULL,
    `cronExpression` VARCHAR(100) NOT NULL,
    `handler`        VARCHAR(200) NOT NULL,
    `params`         JSON         NULL,
    `status`         ENUM('ACTIVE','PAUSED','DISABLED') NOT NULL DEFAULT 'ACTIVE',
    `lastRunAt`      DATETIME(3)  NULL,
    `lastRunStatus`  VARCHAR(50)  NULL,
    `lastRunError`   VARCHAR(500) NULL,
    `nextRunAt`      DATETIME(3)  NULL,
    `runCount`       INT          NOT NULL DEFAULT 0,
    `createdBy`      INT          NULL,
    `updatedBy`      INT          NULL,
    `createdAt`      DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`      DATETIME(3)  NOT NULL,

    UNIQUE INDEX `scheduler_job_jobKey_key` (`jobKey`),
    INDEX `scheduler_job_status_idx` (`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ─── Audit Log ────────────────────────────────────────────────────────────────

CREATE TABLE `audit_log` (
    `id`         INT          NOT NULL AUTO_INCREMENT,
    `userId`     INT          NULL,
    `userEmail`  VARCHAR(255) NULL,
    `action`     VARCHAR(100) NOT NULL,
    `module`     VARCHAR(100) NOT NULL,
    `entityType` VARCHAR(100) NULL,
    `entityId`   INT          NULL,
    `oldValue`   JSON         NULL,
    `newValue`   JSON         NULL,
    `ipAddress`  VARCHAR(45)  NULL,
    `userAgent`  VARCHAR(500) NULL,
    `device`     VARCHAR(200) NULL,
    `createdAt`  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `audit_log_userId_idx`    (`userId`),
    INDEX `audit_log_module_idx`    (`module`),
    INDEX `audit_log_action_idx`    (`action`),
    INDEX `audit_log_createdAt_idx` (`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ─── Activity Log ─────────────────────────────────────────────────────────────

CREATE TABLE `activity_log` (
    `id`           INT          NOT NULL AUTO_INCREMENT,
    `userId`       INT          NULL,
    `userEmail`    VARCHAR(255) NULL,
    `activityType` ENUM('LOGIN','LOGOUT','LOGIN_FAILED','PASSWORD_CHANGED','PROFILE_UPDATED','CONFIG_CHANGED','API_KEY_CREATED','API_KEY_REVOKED','BACKUP_CREATED','BACKUP_RESTORED') NOT NULL,
    `description`  VARCHAR(500) NULL,
    `ipAddress`    VARCHAR(45)  NULL,
    `userAgent`    VARCHAR(500) NULL,
    `device`       VARCHAR(200) NULL,
    `status`       VARCHAR(20)  NOT NULL DEFAULT 'SUCCESS',
    `createdAt`    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `activity_log_userId_idx`       (`userId`),
    INDEX `activity_log_activityType_idx` (`activityType`),
    INDEX `activity_log_createdAt_idx`    (`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ─── Error Log ────────────────────────────────────────────────────────────────

CREATE TABLE `error_log` (
    `id`            INT          NOT NULL AUTO_INCREMENT,
    `errorCode`     VARCHAR(50)  NULL,
    `message`       LONGTEXT     NOT NULL,
    `stack`         LONGTEXT     NULL,
    `errorType`     VARCHAR(50)  NOT NULL DEFAULT 'APPLICATION',
    `module`        VARCHAR(100) NULL,
    `requestUrl`    VARCHAR(500) NULL,
    `requestMethod` VARCHAR(10)  NULL,
    `userId`        INT          NULL,
    `ipAddress`     VARCHAR(45)  NULL,
    `environment`   VARCHAR(20)  NULL,
    `createdAt`     DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `error_log_errorType_idx` (`errorType`),
    INDEX `error_log_module_idx`    (`module`),
    INDEX `error_log_createdAt_idx` (`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ─── Security Settings (singleton) ───────────────────────────────────────────

CREATE TABLE `security_settings` (
    `id`                     INT         NOT NULL AUTO_INCREMENT,
    `minPasswordLength`      INT         NOT NULL DEFAULT 8,
    `requireUppercase`       BOOLEAN     NOT NULL DEFAULT true,
    `requireLowercase`       BOOLEAN     NOT NULL DEFAULT true,
    `requireNumbers`         BOOLEAN     NOT NULL DEFAULT true,
    `requireSpecialChars`    BOOLEAN     NOT NULL DEFAULT false,
    `sessionTimeoutMinutes`  INT         NOT NULL DEFAULT 60,
    `jwtExpiryMinutes`       INT         NOT NULL DEFAULT 15,
    `refreshTokenExpiryDays` INT         NOT NULL DEFAULT 7,
    `maxLoginAttempts`       INT         NOT NULL DEFAULT 5,
    `lockoutDurationMinutes` INT         NOT NULL DEFAULT 30,
    `ipWhitelist`            JSON        NULL,
    `ipBlacklist`            JSON        NULL,
    `corsOrigins`            JSON        NULL,
    `twoFactorEnabled`       BOOLEAN     NOT NULL DEFAULT false,
    `createdAt`              DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`              DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ─── Backup Record ────────────────────────────────────────────────────────────

CREATE TABLE `backup_record` (
    `id`          INT          NOT NULL AUTO_INCREMENT,
    `backupCode`  VARCHAR(100) NOT NULL,
    `backupType`  ENUM('DATABASE','MEDIA','CONFIGURATION','FULL') NOT NULL,
    `filePath`    VARCHAR(500) NULL,
    `fileSize`    BIGINT       NULL,
    `status`      ENUM('PENDING','IN_PROGRESS','COMPLETED','FAILED') NOT NULL DEFAULT 'PENDING',
    `isScheduled` BOOLEAN      NOT NULL DEFAULT false,
    `startedAt`   DATETIME(3)  NULL,
    `completedAt` DATETIME(3)  NULL,
    `error`       VARCHAR(500) NULL,
    `restoredAt`  DATETIME(3)  NULL,
    `createdBy`   INT          NULL,
    `createdAt`   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`   DATETIME(3)  NOT NULL,

    UNIQUE INDEX `backup_record_backupCode_key` (`backupCode`),
    INDEX `backup_record_backupType_idx` (`backupType`),
    INDEX `backup_record_status_idx`     (`status`),
    INDEX `backup_record_createdAt_idx`  (`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ─── File Storage Configuration (singleton) ───────────────────────────────────

CREATE TABLE `file_storage_config` (
    `id`               INT          NOT NULL AUTO_INCREMENT,
    `provider`         VARCHAR(20)  NOT NULL DEFAULT 'LOCAL',
    `localUploadPath`  VARCHAR(500) NULL,
    `cloudinaryCloud`  VARCHAR(200) NULL,
    `cloudinaryKey`    VARCHAR(500) NULL,
    `cloudinarySecret` VARCHAR(500) NULL,
    `awsBucket`        VARCHAR(200) NULL,
    `awsRegion`        VARCHAR(50)  NULL,
    `awsAccessKey`     VARCHAR(500) NULL,
    `awsSecretKey`     VARCHAR(500) NULL,
    `maxFileSizeMb`    INT          NOT NULL DEFAULT 10,
    `allowedTypes`     JSON         NULL,
    `isActive`         BOOLEAN      NOT NULL DEFAULT true,
    `createdAt`        DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`        DATETIME(3)  NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ─── License Info (singleton) ─────────────────────────────────────────────────

CREATE TABLE `license_info` (
    `id`            INT          NOT NULL AUTO_INCREMENT,
    `licenseKey`    VARCHAR(500) NOT NULL,
    `productName`   VARCHAR(200) NOT NULL,
    `licensedTo`    VARCHAR(200) NOT NULL,
    `email`         VARCHAR(255) NOT NULL,
    `plan`          VARCHAR(100) NOT NULL,
    `maxUsers`      INT          NULL,
    `expiresAt`     DATETIME(3)  NULL,
    `isValid`       BOOLEAN      NOT NULL DEFAULT true,
    `lastCheckedAt` DATETIME(3)  NULL,
    `createdAt`     DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`     DATETIME(3)  NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ─── System Version ───────────────────────────────────────────────────────────

CREATE TABLE `system_version` (
    `id`          INT          NOT NULL AUTO_INCREMENT,
    `version`     VARCHAR(50)  NOT NULL,
    `buildNumber` VARCHAR(100) NULL,
    `releaseDate` DATETIME(3)  NOT NULL,
    `changelog`   LONGTEXT     NULL,
    `isLatest`    BOOLEAN      NOT NULL DEFAULT false,
    `createdAt`   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `system_version_isLatest_idx`    (`isLatest`),
    INDEX `system_version_releaseDate_idx` (`releaseDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ─── Environment Config ───────────────────────────────────────────────────────

CREATE TABLE `environment_config` (
    `id`          INT          NOT NULL AUTO_INCREMENT,
    `configKey`   VARCHAR(200) NOT NULL,
    `configValue` LONGTEXT     NOT NULL,
    `isSensitive` BOOLEAN      NOT NULL DEFAULT false,
    `description` VARCHAR(500) NULL,
    `environment` VARCHAR(50)  NOT NULL DEFAULT 'all',
    `isActive`    BOOLEAN      NOT NULL DEFAULT true,
    `createdBy`   INT          NULL,
    `updatedBy`   INT          NULL,
    `createdAt`   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`   DATETIME(3)  NOT NULL,

    UNIQUE INDEX `environment_config_configKey_key` (`configKey`),
    INDEX `environment_config_environment_idx` (`environment`),
    INDEX `environment_config_isActive_idx`    (`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
