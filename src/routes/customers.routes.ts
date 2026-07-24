import { Router } from 'express';
import authenticate from '../middlewares/authenticate';
import authorize from '../middlewares/authorize';
import validate from '../middlewares/validation.middleware';
import createCustomerController from '../controllers/customer.controller';
import CustomerRepository from '../repositories/customer.repository';
import CustomerService from '../services/customer.service';
import ProductRepository from '../repositories/product.repository';
import {
  createCustomerValidation,
  updateCustomerValidation,
  customerListValidation,
  customerProfileValidation,
  customerAddressValidation,
  createCustomerGroupValidation,
  updateCustomerGroupValidation,
  wishlistValidation,
  customerReviewValidation,
  walletTransactionValidation,
  loyaltyTransactionValidation,
  notificationValidation,
  customerNoteValidation,
  customerDocumentValidation,
  customerReviewListValidation,
  generalListValidation,
  customerIdParam,
  addressIdParam,
  groupIdParam,
  wishlistIdParam,
  reviewIdParam,
  noteIdParam,
  documentIdParam
} from '../validations/customer.validation';

const router = Router();
const repository = new CustomerRepository();
const service = new CustomerService(repository, new ProductRepository());
const controller = createCustomerController(service);

/**
 * @openapi
 * components:
 *   schemas:
 *     CustomerAddressInput:
 *       type: object
 *       required:
 *         - addressLine1
 *         - city
 *         - state
 *         - postalCode
 *         - country
 *       properties:
 *         label:
 *           type: string
 *           example: Home
 *         addressLine1:
 *           type: string
 *           example: 221B Baker Street
 *         addressLine2:
 *           type: string
 *           example: Near Central Park
 *         city:
 *           type: string
 *           example: Indore
 *         state:
 *           type: string
 *           example: Madhya Pradesh
 *         postalCode:
 *           type: string
 *           example: "452001"
 *         country:
 *           type: string
 *           example: India
 *         isDefault:
 *           type: boolean
 *           example: true
 *     CustomerGroupInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: VIP Customers
 *         description:
 *           type: string
 *           example: High-value repeat customers
 *         discountPercentage:
 *           type: number
 *           example: 10
 *     WishlistItemInput:
 *       type: object
 *       required:
 *         - productId
 *       properties:
 *         productId:
 *           type: integer
 *           example: 42
 *         variantId:
 *           type: integer
 *           example: 5
 *     CustomerReviewInput:
 *       type: object
 *       required:
 *         - productId
 *         - rating
 *       properties:
 *         productId:
 *           type: integer
 *           example: 42
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *         title:
 *           type: string
 *           example: Excellent quality
 *         comment:
 *           type: string
 *           example: The fabric quality exceeded my expectations.
 *     WalletTransactionInput:
 *       type: object
 *       required:
 *         - amount
 *         - type
 *       properties:
 *         amount:
 *           type: number
 *           example: 500
 *         type:
 *           type: string
 *           enum: [CREDIT, DEBIT]
 *           example: CREDIT
 *         reason:
 *           type: string
 *           example: Refund for order #1023
 *     LoyaltyTransactionInput:
 *       type: object
 *       required:
 *         - points
 *         - type
 *       properties:
 *         points:
 *           type: integer
 *           example: 100
 *         type:
 *           type: string
 *           enum: [EARNED, REDEEMED]
 *           example: EARNED
 *         reason:
 *           type: string
 *           example: Purchase reward points
 *     NotificationInput:
 *       type: object
 *       required:
 *         - title
 *         - message
 *       properties:
 *         title:
 *           type: string
 *           example: Order Shipped
 *         message:
 *           type: string
 *           example: Your order #1023 has been shipped.
 *         channel:
 *           type: string
 *           enum: [EMAIL, SMS, PUSH, IN_APP]
 *           example: EMAIL
 *     CustomerNoteInput:
 *       type: object
 *       required:
 *         - note
 *       properties:
 *         note:
 *           type: string
 *           example: Customer requested priority support for future orders.
 *     CustomerDocumentInput:
 *       type: object
 *       required:
 *         - documentType
 *         - url
 *       properties:
 *         documentType:
 *           type: string
 *           example: ID_PROOF
 *         url:
 *           type: string
 *           example: https://cdn.example.com/docs/id-proof-1.pdf
 *         notes:
 *           type: string
 *           example: Aadhaar card copy
 */

/**
 * @openapi
 * /api/v1/customers:
 *   post:
 *     tags:
 *       - Customers
 *     summary: Create a new customer
 *     description: Admin endpoint to create a new customer with personal details and contact information.
 *     operationId: createCustomer
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerCode
 *               - firstName
 *               - lastName
 *               - email
 *             properties:
 *               customerCode:
 *                 type: string
 *                 description: Unique customer code
 *                 example: CUST-001
 *               firstName:
 *                 type: string
 *                 description: Customer first name
 *                 example: Rajesh
 *               lastName:
 *                 type: string
 *                 description: Customer last name
 *                 example: Kumar
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Customer email address
 *                 example: rajesh@example.com
 *               mobile:
 *                 type: string
 *                 description: Customer mobile number
 *                 example: "+919876543210"
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE, OTHER]
 *                 description: Customer gender
 *                 example: MALE
 *               dateOfBirth:
 *                 type: string
 *                 format: date-time
 *                 description: Customer date of birth
 *                 example: "1990-05-15T00:00:00Z"
 *               anniversaryDate:
 *                 type: string
 *                 format: date-time
 *                 description: Customer anniversary date
 *                 example: "2015-06-20T00:00:00Z"
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE, SUSPENDED]
 *                 description: Customer account status
 *                 example: ACTIVE
 *               isEmailVerified:
 *                 type: boolean
 *                 description: Email verification status
 *                 example: true
 *               isMobileVerified:
 *                 type: boolean
 *                 description: Mobile verification status
 *                 example: true
 *     responses:
 *       201:
 *         description: Customer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: Customer created successfully
 *               data:
 *                 id: 1
 *                 customerCode: CUST-001
 *                 firstName: Rajesh
 *                 lastName: Kumar
 *                 email: rajesh@example.com
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', authenticate, authorize({ roles: ['Super Admin', 'Admin'] }), createCustomerValidation, validate, controller.create);

/**
 * @openapi
 * /api/v1/customers:
 *   get:
 *     tags:
 *       - Customers
 *     summary: List all customers
 *     description: Retrieve paginated list of customers with filtering and sorting options.
 *     operationId: listCustomers
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of records per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, SUSPENDED]
 *         description: Filter by customer status
 *       - in: query
 *         name: isEmailVerified
 *         schema:
 *           type: boolean
 *         description: Filter by email verification status
 *       - in: query
 *         name: isMobileVerified
 *         schema:
 *           type: boolean
 *         description: Filter by mobile verification status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           example: firstName
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Customers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           customerCode:
 *                             type: string
 *                           firstName:
 *                             type: string
 *                           lastName:
 *                             type: string
 *                           email:
 *                             type: string
 *                           status:
 *                             type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', authenticate, authorize({ roles: ['Super Admin', 'Admin'] }), customerListValidation, validate, controller.list);

/**
 * @openapi
 * /api/v1/customers/profile:
 *   get:
 *     tags:
 *       - Customers
 *     summary: Get customer profile
 *     description: Retrieve current authenticated customer's profile information.
 *     operationId: getCustomerProfile
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Customer profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: Customer profile retrieved
 *               data:
 *                 id: 1
 *                 customerCode: CUST-001
 *                 firstName: Rajesh
 *                 lastName: Kumar
 *                 email: rajesh@example.com
 *                 mobile: "+919876543210"
 *                 status: ACTIVE
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/profile', authenticate, authorize({ roles: ['Customer', 'Admin', 'Super Admin'] }), controller.getProfile);

/**
 * @openapi
 * /api/v1/customers/profile:
 *   put:
 *     tags:
 *       - Customers
 *     summary: Update customer profile
 *     description: Update authenticated customer's profile information including personal details.
 *     operationId: updateCustomerProfile
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               mobile:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE, OTHER]
 *               dateOfBirth:
 *                 type: string
 *                 format: date-time
 *               anniversaryDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
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
router.put('/profile', authenticate, authorize({ roles: ['Customer', 'Admin', 'Super Admin'] }), customerProfileValidation, validate, controller.updateProfile);

/**
 * @openapi
 * /api/v1/customers/{id}:
 *   get:
 *     tags:
 *       - Customers
 *     summary: Get customer by ID
 *     description: Retrieve a single customer by their numeric ID. Requires Super Admin or Admin role.
 *     operationId: getCustomerById
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', authenticate, authorize({ roles: ['Super Admin', 'Admin'] }), customerIdParam, validate, controller.getById);

/**
 * @openapi
 * /api/v1/customers/{id}:
 *   put:
 *     tags:
 *       - Customers
 *     summary: Update a customer
 *     description: Update an existing customer's details. Requires Super Admin or Admin role.
 *     operationId: updateCustomer
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Rajesh
 *               lastName:
 *                 type: string
 *                 example: Kumar
 *               email:
 *                 type: string
 *                 format: email
 *                 example: rajesh@example.com
 *               mobile:
 *                 type: string
 *                 example: "+919876543210"
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE, OTHER]
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE, SUSPENDED]
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
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
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', authenticate, authorize({ roles: ['Super Admin', 'Admin'] }), updateCustomerValidation, validate, controller.update);

/**
 * @openapi
 * /api/v1/customers/{id}:
 *   delete:
 *     tags:
 *       - Customers
 *     summary: Delete a customer
 *     description: Permanently delete a customer. Requires Super Admin or Admin role.
 *     operationId: deleteCustomer
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', authenticate, authorize({ roles: ['Super Admin', 'Admin'] }), customerIdParam, validate, controller.delete);

/**
 * @openapi
 * /api/v1/customers/{id}/addresses:
 *   post:
 *     tags:
 *       - Customer Addresses
 *     summary: Add a customer address
 *     description: Create a new address for the specified customer. Accessible to Super Admin, Admin, or the Customer themselves.
 *     operationId: createCustomerAddress
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerAddressInput'
 *     responses:
 *       201:
 *         description: Address created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
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
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/:id/addresses', authenticate, authorize({ roles: ['Super Admin', 'Admin', 'Customer'] }), customerIdParam, customerAddressValidation, validate, controller.createAddress);

/**
 * @openapi
 * /api/v1/customers/{id}/addresses/{addressId}:
 *   put:
 *     tags:
 *       - Customer Addresses
 *     summary: Update a customer address
 *     description: Update an existing address for the specified customer. Requires Super Admin or Admin role.
 *     operationId: updateCustomerAddress
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *       - name: addressId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Address ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerAddressInput'
 *     responses:
 *       200:
 *         description: Address updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
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
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Address not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id/addresses/:addressId', authenticate, authorize({ roles: ['Super Admin', 'Admin'] }), addressIdParam, customerAddressValidation, validate, controller.updateAddress);

/**
 * @openapi
 * /api/v1/customers/{id}/addresses/{addressId}:
 *   delete:
 *     tags:
 *       - Customer Addresses
 *     summary: Delete a customer address
 *     description: Permanently delete a customer address. Requires Super Admin or Admin role.
 *     operationId: deleteCustomerAddress
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *       - name: addressId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Address not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id/addresses/:addressId', authenticate, authorize({ roles: ['Super Admin', 'Admin'] }), addressIdParam, validate, controller.deleteAddress);

/**
 * @openapi
 * /api/v1/customers/{id}/addresses:
 *   get:
 *     tags:
 *       - Customer Addresses
 *     summary: List customer addresses
 *     description: Retrieve all addresses for the specified customer. Accessible to Super Admin, Admin, or the Customer themselves.
 *     operationId: listCustomerAddresses
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Addresses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id/addresses', authenticate, authorize({ roles: ['Super Admin', 'Admin', 'Customer'] }), customerIdParam, validate, controller.listAddresses);

/**
 * @openapi
 * /api/v1/customers/groups:
 *   post:
 *     tags:
 *       - Customer Groups
 *     summary: Create a customer group
 *     description: Create a new customer group. Requires Super Admin or Admin role.
 *     operationId: createCustomerGroup
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerGroupInput'
 *     responses:
 *       201:
 *         description: Customer group created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
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
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/groups', authenticate, authorize({ roles: ['Super Admin', 'Admin'] }), createCustomerGroupValidation, validate, controller.createGroup);

/**
 * @openapi
 * /api/v1/customers/groups:
 *   get:
 *     tags:
 *       - Customer Groups
 *     summary: List customer groups
 *     description: Retrieve customer groups with pagination and filtering. Requires Super Admin, Admin, or Inventory Manager role.
 *     operationId: listCustomerGroups
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer groups retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/groups', authenticate, authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }), generalListValidation, validate, controller.listGroups);

/**
 * @openapi
 * /api/v1/customers/groups/{groupId}:
 *   put:
 *     tags:
 *       - Customer Groups
 *     summary: Update a customer group
 *     description: Update an existing customer group. Requires Super Admin or Admin role.
 *     operationId: updateCustomerGroup
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer group ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerGroupInput'
 *     responses:
 *       200:
 *         description: Customer group updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
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
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Customer group not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/groups/:groupId', authenticate, authorize({ roles: ['Super Admin', 'Admin'] }), updateCustomerGroupValidation, validate, controller.updateGroup);

/**
 * @openapi
 * /api/v1/customers/groups/{groupId}:
 *   delete:
 *     tags:
 *       - Customer Groups
 *     summary: Delete a customer group
 *     description: Permanently delete a customer group. Requires Super Admin or Admin role.
 *     operationId: deleteCustomerGroup
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer group ID
 *     responses:
 *       200:
 *         description: Customer group deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Customer group not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/groups/:groupId', authenticate, authorize({ roles: ['Super Admin', 'Admin'] }), groupIdParam, validate, controller.deleteGroup);

/**
 * @openapi
 * /api/v1/customers/{id}/wishlist:
 *   post:
 *     tags:
 *       - Customer Wishlist
 *     summary: Add item to wishlist
 *     description: Add a product to the specified customer's wishlist. Accessible to the Customer, Admin, or Super Admin.
 *     operationId: addWishlistItem
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WishlistItemInput'
 *     responses:
 *       201:
 *         description: Wishlist item added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
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
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/:id/wishlist', authenticate, authorize({ roles: ['Customer', 'Admin', 'Super Admin'] }), customerIdParam, wishlistValidation, validate, controller.addWishlistItem);

/**
 * @openapi
 * /api/v1/customers/{id}/wishlist:
 *   get:
 *     tags:
 *       - Customer Wishlist
 *     summary: List wishlist items
 *     description: Retrieve all wishlist items for the specified customer. Accessible to the Customer, Admin, or Super Admin.
 *     operationId: listWishlist
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Wishlist retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id/wishlist', authenticate, authorize({ roles: ['Customer', 'Admin', 'Super Admin'] }), customerIdParam, validate, controller.listWishlist);

/**
 * @openapi
 * /api/v1/customers/{id}/wishlist/{wishlistId}:
 *   delete:
 *     tags:
 *       - Customer Wishlist
 *     summary: Remove item from wishlist
 *     description: Remove an item from the specified customer's wishlist. Accessible to the Customer, Admin, or Super Admin.
 *     operationId: removeWishlistItem
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *       - name: wishlistId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Wishlist item ID
 *     responses:
 *       200:
 *         description: Wishlist item removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Wishlist item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id/wishlist/:wishlistId', authenticate, authorize({ roles: ['Customer', 'Admin', 'Super Admin'] }), wishlistIdParam, validate, controller.removeWishlistItem);

/**
 * @openapi
 * /api/v1/customers/{id}/reviews:
 *   post:
 *     tags:
 *       - Customer Reviews
 *     summary: Create a customer review
 *     description: Create a new product review for the specified customer. Accessible to the Customer, Admin, or Super Admin.
 *     operationId: createCustomerReview
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerReviewInput'
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
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
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/:id/reviews', authenticate, authorize({ roles: ['Customer', 'Admin', 'Super Admin'] }), customerIdParam, customerReviewValidation, validate, controller.createReview);

/**
 * @openapi
 * /api/v1/customers/{id}/reviews/{reviewId}:
 *   put:
 *     tags:
 *       - Customer Reviews
 *     summary: Update a customer review
 *     description: Update an existing product review. Accessible to the Customer, Admin, or Super Admin.
 *     operationId: updateCustomerReview
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *       - name: reviewId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerReviewInput'
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
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
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Review not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id/reviews/:reviewId', authenticate, authorize({ roles: ['Customer', 'Admin', 'Super Admin'] }), reviewIdParam, customerReviewValidation, validate, controller.updateReview);

/**
 * @openapi
 * /api/v1/customers/{id}/reviews/{reviewId}:
 *   delete:
 *     tags:
 *       - Customer Reviews
 *     summary: Delete a customer review
 *     description: Permanently delete a product review. Accessible to the Customer, Admin, or Super Admin.
 *     operationId: deleteCustomerReview
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *       - name: reviewId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Review not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id/reviews/:reviewId', authenticate, authorize({ roles: ['Customer', 'Admin', 'Super Admin'] }), reviewIdParam, validate, controller.deleteReview);

/**
 * @openapi
 * /api/v1/customers/{id}/reviews:
 *   get:
 *     tags:
 *       - Customer Reviews
 *     summary: List customer reviews
 *     description: Retrieve reviews for the specified customer with pagination and filtering. Accessible to the Customer, Admin, or Super Admin.
 *     operationId: listCustomerReviews
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - name: rating
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id/reviews', authenticate, authorize({ roles: ['Customer', 'Admin', 'Super Admin'] }), customerReviewListValidation, validate, controller.listReviews);

/**
 * @openapi
 * /api/v1/customers/{id}/wallet-transactions:
 *   post:
 *     tags:
 *       - Customer Wallet
 *     summary: Create a wallet transaction
 *     description: Create a new wallet credit or debit transaction for the specified customer. Accessible to the Customer, Admin, or Super Admin.
 *     operationId: createWalletTransaction
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WalletTransactionInput'
 *     responses:
 *       201:
 *         description: Wallet transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
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
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/:id/wallet-transactions', authenticate, authorize({ roles: ['Customer', 'Admin', 'Super Admin'] }), customerIdParam, walletTransactionValidation, validate, controller.createWalletTransaction);

/**
 * @openapi
 * /api/v1/customers/{id}/wallet-transactions:
 *   get:
 *     tags:
 *       - Customer Wallet
 *     summary: List wallet transactions
 *     description: Retrieve wallet transactions for the specified customer with pagination. Accessible to the Customer, Admin, or Super Admin.
 *     operationId: listWalletTransactions
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *     responses:
 *       200:
 *         description: Wallet transactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id/wallet-transactions', authenticate, authorize({ roles: ['Customer', 'Admin', 'Super Admin'] }), customerIdParam, generalListValidation, validate, controller.listWalletTransactions);

/**
 * @openapi
 * /api/v1/customers/{id}/loyalty-transactions:
 *   post:
 *     tags:
 *       - Customer Loyalty
 *     summary: Create a loyalty transaction
 *     description: Create a new loyalty points transaction for the specified customer. Accessible to the Customer, Admin, or Super Admin.
 *     operationId: createLoyaltyTransaction
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoyaltyTransactionInput'
 *     responses:
 *       201:
 *         description: Loyalty transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
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
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/:id/loyalty-transactions', authenticate, authorize({ roles: ['Customer', 'Admin', 'Super Admin'] }), customerIdParam, loyaltyTransactionValidation, validate, controller.createLoyaltyTransaction);

/**
 * @openapi
 * /api/v1/customers/{id}/loyalty-transactions:
 *   get:
 *     tags:
 *       - Customer Loyalty
 *     summary: List loyalty transactions
 *     description: Retrieve loyalty point transactions for the specified customer with pagination. Accessible to the Customer, Admin, or Super Admin.
 *     operationId: listLoyaltyTransactions
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *     responses:
 *       200:
 *         description: Loyalty transactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id/loyalty-transactions', authenticate, authorize({ roles: ['Customer', 'Admin', 'Super Admin'] }), customerIdParam, generalListValidation, validate, controller.listLoyaltyTransactions);

/**
 * @openapi
 * /api/v1/customers/{id}/notifications:
 *   post:
 *     tags:
 *       - Customer Notifications
 *     summary: Create a customer notification
 *     description: Send a new notification to the specified customer. Requires Admin or Super Admin role.
 *     operationId: createCustomerNotification
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotificationInput'
 *     responses:
 *       201:
 *         description: Notification created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
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
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/:id/notifications', authenticate, authorize({ roles: ['Admin', 'Super Admin'] }), customerIdParam, notificationValidation, validate, controller.createNotification);

/**
 * @openapi
 * /api/v1/customers/{id}/notifications:
 *   get:
 *     tags:
 *       - Customer Notifications
 *     summary: List customer notifications
 *     description: Retrieve notifications for the specified customer with pagination. Accessible to the Customer, Admin, or Super Admin.
 *     operationId: listCustomerNotifications
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id/notifications', authenticate, authorize({ roles: ['Customer', 'Admin', 'Super Admin'] }), customerIdParam, generalListValidation, validate, controller.listNotifications);

/**
 * @openapi
 * /api/v1/customers/{id}/notes:
 *   post:
 *     tags:
 *       - Customer Notes
 *     summary: Create a customer note
 *     description: Add an internal note to the specified customer's record. Requires Admin or Super Admin role.
 *     operationId: createCustomerNote
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerNoteInput'
 *     responses:
 *       201:
 *         description: Note created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
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
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/:id/notes', authenticate, authorize({ roles: ['Admin', 'Super Admin'] }), customerIdParam, customerNoteValidation, validate, controller.createNote);

/**
 * @openapi
 * /api/v1/customers/{id}/notes/{noteId}:
 *   put:
 *     tags:
 *       - Customer Notes
 *     summary: Update a customer note
 *     description: Update an existing internal note on the specified customer's record. Requires Admin or Super Admin role.
 *     operationId: updateCustomerNote
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *       - name: noteId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Note ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerNoteInput'
 *     responses:
 *       200:
 *         description: Note updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
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
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Note not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id/notes/:noteId', authenticate, authorize({ roles: ['Admin', 'Super Admin'] }), noteIdParam, customerNoteValidation, validate, controller.updateNote);

/**
 * @openapi
 * /api/v1/customers/{id}/notes/{noteId}:
 *   delete:
 *     tags:
 *       - Customer Notes
 *     summary: Delete a customer note
 *     description: Permanently delete an internal note from the specified customer's record. Requires Admin or Super Admin role.
 *     operationId: deleteCustomerNote
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *       - name: noteId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Note not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id/notes/:noteId', authenticate, authorize({ roles: ['Admin', 'Super Admin'] }), noteIdParam, validate, controller.deleteNote);

/**
 * @openapi
 * /api/v1/customers/{id}/notes:
 *   get:
 *     tags:
 *       - Customer Notes
 *     summary: List customer notes
 *     description: Retrieve internal notes for the specified customer with pagination. Requires Admin or Super Admin role.
 *     operationId: listCustomerNotes
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *     responses:
 *       200:
 *         description: Notes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id/notes', authenticate, authorize({ roles: ['Admin', 'Super Admin'] }), customerIdParam, generalListValidation, validate, controller.listNotes);

/**
 * @openapi
 * /api/v1/customers/{id}/documents:
 *   post:
 *     tags:
 *       - Customer Documents
 *     summary: Upload a customer document
 *     description: Attach a new document (e.g. ID proof) to the specified customer's record. Requires Admin or Super Admin role.
 *     operationId: createCustomerDocument
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerDocumentInput'
 *     responses:
 *       201:
 *         description: Document created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
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
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/:id/documents', authenticate, authorize({ roles: ['Admin', 'Super Admin'] }), customerIdParam, customerDocumentValidation, validate, controller.createDocument);

/**
 * @openapi
 * /api/v1/customers/{id}/documents:
 *   get:
 *     tags:
 *       - Customer Documents
 *     summary: List customer documents
 *     description: Retrieve documents for the specified customer with pagination. Requires Admin or Super Admin role.
 *     operationId: listCustomerDocuments
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *     responses:
 *       200:
 *         description: Documents retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id/documents', authenticate, authorize({ roles: ['Admin', 'Super Admin'] }), customerIdParam, generalListValidation, validate, controller.listDocuments);

/**
 * @openapi
 * /api/v1/customers/{id}/documents/{documentId}:
 *   delete:
 *     tags:
 *       - Customer Documents
 *     summary: Delete a customer document
 *     description: Permanently delete a document from the specified customer's record. Requires Admin or Super Admin role.
 *     operationId: deleteCustomerDocument
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *       - name: documentId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Document ID
 *     responses:
 *       200:
 *         description: Document deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Document not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id/documents/:documentId', authenticate, authorize({ roles: ['Admin', 'Super Admin'] }), documentIdParam, validate, controller.deleteDocument);

/**
 * @openapi
 * /api/v1/customers/{id}/activities:
 *   get:
 *     tags:
 *       - Customer Activity
 *     summary: List customer activity logs
 *     description: Retrieve the activity log history for the specified customer with pagination. Requires Admin or Super Admin role.
 *     operationId: listCustomerActivityLogs
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *     responses:
 *       200:
 *         description: Activity logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id/activities', authenticate, authorize({ roles: ['Admin', 'Super Admin'] }), customerIdParam, generalListValidation, validate, controller.listActivityLogs);

export default router;