-- Add saved-cart support required by Cart relation queries.
CREATE TABLE IF NOT EXISTS `SavedCart` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `cartId` INTEGER NOT NULL,
    `name` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'DRAFT') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`),
    UNIQUE INDEX `SavedCart_cartId_key` (`cartId`),
    INDEX `SavedCart_customerId_idx` (`customerId`),

    CONSTRAINT `SavedCart_customerId_fkey`
      FOREIGN KEY (`customerId`) REFERENCES `customer` (`id`)
      ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT `SavedCart_cartId_fkey`
      FOREIGN KEY (`cartId`) REFERENCES `cart` (`id`)
      ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
