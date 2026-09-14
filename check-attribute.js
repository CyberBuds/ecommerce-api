const { PrismaClient } = require("@prisma/client");
(async () => {
  const prisma = new PrismaClient();
  try {
    const attrCols = await prisma.$queryRawUnsafe("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'attribute'");
    console.log('ATTRIBUTE_COLS=' + JSON.stringify(attrCols));
    const groupCols = await prisma.$queryRawUnsafe("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'attributegroup'");
    console.log('GROUP_COLS=' + JSON.stringify(groupCols));
    const sample = await prisma.attribute.findFirst({ select: { groupId: true } });
    console.log('SAMPLE=' + JSON.stringify(sample));
  } catch (e) {
    console.error('ERROR=' + e.message);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
