import { Router } from 'express';
import createCartController from '../controllers/cart.controller';
import CartRepository from '../repositories/cart.repository';
import CartService from '../services/cart.service';
import ProductRepository from '../repositories/product.repository';
import InventoryRepository from '../repositories/inventory.repository';
import CustomerRepository from '../repositories/customer.repository';
import ShippingService from '../services/shipping.service';
import optionalAuthenticate from '../middlewares/optionalAuthenticate';
import validate from '../middlewares/validation.middleware';
import {
  applyCouponValidation,
  checkoutValidation,
  createCartItemValidation,
  restoreCartValidation,
  saveCartValidation,
  updateCartItemValidation
} from '../validations/cart.validation';

const router = Router();
const cartRepository = new CartRepository();
const cartService = new CartService(cartRepository, new ProductRepository(), new InventoryRepository(), new CustomerRepository());
const shippingService = new ShippingService(cartRepository);
const controller = createCartController(cartService, shippingService);

router.use(optionalAuthenticate);

/**
 * @openapi
 * /api/v1/cart:
 *   get:
 *     tags:
 *       - Cart
 *     summary: Get shopping cart
 *     description: Retrieve the current user's shopping cart or a guest cart by session ID.
 *     operationId: getCart
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 customerId: 5
 *                 sessionId: null
 *                 items:
 *                   - id: 10
 *                     productId: 101
 *                     variantId: null
 *                     quantity: 2
 *                     price: 500
 *                 subtotal: 1000
 *                 discount: 0
 *                 tax: 100
 *                 total: 1100
 *               meta: null
 *               message: Cart retrieved
 *               errors: null
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', controller.getCart);

/**
 * @openapi
 * /api/v1/cart:
 *   post:
 *     tags:
 *       - Cart
 *     summary: Add item to cart
 *     description: Add a product or product variant to the shopping cart.
 *     operationId: addItemToCart
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: Product ID (required)
 *                 example: 101
 *               variantId:
 *                 type: integer
 *                 description: Product variant ID (optional)
 *                 example: 50
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 description: Quantity to add (minimum 1)
 *                 example: 2
 *             required:
 *               - productId
 *               - quantity
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               data:
 *                 cartItemId: 10
 *                 productId: 101
 *                 quantity: 2
 *                 price: 500
 *               meta: null
 *               message: Item added to cart
 *               errors: null
 *       400:
 *         description: Invalid product ID, variant ID, or quantity
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', createCartItemValidation, validate, controller.addItem);

/**
 * @openapi
 * /api/v1/cart/items/{id}:
 *   put:
 *     tags:
 *       - Cart
 *     summary: Update cart item quantity
 *     description: Update the quantity of an item in the shopping cart.
 *     operationId: updateCartItem
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cart item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 description: New quantity (minimum 1)
 *                 example: 3
 *             required:
 *               - quantity
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               data:
 *                 cartItemId: 10
 *                 quantity: 3
 *                 price: 500
 *               meta: null
 *               message: Item quantity updated
 *               errors: null
 *       400:
 *         description: Invalid cart item ID or quantity
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Cart item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/items/:id', updateCartItemValidation, validate, controller.updateItem);

/**
 * @openapi
 * /api/v1/cart/items/{id}:
 *   delete:
 *     tags:
 *       - Cart
 *     summary: Remove item from cart
 *     description: Remove a specific item from the shopping cart.
 *     operationId: removeCartItem
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cart item ID
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               data: null
 *               meta: null
 *               message: Item removed from cart
 *               errors: null
 *       404:
 *         description: Cart item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/items/:id', controller.removeItem);

/**
 * @openapi
 * /api/v1/cart/save:
 *   post:
 *     tags:
 *       - Cart
 *     summary: Save cart
 *     description: Save the current cart for later retrieval. Optionally specify a name.
 *     operationId: saveCart
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Friendly name for the saved cart
 *                 example: My Wishlist
 *     responses:
 *       200:
 *         description: Cart saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               data:
 *                 savedCartId: 5
 *                 name: My Wishlist
 *                 itemCount: 3
 *               meta: null
 *               message: Cart saved successfully
 *               errors: null
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/save', saveCartValidation, validate, controller.saveCart);

/**
 * @openapi
 * /api/v1/cart/restore:
 *   post:
 *     tags:
 *       - Cart
 *     summary: Restore saved cart
 *     description: Restore a previously saved cart by its ID.
 *     operationId: restoreCart
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               savedCartId:
 *                 type: integer
 *                 description: Saved cart ID to restore
 *                 example: 5
 *             required:
 *               - savedCartId
 *     responses:
 *       200:
 *         description: Cart restored successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               data:
 *                 cartId: 1
 *                 items:
 *                   - id: 10
 *                     productId: 101
 *                     quantity: 2
 *               meta: null
 *               message: Cart restored
 *               errors: null
 *       400:
 *         description: Invalid saved cart ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Saved cart not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/restore', restoreCartValidation, validate, controller.restoreCart);

/**
 * @openapi
 * /api/v1/cart/apply-coupon:
 *   post:
 *     tags:
 *       - Cart
 *     summary: Apply coupon code
 *     description: Apply a promotional coupon code to the shopping cart.
 *     operationId: applyCoupon
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               couponCode:
 *                 type: string
 *                 description: Coupon code to apply
 *                 example: SAVE10
 *             required:
 *               - couponCode
 *     responses:
 *       200:
 *         description: Coupon applied successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               data:
 *                 couponCode: SAVE10
 *                 discount: 100
 *                 discountType: percentage
 *                 discountValue: 10
 *               meta: null
 *               message: Coupon applied
 *               errors: null
 *       400:
 *         description: Invalid coupon code or coupon validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Coupon not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/apply-coupon', applyCouponValidation, validate, controller.applyCoupon);

/**
 * @openapi
 * /api/v1/cart/remove-coupon:
 *   delete:
 *     tags:
 *       - Cart
 *     summary: Remove applied coupon
 *     description: Remove a promotional coupon code from the shopping cart.
 *     operationId: removeCoupon
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Coupon removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               data: null
 *               meta: null
 *               message: Coupon removed
 *               errors: null
 *       400:
 *         description: No coupon applied to cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/remove-coupon', controller.removeCoupon);

/**
 * @openapi
 * /api/v1/cart/shipping:
 *   get:
 *     tags:
 *       - Cart
 *     summary: Estimate shipping cost
 *     description: Calculate estimated shipping cost for items in the cart.
 *     operationId: estimateShipping
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Shipping estimate calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               data:
 *                 shippingCost: 50
 *                 deliveryDate: "2024-01-15"
 *                 estimatedDays: 3
 *               meta: null
 *               message: Shipping estimated
 *               errors: null
 *       400:
 *         description: Cart is empty or missing required shipping information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/shipping', controller.estimateShipping);

/**
 * @openapi
 * /api/v1/cart/checkout:
 *   post:
 *     tags:
 *       - Cart
 *     summary: Proceed to checkout
 *     description: Process checkout and create an order from the current cart.
 *     operationId: checkout
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shippingMethodId:
 *                 type: integer
 *                 description: Selected shipping method ID
 *                 example: 3
 *               deliverySlotId:
 *                 type: integer
 *                 description: Selected delivery slot ID
 *                 example: 2
 *               billingAddressId:
 *                 type: integer
 *                 description: Billing address ID
 *                 example: 1
 *               shippingAddressId:
 *                 type: integer
 *                 description: Shipping address ID
 *                 example: 1
 *               couponCode:
 *                 type: string
 *                 description: Optional coupon code
 *                 example: SAVE10
 *               paymentMethod:
 *                 type: string
 *                 enum: [credit_card, debit_card, upi, net_banking, cod, wallet]
 *                 description: Payment method (required)
 *                 example: upi
 *             required:
 *               - paymentMethod
 *     responses:
 *       200:
 *         description: Checkout successful and order created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               data:
 *                 orderId: 1001
 *                 orderNumber: ORD-2024-001001
 *                 total: 1100
 *                 paymentMethod: upi
 *                 status: pending
 *               meta: null
 *               message: Order created successfully
 *               errors: null
 *       400:
 *         description: Invalid checkout data or empty cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/checkout', checkoutValidation, validate, controller.checkout);

export default router;
