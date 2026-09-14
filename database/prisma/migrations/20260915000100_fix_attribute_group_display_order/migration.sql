ALTER TABLE `attributegroup`
  ADD COLUMN `displayOrder` INTEGER NOT NULL DEFAULT 0 AFTER `slug`;
