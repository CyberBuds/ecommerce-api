import AppError from '../utils/AppError';
import HTTP_STATUS from '../constants/httpStatus';
import InventoryRepository from '../repositories/inventory.repository';
import ProductRepository from '../repositories/product.repository';
import {
  CreateWarehouseDto,
  UpdateWarehouseDto,
  WarehouseListQuery,
  CreateSupplierDto,
  UpdateSupplierDto,
  SupplierListQuery,
  InventoryListQuery,
  InventoryReserveDto,
  CreateStockMovementDto,
  StockMovementListQuery,
  CreatePurchaseOrderDto,
  UpdatePurchaseOrderDto,
  PurchaseOrderListQuery,
  CreateGoodsReceiptNoteDto,
  UpdateGoodsReceiptNoteDto,
  GoodsReceiptNoteListQuery,
  CreateStockAdjustmentDto,
  UpdateStockAdjustmentDto,
  StockAdjustmentListQuery,
  CreateStockTransferDto,
  UpdateStockTransferDto,
  StockTransferListQuery
} from '../interfaces/inventory.dto';

function calculateAvailableStock(currentStock: number, reservedStock: number) {
  return Math.max(0, currentStock - reservedStock);
}

function buildPaginationData(page: number, pageSize: number, total: number) {
  return { page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)), hasNext: page * pageSize < total, hasPrev: page > 1 };
}

function normalizeDecimal(value: number | undefined) {
  return value ?? 0;
}

export default class InventoryService {
  constructor(private repository: InventoryRepository, private productRepository: ProductRepository) {}

  async createWarehouse(dto: CreateWarehouseDto) {
    const warehouse = await this.repository.createWarehouse(dto as unknown as Record<string, unknown>);
    return warehouse;
  }

  async listWarehouses(query: WarehouseListQuery) {
    return this.repository.listWarehouses(query);
  }

  async getWarehouseById(id: number) {
    const warehouse = await this.repository.findWarehouseById(id);
    if (!warehouse) throw new AppError('Warehouse not found', HTTP_STATUS.NOT_FOUND, 'WAREHOUSE_NOT_FOUND');
    return warehouse;
  }

  async updateWarehouse(id: number, dto: UpdateWarehouseDto) {
    const existing = await this.repository.findWarehouseById(id);
    if (!existing) throw new AppError('Warehouse not found', HTTP_STATUS.NOT_FOUND, 'WAREHOUSE_NOT_FOUND');
    return this.repository.updateWarehouse(id, dto as Record<string, unknown>);
  }

  async deleteWarehouse(id: number) {
    const existing = await this.repository.findWarehouseById(id);
    if (!existing) throw new AppError('Warehouse not found', HTTP_STATUS.NOT_FOUND, 'WAREHOUSE_NOT_FOUND');
    return this.repository.deleteWarehouse(id);
  }

  async createSupplier(dto: CreateSupplierDto) {
    return this.repository.createSupplier(dto as unknown as Record<string, unknown>);
  }

  async listSuppliers(query: SupplierListQuery) {
    return this.repository.listSuppliers(query);
  }

  async getSupplierById(id: number) {
    const supplier = await this.repository.findSupplierById(id);
    if (!supplier) throw new AppError('Supplier not found', HTTP_STATUS.NOT_FOUND, 'SUPPLIER_NOT_FOUND');
    return supplier;
  }

  async updateSupplier(id: number, dto: UpdateSupplierDto) {
    const existing = await this.repository.findSupplierById(id);
    if (!existing) throw new AppError('Supplier not found', HTTP_STATUS.NOT_FOUND, 'SUPPLIER_NOT_FOUND');
    return this.repository.updateSupplier(id, dto as Record<string, unknown>);
  }

  async deleteSupplier(id: number) {
    const existing = await this.repository.findSupplierById(id);
    if (!existing) throw new AppError('Supplier not found', HTTP_STATUS.NOT_FOUND, 'SUPPLIER_NOT_FOUND');
    return this.repository.deleteSupplier(id);
  }

  async listInventory(query: InventoryListQuery) {
    return this.repository.listInventory(query);
  }

  async getInventoryById(id: number) {
    const inventory = await this.repository.findInventoryById(id);
    if (!inventory) throw new AppError('Inventory not found', HTTP_STATUS.NOT_FOUND, 'INVENTORY_NOT_FOUND');
    return inventory;
  }

  async reserveInventory(id: number, dto: InventoryReserveDto) {
    const inventory = await this.repository.findInventoryById(id);
    if (!inventory) throw new AppError('Inventory not found', HTTP_STATUS.NOT_FOUND, 'INVENTORY_NOT_FOUND');
    const quantity = dto.quantity;
    if (dto.action === 'RELEASE' && quantity > inventory.reservedStock) {
      throw new AppError('Cannot release more than reserved stock', HTTP_STATUS.BAD_REQUEST, 'INVALID_STOCK_RELEASE');
    }
    return this.repository.reserveInventory(id, quantity, dto.action);
  }

  private async findOrCreateInventory(productId: number, variantId: number | null, warehouseId: number) {
    let inventory = await this.repository.findInventoryRecord(productId, variantId, warehouseId);
    if (!inventory) {
      inventory = await this.repository.createInventory({
        productId,
        variantId,
        warehouseId,
        currentStock: 0,
        reservedStock: 0,
        availableStock: 0,
        minimumStock: 0,
        maximumStock: 0,
        reorderLevel: 0,
        status: 'ACTIVE'
      });
    }
    return inventory;
  }

  private async adjustInventory(productId: number, variantId: number | null, warehouseId: number, quantity: number, movementType: string, referenceNumber?: string, remarks?: string, actorId?: number, status?: string) {
    const inventory = await this.findOrCreateInventory(productId, variantId, warehouseId);
    const change = ['PURCHASE', 'RETURN', 'TRANSFER_IN', 'ADJUSTMENT'].includes(movementType) ? quantity : -quantity;
    const newStock = Math.max(0, inventory.currentStock + change);
    const reservedStock = inventory.reservedStock;
    const availableStock = calculateAvailableStock(newStock, reservedStock);

    const updatedInventory = await this.repository.updateInventory(inventory.id, {
      currentStock: newStock,
      availableStock,
      status: availableStock === 0 ? 'OUT_OF_STOCK' : 'ACTIVE'
    });

    await this.repository.createStockMovement({
      productId,
      variantId,
      warehouseId,
      inventoryId: inventory.id,
      movementType,
      quantity,
      referenceNumber,
      remarks,
      date: new Date().toISOString(),
      stockAdjustmentId: status === 'ADJUSTMENT' ? null : undefined
    } as any);

    await this.repository.recordInventoryAudit({
      inventoryId: inventory.id,
      productId,
      variantId,
      warehouseId,
      actorId: actorId ?? null,
      action: movementType,
      details: { quantity, referenceNumber, remarks },
      previous: { currentStock: inventory.currentStock, reservedStock: inventory.reservedStock, availableStock: inventory.availableStock }
    });

    return updatedInventory;
  }

  async createStockMovement(dto: CreateStockMovementDto, actorId?: number) {
    const inventory = await this.findOrCreateInventory(dto.productId, dto.variantId ?? null, dto.warehouseId);
    const flowType = dto.movementType;
    const quantity = dto.quantity;
    if (['SALE', 'TRANSFER_OUT', 'DAMAGE', 'LOST'].includes(flowType) && quantity > inventory.currentStock) {
      throw new AppError('Insufficient stock for movement', HTTP_STATUS.BAD_REQUEST, 'INSUFFICIENT_STOCK');
    }
    return this.adjustInventory(dto.productId, dto.variantId ?? null, dto.warehouseId, quantity, flowType, dto.referenceNumber, dto.remarks, actorId);
  }

  async listStockMovements(query: StockMovementListQuery) {
    return this.repository.listStockMovements(query);
  }

  async getStockMovementById(id: number) {
    const movement = await this.repository.findStockMovementById(id);
    if (!movement) throw new AppError('Stock movement not found', HTTP_STATUS.NOT_FOUND, 'MOVEMENT_NOT_FOUND');
    return movement;
  }

  private calculateOrderTotals(items: any[]) {
    let totalAmount = 0;
    let taxAmount = 0;
    let netAmount = 0;
    const normalizedItems = items.map((item) => {
      const quantity = item.quantity;
      const rate = item.rate;
      const discount = normalizeDecimal(item.discount);
      const gst = normalizeDecimal(item.gst);
      const lineAmount = quantity * rate;
      const lineNet = lineAmount - discount + gst;
      totalAmount += lineAmount;
      taxAmount += gst;
      netAmount += lineNet;
      return {
        ...item,
        discount,
        gst,
        netAmount: lineNet
      };
    });
    return { normalizedItems, totalAmount, taxAmount, netAmount };
  }

  async createPurchaseOrder(dto: CreatePurchaseOrderDto, createdBy?: number) {
    const supplier = await this.repository.findSupplierById(dto.supplierId);
    if (!supplier) throw new AppError('Supplier not found', HTTP_STATUS.NOT_FOUND, 'SUPPLIER_NOT_FOUND');
    const { normalizedItems, totalAmount, taxAmount, netAmount } = this.calculateOrderTotals(dto.items as any[]);
    const order = await this.repository.createPurchaseOrder({
      supplierId: dto.supplierId,
      orderDate: new Date(dto.orderDate),
      expectedDate: dto.expectedDate ? new Date(dto.expectedDate) : null,
      status: dto.status || 'PENDING',
      remarks: dto.remarks,
      totalAmount,
      taxAmount,
      netAmount,
      items: normalizedItems,
      createdBy: createdBy ?? null,
      updatedBy: createdBy ?? null
    } as any);
    return order;
  }

  async updatePurchaseOrder(id: number, dto: UpdatePurchaseOrderDto, updatedBy?: number) {
    const existing = await this.repository.findPurchaseOrderById(id);
    if (!existing) throw new AppError('Purchase order not found', HTTP_STATUS.NOT_FOUND, 'PURCHASE_ORDER_NOT_FOUND');
    const payload: any = {};
    if (dto.supplierId) payload.supplierId = dto.supplierId;
    if (dto.orderDate) payload.orderDate = new Date(dto.orderDate);
    if (dto.expectedDate) payload.expectedDate = new Date(dto.expectedDate);
    if (dto.status) payload.status = dto.status;
    if (dto.remarks) payload.remarks = dto.remarks;
    if (dto.items) {
      const { normalizedItems, totalAmount, taxAmount, netAmount } = this.calculateOrderTotals(dto.items as any[]);
      payload.items = normalizedItems;
      payload.totalAmount = totalAmount;
      payload.taxAmount = taxAmount;
      payload.netAmount = netAmount;
    }
    payload.updatedBy = updatedBy ?? null;
    return this.repository.updatePurchaseOrder(id, payload);
  }

  async deletePurchaseOrder(id: number) {
    const existing = await this.repository.findPurchaseOrderById(id);
    if (!existing) throw new AppError('Purchase order not found', HTTP_STATUS.NOT_FOUND, 'PURCHASE_ORDER_NOT_FOUND');
    return this.repository.deletePurchaseOrder(id);
  }

  async listPurchaseOrders(query: PurchaseOrderListQuery) {
    return this.repository.listPurchaseOrders(query);
  }

  async getPurchaseOrderById(id: number) {
    const order = await this.repository.findPurchaseOrderById(id);
    if (!order) throw new AppError('Purchase order not found', HTTP_STATUS.NOT_FOUND, 'PURCHASE_ORDER_NOT_FOUND');
    return order;
  }

  async createGoodsReceiptNote(dto: CreateGoodsReceiptNoteDto, createdBy?: number) {
    const purchaseOrder = await this.repository.findPurchaseOrderById(dto.purchaseOrderId);
    if (!purchaseOrder) throw new AppError('Purchase order not found', HTTP_STATUS.NOT_FOUND, 'PURCHASE_ORDER_NOT_FOUND');
    const items = (dto.items || []).map((item: any) => ({
      ...item,
      receivedQuantity: item.receivedQuantity,
      rejectedQuantity: item.rejectedQuantity ?? 0,
      rate: item.rate ?? 0,
      netAmount: item.netAmount ?? 0
    }));
    const totalReceivedAmount = items.reduce((sum: number, item: any) => sum + Number(item.netAmount || 0), 0);
    const rejectedQuantity = items.reduce((sum: number, item: any) => sum + Number(item.rejectedQuantity || 0), 0);
    const grn = await this.repository.createGoodsReceiptNote({
      purchaseOrderId: dto.purchaseOrderId,
      warehouseId: dto.warehouseId,
      receivedDate: dto.receivedDate ? new Date(dto.receivedDate) : new Date(),
      status: dto.status || 'PARTIAL_RECEIVED',
      remarks: dto.remarks,
      totalReceivedAmount,
      rejectedQuantity,
      items,
      createdBy: createdBy ?? null,
      updatedBy: createdBy ?? null
    } as any);

    for (const item of items) {
      if (item.receivedQuantity > 0) {
        await this.adjustInventory(item.productId, item.variantId ?? null, dto.warehouseId, item.receivedQuantity, 'PURCHASE', `GRN-${grn.id}`, item.remarks || '', createdBy, 'PURCHASE');
      }
    }

    const status = items.every((item: any) => item.receivedQuantity >= item.quantity) ? 'COMPLETE_RECEIVED' : 'PARTIAL_RECEIVED';
    await this.repository.updateGoodsReceiptNote(grn.id, { status, updatedBy: createdBy ?? null } as any);
    return this.repository.findGoodsReceiptNoteById(grn.id);
  }

  async updateGoodsReceiptNote(id: number, dto: UpdateGoodsReceiptNoteDto, updatedBy?: number) {
    const existing = await this.repository.findGoodsReceiptNoteById(id);
    if (!existing) throw new AppError('Goods receipt note not found', HTTP_STATUS.NOT_FOUND, 'GRN_NOT_FOUND');
    const payload: any = {};
    if (dto.purchaseOrderId) payload.purchaseOrderId = dto.purchaseOrderId;
    if (dto.receivedDate) payload.receivedDate = new Date(dto.receivedDate);
    if (dto.status) payload.status = dto.status;
    if (dto.remarks) payload.remarks = dto.remarks;
    if (dto.items) payload.items = dto.items;
    payload.updatedBy = updatedBy ?? null;
    return this.repository.updateGoodsReceiptNote(id, payload);
  }

  async deleteGoodsReceiptNote(id: number) {
    const existing = await this.repository.findGoodsReceiptNoteById(id);
    if (!existing) throw new AppError('Goods receipt note not found', HTTP_STATUS.NOT_FOUND, 'GRN_NOT_FOUND');
    return this.repository.deleteGoodsReceiptNote(id);
  }

  async listGoodsReceiptNotes(query: GoodsReceiptNoteListQuery) {
    return this.repository.listGoodsReceiptNotes(query);
  }

  async getGoodsReceiptNoteById(id: number) {
    const grn = await this.repository.findGoodsReceiptNoteById(id);
    if (!grn) throw new AppError('Goods receipt note not found', HTTP_STATUS.NOT_FOUND, 'GRN_NOT_FOUND');
    return grn;
  }

  async createStockAdjustment(dto: CreateStockAdjustmentDto, createdBy?: number) {
    const adjustment = await this.repository.createStockAdjustment({
      adjustmentNumber: dto.adjustmentNumber || `ADJ-${Date.now()}`,
      productId: dto.productId,
      variantId: dto.variantId,
      warehouseId: dto.warehouseId,
      adjustmentType: dto.adjustmentType,
      quantity: dto.quantity,
      reason: dto.reason,
      status: dto.status || 'PENDING',
      referenceNumber: dto.referenceNumber,
      createdBy: createdBy ?? null,
      updatedBy: createdBy ?? null
    } as any);
    if (adjustment.status === 'COMPLETED') {
      const movementType = dto.adjustmentType === 'INCREASE' ? 'ADJUSTMENT' : 'ADJUSTMENT';
      await this.adjustInventory(dto.productId, dto.variantId ?? null, dto.warehouseId, dto.quantity, movementType, dto.referenceNumber, dto.reason, createdBy);
    }
    return adjustment;
  }

  async updateStockAdjustment(id: number, dto: UpdateStockAdjustmentDto, updatedBy?: number) {
    const existing = await this.repository.findStockAdjustmentById(id);
    if (!existing) throw new AppError('Stock adjustment not found', HTTP_STATUS.NOT_FOUND, 'STOCK_ADJUSTMENT_NOT_FOUND');
    const payload: any = {};
    if (dto.adjustmentNumber) payload.adjustmentNumber = dto.adjustmentNumber;
    if (dto.productId) payload.productId = dto.productId;
    if (dto.variantId) payload.variantId = dto.variantId;
    if (dto.warehouseId) payload.warehouseId = dto.warehouseId;
    if (dto.adjustmentType) payload.adjustmentType = dto.adjustmentType;
    if (dto.quantity) payload.quantity = dto.quantity;
    if (dto.reason) payload.reason = dto.reason;
    if (dto.status) payload.status = dto.status;
    if (dto.referenceNumber) payload.referenceNumber = dto.referenceNumber;
    payload.updatedBy = updatedBy ?? null;
    return this.repository.updateStockAdjustment(id, payload);
  }

  async deleteStockAdjustment(id: number) {
    const existing = await this.repository.findStockAdjustmentById(id);
    if (!existing) throw new AppError('Stock adjustment not found', HTTP_STATUS.NOT_FOUND, 'STOCK_ADJUSTMENT_NOT_FOUND');
    return this.repository.deleteStockAdjustment(id);
  }

  async listStockAdjustments(query: StockAdjustmentListQuery) {
    return this.repository.listStockAdjustments(query);
  }

  async getStockAdjustmentById(id: number) {
    const adjustment = await this.repository.findStockAdjustmentById(id);
    if (!adjustment) throw new AppError('Stock adjustment not found', HTTP_STATUS.NOT_FOUND, 'STOCK_ADJUSTMENT_NOT_FOUND');
    return adjustment;
  }

  async createStockTransfer(dto: CreateStockTransferDto, createdBy?: number) {
    const transfer = await this.repository.createStockTransfer({
      transferNumber: dto.transferNumber || `TRF-${Date.now()}`,
      productId: dto.productId,
      variantId: dto.variantId,
      sourceWarehouseId: dto.sourceWarehouseId,
      destinationWarehouseId: dto.destinationWarehouseId,
      quantity: dto.quantity,
      status: dto.status || 'PENDING',
      referenceNumber: dto.referenceNumber,
      remarks: dto.remarks,
      transferredAt: dto.transferredAt ? new Date(dto.transferredAt) : null,
      createdBy: createdBy ?? null,
      updatedBy: createdBy ?? null
    } as any);

    if (transfer.status === 'COMPLETED') {
      await this.adjustInventory(dto.productId, dto.variantId ?? null, dto.sourceWarehouseId, dto.quantity, 'TRANSFER_OUT', dto.referenceNumber, dto.remarks, createdBy);
      await this.adjustInventory(dto.productId, dto.variantId ?? null, dto.destinationWarehouseId, dto.quantity, 'TRANSFER_IN', dto.referenceNumber, dto.remarks, createdBy);
    }

    return transfer;
  }

  async updateStockTransfer(id: number, dto: UpdateStockTransferDto, updatedBy?: number) {
    const existing = await this.repository.findStockTransferById(id);
    if (!existing) throw new AppError('Stock transfer not found', HTTP_STATUS.NOT_FOUND, 'STOCK_TRANSFER_NOT_FOUND');
    const payload: any = {};
    if (dto.transferNumber) payload.transferNumber = dto.transferNumber;
    if (dto.productId) payload.productId = dto.productId;
    if (dto.variantId) payload.variantId = dto.variantId;
    if (dto.sourceWarehouseId) payload.sourceWarehouseId = dto.sourceWarehouseId;
    if (dto.destinationWarehouseId) payload.destinationWarehouseId = dto.destinationWarehouseId;
    if (dto.quantity) payload.quantity = dto.quantity;
    if (dto.status) payload.status = dto.status;
    if (dto.referenceNumber) payload.referenceNumber = dto.referenceNumber;
    if (dto.remarks) payload.remarks = dto.remarks;
    if (dto.transferredAt) payload.transferredAt = new Date(dto.transferredAt);
    payload.updatedBy = updatedBy ?? null;

    const updated = await this.repository.updateStockTransfer(id, payload);
    if (existing.status !== 'COMPLETED' && dto.status === 'COMPLETED') {
      await this.adjustInventory(updated.productId, updated.variantId ?? null, updated.sourceWarehouseId, updated.quantity, 'TRANSFER_OUT', updated.referenceNumber, updated.remarks, updatedBy);
      await this.adjustInventory(updated.productId, updated.variantId ?? null, updated.destinationWarehouseId, updated.quantity, 'TRANSFER_IN', updated.referenceNumber, updated.remarks, updatedBy);
    }
    return updated;
  }

  async deleteStockTransfer(id: number) {
    const existing = await this.repository.findStockTransferById(id);
    if (!existing) throw new AppError('Stock transfer not found', HTTP_STATUS.NOT_FOUND, 'STOCK_TRANSFER_NOT_FOUND');
    return this.repository.deleteStockTransfer(id);
  }

  async listStockTransfers(query: StockTransferListQuery) {
    return this.repository.listStockTransfers(query);
  }

  async getStockTransferById(id: number) {
    const transfer = await this.repository.findStockTransferById(id);
    if (!transfer) throw new AppError('Stock transfer not found', HTTP_STATUS.NOT_FOUND, 'STOCK_TRANSFER_NOT_FOUND');
    return transfer;
  }

  async listLowStockReport(minimumStock = 0, query: InventoryListQuery = {}) {
    return this.repository.lowStockReport(minimumStock, query);
  }

  async stockLedger(productId?: number, variantId?: number, warehouseId?: number, query: StockMovementListQuery = {}) {
    return this.repository.stockLedger(productId, variantId, warehouseId, query);
  }

  async movementReport(query: StockMovementListQuery) {
    return this.repository.movementReport(query);
  }

  async purchaseReport(query: PurchaseOrderListQuery) {
    return this.repository.listPurchaseOrders(query);
  }

  async warehouseReport(query: WarehouseListQuery) {
    return this.repository.listWarehouses(query);
  }

  async supplierReport(query: SupplierListQuery) {
    return this.repository.listSuppliers(query);
  }
}
