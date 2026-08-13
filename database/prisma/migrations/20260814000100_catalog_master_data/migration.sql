CREATE TABLE IF NOT EXISTS `AttributeGroup` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `code` VARCHAR(191) NOT NULL,
  `description` VARCHAR(191) NULL,
  `slug` VARCHAR(191) NOT NULL,
  `status` ENUM('ACTIVE','INACTIVE','DRAFT') NOT NULL DEFAULT 'ACTIVE',
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `isDeleted` BOOLEAN NOT NULL DEFAULT false,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  `createdBy` INTEGER NULL,
  `updatedBy` INTEGER NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `AttributeGroup_code_key`(`code`),
  UNIQUE INDEX `AttributeGroup_slug_key`(`slug`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Collection` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `code` VARCHAR(191) NOT NULL,
  `description` VARCHAR(191) NULL,
  `slug` VARCHAR(191) NOT NULL,
  `image` VARCHAR(191) NULL,
  `displayOrder` INTEGER NOT NULL DEFAULT 0,
  `status` ENUM('ACTIVE','INACTIVE','DRAFT') NOT NULL DEFAULT 'ACTIVE',
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `isDeleted` BOOLEAN NOT NULL DEFAULT false,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  `createdBy` INTEGER NULL,
  `updatedBy` INTEGER NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Collection_code_key`(`code`),
  UNIQUE INDEX `Collection_slug_key`(`slug`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ProductType` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `code` VARCHAR(191) NOT NULL,
  `description` VARCHAR(191) NULL,
  `slug` VARCHAR(191) NOT NULL,
  `image` VARCHAR(191) NULL,
  `displayOrder` INTEGER NOT NULL DEFAULT 0,
  `status` ENUM('ACTIVE','INACTIVE','DRAFT') NOT NULL DEFAULT 'ACTIVE',
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `isDeleted` BOOLEAN NOT NULL DEFAULT false,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  `createdBy` INTEGER NULL,
  `updatedBy` INTEGER NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `ProductType_code_key`(`code`),
  UNIQUE INDEX `ProductType_slug_key`(`slug`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `attribute` ADD COLUMN `groupId` INTEGER NULL;
ALTER TABLE `attribute` ADD CONSTRAINT `attribute_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `AttributeGroup`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `attributevalue` ADD COLUMN `extra` VARCHAR(191) NULL;
