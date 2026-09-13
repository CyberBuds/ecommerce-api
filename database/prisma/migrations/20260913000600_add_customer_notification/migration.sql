-- CreateTable
CREATE TABLE `CustomerNotification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `channel` ENUM('EMAIL', 'SMS', 'WHATSAPP', 'PUSH') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'SENT', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `sentAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CustomerNotification`
    ADD CONSTRAINT `CustomerNotification_customerId_fkey`
    FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;
