import { Router } from 'express';
import createPaymentController from '../controllers/payment.controller';
import PaymentRepository from '../repositories/payment.repository';
import OrderRepository from '../repositories/order.repository';
import CustomerRepository from '../repositories/customer.repository';
import PaymentService from '../services/payment.service';
import authenticate from '../middlewares/authenticate';
import roleGuard from '../middlewares/roleGuard';
import validate from '../middlewares/validation.middleware';
import {
  capturePaymentValidation,
  createPaymentValidation,
  listPaymentsValidation,
  paymentIdParam,
  orderIdParam,
  refundPaymentValidation,
  retryPaymentValidation,
  verifyPaymentValidation,
  webhookProviderParam,
  settlementListValidation,
  reconciliationListValidation
} from '../validations/payment.validation';

const router = Router();
const repository = new PaymentRepository();
const service = new PaymentService(repository, new OrderRepository(), new CustomerRepository());
const controller = createPaymentController(service);

/**
 * @openapi
 * /api/v1/payments/webhook/{provider}:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Handle an incoming payment provider webhook
 *     description: Public endpoint called by external payment providers (e.g. Stripe, Razorpay) to notify of payment events. Not authenticated via BearerAuth; typically secured via provider signature verification.
 *     parameters:
 *       - in: path
 *         name: provider
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment provider identifier (e.g. stripe, razorpay, paypal)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Raw webhook payload, shape depends on provider
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *       400:
 *         description: Invalid payload or signature verification failed
 *       404:
 *         description: Unknown provider
 */
router.post('/webhook/:provider', webhookProviderParam, validate, controller.handleWebhook);

router.use(authenticate);

/**
 * @openapi
 * /api/v1/payments/create:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Create a new payment
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - amount
 *             properties:
 *               orderId:
 *                 type: string
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *               method:
 *                 type: string
 *                 description: Payment method (e.g. card, upi, netbanking, wallet)
 *     responses:
 *       201:
 *         description: Payment created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/create', createPaymentValidation, validate, controller.createPayment);

/**
 * @openapi
 * /api/v1/payments/verify:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Verify a payment
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentId
 *             properties:
 *               paymentId:
 *                 type: string
 *               signature:
 *                 type: string
 *               providerReferenceId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *       400:
 *         description: Validation error or verification failed
 *       401:
 *         description: Unauthorized
 */
router.post('/verify', verifyPaymentValidation, validate, controller.verifyPayment);

/**
 * @openapi
 * /api/v1/payments/capture:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Capture an authorized payment
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentId
 *             properties:
 *               paymentId:
 *                 type: string
 *               amount:
 *                 type: number
 *                 description: Amount to capture, defaults to full authorized amount if omitted
 *     responses:
 *       200:
 *         description: Payment captured successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment not found
 */
router.post('/capture', capturePaymentValidation, validate, controller.capturePayment);

/**
 * @openapi
 * /api/v1/payments/refund:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Refund a payment
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentId
 *               - amount
 *             properties:
 *               paymentId:
 *                 type: string
 *               amount:
 *                 type: number
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment refunded successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment not found
 */
router.post('/refund', refundPaymentValidation, validate, controller.refundPayment);

/**
 * @openapi
 * /api/v1/payments/retry:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Retry a failed payment
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentId
 *             properties:
 *               paymentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment retry initiated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment not found
 */
router.post('/retry', retryPaymentValidation, validate, controller.retryPayment);

/**
 * @openapi
 * /api/v1/payments:
 *   get:
 *     tags:
 *       - Payments
 *     summary: List payments
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by payment status
 *     responses:
 *       200:
 *         description: List of payments retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', listPaymentsValidation, validate, controller.listPayments);

/**
 * @openapi
 * /api/v1/payments/order/{orderId}:
 *   get:
 *     tags:
 *       - Payments
 *     summary: Get payment(s) by order ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Payment(s) for the order retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
router.get('/order/:orderId', orderIdParam, validate, controller.getByOrderId);

/**
 * @openapi
 * /api/v1/payments/settlements:
 *   get:
 *     tags:
 *       - Payments
 *     summary: List payment settlements
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter settlements from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter settlements up to this date
 *     responses:
 *       200:
 *         description: List of settlements retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.get(
  '/settlements',
  roleGuard(['Admin', 'Finance Manager', 'Super Admin']),
  settlementListValidation,
  validate,
  controller.listSettlements
);

/**
 * @openapi
 * /api/v1/payments/reconciliation:
 *   get:
 *     tags:
 *       - Payments
 *     summary: List payment reconciliation records
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter reconciliation records from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter reconciliation records up to this date
 *     responses:
 *       200:
 *         description: List of reconciliation records retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.get(
  '/reconciliation',
  roleGuard(['Admin', 'Finance Manager', 'Super Admin']),
  reconciliationListValidation,
  validate,
  controller.listReconciliations
);

/**
 * @openapi
 * /api/v1/payments/{id}:
 *   get:
 *     tags:
 *       - Payments
 *     summary: Get a payment by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment not found
 */
router.get('/:id', paymentIdParam, validate, controller.getPayment);

export default router;