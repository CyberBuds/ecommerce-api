import { NextFunction, Request, Response } from 'express';
import apiResponse from '../utils/apiResponse';
import InventoryService from '../services/inventory.service';

export function createInventoryController(service: InventoryService) {
  return {
    createWarehouse: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dto = req.body;
        const warehouse = await service.createWarehouse(dto);
        return apiResponse.created(res, warehouse, 'Warehouse created');
      } catch (error) {
        next(error);
      }
    },

    listWarehouses: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = req.query as any;
        const result = await service.listWarehouses(query);
        return apiResponse.success(res, result, 'Warehouses fetched');
      } catch (error) {
        next(error);
      }
    },

    getWarehouseById: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const warehouse = await service.getWarehouseById(id);
        return apiResponse.success(res, warehouse, 'Warehouse fetched');
      } catch (error) {
        next(error);
      }
    },

    updateWarehouse: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const dto = req.body;
        const warehouse = await service.updateWarehouse(id, dto);
        return apiResponse.success(res, warehouse, 'Warehouse updated');
      } catch (error) {
        next(error);
      }
    },

    deleteWarehouse: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        await service.deleteWarehouse(id);
        return apiResponse.success(res, null, 'Warehouse deleted');
      } catch (error) {
        next(error);
      }
    },

    createSupplier: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dto = req.body;
        const supplier = await service.createSupplier(dto);
        return apiResponse.created(res, supplier, 'Supplier created');
      } catch (error) {
        next(error);
      }
    },

    listSuppliers: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = req.query as any;
        const result = await service.listSuppliers(query);
        return apiResponse.success(res, result, 'Suppliers fetched');
      } catch (error) {
        next(error);
      }
    },

    getSupplierById: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const supplier = await service.getSupplierById(id);
        return apiResponse.success(res, supplier, 'Supplier fetched');
      } catch (error) {
        next(error);
      }
    },

    updateSupplier: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const dto = req.body;
        const supplier = await service.updateSupplier(id, dto);
        return apiResponse.success(res, supplier, 'Supplier updated');
      } catch (error) {
        next(error);
      }
    },

    deleteSupplier: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        await service.deleteSupplier(id);
        return apiResponse.success(res, null, 'Supplier deleted');
      } catch (error) {
        next(error);
      }
    },

    listInventory: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = req.query as any;
        const result = await service.listInventory(query);
        return apiResponse.success(res, result, 'Inventory records fetched');
      } catch (error) {
        next(error);
      }
    },

    getInventoryById: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const inventory = await service.getInventoryById(id);
        return apiResponse.success(res, inventory, 'Inventory fetched');
      } catch (error) {
        next(error);
      }
    },

    reserveInventory: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const dto = req.body;
        const result = await service.reserveInventory(id, dto);
        return apiResponse.success(res, result, 'Inventory reservation updated');
      } catch (error) {
        next(error);
      }
    },

    createStockMovement: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dto = req.body;
        const actorId = (req as any).user?.sub;
        const movement = await service.createStockMovement(dto, actorId);
        return apiResponse.created(res, movement, 'Stock movement created');
      } catch (error) {
        next(error);
      }
    },

    listStockMovements: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = req.query as any;
        const result = await service.listStockMovements(query);
        return apiResponse.success(res, result, 'Stock movements fetched');
      } catch (error) {
        next(error);
      }
    },

    getStockMovementById: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const movement = await service.getStockMovementById(id);
        return apiResponse.success(res, movement, 'Stock movement fetched');
      } catch (error) {
        next(error);
      }
    },

    createPurchaseOrder: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dto = req.body;
        const createdBy = (req as any).user?.sub;
        const order = await service.createPurchaseOrder(dto, createdBy);
        return apiResponse.created(res, order, 'Purchase order created');
      } catch (error) {
        next(error);
      }
    },

    listPurchaseOrders: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = req.query as any;
        const result = await service.listPurchaseOrders(query);
        return apiResponse.success(res, result, 'Purchase orders fetched');
      } catch (error) {
        next(error);
      }
    },

    getPurchaseOrderById: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const order = await service.getPurchaseOrderById(id);
        return apiResponse.success(res, order, 'Purchase order fetched');
      } catch (error) {
        next(error);
      }
    },

    updatePurchaseOrder: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const dto = req.body;
        const updatedBy = (req as any).user?.sub;
        const order = await service.updatePurchaseOrder(id, dto, updatedBy);
        return apiResponse.success(res, order, 'Purchase order updated');
      } catch (error) {
        next(error);
      }
    },

    deletePurchaseOrder: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        await service.deletePurchaseOrder(id);
        return apiResponse.success(res, null, 'Purchase order deleted');
      } catch (error) {
        next(error);
      }
    },

    createGoodsReceiptNote: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dto = req.body;
        const createdBy = (req as any).user?.sub;
        const grn = await service.createGoodsReceiptNote(dto, createdBy);
        return apiResponse.created(res, grn, 'Goods receipt note created');
      } catch (error) {
        next(error);
      }
    },

    listGoodsReceiptNotes: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = req.query as any;
        const result = await service.listGoodsReceiptNotes(query);
        return apiResponse.success(res, result, 'GRNs fetched');
      } catch (error) {
        next(error);
      }
    },

    getGoodsReceiptNoteById: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const grn = await service.getGoodsReceiptNoteById(id);
        return apiResponse.success(res, grn, 'GRN fetched');
      } catch (error) {
        next(error);
      }
    },

    updateGoodsReceiptNote: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const dto = req.body;
        const updatedBy = (req as any).user?.sub;
        const grn = await service.updateGoodsReceiptNote(id, dto, updatedBy);
        return apiResponse.success(res, grn, 'GRN updated');
      } catch (error) {
        next(error);
      }
    },

    deleteGoodsReceiptNote: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        await service.deleteGoodsReceiptNote(id);
        return apiResponse.success(res, null, 'GRN deleted');
      } catch (error) {
        next(error);
      }
    },

    createStockAdjustment: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dto = req.body;
        const createdBy = (req as any).user?.sub;
        const adjustment = await service.createStockAdjustment(dto, createdBy);
        return apiResponse.created(res, adjustment, 'Stock adjustment created');
      } catch (error) {
        next(error);
      }
    },

    listStockAdjustments: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = req.query as any;
        const result = await service.listStockAdjustments(query);
        return apiResponse.success(res, result, 'Stock adjustments fetched');
      } catch (error) {
        next(error);
      }
    },

    getStockAdjustmentById: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const adjustment = await service.getStockAdjustmentById(id);
        return apiResponse.success(res, adjustment, 'Stock adjustment fetched');
      } catch (error) {
        next(error);
      }
    },

    updateStockAdjustment: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const dto = req.body;
        const updatedBy = (req as any).user?.sub;
        const adjustment = await service.updateStockAdjustment(id, dto, updatedBy);
        return apiResponse.success(res, adjustment, 'Stock adjustment updated');
      } catch (error) {
        next(error);
      }
    },

    deleteStockAdjustment: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        await service.deleteStockAdjustment(id);
        return apiResponse.success(res, null, 'Stock adjustment deleted');
      } catch (error) {
        next(error);
      }
    },

    createStockTransfer: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dto = req.body;
        const createdBy = (req as any).user?.sub;
        const transfer = await service.createStockTransfer(dto, createdBy);
        return apiResponse.created(res, transfer, 'Stock transfer created');
      } catch (error) {
        next(error);
      }
    },

    listStockTransfers: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = req.query as any;
        const result = await service.listStockTransfers(query);
        return apiResponse.success(res, result, 'Stock transfers fetched');
      } catch (error) {
        next(error);
      }
    },

    getStockTransferById: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const transfer = await service.getStockTransferById(id);
        return apiResponse.success(res, transfer, 'Stock transfer fetched');
      } catch (error) {
        next(error);
      }
    },

    updateStockTransfer: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const dto = req.body;
        const updatedBy = (req as any).user?.sub;
        const transfer = await service.updateStockTransfer(id, dto, updatedBy);
        return apiResponse.success(res, transfer, 'Stock transfer updated');
      } catch (error) {
        next(error);
      }
    },

    deleteStockTransfer: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        await service.deleteStockTransfer(id);
        return apiResponse.success(res, null, 'Stock transfer deleted');
      } catch (error) {
        next(error);
      }
    },

    currentStockReport: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = req.query as any;
        const result = await service.listInventory(query);
        return apiResponse.success(res, result, 'Current stock report fetched');
      } catch (error) {
        next(error);
      }
    },

    lowStockReport: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = req.query as any;
        const minimumStock = Number(req.query.minimumStock) || 0;
        const result = await service.listLowStockReport(minimumStock, query);
        return apiResponse.success(res, result, 'Low stock report fetched');
      } catch (error) {
        next(error);
      }
    },

    stockLedger: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = req.query as any;
        const result = await service.stockLedger(query.productId, query.variantId, query.warehouseId, query);
        return apiResponse.success(res, result, 'Stock ledger fetched');
      } catch (error) {
        next(error);
      }
    },

    movementReport: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = req.query as any;
        const result = await service.movementReport(query);
        return apiResponse.success(res, result, 'Movement report fetched');
      } catch (error) {
        next(error);
      }
    },

    purchaseReport: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = req.query as any;
        const result = await service.purchaseReport(query);
        return apiResponse.success(res, result, 'Purchase report fetched');
      } catch (error) {
        next(error);
      }
    },

    warehouseReport: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = req.query as any;
        const result = await service.warehouseReport(query);
        return apiResponse.success(res, result, 'Warehouse report fetched');
      } catch (error) {
        next(error);
      }
    },

    supplierReport: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = req.query as any;
        const result = await service.supplierReport(query);
        return apiResponse.success(res, result, 'Supplier report fetched');
      } catch (error) {
        next(error);
      }
    }
  };
}
