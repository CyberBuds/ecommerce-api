-- Auth & User Module
-- Migration: auth_user_module

-- ============================================================
-- CreateTable: Permission
-- ============================================================
CREATE TABLE IF NOT EXISTS `Permission` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `resource` VARCHAR(191) NOT NULL,
  `action` VARCHAR(50) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  UNIQUE INDEX `Permission_resource_action_key`(`resource`, `action`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: Role
-- ============================================================
CREATE TABLE IF NOT EXISTS `Role` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `description` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  UNIQUE INDEX `Role_name_key`(`name`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: RolePermission
-- ============================================================
CREATE TABLE IF NOT EXISTS `RolePermission` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `roleId` INTEGER NOT NULL,
  `permissionId` INTEGER NOT NULL,

  UNIQUE INDEX `RolePermission_roleId_permissionId_key`(`roleId`, `permissionId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: User
-- ============================================================
CREATE TABLE IF NOT EXISTS `User` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `employeeCode` VARCHAR(191) NULL,
  `firstName` VARCHAR(191) NOT NULL,
  `lastName` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `mobile` VARCHAR(191) NULL,
  `password` VARCHAR(191) NOT NULL,
  `profileImage` VARCHAR(191) NULL,
  `gender` ENUM('MALE','FEMALE','OTHER') NULL,
  `dateOfBirth` DATETIME(3) NULL,
  `roleId` INTEGER NULL,
  `status` ENUM('ACTIVE','INACTIVE','SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `isLocked` BOOLEAN NOT NULL DEFAULT false,
  `lastLogin` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  `createdBy` INTEGER NULL,
  `updatedBy` INTEGER NULL,

  UNIQUE INDEX `User_employeeCode_key`(`employeeCode`),
  UNIQUE INDEX `User_email_key`(`email`),
  UNIQUE INDEX `User_mobile_key`(`mobile`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- CreateTable: RefreshToken
-- ============================================================
CREATE TABLE IF NOT EXISTS `RefreshToken` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `token` VARCHAR(191) NOT NULL,
  `userId` INTEGER NOT NULL,
  `revoked` BOOLEAN NOT NULL DEFAULT false,
  `expiresAt` DATETIME(3) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  UNIQUE INDEX `RefreshToken_token_key`(`token`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- AddForeignKey constraints
-- ============================================================
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `RefreshToken` ADD CONSTRAINT `RefreshToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

