import { Router } from 'express';
import { param } from 'express-validator';
import authenticate from '../middlewares/authenticate';
import authorize from '../middlewares/authorize';
import validate from '../middlewares/validation.middleware';
import InventoryRepository from '../repositories/inventory.repository';
import ProductRepository from '../repositories/product.repository';
import InventoryService from '../services/inventory.service';
import { createInventoryController } from '../controllers/inventory.controller';
import {
  createWarehouseValidation,
  updateWarehouseValidation,
  warehouseIdParam,
  warehouseListValidation,
  createSupplierValidation,
  updateSupplierValidation,
  supplierIdParam,
  supplierListValidation,
  inventoryListValidation,
  reserveStockValidation,
  createStockMovementValidation,
  stockMovementListValidation,
  createPurchaseOrderValidation,
  updatePurchaseOrderValidation,
  purchaseOrderIdParam,
  purchaseOrderListValidation,
  createGoodsReceiptNoteValidation,
  goodsReceiptNoteIdParam,
  goodsReceiptNoteListValidation,
  createStockAdjustmentValidation,
  stockAdjustmentIdParam,
  stockAdjustmentListValidation,
  createStockTransferValidation,
  stockTransferIdParam,
  stockTransferListValidation,
  reportValidation
} from '../validations/inventory.validation';

const router = Router();
const inventoryRepository = new InventoryRepository();
const productRepository = new ProductRepository();
const inventoryService = new InventoryService(inventoryRepository, productRepository);
const inventoryController = createInventoryController(inventoryService);

router.use(authenticate);

/**
 * @openapi
 * components:
 *   schemas:
 *     WarehouseInput:
 *       type: object
 *       required:
 *         - name
 *         - code
 *       properties:
 *         name:
 *           type: string
 *           example: Central Distribution Center
 *         code:
 *           type: string
 *           example: WH-CDC-01
 *         address:
 *           type: string
 *           example: Plot 12, Industrial Area, Indore
 *         isActive:
 *           type: boolean
 *           example: true
 *     Warehouse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Central Distribution Center
 *         code:
 *           type: string
 *           example: WH-CDC-01
 *         address:
 *           type: string
 *           example: Plot 12, Industrial Area, Indore
 *         isActive:
 *           type: boolean
 *           example: true
 *     SupplierInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: Global Textiles Pvt Ltd
 *         contactPerson:
 *           type: string
 *           example: Amit Sharma
 *         email:
 *           type: string
 *           example: contact@globaltextiles.com
 *         phone:
 *           type: string
 *           example: "+919812345678"
 *         address:
 *           type: string
 *           example: 45 Textile Market, Surat
 *     Supplier:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Global Textiles Pvt Ltd
 *         contactPerson:
 *           type: string
 *           example: Amit Sharma
 *         email:
 *           type: string
 *           example: contact@globaltextiles.com
 *         phone:
 *           type: string
 *           example: "+919812345678"
 *     ReserveStockInput:
 *       type: object
 *       required:
 *         - quantity
 *       properties:
 *         quantity:
 *           type: integer
 *           example: 10
 *         orderId:
 *           type: integer
 *           example: 1023
 *     StockMovementInput:
 *       type: object
 *       required:
 *         - productId
 *         - warehouseId
 *         - quantity
 *         - type
 *       properties:
 *         productId:
 *           type: integer
 *           example: 42
 *         warehouseId:
 *           type: integer
 *           example: 1
 *         quantity:
 *           type: integer
 *           example: 25
 *         type:
 *           type: string
 *           enum: [IN, OUT]
 *           example: IN
 *         reason:
 *           type: string
 *           example: Stock replenishment
 *     PurchaseOrderInput:
 *       type: object
 *       required:
 *         - supplierId
 *         - warehouseId
 *         - items
 *       properties:
 *         supplierId:
 *           type: integer
 *           example: 1
 *         warehouseId:
 *           type: integer
 *           example: 1
 *         expectedDeliveryDate:
 *           type: string
 *           format: date-time
 *           example: "2026-08-01T00:00:00Z"
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 42
 *               quantity:
 *                 type: integer
 *                 example: 100
 *               unitCost:
 *                 type: number
 *                 example: 250.5
 *     GoodsReceiptNoteInput:
 *       type: object
 *       required:
 *         - purchaseOrderId
 *         - items
 *       properties:
 *         purchaseOrderId:
 *           type: integer
 *           example: 1
 *         receivedDate:
 *           type: string
 *           format: date-time
 *           example: "2026-08-02T00:00:00Z"
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 42
 *               quantityReceived:
 *                 type: integer
 *                 example: 95
 *     StockAdjustmentInput:
 *       type: object
 *       required:
 *         - warehouseId
 *         - items
 *       properties:
 *         warehouseId:
 *           type: integer
 *           example: 1
 *         reason:
 *           type: string
 *           example: Physical stock count correction
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 42
 *               quantityChange:
 *                 type: integer
 *                 example: -5
 *     StockTransferInput:
 *       type: object
 *       required:
 *         - fromWarehouseId
 *         - toWarehouseId
 *         - items
 *       properties:
 *         fromWarehouseId:
 *           type: integer
 *           example: 1
 *         toWarehouseId:
 *           type: integer
 *           example: 2
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 42
 *               quantity:
 *                 type: integer
 *                 example: 20
 */

/**
 * @openapi
 * /api/v1/inventory/warehouses:
 *   post:
 *     tags:
 *       - Inventory Warehouses
 *     summary: Create a warehouse
 *     description: Create a new warehouse. Requires Super Admin, Admin, or Inventory Manager role.
 *     operationId: createWarehouse
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WarehouseInput'
 *     responses:
 *       201:
 *         description: Warehouse created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/warehouses',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  ...createWarehouseValidation(inventoryRepository),
  validate,
  inventoryController.createWarehouse
);

/**
 * @openapi
 * /api/v1/inventory/warehouses:
 *   get:
 *     tags:
 *       - Inventory Warehouses
 *     summary: List warehouses
 *     description: Retrieve warehouses with pagination and filtering. Requires Super Admin, Admin, Inventory Manager, or Order Manager role.
 *     operationId: listWarehouses
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *       - name: isActive
 *         in: query
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Warehouses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/warehouses',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager', 'Order Manager'] }),
  ...warehouseListValidation,
  validate,
  inventoryController.listWarehouses
);

/**
 * @openapi
 * /api/v1/inventory/warehouses/{id}:
 *   get:
 *     tags:
 *       - Inventory Warehouses
 *     summary: Get warehouse by ID
 *     description: Retrieve a single warehouse by its numeric ID. Requires Super Admin, Admin, Inventory Manager, or Order Manager role.
 *     operationId: getWarehouseById
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Warehouse ID
 *     responses:
 *       200:
 *         description: Warehouse retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Warehouse not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/warehouses/:id',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager', 'Order Manager'] }),
  ...warehouseIdParam,
  validate,
  inventoryController.getWarehouseById
);

/**
 * @openapi
 * /api/v1/inventory/warehouses/{id}:
 *   put:
 *     tags:
 *       - Inventory Warehouses
 *     summary: Update a warehouse
 *     description: Update an existing warehouse. Requires Super Admin, Admin, or Inventory Manager role.
 *     operationId: updateWarehouse
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Warehouse ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WarehouseInput'
 *     responses:
 *       200:
 *         description: Warehouse updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Warehouse not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put(
  '/warehouses/:id',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  ...updateWarehouseValidation(inventoryRepository),
  validate,
  inventoryController.updateWarehouse
);

/**
 * @openapi
 * /api/v1/inventory/warehouses/{id}:
 *   delete:
 *     tags:
 *       - Inventory Warehouses
 *     summary: Delete a warehouse
 *     description: Permanently delete a warehouse. Requires Super Admin, Admin, or Inventory Manager role.
 *     operationId: deleteWarehouse
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Warehouse ID
 *     responses:
 *       200:
 *         description: Warehouse deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Warehouse not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete(
  '/warehouses/:id',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  ...warehouseIdParam,
  validate,
  inventoryController.deleteWarehouse
);

/**
 * @openapi
 * /api/v1/inventory/suppliers:
 *   post:
 *     tags:
 *       - Inventory Suppliers
 *     summary: Create a supplier
 *     description: Create a new supplier. Requires Super Admin, Admin, or Inventory Manager role.
 *     operationId: createSupplier
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SupplierInput'
 *     responses:
 *       201:
 *         description: Supplier created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/suppliers',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  ...createSupplierValidation(inventoryRepository),
  validate,
  inventoryController.createSupplier
);

/**
 * @openapi
 * /api/v1/inventory/suppliers:
 *   get:
 *     tags:
 *       - Inventory Suppliers
 *     summary: List suppliers
 *     description: Retrieve suppliers with pagination and filtering. Requires Super Admin, Admin, Inventory Manager, or Order Manager role.
 *     operationId: listSuppliers
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Suppliers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/suppliers',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager', 'Order Manager'] }),
  ...supplierListValidation,
  validate,
  inventoryController.listSuppliers
);

/**
 * @openapi
 * /api/v1/inventory/suppliers/{id}:
 *   get:
 *     tags:
 *       - Inventory Suppliers
 *     summary: Get supplier by ID
 *     description: Retrieve a single supplier by its numeric ID. Requires Super Admin, Admin, Inventory Manager, or Order Manager role.
 *     operationId: getSupplierById
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Supplier ID
 *     responses:
 *       200:
 *         description: Supplier retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Supplier not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/suppliers/:id',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager', 'Order Manager'] }),
  ...supplierIdParam,
  validate,
  inventoryController.getSupplierById
);

/**
 * @openapi
 * /api/v1/inventory/suppliers/{id}:
 *   put:
 *     tags:
 *       - Inventory Suppliers
 *     summary: Update a supplier
 *     description: Update an existing supplier. Requires Super Admin, Admin, or Inventory Manager role.
 *     operationId: updateSupplier
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Supplier ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SupplierInput'
 *     responses:
 *       200:
 *         description: Supplier updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Supplier not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put(
  '/suppliers/:id',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  ...updateSupplierValidation(inventoryRepository),
  validate,
  inventoryController.updateSupplier
);

/**
 * @openapi
 * /api/v1/inventory/suppliers/{id}:
 *   delete:
 *     tags:
 *       - Inventory Suppliers
 *     summary: Delete a supplier
 *     description: Permanently delete a supplier. Requires Super Admin, Admin, or Inventory Manager role.
 *     operationId: deleteSupplier
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Supplier ID
 *     responses:
 *       200:
 *         description: Supplier deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Supplier not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete(
  '/suppliers/:id',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  ...supplierIdParam,
  validate,
  inventoryController.deleteSupplier
);

/**
 * @openapi
 * /api/v1/inventory/inventory:
 *   get:
 *     tags:
 *       - Inventory Stock
 *     summary: List inventory records
 *     description: Retrieve inventory stock records with pagination and filtering. Requires Super Admin, Admin, Inventory Manager, or Order Manager role.
 *     operationId: listInventory
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - name: warehouseId
 *         in: query
 *         schema:
 *           type: integer
 *       - name: productId
 *         in: query
 *         schema:
 *           type: integer
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inventory records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/inventory',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager', 'Order Manager'] }),
  ...inventoryListValidation,
  validate,
  inventoryController.listInventory
);

/**
 * @openapi
 * /api/v1/inventory/inventory/{id}:
 *   get:
 *     tags:
 *       - Inventory Stock
 *     summary: Get inventory record by ID
 *     description: Retrieve a single inventory stock record by its numeric ID. Requires Super Admin, Admin, Inventory Manager, or Order Manager role.
 *     operationId: getInventoryById
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Inventory record ID
 *     responses:
 *       200:
 *         description: Inventory record retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Inventory record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/inventory/:id',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager', 'Order Manager'] }),
  [ ...warehouseIdParam ],
  validate,
  inventoryController.getInventoryById
);

/**
 * @openapi
 * /api/v1/inventory/inventory/{id}/reserve:
 *   patch:
 *     tags:
 *       - Inventory Stock
 *     summary: Reserve inventory stock
 *     description: Reserve a quantity of stock for the specified inventory record, typically against an order. Requires Super Admin, Admin, or Inventory Manager role.
 *     operationId: reserveInventory
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Inventory record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReserveStockInput'
 *     responses:
 *       200:
 *         description: Stock reserved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error or insufficient stock
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Inventory record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch(
  '/inventory/:id/reserve',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  ...reserveStockValidation(),
  validate,
  inventoryController.reserveInventory
);

/**
 * @openapi
 * /api/v1/inventory/stock-movements:
 *   post:
 *     tags:
 *       - Inventory Stock Movements
 *     summary: Create a stock movement
 *     description: Record a new stock movement (inbound or outbound). Requires Super Admin, Admin, or Inventory Manager role.
 *     operationId: createStockMovement
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockMovementInput'
 *     responses:
 *       201:
 *         description: Stock movement created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/stock-movements',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  ...createStockMovementValidation(),
  validate,
  inventoryController.createStockMovement
);

/**
 * @openapi
 * /api/v1/inventory/stock-movements:
 *   get:
 *     tags:
 *       - Inventory Stock Movements
 *     summary: List stock movements
 *     description: Retrieve stock movement records with pagination and filtering. Requires Super Admin, Admin, Inventory Manager, or Order Manager role.
 *     operationId: listStockMovements
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - name: warehouseId
 *         in: query
 *         schema:
 *           type: integer
 *       - name: productId
 *         in: query
 *         schema:
 *           type: integer
 *       - name: type
 *         in: query
 *         schema:
 *           type: string
 *           enum: [IN, OUT]
 *     responses:
 *       200:
 *         description: Stock movements retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/stock-movements',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager', 'Order Manager'] }),
  ...stockMovementListValidation,
  validate,
  inventoryController.listStockMovements
);

/**
 * @openapi
 * /api/v1/inventory/stock-movements/{id}:
 *   get:
 *     tags:
 *       - Inventory Stock Movements
 *     summary: Get stock movement by ID
 *     description: Retrieve a single stock movement record by its numeric ID. Requires Super Admin, Admin, Inventory Manager, or Order Manager role.
 *     operationId: getStockMovementById
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Stock movement ID
 *     responses:
 *       200:
 *         description: Stock movement retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Stock movement not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/stock-movements/:id',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager', 'Order Manager'] }),
  [param('id').isInt().withMessage('Invalid stock movement id')],
  validate,
  inventoryController.getStockMovementById
);

/**
 * @openapi
 * /api/v1/inventory/purchase-orders:
 *   post:
 *     tags:
 *       - Inventory Purchase Orders
 *     summary: Create a purchase order
 *     description: Create a new purchase order for a supplier. Requires Super Admin, Admin, or Inventory Manager role.
 *     operationId: createPurchaseOrder
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PurchaseOrderInput'
 *     responses:
 *       201:
 *         description: Purchase order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/purchase-orders',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  ...createPurchaseOrderValidation(inventoryRepository, productRepository),
  validate,
  inventoryController.createPurchaseOrder
);

/**
 * @openapi
 * /api/v1/inventory/purchase-orders:
 *   get:
 *     tags:
 *       - Inventory Purchase Orders
 *     summary: List purchase orders
 *     description: Retrieve purchase orders with pagination and filtering. Requires Super Admin, Admin, Inventory Manager, or Order Manager role.
 *     operationId: listPurchaseOrders
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - name: supplierId
 *         in: query
 *         schema:
 *           type: integer
 *       - name: warehouseId
 *         in: query
 *         schema:
 *           type: integer
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Purchase orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/purchase-orders',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager', 'Order Manager'] }),
  ...purchaseOrderListValidation,
  validate,
  inventoryController.listPurchaseOrders
);

/**
 * @openapi
 * /api/v1/inventory/purchase-orders/{id}:
 *   get:
 *     tags:
 *       - Inventory Purchase Orders
 *     summary: Get purchase order by ID
 *     description: Retrieve a single purchase order by its numeric ID. Requires Super Admin, Admin, Inventory Manager, or Order Manager role.
 *     operationId: getPurchaseOrderById
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Purchase order ID
 *     responses:
 *       200:
 *         description: Purchase order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Purchase order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/purchase-orders/:id',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager', 'Order Manager'] }),
  ...purchaseOrderIdParam(),
  validate,
  inventoryController.getPurchaseOrderById
);

/**
 * @openapi
 * /api/v1/inventory/purchase-orders/{id}:
 *   put:
 *     tags:
 *       - Inventory Purchase Orders
 *     summary: Update a purchase order
 *     description: Update an existing purchase order. Requires Super Admin, Admin, or Inventory Manager role.
 *     operationId: updatePurchaseOrder
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Purchase order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PurchaseOrderInput'
 *     responses:
 *       200:
 *         description: Purchase order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Purchase order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put(
  '/purchase-orders/:id',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  ...updatePurchaseOrderValidation(inventoryRepository, productRepository),
  validate,
  inventoryController.updatePurchaseOrder
);

/**
 * @openapi
 * /api/v1/inventory/purchase-orders/{id}:
 *   delete:
 *     tags:
 *       - Inventory Purchase Orders
 *     summary: Delete a purchase order
 *     description: Permanently delete a purchase order. Requires Super Admin, Admin, or Inventory Manager role.
 *     operationId: deletePurchaseOrder
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Purchase order ID
 *     responses:
 *       200:
 *         description: Purchase order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Purchase order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete(
  '/purchase-orders/:id',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  ...purchaseOrderIdParam(),
  validate,
  inventoryController.deletePurchaseOrder
);

/**
 * @openapi
 * /api/v1/inventory/grn:
 *   post:
 *     tags:
 *       - Inventory GRN
 *     summary: Create a goods receipt note
 *     description: Record a new goods receipt note against a purchase order. Requires Super Admin, Admin, or Inventory Manager role.
 *     operationId: createGoodsReceiptNote
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoodsReceiptNoteInput'
 *     responses:
 *       201:
 *         description: Goods receipt note created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/grn',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  ...createGoodsReceiptNoteValidation(inventoryRepository, productRepository),
  validate,
  inventoryController.createGoodsReceiptNote
);

/**
 * @openapi
 * /api/v1/inventory/grn:
 *   get:
 *     tags:
 *       - Inventory GRN
 *     summary: List goods receipt notes
 *     description: Retrieve goods receipt notes with pagination and filtering. Requires Super Admin, Admin, Inventory Manager, or Order Manager role.
 *     operationId: listGoodsReceiptNotes
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - name: purchaseOrderId
 *         in: query
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Goods receipt notes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/grn',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager', 'Order Manager'] }),
  ...goodsReceiptNoteListValidation,
  validate,
  inventoryController.listGoodsReceiptNotes
);

/**
 * @openapi
 * /api/v1/inventory/grn/{id}:
 *   get:
 *     tags:
 *       - Inventory GRN
 *     summary: Get goods receipt note by ID
 *     description: Retrieve a single goods receipt note by its numeric ID. Requires Super Admin, Admin, Inventory Manager, or Order Manager role.
 *     operationId: getGoodsReceiptNoteById
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Goods receipt note ID
 *     responses:
 *       200:
 *         description: Goods receipt note retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Goods receipt note not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/grn/:id',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager', 'Order Manager'] }),
  ...goodsReceiptNoteIdParam(),
  validate,
  inventoryController.getGoodsReceiptNoteById
);

/**
 * @openapi
 * /api/v1/inventory/grn/{id}:
 *   put:
 *     tags:
 *       - Inventory GRN
 *     summary: Update a goods receipt note
 *     description: Update an existing goods receipt note. Requires Super Admin, Admin, or Inventory Manager role.
 *     operationId: updateGoodsReceiptNote
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Goods receipt note ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoodsReceiptNoteInput'
 *     responses:
 *       200:
 *         description: Goods receipt note updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Goods receipt note not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put(
  '/grn/:id',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  ...createGoodsReceiptNoteValidation(inventoryRepository, productRepository),
  validate,
  inventoryController.updateGoodsReceiptNote
);

/**
 * @openapi
 * /api/v1/inventory/grn/{id}:
 *   delete:
 *     tags:
 *       - Inventory GRN
 *     summary: Delete a goods receipt note
 *     description: Permanently delete a goods receipt note. Requires Super Admin, Admin, or Inventory Manager role.
 *     operationId: deleteGoodsReceiptNote
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Goods receipt note ID
 *     responses:
 *       200:
 *         description: Goods receipt note deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Goods receipt note not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete(
  '/grn/:id',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  ...goodsReceiptNoteIdParam(),
  validate,
  inventoryController.deleteGoodsReceiptNote
);

/**
 * @openapi
 * /api/v1/inventory/stock-adjustments:
 *   post:
 *     tags:
 *       - Inventory Stock Adjustments
 *     summary: Create a stock adjustment
 *     description: Record a new stock adjustment for a warehouse (e.g. from a physical count). Requires Super Admin, Admin, or Inventory Manager role.
 *     operationId: createStockAdjustment
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockAdjustmentInput'
 *     responses:
 *       201:
 *         description: Stock adjustment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/stock-adjustments',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  ...createStockAdjustmentValidation(inventoryRepository, productRepository),
  validate,
  inventoryController.createStockAdjustment
);

/**
 * @openapi
 * /api/v1/inventory/stock-adjustments:
 *   get:
 *     tags:
 *       - Inventory Stock Adjustments
 *     summary: List stock adjustments
 *     description: Retrieve stock adjustments with pagination and filtering. Requires Super Admin, Admin, Inventory Manager, or Order Manager role.
 *     operationId: listStockAdjustments
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - name: warehouseId
 *         in: query
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Stock adjustments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/stock-adjustments',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager', 'Order Manager'] }),
  ...stockAdjustmentListValidation,
  validate,
  inventoryController.listStockAdjustments
);

/**
 * @openapi
 * /api/v1/inventory/stock-adjustments/{id}:
 *   get:
 *     tags:
 *       - Inventory Stock Adjustments
 *     summary: Get stock adjustment by ID
 *     description: Retrieve a single stock adjustment by its numeric ID. Requires Super Admin, Admin, Inventory Manager, or Order Manager role.
 *     operationId: getStockAdjustmentById
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Stock adjustment ID
 *     responses:
 *       200:
 *         description: Stock adjustment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Stock adjustment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/stock-adjustments/:id',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager', 'Order Manager'] }),
  ...stockAdjustmentIdParam(),
  validate,
  inventoryController.getStockAdjustmentById
);

/**
 * @openapi
 * /api/v1/inventory/stock-adjustments/{id}:
 *   put:
 *     tags:
 *       - Inventory Stock Adjustments
 *     summary: Update a stock adjustment
 *     description: Update an existing stock adjustment. Requires Super Admin, Admin, or Inventory Manager role.
 *     operationId: updateStockAdjustment
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Stock adjustment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockAdjustmentInput'
 *     responses:
 *       200:
 *         description: Stock adjustment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Stock adjustment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put(
  '/stock-adjustments/:id',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  ...createStockAdjustmentValidation(inventoryRepository, productRepository),
  validate,
  inventoryController.updateStockAdjustment
);

/**
 * @openapi
 * /api/v1/inventory/stock-adjustments/{id}:
 *   delete:
 *     tags:
 *       - Inventory Stock Adjustments
 *     summary: Delete a stock adjustment
 *     description: Permanently delete a stock adjustment. Requires Super Admin, Admin, or Inventory Manager role.
 *     operationId: deleteStockAdjustment
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Stock adjustment ID
 *     responses:
 *       200:
 *         description: Stock adjustment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Stock adjustment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete(
  '/stock-adjustments/:id',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  ...stockAdjustmentIdParam(),
  validate,
  inventoryController.deleteStockAdjustment
);

/**
 * @openapi
 * /api/v1/inventory/stock-transfers:
 *   post:
 *     tags:
 *       - Inventory Stock Transfers
 *     summary: Create a stock transfer
 *     description: Create a new stock transfer between two warehouses. Requires Super Admin, Admin, or Inventory Manager role.
 *     operationId: createStockTransfer
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockTransferInput'
 *     responses:
 *       201:
 *         description: Stock transfer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/stock-transfers',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  ...createStockTransferValidation(inventoryRepository, productRepository),
  validate,
  inventoryController.createStockTransfer
);

/**
 * @openapi
 * /api/v1/inventory/stock-transfers:
 *   get:
 *     tags:
 *       - Inventory Stock Transfers
 *     summary: List stock transfers
 *     description: Retrieve stock transfers with pagination and filtering. Requires Super Admin, Admin, Inventory Manager, or Order Manager role.
 *     operationId: listStockTransfers
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - name: fromWarehouseId
 *         in: query
 *         schema:
 *           type: integer
 *       - name: toWarehouseId
 *         in: query
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Stock transfers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/stock-transfers',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager', 'Order Manager'] }),
  ...stockTransferListValidation,
  validate,
  inventoryController.listStockTransfers
);

/**
 * @openapi
 * /api/v1/inventory/stock-transfers/{id}:
 *   get:
 *     tags:
 *       - Inventory Stock Transfers
 *     summary: Get stock transfer by ID
 *     description: Retrieve a single stock transfer by its numeric ID. Requires Super Admin, Admin, Inventory Manager, or Order Manager role.
 *     operationId: getStockTransferById
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Stock transfer ID
 *     responses:
 *       200:
 *         description: Stock transfer retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Stock transfer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/stock-transfers/:id',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager', 'Order Manager'] }),
  ...stockTransferIdParam(),
  validate,
  inventoryController.getStockTransferById
);

/**
 * @openapi
 * /api/v1/inventory/stock-transfers/{id}:
 *   put:
 *     tags:
 *       - Inventory Stock Transfers
 *     summary: Update a stock transfer
 *     description: Update an existing stock transfer. Requires Super Admin, Admin, or Inventory Manager role.
 *     operationId: updateStockTransfer
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Stock transfer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockTransferInput'
 *     responses:
 *       200:
 *         description: Stock transfer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Stock transfer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put(
  '/stock-transfers/:id',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  ...createStockTransferValidation(inventoryRepository, productRepository),
  validate,
  inventoryController.updateStockTransfer
);

/**
 * @openapi
 * /api/v1/inventory/stock-transfers/{id}:
 *   delete:
 *     tags:
 *       - Inventory Stock Transfers
 *     summary: Delete a stock transfer
 *     description: Permanently delete a stock transfer. Requires Super Admin, Admin, or Inventory Manager role.
 *     operationId: deleteStockTransfer
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Stock transfer ID
 *     responses:
 *       200:
 *         description: Stock transfer deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Stock transfer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete(
  '/stock-transfers/:id',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  ...stockTransferIdParam(),
  validate,
  inventoryController.deleteStockTransfer
);

/**
 * @openapi
 * /api/v1/inventory/reports/current-stock:
 *   get:
 *     tags:
 *       - Inventory Reports
 *     summary: Current stock report
 *     description: Retrieve a report of current stock levels across warehouses. Requires Super Admin, Admin, Inventory Manager, or Order Manager role.
 *     operationId: currentStockReport
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - name: warehouseId
 *         in: query
 *         schema:
 *           type: integer
 *       - name: productId
 *         in: query
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Current stock report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/reports/current-stock',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager', 'Order Manager'] }),
  ...inventoryListValidation,
  validate,
  inventoryController.currentStockReport
);

/**
 * @openapi
 * /api/v1/inventory/reports/low-stock:
 *   get:
 *     tags:
 *       - Inventory Reports
 *     summary: Low stock report
 *     description: Retrieve a report of products at or below their reorder threshold. Requires Super Admin, Admin, Inventory Manager, or Order Manager role.
 *     operationId: lowStockReport
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - name: warehouseId
 *         in: query
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Low stock report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/reports/low-stock',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager', 'Order Manager'] }),
  ...reportValidation,
  validate,
  inventoryController.lowStockReport
);

/**
 * @openapi
 * /api/v1/inventory/reports/stock-ledger:
 *   get:
 *     tags:
 *       - Inventory Reports
 *     summary: Stock ledger report
 *     description: Retrieve a chronological stock ledger report of inventory movements. Requires Super Admin, Admin, Inventory Manager, or Order Manager role.
 *     operationId: stockLedger
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - name: warehouseId
 *         in: query
 *         schema:
 *           type: integer
 *       - name: productId
 *         in: query
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Stock ledger retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/reports/stock-ledger',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager', 'Order Manager'] }),
  ...stockMovementListValidation,
  validate,
  inventoryController.stockLedger
);

/**
 * @openapi
 * /api/v1/inventory/reports/movement:
 *   get:
 *     tags:
 *       - Inventory Reports
 *     summary: Stock movement report
 *     description: Retrieve a summarized report of stock movements over time. Requires Super Admin, Admin, Inventory Manager, or Order Manager role.
 *     operationId: movementReport
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - name: warehouseId
 *         in: query
 *         schema:
 *           type: integer
 *       - name: productId
 *         in: query
 *         schema:
 *           type: integer
 *       - name: type
 *         in: query
 *         schema:
 *           type: string
 *           enum: [IN, OUT]
 *     responses:
 *       200:
 *         description: Movement report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/reports/movement',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager', 'Order Manager'] }),
  ...stockMovementListValidation,
  validate,
  inventoryController.movementReport
);

/**
 * @openapi
 * /api/v1/inventory/reports/purchase:
 *   get:
 *     tags:
 *       - Inventory Reports
 *     summary: Purchase report
 *     description: Retrieve a summarized report of purchase order activity. Requires Super Admin, Admin, Inventory Manager, or Order Manager role.
 *     operationId: purchaseReport
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - name: supplierId
 *         in: query
 *         schema:
 *           type: integer
 *       - name: warehouseId
 *         in: query
 *         schema:
 *           type: integer
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Purchase report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/reports/purchase',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager', 'Order Manager'] }),
  ...purchaseOrderListValidation,
  validate,
  inventoryController.purchaseReport
);

/**
 * @openapi
 * /api/v1/inventory/reports/warehouse:
 *   get:
 *     tags:
 *       - Inventory Reports
 *     summary: Warehouse report
 *     description: Retrieve a summarized report of warehouse activity and stock distribution. Requires Super Admin, Admin, Inventory Manager, or Order Manager role.
 *     operationId: warehouseReport
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *       - name: isActive
 *         in: query
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Warehouse report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/reports/warehouse',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager', 'Order Manager'] }),
  ...warehouseListValidation,
  validate,
  inventoryController.warehouseReport
);

/**
 * @openapi
 * /api/v1/inventory/reports/supplier:
 *   get:
 *     tags:
 *       - Inventory Reports
 *     summary: Supplier report
 *     description: Retrieve a summarized report of supplier activity and purchasing history. Requires Super Admin, Admin, Inventory Manager, or Order Manager role.
 *     operationId: supplierReport
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Supplier report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/reports/supplier',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager', 'Order Manager'] }),
  ...supplierListValidation,
  validate,
  inventoryController.supplierReport
);

export default router;