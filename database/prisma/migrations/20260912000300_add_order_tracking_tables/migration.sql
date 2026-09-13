-- Add order workflow and tracking tables required by checkout and order responses.
CREATE TABLE IF NOT EXISTS `OrderStatusHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `fromStatus` ENUM('PENDING','CONFIRMED','PROCESSING','PACKED','READY_TO_SHIP','SHIPPED','OUT_FOR_DELIVERY','DELIVERED','CANCELLED','RETURNED','REFUNDED','FAILED') NOT NULL,
    `toStatus` ENUM('PENDING','CONFIRMED','PROCESSING','PACKED','READY_TO_SHIP','SHIPPED','OUT_FOR_DELIVERY','DELIVERED','CANCELLED','RETURNED','REFUNDED','FAILED') NOT NULL,
    `changedBy` INTEGER NULL,
    `remark` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    INDEX `OrderStatusHistory_orderId_idx` (`orderId`),
    CONSTRAINT `OrderStatusHistory_orderId_fkey`
      FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `OrderTimeline` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `eventType` ENUM('ORDER_PLACED','ORDER_CONFIRMED','ORDER_SHIPPED','OUT_FOR_DELIVERY','DELIVERED','CANCELLED','RETURN_REQUESTED','RETURN_APPROVED','REFUND_PROCESSED','NOTE_ADDED') NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    INDEX `OrderTimeline_orderId_idx` (`orderId`),
    CONSTRAINT `OrderTimeline_orderId_fkey`
      FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Shipment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shipmentNumber` VARCHAR(191) NOT NULL,
    `orderId` INTEGER NOT NULL,
    `carrierName` VARCHAR(191) NOT NULL,
    `trackingNumber` VARCHAR(191) NULL,
    `trackingUrl` VARCHAR(191) NULL,
    `dispatchDate` DATETIME(3) NULL,
    `estimatedDeliveryDate` DATETIME(3) NULL,
    `deliveredDate` DATETIME(3) NULL,
    `shippingCost` DECIMAL(65,30) NOT NULL DEFAULT 0,
    `status` ENUM('PENDING','IN_TRANSIT','OUT_FOR_DELIVERY','DELIVERED','CANCELLED','RETURNED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `Shipment_shipmentNumber_key` (`shipmentNumber`),
    INDEX `Shipment_orderId_idx` (`orderId`),
    CONSTRAINT `Shipment_orderId_fkey`
      FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ShipmentItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shipmentId` INTEGER NOT NULL,
    `orderItemId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `ShipmentItem_shipmentId_idx` (`shipmentId`),
    INDEX `ShipmentItem_orderItemId_idx` (`orderItemId`),
    CONSTRAINT `ShipmentItem_shipmentId_fkey`
      FOREIGN KEY (`shipmentId`) REFERENCES `Shipment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `ShipmentItem_orderItemId_fkey`
      FOREIGN KEY (`orderItemId`) REFERENCES `orderitem` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `OrderNote` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `note` VARCHAR(191) NOT NULL,
    `createdBy` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `OrderNote_orderId_idx` (`orderId`),
    CONSTRAINT `OrderNote_orderId_fkey`
      FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `OrderAuditLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `actorId` INTEGER NULL,
    `details` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    INDEX `OrderAuditLog_orderId_idx` (`orderId`),
    CONSTRAINT `OrderAuditLog_orderId_fkey`
      FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
