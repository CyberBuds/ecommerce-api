-- Create media management table
CREATE TABLE `Media` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `fileName` VARCHAR(191) NOT NULL,
  `originalName` VARCHAR(191) NOT NULL,
  `extension` VARCHAR(191) NOT NULL,
  `mimeType` VARCHAR(191) NOT NULL,
  `fileSize` INTEGER NOT NULL,
  `width` INTEGER NULL,
  `height` INTEGER NULL,
  `duration` INTEGER NULL,
  `folder` VARCHAR(191) NULL,
  `storageProvider` VARCHAR(191) NOT NULL,
  `publicId` VARCHAR(191) NULL,
  `publicUrl` VARCHAR(191) NULL,
  `thumbnailUrl` VARCHAR(191) NULL,
  `uploadedBy` INTEGER NULL,
  `status` ENUM('UPLOADED','PROCESSING','FAILED','DELETED') NOT NULL DEFAULT 'UPLOADED',
  `isDeleted` BOOLEAN NOT NULL DEFAULT false,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;