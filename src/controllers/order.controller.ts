import { NextFunction, Request, Response } from 'express';
import apiResponse from '../utils/apiResponse';
import OrderService from '../services/order.service';

export default function createOrderController(service: OrderService) {
  return {
    createOrder: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dto = req.body;
        const actorId = (req as any).user?.sub ? Number((req as any).user.sub) : undefined;
        const order = await service.create(dto, actorId);
        return apiResponse.created(res, order, 'Order created successfully');
      } catch (error) {
        next(error);
      }
    },

    listOrders: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = req.query as any;
        const currentCustomerId = (req as any).user?.sub ? Number((req as any).user.sub) : undefined;
        const orders = await service.list(query, currentCustomerId);
        return apiResponse.success(res, orders, 'Orders fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    getOrder: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const currentCustomerId = (req as any).user?.sub ? Number((req as any).user.sub) : undefined;
        const order = await service.getById(id, currentCustomerId);
        return apiResponse.success(res, order, 'Order fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    updateOrder: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const dto = req.body;
        const actorId = (req as any).user?.sub ? Number((req as any).user.sub) : undefined;
        const updated = await service.update(id, dto, actorId);
        return apiResponse.success(res, updated, 'Order updated successfully');
      } catch (error) {
        next(error);
      }
    },

    updateStatus: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const dto = req.body;
        const actorId = (req as any).user?.sub ? Number((req as any).user.sub) : undefined;
        const updated = await service.updateStatus(id, dto, actorId);
        return apiResponse.success(res, updated, 'Order status updated successfully');
      } catch (error) {
        next(error);
      }
    },

    cancelOrder: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const actorId = (req as any).user?.sub ? Number((req as any).user.sub) : undefined;
        const cancelled = await service.cancelOrder(id, actorId);
        return apiResponse.success(res, cancelled, 'Order cancelled successfully');
      } catch (error) {
        next(error);
      }
    },

    createReturnRequest: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const dto = req.body;
        const actorId = (req as any).user?.sub ? Number((req as any).user.sub) : undefined;
        const returnRequest = await service.createReturnRequest(id, dto, actorId);
        return apiResponse.created(res, returnRequest, 'Return request created successfully');
      } catch (error) {
        next(error);
      }
    },

    createRefund: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const dto = req.body;
        const actorId = (req as any).user?.sub ? Number((req as any).user.sub) : undefined;
        const refund = await service.createRefund(id, dto, actorId);
        return apiResponse.created(res, refund, 'Refund processed successfully');
      } catch (error) {
        next(error);
      }
    },

    getTimeline: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const timeline = await service.getTimeline(id);
        return apiResponse.success(res, timeline, 'Order timeline fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    getInvoice: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const invoice = await service.getInvoice(id);
        return apiResponse.success(res, invoice, 'Invoice fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    getShipments: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const shipments = await service.getShipments(id);
        return apiResponse.success(res, shipments, 'Order shipments fetched successfully');
      } catch (error) {
        next(error);
      }
    }
  };
}
