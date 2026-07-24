import { body, param, query } from 'express-validator';
import InventoryRepository from '../repositories/inventory.repository';
import ProductRepository from '../repositories/product.repository';
import { CreatePurchaseOrderDto, CreateGoodsReceiptNoteDto, CreateStockAdjustmentDto, CreateStockMovementDto, CreateStockTransferDto, CreateWarehouseDto, CreateSupplierDto, InventoryReserveDto, InventoryListQuery, PurchaseOrderListQuery, SupplierListQuery, WarehouseListQuery } from '../interfaces/inventory.dto';

export function createWarehouseValidation(repository: InventoryRepository) {
  return [
    body('warehouseCode')
      .trim()
      .notEmpty()
      .withMessage('Warehouse code is required')
      .custom(async (value) => {
        const exists = await repository.findWarehouseByCode(value);
        if (exists) return Promise.reject('Warehouse code already exists');
        return true;
      }),
    body('warehouseName').trim().notEmpty().withMessage('Warehouse name is required'),
    body('email').optional().isEmail().withMessage('Invalid email address'),
    body('status').optional().isIn(['ACTIVE', 'INACTIVE']),
    body('pincode').optional().isString(),
    body('phone').optional().isString(),
    body('address').optional().isString(),
    body('city').optional().isString(),
    body('state').optional().isString(),
    body('country').optional().isString()
  ];
}

export function updateWarehouseValidation(repository: InventoryRepository) {
  return [
    param('id').isInt().withMessage('Invalid warehouse id'),
    body('warehouseCode')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Warehouse code cannot be empty')
      .custom(async (value, { req }) => {
        const id = Number(req?.params?.id);
        const exists = await repository.findWarehouseByCode(value, id);
        if (exists) return Promise.reject('Warehouse code already exists');
        return true;
      }),
    body('warehouseName').optional().trim().notEmpty().withMessage('Warehouse name cannot be empty'),
    body('email').optional().isEmail().withMessage('Invalid email address'),
    body('status').optional().isIn(['ACTIVE', 'INACTIVE']),
    body('pincode').optional().isString(),
    body('phone').optional().isString(),
    body('address').optional().isString(),
    body('city').optional().isString(),
    body('state').optional().isString(),
    body('country').optional().isString()
  ];
}

export const warehouseIdParam = [param('id').isInt().withMessage('Invalid warehouse id')];

export function createSupplierValidation(repository: InventoryRepository) {
  return [
    body('supplierCode')
      .trim()
      .notEmpty()
      .withMessage('Supplier code is required')
      .custom(async (value) => {
        const exists = await repository.findSupplierByCode(value);
        if (exists) return Promise.reject('Supplier code already exists');
        return true;
      }),
    body('supplierName').trim().notEmpty().withMessage('Supplier name is required'),
    body('email').optional().isEmail().withMessage('Invalid email address'),
    body('status').optional().isIn(['ACTIVE', 'INACTIVE']),
    body('gstNumber').optional().isString(),
    body('mobile').optional().isString(),
    body('address').optional().isString(),
    body('city').optional().isString(),
    body('state').optional().isString(),
    body('country').optional().isString(),
    body('pincode').optional().isString()
  ];
}

export function updateSupplierValidation(repository: InventoryRepository) {
  return [
    param('id').isInt().withMessage('Invalid supplier id'),
    body('supplierCode')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Supplier code cannot be empty')
      .custom(async (value, { req }) => {
        const id = Number(req?.params?.id);
        const exists = await repository.findSupplierByCode(value, id);
        if (exists) return Promise.reject('Supplier code already exists');
        return true;
      }),
    body('supplierName').optional().trim().notEmpty().withMessage('Supplier name cannot be empty'),
    body('email').optional().isEmail().withMessage('Invalid email address'),
    body('status').optional().isIn(['ACTIVE', 'INACTIVE']),
    body('gstNumber').optional().isString(),
    body('mobile').optional().isString(),
    body('address').optional().isString(),
    body('city').optional().isString(),
    body('state').optional().isString(),
    body('country').optional().isString(),
    body('pincode').optional().isString()
  ];
}

export const supplierIdParam = [param('id').isInt().withMessage('Invalid supplier id')];

export const inventoryListValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('sortBy').optional().isString(),
  query('sortOrder').optional().isIn(['asc', 'desc']),
  query('productId').optional().isInt().toInt(),
  query('variantId').optional().isInt().toInt(),
  query('warehouseId').optional().isInt().toInt(),
  query('status').optional().isIn(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK', 'RESERVED']),
  query('minStock').optional().isInt().toInt(),
  query('maxStock').optional().isInt().toInt()
];

export function reserveStockValidation() {
  return [
    param('id').isInt().withMessage('Invalid inventory id'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1').toInt(),
    body('action').isIn(['RESERVE', 'RELEASE']).withMessage('Action must be RESERVE or RELEASE')
  ];
}

export function createStockMovementValidation() {
  return [
    body('productId').isInt().withMessage('Product id is required').toInt(),
    body('warehouseId').isInt().withMessage('Warehouse id is required').toInt(),
    body('movementType')
      .isIn(['PURCHASE', 'SALE', 'RETURN', 'ADJUSTMENT', 'TRANSFER_IN', 'TRANSFER_OUT', 'DAMAGE', 'LOST'])
      .withMessage('Invalid movement type'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1').toInt(),
    body('referenceNumber').optional().isString(),
    body('remarks').optional().isString(),
    body('date').optional().isISO8601()
  ];
}

export function createPurchaseOrderValidation(repository: InventoryRepository, productRepository: ProductRepository) {
  return [
    body('supplierId').isInt().withMessage('Supplier id is required').toInt().custom(async (value) => {
      const supplier = await repository.findSupplierById(value);
      if (!supplier) return Promise.reject('Supplier not found');
      return true;
    }),
    body('orderDate').isISO8601().withMessage('Order date is required'),
    body('expectedDate').optional().isISO8601(),
    body('status').optional().isIn(['DRAFT', 'PENDING', 'APPROVED', 'PARTIAL', 'COMPLETED', 'CANCELLED', 'REJECTED']),
    body('items').isArray({ min: 1 }).withMessage('At least one purchase order item is required'),
    body('items.*.productId').isInt().withMessage('Product id is required').toInt().custom(async (value) => {
      const product = await productRepository.findById(value);
      if (!product) return Promise.reject('Product not found');
      return true;
    }),
    body('items.*.variantId').optional().isInt().toInt().custom(async (value) => {
      if (!value) return true;
      const variant = await productRepository.findVariantById(value);
      if (!variant) return Promise.reject('Product variant not found');
      return true;
    }),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1').toInt(),
    body('items.*.rate').isFloat({ gt: 0 }).withMessage('Rate must be greater than zero').toFloat(),
    body('items.*.discount').optional().isFloat({ min: 0 }).toFloat(),
    body('items.*.gst').optional().isFloat({ min: 0 }).toFloat(),
    body('remarks').optional().isString()
  ];
}

export function updatePurchaseOrderValidation(repository: InventoryRepository, productRepository: ProductRepository) {
  return [
    param('id').isInt().withMessage('Invalid purchase order id'),
    body('supplierId').optional().isInt().toInt().custom(async (value) => {
      if (!value) return true;
      const supplier = await repository.findSupplierById(value);
      if (!supplier) return Promise.reject('Supplier not found');
      return true;
    }),
    body('orderDate').optional().isISO8601(),
    body('expectedDate').optional().isISO8601(),
    body('status').optional().isIn(['DRAFT', 'PENDING', 'APPROVED', 'PARTIAL', 'COMPLETED', 'CANCELLED', 'REJECTED']),
    body('items').optional().isArray({ min: 1 }).withMessage('At least one purchase order item is required'),
    body('items.*.productId').optional().isInt().withMessage('Product id is required').toInt().custom(async (value) => {
      if (!value) return true;
      const product = await productRepository.findById(value);
      if (!product) return Promise.reject('Product not found');
      return true;
    }),
    body('items.*.variantId').optional().isInt().toInt().custom(async (value) => {
      if (!value) return true;
      const variant = await productRepository.findVariantById(value);
      if (!variant) return Promise.reject('Product variant not found');
      return true;
    }),
    body('items.*.quantity').optional().isInt({ min: 1 }).toInt(),
    body('items.*.rate').optional().isFloat({ gt: 0 }).toFloat(),
    body('items.*.discount').optional().isFloat({ min: 0 }).toFloat(),
    body('items.*.gst').optional().isFloat({ min: 0 }).toFloat(),
    body('remarks').optional().isString()
  ];
}

export function purchaseOrderIdParam() {
  return [param('id').isInt().withMessage('Invalid purchase order id')];
}

export function createGoodsReceiptNoteValidation(repository: InventoryRepository, productRepository: ProductRepository) {
  return [
    body('purchaseOrderId').isInt().withMessage('Purchase order id is required').toInt().custom(async (value) => {
      const po = await repository.findPurchaseOrderById(value);
      if (!po) return Promise.reject('Purchase order not found');
      return true;
    }),
    body('warehouseId').isInt().withMessage('Warehouse id is required').toInt().custom(async (value) => {
      const warehouse = await repository.findWarehouseById(value);
      if (!warehouse) return Promise.reject('Warehouse not found');
      return true;
    }),
    body('receivedDate').optional().isISO8601(),
    body('status').optional().isIn(['PARTIAL_RECEIVED', 'COMPLETE_RECEIVED', 'REJECTED']),
    body('items').isArray({ min: 1 }).withMessage('At least one GRN item is required'),
    body('items.*.productId').isInt().withMessage('Product id is required').toInt().custom(async (value) => {
      const product = await productRepository.findById(value);
      if (!product) return Promise.reject('Product not found');
      return true;
    }),
    body('items.*.variantId').optional().isInt().toInt().custom(async (value) => {
      if (!value) return true;
      const variant = await productRepository.findVariantById(value);
      if (!variant) return Promise.reject('Product variant not found');
      return true;
    }),
    body('items.*.quantity').isInt({ min: 0 }).toInt(),
    body('items.*.receivedQuantity').isInt({ min: 0 }).toInt(),
    body('items.*.rejectedQuantity').optional().isInt({ min: 0 }).toInt(),
    body('remarks').optional().isString()
  ];
}

export function goodsReceiptNoteIdParam() {
  return [param('id').isInt().withMessage('Invalid GRN id')];
}

export function createStockAdjustmentValidation(repository: InventoryRepository, productRepository: ProductRepository) {
  return [
    body('productId').isInt().withMessage('Product id is required').toInt().custom(async (value) => {
      const product = await productRepository.findById(value);
      if (!product) return Promise.reject('Product not found');
      return true;
    }),
    body('variantId').optional().isInt().toInt().custom(async (value) => {
      if (!value) return true;
      const variant = await productRepository.findVariantById(value);
      if (!variant) return Promise.reject('Product variant not found');
      return true;
    }),
    body('warehouseId').isInt().withMessage('Warehouse id is required').toInt().custom(async (value) => {
      const warehouse = await repository.findWarehouseById(value);
      if (!warehouse) return Promise.reject('Warehouse not found');
      return true;
    }),
    body('adjustmentType').isIn(['INCREASE', 'DECREASE']).withMessage('Invalid adjustment type'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1').toInt(),
    body('reason').trim().notEmpty().withMessage('Reason is required'),
    body('status').optional().isIn(['PENDING', 'COMPLETED', 'CANCELLED']),
    body('referenceNumber').optional().isString()
  ];
}

export function stockAdjustmentIdParam() {
  return [param('id').isInt().withMessage('Invalid stock adjustment id')];
}

export function createStockTransferValidation(repository: InventoryRepository, productRepository: ProductRepository) {
  return [
    body('productId').isInt().withMessage('Product id is required').toInt().custom(async (value) => {
      const product = await productRepository.findById(value);
      if (!product) return Promise.reject('Product not found');
      return true;
    }),
    body('variantId').optional().isInt().toInt().custom(async (value) => {
      if (!value) return true;
      const variant = await productRepository.findVariantById(value);
      if (!variant) return Promise.reject('Product variant not found');
      return true;
    }),
    body('sourceWarehouseId').isInt().withMessage('Source warehouse id is required').toInt().custom(async (value) => {
      const warehouse = await repository.findWarehouseById(value);
      if (!warehouse) return Promise.reject('Source warehouse not found');
      return true;
    }),
    body('destinationWarehouseId').isInt().withMessage('Destination warehouse id is required').toInt().custom(async (value, { req }) => {
      const sourceWarehouseId = Number(req.body.sourceWarehouseId);
      if (sourceWarehouseId === value) return Promise.reject('Source and destination warehouse must differ');
      const warehouse = await repository.findWarehouseById(value);
      if (!warehouse) return Promise.reject('Destination warehouse not found');
      return true;
    }),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1').toInt(),
    body('status').optional().isIn(['PENDING', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED', 'REJECTED']),
    body('referenceNumber').optional().isString(),
    body('remarks').optional().isString(),
    body('transferredAt').optional().isISO8601()
  ];
}

export function stockTransferIdParam() {
  return [param('id').isInt().withMessage('Invalid stock transfer id')];
}

export const purchaseOrderListValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('sortBy').optional().isString(),
  query('sortOrder').optional().isIn(['asc', 'desc']),
  query('supplierId').optional().isInt().toInt(),
  query('status').optional().isIn(['DRAFT', 'PENDING', 'APPROVED', 'PARTIAL', 'COMPLETED', 'CANCELLED', 'REJECTED']),
  query('dateFrom').optional().isISO8601(),
  query('dateTo').optional().isISO8601()
];

export const goodsReceiptNoteListValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('sortBy').optional().isString(),
  query('sortOrder').optional().isIn(['asc', 'desc']),
  query('purchaseOrderId').optional().isInt().toInt(),
  query('status').optional().isIn(['PARTIAL_RECEIVED', 'COMPLETE_RECEIVED', 'REJECTED']),
  query('dateFrom').optional().isISO8601(),
  query('dateTo').optional().isISO8601()
];

export const stockAdjustmentListValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('sortBy').optional().isString(),
  query('sortOrder').optional().isIn(['asc', 'desc']),
  query('warehouseId').optional().isInt().toInt(),
  query('productId').optional().isInt().toInt(),
  query('variantId').optional().isInt().toInt(),
  query('status').optional().isIn(['PENDING', 'COMPLETED', 'CANCELLED']),
  query('dateFrom').optional().isISO8601(),
  query('dateTo').optional().isISO8601()
];

export const stockTransferListValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('sortBy').optional().isString(),
  query('sortOrder').optional().isIn(['asc', 'desc']),
  query('sourceWarehouseId').optional().isInt().toInt(),
  query('destinationWarehouseId').optional().isInt().toInt(),
  query('productId').optional().isInt().toInt(),
  query('variantId').optional().isInt().toInt(),
  query('status').optional().isIn(['PENDING', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED', 'REJECTED']),
  query('dateFrom').optional().isISO8601(),
  query('dateTo').optional().isISO8601()
];

export const stockMovementListValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('sortBy').optional().isString(),
  query('sortOrder').optional().isIn(['asc', 'desc']),
  query('productId').optional().isInt().toInt(),
  query('variantId').optional().isInt().toInt(),
  query('warehouseId').optional().isInt().toInt(),
  query('movementType').optional().isIn(['PURCHASE', 'SALE', 'RETURN', 'ADJUSTMENT', 'TRANSFER_IN', 'TRANSFER_OUT', 'DAMAGE', 'LOST']),
  query('dateFrom').optional().isISO8601(),
  query('dateTo').optional().isISO8601()
];

export const reportValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('sortBy').optional().isString(),
  query('sortOrder').optional().isIn(['asc', 'desc']),
  query('dateFrom').optional().isISO8601(),
  query('dateTo').optional().isISO8601()
];

export const warehouseListValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('sortBy').optional().isString(),
  query('sortOrder').optional().isIn(['asc', 'desc']),
  query('status').optional().isIn(['ACTIVE', 'INACTIVE'])
];

export const supplierListValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('sortBy').optional().isString(),
  query('sortOrder').optional().isIn(['asc', 'desc']),
  query('status').optional().isIn(['ACTIVE', 'INACTIVE'])
];
