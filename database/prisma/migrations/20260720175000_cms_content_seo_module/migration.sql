-- CMS, Content Management & SEO Module
-- Migration: cms_content_seo_module

-- ============================================================
-- CMS Page Status Enum → stored as VARCHAR in MySQL via Prisma
-- CreateTable: CmsPage
-- ============================================================
CREATE TABLE IF NOT EXISTS `CmsPage` (
    `id`               INTEGER NOT NULL AUTO_INCREMENT,
    `pageCode`         VARCHAR(191) NOT NULL,
    `title`            VARCHAR(191) NOT NULL,
    `slug`             VARCHAR(191) NOT NULL,
    `shortDescription` VARCHAR(191) NULL,
    `content`          LONGTEXT NULL,
    `featuredImageId`  INTEGER NULL,
    `template`         VARCHAR(191) NULL,
    `layout`           VARCHAR(191) NULL,
    `pageType`         ENUM('LANDING','CONTENT','HOME','CATEGORY','CUSTOM') NOT NULL DEFAULT 'CONTENT',
    `visibility`       ENUM('PUBLIC','PRIVATE','PASSWORD_PROTECTED') NOT NULL DEFAULT 'PUBLIC',
    `status`           ENUM('DRAFT','PUBLISHED','SCHEDULED','ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `publishedAt`      DATETIME(3) NULL,
    `createdBy`        INTEGER NULL,
    `updatedBy`        INTEGER NULL,
    `createdAt`        DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`        DATETIME(3) NOT NULL,

    UNIQUE INDEX `CmsPage_pageCode_key`(`pageCode`),
    UNIQUE INDEX `CmsPage_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: BlogCategory
-- ============================================================
CREATE TABLE IF NOT EXISTS `BlogCategory` (
    `id`           INTEGER NOT NULL AUTO_INCREMENT,
    `categoryName` VARCHAR(191) NOT NULL,
    `slug`         VARCHAR(191) NOT NULL,
    `description`  VARCHAR(191) NULL,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `status`       ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdAt`    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`    DATETIME(3) NOT NULL,

    UNIQUE INDEX `BlogCategory_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: BlogTag
-- ============================================================
CREATE TABLE IF NOT EXISTS `BlogTag` (
    `id`        INTEGER NOT NULL AUTO_INCREMENT,
    `tagName`   VARCHAR(191) NOT NULL,
    `slug`      VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `BlogTag_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: BlogPost
-- ============================================================
CREATE TABLE IF NOT EXISTS `BlogPost` (
    `id`              INTEGER NOT NULL AUTO_INCREMENT,
    `title`           VARCHAR(191) NOT NULL,
    `slug`            VARCHAR(191) NOT NULL,
    `excerpt`         VARCHAR(191) NULL,
    `content`         LONGTEXT NULL,
    `featuredImageId` INTEGER NULL,
    `authorId`        INTEGER NULL,
    `categoryId`      INTEGER NULL,
    `readingTime`     INTEGER NULL,
    `views`           INTEGER NOT NULL DEFAULT 0,
    `likes`           INTEGER NOT NULL DEFAULT 0,
    `commentsEnabled` BOOLEAN NOT NULL DEFAULT true,
    `status`          ENUM('DRAFT','PUBLISHED','SCHEDULED','ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `publishedAt`     DATETIME(3) NULL,
    `scheduledAt`     DATETIME(3) NULL,
    `createdBy`       INTEGER NULL,
    `updatedBy`       INTEGER NULL,
    `createdAt`       DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`       DATETIME(3) NOT NULL,

    UNIQUE INDEX `BlogPost_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: BlogPostTag (junction)
-- ============================================================
CREATE TABLE IF NOT EXISTS `BlogPostTag` (
    `postId` INTEGER NOT NULL,
    `tagId`  INTEGER NOT NULL,

    PRIMARY KEY (`postId`, `tagId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: Faq
-- ============================================================
CREATE TABLE IF NOT EXISTS `Faq` (
    `id`           INTEGER NOT NULL AUTO_INCREMENT,
    `question`     VARCHAR(191) NOT NULL,
    `answer`       LONGTEXT NOT NULL,
    `category`     VARCHAR(191) NULL,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `status`       ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdBy`    INTEGER NULL,
    `updatedBy`    INTEGER NULL,
    `createdAt`    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`    DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: Testimonial
-- ============================================================
CREATE TABLE IF NOT EXISTS `Testimonial` (
    `id`           INTEGER NOT NULL AUTO_INCREMENT,
    `customerName` VARCHAR(191) NOT NULL,
    `designation`  VARCHAR(191) NULL,
    `company`      VARCHAR(191) NULL,
    `imageId`      INTEGER NULL,
    `review`       TEXT NOT NULL,
    `rating`       INTEGER NOT NULL DEFAULT 5,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `status`       ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdBy`    INTEGER NULL,
    `updatedBy`    INTEGER NULL,
    `createdAt`    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`    DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: Lookbook
-- ============================================================
CREATE TABLE IF NOT EXISTS `Lookbook` (
    `id`             INTEGER NOT NULL AUTO_INCREMENT,
    `collectionName` VARCHAR(191) NOT NULL,
    `season`         VARCHAR(191) NULL,
    `description`    TEXT NULL,
    `bannerImageId`  INTEGER NULL,
    `galleryImages`  JSON NULL,
    `status`         ENUM('DRAFT','ACTIVE','ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `publishedAt`    DATETIME(3) NULL,
    `createdBy`      INTEGER NULL,
    `updatedBy`      INTEGER NULL,
    `createdAt`      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`      DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: StyleGuide
-- ============================================================
CREATE TABLE IF NOT EXISTS `StyleGuide` (
    `id`          INTEGER NOT NULL AUTO_INCREMENT,
    `guideName`   VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `images`      JSON NULL,
    `products`    JSON NULL,
    `status`      ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdBy`   INTEGER NULL,
    `updatedBy`   INTEGER NULL,
    `createdAt`   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`   DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: SizeGuide
-- ============================================================
CREATE TABLE IF NOT EXISTS `SizeGuide` (
    `id`              INTEGER NOT NULL AUTO_INCREMENT,
    `category`        VARCHAR(191) NOT NULL,
    `brand`           VARCHAR(191) NULL,
    `measurementUnit` VARCHAR(191) NOT NULL DEFAULT 'cm',
    `chart`           JSON NOT NULL,
    `images`          JSON NULL,
    `status`          ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdBy`       INTEGER NULL,
    `updatedBy`       INTEGER NULL,
    `createdAt`       DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`       DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: Policy
-- ============================================================
CREATE TABLE IF NOT EXISTS `Policy` (
    `id`         INTEGER NOT NULL AUTO_INCREMENT,
    `policyType` ENUM('PRIVACY_POLICY','TERMS_AND_CONDITIONS','REFUND_POLICY','SHIPPING_POLICY','CANCELLATION_POLICY','COOKIE_POLICY') NOT NULL,
    `title`      VARCHAR(191) NOT NULL,
    `content`    LONGTEXT NOT NULL,
    `isActive`   BOOLEAN NOT NULL DEFAULT true,
    `updatedBy`  INTEGER NULL,
    `createdAt`  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`  DATETIME(3) NOT NULL,

    UNIQUE INDEX `Policy_policyType_key`(`policyType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: ContactInfo
-- ============================================================
CREATE TABLE IF NOT EXISTS `ContactInfo` (
    `id`            INTEGER NOT NULL AUTO_INCREMENT,
    `companyName`   VARCHAR(191) NOT NULL,
    `address`       TEXT NULL,
    `phone`         VARCHAR(191) NULL,
    `email`         VARCHAR(191) NULL,
    `whatsapp`      VARCHAR(191) NULL,
    `googleMapUrl`  VARCHAR(191) NULL,
    `businessHours` JSON NULL,
    `isActive`      BOOLEAN NOT NULL DEFAULT true,
    `updatedBy`     INTEGER NULL,
    `createdAt`     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`     DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: ContactInquiry
-- ============================================================
CREATE TABLE IF NOT EXISTS `ContactInquiry` (
    `id`           INTEGER NOT NULL AUTO_INCREMENT,
    `customerName` VARCHAR(191) NOT NULL,
    `email`        VARCHAR(191) NOT NULL,
    `mobile`       VARCHAR(191) NULL,
    `subject`      VARCHAR(191) NOT NULL,
    `message`      TEXT NOT NULL,
    `attachmentId` INTEGER NULL,
    `status`       ENUM('NEW','ASSIGNED','IN_PROGRESS','RESOLVED','CLOSED') NOT NULL DEFAULT 'NEW',
    `assignedTo`   INTEGER NULL,
    `resolvedAt`   DATETIME(3) NULL,
    `createdAt`    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`    DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: DynamicMenu
-- ============================================================
CREATE TABLE IF NOT EXISTS `DynamicMenu` (
    `id`           INTEGER NOT NULL AUTO_INCREMENT,
    `menuCode`     VARCHAR(191) NOT NULL,
    `menuType`     ENUM('HEADER','MEGA','FOOTER','MOBILE') NOT NULL,
    `title`        VARCHAR(191) NOT NULL,
    `items`        JSON NOT NULL,
    `isActive`     BOOLEAN NOT NULL DEFAULT true,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `createdBy`    INTEGER NULL,
    `updatedBy`    INTEGER NULL,
    `createdAt`    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`    DATETIME(3) NOT NULL,

    UNIQUE INDEX `DynamicMenu_menuCode_key`(`menuCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: FooterConfig
-- ============================================================
CREATE TABLE IF NOT EXISTS `FooterConfig` (
    `id`          INTEGER NOT NULL AUTO_INCREMENT,
    `configCode`  VARCHAR(191) NOT NULL,
    `columns`     JSON NULL,
    `quickLinks`  JSON NULL,
    `categories`  JSON NULL,
    `services`    JSON NULL,
    `newsletter`  JSON NULL,
    `copyright`   VARCHAR(191) NULL,
    `isActive`    BOOLEAN NOT NULL DEFAULT true,
    `updatedBy`   INTEGER NULL,
    `createdAt`   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`   DATETIME(3) NOT NULL,

    UNIQUE INDEX `FooterConfig_configCode_key`(`configCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: SocialMediaLink
-- ============================================================
CREATE TABLE IF NOT EXISTS `SocialMediaLink` (
    `id`        INTEGER NOT NULL AUTO_INCREMENT,
    `platform`  VARCHAR(191) NOT NULL,
    `url`       VARCHAR(191) NOT NULL,
    `iconClass` VARCHAR(191) NULL,
    `isActive`  BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SocialMediaLink_platform_key`(`platform`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: SeoMeta
-- ============================================================
CREATE TABLE IF NOT EXISTS `SeoMeta` (
    `id`           INTEGER NOT NULL AUTO_INCREMENT,
    `pageType`     ENUM('HOME','PRODUCT','CATEGORY','BLOG','CMS_PAGE','LANDING_PAGE','BRAND','CUSTOM') NOT NULL,
    `referenceId`  INTEGER NULL,
    `slug`         VARCHAR(191) NULL,
    `metaTitle`    VARCHAR(191) NULL,
    `metaDesc`     TEXT NULL,
    `metaKeywords` VARCHAR(191) NULL,
    `canonicalUrl` VARCHAR(191) NULL,
    `robotsMeta`   VARCHAR(191) NULL DEFAULT 'index, follow',
    `ogTitle`      VARCHAR(191) NULL,
    `ogDescription` TEXT NULL,
    `ogImageId`    INTEGER NULL,
    `twitterTitle` VARCHAR(191) NULL,
    `twitterDesc`  TEXT NULL,
    `twitterCard`  VARCHAR(191) NULL DEFAULT 'summary_large_image',
    `schemaJson`   JSON NULL,
    `cmsPageId`    INTEGER NULL,
    `blogPostId`   INTEGER NULL,
    `createdAt`    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`    DATETIME(3) NOT NULL,

    UNIQUE INDEX `SeoMeta_slug_key`(`slug`),
    UNIQUE INDEX `SeoMeta_cmsPageId_key`(`cmsPageId`),
    UNIQUE INDEX `SeoMeta_blogPostId_key`(`blogPostId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: SitemapEntry
-- ============================================================
CREATE TABLE IF NOT EXISTS `SitemapEntry` (
    `id`           INTEGER NOT NULL AUTO_INCREMENT,
    `url`          VARCHAR(191) NOT NULL,
    `changeFreq`   VARCHAR(191) NOT NULL DEFAULT 'weekly',
    `priority`     DOUBLE NOT NULL DEFAULT 0.5,
    `lastModified` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isActive`     BOOLEAN NOT NULL DEFAULT true,
    `createdAt`    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`    DATETIME(3) NOT NULL,

    UNIQUE INDEX `SitemapEntry_url_key`(`url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: RobotsConfig
-- ============================================================
CREATE TABLE IF NOT EXISTS `RobotsConfig` (
    `id`        INTEGER NOT NULL AUTO_INCREMENT,
    `content`   TEXT NOT NULL,
    `isActive`  BOOLEAN NOT NULL DEFAULT true,
    `updatedBy` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: Redirect
-- ============================================================
CREATE TABLE IF NOT EXISTS `Redirect` (
    `id`             INTEGER NOT NULL AUTO_INCREMENT,
    `sourceUrl`      VARCHAR(191) NOT NULL,
    `destinationUrl` VARCHAR(191) NOT NULL,
    `redirectType`   ENUM('PERMANENT_301','TEMPORARY_302') NOT NULL DEFAULT 'PERMANENT_301',
    `hitCount`       INTEGER NOT NULL DEFAULT 0,
    `isActive`       BOOLEAN NOT NULL DEFAULT true,
    `createdBy`      INTEGER NULL,
    `updatedBy`      INTEGER NULL,
    `createdAt`      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`      DATETIME(3) NOT NULL,

    UNIQUE INDEX `Redirect_sourceUrl_key`(`sourceUrl`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: UrlRewrite
-- ============================================================
CREATE TABLE IF NOT EXISTS `UrlRewrite` (
    `id`        INTEGER NOT NULL AUTO_INCREMENT,
    `oldUrl`    VARCHAR(191) NOT NULL,
    `newUrl`    VARCHAR(191) NOT NULL,
    `isActive`  BOOLEAN NOT NULL DEFAULT true,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UrlRewrite_oldUrl_key`(`oldUrl`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: ContentVersion
-- ============================================================
CREATE TABLE IF NOT EXISTS `ContentVersion` (
    `id`         INTEGER NOT NULL AUTO_INCREMENT,
    `entityType` VARCHAR(191) NOT NULL,
    `entityId`   INTEGER NOT NULL,
    `version`    INTEGER NOT NULL,
    `content`    JSON NOT NULL,
    `status`     ENUM('DRAFT','PUBLISHED','ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `changedBy`  INTEGER NULL,
    `changedAt`  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cmsPageId`  INTEGER NULL,
    `blogPostId` INTEGER NULL,
    `policyId`   INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- AddForeignKey constraints
-- ============================================================

ALTER TABLE `BlogPost`
    ADD CONSTRAINT `BlogPost_categoryId_fkey`
    FOREIGN KEY (`categoryId`) REFERENCES `BlogCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `BlogPostTag`
    ADD CONSTRAINT `BlogPostTag_postId_fkey`
    FOREIGN KEY (`postId`) REFERENCES `BlogPost`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `BlogPostTag`
    ADD CONSTRAINT `BlogPostTag_tagId_fkey`
    FOREIGN KEY (`tagId`) REFERENCES `BlogTag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `SeoMeta`
    ADD CONSTRAINT `SeoMeta_cmsPageId_fkey`
    FOREIGN KEY (`cmsPageId`) REFERENCES `CmsPage`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `SeoMeta`
    ADD CONSTRAINT `SeoMeta_blogPostId_fkey`
    FOREIGN KEY (`blogPostId`) REFERENCES `BlogPost`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `ContentVersion`
    ADD CONSTRAINT `ContentVersion_cmsPageId_fkey`
    FOREIGN KEY (`cmsPageId`) REFERENCES `CmsPage`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `ContentVersion`
    ADD CONSTRAINT `ContentVersion_blogPostId_fkey`
    FOREIGN KEY (`blogPostId`) REFERENCES `BlogPost`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `ContentVersion`
    ADD CONSTRAINT `ContentVersion_policyId_fkey`
    FOREIGN KEY (`policyId`) REFERENCES `Policy`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
