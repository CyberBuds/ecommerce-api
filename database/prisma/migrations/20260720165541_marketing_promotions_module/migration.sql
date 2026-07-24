-- Marketing, Promotions & Engagement Module
-- Migration: marketing_promotions_module

-- ============================================================
-- Enums
-- ============================================================

-- Banner status

-- CreateEnum
CREATE TABLE IF NOT EXISTS `_MarketingEnums` (`id` INT PRIMARY KEY); -- placeholder for enum docs

-- ============================================================
-- CreateTable: Banner
-- ============================================================
CREATE TABLE IF NOT EXISTS `Banner` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bannerCode` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `subtitle` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `imageId` INTEGER NULL,
    `mobileImageId` INTEGER NULL,
    `buttonText` VARCHAR(191) NULL,
    `buttonUrl` VARCHAR(191) NULL,
    `position` VARCHAR(191) NOT NULL DEFAULT 'HOME_TOP',
    `priority` INTEGER NOT NULL DEFAULT 0,
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `displayOn` VARCHAR(191) NOT NULL DEFAULT 'BOTH',
    `status` ENUM('ACTIVE', 'INACTIVE', 'SCHEDULED', 'EXPIRED') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Banner_bannerCode_key`(`bannerCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: HomepageSection
-- ============================================================
CREATE TABLE IF NOT EXISTS `HomepageSection` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sectionCode` VARCHAR(191) NOT NULL,
    `sectionType` ENUM('HERO_SLIDER', 'FEATURED_PRODUCTS', 'TRENDING_PRODUCTS', 'NEW_ARRIVALS', 'BEST_SELLERS', 'RECENTLY_VIEWED', 'RECOMMENDED_PRODUCTS', 'BRANDS', 'CATEGORIES', 'TESTIMONIALS', 'INSTAGRAM_FEED', 'BLOG_SECTION') NOT NULL,
    `title` VARCHAR(191) NULL,
    `subtitle` VARCHAR(191) NULL,
    `configuration` TEXT NULL,
    `priority` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `HomepageSection_sectionCode_key`(`sectionCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: Campaign
-- ============================================================
CREATE TABLE IF NOT EXISTS `Campaign` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campaignCode` VARCHAR(191) NOT NULL,
    `campaignName` VARCHAR(191) NOT NULL,
    `campaignType` ENUM('EMAIL', 'SMS', 'WHATSAPP', 'PUSH_NOTIFICATION', 'FLASH_SALE', 'COMBO_OFFER', 'BUY_X_GET_Y', 'REFERRAL', 'ABANDONED_CART', 'POPUP', 'ANNOUNCEMENT') NOT NULL,
    `description` TEXT NULL,
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `budget` DECIMAL(10, 2) NULL,
    `priority` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED', 'SCHEDULED') NOT NULL DEFAULT 'DRAFT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Campaign_campaignCode_key`(`campaignCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: FlashSale
-- ============================================================
CREATE TABLE IF NOT EXISTS `FlashSale` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `saleName` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `products` TEXT NOT NULL,
    `discountType` ENUM('PERCENTAGE', 'FLAT') NOT NULL DEFAULT 'PERCENTAGE',
    `discountValue` DECIMAL(10, 2) NOT NULL,
    `maximumDiscount` DECIMAL(10, 2) NULL,
    `maxQtyPerCustomer` INTEGER NULL,
    `status` ENUM('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED', 'SCHEDULED') NOT NULL DEFAULT 'DRAFT',
    `campaignId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: DealOfTheDay
-- ============================================================
CREATE TABLE IF NOT EXISTS `DealOfTheDay` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `variantId` INTEGER NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `offerPrice` DECIMAL(10, 2) NOT NULL,
    `originalPrice` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED', 'SCHEDULED') NOT NULL DEFAULT 'ACTIVE',
    `campaignId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: ComboOffer
-- ============================================================
CREATE TABLE IF NOT EXISTS `ComboOffer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `offerName` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `products` TEXT NOT NULL,
    `bundlePrice` DECIMAL(10, 2) NOT NULL,
    `discountAmount` DECIMAL(10, 2) NULL,
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `status` ENUM('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED', 'SCHEDULED') NOT NULL DEFAULT 'ACTIVE',
    `campaignId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: BuyXGetYOffer
-- ============================================================
CREATE TABLE IF NOT EXISTS `BuyXGetYOffer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `offerName` VARCHAR(191) NOT NULL,
    `buyProductId` INTEGER NOT NULL,
    `buyQuantity` INTEGER NOT NULL,
    `getProductId` INTEGER NOT NULL,
    `getQuantity` INTEGER NOT NULL,
    `discountOnGet` DECIMAL(10, 2) NULL,
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `status` ENUM('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED', 'SCHEDULED') NOT NULL DEFAULT 'ACTIVE',
    `campaignId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: GiftCard
-- ============================================================
CREATE TABLE IF NOT EXISTS `GiftCard` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `giftCardCode` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `balance` DECIMAL(10, 2) NOT NULL,
    `purchasedBy` INTEGER NULL,
    `assignedTo` INTEGER NULL,
    `expiryDate` DATETIME(3) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'REDEEMED', 'EXPIRED', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `GiftCard_giftCardCode_key`(`giftCardCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: ReferralProgram
-- ============================================================
CREATE TABLE IF NOT EXISTS `ReferralProgram` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `referralCode` VARCHAR(191) NOT NULL,
    `referrerId` INTEGER NOT NULL,
    `refereeId` INTEGER NULL,
    `referrerReward` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `refereeReward` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `status` ENUM('PENDING', 'COMPLETED', 'EXPIRED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `completedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ReferralProgram_referralCode_key`(`referralCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: StoreCreditTransaction
-- ============================================================
CREATE TABLE IF NOT EXISTS `StoreCreditTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `creditAmount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `debitAmount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `balance` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `reason` VARCHAR(191) NOT NULL,
    `referenceType` VARCHAR(191) NULL,
    `referenceId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: NewsletterSubscriber
-- ============================================================
CREATE TABLE IF NOT EXISTS `NewsletterSubscriber` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `customerId` INTEGER NULL,
    `status` ENUM('ACTIVE', 'UNSUBSCRIBED', 'BOUNCED') NOT NULL DEFAULT 'ACTIVE',
    `subscribedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `unsubscribedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `NewsletterSubscriber_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: MarketingChannelCampaign
-- ============================================================
CREATE TABLE IF NOT EXISTS `MarketingChannelCampaign` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campaignId` INTEGER NOT NULL,
    `channel` ENUM('EMAIL', 'SMS', 'WHATSAPP', 'PUSH_NOTIFICATION') NOT NULL,
    `subject` VARCHAR(191) NULL,
    `content` TEXT NOT NULL,
    `scheduledAt` DATETIME(3) NULL,
    `sentAt` DATETIME(3) NULL,
    `totalSent` INTEGER NOT NULL DEFAULT 0,
    `totalDelivered` INTEGER NOT NULL DEFAULT 0,
    `totalOpened` INTEGER NOT NULL DEFAULT 0,
    `totalClicked` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED', 'SCHEDULED') NOT NULL DEFAULT 'DRAFT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: AbandonedCartRecovery
-- ============================================================
CREATE TABLE IF NOT EXISTS `AbandonedCartRecovery` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `cartId` INTEGER NULL,
    `reminderCount` INTEGER NOT NULL DEFAULT 0,
    `lastReminderAt` DATETIME(3) NULL,
    `recoveryStatus` ENUM('PENDING', 'RECOVERED', 'EXPIRED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AbandonedCartRecovery_cartId_key`(`cartId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: LandingPage
-- ============================================================
CREATE TABLE IF NOT EXISTS `LandingPage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(191) NOT NULL,
    `seoTitle` VARCHAR(191) NOT NULL,
    `seoDescription` TEXT NULL,
    `metaKeywords` VARCHAR(191) NULL,
    `canonicalUrl` VARCHAR(191) NULL,
    `bannerId` INTEGER NULL,
    `sections` TEXT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `LandingPage_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: AnnouncementBar
-- ============================================================
CREATE TABLE IF NOT EXISTS `AnnouncementBar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `message` TEXT NOT NULL,
    `linkText` VARCHAR(191) NULL,
    `linkUrl` VARCHAR(191) NULL,
    `backgroundColor` VARCHAR(191) NULL,
    `textColor` VARCHAR(191) NULL,
    `priority` INTEGER NOT NULL DEFAULT 0,
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SCHEDULED', 'EXPIRED') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: PopupCampaign
-- ============================================================
CREATE TABLE IF NOT EXISTS `PopupCampaign` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `popupType` ENUM('NEWSLETTER', 'OFFER', 'ANNOUNCEMENT', 'EXIT_INTENT', 'WELCOME') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NULL,
    `imageId` INTEGER NULL,
    `offerCode` VARCHAR(191) NULL,
    `displayRule` VARCHAR(191) NOT NULL DEFAULT 'ON_LOAD',
    `displayDelay` INTEGER NOT NULL DEFAULT 3,
    `frequency` VARCHAR(191) NOT NULL DEFAULT 'ONCE_PER_SESSION',
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SCHEDULED', 'EXPIRED') NOT NULL DEFAULT 'ACTIVE',
    `campaignId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: MarketingTag
-- ============================================================
CREATE TABLE IF NOT EXISTS `MarketingTag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tagName` VARCHAR(191) NOT NULL,
    `tagCode` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `color` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MarketingTag_tagCode_key`(`tagCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: CampaignAnalytics
-- ============================================================
CREATE TABLE IF NOT EXISTS `CampaignAnalytics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campaignId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `impressions` INTEGER NOT NULL DEFAULT 0,
    `clicks` INTEGER NOT NULL DEFAULT 0,
    `conversions` INTEGER NOT NULL DEFAULT 0,
    `revenue` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `cost` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: Customer
-- ============================================================
CREATE TABLE IF NOT EXISTS `Customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerCode` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `mobile` VARCHAR(191) NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER') NULL,
    `dateOfBirth` DATETIME(3) NULL,
    `anniversaryDate` DATETIME(3) NULL,
    `profileImage` VARCHAR(191) NULL,
    `referralCode` VARCHAR(191) NULL,
    `referredById` INTEGER NULL,
    `customerGroupId` INTEGER NULL,
    `walletBalance` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `loyaltyPoints` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    `isEmailVerified` BOOLEAN NOT NULL DEFAULT false,
    `isMobileVerified` BOOLEAN NOT NULL DEFAULT false,
    `lastLogin` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,

    UNIQUE INDEX `Customer_customerCode_key`(`customerCode`),
    UNIQUE INDEX `Customer_email_key`(`email`),
    UNIQUE INDEX `Customer_mobile_key`(`mobile`),
    UNIQUE INDEX `Customer_referralCode_key`(`referralCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: Cart
-- ============================================================
CREATE TABLE IF NOT EXISTS `Cart` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NULL,
    `sessionId` VARCHAR(191) NULL,
    `couponId` INTEGER NULL,
    `shippingMethodId` INTEGER NULL,
    `deliverySlotId` INTEGER NULL,
    `subtotal` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `discountAmount` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `couponDiscount` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `shippingCharge` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `taxAmount` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `totalAmount` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `status` ENUM('ACTIVE', 'SAVED', 'COMPLETED', 'ABANDONED') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,

    UNIQUE INDEX `Cart_sessionId_key`(`sessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- AddForeignKey constraints
-- ============================================================

ALTER TABLE `FlashSale` ADD CONSTRAINT `FlashSale_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `Campaign`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `DealOfTheDay` ADD CONSTRAINT `DealOfTheDay_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `DealOfTheDay` ADD CONSTRAINT `DealOfTheDay_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `ProductVariant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `DealOfTheDay` ADD CONSTRAINT `DealOfTheDay_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `Campaign`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `ComboOffer` ADD CONSTRAINT `ComboOffer_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `Campaign`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `BuyXGetYOffer` ADD CONSTRAINT `BuyXGetYOffer_buyProductId_fkey` FOREIGN KEY (`buyProductId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `BuyXGetYOffer` ADD CONSTRAINT `BuyXGetYOffer_getProductId_fkey` FOREIGN KEY (`getProductId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `BuyXGetYOffer` ADD CONSTRAINT `BuyXGetYOffer_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `Campaign`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `GiftCard` ADD CONSTRAINT `GiftCard_purchasedBy_fkey` FOREIGN KEY (`purchasedBy`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `GiftCard` ADD CONSTRAINT `GiftCard_assignedTo_fkey` FOREIGN KEY (`assignedTo`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `ReferralProgram` ADD CONSTRAINT `ReferralProgram_referrerId_fkey` FOREIGN KEY (`referrerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `ReferralProgram` ADD CONSTRAINT `ReferralProgram_refereeId_fkey` FOREIGN KEY (`refereeId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `StoreCreditTransaction` ADD CONSTRAINT `StoreCreditTransaction_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `NewsletterSubscriber` ADD CONSTRAINT `NewsletterSubscriber_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `MarketingChannelCampaign` ADD CONSTRAINT `MarketingChannelCampaign_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `Campaign`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `AbandonedCartRecovery` ADD CONSTRAINT `AbandonedCartRecovery_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `AbandonedCartRecovery` ADD CONSTRAINT `AbandonedCartRecovery_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `LandingPage` ADD CONSTRAINT `LandingPage_bannerId_fkey` FOREIGN KEY (`bannerId`) REFERENCES `Banner`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `PopupCampaign` ADD CONSTRAINT `PopupCampaign_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `Campaign`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `CampaignAnalytics` ADD CONSTRAINT `CampaignAnalytics_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `Campaign`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Drop placeholder table
DROP TABLE IF EXISTS `_MarketingEnums`;
