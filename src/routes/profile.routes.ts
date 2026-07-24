import { Router } from 'express';
import { uploadProfileImage as uploadProfileImageCtrl } from '../controllers/profile.controller';
import authenticate from '../middlewares/authenticate';
import upload from '../middlewares/fileUpload.middleware';

const router = Router();

/**
 * @openapi
 * /api/v1/profile/profile-image:
 *   post:
 *     tags:
 *       - Profile
 *     summary: Upload or update the authenticated user's profile image
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile image uploaded successfully
 *       400:
 *         description: Validation error or invalid file
 *       401:
 *         description: Unauthorized
 */
router.post('/profile-image', authenticate, upload.single('image'), uploadProfileImageCtrl);

export default router;