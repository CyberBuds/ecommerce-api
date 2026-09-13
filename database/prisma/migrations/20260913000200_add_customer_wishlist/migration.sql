-- CreateTable
CREATE TABLE `CustomerWishlist` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `variantId` INTEGER NULL,
    `addedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `CustomerWishlist_customerId_productId_variantId_key`
    ON `CustomerWishlist`(`customerId`, `productId`, `variantId`);

-- AddForeignKey
ALTER TABLE `CustomerWishlist`
    ADD CONSTRAINT `CustomerWishlist_customerId_fkey`
    FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerWishlist`
    ADD CONSTRAINT `CustomerWishlist_productId_fkey`
    FOREIGN KEY (`productId`) REFERENCES `product`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerWishlist`
    ADD CONSTRAINT `CustomerWishlist_variantId_fkey`
    FOREIGN KEY (`variantId`) REFERENCES `productvariant`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE;
