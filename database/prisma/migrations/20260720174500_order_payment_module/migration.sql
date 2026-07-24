-- Order, Payment & Invoice Module
-- Migration: order_payment_module

-- ============================================================
-- CreateTable: Coupon
-- ============================================================
CREATE TABLE IF NOT EXISTS `Coupon` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `couponCode` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `couponType` ENUM('PERCENTAGE', 'FLAT', 'FREE_SHIPPING') NOT NULL DEFAULT 'FLAT',
    `percentage` INTEGER NULL,
    `flatAmount` DECIMAL(65, 30) NULL,
    `maximumDiscount` DECIMAL(65, 30) NULL,
    `minimumOrderAmount` DECIMAL(65, 30) NULL,
    `usageLimit` INTEGER NULL,
    `usagePerCustomer` INTEGER NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `applicableCategories` JSON NULL,
    `applicableProducts` JSON NULL,
    `applicableCustomerGroups` JSON NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'DRAFT') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Coupon_couponCode_key`(`couponCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: CustomerAddress
-- ============================================================
CREATE TABLE IF NOT EXISTS `CustomerAddress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `addressType` ENUM('BILLING', 'SHIPPING') NOT NULL,
    `isDefaultBilling` BOOLEAN NOT NULL DEFAULT false,
    `isDefaultShipping` BOOLEAN NOT NULL DEFAULT false,
    `addressLine1` VARCHAR(191) NOT NULL,
    `addressLine2` VARCHAR(191) NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `pincode` VARCHAR(191) NOT NULL,
    `latitude` FLOAT NULL,
    `longitude` FLOAT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'DRAFT') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: ShippingMethod
-- ============================================================
CREATE TABLE IF NOT EXISTS `ShippingMethod` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'DRAFT') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ShippingMethod_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: DeliverySlot
-- ============================================================
CREATE TABLE IF NOT EXISTS `DeliverySlot` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `startTime` VARCHAR(191) NOT NULL,
    `endTime` VARCHAR(191) NOT NULL,
    `capacity` INTEGER NOT NULL DEFAULT 0,
    `remainingCapacity` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('ACTIVE', 'INACTIVE', 'DRAFT') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: Order
-- ============================================================
CREATE TABLE IF NOT EXISTS `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderNumber` VARCHAR(191) NOT NULL,
    `customerId` INTEGER NULL,
    `billingAddressId` INTEGER NOT NULL,
    `shippingAddressId` INTEGER NOT NULL,
    `orderDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `orderType` ENUM('ONLINE', 'OFFLINE', 'PHONE', 'B2B', 'B2C') NOT NULL DEFAULT 'ONLINE',
    `orderSource` ENUM('WEB', 'MOBILE', 'STORE', 'MARKETPLACE') NOT NULL DEFAULT 'WEB',
    `orderStatus` ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'PACKED', 'READY_TO_SHIP', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `paymentStatus` ENUM('PENDING', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `fulfillmentStatus` ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED') NOT NULL DEFAULT 'PENDING',
    `shippingMethodId` INTEGER NULL,
    `deliverySlotId` INTEGER NULL,
    `couponId` INTEGER NULL,
    `subtotal` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `discountAmount` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `couponDiscount` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `shippingCharge` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `taxAmount` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `roundOff` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `grandTotal` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'INR',
    `exchangeRate` DECIMAL(65, 30) NOT NULL DEFAULT 1,
    `remarks` TEXT NULL,
    `placedBy` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Order_orderNumber_key`(`orderNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: OrderItem
-- ============================================================
CREATE TABLE IF NOT EXISTS `OrderItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `variantId` INTEGER NULL,
    `sku` VARCHAR(191) NOT NULL,
    `productName` VARCHAR(191) NOT NULL,
    `variantName` VARCHAR(191) NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `unitPrice` DECIMAL(65, 30) NOT NULL,
    `discount` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `tax` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `netAmount` DECIMAL(65, 30) NOT NULL,
    `costPrice` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `profit` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `status` ENUM('ACTIVE', 'CANCELLED', 'RETURNED') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: Invoice
-- ============================================================
CREATE TABLE IF NOT EXISTS `Invoice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoiceNumber` VARCHAR(191) NOT NULL,
    `orderId` INTEGER NOT NULL,
    `invoiceDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `invoiceStatus` ENUM('DRAFT', 'ISSUED', 'PAID', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
    `gstAmount` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `cgst` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `sgst` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `igst` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `discount` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `roundOff` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `netAmount` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `invoicePdfUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Invoice_invoiceNumber_key`(`invoiceNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: ReturnRequest
-- ============================================================
CREATE TABLE IF NOT EXISTS `ReturnRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `returnNumber` VARCHAR(191) NOT NULL,
    `orderId` INTEGER NOT NULL,
    `reason` TEXT NULL,
    `requestedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `approvedDate` DATETIME(3) NULL,
    `rejectedDate` DATETIME(3) NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ReturnRequest_returnNumber_key`(`returnNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: Refund
-- ============================================================
CREATE TABLE IF NOT EXISTS `Refund` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `refundNumber` VARCHAR(191) NOT NULL,
    `orderId` INTEGER NOT NULL,
    `refundMode` ENUM('BANK_TRANSFER', 'WALLET', 'CREDIT_NOTE', 'OTHER') NOT NULL DEFAULT 'BANK_TRANSFER',
    `refundAmount` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `refundStatus` ENUM('PENDING', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `transactionReference` VARCHAR(191) NULL,
    `refundDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Refund_refundNumber_key`(`refundNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: Payment
-- ============================================================
CREATE TABLE IF NOT EXISTS `Payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `paymentNumber` VARCHAR(191) NOT NULL,
    `orderId` INTEGER NOT NULL,
    `customerId` INTEGER NULL,
    `gateway` ENUM('RAZORPAY', 'STRIPE', 'PAYPAL', 'CASHFREE', 'PHONEPE', 'PAYTM', 'OFFLINE') NOT NULL DEFAULT 'OFFLINE',
    `paymentMethod` ENUM('CASH_ON_DELIVERY', 'UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'WALLET', 'GIFT_CARD') NOT NULL DEFAULT 'CASH_ON_DELIVERY',
    `currency` VARCHAR(191) NOT NULL DEFAULT 'INR',
    `exchangeRate` DECIMAL(65, 30) NOT NULL DEFAULT 1,
    `amount` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `capturedAmount` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `refundedAmount` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `transactionReference` VARCHAR(191) NULL,
    `gatewayReference` VARCHAR(191) NULL,
    `gatewayOrderId` VARCHAR(191) NULL,
    `gatewayPaymentId` VARCHAR(191) NULL,
    `gatewaySignature` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'AUTHORIZED', 'CAPTURED', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED', 'PARTIALLY_REFUNDED', 'CHARGEBACK', 'EXPIRED') NOT NULL DEFAULT 'PENDING',
    `failureReason` TEXT NULL,
    `attemptCount` INTEGER NOT NULL DEFAULT 0,
    `paidAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Payment_paymentNumber_key`(`paymentNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- AddForeignKey constraints
-- ============================================================
ALTER TABLE `CustomerAddress` ADD CONSTRAINT `CustomerAddress_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `Order` ADD CONSTRAINT `Order_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `Order` ADD CONSTRAINT `Order_billingAddressId_fkey` FOREIGN KEY (`billingAddressId`) REFERENCES `CustomerAddress`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `Order` ADD CONSTRAINT `Order_shippingAddressId_fkey` FOREIGN KEY (`shippingAddressId`) REFERENCES `CustomerAddress`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `Order` ADD CONSTRAINT `Order_shippingMethodId_fkey` FOREIGN KEY (`shippingMethodId`) REFERENCES `ShippingMethod`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `Order` ADD CONSTRAINT `Order_deliverySlotId_fkey` FOREIGN KEY (`deliverySlotId`) REFERENCES `DeliverySlot`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `Order` ADD CONSTRAINT `Order_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `Coupon`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `ProductVariant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `ReturnRequest` ADD CONSTRAINT `ReturnRequest_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Refund` ADD CONSTRAINT `Refund_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
