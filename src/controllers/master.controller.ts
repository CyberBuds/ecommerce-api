import { NextFunction, Request, Response } from 'express';
import apiResponse from '../utils/apiResponse';
import MasterService from '../services/master.service';

export function createMasterController(service: MasterService) {
  return {
    create: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dto = req.body;
        const createdBy = (req as any).user?.sub;
        const item = await service.create(dto, createdBy);
        return apiResponse.created(res, item, 'Record created');
      } catch (error) {
        next(error);
      }
    },

    list: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = req.query as any;
        const result = await service.list(query);
        return apiResponse.success(res, result, 'Records fetched');
      } catch (error) {
        next(error);
      }
    },

    getById: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const item = await service.getById(id);
        return apiResponse.success(res, item, 'Record fetched');
      } catch (error) {
        next(error);
      }
    },

    update: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const dto = req.body;
        const updatedBy = (req as any).user?.sub;
        const item = await service.update(id, dto, updatedBy);
        return apiResponse.success(res, item, 'Record updated');
      } catch (error) {
        next(error);
      }
    },

    delete: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const deletedBy = (req as any).user?.sub;
        await service.delete(id, deletedBy);
        return apiResponse.success(res, null, 'Record deleted');
      } catch (error) {
        next(error);
      }
    },

    setStatus: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const { status } = req.body;
        const updatedBy = (req as any).user?.sub;
        const item = await service.setStatus(id, status, updatedBy);
        return apiResponse.success(res, item, 'Status updated');
      } catch (error) {
        next(error);
      }
    },

    setDisplayOrder: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const { displayOrder } = req.body;
        const updatedBy = (req as any).user?.sub;
        const item = await service.setDisplayOrder(id, Number(displayOrder), updatedBy);
        return apiResponse.success(res, item, 'Display order updated');
      } catch (error) {
        next(error);
      }
    },

    bulkImport: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { items } = req.body;
        const createdBy = (req as any).user?.sub;
        const createdItems = await service.bulkImport(items, createdBy);
        return apiResponse.created(res, createdItems, 'Records imported');
      } catch (error) {
        next(error);
      }
    },

    bulkExport: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = req.query as any;
        const result = await service.bulkExport(query);
        return apiResponse.success(res, result, 'Records exported');
      } catch (error) {
        next(error);
      }
    }
  };
}

export default createMasterController;
