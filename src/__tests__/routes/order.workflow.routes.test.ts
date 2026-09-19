jest.mock('../../middlewares/authenticate', () => ({
  __esModule: true,
  default: (_req: any, _res: any, next: any) => next(),
}));

jest.mock('../../middlewares/authorize', () => ({
  __esModule: true,
  default: () => (_req: any, _res: any, next: any) => next(),
}));

jest.mock('../../middlewares/validation.middleware', () => ({
  __esModule: true,
  default: (_req: any, _res: any, next: any) => next(),
}));

jest.mock('../../controllers/order.controller', () => ({
  __esModule: true,
  default: () => ({
    createOrder: (_req: any, res: any) => res.status(200).json({ ok: true }),
    listOrders: (_req: any, res: any) => res.status(200).json({ ok: true }),
    getOrder: (_req: any, res: any) => res.status(200).json({ ok: true }),
    updateOrder: (_req: any, res: any) => res.status(200).json({ ok: true }),
    updateStatus: (_req: any, res: any) => res.status(200).json({ ok: true }),
    cancelOrder: (_req: any, res: any) => res.status(200).json({ ok: true }),
    createReturnRequest: (_req: any, res: any) => res.status(200).json({ ok: true }),
    createRefund: (_req: any, res: any) => res.status(200).json({ ok: true }),
    getTimeline: (_req: any, res: any) => res.status(200).json({ ok: true }),
    getInvoice: (_req: any, res: any) => res.status(200).json({ ok: true }),
    listShipments: (_req: any, res: any) => res.status(200).json({ ok: true }),
    getShipments: (_req: any, res: any) => res.status(200).json({ ok: true }),
    startPicking: (_req: any, res: any) => res.status(200).json({ ok: true }),
    updateItemPicking: (_req: any, res: any) => res.status(200).json({ ok: true }),
    completePicking: (_req: any, res: any) => res.status(200).json({ ok: true }),
    updateItemPacking: (_req: any, res: any) => res.status(200).json({ ok: true }),
    completePacking: (_req: any, res: any) => res.status(200).json({ ok: true }),
    createShipment: (_req: any, res: any) => res.status(200).json({ ok: true }),
    updateShipmentStatus: (_req: any, res: any) => res.status(200).json({ ok: true }),
  }),
}));

import express from 'express';
import request from 'supertest';
import v1Router from '../../routes/v1';

describe('Order workflow routes', () => {
  const app = express();
  app.use(express.json());
  app.use('/api/v1', v1Router);

  it('exposes the shipment listing endpoint', async () => {
    const res = await request(app).get('/api/v1/shipments');
    expect(res.status).toBe(200);
  });

  it('exposes the order picking start endpoint', async () => {
    const res = await request(app).put('/api/v1/orders/3/picking/start');
    expect(res.status).toBe(200);
  });
});
