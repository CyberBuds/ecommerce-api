-- ============================================================
-- Migration: Reports, Analytics & Business Intelligence Module
-- Created: 2026-07-20T18:00:00
-- ============================================================

-- Scheduled Reports
CREATE TABLE `scheduled_report` (
    `id`          INT NOT NULL AUTO_INCREMENT,
    `reportCode`  VARCHAR(50)  NOT NULL,
    `reportName`  VARCHAR(150) NOT NULL,
    `reportType`  VARCHAR(50)  NOT NULL,
    `frequency`   ENUM('DAILY','WEEKLY','MONTHLY','QUARTERLY','YEARLY') NOT NULL,
    `filters`     JSON         NULL,
    `recipients`  JSON         NULL,
    `nextRunAt`   DATETIME(3)  NOT NULL,
    `lastRunAt`   DATETIME(3)  NULL,
    `status`      ENUM('ACTIVE','PAUSED','COMPLETED') NOT NULL DEFAULT 'ACTIVE',
    `createdBy`   INT          NULL,
    `updatedBy`   INT          NULL,
    `createdAt`   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`   DATETIME(3)  NOT NULL,

    UNIQUE INDEX `scheduled_report_reportCode_key` (`reportCode`),
    INDEX `scheduled_report_status_idx` (`status`),
    INDEX `scheduled_report_frequency_idx` (`frequency`),
    INDEX `scheduled_report_nextRunAt_idx` (`nextRunAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Report Export Logs
CREATE TABLE `report_export_log` (
    `id`          INT NOT NULL AUTO_INCREMENT,
    `reportType`  VARCHAR(50)  NOT NULL,
    `format`      ENUM('EXCEL','CSV','PDF','JSON') NOT NULL,
    `filters`     JSON         NULL,
    `filePath`    VARCHAR(500) NULL,
    `fileSize`    INT          NULL,
    `status`      ENUM('PENDING','PROCESSING','COMPLETED','FAILED') NOT NULL DEFAULT 'PENDING',
    `requestedBy` INT          NULL,
    `completedAt` DATETIME(3)  NULL,
    `error`       TEXT         NULL,
    `createdAt`   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`   DATETIME(3)  NOT NULL,

    INDEX `report_export_log_status_idx`      (`status`),
    INDEX `report_export_log_reportType_idx`  (`reportType`),
    INDEX `report_export_log_requestedBy_idx` (`requestedBy`),
    INDEX `report_export_log_createdAt_idx`   (`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ─── Performance Indexes on existing tables ───────────────────────────────────

-- Orders: Reporting queries filter heavily by createdAt, orderStatus, customerId
CREATE INDEX IF NOT EXISTS `order_createdAt_idx`     ON `Order` (`createdAt`);
CREATE INDEX IF NOT EXISTS `order_orderStatus_idx`   ON `Order` (`orderStatus`);
CREATE INDEX IF NOT EXISTS `order_paymentStatus_idx` ON `Order` (`paymentStatus`);
CREATE INDEX IF NOT EXISTS `order_customerId_idx`    ON `Order` (`customerId`);

-- OrderItem: Aggregations by productId
CREATE INDEX IF NOT EXISTS `order_item_productId_idx` ON `OrderItem` (`productId`);
CREATE INDEX IF NOT EXISTS `order_item_orderId_idx`   ON `OrderItem` (`orderId`);

-- Payment: Aggregations by gateway, status, createdAt
CREATE INDEX IF NOT EXISTS `payment_gateway_idx`   ON `Payment` (`gateway`);
CREATE INDEX IF NOT EXISTS `payment_status_idx`    ON `Payment` (`status`);
CREATE INDEX IF NOT EXISTS `payment_createdAt_idx` ON `Payment` (`createdAt`);
CREATE INDEX IF NOT EXISTS `payment_paidAt_idx`    ON `Payment` (`paidAt`);

-- Customer: Reports filter by createdAt
CREATE INDEX IF NOT EXISTS `customer_createdAt_idx` ON `Customer` (`createdAt`);
CREATE INDEX IF NOT EXISTS `customer_status_idx`    ON `Customer` (`status`);

-- Invoice: GST reports filter by invoiceDate, invoiceStatus
CREATE INDEX IF NOT EXISTS `invoice_invoiceDate_idx`   ON `Invoice` (`invoiceDate`);
CREATE INDEX IF NOT EXISTS `invoice_invoiceStatus_idx` ON `Invoice` (`invoiceStatus`);

-- StockMovement: Stock ledger queries filter by productId, warehouseId, date
CREATE INDEX IF NOT EXISTS `stock_movement_productId_idx`   ON `StockMovement` (`productId`);
CREATE INDEX IF NOT EXISTS `stock_movement_warehouseId_idx` ON `StockMovement` (`warehouseId`);
CREATE INDEX IF NOT EXISTS `stock_movement_date_idx`        ON `StockMovement` (`date`);

-- Inventory: Low/out-of-stock queries
CREATE INDEX IF NOT EXISTS `inventory_availableStock_idx` ON `Inventory` (`availableStock`);

-- ReturnRequest: Filter by requestedDate
CREATE INDEX IF NOT EXISTS `return_request_requestedDate_idx` ON `ReturnRequest` (`requestedDate`);

-- Refund: Filter by createdAt
CREATE INDEX IF NOT EXISTS `refund_createdAt_idx` ON `Refund` (`createdAt`);

-- CampaignAnalytics: Campaign performance aggregation
CREATE INDEX IF NOT EXISTS `campaign_analytics_campaignId_idx` ON `CampaignAnalytics` (`campaignId`);

-- NewsletterSubscriber: Subscriber count by date
CREATE INDEX IF NOT EXISTS `newsletter_subscriber_subscribedAt_idx` ON `NewsletterSubscriber` (`subscribedAt`);

-- AbandonedCartRecovery: Recovery reports
CREATE INDEX IF NOT EXISTS `abandoned_cart_recovery_recoveryStatus_idx` ON `AbandonedCartRecovery` (`recoveryStatus`);
