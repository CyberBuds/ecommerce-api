import { Router } from 'express';
import createShippingController from '../controllers/shipping.controller';
import CartRepository from '../repositories/cart.repository';
import OrderRepository from '../repositories/order.repository';
import OrderService from '../services/order.service';
import ProductRepository from '../repositories/product.repository';
import InventoryRepository from '../repositories/inventory.repository';
import CustomerRepository from '../repositories/customer.repository';
import ShippingService from '../services/shipping.service';
import validate from '../middlewares/validation.middleware';
import authenticate from '../middlewares/authenticate';
import authorize from '../middlewares/authorize';
import { deliverySlotListValidation, shippingMethodListValidation } from '../validations/shipping.validation';
import createOrderController from '../controllers/order.controller';
import apiResponse from '../utils/apiResponse';

const router = Router();
const cartRepository = new CartRepository();
const shippingService = new ShippingService(cartRepository);
const controller = createShippingController(shippingService);
const orderService = new OrderService(new OrderRepository(), cartRepository, new InventoryRepository(), new ProductRepository(), new CustomerRepository());
const orderController = createOrderController(orderService);

router.use(authenticate);

router.get('/shipments', authorize({ roles: ['Super Admin', 'Admin'] }), orderController.listShipments);
router.post('/shipments/order/:orderId', authorize({ roles: ['Super Admin', 'Admin'] }), orderController.createShipment);
router.put('/shipments/:shipmentId/status', authorize({ roles: ['Super Admin', 'Admin'] }), orderController.updateShipmentStatus);

const normalizeTrackingStatus = (status?: string) => {
  const normalized = String(status || 'PENDING').toUpperCase();
  if (['DELIVERED'].includes(normalized)) return 'DELIVERED';
  if (['OUT_FOR_DELIVERY'].includes(normalized)) return 'OUT_FOR_DELIVERY';
  if (['IN_TRANSIT'].includes(normalized)) return 'IN_TRANSIT';
  if (['PENDING', 'CREATED'].includes(normalized)) return 'PREPARING';
  return 'IN_TRANSIT';
};

const buildTrackingTimeline = (shipment: any) => {
  const baseTime = shipment.dispatchDate || shipment.createdAt || new Date().toISOString();
  const trackingStatus = normalizeTrackingStatus(shipment.status);
  const timeline = [
    {
      id: 'booked',
      title: 'Shipment booked',
      description: 'Order packed and handed over to the courier network.',
      location: shipment.order?.shippingAddress?.city || 'Origin Hub',
      timestamp: baseTime
    },
    {
      id: 'in-transit',
      title: 'In transit',
      description: 'Package is moving through the destination network.',
      location: 'Regional Sorting Hub',
      timestamp: new Date(new Date(baseTime).getTime() + 60 * 60 * 1000).toISOString()
    },
    {
      id: 'out-for-delivery',
      title: 'Out for delivery',
      description: 'Courier has started the final-mile delivery attempt.',
      location: shipment.order?.shippingAddress?.city || 'Customer City',
      timestamp: new Date(new Date(baseTime).getTime() + 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'delivered',
      title: 'Delivered',
      description: 'Package delivered to the recipient.',
      location: shipment.order?.shippingAddress?.city || 'Customer City',
      timestamp: new Date(new Date(baseTime).getTime() + 36 * 60 * 60 * 1000).toISOString()
    }
  ];

  if (trackingStatus === 'PREPARING') return timeline.slice(0, 1);
  if (trackingStatus === 'IN_TRANSIT') return timeline.slice(0, 2);
  if (trackingStatus === 'OUT_FOR_DELIVERY') return timeline.slice(0, 3);
  if (trackingStatus === 'DELIVERED') return timeline;
  return timeline.slice(0, 2);
};

const buildTrackingDetail = (shipment: any) => ({
  trackingNumber: shipment.trackingNumber || shipment.shipmentNumber,
  carrier: shipment.carrierName || 'Courier Partner',
  orderNumber: shipment.order?.orderNumber || '',
  status: normalizeTrackingStatus(shipment.status),
  estimatedDelivery: shipment.estimatedDeliveryDate || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  origin: shipment.order?.shippingAddress?.city || 'Warehouse',
  destination: shipment.order?.shippingAddress?.city || 'Customer City',
  steps: buildTrackingTimeline(shipment)
});

router.get('/tracking', async (_req, res, next) => {
  try {
    const shipments = await orderService.listShipments();
    const tracking = (shipments || []).map(buildTrackingDetail);
    return apiResponse.success(res, tracking, 'Tracking details fetched');
  } catch (error) {
    next(error);
  }
});

router.get('/tracking/:trackingNumber', async (req, res, next) => {
  try {
    const trackingNumber = String(req.params.trackingNumber || '').trim();
    if (!trackingNumber) {
      return apiResponse.badRequest(res, null, 'Tracking number is required');
    }

    const shipments = await orderService.listShipments();
    const shipment = (shipments || []).find((entry: any) => String(entry.trackingNumber || entry.shipmentNumber) === trackingNumber);

    if (!shipment) {
      return apiResponse.notFound(res, null, 'Tracking details not found');
    }

    return apiResponse.success(res, buildTrackingDetail(shipment), 'Tracking detail fetched');
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /api/v1/shipping/shipping-methods:
 *   get:
 *     tags:
 *       - Shipping
 *     summary: List available shipping methods
 *     parameters:
 *       - in: query
 *         name: pincode
 *         schema:
 *           type: string
 *         description: Postal/zip code to check shipping method availability for
 *       - in: query
 *         name: cartId
 *         schema:
 *           type: string
 *         description: Cart ID to calculate shipping options for
 *     responses:
 *       200:
 *         description: List of shipping methods retrieved successfully
 *       400:
 *         description: Validation error
 */
router.get('/shipping-methods', shippingMethodListValidation, validate, controller.listMethods);

/**
 * @openapi
 * /api/v1/shipping/delivery-slots:
 *   get:
 *     tags:
 *       - Shipping
 *     summary: List available delivery slots
 *     parameters:
 *       - in: query
 *         name: pincode
 *         schema:
 *           type: string
 *         description: Postal/zip code to check delivery slot availability for
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Date to check available delivery slots for
 *     responses:
 *       200:
 *         description: List of delivery slots retrieved successfully
 *       400:
 *         description: Validation error
 */
router.get('/delivery-slots', deliverySlotListValidation, validate, controller.listDeliverySlots);

export default router;