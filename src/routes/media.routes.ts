import { Router } from 'express';
import authenticate from '../middlewares/authenticate';
import authorize from '../middlewares/authorize';
import validate from '../middlewares/validation.middleware';
import mediaUpload from '../middlewares/mediaUpload.middleware';
import MediaRepository from '../repositories/media.repository';
import MediaService from '../services/media.service';
import { createMediaController } from '../controllers/media.controller';
import { mediaIdParam, mediaListValidation, mediaUploadValidation } from '../validations/media.validation';

const repository = new MediaRepository();
const service = new MediaService(repository);
const controller = createMediaController(service);
const router = Router();

/**
 * @openapi
 * /api/v1/media/upload:
 *   post:
 *     tags:
 *       - Media
 *     summary: Upload a single file (image)
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
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.post(
  '/upload',
  authenticate,
  authorize({ roles: ['Super Admin', 'Admin'] }),
  mediaUpload.single('file'),
  mediaUploadValidation,
  validate,
  controller.upload
);

/**
 * @openapi
 * /api/v1/media/upload-multiple:
 *   post:
 *     tags:
 *       - Media
 *     summary: Upload multiple files (up to 10)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - files
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 10
 *     responses:
 *       201:
 *         description: Files uploaded successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.post(
  '/upload-multiple',
  authenticate,
  authorize({ roles: ['Super Admin', 'Admin'] }),
  mediaUpload.array('files', 10),
  mediaUploadValidation,
  validate,
  controller.uploadMultiple
);

/**
 * @openapi
 * /api/v1/media/upload-document:
 *   post:
 *     tags:
 *       - Media
 *     summary: Upload a document file
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
 *     responses:
 *       201:
 *         description: Document uploaded successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.post(
  '/upload-document',
  authenticate,
  authorize({ roles: ['Super Admin', 'Admin'] }),
  mediaUpload.single('file'),
  mediaUploadValidation,
  validate,
  controller.uploadDocument
);

/**
 * @openapi
 * /api/v1/media/upload-video:
 *   post:
 *     tags:
 *       - Media
 *     summary: Upload a video file
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
 *     responses:
 *       201:
 *         description: Video uploaded successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.post(
  '/upload-video',
  authenticate,
  authorize({ roles: ['Super Admin', 'Admin'] }),
  mediaUpload.single('file'),
  mediaUploadValidation,
  validate,
  controller.uploadVideo
);

/**
 * @openapi
 * /api/v1/media:
 *   get:
 *     tags:
 *       - Media
 *     summary: List media items
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
 *     responses:
 *       200:
 *         description: List of media items retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.get(
  '/',
  authenticate,
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  ...mediaListValidation,
  validate,
  controller.list
);

/**
 * @openapi
 * /api/v1/media/{id}:
 *   get:
 *     tags:
 *       - Media
 *     summary: Get a media item by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Media ID
 *     responses:
 *       200:
 *         description: Media item retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Media not found
 */
router.get(
  '/:id',
  authenticate,
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  ...mediaIdParam,
  validate,
  controller.getById
);

/**
 * @openapi
 * /api/v1/media/{id}:
 *   delete:
 *     tags:
 *       - Media
 *     summary: Delete a media item (soft delete)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Media ID
 *     responses:
 *       200:
 *         description: Media item deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Media not found
 */
router.delete(
  '/:id',
  authenticate,
  authorize({ roles: ['Super Admin', 'Admin'] }),
  ...mediaIdParam,
  validate,
  controller.delete
);

/**
 * @openapi
 * /api/v1/media/{id}/restore:
 *   patch:
 *     tags:
 *       - Media
 *     summary: Restore a soft-deleted media item
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Media ID
 *     responses:
 *       200:
 *         description: Media item restored successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Media not found
 */
router.patch(
  '/:id/restore',
  authenticate,
  authorize({ roles: ['Super Admin', 'Admin'] }),
  ...mediaIdParam,
  validate,
  controller.restore
);

/**
 * @openapi
 * /api/v1/media/download/{id}:
 *   get:
 *     tags:
 *       - Media
 *     summary: Download a media file by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Media ID
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
 *       404:
 *         description: Media not found
 */
router.get(
  '/download/:id',
  authenticate,
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  ...mediaIdParam,
  validate,
  controller.download
);

/**
 * @openapi
 * /api/v1/media/{id}/usage:
 *   get:
 *     tags:
 *       - Media
 *     summary: Track usage of a media item
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Media ID
 *     responses:
 *       200:
 *         description: Usage information retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Media not found
 */
router.get(
  '/:id/usage',
  authenticate,
  authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
  ...mediaIdParam,
  validate,
  controller.trackUsage
);

export default router;