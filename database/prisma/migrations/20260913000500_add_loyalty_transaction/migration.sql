-- CreateTable
CREATE TABLE `LoyaltyTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `type` ENUM('EARN', 'REDEEM', 'EXPIRE') NOT NULL,
    `points` INTEGER NOT NULL,
    `reference` VARCHAR(191) NULL,
    `remarks` VARCHAR(191) NULL,
    `balanceAfter` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LoyaltyTransaction`
    ADD CONSTRAINT `LoyaltyTransaction_customerId_fkey`
    FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;
