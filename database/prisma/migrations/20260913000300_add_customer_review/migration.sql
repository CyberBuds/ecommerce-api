-- CreateTable
CREATE TABLE `CustomerReview` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `variantId` INTEGER NULL,
    `rating` INTEGER NOT NULL,
    `reviewTitle` VARCHAR(191) NOT NULL,
    `review` VARCHAR(191) NOT NULL,
    `images` JSON NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `approvedBy` INTEGER NULL,
    `approvedDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CustomerReview`
    ADD CONSTRAINT `CustomerReview_customerId_fkey`
    FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerReview`
    ADD CONSTRAINT `CustomerReview_productId_fkey`
    FOREIGN KEY (`productId`) REFERENCES `product`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerReview`
    ADD CONSTRAINT `CustomerReview_variantId_fkey`
    FOREIGN KEY (`variantId`) REFERENCES `productvariant`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE;
