export type WarehouseStatus = 'ACTIVE' | 'INACTIVE';
export type SupplierStatus = 'ACTIVE' | 'INACTIVE';
export type InventoryStatus = 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK' | 'RESERVED';
export type StockMovementType = 'PURCHASE' | 'SALE' | 'RETURN' | 'ADJUSTMENT' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'DAMAGE' | 'LOST';
export type PurchaseOrderStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'PARTIAL' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';
export type GRNStatus = 'PARTIAL_RECEIVED' | 'COMPLETE_RECEIVED' | 'REJECTED';
export type StockAdjustmentType = 'INCREASE' | 'DECREASE';
export type StockAdjustmentStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';
export type StockTransferStatus = 'PENDING' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';

export interface CreateWarehouseDto {
  warehouseCode: string;
  warehouseName: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  status?: WarehouseStatus;
}

export interface UpdateWarehouseDto extends Partial<CreateWarehouseDto> {}

export interface WarehouseListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: WarehouseStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateSupplierDto {
  supplierCode: string;
  supplierName: string;
  gstNumber?: string;
  contactPerson?: string;
  mobile?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  status?: SupplierStatus;
}

export interface UpdateSupplierDto extends Partial<CreateSupplierDto> {}

export interface SupplierListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: SupplierStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface InventoryListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  productId?: number;
  variantId?: number;
  warehouseId?: number;
  status?: InventoryStatus;
  minStock?: number;
  maxStock?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface InventoryReserveDto {
  quantity: number;
  action: 'RESERVE' | 'RELEASE';
}

export interface CreateStockMovementDto {
  productId: number;
  variantId?: number;
  warehouseId: number;
  movementType: StockMovementType;
  quantity: number;
  referenceNumber?: string;
  remarks?: string;
  date?: string;
}

export interface StockMovementListQuery {
  page?: number;
  pageSize?: number;
  productId?: number;
  variantId?: number;
  warehouseId?: number;
  movementType?: StockMovementType;
  referenceNumber?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PurchaseOrderItemDto {
  productId: number;
  variantId?: number;
  quantity: number;
  rate: number;
  discount?: number;
  gst?: number;
  netAmount?: number;
}

export interface CreatePurchaseOrderDto {
  supplierId: number;
  orderDate: string;
  expectedDate?: string;
  status?: PurchaseOrderStatus;
  remarks?: string;
  items: PurchaseOrderItemDto[];
}

export interface UpdatePurchaseOrderDto extends Partial<CreatePurchaseOrderDto> {}

export interface PurchaseOrderListQuery {
  page?: number;
  pageSize?: number;
  supplierId?: number;
  status?: PurchaseOrderStatus;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface GoodsReceiptNoteItemDto {
  productId: number;
  variantId?: number;
  quantity: number;
  receivedQuantity: number;
  rejectedQuantity?: number;
  rate?: number;
  netAmount?: number;
}

export interface CreateGoodsReceiptNoteDto {
  purchaseOrderId: number;
  warehouseId: number;
  receivedDate?: string;
  status?: GRNStatus;
  remarks?: string;
  items: GoodsReceiptNoteItemDto[];
}

export interface UpdateGoodsReceiptNoteDto extends Partial<CreateGoodsReceiptNoteDto> {}

export interface GoodsReceiptNoteListQuery {
  page?: number;
  pageSize?: number;
  purchaseOrderId?: number;
  status?: GRNStatus;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateStockAdjustmentDto {
  adjustmentNumber?: string;
  productId: number;
  variantId?: number;
  warehouseId: number;
  adjustmentType: StockAdjustmentType;
  quantity: number;
  reason: string;
  status?: StockAdjustmentStatus;
  referenceNumber?: string;
}

export interface UpdateStockAdjustmentDto extends Partial<CreateStockAdjustmentDto> {}

export interface StockAdjustmentListQuery {
  page?: number;
  pageSize?: number;
  warehouseId?: number;
  productId?: number;
  variantId?: number;
  status?: StockAdjustmentStatus;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateStockTransferDto {
  transferNumber?: string;
  productId: number;
  variantId?: number;
  sourceWarehouseId: number;
  destinationWarehouseId: number;
  quantity: number;
  status?: StockTransferStatus;
  referenceNumber?: string;
  remarks?: string;
  transferredAt?: string;
}

export interface UpdateStockTransferDto extends Partial<CreateStockTransferDto> {}

export interface StockTransferListQuery {
  page?: number;
  pageSize?: number;
  sourceWarehouseId?: number;
  destinationWarehouseId?: number;
  productId?: number;
  variantId?: number;
  status?: StockTransferStatus;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface InventoryReportQuery {
  warehouseId?: number;
  productId?: number;
  variantId?: number;
  supplierId?: number;
  status?: InventoryStatus;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CurrentStockResponse {
  id: number;
  productId: number;
  variantId?: number;
  warehouseId: number;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  minimumStock: number;
  maximumStock: number;
  reorderLevel: number;
  status: InventoryStatus;
  createdAt: string;
  updatedAt: string;
}
