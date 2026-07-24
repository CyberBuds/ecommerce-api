import { NextFunction, Request, Response } from 'express';
import apiResponse from '../utils/apiResponse';
import CartService from '../services/cart.service';
import ShippingService from '../services/shipping.service';

export default function createCartController(service: CartService, shippingService: ShippingService) {
  return {
    getCart: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const customerId = (req as any).user?.sub ? Number((req as any).user.sub) : undefined;
        const sessionId = req.query.sessionId as string | undefined;
        const cart = await service.getCart(customerId, sessionId);
        return apiResponse.success(res, cart, 'Cart fetched');
      } catch (error) {
        next(error);
      }
    },

    addItem: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const customerId = (req as any).user?.sub ? Number((req as any).user.sub) : undefined;
        const sessionId = req.body.sessionId as string | undefined;
        const dto = req.body;
        const createdBy = (req as any).user?.sub;
        const cart = await service.addItem(dto, customerId, sessionId, createdBy);
        return apiResponse.success(res, cart, 'Cart item added');
      } catch (error) {
        next(error);
      }
    },

    updateItem: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const itemId = Number(req.params.id);
        const dto = req.body;
        const cart = await service.updateItem(itemId, dto);
        return apiResponse.success(res, cart, 'Cart item updated');
      } catch (error) {
        next(error);
      }
    },

    removeItem: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const itemId = Number(req.params.id);
        const cart = await service.removeItem(itemId);
        return apiResponse.success(res, cart, 'Cart item removed');
      } catch (error) {
        next(error);
      }
    },

    saveCart: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const customerId = (req as any).user?.sub ? Number((req as any).user.sub) : undefined;
        const dto = req.body;
        const savedCart = await service.saveCart(customerId, dto);
        return apiResponse.created(res, savedCart, 'Cart saved');
      } catch (error) {
        next(error);
      }
    },

    restoreCart: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const customerId = (req as any).user?.sub ? Number((req as any).user.sub) : undefined;
        const dto = req.body;
        const cart = await service.restoreCart(customerId, dto);
        return apiResponse.success(res, cart, 'Cart restored');
      } catch (error) {
        next(error);
      }
    },

    applyCoupon: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const customerId = (req as any).user?.sub ? Number((req as any).user.sub) : undefined;
        const sessionId = req.body.sessionId as string | undefined;
        const dto = req.body;
        const cart = await service.applyCoupon(customerId, sessionId, dto);
        return apiResponse.success(res, cart, 'Coupon applied');
      } catch (error) {
        next(error);
      }
    },

    removeCoupon: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const customerId = (req as any).user?.sub ? Number((req as any).user.sub) : undefined;
        const sessionId = req.query.sessionId as string | undefined;
        const cart = await service.removeCoupon(customerId, sessionId);
        return apiResponse.success(res, cart, 'Coupon removed');
      } catch (error) {
        next(error);
      }
    },

    estimateShipping: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = req.query as any;
        const estimate = await shippingService.estimateShipping(query);
        return apiResponse.success(res, estimate, 'Shipping estimate fetched');
      } catch (error) {
        next(error);
      }
    },

    checkout: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const customerId = (req as any).user?.sub ? Number((req as any).user.sub) : undefined;
        const sessionId = req.body.sessionId as string | undefined;
        const dto = req.body;
        const payment = await service.checkout(customerId, sessionId, dto);
        return apiResponse.success(res, payment, 'Checkout completed');
      } catch (error) {
        next(error);
      }
    }
  };
}
