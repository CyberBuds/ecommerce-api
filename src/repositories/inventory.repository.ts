import prisma from '../helpers/prisma';
import { buildPagination } from '../utils/pagination';
import { InventoryListQuery, PurchaseOrderListQuery, GoodsReceiptNoteListQuery, StockAdjustmentListQuery, StockTransferListQuery, StockMovementListQuery, WarehouseListQuery, SupplierListQuery } from '../interfaces/inventory.dto';

const db = prisma as any;

export default class InventoryRepository {
  async findWarehouseByCode(code: string, excludeId?: number) {
    const where: any = { warehouseCode: code };
    if (excludeId) where.NOT = { id: excludeId };
    return db.warehouse.findFirst({ where });
  }

  async findWarehouseById(id: number) {
    return db.warehouse.findUnique({ where: { id } });
  }

  async createWarehouse(data: Record<string, unknown>) {
    return db.warehouse.create({ data });
  }

  async updateWarehouse(id: number, data: Record<string, unknown>) {
    return db.warehouse.update({ where: { id }, data });
  }

  async deleteWarehouse(id: number) {
    return db.warehouse.delete({ where: { id } });
  }

  async listWarehouses(query: WarehouseListQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (query.search) {
      where.OR = [
        { warehouseCode: { contains: query.search, mode: 'insensitive' } },
        { warehouseName: { contains: query.search, mode: 'insensitive' } },
        { contactPerson: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    const sortBy = query.sortBy && ['warehouseName', 'warehouseCode', 'status', 'createdAt', 'updatedAt'].includes(query.sortBy) ? query.sortBy : 'createdAt';
    orderBy[sortBy] = query.sortOrder === 'desc' ? 'desc' : 'asc';

    const [items, total] = await Promise.all([
      db.warehouse.findMany({ where, orderBy, skip, take: pageSize }),
      db.warehouse.count({ where })
    ]);

    return { items, ...buildPagination(page, pageSize, total) };
  }

  async findSupplierByCode(code: string, excludeId?: number) {
    const where: any = { supplierCode: code };
    if (excludeId) where.NOT = { id: excludeId };
    return db.supplier.findFirst({ where });
  }

  async findSupplierById(id: number) {
    return db.supplier.findUnique({ where: { id } });
  }

  async createSupplier(data: Record<string, unknown>) {
    return db.supplier.create({ data });
  }

  async updateSupplier(id: number, data: Record<string, unknown>) {
    return db.supplier.update({ where: { id }, data });
  }

  async deleteSupplier(id: number) {
    return db.supplier.delete({ where: { id } });
  }

  async listSuppliers(query: SupplierListQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (query.search) {
      where.OR = [
        { supplierCode: { contains: query.search, mode: 'insensitive' } },
        { supplierName: { contains: query.search, mode: 'insensitive' } },
        { contactPerson: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    const sortBy = query.sortBy && ['supplierName', 'supplierCode', 'status', 'createdAt', 'updatedAt'].includes(query.sortBy) ? query.sortBy : 'createdAt';
    orderBy[sortBy] = query.sortOrder === 'desc' ? 'desc' : 'asc';

    const [items, total] = await Promise.all([
      db.supplier.findMany({ where, orderBy, skip, take: pageSize }),
      db.supplier.count({ where })
    ]);

    return { items, ...buildPagination(page, pageSize, total) };
  }

  async findInventoryById(id: number) {
    return db.inventory.findUnique({ where: { id } });
  }

  async findInventoryRecord(productId: number, variantId: number | null, warehouseId: number) {
    return db.inventory.findFirst({ where: { productId, variantId, warehouseId } });
  }

  async findInventoryByProductVariant(productId: number, variantId: number | null) {
    return db.inventory.findFirst({ where: { productId, variantId } });
  }

  async createInventory(data: Record<string, unknown>) {
    return db.inventory.create({ data });
  }

  async updateInventory(id: number, data: Record<string, unknown>) {
    return db.inventory.update({ where: { id }, data });
  }

  async listInventory(query: InventoryListQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (query.search) {
      where.OR = [
        { product: { productName: { contains: query.search, mode: 'insensitive' } } },
        { product: { productCode: { contains: query.search, mode: 'insensitive' } } },
        { warehouse: { warehouseName: { contains: query.search, mode: 'insensitive' } } }
      ];
    }

    if (query.productId) {
      where.productId = query.productId;
    }

    if (query.variantId) {
      where.variantId = query.variantId;
    }

    if (query.warehouseId) {
      where.warehouseId = query.warehouseId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.minStock !== undefined || query.maxStock !== undefined) {
      where.currentStock = {} as Record<string, unknown>;
      if (query.minStock !== undefined) {
        (where.currentStock as any).gte = query.minStock;
      }
      if (query.maxStock !== undefined) {
        (where.currentStock as any).lte = query.maxStock;
      }
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    const sortBy = query.sortBy && ['currentStock', 'availableStock', 'minimumStock', 'updatedAt', 'createdAt'].includes(query.sortBy)
      ? query.sortBy
      : 'updatedAt';
    orderBy[sortBy] = query.sortOrder === 'desc' ? 'desc' : 'asc';

    const [items, total] = await Promise.all([
      db.inventory.findMany({ where, orderBy, skip, take: pageSize }),
      db.inventory.count({ where })
    ]);

    return { items, ...buildPagination(page, pageSize, total) };
  }

  async reserveInventory(id: number, quantity: number, action: 'RESERVE' | 'RELEASE') {
    const inventory = await this.findInventoryById(id);
    if (!inventory) return null;
    const reservedStock = action === 'RESERVE' ? inventory.reservedStock + quantity : Math.max(0, inventory.reservedStock - quantity);
    const availableStock = Math.max(0, inventory.currentStock - reservedStock);
    return db.inventory.update({ where: { id }, data: { reservedStock, availableStock } });
  }

  async createStockMovement(data: Record<string, unknown>) {
    return db.stockMovement.create({ data });
  }

  async findStockMovementById(id: number) {
    return db.stockMovement.findUnique({ where: { id } });
  }

  async listStockMovements(query: StockMovementListQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (query.productId) where.productId = query.productId;
    if (query.variantId) where.variantId = query.variantId;
    if (query.warehouseId) where.warehouseId = query.warehouseId;
    if (query.movementType) where.movementType = query.movementType;
    if (query.referenceNumber) {
      where.referenceNumber = { contains: query.referenceNumber, mode: 'insensitive' };
    }
    if (query.dateFrom || query.dateTo) {
      where.date = {} as Record<string, unknown>;
      if (query.dateFrom) (where.date as any).gte = new Date(query.dateFrom);
      if (query.dateTo) (where.date as any).lte = new Date(query.dateTo);
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    const sortBy = query.sortBy && ['date', 'quantity', 'createdAt', 'updatedAt'].includes(query.sortBy) ? query.sortBy : 'date';
    orderBy[sortBy] = query.sortOrder === 'desc' ? 'desc' : 'asc';

    const [items, total] = await Promise.all([
      db.stockMovement.findMany({ where, orderBy, skip, take: pageSize }),
      db.stockMovement.count({ where })
    ]);

    return { items, ...buildPagination(page, pageSize, total) };
  }

  async findPurchaseOrderByNumber(poNumber: string, excludeId?: number) {
    const where: any = { poNumber };
    if (excludeId) where.NOT = { id: excludeId };
    return db.purchaseOrder.findFirst({ where });
  }

  async findPurchaseOrderById(id: number) {
    return db.purchaseOrder.findUnique({ where: { id }, include: { items: true, grns: true, supplier: true } });
  }

  async createPurchaseOrder(data: Record<string, unknown>) {
    return db.purchaseOrder.create({ data: { ...data, items: { create: (data as any).items } }, include: { items: true, supplier: true, grns: true } });
  }

  async updatePurchaseOrder(id: number, data: Record<string, unknown>) {
    const payload: any = { ...data };
    if (payload.items) {
      await db.purchaseOrderItem.deleteMany({ where: { purchaseOrderId: id } });
      payload.items = { create: payload.items };
    }
    return db.purchaseOrder.update({ where: { id }, data: payload, include: { items: true, supplier: true, grns: true } });
  }

  async deletePurchaseOrder(id: number) {
    await db.purchaseOrderItem.deleteMany({ where: { purchaseOrderId: id } });
    return db.purchaseOrder.delete({ where: { id } });
  }

  async listPurchaseOrders(query: PurchaseOrderListQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (query.supplierId) where.supplierId = query.supplierId;
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { poNumber: { contains: query.search, mode: 'insensitive' } },
        { remarks: { contains: query.search, mode: 'insensitive' } }
      ];
    }
    if (query.dateFrom || query.dateTo) {
      where.orderDate = {} as Record<string, unknown>;
      if (query.dateFrom) (where.orderDate as any).gte = new Date(query.dateFrom);
      if (query.dateTo) (where.orderDate as any).lte = new Date(query.dateTo);
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    const sortBy = query.sortBy && ['orderDate', 'expectedDate', 'status', 'createdAt', 'updatedAt'].includes(query.sortBy) ? query.sortBy : 'orderDate';
    orderBy[sortBy] = query.sortOrder === 'desc' ? 'desc' : 'asc';

    const [items, total] = await Promise.all([
      db.purchaseOrder.findMany({ where, orderBy, skip, take: pageSize, include: { items: true, supplier: true } }),
      db.purchaseOrder.count({ where })
    ]);

    return { items, ...buildPagination(page, pageSize, total) };
  }

  async findGoodsReceiptNoteById(id: number) {
    return db.goodsReceiptNote.findUnique({ where: { id }, include: { items: true, purchaseOrder: true } });
  }

  async createGoodsReceiptNote(data: Record<string, unknown>) {
    return db.goodsReceiptNote.create({ data: { ...data, items: { create: (data as any).items } }, include: { items: true, purchaseOrder: true } });
  }

  async updateGoodsReceiptNote(id: number, data: Record<string, unknown>) {
    const payload: any = { ...data };
    if (payload.items) {
      await db.goodsReceiptNoteItem.deleteMany({ where: { grnId: id } });
      payload.items = { create: payload.items };
    }
    return db.goodsReceiptNote.update({ where: { id }, data: payload, include: { items: true, purchaseOrder: true } });
  }

  async deleteGoodsReceiptNote(id: number) {
    await db.goodsReceiptNoteItem.deleteMany({ where: { grnId: id } });
    return db.goodsReceiptNote.delete({ where: { id } });
  }

  async listGoodsReceiptNotes(query: GoodsReceiptNoteListQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (query.purchaseOrderId) where.purchaseOrderId = query.purchaseOrderId;
    if (query.status) where.status = query.status;
    if (query.dateFrom || query.dateTo) {
      where.receivedDate = {} as Record<string, unknown>;
      if (query.dateFrom) (where.receivedDate as any).gte = new Date(query.dateFrom);
      if (query.dateTo) (where.receivedDate as any).lte = new Date(query.dateTo);
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    const sortBy = query.sortBy && ['receivedDate', 'status', 'createdAt', 'updatedAt'].includes(query.sortBy) ? query.sortBy : 'receivedDate';
    orderBy[sortBy] = query.sortOrder === 'desc' ? 'desc' : 'asc';

    const [items, total] = await Promise.all([
      db.goodsReceiptNote.findMany({ where, orderBy, skip, take: pageSize, include: { items: true, purchaseOrder: true } }),
      db.goodsReceiptNote.count({ where })
    ]);

    return { items, ...buildPagination(page, pageSize, total) };
  }

  async findStockAdjustmentById(id: number) {
    return db.stockAdjustment.findUnique({ where: { id } });
  }

  async createStockAdjustment(data: Record<string, unknown>) {
    return db.stockAdjustment.create({ data });
  }

  async updateStockAdjustment(id: number, data: Record<string, unknown>) {
    return db.stockAdjustment.update({ where: { id }, data });
  }

  async deleteStockAdjustment(id: number) {
    return db.stockAdjustment.delete({ where: { id } });
  }

  async listStockAdjustments(query: StockAdjustmentListQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (query.warehouseId) where.warehouseId = query.warehouseId;
    if (query.productId) where.productId = query.productId;
    if (query.variantId) where.variantId = query.variantId;
    if (query.status) where.status = query.status;
    if (query.dateFrom || query.dateTo) {
      where.createdAt = {} as Record<string, unknown>;
      if (query.dateFrom) (where.createdAt as any).gte = new Date(query.dateFrom);
      if (query.dateTo) (where.createdAt as any).lte = new Date(query.dateTo);
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    const sortBy = query.sortBy && ['createdAt', 'status', 'updatedAt'].includes(query.sortBy) ? query.sortBy : 'createdAt';
    orderBy[sortBy] = query.sortOrder === 'desc' ? 'desc' : 'asc';

    const [items, total] = await Promise.all([
      db.stockAdjustment.findMany({ where, orderBy, skip, take: pageSize }),
      db.stockAdjustment.count({ where })
    ]);

    return { items, ...buildPagination(page, pageSize, total) };
  }

  async findStockTransferById(id: number) {
    return db.stockTransfer.findUnique({ where: { id } });
  }

  async createStockTransfer(data: Record<string, unknown>) {
    return db.stockTransfer.create({ data });
  }

  async updateStockTransfer(id: number, data: Record<string, unknown>) {
    return db.stockTransfer.update({ where: { id }, data });
  }

  async deleteStockTransfer(id: number) {
    return db.stockTransfer.delete({ where: { id } });
  }

  async listStockTransfers(query: StockTransferListQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (query.sourceWarehouseId) where.sourceWarehouseId = query.sourceWarehouseId;
    if (query.destinationWarehouseId) where.destinationWarehouseId = query.destinationWarehouseId;
    if (query.productId) where.productId = query.productId;
    if (query.variantId) where.variantId = query.variantId;
    if (query.status) where.status = query.status;
    if (query.dateFrom || query.dateTo) {
      where.createdAt = {} as Record<string, unknown>;
      if (query.dateFrom) (where.createdAt as any).gte = new Date(query.dateFrom);
      if (query.dateTo) (where.createdAt as any).lte = new Date(query.dateTo);
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    const sortBy = query.sortBy && ['createdAt', 'status', 'updatedAt'].includes(query.sortBy) ? query.sortBy : 'createdAt';
    orderBy[sortBy] = query.sortOrder === 'desc' ? 'desc' : 'asc';

    const [items, total] = await Promise.all([
      db.stockTransfer.findMany({ where, orderBy, skip, take: pageSize }),
      db.stockTransfer.count({ where })
    ]);

    return { items, ...buildPagination(page, pageSize, total) };
  }

  async recordInventoryAudit(data: Record<string, unknown>) {
    return db.inventoryAuditLog.create({ data });
  }

  async lowStockReport(minimumStock: number = 0, query: InventoryListQuery = {}) {
    const where: Record<string, unknown> = { currentStock: { lte: minimumStock } };
    if (query.warehouseId) where.warehouseId = query.warehouseId;
    if (query.productId) where.productId = query.productId;
    return db.inventory.findMany({ where });
  }

  async movementReport(query: StockMovementListQuery = {}) {
    const result = await this.listStockMovements(query);
    return result;
  }

  async stockLedger(productId?: number, variantId?: number, warehouseId?: number, query: StockMovementListQuery = {}) {
    const ledgerQuery = { ...query };
    if (productId) ledgerQuery.productId = productId;
    if (variantId) ledgerQuery.variantId = variantId;
    if (warehouseId) ledgerQuery.warehouseId = warehouseId;
    return this.listStockMovements(ledgerQuery);
  }
}
