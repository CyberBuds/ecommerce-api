-- Prisma models use lowercase mapped table names. MySQL on Linux treats table
-- names as case-sensitive, so normalize the tables created by the prior migration.
RENAME TABLE `Collection` TO `collection`;
RENAME TABLE `ProductType` TO `producttype`;
RENAME TABLE `AttributeGroup` TO `attributegroup`;
