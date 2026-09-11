-- Add the cart line-item table required by the guest and customer cart services.
CREATE TABLE IF NOT EXISTS `CartItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cartId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `variantId` INTEGER NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `unitPrice` DECIMAL(65, 30) NOT NULL,
    `discount` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `tax` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `total` DECIMAL(65, 30) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`),
    INDEX `CartItem_cartId_idx`(`cartId`),
    INDEX `CartItem_productId_idx`(`productId`),
    INDEX `CartItem_variantId_idx`(`variantId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `CartItem`
  ADD CONSTRAINT `CartItem_cartId_fkey`
  FOREIGN KEY (`cartId`) REFERENCES `cart`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `CartItem`
  ADD CONSTRAINT `CartItem_productId_fkey`
  FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `CartItem`
  ADD CONSTRAINT `CartItem_variantId_fkey`
  FOREIGN KEY (`variantId`) REFERENCES `productvariant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
