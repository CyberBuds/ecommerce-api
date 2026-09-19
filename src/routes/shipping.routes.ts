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