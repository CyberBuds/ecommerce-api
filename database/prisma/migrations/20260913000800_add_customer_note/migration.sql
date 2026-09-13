-- CreateTable
CREATE TABLE `CustomerNote` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `note` VARCHAR(191) NOT NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CustomerNote`
    ADD CONSTRAINT `CustomerNote_customerId_fkey`
    FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;
