ALTER TABLE `customer`
  ADD COLUMN `password` VARCHAR(191) NULL DEFAULT '' AFTER `mobile`;