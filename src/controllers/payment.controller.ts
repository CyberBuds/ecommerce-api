import { NextFunction, Request, Response } from 'express';
import apiResponse from '../utils/apiResponse';
import PaymentService from '../services/payment.service';

export default function createPaymentController(service: PaymentService) {
  return {
    /**
     * @openapi
     * /api/v1/payments/create:
     *   post:
     *     summary: Create a new payment request for an order
     */
    createPayment: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dto = req.body;
        const actorId = (req as any).user?.sub ? Number((req as any).user.sub) : undefined;
        const actorRole = (req as any).user?.roleName || (req as any).user?.role;
        const payment = await service.create(dto, actorId, actorRole);
        return apiResponse.created(res, payment, 'Payment request created successfully');
      } catch (error) {
        next(error);
      }
    },

    /**
     * @openapi
     * /api/v1/payments/verify:
     *   post:
     *     summary: Verify payment status from gateway
     */
    verifyPayment: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dto = req.body;
        const actorId = (req as any).user?.sub ? Number((req as any).user.sub) : undefined;
        const actorRole = (req as any).user?.roleName || (req as any).user?.role;
        const payment = await service.verify(dto, actorId, actorRole);
        return apiResponse.success(res, payment, 'Payment verified successfully');
      } catch (error) {
        next(error);
      }
    },

    /**
     * @openapi
     * /api/v1/payments/capture:
     *   post:
     *     summary: Capture an authorized payment
     */
    capturePayment: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dto = req.body;
        const actorId = (req as any).user?.sub ? Number((req as any).user.sub) : undefined;
        const payment = await service.capture(dto, actorId);
        return apiResponse.success(res, payment, 'Payment captured successfully');
      } catch (error) {
        next(error);
      }
    },

    /**
     * @openapi
     * /api/v1/payments/refund:
     *   post:
     *     summary: Process a refund for a payment
     */
    refundPayment: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dto = req.body;
        const actorId = (req as any).user?.sub ? Number((req as any).user.sub) : undefined;
        const payment = await service.refund(dto, actorId);
        return apiResponse.success(res, payment, 'Refund processed successfully');
      } catch (error) {
        next(error);
      }
    },

    /**
     * @openapi
     * /api/v1/payments/retry:
     *   post:
     *     summary: Retry a failed payment attempt
     */
    retryPayment: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dto = req.body;
        const actorId = (req as any).user?.sub ? Number((req as any).user.sub) : undefined;
        const payment = await service.retry(dto, actorId);
        return apiResponse.success(res, payment, 'Payment retry scheduled successfully');
      } catch (error) {
        next(error);
      }
    },

    listPayments: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = req.query as any;
        const currentCustomerId = (req as any).user?.sub ? Number((req as any).user.sub) : undefined;
        const payments = await service.list(query, currentCustomerId);
        return apiResponse.success(res, payments, 'Payments fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    getPayment: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const currentCustomerId = (req as any).user?.sub ? Number((req as any).user.sub) : undefined;
        const payment = await service.getById(id, currentCustomerId);
        return apiResponse.success(res, payment, 'Payment fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    getByOrderId: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const orderId = Number(req.params.orderId);
        const currentCustomerId = (req as any).user?.sub ? Number((req as any).user.sub) : undefined;
        const payments = await service.getByOrderId(orderId, currentCustomerId);
        return apiResponse.success(res, payments, 'Order payments fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    handleWebhook: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const provider = req.params.provider;
        const headers = req.headers as Record<string, unknown>;
        const result = await service.handleWebhook(provider, req.body, headers);
        return apiResponse.success(res, result, 'Webhook processed');
      } catch (error) {
        next(error);
      }
    },

    listSettlements: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = req.query as any;
        const settlements = await service.listSettlements(query);
        return apiResponse.success(res, settlements, 'Settlements fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    listReconciliations: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = req.query as any;
        const reconciliations = await service.listReconciliations(query);
        return apiResponse.success(res, reconciliations, 'Reconciliation records fetched successfully');
      } catch (error) {
        next(error);
      }
    }
  };
}
