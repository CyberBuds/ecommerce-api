import { NextFunction, Request, Response } from 'express';
import apiResponse from '../utils/apiResponse';
import ShippingService from '../services/shipping.service';

export default function createShippingController(service: ShippingService) {
  return {
    listMethods: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = req.query as any;
        const result = await service.listMethods(query);
        return apiResponse.success(res, result, 'Shipping methods fetched');
      } catch (error) {
        next(error);
      }
    },

    listDeliverySlots: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = req.query as any;
        const result = await service.listDeliverySlots(query);
        return apiResponse.success(res, result, 'Delivery slots fetched');
      } catch (error) {
        next(error);
      }
    }
  };
}
