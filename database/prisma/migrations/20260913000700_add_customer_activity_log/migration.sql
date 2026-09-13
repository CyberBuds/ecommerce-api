-- CreateTable
CREATE TABLE `CustomerActivityLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `activityType` ENUM('LOGIN', 'LOGOUT', 'REGISTER', 'PROFILE_UPDATE', 'PASSWORD_CHANGE', 'WISHLIST', 'ORDERS', 'REVIEWS') NOT NULL,
    `referenceId` INTEGER NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CustomerActivityLog`
    ADD CONSTRAINT `CustomerActivityLog_customerId_fkey`
    FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;
