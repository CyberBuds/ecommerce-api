import { NextFunction, Request, Response } from 'express';
import apiResponse from '../utils/apiResponse';
import ProductService from '../services/product.service';

export function createProductController(service: ProductService) {
  return {
    create: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dto = req.body;
        const createdBy = (req as any).user?.sub;
        const product = await service.create(dto, createdBy);
        return apiResponse.created(res, product, 'Product created');
      } catch (error) {
        next(error);
      }
    },

    update: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const dto = req.body;
        const updatedBy = (req as any).user?.sub;
        const product = await service.update(id, dto, updatedBy);
        return apiResponse.success(res, product, 'Product updated');
      } catch (error) {
        next(error);
      }
    },

    delete: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        await service.delete(id);
        return apiResponse.success(res, null, 'Product deleted');
      } catch (error) {
        next(error);
      }
    },

    list: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = req.query as any;
        const result = await service.list(query);
        return apiResponse.success(res, result, 'Products fetched');
      } catch (error) {
        next(error);
      }
    },

    getById: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const product = await service.getById(id);
        return apiResponse.success(res, product, 'Product fetched');
      } catch (error) {
        next(error);
      }
    },

    createVariant: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const productId = Number(req.params.id);
        const variant = req.body;
        const createdBy = (req as any).user?.sub;
        const result = await service.createVariant(productId, variant, createdBy);
        return apiResponse.created(res, result, 'Product variant created');
      } catch (error) {
        next(error);
      }
    },

    updateVariant: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const productId = Number(req.params.id);
        const variantId = Number(req.params.variantId);
        const payload = req.body;
        const updatedBy = (req as any).user?.sub;
        const result = await service.updateVariant(productId, variantId, payload, updatedBy);
        return apiResponse.success(res, result, 'Product variant updated');
      } catch (error) {
        next(error);
      }
    },

    deleteVariant: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const productId = Number(req.params.id);
        const variantId = Number(req.params.variantId);
        await service.deleteVariant(productId, variantId);
        return apiResponse.success(res, null, 'Product variant deleted');
      } catch (error) {
        next(error);
      }
    },

    listVariants: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const productId = Number(req.params.id);
        const result = await service.listVariants(productId);
        return apiResponse.success(res, result, 'Product variants fetched');
      } catch (error) {
        next(error);
      }
    },

    createAttributes: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const productId = Number(req.params.id);
        const attributes = req.body;
        const result = await service.createAttributes(productId, attributes);
        return apiResponse.created(res, result, 'Product attributes saved');
      } catch (error) {
        next(error);
      }
    },

    updateAttribute: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const productId = Number(req.params.id);
        const attributeId = Number(req.params.attributeId);
        const payload = req.body;
        const result = await service.updateAttribute(productId, attributeId, payload);
        return apiResponse.success(res, result, 'Product attribute updated');
      } catch (error) {
        next(error);
      }
    },

    deleteAttribute: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const productId = Number(req.params.id);
        const attributeId = Number(req.params.attributeId);
        await service.deleteAttribute(productId, attributeId);
        return apiResponse.success(res, null, 'Product attribute deleted');
      } catch (error) {
        next(error);
      }
    },

    listAttributes: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const productId = Number(req.params.id);
        const result = await service.listAttributes(productId);
        return apiResponse.success(res, result, 'Product attributes fetched');
      } catch (error) {
        next(error);
      }
    },

    createRelations: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const productId = Number(req.params.id);
        const relations = req.body;
        const result = await service.createRelations(productId, relations);
        return apiResponse.created(res, result, 'Product relations saved');
      } catch (error) {
        next(error);
      }
    },

    deleteRelation: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const relationId = Number(req.params.relationId);
        await service.deleteRelation(relationId);
        return apiResponse.success(res, null, 'Product relation deleted');
      } catch (error) {
        next(error);
      }
    },

    listRelations: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const productId = Number(req.params.id);
        const result = await service.listRelations(productId);
        return apiResponse.success(res, result, 'Product relations fetched');
      } catch (error) {
        next(error);
      }
    },

    updateWorkflow: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const productId = Number(req.params.id);
        const dto = req.body;
        const actorId = (req as any).user?.sub;
        const result = await service.updateWorkflow(productId, dto, actorId);
        return apiResponse.success(res, result, 'Product workflow updated');
      } catch (error) {
        next(error);
      }
    },

    duplicate: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const productId = Number(req.params.id);
        const duplicated = await service.duplicate(productId);
        return apiResponse.created(res, duplicated, 'Product duplicated');
      } catch (error) {
        next(error);
      }
    },

    bulkImport: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const file = (req as any).file;
        if (!file) {
          return apiResponse.badRequest(res, null, 'Import file is required');
        }
        const format = req.query.format as string | undefined;
        const result = await service.bulkImport(file, format);
        return apiResponse.success(res, result, 'Bulk product import completed');
      } catch (error) {
        next(error);
      }
    },

    export: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const format = (req.query.format as string) || 'csv';
        const exportData = await service.export(req.query as any, format);
        res.setHeader('Content-Disposition', `attachment; filename=products.${format}`);
        res.setHeader('Content-Type', exportData.contentType);
        return res.send(exportData.data);
      } catch (error) {
        next(error);
      }
    },

    listAuditLogs: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const productId = Number(req.params.id);
        const result = await service.listAuditLogs(productId);
        return apiResponse.success(res, result, 'Product audit logs fetched');
      } catch (error) {
        next(error);
      }
    }
  };
}

export default createProductController;
