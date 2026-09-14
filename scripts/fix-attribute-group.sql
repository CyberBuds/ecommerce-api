ALTER TABLE `attributegroup`
  ADD COLUMN IF NOT EXISTS `displayOrder` INT NOT NULL DEFAULT 0 AFTER `slug`;
