import { Router } from 'express';
import multer from 'multer';
import createProductController from '../controllers/product.controller';
import ProductRepository from '../repositories/product.repository';
import ProductService from '../services/product.service';
import { PrismaClient } from '@prisma/client';
import authenticate from '../middlewares/authenticate';
import authorize from '../middlewares/authorize';
import validate from '../middlewares/validation.middleware';
import {
  bulkImportValidation,
  createProductValidation,
  duplicateProductValidation,
  exportValidation,
  productIdParam,
  productListValidation,
  relationIdParam,
  relationValidation,
  updateProductValidation,
  variantIdParam,
  variantValidation,
  workflowValidation,
  attributeIdParam,
  attributeValidation
} from '../validations/product.validation';

const router = Router();
const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const productController = createProductController(productService);
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.use(authenticate);

/**
 * @openapi
 * /api/v1/products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Create a new product
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - sku
 *             properties:
 *               name:
 *                 type: string
 *               sku:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.post(
  '/',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  createProductValidation,
  validate,
  productController.create
);

/**
 * @openapi
 * /api/v1/products/{id}:
 *   put:
 *     tags:
 *       - Products
 *     summary: Update a product
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Product not found
 */
router.put(
  '/:id',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  updateProductValidation,
  validate,
  productController.update
);

/**
 * @openapi
 * /api/v1/products/{id}:
 *   delete:
 *     tags:
 *       - Products
 *     summary: Delete a product
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Product not found
 */
router.delete(
  '/:id',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  productIdParam,
  validate,
  productController.delete
);

/**
 * @openapi
 * /api/v1/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: List products
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter products
 *     responses:
 *       200:
 *         description: List of products retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.get(
  '/',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  productListValidation,
  validate,
  productController.list
);

/**
 * @openapi
 * /api/v1/products/export:
 *   get:
 *     tags:
 *       - Products
 *     summary: Export products
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [csv, xlsx]
 *         description: Export file format
 *     responses:
 *       200:
 *         description: File stream
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.get(
  '/export',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  exportValidation,
  validate,
  productController.export
);

/**
 * @openapi
 * /api/v1/products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get a product by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Product not found
 */
router.get(
  '/:id',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  productIdParam,
  validate,
  productController.getById
);

/**
 * @openapi
 * /api/v1/products/{id}/variants:
 *   get:
 *     tags:
 *       - Products
 *     summary: List variants for a product
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: List of variants retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Product not found
 */
router.get(
  '/:id/variants',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  productIdParam,
  validate,
  productController.listVariants
);

/**
 * @openapi
 * /api/v1/products/{id}/variants:
 *   post:
 *     tags:
 *       - Products
 *     summary: Create a variant for a product
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sku
 *             properties:
 *               sku:
 *                 type: string
 *               price:
 *                 type: number
 *               options:
 *                 type: object
 *     responses:
 *       201:
 *         description: Variant created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Product not found
 */
router.post(
  '/:id/variants',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  productIdParam,
  variantValidation,
  validate,
  productController.createVariant
);

/**
 * @openapi
 * /api/v1/products/{id}/variants/{variantId}:
 *   put:
 *     tags:
 *       - Products
 *     summary: Update a product variant
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Variant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sku:
 *                 type: string
 *               price:
 *                 type: number
 *               options:
 *                 type: object
 *     responses:
 *       200:
 *         description: Variant updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Product or variant not found
 */
router.put(
  '/:id/variants/:variantId',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  productIdParam,
  variantIdParam,
  variantValidation,
  validate,
  productController.updateVariant
);

/**
 * @openapi
 * /api/v1/products/{id}/variants/{variantId}:
 *   delete:
 *     tags:
 *       - Products
 *     summary: Delete a product variant
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Variant ID
 *     responses:
 *       200:
 *         description: Variant deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Product or variant not found
 */
router.delete(
  '/:id/variants/:variantId',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  productIdParam,
  variantIdParam,
  validate,
  productController.deleteVariant
);

/**
 * @openapi
 * /api/v1/products/{id}/attributes:
 *   get:
 *     tags:
 *       - Products
 *     summary: List attributes for a product
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: List of attributes retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Product not found
 */
router.get(
  '/:id/attributes',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  productIdParam,
  validate,
  productController.listAttributes
);

/**
 * @openapi
 * /api/v1/products/{id}/attributes:
 *   post:
 *     tags:
 *       - Products
 *     summary: Create attributes for a product
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - value
 *             properties:
 *               name:
 *                 type: string
 *               value:
 *                 type: string
 *     responses:
 *       201:
 *         description: Attribute(s) created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Product not found
 */
router.post(
  '/:id/attributes',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  productIdParam,
  attributeValidation,
  validate,
  productController.createAttributes
);

/**
 * @openapi
 * /api/v1/products/{id}/attributes/{attributeId}:
 *   put:
 *     tags:
 *       - Products
 *     summary: Update a product attribute
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *       - in: path
 *         name: attributeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Attribute ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               value:
 *                 type: string
 *     responses:
 *       200:
 *         description: Attribute updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Product or attribute not found
 */
router.put(
  '/:id/attributes/:attributeId',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  productIdParam,
  attributeIdParam,
  attributeValidation,
  validate,
  productController.updateAttribute
);

/**
 * @openapi
 * /api/v1/products/{id}/attributes/{attributeId}:
 *   delete:
 *     tags:
 *       - Products
 *     summary: Delete a product attribute
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *       - in: path
 *         name: attributeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Attribute ID
 *     responses:
 *       200:
 *         description: Attribute deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Product or attribute not found
 */
router.delete(
  '/:id/attributes/:attributeId',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  productIdParam,
  attributeIdParam,
  validate,
  productController.deleteAttribute
);

/**
 * @openapi
 * /api/v1/products/{id}/relations:
 *   get:
 *     tags:
 *       - Products
 *     summary: List related products
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: List of relations retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Product not found
 */
router.get(
  '/:id/relations',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  productIdParam,
  validate,
  productController.listRelations
);

/**
 * @openapi
 * /api/v1/products/{id}/relations:
 *   post:
 *     tags:
 *       - Products
 *     summary: Create relations for a product
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - relatedProductIds
 *             properties:
 *               relatedProductIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               type:
 *                 type: string
 *                 description: Relation type (e.g. cross-sell, upsell, accessory)
 *     responses:
 *       201:
 *         description: Relation(s) created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Product not found
 */
router.post(
  '/:id/relations',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  productIdParam,
  relationValidation,
  validate,
  productController.createRelations
);

/**
 * @openapi
 * /api/v1/products/{id}/relations/{relationId}:
 *   delete:
 *     tags:
 *       - Products
 *     summary: Delete a product relation
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *       - in: path
 *         name: relationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Relation ID
 *     responses:
 *       200:
 *         description: Relation deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Product or relation not found
 */
router.delete(
  '/:id/relations/:relationId',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  productIdParam,
  relationIdParam,
  validate,
  productController.deleteRelation
);

/**
 * @openapi
 * /api/v1/products/{id}/workflow:
 *   patch:
 *     tags:
 *       - Products
 *     summary: Update a product's workflow state
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [draft, in_review, published, archived]
 *     responses:
 *       200:
 *         description: Product workflow updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Product not found
 */
router.patch(
  '/:id/workflow',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  workflowValidation,
  validate,
  productController.updateWorkflow
);

/**
 * @openapi
 * /api/v1/products/{id}/duplicate:
 *   post:
 *     tags:
 *       - Products
 *     summary: Duplicate a product
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Optional name for the duplicated product
 *     responses:
 *       201:
 *         description: Product duplicated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Product not found
 */
router.post(
  '/:id/duplicate',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  duplicateProductValidation,
  validate,
  productController.duplicate
);

/**
 * @openapi
 * /api/v1/products/bulk-import:
 *   post:
 *     tags:
 *       - Products
 *     summary: Bulk import products from a file
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV or XLSX file containing product data (max 10MB)
 *     responses:
 *       200:
 *         description: Bulk import processed successfully
 *       400:
 *         description: Validation error or malformed file
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.post(
  '/bulk-import',
  authorize({ roles: ['Super Admin', 'Admin'] }),
  upload.single('file'),
  bulkImportValidation,
  validate,
  productController.bulkImport
);

/**
 * @openapi
 * /api/v1/products/{id}/audit-logs:
 *   get:
 *     tags:
 *       - Products
 *     summary: List audit logs for a product
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: List of audit logs retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Product not found
 */
router.get(
  '/:id/audit-logs',
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  productIdParam,
  validate,
  productController.listAuditLogs
);

export default router;